import {inject, injectable} from "inversify"
import {ManageStorageData} from "../storage/manage.storage.data"
import {FindBrowserInfo} from "../browserinfo/find.browser.info"
import {ManageConversionInfo} from "../conversion/manage.conversion.info"
import {BrowserInfoDto} from "../dtos"
import PAGE_ACTIVITY_TYPE from "../enums/page.activity.type"
import {SendHttpRequest} from "../sendhttprequest/send.http.request"
import {findApiKeyHeader, formatDate} from "../util"

@injectable()
export class LoadEventDetail {
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData
  @inject('FindBrowserInfo') private findBrowserInfo!: FindBrowserInfo
  @inject('SendHttpRequest') private sendHttpRequest!: SendHttpRequest
  @inject('ManageConversionInfo') private manageConversionInfo!: ManageConversionInfo

  async onLoad(currentUrl: string) {

    console.log('onLoad - 0', currentUrl)

    await this.manageStorageData.setCurrentUrl(currentUrl)

    this.manageStorageData.setBrowserId(window.location.hostname)
    const infoDto: BrowserInfoDto = await this.findBrowserInfo.findInfo()
    const currentDate = new Date()

    console.log('onLoad - 1', currentUrl)

    this.manageStorageData.setBrowserInfo(infoDto)
    this.manageStorageData.setPageStartDtm(currentDate)

    console.log('onLoad - 2', currentUrl)

    const incompleteLogInfo = this.manageStorageData.findIncompleteLogInfo()

    console.log('onLoad - 3', currentUrl)

    if (incompleteLogInfo) {
      const data = {
        pageEndDtm: formatDate(currentDate),
        nextUrl: infoDto.pageUrl,
        prevUrl: incompleteLogInfo.pageUrl,
        browserId: incompleteLogInfo.browserId,
        domain: window.location.hostname,
      }

      if (data.prevUrl === data.nextUrl) {
        console.log(data.prevUrl, '<->', data.nextUrl, '<->', await this.manageStorageData.findCurrentUrl())
      }

      const apiKeyHeader = findApiKeyHeader()
      await this.sendHttpRequest.updateInCompleteLogInfo(apiKeyHeader, data)
      this.manageStorageData.clearIncompleteLogInfo()
    }

    console.log('onLoad - 4', currentUrl)

    const isConversionInfoUpdated = await this.manageConversionInfo.chkIsConversionInfoUpdated()

    console.log('onLoad - 5', currentUrl)

    if (isConversionInfoUpdated) {
      this.manageConversionInfo.updateConversionInfo().then(() => {})
    }

    console.log('onLoad - 6', currentUrl)

    this.manageStorageData.setPageActivity(PAGE_ACTIVITY_TYPE.VIEW, true)
    this.manageStorageData.clearUnloadEventExecuted()

    console.log('onLoad - 7', currentUrl)
  }
}

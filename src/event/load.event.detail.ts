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

    console.log('mount currentUrl', currentUrl)
    console.log('------------------------------------------------------------')

    await this.manageStorageData.setCurrentUrl(currentUrl)
    console.log('setCurrentUrl completed')

    this.manageStorageData.setBrowserId(window.location.hostname)
    const infoDto: BrowserInfoDto = await this.findBrowserInfo.findInfo()
    const currentDate = new Date()

    this.manageStorageData.setBrowserInfo(infoDto)
    this.manageStorageData.setPageStartDtm(currentDate)

    const incompleteLogInfo = this.manageStorageData.findIncompleteLogInfo()

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

    const isConversionInfoUpdated = await this.manageConversionInfo.chkIsConversionInfoUpdated()

    if (isConversionInfoUpdated) {
      this.manageConversionInfo.updateConversionInfo().then(() => {})
    }

    this.manageStorageData.setPageActivity(PAGE_ACTIVITY_TYPE.VIEW, true)
    this.manageStorageData.clearUnloadEventExecuted()
  }
}

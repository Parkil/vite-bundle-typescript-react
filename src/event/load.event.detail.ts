import {inject, injectable} from "inversify"
import {ManageStorageData} from "../storage/manage.storage.data"
import {FindBrowserInfo} from "../browserinfo/find.browser.info"
import {ManageConversionInfo} from "../conversion/manage.conversion.info"
import PAGE_ACTIVITY_TYPE from "../enums/page.activity.type"
import {SendHttpRequest} from "../sendhttprequest/send.http.request"
import {findApiKeyHeader} from "../util"

@injectable()
export class LoadEventDetail {
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData
  @inject('FindBrowserInfo') private findBrowserInfo!: FindBrowserInfo
  @inject('SendHttpRequest') private sendHttpRequest!: SendHttpRequest
  @inject('ManageConversionInfo') private manageConversionInfo!: ManageConversionInfo

  onLoad(currentUrl: string) {
    this.findBrowserInfo.findInfo().then((infoDto) => {
      console.log('onload - 0', currentUrl)
      this.manageStorageData.setBrowserInfo(infoDto)
      console.log('onload - 1', currentUrl)
      this.#setBasicInfo()
      console.log('onload - 2', currentUrl)
      this.#processIncompleteLogInfo()
      console.log('onload - 3', currentUrl)
      this.#execChkConversion()
      console.log('onload - 4', currentUrl)
      this.#postProcess()
      console.log('onload - 5', currentUrl)
    });
  }

  #setBasicInfo() {
    this.manageStorageData.setBrowserId(window.location.hostname)
    this.manageStorageData.setPageStartDtm(new Date())
  }

  #processIncompleteLogInfo() {
    const incompleteLogInfo = this.manageStorageData.findIncompleteLogInfo()

    if (incompleteLogInfo) {
      const browserInfoDto = this.manageStorageData.findBrowserInfo()
      console.log('incompleteLogInfo browserInfoDto : ', browserInfoDto)

      const data = {
        pageEndDtm: this.manageStorageData.findPageStartDtm(),
        nextUrl: browserInfoDto.pageUrl,
        prevUrl: incompleteLogInfo.pageUrl,
        browserId: incompleteLogInfo.browserId,
        domain: window.location.hostname,
      }

      this.sendHttpRequest.updateInCompleteLogInfo(findApiKeyHeader(), data).then(() => {
        console.log('this.sendHttpRequest.updateInCompleteLogInfo call complete')
        this.manageStorageData.clearIncompleteLogInfo()
      })
    }
  }

  #execChkConversion() {
    this.manageConversionInfo.chkIsConversionInfoUpdated().then((isConversionInfoUpdated) => {
      if (isConversionInfoUpdated) {
        this.manageConversionInfo.updateConversionInfo().then(() => {})
      }
    })
  }

  #postProcess() {
    this.manageStorageData.setPageActivity(PAGE_ACTIVITY_TYPE.VIEW, true)
    this.manageStorageData.clearUnloadEventExecuted()
  }
}

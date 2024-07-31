import {inject, injectable} from "inversify"
import {PageActivityType} from "../types/page.activity.type"
import {ManageStorageData} from "../storage/manage.storage.data"
import {ChkMeetsConversion} from "../conversion/chk.meets.conversion"
import {SendHttpRequest} from "../sendhttprequest/send.http.request"
import PAGE_ACTIVITY_TYPE from "../enums/page.activity.type"
import {calcScrollLoc, findApiKeyHeader} from "../util"
import {ScrappingReview} from "../scrapping/scrapping.review"

@injectable()
export class UnLoadEventDetail {
  @inject('ManageStorageData') private manageStorageData!: ManageStorageData
  @inject('ChkMeetsConversion') private chkMeetsConversion!: ChkMeetsConversion
  @inject('SendHttpRequest') private sendHttpRequest!: SendHttpRequest
  @inject('ScrappingReview') private scrappingReview!: ScrappingReview



  onUnLoad(currentUrl: string) {

    const openDBRequest = indexedDB.open("recobleLog", 1.0)

    openDBRequest.onupgradeneeded = () => {
      // createObjectStore 는 onupgradeneeded 이벤트 내에서만 호출 가능
      openDBRequest.result.createObjectStore('logDetail', {keyPath: 'id', autoIncrement: true})
      openDBRequest.result.createObjectStore('lastLog', {keyPath: 'id', autoIncrement: true})
    }

    // window sessionStorage 가 비동기 상황에서 정상적으로 작동하지 않는다
    // if (this.manageStorageData.findUnloadEventExecuted() === 'true') {
    //   return
    // }

    this.manageStorageData.setPageActivity(PAGE_ACTIVITY_TYPE.SCROLL, calcScrollLoc())
    // todo 전환정보 충족여부 확인 (현재는 임시 구현이며 나중에 변경될 수 있다)
    this.chkMeetsConversion.check()

    const data = this.#assemblyData(currentUrl)
    const userAgent = this.manageStorageData.findBrowserInfo()['userAgent']

    const apiKeyHeader = findApiKeyHeader()
    /*
    console.log('--------------------------------')
    console.log('onUnLoad currentUrl : ', currentUrl)
    console.log('onUnLoad data : ', data)
    console.log('--------------------------------')
    */

    let db: IDBDatabase
    openDBRequest.onsuccess = () => {
      db = openDBRequest.result
      db.transaction(['logDetail'], 'readwrite')
        .objectStore('logDetail')
        .add(data).onsuccess = () => console.log('added')

      db.transaction(['logDetail'], 'readonly')
        .objectStore('logDetail')
        .getAll()
        .onsuccess = (data) => {
          console.log(data)
        /*
          const test111 = data.target['result']
          if (test111.length >= 10) {
            console.log('------------------------')
            console.log('삭제 예정 data')
            console.log(test111)
            console.log('------------------------')

            db.transaction(['logDetail'], 'readwrite').objectStore('logDetail').clear().onsuccess = () => {console.log('cleared')}
          }*/
        }
    }

    this.sendHttpRequest.sendLog(data, userAgent, apiKeyHeader).then(() => {
      this.manageStorageData.setIncompleteLogInfo(this.manageStorageData.findBrowserId(), currentUrl)
      this.manageStorageData.setUnloadEventExecuted()
      this.manageStorageData.clearUserData(currentUrl)
    })
  }

  #assemblyData(currentUrl: string): object {
    const browserInfo: Record<string, any> = this.manageStorageData.findBrowserInfo()
    browserInfo['pageUrl'] = currentUrl

    const activityData: PageActivityType = this.manageStorageData.findPageActivity()
    const userData: Record<string, any> = this.manageStorageData.findUserData(currentUrl)

    const loginAccount = userData.loginAccount
    const reviewSelector = userData.reviewSelector
    const searchWord = userData.searchWord
    const pageName = userData.pageName

    let reviewList = null

    if (reviewSelector) {
      reviewList = this.scrappingReview.findReviewContents(
        reviewSelector['list_area_selector'], reviewSelector['row_contents_selector'], document)
    }

    const conversion = this.#assemblyConversion()


    return {
      browserId: this.manageStorageData.findBrowserId(),
      ...(searchWord && {searchWord}),
      ...(pageName && {pageName}),
      ...(reviewList && {reviewList}),
      ...(loginAccount && {loginAccount}),
      ...browserInfo,
      pageStartDtm: this.manageStorageData.findPageStartDtm(),
      pageEndDtm: null,
      pageActivity: {
        view: activityData.VIEW,
        scroll: activityData.SCROLL,
        click: activityData.CLICK,
      },
      pageMoveType: {
        isNextPage: false,
        isExitPage: false,
        isLeavePage: false,
      },
      ...(conversion && {conversion}),
    }
  }

  #assemblyConversion(): object | null {
    const userData: Record<string, any> = this.manageStorageData.findUserData()

    const registerUser = userData.user
    const productView = userData.product?.productView
    const productBasket = userData.product?.basketProduct
    const productPurchase = userData.product?.purchaseProduct

    if (!registerUser && !productView && !productBasket && !productPurchase) {
      return null
    } else {
      return {
        ...(registerUser && {registerUser}),
        ...(productView && {productView}),
        ...(productBasket && {productBasket}),
        ...(productPurchase && {productPurchase}),
      }
    }
  }
}

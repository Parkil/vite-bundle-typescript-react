import {useEffect} from "react"
import container from "./config/inversify_config"
import {LoadEventDetail} from "./event/load.event.detail.ts"
import {ManageSaveUserData} from "./userdata/manage.save.user.data.ts"
import {ManageStorageData} from "./storage/manage.storage.data.ts"
import {UnLoadEventDetail} from "./event/unload.event.detail.ts"
import {ScrappingReview} from "./scrapping/scrapping.review.ts"

const loadEventDetail = container.get<LoadEventDetail>('LoadEventDetail')
const unLoadEventDetail = container.get<UnLoadEventDetail>('UnLoadEventDetail')
const manageSaveUserData = container.get<ManageSaveUserData>('ManageSaveUserData')
const manageStorageData = container.get<ManageStorageData>('ManageStorageData')
const scrappingReview = container.get<ScrappingReview>('ScrappingReview')

export const initRecoble = (apiKey: string) => {
  manageStorageData.setApiKey(apiKey)
}

export const useRecoblePageCycle = () => {
  const currentUrl = window.location.href
  const currentHostName = window.location.hostname
  manageStorageData.setCurrentUrl(currentUrl)
  manageStorageData.setCurrentHostName(currentHostName)

  useEffect(() => {
    findReviewList(currentUrl)
    loadEventDetail.onLoad()
    return () => {
      unLoadEventDetail.onUnLoad(currentUrl)
    }
  }, [])
}

/*
  리뷰 리스트를 여기에서 추출하는 이유
  1.useEffect unmount 는 component 제거가 완료된 시점이기 때문에 기존 처럼 unload 시점에서 리뷰 리스트를 추출할 수 없다
  2.component lifecycle 과 useEffect lifecycle 이 독립적으로 움직이기 때문에 saveRecobleUserData > setReviewSelector 가 호출되는
  시점 에서는 component mount 가 되었다는 것을 보장할수 없음 -> useState 를 쓰면 가능하겠지만, 원 시스템에 영향을 줄수 있기 때문에 제외
 */
const findReviewList = (currentUrl: string) => {
  console.log(currentUrl, 'findReviewList called')
  const userData = manageStorageData.findUserData(currentUrl)

  if (userData.reviewSelector) {
    console.log(userData.reviewSelector)
    const reviewList = scrappingReview.findReviewContents(
      userData.reviewSelector.list_area_selector,
      userData.reviewSelector.row_contents_selector,
      document)
    console.log(currentUrl, 'findReviewList result : ', reviewList)
    manageStorageData.setReviewListStr(reviewList.join('|'))
  }
}

export const saveRecobleUserData = (paramArr: { [key: string]: any }[]) => {
  manageSaveUserData.save(paramArr)
}

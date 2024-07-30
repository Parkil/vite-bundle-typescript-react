import {PageActivityType} from "../types/page.activity.type"
import {RECOBLE_USER_DATA_KEY} from "../constants/constants.ts"

export const emptyPageActivityObj = (): PageActivityType => {
  return {VIEW: false, SCROLL: 0.0, CLICK: false}
}

export const genRecobleUserDataKey = (idKey: string | null): string => {
  return `${RECOBLE_USER_DATA_KEY}-${idKey}`
}

import {useEffect} from "react"
import {
  findReviewContents, runSpaLoadEvent, runSpaUnloadEvent,
  saveApiKey,
  saveHostName,
  saveUrl, saveUserData, insertSpaPageCloseEventScript
} from "recoble-common-module"

export const initRecoble = (apiKey: string) => {
  saveApiKey(apiKey)
}

export const useRecoblePageCycle = () => {
  const currentUrl = window.location.href
  const currentHostName = window.location.hostname

  saveUrl(currentUrl)
  saveHostName(currentHostName)

  useEffect(() => {
    insertSpaPageCloseEventScript()
    findReviewContents(currentUrl)
    runSpaLoadEvent()
    return () => {
      runSpaUnloadEvent(currentUrl)
    }
  }, [])
}

export const saveRecobleUserData = (paramArr: { [key: string]: any }[]) => {
  saveUserData(paramArr)
}

import {useEffect} from "react"
import {
  findReviewContents, runLoadEvent, runUnloadEvent,
  saveApiKey,
  saveHostName,
  saveUrl, saveUserData
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
    findReviewContents(currentUrl)
    runLoadEvent()
    return () => {
      runUnloadEvent(currentUrl)
    }
  }, [])
}

export const saveRecobleUserData = (paramArr: { [key: string]: any }[]) => {
  saveUserData(paramArr)
}

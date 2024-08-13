import {useEffect} from "react"
import {
  findReviewContents, runSpaLoadEvent, runSpaUnMountEvent,
  saveApiKey,
  saveHostName,
  saveUrl, saveUserData, insertSpaPageCloseEventScript, runSpaUnloadEvent
} from "recoble-common-module"
import {unloadScript} from "./unload.script.ts"

declare global {
  interface Window {
    setRecoblePageUnloadEvent: () => void
  }
}

window.setRecoblePageUnloadEvent = () => {
  runSpaUnloadEvent(window.location.href)
}

export const initRecoble = (apiKey: string) => {
  saveApiKey(apiKey)
}

export const useRecoblePageCycle = () => {
  const currentUrl = window.location.href
  const currentHostName = window.location.hostname

  saveUrl(currentUrl)
  saveHostName(currentHostName)

  useEffect(() => {
    insertSpaPageCloseEventScript(unloadScript(), 'recoble script')
    findReviewContents(currentUrl)
    runSpaLoadEvent()
    return () => {
      runSpaUnMountEvent(currentUrl)
    }
  }, [])
}

export const saveRecobleUserData = (paramArr: { [key: string]: any }[]) => {
  saveUserData(paramArr)
}

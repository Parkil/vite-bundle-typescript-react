import {useEffect} from "react";
import container from "./config/inversify_config"
import {LoadEventDetail} from "./event/load.event.detail.ts";
import {ManageSaveUserData} from "./userdata/manage.save.user.data.ts";
import {ManageStorageData} from "./storage/manage.storage.data.ts";
import {UnLoadEventDetail} from "./event/unload.event.detail.ts";

const loadEventDetail = container.get<LoadEventDetail>('LoadEventDetail')
const unLoadEventDetail = container.get<UnLoadEventDetail>('UnLoadEventDetail')
const manageSaveUserData = container.get<ManageSaveUserData>('ManageSaveUserData')
const manageStorageData = container.get<ManageStorageData>('ManageStorageData')


export const initRecoble = (apiKey: string) => {
  console.log('1. initRecoble')
  manageStorageData.setApiKey(apiKey)
}

export const useRecoblePageCycle = () => {
  console.log('2. useRecoblePageCycle')
  useEffect(() => {
    const currentUrl = window.location.href
    const hostname = window.location.hostname

    const mount = () => {
      loadEventDetail.onLoad(currentUrl, hostname)
    }

    const unmount = () => {
      unLoadEventDetail.onUnLoad(currentUrl)
    }

    mount()
    return () => {
      unmount()
    }
  },[])
  console.log('2. useRecoblePageCycle - 1')
}

export const saveRecobleUserData = (paramArr: { [key: string]: any }[]) => {
  console.log('3. saveRecobleUserData')
  manageSaveUserData.save(paramArr)
  console.log('3. saveRecobleUserData - 1')
}


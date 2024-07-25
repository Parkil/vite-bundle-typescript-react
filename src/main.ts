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
  console.log('1.apikey : ', apiKey)
  manageStorageData.setApiKey(apiKey)
}

export const useRecoblePageCycle = () => {
  console.log('2.beforeUseEffect')
  useEffect(() => {
    console.log('2.useEffect')
    const currentUrl = window.location.href
    console.log('2.useEffect-1')
    loadEventDetail.onLoad(currentUrl).then(() => {})
    console.log('2.useEffect-2')
    return () => {
      console.log('2.useEffect-unmount-1')
      unLoadEventDetail.onUnLoad(currentUrl).then(() => {})
      console.log('2.useEffect-unmount-2')
    }
  },[])
}

export const saveRecobleUserData = (paramArr: { [key: string]: any }[]) => {
  console.log('3.saveUserData')
  manageSaveUserData.save(paramArr)
  console.log('3.saveUserData - 1')
}


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
  manageStorageData.setApiKey(apiKey)
}

export const saveRecobleUserData = (paramArr: { [key: string]: any }[]) => {
  manageSaveUserData.save(paramArr)
}

export const useRecoblePageCycle = () => {
  useEffect(() => {
    const currentUrl = window.location.href

    const mount = async () => {
      await loadEventDetail.onLoad(currentUrl)
    }

    const unmount = async () => {
      await unLoadEventDetail.onUnLoad(currentUrl)
    }

    mount()
    return () => {
      unmount()
    }
  },[])
}

import {useEffect} from "react";
import container from "./config/inversify_config"
import {LoadEventDetail} from "./event/load.event.detail.ts";
import {
  CONVERSION_INFO_SERVER_URL,
  LOG_SERVER_SEND_LOG_URL,
  LOG_SERVER_UPDATE_INCOMPLETE_LOG_URL
} from "./constants/constants.ts";
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
    console.log('mount')
    console.log('test1 : ', LOG_SERVER_SEND_LOG_URL)
    console.log('test2 : ', LOG_SERVER_UPDATE_INCOMPLETE_LOG_URL)
    console.log('test3 : ', CONVERSION_INFO_SERVER_URL)
    loadEventDetail.onLoad().then(() => {})
    return () => {
      console.log('unmount')
      unLoadEventDetail.onUnLoad()
    }
  })
}

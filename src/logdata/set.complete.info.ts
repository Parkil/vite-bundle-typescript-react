import {injectable} from "inversify";
import {logDataType} from "../types/log.data.type.ts"

@injectable()
export class SetCompleteInfo {
  async setInfo(rawList: logDataType[]): Promise<logDataType[]> {
    const completeInfoList: logDataType[] = []
    rawList.forEach((item, index, list) => {
      const prevElement = list[index - 1]
      const nextElement = list[index + 1]
      item.isLastLog = (typeof item.isLastLog === 'undefined' ? false : item.isLastLog)

      if (typeof prevElement !== 'undefined') {
        item['referrer'] = prevElement['pageUrl']
      }

      if (typeof nextElement !== 'undefined') {
        item['pageEndDtm'] = nextElement['pageStartDtm']
        item['pageMoveType']['isNextPage'] = true
      }

      completeInfoList.push(item)
    })

    console.log('SetCompleteInfo completeInfoList : ', completeInfoList)
    return completeInfoList
  }
}

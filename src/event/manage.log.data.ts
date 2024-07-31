import {inject, injectable} from "inversify"
import {IndexedDbWrapper} from "../indexeddb/indexed.db.wrapper.ts";
import {INDEXED_DB_LAST_LOG, INDEXED_DB_LOG_DETAIL} from "../constants/constants.ts";
import {printErrorMsg} from "../util";

@injectable()
export class ManageLogData {
  @inject('IndexedDbWrapper') private indexedDbWrapper!: IndexedDbWrapper
  readonly #dbObj: Promise<IDBDatabase>


  constructor() {
    const options = [
      {
        'storeName': INDEXED_DB_LOG_DETAIL,
        'subOption': {keyPath: 'id', autoIncrement: true}
      },
      {
        'storeName': INDEXED_DB_LAST_LOG,
        'subOption': {keyPath: 'id', autoIncrement: true}
      }
    ]

    this.#dbObj = this.indexedDbWrapper.connectIndexedDB('RecobleDB', 1, options)
  }

  async addLog(logData: object, capacity: number): Promise<void> {
    const database: IDBDatabase = await this.#dbObj
    const addDataResult = await this.indexedDbWrapper.addData(database, INDEXED_DB_LOG_DETAIL, logData)

    if (!addDataResult) {
      printErrorMsg(`Log Data Not Inserted : ${logData}`)
      return
    }

    const logDetailList = await this.indexedDbWrapper.findAll(database, INDEXED_DB_LOG_DETAIL)

    if (logDetailList.length !== 0 && logDetailList.length >= capacity) {
      this.#printLog(logDetailList)

      const lastElement = logDetailList[logDetailList.length - 1]
      console.log('lastElement : ', lastElement)

      await this.indexedDbWrapper.clearAll(database, INDEXED_DB_LOG_DETAIL)

      /*
      1. 기존 INDEXED_DB_LAST_LOG데이터 가져오기
      2. 데이터가 있으면 logDetailList 제일 앞에 붙임
      3. 데이터 pageMoveType, pageEndDtm, refererer 추가
        logDetailList first -> last 순으로 돌면서
          pageMoveType - 다음 index 에 값이 존재하면 next = true, 없으면 전부 false
          pageEndDtm - 다음 index에 값이 존재하면 다음 index 의 pageStartDtm, 없으면 null
          refererer - 이전 index에 값이 존재하면 이전 index의 pageURL 없으면 null
      4.INDEXED_DB_LAST_LOG clear
      5.추가된 리스트의 마지막 element 를 뽑아서 INDEXED_DB_LAST_LOG 에 저장, 저장시에 해당 element 는 last log 임을 알수 있게하는 flag
      를 추가해서 저장
      6.로그 서버에 데이터 전송
      7.INDEXED_DB_LOG_DETAIL clear
       */

    }

    console.log(this.indexedDbWrapper)
  }

  #printLog(list: any) {
    console.log('------------------------')
    console.log('로그서버 전송 예정 data : ', list)
    console.log('------------------------')
  }
}

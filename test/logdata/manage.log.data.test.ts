import {beforeAll, describe, expect, test} from '@jest/globals'
import container from "../../src/config/inversify_config"
import {ManageLogData} from "../../src/logdata/manage.log.data"
import {IndexedDbWrapper} from "../../src/indexeddb/indexed.db.wrapper";
import {INDEXED_DB_LAST_LOG, INDEXED_DB_LOG_DETAIL} from "../../src/constants/constants";

describe('manageLogData', () => {
  let manageLogData: ManageLogData
  let indexedDbWrapper: IndexedDbWrapper
  let dbObj: IDBDatabase

  beforeAll(async () => {
    manageLogData = container.get<ManageLogData>('ManageLogData')
    indexedDbWrapper = container.get<IndexedDbWrapper>('IndexedDbWrapper')

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

    dbObj = await indexedDbWrapper.connectIndexedDB('RecobleDB', 1, options)
  })

  const data1 = {"browserId":"5597adf0-4989-565b-8bd2-f8951a44614e","pageName":"메인페이지","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36","referrer":"","pageUrl":"http://localhost:3000/","ip":"121.125.238.186","countryCode":"KR","pageStartDtm":"2024-08-01T01:33:00","pageEndDtm":null,"pageActivity":{"view":true,"scroll":0,"click":false},"pageMoveType":{"isNextPage":false,"isExitPage":false,"isLeavePage":false}}
  const data2 = {"browserId":"5597adf0-4989-565b-8bd2-f8951a44614e","pageName":"다음페이지","userAgent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36","referrer":"","pageUrl":"http://localhost:3000/next","ip":"121.125.238.186","countryCode":"KR","pageStartDtm":"2024-08-01T01:33:03","pageEndDtm":null,"pageActivity":{"view":true,"scroll":0,"click":false},"pageMoveType":{"isNextPage":false,"isExitPage":false,"isLeavePage":false}}

  test('test', async () => {
    await manageLogData.addLog(data1, 2)
    await manageLogData.addLog(data2, 2)
    await manageLogData.addLog(data1, 2)
    await manageLogData.addLog(data2, 2)

    console.log('INDEXED_DB_LOG_DETAIL : ', await indexedDbWrapper.findAll(dbObj, INDEXED_DB_LOG_DETAIL))
    console.log('INDEXED_DB_LAST_LOG : ', await indexedDbWrapper.findAll(dbObj, INDEXED_DB_LAST_LOG))

    const aaa = "111"
    expect(aaa).toEqual("111")
  })
})

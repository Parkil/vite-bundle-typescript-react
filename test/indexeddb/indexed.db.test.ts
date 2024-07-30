import {describe, test, expect, beforeAll, afterEach} from '@jest/globals'
import {IndexedDb} from "../../src/indexeddb/indexed.db"
import container from "../../src/config/inversify_config"

describe('indexedDB', () => {
  let indexedDB: IndexedDb
  let dbObj: IDBDatabase

  beforeAll(async () => {
    indexedDB = container.get<IndexedDb>('IndexedDb')

    const options = [
      {
        'storeName': 'logDetail',
        'subOption': {keyPath: 'id', autoIncrement: true}
      }
    ]

    dbObj = await indexedDB.connectIndexedDB('MyDatabase', 1, options)
  })

  afterEach(async () => {
    await indexedDB.clearAll(dbObj, 'logDetail')
  })

  test('indexedDB 데이터 저장 테스트', async () => {
    const addResult = await indexedDB.addData(dbObj, 'logDetail', {'aaa': 'aaa', 'bbb': 'bbb'})
    expect(addResult).toEqual(true)
  })

  test('indexedDB 데이터 전체조회 테스트', async () => {
    const dataParam = {'aaa': 'aaa', 'bbb': 'bbb'}
    const addResult = await indexedDB.addData(dbObj, 'logDetail', dataParam)

    const result = await indexedDB.findAll(dbObj, 'logDetail')

    expect(addResult).toEqual(true)
    expect(result[0]).toEqual({'aaa': 'aaa', 'bbb': 'bbb', 'id': 2})
  })

  test('indexedDB 데이터 전체삭제 테스트', async () => {
    const addResult = await indexedDB.addData(dbObj, 'logDetail', {'aaa': 'aaa', 'bbb': 'bbb'})
    const clearResult = await indexedDB.clearAll(dbObj, 'logDetail')
    const findAllResult = await indexedDB.findAll(dbObj, 'logDetail')

    expect(addResult).toEqual(true)
    expect(clearResult).toEqual(true)
    expect(findAllResult.length).toEqual(0)
  })
})

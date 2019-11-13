import * as JSONAPI from 'jsonapi-typescript'
import { JSONAPINormalizer } from '../src/restbee'

const data: JSONAPI.DocWithData = {
  data: {
    id: '123',
    type: 'post',
    attributes: {
      title: 'a good post',
      content: 'this is a post content'
    },
    relationships: {
      user: { data: { id: '12', type: 'user' } }
    }
  },
  included: [{ id: '12', type: 'user', attributes: { username: 'testuser' } }]
}

const rec: object = {
  id: '123',
  type: 'post',
  title: 'a good post',
  content: 'this is a post content',
  userKey: 'user_12'
}

const errors: JSONAPI.DocWithErrors = {
  errors: [
    { code: '505', detail: 'title already exists' },
    { code: '506', detail: 'content cannot be empty' }
  ]
}

const errMsgs: string[] = ['title already exists', 'content cannot be empty']

let cachedRecords: any = {}
const normalizer = new JSONAPINormalizer(cachedRecords)

describe('restbee test', () => {
  it('JSONAPINormalizer is instantiable', () => {
    expect(normalizer).toBeInstanceOf(JSONAPINormalizer)
  })

  it('JSONAPINormalizer deserialize JSONAPI data', () => {
    expect(normalizer.parse({ data })).toEqual('post_123')
    expect(cachedRecords).toHaveProperty('post_123')
    expect(cachedRecords['post_123']).toHaveProperty('userKey', 'user_12')
  })

  it('JSONAPINormalizer serialize json to JSONAPI data', () => {
    expect(normalizer.toJsonApi(rec)).toEqual({ data: data.data })
  })

  it('JSONAPINormalizer deserialize JSONAPI error', () => {
    expect(normalizer.parseErrors({ response: { data: errors } })).toEqual(errMsgs)
  })

  it('JSONAPINormalizer convert id to record key for the cache', () => {
    expect(normalizer.idToRecordKey(12, 'user')).toEqual('user_12')
  })

  it('JSONAPINormalizer convert id to record key for the cache', () => {
    expect(normalizer.recordKeyToData('user_12')).toEqual({ id: '12', type: 'user' })
  })
})

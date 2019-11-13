import { JSONAPINormalizer, cachedRecords } from '../src/restbee'

/**
 * Dummy test
 */
describe('JSONAPI Normalizer test', () => {
  it('JSONAPINormalizer is instantiable', () => {
    expect(new JSONAPINormalizer(cachedRecords)).toBeInstanceOf(JSONAPINormalizer)
  })
})

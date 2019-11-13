import * as JSONAPI from 'jsonapi-typescript'
type Error = { response: { data: JSONAPI.DocWithErrors } }

export default class Normalizer {
  cache: any
  constructor(cache: object) {
    this.cache = cache
  }

  idToRecordKey(id: string | number | undefined, type: string): string {
    return `${type.toLowerCase()}_${id}`
  }

  recordKeyToData(key: string): JSONAPI.ResourceObject {
    const [type, id] = key.split('_')
    return { id, type }
  }

  parseRelationships(rel: JSONAPI.RelationshipObject): undefined | string | string[] {
    const rec = (rel as JSONAPI.RelationshipsWithData).data
    if (!rec) return
    if (Array.isArray(rec)) {
      return (rec as JSONAPI.ResourceIdentifierObject[]).map(({ id, type }) =>
        this.idToRecordKey(id, type)
      )
    } else {
      const { id, type } = rec
      return this.idToRecordKey(id, type)
    }
  }

  parseResObject({ id, type, attributes, relationships }: JSONAPI.ResourceObject): any {
    let resource: any = { id, type }
    attributes && Object.assign(resource, attributes)
    if (relationships) {
      Object.keys(relationships).forEach(name => {
        const rel = relationships[name]
        resource[name + 'Key'] = this.parseRelationships(rel)
      })
    }

    return resource
  }

  parse({ data: { included, data } }: { data: JSONAPI.DocWithData }): any {
    if (included) {
      this.parse({ data: { data: included } })
    }
    if (Array.isArray(data)) {
      return data.map(record => this.parse({ data: { data: record } }))
    }
    this.cache[this.idToRecordKey(data.id, data.type)] = this.parseResObject(data)
    return this.idToRecordKey(data.id, data.type)
  }

  parseErrors({
    response: {
      data: { errors = [] }
    }
  }: Error): any {
    return errors.map(e => e.detail)
  }

  toJsonApi(record: any = {}): any {
    let obj: any = {
      id: record.id,
      type: record.type,
      attributes: {},
      relationships: {}
    }
    Object.keys(record).forEach(key => {
      if (key.slice(-3) === 'Key') {
        let rel
        if (Array.isArray(record[key])) {
          rel = { data: record[key].map(this.recordKeyToData) }
        } else {
          rel = { data: this.recordKeyToData(record[key]) }
        }
        obj.relationships[key.slice(0, -3)] = rel
      } else if (!['id', 'type'].includes(key)) {
        obj.attributes[key] = record[key]
      }
    })
    return { data: obj }
  }
}

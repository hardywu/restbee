import * as JSONAPI from 'jsonapi-typescript';
type Error = { response: { data: JSONAPI.DocWithErrors } }

export default class Normalizer {
  cache: any;
  constructor(cache: object) {
    this.cache = cache;
  }

  idToRecordKey(id: string | number | undefined, type: string): string {
    return `${type.toLowerCase()}_${id}`;
  }

  recordKeyToData(key: string): JSONAPI.ResourceObject {
    const [type, id] = key.split('_')
    return { id, type }
  }

  parseDataObject({
    id, type, attributes, relationships,
  }: JSONAPI.ResourceObject): any {
    let resource: any = {id, type};
    attributes && Object.assign(resource, attributes);
    if (relationships) {
      Object.keys(relationships).forEach(name => {
        const rel = relationships[name]
        let rec = (rel as JSONAPI.RelationshipsWithData).data;
        if (rec) {
          if (Array.isArray(rec)) {
            const keys = (rec as JSONAPI.ResourceIdentifierObject[]).map(
              ({id, type}) => this.idToRecordKey(id, type)
            );
            resource[name + 'Key'] = keys;
          } else {
            const { id, type } = (rec as JSONAPI.ResourceIdentifierObject);
            resource[name + 'Key'] = this.idToRecordKey(id, type);
          }
        }
      });
    }

    return resource;
  }

  parse({ data: { included, data } }: { data: JSONAPI.DocWithData }): any {
    if (included) {
      this.parse({ data: { data: included } });
    }
    if (Array.isArray(data)) {
      return data.map(record => this.parse({ data: { data: record } }));
    }
    this.cache[this.idToRecordKey(data.id, data.type)] =
      this.parseDataObject(data);
    return this.idToRecordKey(data.id, data.type);
  }

  parseErrors({ response: { data: { errors = [] } } }: Error): any {
    errors.map(e => e.detail)
  }

  toJsonApi(record: any = {}): any {
    let obj: any = {
      id: record.id, type: record.type,
      attributes: {}, relationships: {}
    };
    Object.keys(record).forEach(key => {
      if (key.slice(-3) === 'Key') {
        let rel
        if (Array.isArray(record[key])) {
          rel = { data: record[key].map(this.recordKeyToData) };
        } else {
          rel = { data: this.recordKeyToData(record[key]) };
        }
        obj.relationships[key.slice(0, -3)] = rel;
      } else if (!(['id', 'type'].includes(key) )) {
        obj.attributes[key] = record[key]
      }
    })
    return { data: obj };
  }
}

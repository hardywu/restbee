type Error = { response: { data: { errors: { detail: string }[] } } }
type JSONDATA = {
  id: string | number,
  type: string,
  attributes?: object,
  relationships?: any,
}
type JSONAPI = { data: JSONDATA | JSONDATA[], included?: JSONDATA[] }

export default class Normalizer {
  cache: any;
  constructor(cache: object) {
    this.cache = cache;
  }

  idToRecordKey(id: string | number, type: string): string {
    return `${type.toLowerCase()}_${id}`;
  }

  parseDataObject(data: JSONDATA): any {
    let resource: any = {};
    resource.id = data.id;
    resource.type = data.type;
    data && Object.assign(resource, data.attributes);
    if (data && data.relationships) {
      Object.keys(data.relationships).forEach(name => {
        let rec = data.relationships[name].data
        resource[name + 'Key'] = this.idToRecordKey(rec.id, rec.type)
      });
    }

    return resource;
  }

  parse({ data: { included, data } }: { data: JSONAPI }): any {
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
      if (key.slice(-2) === 'Id') {
        obj.relationships[key.slice(0, -2)] = { data: { id: record[key] } };
      } else if (!(['id', 'type'].includes(key) )) {
        obj.attributes[key] = record[key]
      }
    })
    return { data: obj };
  }
}

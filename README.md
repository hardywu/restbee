[![NPM version](https://img.shields.io/npm/v/restbee.svg)](https://www.npmjs.com/package/restbee)
[![Codecov](https://img.shields.io/codecov/c/github/hardywu/restbee.svg)](https://codecov.io/gh/hardywu/restbee)
[![Travis](https://img.shields.io/travis/hardywu/restbee.svg)](https://travis-ci.org/hardywu/restbee)

# Restbee

JSON data normalizer/cacher based on axios. Currently support 
[JSONAPI](https://jsonapi.org/).

## Quick start

```
import { JsonApiNormalizer } from 'restbee/dist/lib/restbee'
import axios from 'axios'

const cachedRecords = {}
const normalizer = new JsonApiNormalizer(cachedRecords)
const apiService = axios.create({
  baseURL: 'http://localhost/api/endpoint', 
})
  
apiService.interceptors.response.use(normalizer.parse,  normalizer.parErrors)

... ...

await postKey = apiService.get('posts/123') # posts_123
const post = cachedRecords[postKey]
# {
#   id: 123,
#   type: 'post',
#   title: 'test title',
#   content: 'post content',
#   userKey: 'user_3'
# } 
```

## How `JsonApiNormalizer` serialize/deserialize json

use `parseResObject` to parse (flatten) a JSONAPI data 

```
HTTP/1.1 200 OK
Content-Type: application/vnd.api+json

{
  "data": {
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!"
    },
    "relationships": {
      "author": {
        "data": {
          "id": "3",
          "type": "users"
        }
      }
    }
  }
}
```
the result `const flattened = normalizer.parseResObject(data)`

```
# flattened
{
  "type": "articles",
  "id": "1",
  "title": "JSON:API paints my bikeshed!",
  "authorKey": "users_3",
}
```

use `normalizer.toJsonApi(flattened)` to serialize the flattened json back to JSONAPI data



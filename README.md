[![TypeScript version][ts-badge]][typescript-37]
[![Node.js version][nodejs-badge]][nodejs]
[![MIT][license-badge]][LICENSE]
[![Build Status][travis-badge]][travis-ci]

[![Donate][donate-badge]][donate]

# Restbee

JSON data normalizer/cacher based on axios. Currently support 
[JSONAPI](https://jsonapi.org/).

## Quick start

```
import { cachedRecords, createService, JsonApiNormalizer } from 'restbee';

const normalizer = new JsonApiNormalizer(cachedRecords);
const apiService = createService(
  'http://localhost/api/endpoint', 
  normalizer.parse, 
  normalizer.parErrors)

... ...

await postKey = apiService.get('posts/123')
const post = cachedRecords[postKey]
# {
#   id: 123,
#   type: 'post',
#   title: 'test title',
#   content: 'post content',
#   userKey: 'user_3'
# } 
```

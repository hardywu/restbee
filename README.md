
[![NPM version](https://img.shields.io/npm/v/restbee.svg)](https://www.npmjs.com/package/restbee)
[![Codecov](https://img.shields.io/codecov/c/github/hardywu/restbee.svg)](https://codecov.io/gh/hardywu/restbee)
[![CircleCI](https://img.shields.io/circleci/project/github/hardywu/restbee.svg)](https://circleci.com/gh/hardywu/restbee)
[![Travis](https://img.shields.io/travis/hardywu/restbee.svg)](https://travis-ci.org/hardywu/restbee)
[![AppVeyor](https://img.shields.io/appveyor/ci/hardywu/restbee.svg)](https://ci.appveyor.com/project/hardywu/restbee)
[![GitHub stars](https://img.shields.io/github/stars/hardywu/restbee.svg?style=social&logo=github&label=Stars)](https://github.com/hardywu/restbee)

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

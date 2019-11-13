// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import axios, { AxiosInstance } from 'axios'
export { default as JSONAPINormalizer } from './jsonApiNormalizer'

export let cachedRecords: any = {}

export const createService = (host: string, onRes: any, onErr: any): AxiosInstance => {
  const service = axios.create({ baseURL: host })
  service.interceptors.response.use(onRes, onErr)
  return service
}

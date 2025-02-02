import axios, {
  AxiosBasicCredentials,
  AxiosError,
  AxiosHeaders,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
} from 'axios'
import axiosRetry, { IAxiosRetryConfig } from 'axios-retry'

const http_method = ['GET', 'POST', 'PUT', 'DELETE'] as const
type HTTP_METHOD = (typeof http_method)[number]
type TMap = { [key: string]: string }

type HttpOption = {
  headers?: AxiosHeaders
  method: HTTP_METHOD
  params?: TMap
  query?: TMap
  body?: TMap
  retry_condition?: ((error: AxiosError) => boolean | Promise<boolean>) | undefined
  retry_count?: number
  timeout?: number
  url: string
  auth?: AxiosBasicCredentials
}

type ApiResponse<B extends unknown> = {
  data: B
  headers: AxiosResponseHeaders | undefined
  status: number
  statusText: string
  config: AxiosRequestConfig | undefined
}

type RA = HttpOption | HttpOption[]
type ReturnPromise<T, Body extends unknown> = T extends HttpOption[] ? ApiResponse<Body>[] : ApiResponse<Body>

interface IHttpService {
  requestHttp<B extends unknown, T extends RA>(optionRequest: T): Promise<ReturnPromise<T, B>>
}

class HttpService implements IHttpService {
  async requestHttp<B extends unknown, T extends RA>(optionRequest: T): Promise<ReturnPromise<T, B>> {
    const requestAttributes: HttpOption[] = []
    let returnObjFlag = true

    if (Array.isArray(optionRequest)) {
      optionRequest.forEach((request) => {
        requestAttributes.push(request)
      })
      returnObjFlag = false
      optionRequest.length = 0
    } else {
      requestAttributes.push(optionRequest)
    }

    const axiosRetryConfig: IAxiosRetryConfig = {
      retries: 3, // Allow at least one retry
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => error.response?.status === 429, // Retry only on 429
    }

    axiosRetry(axios, axiosRetryConfig)

    const requests: Promise<AxiosResponse<any, any>>[] = []

    function processOptionAttributes(request: HttpOption) {
      const { headers, method, params, query, body, retry_condition, retry_count, timeout, url, auth } = request

      const config: AxiosRequestConfig = {
        headers,
        method,
        url: params ? replaceUrlParam(url, params) : url,
        data: body,
        timeout,
        auth,
      }

      if (retry_count) {
        if (!config['axios-retry']) {
          config['axios-retry'] = { ...axiosRetryConfig }
        }
        config['axios-retry'].retries = retry_count
      }

      if (retry_condition) {
        if (!config['axios-retry']) {
          config['axios-retry'] = { ...axiosRetryConfig }
        }
        config['axios-retry'].retryCondition = retry_condition
      }

      if (timeout) {
        config['timeout'] = timeout
      }

      if (query) {
        config['params'] = query
      }

      requests.push(makeRequest(config))
    }

    requestAttributes.forEach(processOptionAttributes)
    requestAttributes.length = 0

    if (returnObjFlag) {
      const result = await requests.pop()
      const response: ReturnPromise<T, B> = {
        config: result?.config,
        data: result?.data,
        headers: (result?.headers as AxiosResponseHeaders) ?? {},
        status: result?.status,
        statusText: result?.statusText,
      } as ReturnPromise<T, B>
      return response
    }

    const result: AxiosResponse<B, B>[] = await Promise.all(requests)
    requests.length = 0

    return result as ReturnPromise<T, B>
  }
}

function replaceUrlParam(url: string, params: TMap) {
  let subURL = url.split('/')

  for (let i = 0; i < subURL.length; i++) {
    if (subURL[i] !== '' && subURL[i]?.startsWith(':')) {
      const sub = subURL[i]?.substring(1)
      let replaceValue = sub ? params[sub] : undefined
      if (replaceValue) {
        subURL[i] = replaceValue
        continue
      }
    }
  }
  return subURL.join('/')
}

async function makeRequest(config: AxiosRequestConfig): Promise<AxiosResponse> {
  try {
    return await axios.request(config)
  } catch (error) {
    console.error('Caught Error:', error); // Debugging

    if (error instanceof AxiosError) {
      return {
        data: error.response?.data ?? {},
        headers: error.response?.headers ?? {},
        status: error.response?.status ?? 500,
        statusText: error.response?.statusText ?? error.message,
        config: error.config ?? {},
      } as AxiosResponse
    } else if (error instanceof Error) {
      return {
        data: error.message,
        headers: {},
        status: 500,
        statusText: 'Internal Server Error',
        config: {},
      } as AxiosResponse
    }

    const err = error as AxiosError

    return {
      data: null,
      headers: err?.response?.headers ?? {},
      status: err?.response?.status ?? 500,
      statusText: 'Internal Server Error',
      config: {},
    } as AxiosResponse
  }
}

export { HttpOption, ApiResponse, IHttpService }
export default HttpService

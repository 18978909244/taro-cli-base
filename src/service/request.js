import Taro from '@tarojs/taro'


const interceptor = function (chain) {
  const requestParams = chain.requestParams
  const {
    method,
    data,
    url
  } = requestParams
  Taro.showLoading()
  return chain.proceed(requestParams)
    .then(res => {
      Taro.hideLoading()
      console.log(`http ${method || 'GET'} --> ${url} data: `,data, res.data)
      return res
    })
}
// Taro.addInterceptor(Taro.interceptors.logInterceptor)
// Taro.addInterceptor(Taro.interceptors.timeoutInterceptor)
Taro.addInterceptor(interceptor)


export const get = ({
  url = '',
  payload = {}
}) => {
  if (!Object.is(payload, {})) {
    let arr = []
    Object.keys(payload).forEach(item => {
      let str = item + '=' + payload[item]
      arr.push(str)
    })
    let query = arr.join('&')
    url = url.includes('?')?url+'&'+query:url+'?'+query
  }
  return Taro.request({
    // url: url.includes('?') ? url + '&token=' + Taro.getStorageSync('token') : url + '?token=' + Taro.getStorageSync('token'),
    url,
    method: 'GET'
  }).then(res => res.data)
}

export const post = ({
  url = '',
  payload = {}
}) => Taro.request({
  url,
  method: 'POST',
  header: {
    'content-type': 'application/x-www-form-urlencoded'
    // 'content-type': 'application/json'
  },
  data:payload
}).then(res => res.data)


export default {
  get,
  post
}

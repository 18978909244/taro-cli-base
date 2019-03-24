import Taro from '@tarojs/taro'

export const jump = ({
  type = 'navigate',
  url = 'index',
  payload = {}
}) => {
  if (!Object.is(payload, {})) {
    console.log('1')
    let arr = []
    Object.keys(payload).forEach(item => {
      let str = item + '=' + payload[item]
      arr.push(str)
    })
    let query = arr.join('&')
    url = `../${url}/index?${query}`
  }

  if (Taro) {
    Taro[type + 'To']({
      url
    })
  } else {
    Taro.navigateTo({
      url
    })
  }
}


export default {
  jump
}

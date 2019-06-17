import originJSONP from 'jsonp'
export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })

  // encodeURIComponent()函数   必须对地址栏的值value进行编译
  function param(data) {
    let url = ''
    for (var key in data) {
      let value = data[key] !== undefined ? data[key] : ''
      url += `&${key}=${encodeURIComponent(value)}`
    }
    return url.length > 0 ? url.substring(1) : ''
  }
}

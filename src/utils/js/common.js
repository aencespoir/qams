// 抛出message
export function postMessage(data) {
  const { opener } = window
  if (opener) {
    opener.postMessage(
      JSON.stringify({
        type: 'postMessage',
        data: data || {}
      })
    )
  }
}

// 关闭窗口
export function closeOpener() {
  const { opener } = window
  if (opener) {
    window.close()
  }
}

// => 接收消息 window.addEventListener
export function getWindowMessage() {
  return window.addEventListener('message', (e) => {
    return e || null
  }, false)
}

export function getUUID(length = 18) {
  const charts = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
  let uuid = []
  let i
  const radix = charts.length
  for (i = 0; i < length; i++) uuid[i] = charts[0 | (Math.random() * radix)]
  return uuid.join('')
}

// 数组去重含key
export function uniqueWithKey(arr, key = 'key') {
  const res = new Map()
  return arr.filter(arr => !res.has(arr[key]) && res.set(arr[key], 1))
}

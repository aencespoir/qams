// import router from './router'
import axios from 'axios'
axios.defaults.timeout = 20000;//请求20s后，返回中断超时
// axios.defaults.baseURL = '/portal/r/w?sid=dcef7452-1a26-4250-bedc-72ffdabf41ef&cmd='
import qsStringify from "qs/lib/stringify";
const qs = {
  stringify: qsStringify,
};
const ajax = {
  // get请求(获取数据)
  get(url, config = {}) {
    return new Promise((resolve, reject) => {
      axios.get(url, { params: config }).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  // post请求(提交数据) qs.stringify(data)
  post(url, data, config = {}) {
    return new Promise((resolve, reject) => {
      axios.post(url, data, config).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  // 更新数据
  put(url, data, config = {}) {
    return new Promise((resolve, reject) => {
      axios.put(url, data, config).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  },
  // 删除数据
  delete(url, config = {}) {
    return new Promise((resolve, reject) => {
      axios.delete(url, config).then((res) => {
        resolve(res)
      }).catch((err) => {
        reject(err)
      })
    })
  }
}

export default ajax
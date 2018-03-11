const config = require('../config/config.js')

const request = function (api, method, header, params, success) {
  wx.showToast({
    icon: "loading",
    title: "加载中...",
    duration: 10000
  })
  wx.request({
    url: config.baseURL + api,
    method: method,
    header: header,
    data: params,
    success: function (res) {
      wx.hideToast()
      success(res)
    },
    fail: function () {
      wx.showToast({
        icon: "loading",
        title: "请检查网络...",
        duration: 10000
      })
    }
  })
}

const get = (api, params, success) => {
  const GET_METHOD = "GET"
  const GET_HEADER = {
    'content-type': 'application/json'
  }
  const paramsWithSecret = { ...params, secretAPI: config.secretAPI}
  request(api, GET_METHOD, GET_HEADER, paramsWithSecret, success)
}

const post = (api, params, success) => {
  const POST_METHOD = "POST"
  const POST_HEADER = {
    'content-type': 'application/json'
  }
  const paramsWithSecret = { ...params, secretAPI: config.secretAPI }
  request(api, POST_METHOD, POST_HEADER, paramsWithSecret, success)
}


module.exports = { Get: get, Post: post }
const config = require('../config/config.js')

function request(api, method, header, params, success) {
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
        title: "请检查网络..."
      })
    }
  })
}

const get = (api, params, success) => {
  const GET_METHOD = "GET"
  const GET_HEADER = {
    'content-type': 'application/json'
  }
  request(api, GET_METHOD, GET_HEADER, params, success)
}

const post = (api, params, success) => {
  const POST_METHOD = "POST"
  const POST_HEADER = {
    'content-type': 'application/json'
  }
  request(api, POST_METHOD, POST_HEADER, params, success)
}


module.exports = { Get: get, Post: post }
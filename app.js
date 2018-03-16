const http = require('./utils/request.js')
const config = require('./config/config.js')

App({
  onLaunch: function () {
    const that = this
    that.login()
  },

  login: function() {
    wx.login({
      success: function(res){
        if(res.code){
          http.Post(config.loginAPI, {code: res.code}, function(res){
            console.log(res)
          })
        }
      }
    })
  }
})
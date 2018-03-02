const app = getApp()
const http = require('../../utils/request.js')
const config = require('../../config/config.js')

Page({
  data: {
    defaultPage: 1,
    currentPage: 1,
    products: []
  },

  loadFirstProducts: function(){
    const that = this
    const params = { page: that.data.defaultPage }
    let products = wx.getStorageSync('products') || []
    if(products == false){
      http.Get(config.productsAPI, params, function (res) {
        if (res.data.status === true) {
          wx.setStorageSync('products', res.data.payload)
          that.setData({
            products: res.data.payload
          })
          return
        }
      })
      return
    }
    that.setData({
      products: products
    })
  },

  refreshProducts: function(){
    const that = this
    const params = { page: that.data.defaultPage }
    that.setData({
      currentPage: 1
    })
    http.Get(config.productsAPI, params, function (res) {
      console.log(res.data)
      if (res.data.status === true) {
        wx.setStorageSync('products', res.data.payload)
        that.setData({
          products: res.data.payload
        })
      }
    })
  },

  onload: function () {
    this.refreshProducts()
  },

  onShow: function () {
    this.loadFirstProducts()
  },

  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    this.refreshProducts()
  },

  onReachBottom: function () {
    const that = this
    that.setData({
      currentPage: that.data.currentPage + 1
    })
    const params = { page: that.data.currentPage }
    http.Get(config.productsAPI, params, function(res){
      if(res.data.status === true){
        wx.setStorageSync('products', that.data.products.concat(res.data.payload))
        that.setData({
          products: that.data.products.concat(res.data.payload)
        }) 
        return
      }
      that.setData({
        currentPage: that.data.currentPage - 1
      })
    })
  }

})

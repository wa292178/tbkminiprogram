const app = getApp()
const http = require('../../utils/request.js')
const config = require('../../config/config.js')
const moment = require('../../utils/moment.js')

Page({
  data: {
    defaultPage: 1,
    currentPage: 1,
    products: [],
    banners: []
  },
  
  loadFirstProducts: function(){
    const that = this
    const params = { page: that.data.defaultPage }
    let products = wx.getStorageSync('products') || []
    let banners = wx.getStorageSync('banners') || []
    if(products == false || banners == false){
      http.Get(config.productsAPI, params, function (res) {
        if (res.data.status === true) {
          wx.setStorageSync('products', res.data.payload)
          that.setData({
            products: res.data.payload
          })
          that.banner()
          return
        }
      })
      return
    }
    that.setData({
      products: products,
      banners: banners
    })
  },

  refreshProducts: function(){
    const that = this
    const params = { page: that.data.defaultPage }
    that.setData({
      currentPage: 1
    })
    http.Get(config.productsAPI, params, function (res) {
      if (res.data.status === true) {
        wx.setStorageSync('products', res.data.payload)
        that.setData({
          products: res.data.payload
        })
        that.banner()
      }
    })
  },

  bindBuy: function(event) {
    const tkl = event.target.dataset.tkl
    const expire = event.target.dataset.createdtimestamp + 2592000
    const current = moment().unix()
    if(expire < current){
      wx.showModal({
        content: '优惠券领完啦!',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#da3764',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return
    }
    wx.setClipboardData({
      data: tkl,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showModal({
              title: '复制成功',
              content: '以复制淘口令，请打开淘宝购买',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#da3764',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            })
          }
        })
      }
    })
  },

  banner: function() {
    const that = this
    const listParams = {
      fields: 'favorites_title, favorites_id, type'
    }
    http.Get(config.favorListAPI, listParams, function(res){
      if(res.data.status === true){
        const favorLists = res.data.payload.results.tbk_favorites
        const bannerIndex = favorLists.findIndex((e) => e.favorites_title ==='banner')
        const bannerParams = {
          fields: 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick,shop_title,zk_final_price_wap,event_start_time,event_end_time,tk_rate,status,type',
          favorites_id: favorLists[bannerIndex].favorites_id,
          adzone_id: config.adzoneId,
          page_size: 5
        }
        http.Get(config.favorItemAPI, bannerParams, function(res){
          if(res.data.status === true){
            const results = res.data.payload.results
            const banners = results.uatm_tbk_item
            wx.setStorageSync('banners', banners)
            that.setData({
              banners: banners
            })
          }
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
  },
  onShareAppMessage: function(res){
    console.log(res)
    return {
      title: '分享',
      success: function(res){
        console.log(res)
      },
      fail: function(res){
        console.log(res)
      }
    }
  }

})

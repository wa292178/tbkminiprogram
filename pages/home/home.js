const app = getApp()
const http = require('../../utils/request.js')
const config = require('../../config/config.js')
const moment = require('../../utils/moment.js')
const util = require('../../utils/util.js')

Page({
  data: {
    navbar: ['首页', '女装', '鞋包', '百货', '母婴', '内衣', '食品', '电器', '男装', '家装', '美妆', '水果', '家纺', '手机', '运动', '汽配'],
    banners: [],
    defaultPage: 1,
    currentPage: 1,
    currentTab: 0,
    pageSize: 20,
    daogou: [],
    results: []
  },

  onload: function () {
    this.initProducts()
  },

  onShow: function () {
    this.initProducts()
  },

  onPullDownRefresh: function () {
    const that = this
    that.setData({
      currentPage: 1
    })
    wx.stopPullDownRefresh()
    if (that.data.currentTab === 0) {
      that.refreshProducts()
    } else {
      that.search(that.data.currentPage, (res) => {
        const results = res.data.payload.results.n_tbk_item
        const newResults = util.resResults(results)
        that.setData({
          results: newResults
        })
      })
    }
  },

  onReachBottom: function () {
    const that = this
    that.setData({
      currentPage: that.data.currentPage + 1
    })
    if (that.data.currentTab === 0) {
      const params = {
        adzone_id: config.adzoneId,
        platform: 2,
        page_size: that.data.pageSize,
        page_no: that.data.currentPage
      }
      http.Get(config.dgItemAPI, params, function (res) {
        if (res.data.status === true) {
          const results = res.data.payload.results.tbk_coupon
          const dgResults = util.resResults(results)
          wx.setStorageSync('daogou', that.data.daogou.concat(dgResults))
          that.setData({
            daogou: that.data.daogou.concat(dgResults)
          })
          return
        }
        that.setData({
          currentPage: that.data.currentPage - 1
        })
      })
    } else if (that.data.currentTab > 0) {
      that.search(that.data.currentTab, function (res) {
        const results = res.data.payload.results.n_tbk_item
        const newResults = util.resResults(results)
        that.setData({
          results: that.data.results.concat(newResults)
        })
      })
    }
  },

  onShareAppMessage: function (res) {
    console.log(res)
    return {
      title: '分享',
      success: function (res) {
        console.log(res)
      },
      fail: function (res) {
        console.log(res)
      }
    }
  },

  swichNav: function (e) {
    const that = this
    let cur = e.target.dataset.current;
    that.setData({
      currentTab: cur,
      currentPage: 1,
      results: []
    })
    if (that.data.currentIndex === 0) {
      that.initProducts()
    } else {
      that.search(cur, function (res) {
        const results = res.data.payload.results.n_tbk_item
        const newResults = util.resResults(results)
        that.setData({
          results: newResults
        })
      })
    }
  },

  bindBuy: function (event) {
    console.log('123')
  },

  search: function (cur, callback) {
    const that = this
    const params = {
      fields: 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick',
      q: that.data.navbar[cur],
      sort: 'total_sales_des',
      platform: 2,
      page_size: that.data.pageSize,
      page_no: that.data.currentPage
    }
    http.Get(config.itemGetAPI, params, function (res) {
      if (res.data.status === true) {
        callback(res)
      }
    })
  },

  banner: function () {
    const that = this
    const listParams = {
      fields: 'favorites_title, favorites_id, type'
    }
    http.Get(config.favorListAPI, listParams, function (res) {
      if (res.data.status === true) {
        const favorLists = res.data.payload.results.tbk_favorites
        const bannerIndex = favorLists.findIndex((e) => e.favorites_title === 'banner')
        const bannerParams = {
          fields: 'num_iid,title,pict_url,small_images,reserve_price,zk_final_price,user_type,provcity,item_url,seller_id,volume,nick,shop_title,zk_final_price_wap,event_start_time,event_end_time,tk_rate,status,type',
          favorites_id: favorLists[bannerIndex].favorites_id,
          adzone_id: config.adzoneId,
          page_size: 5
        }
        http.Get(config.favorItemAPI, bannerParams, function (res) {
          if (res.data.status === true) {
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

  initProducts: function () {
    const that = this
    const params = {
      adzone_id: config.adzoneId,
      platform: 2,
      page_size: that.data.pageSize,
      page_no: that.data.defaultPage
    }
    let daogou = wx.getStorageSync('daogou') || []
    let banners = wx.getStorageSync('banners') || []
    if (daogou == false || banners == false) {
      http.Get(config.dgItemAPI, params, function (res) {
        if (res.data.status === true) {
          const results = res.data.payload.results.tbk_coupon
          const dgResults = util.resResults(results)
          wx.setStorageSync('daogou', dgResults)
          that.setData({
            daogou: dgResults
          })
          that.banner()
          return
        }
      })
      return
    }
    that.setData({
      daogou: daogou,
      banners: banners
    })
  },

  refreshProducts: function () {
    const that = this
    const params = {
      adzone_id: config.adzoneId,
      platform: 2,
      page_size: that.data.pageSize,
      page_no: that.data.defaultPage
    }
    that.setData({
      currentPage: 1
    })
    http.Get(config.dgItemAPI, params, function (res) {
      if (res.data.status === true) {
        const results = res.data.payload.results.tbk_coupon
        const dgResults = util.resResults(results)
        wx.setStorageSync('daogou', dgResults)
        that.setData({
          daogou: dgResults
        })
        that.banner()
      }
    })
  },
})
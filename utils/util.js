const unitConvert = require('./unitConvert.js')

const getCouponPrice = (e) => {
  return Number(e.slice(e.indexOf('减')).replace(/[^0-9]/g, ''))
}

const ellipsisStr = (s) => {
  if(s.length > 30){
    return s.slice(0, 30) + '...'
  }
  return s
}

const resResults = (results) => {
  let newResults = []
  for (let i = 0; i < results.length; i++) {
    if (results[i].coupon_info && results[i].volume && results[i].title){
      const couponPrice = getCouponPrice(results[i].coupon_info)
      const afterCouponPrice = (Number(results[i].zk_final_price) - couponPrice).toFixed(2)
      const volume = unitConvert(results[i].volume)
      const title30 = ellipsisStr(results[i].title)
      const newResult = { ...results[i], couponPrice, afterCouponPrice, volume, title30 }
      newResults.push(newResult)
    } else if (results[i].volume && results[i].title) {
      const volume = unitConvert(results[i].volume)
      const title30 = ellipsisStr(results[i].title)
      const newResult = { ...results[i], volume, title30 }
      newResults.push(newResult)
    }
  }
  return newResults
}

module.exports = { getCouponPrice, resResults}

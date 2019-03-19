var app = getApp();
var $ = require('../../utils/util.js');
var vendorapi = require('../../api/vendorAPI.js');
Page({
  data: {
    Info:[],
  },
  onLoad: function (options) {
    this.GetStoreQuickPayQRCode()
  },
  GetStoreQuickPayQRCode: function () { //收款码
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      storeId: app.globalData.VendorInfo.storeId,
    }
    var that = this;
    $.xsr($.makeUrl(vendorapi.GetStoreQuickPayQRCode, val), function (res) {
      that.setData({
        Info:res.Info[0]
      })
    });
  },
  ImgTap: function (e) {
    var urls=[];
    urls.push(this.data.Info)
    var that = this
    wx.previewImage({
      current: that.data.Info, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  }
})
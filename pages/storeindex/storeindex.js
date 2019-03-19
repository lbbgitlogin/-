var app = getApp();
var $ = require('../../utils/util.js');
var vendorapi = require('../../api/vendorAPI.js');
Page({
  data: {
    Info:[],
    tishi:false
  },
  onLoad: function (options) {
    this.getVendorReport()
  },
  getVendorReport: function () { //销售数据总览
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      storeAccountId: app.globalData.VendorInfo.storeAccountId,
    }
    console.log("valvalvlalv",val)
    var thisobj = this;
    $.xsr($.makeUrl(vendorapi.GetVendorReport, val), function (res) {
      console.log(res)
      if (res.Code == 0 && !$.isNull(res.Info)) {
        thisobj.setData({
          Info: res.Info,
          money: res.Info[0].DataCount.toFixed(2)
        });
        wx.stopPullDownRefresh()
      }
    });
  },
  goorder:function(){
    wx.switchTab({
      url: '../orderlist/orderlist',
    })
  },
  goserve:function(){
    wx.navigateTo({
      url: '../scan/scan',
    })
  },
  goziti:function(){
    wx.navigateTo({
      url: '../draw/draw',
    })
  },
  youhuiquan: function () {
    wx.navigateTo({
      url: '../coupon/coupon',
    })
  },
  gatheringCode: function () {
    wx.navigateTo({
      url: '../gatheringCode/gatheringCode',
    })
  },
  goBack: function () {
    wx.showModal({
      title: '提示',
      content: '是否注销登录',
      success:function(res){
        if (res.confirm) {
          wx.redirectTo({
            url: '../login/login',
          })
          wx.removeStorage({
            key: 'login',
            success: function (res) {

            }
          })
        }
      }
    })
  },
  tips:function(){
    this.setData({
      tishi:true
    })
    var that = this;
    setTimeout(function(){
      that.setData({
        tishi:false
      })
    },2000)
  },
  onPullDownRefresh: function () {
    this.getVendorReport();
  }
})
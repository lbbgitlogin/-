var app = getApp()
var $ = require('../../utils/util.js');
var api = require('../../api/logisticsAPI.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
Page({
  data: {
    deliveryNum: '',
    isShow: false,
    isNum: false,
    vendorId: '',
    shipCode: '',
    OrderInfo: [],
    isorderInfo: false,
    deduction: 0
  },
  onLoad: function (options) {
    var that=this
    this.setData({
      deliveryNum: options.on
    });
    if(!$.isNull(options.on)){
      var val = {
        vendorId: app.globalData.VendorInfo.Id,
        shipCode: options.on,
      }
      $.xsr($.makeUrl(orderapi.GetOrderByShipCode, val), function (res) {
        if ($.isNull(res.Info)) {
          $.alert("货物不存在")
        } else {
          that.setData({
            OrderInfo: res.Info[0],
            isorderInfo: true,
            deduction: res.Info[0].ECardCash + res.Info[0].ExtraCash
          })
        }
      });
    }
   
  },
  inputdeliverynum: function (e) {//服务码号
    this.setData({
      deliveryNum: e.detail.value
    });
    if ($.isNull(e.detail.value)) {
      this.setData({
        isNum: false,
        isShow: false
      });
    } else {
      this.setData({
        isNum: true,
        isShow: true
      });
    }
  },
  find: function () {
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      shipCode: this.data.deliveryNum,
    }
    var that = this
    $.xsr($.makeUrl(orderapi.GetOrderByShipCode, val), function (res) {
      if ($.isNull(res.Info)) {
        $.alert("货物不存在")
      } else {
        that.setData({
          OrderInfo: res.Info[0],
          isShow:false,
          isorderInfo:true,
          deduction: res.Info[0].ECardCash + res.Info[0].ExtraCash
        })
      }
    });
  },
  clearnum: function (e) {
    this.setData({
      deliveryNum: '',
      isNum: false
    });
  },
  sao: function () {
    var that = this;
    wx.scanCode({
      success: function (data) {
        that.setData({
          deliveryNum: data.result
        });
        var val = {
          vendorId: app.globalData.VendorInfo.Id,
          shipCode: that.data.deliveryNum,
        }
        $.xsr($.makeUrl(orderapi.GetOrderByShipCode, val), function (res) {
          if ($.isNull(res.Info)) {
            $.alert("货物不存在")
          } else {
            that.setData({
              OrderInfo: res.Info[0],
              isShow: false,
              isorderInfo: true,
              deduction: res.Info[0].ECardCash + res.Info[0].ExtraCash
            })
          }
        });
      },
      fail: function (data) {
        $.alert("无法识别")
      }
    });
  },
  hexiao: function () {
 
    if ($.isNull(this.data.deliveryNum)){
      wx.showModal({
        title: '提示',
        content: '请输入提货码',
      })
    }
    var that = this
    var val = {
      storeAccountId: app.globalData.VendorInfo.storeAccountId,
      vendorId: app.globalData.VendorInfo.Id,
      shipCode: this.data.deliveryNum,
    }
    $.confirm("是否核销订单", function (res) {
      if (res.confirm) {
        $.xsr($.makeUrl(orderapi.WriteOffUserTakingOrder, val), function (data) {
          if(data.Code==0){
             
            var val = {
                vendorId: app.globalData.VendorInfo.Id,
                shipCode: that.data.deliveryNum,
              }
              $.xsr($.makeUrl(orderapi.GetOrderByShipCode, val), function (res) {
                setTimeout(function () {
                  $.alert("核销成功")
                  that.setData({
                    OrderInfo: res.Info[0],
                    isShow: false,
                    isorderInfo: true
                  })
                  wx.switchTab({
                    url: "../orderlist/orderlist",
                    success: function (e) {
                      var page = getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                      page.onLoad();
                    },
                  })
                }, 1000)
              });
          }else{
            $.alert(data.Msg)
          }
           
        });
      }
    }, true);
  }
})
var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
Page({
  data: {
    OrderInfo: {},
    orderNum: '',
    deduction: 0,
    workerCellPhone: '',
    workerName: '',
    paidan:false,
    StoreId:0,
    VendorStores:[]
  },
  onLoad: function (options) {
    this.setData({
      orderNum: options.on
    });
    this.GetVendorStores()
  },

  onShow: function () {
    this.InitPage();
  },
  InitPage: function () {
    var val = {
      userId: "",
      orderNum: this.data.orderNum
    }
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetServiceOrder, val), function (data) {
      console.log(data)
      thisobj.setData({
        OrderInfo: data.Info[0],
        deduction: data.Info[0].ECardCash + data.Info[0].ExtraCash,
        StoreId: data.Info[0].StoreId
      });
    });
  },
  cancel: function (e) {
    console.log(e)
    wx.navigateTo({
      url: "../ordercancel/ordercancel?orderNum=" + e.currentTarget.dataset.num + "&reasonlist=" + JSON.stringify(e.currentTarget.dataset.reasonlist),
    })
  },
  hexiao:function(){
    wx.navigateTo({
      url: "../scan/scan?on=" + this.data.OrderInfo.ReservationCode
    })
  },
  paidan: function (e) {
    console.log(e)
    this.setData({
      paidan: true,
      orderNum: e.currentTarget.dataset.num
    })
  },
  close1: function () {
    this.setData({
      paidan: false,
    })
  },

  innerout: function () {

  },
  writename: function (e) {
    console.log(e)
    this.setData({
      workerName: e.detail.value
    })
  },
  writephone: function (e) {
    console.log(e)
    this.setData({
      workerCellPhone: e.detail.value
    })
  },
  success: function () {
    var val = {
      orderNum: this.data.orderNum,
      workerName: this.data.workerName,
      workerCellPhone: this.data.workerCellPhone
    }
    if ($.isNull(this.data.workerName)) {
      $.alert('请输入接单人姓名')
      return false
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.workerCellPhone))) {
      $.alert('请输入正确手机号')
      return false
    }
    console.log(val)
    var that = this;
    $.xsr($.makeUrl(orderapi.PrintReceiptServiceOrders, val), function (res) {
      that.setData({
        paidan: false,
      })
      if (res.Code == 0) {
        $.alert('派单成功')
        that.InitPage()
      } else {
        $.alert('派单失败')
      }
    });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      orderUpdateType:2,
      updaeStoreId: this.data.StoreId,
      updateReservationTime: e.detail.value + ' ' + this.data.OrderInfo.ReservationServiceTimeText 
    });
    this.UpdateServiceOrderInfo();
    this.onShow();
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value,
      orderUpdateType: 2,
      updaeStoreId: this.data.StoreId,
      updateReservationTime: this.data.OrderInfo.ReservationServiceDateText + ' ' + e.detail.value
    });
    this.UpdateServiceOrderInfo();
    this.onShow();
  },
  bindPickerChange: function (e) {//选择物流发货
    console.log('picker发送选择改变，携带值为', this.data.VendorStores[e.detail.value])
    this.setData({
      index: e.detail.value,
      StoreId: this.data.VendorStores[e.detail.value].Id
    })
    this.setData({
      date: e.detail.value,
      orderUpdateType: 1,
      updaeStoreId: this.data.VendorStores[e.detail.value].Id,
      updateReservationTime: this.data.OrderInfo.ReservationServiceDateText + ' ' + this.data.OrderInfo.ReservationServiceTimeText 
    });
    this.UpdateServiceOrderInfo();
    this.onShow();
  },
  UpdateServiceOrderInfo: function () {
    var val = {
      orderNum: this.data.orderNum,
      orderUpdateType: this.data.orderUpdateType,
      updaeStoreId: this.data.StoreId,
      updateReservationTime: this.data.updateReservationTime
    }
    console.log(val)
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.UpdateServiceOrderInfo, val), function (data) {
      console.log(data)
    });
  },
  GetVendorStores: function () {
    var val = {
      vendorId: app.globalData.VendorInfo.Id
    }
    var that = this;
    $.xsr($.makeUrl(orderapi.GetVendorStores, val), function (data) {
      console.log(data)
      that.setData({
        VendorStores:data.Info[0]
      })
    });
  },
  
})
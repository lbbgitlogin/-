var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
Page({
  data: {
    info: {},
    orderNum: ''
  },
  onLoad: function (options) {
    this.setData({
      orderNum: options.on
    });
    this.InitPage()
  },
  InitPage: function () {
    var val = {
      userId: "",
      orderNum: this.data.orderNum
    }
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetOrderByOrderNum, val), function (data) {
      thisobj.setData({
        info: data.Info[0]
      });
    });
  }
})
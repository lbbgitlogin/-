var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
Page({
  data: {
    OrderInfo: {},
    orderNum: '',
    deduction: 0
  },
  onLoad: function (options) {
    this.setData({
      orderNum: options.on
    });
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
    $.xsr($.makeUrl(orderapi.GetOrderByOrderNum, val), function (data) {
      thisobj.setData({
        OrderInfo: data.Info[0],
        deduction: data.Info[0].ECardCash + data.Info[0].ExtraCash
      });
    });
  }
})
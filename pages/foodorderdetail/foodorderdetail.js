var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
Page({
  data: {
    OrderInfo: {},
    orderNum: '',
    deduction: 0,
    img:"",
    venName:"",
    peopo:0,
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
      vendorId: app.globalData.VendorInfo.Id,
      orderNum: this.data.orderNum
    }
    console.log(val)
    var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetMealOrder, val), function (data) {
      console.log(data)
      thisobj.setData({
        img: data.Info[0].VendorLogoPath,
        venName: data.Info[0].VendorName,
        peopo: data.Info[0].GuestCount,
        OrderInfo: data.Info[0],
        deduction: data.Info[0].ECardCash + data.Info[0].ExtraCash
      });
    });
  }
})
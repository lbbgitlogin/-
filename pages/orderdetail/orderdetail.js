var app = getApp();
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
Page({
	data: {
		OrderInfo: {},
		orderNum:'',
    deduction:0
	},
	onLoad:function(options) {
		this.setData({
			orderNum:options.on
		});
	},

	onShow:function(){
		this.InitPage();
	},
	InitPage:function(){
		var val = {
			userId: "",
			orderNum: this.data.orderNum
		}
		var thisobj = this;
    $.xsr($.makeUrl(orderapi.GetOrderByOrderNum, val), function(data) {
      console.log(data)
			thisobj.setData({
				OrderInfo: data.Info[0],
        deduction: data.Info[0].ECardCash + data.Info[0].ExtraCash
			});
		});
	},
  look:function(){
    wx.navigateTo({
      url: '../logisticsprogress/logisticsprogress?on=' + this.data.orderNum,
    })
  },
  sendout: function (e) {//发货 
    wx.navigateTo({
      url: "../sendoutgoods/sendoutgoods?on=" + this.data.orderNum,
    })
  },
  hexiao: function () {
      wx.navigateTo({
        url: '../draw/draw?on=' + this.data.OrderInfo.ShipCode,
      })
  },
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })
  },
  quxiaopeisong:function(e){//取消配送
  console.log(e)
    wx.navigateTo({
      url: '../ordercancel/ordercancel?num=' + 1 + "&VendorId=" + e.currentTarget.dataset.id + "&ordernum=" + e.currentTarget.dataset.ordernum,
    })
  }
})
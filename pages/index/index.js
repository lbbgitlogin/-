var app = getApp();
var $ = require('../../utils/util.js');
var vendorapi = require('../../api/vendorAPI.js');
Page({
	data: {
		Info:[],
		money:''
	},
	onLoad:function(){
    wx.showTabBar({
    })
	},
	onShow:function(){
		this.getVendorReport();
	},
  sao: function () {
    wx.scanCode({
      success: function (data) {
        $.alert("可以识别")
        console.log(data.result)
      },
      fail: function (data) {
        $.alert("无法识别")
      }
    });
  },
	getVendorReport:function() { //销售数据总览
		var val = {
			vendorId: app.globalData.VendorInfo.Id,
      storeAccountId: app.globalData.VendorInfo.storeAccountId,
		}
    console.log(val)
		var thisobj = this;
		$.xsr($.makeUrl(vendorapi.GetVendorReport, val), function(res) {
      console.log("销售数据总览",res)
			if(res.Code == 0 && !$.isNull(res.Info)){
				thisobj.setData({
					Info:res.Info,
					money:res.Info[0].DataCount.toFixed(2)
				});
        wx.stopPullDownRefresh()
			}
		});
	},
	onPullDownRefresh:function(){
    this.getVendorReport();
    
  }
})
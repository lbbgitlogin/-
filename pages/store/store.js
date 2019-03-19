var app = getApp()
var $ = require('../../utils/util.js');
var vendorapi = require('../../api/vendorAPI.js');

Page({
	data: {
		ShopName: '',
		Phone: '',
		LogoPath: ''
	},

	onLoad: function () {
 

		this.setData({
			ShopName: app.globalData.VendorInfo.UserAccount,
      LogoPath: app.globalData.VendorInfo.WapLogoPath
		});
	},
	onShow: function () {
		this.setData({
			Phone: app.globalData.VendorInfo.Phone
		});
	},
  goBack:function(){
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
        } else if (res.cancel) {
          
        }
      }
    })
  }
})
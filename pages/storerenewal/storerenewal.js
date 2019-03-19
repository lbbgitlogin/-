var app = getApp();
var $ = require('../../utils/util.js');
var vendorapi = require('../../api/vendorAPI.js');
Page({
	data: {
		ShopName:'',
		Phone:'',
		LogoPath:'',
		VendorLicenseEndTimeText:'',
		VendorLicenseRemainingDays:'',
		Store:{}
	},

	onLoad:function(){
		this.setData({
			ShopName:app.globalData.VendorInfo.UserAccount,
			Phone:app.globalData.VendorInfo.Phone,
      LogoPath: app.globalData.VendorInfo.WapLogoPath,
			VendorLicenseEndTimeText:app.globalData.VendorInfo.VendorLicenseEndTimeText,
			VendorLicenseRemainingDays:app.globalData.VendorInfo.VendorLicenseRemainingDays,
		});
		this.getAgentInfo();
	},

  getAgentInfo: function () { //获取服务商信息
		var val = {
			vendorId: app.globalData.VendorInfo.Id,
		}
		var thisobj = this;
		$.xsr($.makeUrl(vendorapi.GetAgent, val), function(res) {
			if(res.Code == 0 && !$.isNull(res.Info)){
				thisobj.setData({
					Store:res.Info
				});
			}
		});
	},
	
})
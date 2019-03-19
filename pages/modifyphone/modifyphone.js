var app = getApp();
var $ = require('../../utils/util.js');
var api = require('../../api/loginAPI.js');
Page({
	data: {
		Phone: "",
		Code: "",
		NewPsd: "",
		btntext: "获取验证码",
		isSend: true, //是否可以再次发送
		isPhone: false, //手机是否验证通过
		sendTime: 120, //再次发送时间
		isCode: false, //验证码是否通过
		isNewPsd: false,//验证码是否通过
		PasswordFocus: false,
		eyetype: true

	},
	inputphone: function (e) {//输入手机号
		this.setData({
      Phone: e.detail.value.replace(/\s+/g, '')
		});
	},

	inputnewpsd: function (e) {//输入新密码
		this.setData({
      NewPsd: e.detail.value.replace(/\s+/g, '')
		});
	},
	inputcode: function (e) {//输入验证码
		this.setData({
      Code: e.detail.value.replace(/\s+/g, '')
		});
	},
	clearphone: function (e) {//清除手机号
		this.setData({
			isPhone: false,
			Phone: ''
		});
	},
	changetype: function () {//更改看密码状态
		this.setData({
			PasswordFocus: true,
			eyetype: !this.data.eyetype
		});

	},

	sendmessage: function () {
		if ($.isNull(this.data.Phone)) {
			$.alert("请输入手机号");
		} else if (!(/^1[34578]\d{9}$/.test(this.data.Phone))) {
			$.alert("手机号格式不正确");
		} else if (app.globalData.VendorInfo.Phone == this.data.Phone) {
			$.alert("新手机号不能与原手机号相同");
		} else {
			if (this.data.isSend) {
				this.setData({
					isSend: false
				});
				var thisobj = this;
				var time = this.data.sendTime;
				//开始发送
				var val = {
					cellPhone: this.data.Phone,
					userAccount: app.globalData.VendorInfo.UserAccount,
					smsType: "VENDORUPDATEPHONE"
				}
				$.xsr($.makeUrl(api.SendSmsCode, val), function (data) {
					if (data.Code == 0) {
						$.alert("短信发送成功");
						var inter = setInterval(function () {
							if (time > 0) {
								thisobj.setData({
									btntext: (time--) + "s"
								});
							} else {
								thisobj.setData({
									isSend: true,
									sendTime: 120,
									btntext: "重新发送"
								});
								clearInterval(inter);
							}
						}, 1000);
					} else {
						$.alert(data.Msg);
						thisobj.setData({
							isSend: true
						});
					}
				});
			}
		}
	},
	submitdata: function () { //提交数据
		if ($.isNull(this.data.Phone)) {
			$.alert("请输入手机号");
			return;
		}
		if (!(/^1[34578]\d{9}$/.test(this.data.Phone))) {
			$.alert("手机号格式不正确");
			return;
		}

		if (app.globalData.VendorInfo.Phone == this.data.Phone) {
			$.alert("新手机号不能与原手机号相同");
			return;
		}

		if ($.isNull(this.data.Code)) {
			$.alert("请输入验证码");
			return;
		}
		if (this.data.Code.length < 6) {
			$.alert("请输入6位验证码");
			return;
		}
		if (!(/^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test(this.data.NewPsd))) {
			$.alert("请输入6-20个字符，英文、数字及符号任意两者组合");
		} else {
			var val1 = {
				smsCode: this.data.Code,
				cellPhone: this.data.Phone,
				smsType: "VENDORUPDATEPHONE"
			}
			var that = this;
			$.xsr($.makeUrl(api.ValidateSmsCode, val1), function (data) {
				if (data.Code == 0) {
					var val2 = {
						userAccount: app.globalData.VendorInfo.UserAccount,
						password: that.data.NewPsd,
						newCellPhone: that.data.Phone,
						smsCode: that.data.Code
					}
					$.xsr($.makeUrl(api.ChangeCellPhone, val2), function (data) {
						if (data.Code == 0) {
							app.globalData.VendorInfo.Phone = that.data.Phone;
							$.alert("修改手机成功");
							setTimeout(function () {
								$.backpage(1, function () { });
							}, 1000);
						} else {
							$.alert(data.Msg);
						}
					});

				} else {
					$.alert(data.Msg);
				}
			});

		}

	}
})
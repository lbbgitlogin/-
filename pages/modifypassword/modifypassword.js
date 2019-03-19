var app = getApp()
var $ = require('../../utils/util.js');
var api = require('../../api/loginAPI.js');

Page({
	data: {
		OldPsd: "",
		NewPsd: "",
		isOldPsd: false,
		isNewPsd: false,
		eyetypeold: true,
		PasswordOldFocus: false,
		PasswordNewFocus: false,
		eyetypenew: true
	},

	inputoldpsd: function (e) {//输入旧密码
		this.setData({
			OldPsd: e.detail.value
		});
	},
	inputnewpsd: function (e) {//输入新密码
		this.setData({
			NewPsd: e.detail.value
		});
	},

	changetypeold: function () {//更改看密码状态
		this.setData({
			PasswordOldFocus: true,
			eyetypeold: !this.data.eyetypeold
		});

	},
	changetypenew: function () {//更改看密码状态
		this.setData({
			PasswordNewFocus: true,
			eyetypenew: !this.data.eyetypenew
		});
	},

	submitdata: function () { //提交数据
		if ($.isNull(this.data.OldPsd)) {
			$.alert("请输入原密码！");
			return;
		}
		if ($.isNull(this.data.NewPsd)) {
			$.alert("请输入新密码！");
			return;
		}
		if (!(/^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test(this.data.NewPsd))) {
			$.alert("新密码：请输入6-20个字符，英文、数字及符号任意两者组合");
		} else if (this.data.OldPsd == this.data.NewPsd) {
			$.alert("新密码不能与原密码相同！");
		} else {
			var val = {
				userAccount: app.globalData.VendorInfo.UserAccount,
				oldPassword: this.data.OldPsd,
				newPassword: this.data.NewPsd
			}
			var that = this;
			$.xsr($.makeUrl(api.ChangePassword, val), function (data) {
				if (data.Code == 0) {
					$.alert("密码修改成功");
					setTimeout(function () {
						$.backpage(1, function () { });
					}, 1000);
				} else {
					$.alert(data.Msg);
				}
			});

		}
	}
})
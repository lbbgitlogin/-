var $ = require('../../utils/util.js');
var api = require('../../api/loginAPI.js');
Page({
	data: {
		Phone: "", 
		Code: "",
		NewPsd: "",
    inputusername:"",
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
			Phone: e.detail.value
		});
	},
  inputusername: function (e) {//输入账号
    this.setData({
      inputusername: e.detail.value.replace(/\s+/g, '')
    });
    console.log("inputusername", this.data.inputusername)
  },
	inputnewpsd: function (e) {//输入新密码
		this.setData({
			NewPsd: e.detail.value
		});
	},
	inputcode: function (e) {//输入验证码
		this.setData({
			Code: e.detail.value
		});
	},
	clearphone: function (e) {//清除手机号
		this.setData({
			Phone: ''
		});
	},
  clearuser: function (e) {//清账号
    this.setData({
      inputusername: ''
    });
  },
	changetype: function () {//更改看密码状态
		this.setData({
			PasswordFocus:true,
			eyetype: !this.data.eyetype
		});
	},

	sendmessage: function () {
    if ($.isNull(this.data.inputusername)) {
      $.alert("请输入账号");
      return
    }
		if ($.isNull(this.data.Phone)) {
			$.alert("请输入手机号");
		} else if (!(/^1[34578]\d{9}$/.test(this.data.Phone))) {
			$.alert("手机号格式不正确");
		} else {
			if (this.data.isSend) {
				this.setData({
					isSend: false
				});
				var time = this.data.sendTime;
				//开始发送
				var val = {
					cellPhone: this.data.Phone,
					userAccount: '',
					smsType: "VENDORFORGETPWD"
				}
				var thisobj = this;
				$.xsr($.makeUrl(api.SendSmsCode, val), function (data) {
					if (data.Code == 0) {
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
    if ($.isNull(this.data.inputusername)) {
			$.alert("请输入账号");
			return;
		}
    if ($.isNull(this.data.Phone)) {
      $.alert("请输入手机号");
      return;
    }
		if (!(/^1[34578]\d{9}$/.test(this.data.Phone))) {
			$.alert("手机号格式不正确");
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
				smsType: "VENDORFORGETPWD",
				cellPhone: this.data.Phone,
				smsCode: this.data.Code
			}
			var that = this;
			$.xsr($.makeUrl(api.ValidateSmsCode, val1), function (data) {
        
				if (data.Code == 0) {
					var val2 = {
						cellPhone: that.data.Phone,
						newPassword: that.data.NewPsd,
						smsCode: that.data.Code,
            userAccount: that.data.inputusername
					}
					$.xsr($.makeUrl(api.ResetPassword, val2), function (data) {
            
						if (data.Code == 0) {
							$.alert("修改成功！");
							setTimeout(function(){
								$.backpage(1, function () {});
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
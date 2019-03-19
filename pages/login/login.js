var app = getApp()
var $ = require('../../utils/util.js');

Page({
	data: {
		username: '',
		isUsername: false,
		password: '',
		isPassword: false,
		eyetype: true,
		PasswordFocus: false,
		count: 0,
    type:2
	},
	onLoad:function(){
    var that=this
		if(!$.isNull(app.globalData.VendorInfo)){
			this.setData({
				// username:app.globalData.VendorInfo.UserAccount
			});
		}
    wx.getStorage({
      key: 'key777',
      success: function (res) {
        console.log(res)
        that.setData({
          username: res.data
        })
      },
    })
    wx.getStorage({
      key: 'type',
      success: function(res) {
        console.log(res)
        that.setData({
          type:res.data
        })
      },
    })
    wx.getStorage({
      key: 'login',
      success: function (res) {
        console.log(res)
        that.setData({
          username: res.data.username,
          password: res.data.password,
        })
        var val = {
          UserAccount: res.data.username,
          Password: res.data.password,
          needAudit: true,
          vendorOrStoreType: that.data.type
        }
        app.GetVenderInfo(function () {
          if (that.data.type == 2) {
            wx.switchTab({
              url: '../index/index'
            })
          }
          if (that.data.type == 4) {
            wx.redirectTo({
              url: '../storeindex/storeindex'
            })
          }
        }, val);
      },
    })
	},

	onShareAppMessage: function () {
		return {
			title: "酷客多商家版",
			path: '/pages/login/login'
		}
	},
	
	inputusername: function (e) {//输入用户名

		this.setData({
      username: e.detail.value.replace(/\s+/g, '')
		});
    wx.setStorage({
      key: 'key777',
      data: this.data.username,
      success: function (res) {
        console.log('异步保存成功', res)
      }
    })
	},
	inputpassword: function (e) {//输入密码
		this.setData({
			password: e.detail.value
		});
	},
	clearusername: function () {//清除用户名
		this.setData({
			isUsername: false,
			username: ''
		});
	},
	changetype: function () {//清除密码
		this.setData({
			PasswordFocus:true,
			eyetype:!this.data.eyetype
		});
	},

	login: function () {
    var that=this
		if ($.isNull(this.data.username)) {
			$.alert("请输入用户名");
			return;
		}
		if ($.isNull(this.data.password)) {
			$.alert("请输入密码");
			return;
		}
    
		var val = {
			UserAccount: this.data.username,
			Password: this.data.password,
			needAudit: true,
      vendorOrStoreType: this.data.type
		}
		var that = this;
		app.GetVenderInfo(function () {
			setTimeout(function () {
        if(that.data.type==2){
          wx.switchTab({
            url: '../index/index'
          })
        }
				if(that.data.type==4){
          wx.redirectTo({
            url: '../storeindex/storeindex'
          })
        }
			}, 500);
      var obj={
        username: that.data.username,
        password: that.data.password,
        
      }
      wx.setStorage({
        key: 'login',
        data: obj,
      })
      wx.setStorage({
        key: 'type',
        data: that.data.type,
      })
		}, val);
	},
  vendor:function(){
    this.setData({
      type:2
    })
  },
  store: function () {
    this.setData({
      type: 4
    })
  },
})
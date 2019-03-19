var app = getApp()
var $ = require('../../utils/util.js');
var api = require('../../api/loginAPI.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checknum:0,
    phone:"",
    sethiitory:"",//本地缓冲商家名
    code:"",
    isshowchannelCode:2,
    coderegi:"",//扫码进入页面码的值
    showcode:"", //判断是否扫码进入
    btntext: "获取验证码",
    isSend: true, //是否可以再次发送
    isPhone: false, //手机是否验证通过
    sendTime: 120, //再次发送时间
    isCode: false, //验证码是否通过
    isNewPsd: false,//验证码是否通过
    PasswordFocus: false,
    eyetype: true,
    truecode:"",
    userAccount:"",
    passWord:"",
    comPassWord:"",
    channelCode:"",
    channelCode11:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options:", options.AgentChannelCode)
    if (options.AgentChannelCode == undefined ){
      this.setData({
        showcode:1
      })
    }else{
      this.setData({
        showcode: 2,
        coderegi: options.AgentChannelCode
      })
    }
  },
  check:function(){ //勾选协议
  var that=this;
    that.setData({
      checknum: 1
    })

  },
  checktr: function () {
    var that = this;
    that.setData({
      checknum: 0
    })

  },
 
  agreement:function(){//查看协议内容
    wx.navigateTo({
      url: '../agreement/agreement',
  
    })
  },
  phone: function (e) {//输入手机号
    this.setData({
      phone: e.detail.value
    });
  },
  code: function (e) {//输入验证码
    this.setData({
      code: e.detail.value
    });
  },
  userAccount: function (e) {//输入账号
    this.setData({
      userAccount: e.detail.value.replace(/\s+/g, '')
    });
  },
  passWord: function (e) {//输入密码
    this.setData({
      passWord: e.detail.value
    });
  },
  comPassWord: function (e) {//输入确认密码
    this.setData({
      comPassWord: e.detail.value
    });
  },
  channelCode: function (e) {//输入邀请码
  console.log("邀请码",e)
    this.setData({
      channelCode: e.detail.value
    });
  },
  formSubmit: function (e) {//下一步     
   console.log("注册点击：",e)
    if ($.isNull(this.data.userAccount)) {
      $.alert("请输入账号");
      return;
    }
    if (this.data.userAccount == this.data.passWord) {
      setTimeout(function () {
        wx.showModal({
          title: '提示',
          content: '账号密码不能相同',
          success: function (res) {
          }
        })
      }, 1000)
      return;
    }
    if (this.data.userAccount.length < 6) {
      $.alert("账号格式错误");
      return;
    }
    if ($.isNull(this.data.passWord)) {
      $.alert("请输入密码");
      return;
    }
    if (!(/^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test(this.data.passWord))) {
      $.alert("密码格式错误");
      return;
    }
    if ($.isNull(this.data.comPassWord)) {
      $.alert("请确认密码");
      return;
    }
    if (!(/^((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{6,20}$/.test(this.data.comPassWord))) {
      $.alert("密码格式错误");
      return;
    }
    if ($.isNull(this.data.phone)) {
      $.alert("请输入手机号");
      return;
    }
    let str = /^1\d{10}$/
    if (str.test(this.data.phone)) {
      
    }else{
      $.alert("手机号格式错误");
      return;
    }
    if ($.isNull(this.data.code)) {
      $.alert("请输入验证码");
      return;
    }
    if (this.data.code.length < 6) {
      $.alert("请输入6位验证码");
      return;
    }
    if (this.data.code != this.data.truecode  ) {
      $.alert("验证码输入错误");
      return;
    }
    if ($.isNull(e.detail.value.channelCode)) {
      this.setData({
        isshowchannelCode:1,
        channelCode11: '1217898988'
      })
    }else{
      this.setData({
        isshowchannelCode: 2
      })
    }
    if (this.data.passWord != this.data.comPassWord){
      $.alert("密码不一致");
      return;
    }
    if (this.data.checknum == 0){
      $.alert("请同意协议!");
      return;
    }

    	var val = {
        userAccount: e.detail.value.userAccount,  //商家账号
        passWord: e.detail.value.passWord,	//密码
        comPassWord: e.detail.value.comPassWord, // 确认密码
        phone: e.detail.value.phone,		//注册手机号
        code: e.detail.value.code,		//手机验证码
        channelCode: e.detail.value.channelCode || this.data.channelCode11//邀请码
				}
        console.log("注册val:",val)
				var thisobj = this;
    $.xsr($.makeUrl(api.VendorRegister, val), function (data) {
				console.log("注册：",data)
        thisobj.setData({
          sethiitory: data.Info[0].UserAccount


        })
      wx.setStorage({
        key: 'key777',
        data: thisobj.data.sethiitory,
        success: function (res) {
          console.log('异步保存成功',res)
        }
      })
      if (data.Code == 0 && data.Info[0] != -1 && data.Info[0] != -7 && data.Info[0] != -2 && data.Info[0] != -3 && data.Info[0] != -4 && data.Info[0] != -5 && data.Info[0] != -6 ) {
        wx.navigateTo({
          url: '../nextregi/nextregi',

        }) 
      } else if (data.Code == 0 && data.Info[0]== -1){
        $.alert("账号存在");
        return;
      } else if (data.Code == 0 && data.Info[0] == -2) {
        $.alert("账号为空");
        return;
      } else if (data.Code == 0 && data.Info[0] == -3) {
        $.alert("密码格式不对");
        return;
      } else if (data.Code == 0 && data.Info[0] == -4) {
        $.alert("密码不一致");
        return;
      } else if (data.Code == 0 && data.Info[0] == -5) {
        $.alert("手机号不一致");
        return;
      } else if (data.Code == 0 && data.Info[0] == -6) {
        $.alert("验证码不一致");
        return;
      } else if (data.Code == 0 && data.Info[0] == -7) {
        $.alert("邀请码错误");
        return;
      }else{
        $.alert(data.Msg)
      }
				});

   


  },
  sendmessage: function () { //获取验证码
    if ($.isNull(this.data.phone)) {
      $.alert("请输入手机号");
    } else if (!(/^1\d{10}$/.test(this.data.phone))) {
      $.alert("手机号格式不正确");
    } else if ($.isNull(this.data.userAccount)) {
      $.alert("账号为空");
    } else {
      if (this.data.isSend) {
        this.setData({
          isSend: false
        });
        var time = this.data.sendTime;
        //开始发送
        var val = {
          phone: this.data.phone,
          userAccount: this.data.userAccount,
        }
        var thisobj = this;
        console.log("验证码val",val)
        $.xsr($.makeUrl(api.GetCheckCode, val), function (data) {
          console.log("验证码返回：",data)
          if (data.Code == 0 && data.Info[0] != -20) {
            var inter = setInterval(function () {
              if (time > 0) {
                thisobj.setData({
                  btntext: (time--) + "s",
                  truecode: data.Info[0]
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
          } else if (data.Code == 0 && data.Info[0] == -20){

            setTimeout(function () {
              wx.showModal({
                title: '提示',
                content: '上条短信发送未超过2分钟请耐心等待',
                success: function (res) {
                  // if (res.confirm) {
                  //   console.log('用户点击确定')
                  // }
                }
              })
              // $.alert(data.Msg);
              thisobj.setData({
                isSend: true
              });
            }, 1000)
          

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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
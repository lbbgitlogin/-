// pages/nextregi/nextregi.js
var app = getApp()
var $ = require('../../utils/util.js');
var api = require('../../api/loginAPI.js');
var notice = require('../../utils/notice.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessName: "",
    personName: "",
    FId: "",
    SId: "",
    fidname: "",
    sidname: "",
    roleFunList: [],
    testnum: "", //商家名
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    wx.getStorage({ //获取本地缓存
      key: "key777",
      success: function(res) {
        console.log("获取商家名", res)
        that.setData({
          testnum: res.data
        });
      },
    })
    var that = this;
    notice.addNotification("RefreshOrder1", that.RefreshOrder1, that);
  },


  select: function() {
    wx.navigateTo({
      url: '../select/select',
    })

  },

  businessName: function(e) { //输入公司名称
    this.setData({
      businessName: e.detail.value.replace(/\s+/g, '')
    });
  },
  RefreshOrder1: function(info) { //刷新订单
    console.log("info1", info)
    var that = this;
    that.setData({
      FId: info.FId,
      fidname: info.fidname,
      SId: info.SId,
      sidname: info.sidname[0]
    })

    var roleFunList = "";
    // for (var i = 0; i <this.data.SId.length; i++) {
    roleFunList += this.data.SId;
    // roleFunList += ","; 
    that.setData({
      roleFunList: roleFunList
    })
    // }
    // if (roleFunList[roleFunList.length - 1] == ','){

    // }
    // console.log("info2", info)
    // console.log("info3", roleFunList)
    // console.log("info4", roleFunList[roleFunList.length-1])
  },

  personName: function(e) { //输入姓名
    this.setData({
      personName: e.detail.value.replace(/\s+/g, '')
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  formSubmit: function(e) { //下一步     
    console.log("注册点击：", e)
    if ($.isNull(this.data.businessName)) {
      $.alert("请输入公司名称");
      return;
    }
    if ($.isNull(this.data.personName)) {
      $.alert("请输入姓名");
      return;
    }
    if ($.isNull(this.data.fidname)) {
      $.alert("请选择类目");
      return;
    }

    var val = {
      userAccount: this.data.testnum, //商家账号
      categoryId: this.data.FId, //一级id
      childcategoryId: this.data.roleFunList, //二级id
      businessName: e.detail.value.businessName, //		企业信息
      personName: e.detail.value.personName, //		法人姓名
    }
    console.log("was注册val:", val)
    var thisobj = this;
    $.xsr($.makeUrl(api.VendorSettingMsg, val), function(data) {
      console.log("ws注册：", data)
      if (data.Code == 0 && data.Info[0] != -1) {
        wx.navigateTo({
          url: '../suclogin/suclogin',
        })
      } else {
        $.alert(data.Msg)
      }
    })



  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
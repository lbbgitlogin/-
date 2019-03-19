var app = getApp()
var $ = require('../../utils/util.js');
var api = require('../../api/logisticsAPI.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
Page({
  data: {
    deliveryNum: '',
    isShow: false,
    isNum: false,
    vendorId: '',
    shipCode: '',
    SuitProduct: [],
    flag: true, //是否可以进行下次分页
    PageIndex: 1,
    pageSize: 10,
    OrderInfo: [],
    isorderInfo: false,
    deduction: 0,
    souval: '',
    ispage: false,
    inputshow: false,
  },
  onLoad: function(options) {


  },
  inputdeliverynum: function(e) { //服务码号

    this.setData({
      deliveryNum: e.detail.value.replace(/\s+/g, '')
    });
    if ($.isNull(e.detail.value)) {
      this.setData({
        isNum: false,
        isShow: false,
        isorderInfo: false
      });
    } else {
      this.setData({
        isNum: true,
        isShow: true
      });
    }
  },
  find: function() {

    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      writeOffCode: this.data.deliveryNum,
    }
    var that = this
    $.xsr($.makeUrl(orderapi.GetCouponInfoByWriteOffCode, val), function(res) {
    
      if ($.isNull(res.Info)) {
        $.alert("优惠券不存在")
      } else {
        that.setData({
          OrderInfo: res.Info,
          CouponItemId: res.Info.CouponItemId,
          SuitProduct: res.Info.CounponProductList,
          CouponId: res.Info.CouponId,
          isShow: false,
          isorderInfo: true
        })
      }
    });
  },
  inputs: function() {
    var that = this;
    that.setData({
      inputshow: true
    })

  },
  clearnum: function(e) {
    this.setData({
      deliveryNum: '',
      isNum: false
    });
  },
  sao: function() {
   
    var that = this;
    that.setData({
      souval: ""
    })
    wx.scanCode({
      success: function(data) {
        that.setData({
          deliveryNum: data.result,
          isorderInfo: true //显示查询结果
        });
        var val = {
          vendorId: app.globalData.VendorInfo.Id,
          writeOffCode: that.data.deliveryNum,
        }
        $.xsr($.makeUrl(orderapi.GetCouponInfoByWriteOffCode, val), function(res) {
       
          if ($.isNull(res.Info)) {
            $.alert("优惠券不存在")
          } else {
            that.setData({
              OrderInfo: res.Info, //优惠券信息
              CouponItemId: res.Info.CouponItemId,
              SuitProduct: res.Info.CounponProductList, //优惠券适用商品
              CouponId: res.Info.CouponId,
              isShow: false
            })
          }
        });
      },
      fail: function(data) {
        $.alert("无法识别")
      }
    });
  },
  startinput: function(e) { //搜索框获取焦点
    this.setData({
      souval: e.detail.value.replace(/\s+/g, '') //搜索内容
    });
  },
  overinput: function(e) { //失去焦点，展示另外一个输入框
    // this.setData({
    //   inputshow: false,
    //   ispage: false
    // });
  },
  onReachBottom: function() { //进行分页
    if (this.data.flag) { //判断是否可以进行下次分页
      var that = this;
      that.setData({
        PageIndex: parseInt(that.data.PageIndex) + 1
      });
      this.getProductList();
    }
  },
  getProductList() {
    
    var that = this;
    var val = {
      VendorId: app.globalData.VendorInfo.Id,
      PageIndex: that.data.PageIndex,
      PageSize: that.data.pageSize,
      CouponId: that.data.CouponId,
      ProductNameOrCode: that.data.souval,
      type: 1
    }
  
    $.xsr($.makeUrl(orderapi.GetCouponLimitProduct, val), function(res) {
     
      if (res.Info != null && res.Code != 1) {
        if (res.Info.length < 10) {
          that.setData({
            SuitProduct: that.data.SuitProduct.concat(res.Info),
            flag: false
          })
        } else {
          that.setData({
            SuitProduct: that.data.SuitProduct.concat(res.Info),
            flag: true
          })
        }
      } else {
        that.setData({
          ispage: false
        })
      }
    });
  },
  search: function() { //搜索适用商品

    this.setData({
      SuitProduct:[],
      PageIndex: 1
    });
    this.getProductList();
  },
  hexiao: function() {
    if ($.isNull(this.data.deliveryNum)) {
      wx.showModal({
        title: '提示',
        content: '请输入优惠券核销码',
      })
    }
    var that = this
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      couponItemId: that.data.CouponItemId
    }
    $.confirm("是否核销优惠券", function(res) {
      if (res.confirm) {
        $.xsr($.makeUrl(orderapi.CouponOfflineWriteOff, val), function(data) {
          if (data.Code == 0) {
            $.alert("核销成功")
            that.find()
            // var val = {
            //   vendorId: app.globalData.VendorInfo.Id,
            //   shipCode: that.data.deliveryNum,
            // }
            // $.xsr($.makeUrl(orderapi.GetOrderByShipCode, val), function (res) {

            //   that.setData({
            //     OrderInfo: res.Info[0],
            //     isShow: false,
            //     isorderInfo: true
            //   })
            // });
          } else {
            $.alert(data.Msg, function() {
              setTimeout(() => {
                that.find();
              }, 650)
            })
            // $.alert(data.Msg);

          }

        });
      }
    }, true);
  }
})
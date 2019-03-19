var app = getApp()
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
Page({
  data: {
    reasonlist:[],
    orderNum:"",
    lastReasonId:0,
    show:false,
    cancelReasonId:0,
    remark:'',
    peinum:0,
    VendorId:0,
    ordernum:""
  },
  onLoad: function (options) {
 var that=this;
 console.log(options)
 that.setData({
   VendorId: options.VendorId,
   ordernum: options.ordernum,
 })
    if (options.num == 1) {
      $.xsr($.makeUrl(orderapi.CancelReson), function (res) {
        console.log("tianweijiang",res)
        if (res.Code == 0) {
          that.setData({
            reasonlist:res.Info[0],
            peinum: options.num
          })
        } else {
           $.alert(data.Msg)
        }
      })
    }else{
      console.log("hah", options)
      //console.log(JSON.parse(options.reasonlist))
      that.setData({
        peinum: options.num,
        reasonlist: JSON.parse(options.reasonlist),
        orderNum: options.orderNum,
        lastReasonId: JSON.parse(options.reasonlist).pop().Id,

      })
    }
    
    
  },
  radioChange:function(e){
    console.log(e)
    this.setData({
      cancelReasonId: e.detail.value
    })
    if (this.data.lastReasonId == e.detail.value || e.detail.value==519){
      this.setData({
        show:true,
      })
    }else{
      this.setData({
        show: false,
        remark: ''
      })
    }
  },
  inputRemark:function(e){
    console.log(e)
    this.setData({
      remark: e.detail.value
    })
  },
  cancel:function(){
      if (this.data.cancelReasonId==0){
        $.alert('请选择取消原因')
        return
      }
      if (this.data.show && this.data.remark==''){
        $.alert('请填写取消原因')
        return
      }
      var val = {
        orderNum: this.data.orderNum,
        vendorId:app.globalData.VendorInfo.Id,
        cancelReasonId: this.data.cancelReasonId,
        cancelReason: this.data.remark,
      }
      console.log(val)
      var thisobj = this;
      $.xsr($.makeUrl(orderapi.CancelServiceOrders, val), function (res) {
        console.log(res)
        if(res.Code==0){
           setTimeout(function(){
             $.alert("取消成功")
             wx.switchTab({
               url: "../orderlist/orderlist",
               success: function (e) {
                 var page = getCurrentPages().pop();
                 if (page == undefined || page == null) return;
                 page.onLoad();
               },
             })
           },1000)
          // wx.navigateBack({
          //   delta: 1
          // })
           
        }else{
          $.alert(res.Msg)
        }
      })
  },
  quxiao:function(){
    if (this.data.cancelReasonId == 0) {
      $.alert('请选择取消原因')
      return
    }
    if (this.data.show && this.data.remark == '') {
      $.alert('请填写取消原因')
      return
    }
    var val = {
      orderNum: this.data.ordernum,
      vendorId: this.data.VendorId,
      cancelReasonId: this.data.cancelReasonId,
      cancelReason: this.data.remark,
    }
    console.log(val)
    $.xsr($.makeUrl(orderapi.CancelSendDaDa, val), function (res) {
      console.log(res)
      if (res.Code == 0) {
        setTimeout(function () {
          $.alert("取消成功")
          wx.switchTab({
            url: "../orderlist/orderlist",
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            },
          })
        }, 1000)
          // wx.navigateBack({
          //   delta: 1
          // })
        
     
        
      } else {
        $.alert(res.Msg)
      }
    })
  }
})
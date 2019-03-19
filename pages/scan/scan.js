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
    vendorId:'',
    reservationCode:'',
    OrderInfo:[],
    isorderInfo: false,
    deduction:0
	},
	onLoad: function (options) {
    var that = this
		this.setData({
      deliveryNum: options.on
		});
    if (!$.isNull(options.on)) {
      var val = {
        vendorId: app.globalData.VendorInfo.Id,
        reservationCode: this.data.deliveryNum,
      }
      console.log(val)
      $.xsr($.makeUrl(orderapi.GetServiceOrderByReservationCode, val), function (res) {
        console.log(res)
        if ($.isNull(res.Info)) {
          $.alert("预约不存在")
        } else {
          that.setData({
            OrderInfo: res.Info[0],
            isShow: false,
            isorderInfo: true,
            deduction: res.Info[0].ECardCash + res.Info[0].ExtraCash
          })
        }
      });
    }
	},
	inputdeliverynum: function (e) {//服务码号
		this.setData({
			deliveryNum: e.detail.value
		});
		if ($.isNull(e.detail.value)) {
			this.setData({
				isNum: false,
        isShow: false
			});
		} else {
			this.setData({
				isNum: true,
        isShow: true
			});
		}
	},
  find:function(){
    var val = {
      vendorId: app.globalData.VendorInfo.Id,
      reservationCode: this.data.deliveryNum,
    }
    var that=this
    $.xsr($.makeUrl(orderapi.GetServiceOrderByReservationCode, val), function (res) {
      if ($.isNull(res.Info)){
        $.alert("预约不存在")
      }else{
        that.setData({
          OrderInfo: res.Info[0],
          isShow: false,
          isorderInfo: true,
          deduction: res.Info[0].ECardCash + res.Info[0].ExtraCash
        })
      }
    });
  },
	clearnum: function (e) {
		this.setData({
			deliveryNum: '',
			isNum: false
		});
	},
	sao: function () {
		var that = this;
		wx.scanCode({
			success: function (data) {
				that.setData({
					deliveryNum: data.result
				});
        var val = {
          vendorId: app.globalData.VendorInfo.Id,
          reservationCode: that.data.deliveryNum,
        }
        console.log(val)
        $.xsr($.makeUrl(orderapi.GetServiceOrderByReservationCode, val), function (res) {
          console.log(res)
          if ($.isNull(res.Info)) {
            $.alert("预约不存在")
          } else {
            that.setData({
              OrderInfo: res.Info[0],
              isShow: false,
              isorderInfo: true,
              deduction: res.Info[0].ECardCash + res.Info[0].ExtraCash
            })
          }
        });
			},
			fail: function (data) {
				$.alert("无法识别")
			}
		});
	},
  hexiao:function(){
  
    var that=this
    var val = {
      storeAccountId:app.globalData.VendorInfo.storeAccountId,
      vendorId: app.globalData.VendorInfo.Id,
      reservationCode: this.data.deliveryNum,
    }
    console.log(val)
    $.confirm("是否核销订单", function (res) {
      console.log(res)
      if (val.reservationCode == ""){
        $.alert("预约码不能为空")
        return;
      }
      if (res.confirm) {
        $.xsr($.makeUrl(orderapi.WriteOffServiceOrderUsedByVendor, val), function (data) {
          console.log("daya：",data)
          if(data.Code==0){
            var val = {
              vendorId: app.globalData.VendorInfo.Id,
              reservationCode: that.data.deliveryNum,
            }
            $.xsr($.makeUrl(orderapi.GetServiceOrderByReservationCode, val), function (res) {
              console.log(res)
              $.alert("核销成功")
              that.setData({
                OrderInfo: res.Info[0],
                isShow: false,
                isorderInfo: true
              })
            });
          } else {
            $.alert(data.Msg)
          }
        });
      }
    }, true);
  }
})
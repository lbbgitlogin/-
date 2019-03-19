var $ = require('../../utils/util.js');
var app = getApp()
Page({
	data: {
		val: ""
	},
	onLoad:function(options) {
    console.log(options)
    this.setData({
      type:options.type
    })
	},
	startinput:function(e) {
		this.setData({
      val: e.detail.value.replace(/\s+/g, '')
		});
	},
	search:function() {

		var thisobj = this;
    if(this.data.type==2){
      if (!$.isNull(thisobj.data.val)) {
        console.log(thisobj.data.val)
       
        wx.setStorage({
          key: 'orderNum',
          data: thisobj.data.val,
        })
        // app.globalData.orderNum = thisobj.data.val,

        wx.switchTab({  
          
          url: "../orderlist/orderlist?orderNum=" + thisobj.data.val,
          success: function (e) {
         
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.findorder();
          },
          fail: function (data) {
            console.log("跳转失败!", data);
          }
        })
      } else {
        $.confirm("请输入你要搜索的订单编号");
      }
    }else{

      if (!$.isNull(thisobj.data.val)) {
        wx.redirectTo({
          url: "../productlist/productlist?pname=" + thisobj.data.val,
          fail: function (data) {
            console.log("跳转失败!", data);
          }
        })
      } else {
        $.confirm("请输入你要搜索的关键词!");
      }
    }
	}
})
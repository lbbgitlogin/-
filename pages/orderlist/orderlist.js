var app = getApp()
var $ = require('../../utils/util.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
Page({
	data: {
		tapindex: 1, //当前项
		pageindex: 1,
		itemCount: 10,
		startNumber: 1,
		ispage: true,
		isdata: true,
		flag: true, //是否可以进行下次分页
		type: 2,
		orderlist: [],
		index: -1,
    show: true,
    firstType: -1,
    orderNum:'',
    shoplogo:'',
    shopname:'',
    workerCellPhone:'',
    workerName:'',
    paidan:false,
    showModalStatus: false,
    isShow: false,
    flags:true,
    isstore:false,
    saoma: true
	},
  powerDrawer: function (e) { //打印机模态框
  this.setData({
    showModalStatus:true
  })
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });
    this.animation = animation;
    animation.opacity(0).rotateX(-100).step();
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      animation.opacity(1).rotateX(0).step();
      this.setData({
        animationData: animation
      })
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  } ,
  onLoad: function (options) {

    console.log("options",options)
		var that = this;
		notice.addNotification("RefreshOrder", that.RefreshOrder, that);

    wx.getStorage({
      key: 'orderNum',
      success: function(res) { 
        console.log("订单初始化",res)
        that.setData({
          orderNum:res.data,
          type: 0,
          firstType: -1,
          pageindex: 1,
          startNumber: 1,
          itemCount: 10,
          orderlist: [],
          tapindex: 3,
     
        })
        app.globalData.orderNum = "",
        that.getOrderlist();
       
        // wx.removeStorage({
          
        //   key: 'orderNum',
        //   success: function (res) {
        //     console.log( res.data)
        //   }
        // })
      },
      fail:function(res){
        that.setData({
          orderlist: [],
        })
          that.getOrderlist();
      }
    })
    this.setData({
      shoplogo: app.globalData.VendorInfo.LogoPath,
      shopname: app.globalData.VendorInfo.ShopName,
    })
    if (app.globalData.VendorInfo.storeAccountId>0){
      this.setData({
        isstore:true
      })
      wx.hideTabBar({

      })
    }else{
      this.setData({
        isstore:false
      })
    }
    if (app.globalData.VendorInfo.storeId==0){
      this.setData({
        saoma:true
      })
    }else{
      this.setData({
        saoma: false
      })
    }
	},
  findorder:function(){
  
    var that=this;
    wx.getStorage({
      key: 'orderNum',
      success: function (res) {
        console.log("订单初始化01", res)
        that.setData({
          orderNum: res.data
        })
        if (that.data.orderNum != "" && that.data.orderNum != null) {
          that.setData({
            orderlist: []
          })
          that.getOrderlist();
        }
      }
    })

 
   
  
  },
  showbox: function () {
    this.setData({
      isShow: true
    });
  },
  closead: function () {//关闭地址
    this.setData({
      isShow: false
    });
  },
	RefreshOrder: function (params) {
		if (params) {
			var list = this.data.orderlist;
			list.splice(this.data.index, 1);
			this.setData({//数组删除元素
				orderlist: list
			});
			if(this.data.flag &&　(this.data.orderlist.length < 10)){//判断是否加载下一页
				this.scrollbottom(false);
			}
		}
	},

	printReceipt: function(e){  //打印小票
     this.setData({
       hidden:false
     })
    var opts = {
      vendorId: app.globalData.VendorInfo.Id,
      orderNum: e.currentTarget.dataset.num
    };
    $.xsr($.makeUrl(orderapi.PrintReceipt, opts), function (result) {
      console.log(result)
      if (result.Code != 0) {  //打印有错误
        if (result.Msg){
          $.alert("打印小票失败：" + result.Msg);
        }
        else{
          $.alert("打印小票出错，请确保已配置好打印设备，网络连接正常");
        }
      }
    }, false);
  },

  sendout: function (e) {//发货 
 
		this.setData({
			index: e.currentTarget.dataset.index
		});

		wx.navigateTo({
			url: "../sendoutgoods/sendoutgoods?on=" + e.currentTarget.dataset.num,
		})
	},
	checkdetail: function (e) {//查看详情
  console.log(e)
		this.setData({
			index: e.currentTarget.dataset.index
		});
    if (e.currentTarget.dataset.type==0){
      wx.navigateTo({
        url: "../orderdetail/orderdetail?on=" + e.currentTarget.dataset.num,
      })
    }
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: "../serveorderdetail/serveorderdetail?on=" + e.currentTarget.dataset.num,
      })
    }
    if (e.currentTarget.dataset.type == 2) {
      wx.navigateTo({
        url: "../countorderdetail/countorderdetail?on=" + e.currentTarget.dataset.num,
      })
    }
    if (e.currentTarget.dataset.type == 3) {
      wx.navigateTo({
        url: "../foodorderdetail/foodorderdetail?on=" + e.currentTarget.dataset.num,
      })
    }
	},
  checkdetail1: function (e) {//查看详情
    console.log(e)
    this.setData({
      index: e.currentTarget.dataset.index
    });

    wx.navigateTo({
      url: "../favorableorderdetail/favorableorderdetail?on=" + e.currentTarget.dataset.num,
    })
  },

	allOrders: function () { //全部订单
		this.setData({
			tapindex: 3,
			pageindex: 1,
			startNumber: 1,
			itemCount: 10,
			orderlist: [],
      isdata: true,
			type: 0,
      orderNum: '',
      flags: true
		});
		this.getOrderlist();
	},
	toBePaid: function () { //待支付
		this.setData({
			tapindex: 2,
			pageindex: 1,
			itemCount: 10,
			startNumber: 1,
			orderlist: [],
      isdata: true,
			type: 1,
      orderNum: '',
       flags: true
		});
		this.getOrderlist();
	},
	orderover: function () { //已完成
		this.setData({
			tapindex: 4,
			pageindex: 1,
			itemCount: 10,
			startNumber: 1,
			orderlist: [],
      isdata: true,
			type: 3,
      orderNum: '',
      flags:false
		});
		this.getOrderlist();
	},
	waitdelivery: function () { //待发货
		this.setData({
			tapindex: 1,
			pageindex: 1,
			itemCount: 10,
			startNumber: 1,
			orderlist: [],
      isdata: true,
			type: 2,
      orderNum: '',
      flags: true
		});
		this.getOrderlist();
	},
	scrollbottom: function (needLoading) { //进行分页
		if (this.data.flag) { //判断是否可以进行下次分页
			var thisobj = this;
			clearTimeout(time);
			this.setData({
				flag: false
			});
			var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
				thisobj.setData({
          startNumber: thisobj.data.startNumber + 1
				});
				thisobj.getOrderlist(needLoading); //根据价格排序
			}, 500);
		}
	},
	getOrderlist: function (needLoading) { //统一获取订单列表
    var that = this;
 
    wx.getStorage({
      key: 'orderNum',
      success: function (res) {

        console.log("订单初始化01", res)
        that.setData({
          orderNum:res.data
        })
        var val = {
          startNumber: that.data.pageindex,
          vendorId: app.globalData.VendorInfo.Id,
          itemCount: that.data.itemCount,
          startNumber: that.data.startNumber,
          type: that.data.type,
          firstType: that.data.firstType,
          orderNum: that.data.orderNum,
          storeAccountId: app.globalData.VendorInfo.storeAccountId,
        }
        console.log("val", val)
 
        $.xsr($.makeUrl(orderapi.GetVendorOrderListByStatus, val), function (res) {
          
          console.log("12", res)
          if (res.Code == 0 && !$.isNull(res.Info)) {
            if (res.Info.length < 10) {
              that.setData({
                flag: false,
                isdata: true,
                ispage: false
              });
              that.setData({
                orderlist: that.data.orderlist.concat(res.Info)
              });
            } else {
              that.setData({
                orderlist: that.data.orderlist.concat(res.Info),
                flag: true,
                isdata: true,
              });
            }
            wx.removeStorage({

              key: 'orderNum',
              success: function (res) {
                console.log(res.data)
              }
            })
          } else {
            that.setData({
              flag: false,
              ispage: false,
              isdata: false,
            });
            wx.removeStorage({

              key: 'orderNum',
              success: function (res) {
                console.log(res.data)
              }
            })
          }
        }, needLoading);

      },
      fail:function(){
        var val = {
          startNumber: that.data.pageindex,
          vendorId: app.globalData.VendorInfo.Id,
          itemCount: that.data.itemCount,
          startNumber: that.data.startNumber,
          type: that.data.type,
          firstType: that.data.firstType,
          orderNum: that.data.orderNum,
          storeAccountId: app.globalData.VendorInfo.storeAccountId,
        }
        console.log("val", val)
        $.xsr($.makeUrl(orderapi.GetVendorOrderListByStatus, val), function (res) {
          console.log("12", res)
          if (res.Code == 0 && !$.isNull(res.Info)) {
            if (res.Info.length < 10) {
              that.setData({
                flag: false,
                isdata: true,
                ispage: false
              });
              that.setData({
                orderlist: that.data.orderlist.concat(res.Info)
              });
            } else {
              that.setData({
                orderlist: that.data.orderlist.concat(res.Info),
                flag: true,
                isdata: true,
              });
            }
            wx.removeStorage({

              key: 'orderNum',
              success: function (res) {
                console.log(res.data)
              }
            })
          } else {
            that.setData({
              flag: false,
              ispage: false,
              isdata: false,
            });
          }
        }, needLoading);
      }
    })

		
	},
  choose:function(){
    if(this.data.show){
      this.setData({
        show:false
      })
    }else{
      this.setData({
        show:true
      })
    }
  },
  close:function(){
    this.setData({
      show: true
    })
  },
  all:function(){
    this.setData({
      firstType:-1,
      pageindex: 1,
      startNumber: 1,
      itemCount: 10,
      orderlist: [],
      show: true,
      orderNum: ''
    }) 
    this.getOrderlist();
  },
  shiwu:function(){
    this.setData({
      firstType: 0,
      pageindex: 1,
      startNumber: 1,
      itemCount: 10,
      orderlist: [],
      show: true,
      orderNum: ''
    })
    this.getOrderlist();
  },
  fuwu: function () {
    this.setData({
      firstType: 1,
      pageindex: 1,
      startNumber: 1,
      itemCount: 10,
      orderlist: [],
      show: true,
      orderNum: ''
    })
    this.getOrderlist();
  },
  youhui: function () {
    this.setData({
      firstType: 2,
      pageindex: 1,
      startNumber: 1,
      itemCount: 10,
      orderlist: [],
      show: true,
      orderNum: ''
    })
    this.getOrderlist();
  },
  saoma: function () {
    this.setData({
      firstType: 3,
      pageindex: 1,
      startNumber: 1,
      itemCount: 10,
      orderlist: [],
      show: true,
      orderNum: ''
    })
    this.getOrderlist();
  },
  cancel:function(e){
    console.log(e)
    wx.navigateTo({
      url: "../ordercancel/ordercancel?orderNum=" + e.currentTarget.dataset.num + "&reasonlist=" + JSON.stringify(e.currentTarget.dataset.reasonlist) ,
    })
  },
  paidan:function(e){
    console.log(e)
    this.setData({
      paidan:true,
      orderNum: e.currentTarget.dataset.num
    })
  },
  close1:function(){
    this.setData({
      paidan: false,
    })
  },
  
  innerout:function(){

  },
  writename:function(e){
    console.log(e)
    this.setData({
      workerName :e.detail.value
    })
  },
  writephone:function(e){
    console.log(e)
    this.setData({
      workerCellPhone: e.detail.value
    })
  },
  success:function(){
    var val = {
      orderNum: this.data.orderNum,
      workerName: this.data.workerName,
      workerCellPhone: this.data.workerCellPhone
    }
    if ($.isNull(this.data.workerName)){
      $.alert('请输入接单人姓名')
      return false
    }
    if (!(/^1[34578]\d{9}$/.test(this.data.workerCellPhone))){
      $.alert('手机格式有误')
      return false
    }
    console.log(val)
    var that = this;
    $.xsr($.makeUrl(orderapi.PrintReceiptServiceOrders, val), function (res) {
      that.setData({
        paidan: false,
      })
      if(res.Code==0){
        $.alert('派单成功')
        that.setData({
          pageindex: 1,
          startNumber: 1,
          itemCount: 10,
          orderlist: [],
          orderNum:''
        })
        that.onLoad();  
      }else{
        $.alert('派单失败')
      }
    });
  },
  hexiao:function(e){
    console.log(e)
    if (e.currentTarget.dataset.type==0){
      wx.navigateTo({
        url: '../draw/draw?on=' + e.currentTarget.dataset.num,
      })
    }
    if (e.currentTarget.dataset.type == 1) {
      wx.navigateTo({
        url: '../scan/scan?on=' + e.currentTarget.dataset.num,
      })
    }
  },
  goindex:function(){
    wx.redirectTo({
      url: '../storeindex/storeindex',
    })
  }
})
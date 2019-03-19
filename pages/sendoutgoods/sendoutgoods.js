var app = getApp()
var $ = require('../../utils/util.js');
var api = require('../../api/logisticsAPI.js');
var orderapi = require('../../api/orderAPI.js');
var notice = require('../../utils/notice.js');
Page({
	data: {
		lettersel: '', 
		deliveryNum: '',
		isShow: false,
    ispage:false,
    isspage:false,
    uugo:false,
		isNum: false,
		Companies: [],
    pageIndex: 1,
    uumode:"",
    uupeisongjia:"",
    uupageIndex: 1,
    dadapageIndex: 1,
    SuitProducts:false,
    Suit: false,
    pickerData: ["否", "是"],
    pickerData1: ["否", "是"],
    pickerData2: ["立即发货", "预约时间"],
    pickerIndex: 1,
    pickerIndex1: 0,
    pickerIndex2: 0,
		selectedId: -1,
		scrollintoview: '',//字母缩写 key
    logisticsname: '',//字母缩写 key
		orderNum: '',//订单编号
    placeholder:'',
    phone: '',
    Shipper: '',
    Logistics:[],//物流公司
    index:0,
    showfont:"",
    uushowfont: "",
    fontshow: "",
    uustoreid:"",//uu门店id
    logisticsType:1,
    logisticsId:0,
    StoreList:[],
    StoreList1: [],
    StoreList2: [],
    StoreList3: [],
    CitySendTypeStr:'',
    date:'',
    time:'',
    uupage:'',
    tongdate: '',
    tongtime: '',
    uudate: '',
    uutime: '',
    index1: 0,
    CitySendTypeStr: '',
    CitySendTypeId:0,
    index2: 0,
    StoreName:'',
    StoreId:0,
    index3: 0,
    DStoreName:'',
    index4: 0,
    DaDaKeepPriceRemark:'',
    ShopCode:0,
    DaDaKeepPriceId:0,
    kuaifahuoren: '',
    kuaishoujihao: '',
    tongfahuoren:'',
    tongshoujihao:'',
    peisongjia:'',
    isCoupon: '1',//  uu优惠券  ，1、使用，0不使用
    specialType: '0',//  uu保温箱 ，1、使用，0不使用
    yundanhao:'',
    sendDate: '',//  uu发货时间
    wuliufeiyong:0,
    firstInfoText: '',
    secondUserName: '',
    thirdSendTime: '',
    freightMoney: 0,
    vendorStoreId:0
	},
	onLoad: function (options) {
    console.log("传参", options)
    var that=this
		this.setData({
			orderNum: options.on
		});
    wx.getStorage({
        key: 'obj',
        success: function (res) {
          console.log(res)
          that.setData({
            index: res.data.index,
            logisticsname: res.data.logisticsname,
            logisticsId: res.data.logisticsId
          })
        },
    })
    wx.getStorage({
      key: 'obj1',
      success: function (res) {
        console.log(res)
        that.setData({
          index1: res.data.index1,
          CitySendTypeStr: res.data.CitySendTypeStr,
          CitySendTypeId: res.data.CitySendTypeId
        })
      },
    })
    wx.getStorage({
      key: 'obj2',
      success: function (res) {
        console.log(res)
        that.setData({
          index2: res.data.index2,
          StoreName: res.data.StoreName,
          StoreId: res.data.StoreId
        })
      },
    })
    wx.getStorage({
      key: 'obj3',
      success: function (res) {
        console.log(res)
        that.setData({
          index3: res.data.index3,
          DStoreName: res.data.DStoreName,
          ShopCode: res.data.ShopCode
        })
      },
    })
    wx.getStorage({
      key: 'obj4',
      success: function (res) {
        console.log(res)
        that.setData({
          index4: res.data.index4,
          DaDaKeepPriceRemark: res.data.DaDaKeepPriceRemark,
          DaDaKeepPriceId: res.data.DaDaKeepPriceId
        })
      },
    })
		this.getLogisticsCompanyList();
    this.GetSendOrderData();
    this.GetVendorDaDaStoresList();//达达配送送
    this.GetVendorStoresList();   //商家自送
    this.GetVendorUUStoresList()
	},
  pickerClick: function (event) {//uu优惠券选择

    console.log(event.detail.value);
    this.setData({
      pickerIndex: event.detail.value,
      isCoupon: event.detail.value
    });
  },
  pickerClick1: function (event) {//uu保温箱选择
    console.log(event.detail.value);
    this.setData({
      pickerIndex1: event.detail.value,
      specialType:event.detail.value,
    });
  },
  pickerClick2: function (event) { //立即发货时0   
    
    console.log(event.detail.value);
    this.setData({
      pickerIndex2: event.detail.value,
      uumode: event.detail.value,
    });
  },
	getLogisticsCompanyList: function () {//获取物流公司列表
		var thisobj = this;
		$.xsr(api.GetLogisticsCompanyList, function (res) {
      console.log("1212",res)
			if (res.Code == 0 && !$.isNull(res.Info)) {
				thisobj.setData({
					Companies: res.Info,
				});
			}
		});
	},
  GetSendOrderData: function () {//获取订单发货数据信息
    var val={
      orderNum: this.data.orderNum,
      vendorId: app.globalData.VendorInfo.Id
    }
    console.log("2222",val)
    var that = this;
    $.xsr($.makeUrl(orderapi.GetSendOrderData, val), function (res) {
      console.log("33",res)
      that.setData({
        StoreList:res.Info[0]
      })
    });
  },

  GetVendorDaDaStoresList: function () {//达达配送门店列表
    var val = {
      orderNum: this.data.orderNum,
      vendorId: app.globalData.VendorInfo.Id,
      pageIndex: this.data.dadapageIndex,
      storeAccountId: app.globalData.VendorInfo.storeAccountId
    }
    console.log("达达信息01", val)
    var that = this;
    $.xsr($.makeUrl(orderapi.GetVendorDaDaStoresList, val), function (res) {
      console.log("达达02", res)
      if (res.Info.length < 10) {
        that.setData({
          isspagee: false,
          ispagee:false,
          StoreList1: that.data.StoreList1.concat(res.Info),
        })
      } else {
        that.setData({
          isspagee: true,
          ispagee: true,
          StoreList1: that.data.StoreList1.concat(res.Info),
        })
      }
    });
  },
  GetVendorUUStoresList: function () {//达达配送门店列表
    var val = {
      orderNum: this.data.orderNum,
      vendorId: app.globalData.VendorInfo.Id,
      pageIndex: this.data.uupageIndex,
      storeAccountId: app.globalData.VendorInfo.storeAccountId
    }
    console.log("uu01", val)
    var that = this;
    $.xsr($.makeUrl(orderapi.GetVendorUUStoresList, val), function (res) {
      console.log("uu02", res)
      if (res.Info.length < 10) {
        that.setData({
          iuupagee: false,
          uupage: false,
          StoreList3: that.data.StoreList3.concat(res.Info),
        })
      } else {
        that.setData({
          iuupagee: true,
          uupage: true,
          StoreList3: that.data.StoreList3.concat(res.Info),
        })
      }
    });
  },
  GetVendorStoresList: function () {//商家自送配送门店列表
    var val = {
      orderNum: this.data.orderNum,
      vendorId: app.globalData.VendorInfo.Id,
      pageIndex: this.data.pageIndex,
      storeAccountId: app.globalData.VendorInfo.storeAccountId
    }
    console.log("商家信息01", val)
    var that = this;
    $.xsr($.makeUrl(orderapi.GetVendorStoresList, val), function (res) {
      console.log("商家信息02", res)
      if (res.Info.length < 10){

        that.setData({
          isspage: false,
          ispage: false,
          StoreList2: that.data.StoreList2.concat(res.Info),
        })
      }else{
        that.setData({
        isspage:true,
          ispage:true,
          StoreList2: that.data.StoreList2.concat(res.Info),
        })
      }
     
    });
  },
  mskShow: function(e) {  //点击地址赋值
   console.log("uupy2",e)
    var that=this;
    that.setData({
     showfont: e.currentTarget.dataset.font,
    SuitProducts:false

    })    

  },
  uuShow: function (e) {  //点击地址赋值
    console.log("uupy2", e)
    var that = this;
    that.setData({
      uushowfont: e.currentTarget.dataset.font,
      uustoreid: e.currentTarget.dataset.storeid,
      uugo: false
    
    })

  },
  Showmsk: function (e) {  //点击地址赋值
  console.log(e);
    var that = this;
    that.setData({
      fontshow: e.currentTarget.dataset.font,
      ShopCode: e.currentTarget.dataset.code,
      Suit: false

    })

  },

  close_msk:function(){
    var that = this;
    that.setData({
      
      SuitProducts: false

    })  

  },
  close_msk1: function () {
    var that = this;
    that.setData({

      uugo: false

    })

  },
  close:function(){

    var that = this;
    that.setData({

      Suit: false

    })  

  },
  scrollbottom: function () { //进行分页


    if (this.data.isspage) { //判断是否可以进行下次分页
      var that = this;
      that.setData({
        pageIndex: parseInt(that.data.pageIndex) + 1
      });
      this.GetVendorStoresList();
    }
  },
  scrollbo: function () { //进行分页


    if (this.data.isspagee) { //判断是否可以进行下次分页
      var that = this;
      that.setData({
        dadapageIndex: parseInt(that.data.dadapageIndex) + 1
      });
      this.GetVendorDaDaStoresList();
    }
  },
  uuscroll: function () { //uu进行分页


    if (this.data.iuupagee) { //判断是否可以进行下次分页
      var that = this;
      that.setData({
        uupageIndex: parseInt(that.data.uupageIndex) + 1
      });
      this.GetVendorUUStoresList();
    }
  },
  
	inputdeliverynum: function (e) {//快递号
		this.setData({
			deliveryNum: e.detail.value
		});
		if ($.isNull(e.detail.value)) {
			this.setData({
				isNum: false
			});
		} else {
			this.setData({
				isNum: true
			});
		}
	},
  inputname: function(e){
    this.setData({
      deliveryNum: e.detail.value,
    });
  },
  inputphone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
	clearnum: function (e) {
		this.setData({
			deliveryNum: '',
			isNum: false
		});
	},

	wxSortPickerViewTemTagTap: function (e) {
		this.setData({
			lettersel: e.target.dataset.tag,
			isShow: true
		});
		var that = this;
		setTimeout(function () {
			that.setData({
				isShow: false
			});
		}, 800);
		for (var i = 0; i < this.data.Companies.length; i++) {
			if (this.data.Companies[i].keyStr.substr(0, 1) == e.target.dataset.tag) {
				this.setData({
					scrollintoview: this.data.Companies[i].keyStr,
					logisticsKey: this.data.Companies[i].keyStr,
				});
				break;
			}
		}
		if (this.data.scrollintoview.substr(0, 1) != e.target.dataset.tag) {
			$.alert("没有" + e.target.dataset.tag + "开头的物流公司哦");
		}
	},

	sao: function () {
		var that = this;
		wx.scanCode({
			success: function (data) {
				that.setData({
					yundanhao: data.result
				});
			},
			fail: function (data) {
				$.alert("无法识别")
			}
		});
	},

	selectedcompany: function (e) {
		this.setData({
			selectedId: e.currentTarget.dataset.id,
			logisticsKey: e.currentTarget.dataset.key
		});
	},
	submitdata: function () {//发货
    // 普通配送判断
    if (this.data.logisticsKey != 'VENDOR' && this.data.logisticsKey != 'CLIENT' && this.data.logisticsKey != 'OTHER'){
      if ($.isNull(this.data.deliveryNum)) {
        $.alert("请输入或者扫码快递单号！");
        return;
      }
      if ($.isNull(this.data.logisticsKey)) {
        $.alert("请选择物流公司！");
        return;
      } 
    }
    // 厂家自送 其他配送判断
    if (this.data.logisticsKey == 'VENDOR' || this.data.logisticsKey == 'OTHER'){
      if ($.isNull(this.data.deliveryNum) || $.isNull(this.data.phone)) {
        $.alert("请填写送货人姓名和手机号");
        return;
      }
      if ($.isNull(this.data.logisticsKey)) {
        $.alert("请选择物流公司！");
        return;
      } 
    }
    // 上门自提判断
    if (this.data.logisticsKey == 'CLIENT' ) {
      if ($.isNull(this.data.deliveryNum) || $.isNull(this.data.phone)) {
        $.alert("请填写提货人姓名和手机号");
        return;
      }
      if ($.isNull(this.data.logisticsKey)) {
        $.alert("请选择物流公司！");
        return;
      }
    }
		var val = {
			orderNum: this.data.orderNum,
			userAccount: app.globalData.VendorInfo.UserAccount,
			trackingNum: this.data.deliveryNum,
			logisticsKey: this.data.logisticsKey,
      phone: this.data.phone,
		}
    console.log(val)
    console.log(val.trackingNum)
		var thisobj = this;
		$.xsr($.makeUrl(orderapi.DeliveryOrder, val), function (res) {
			if (res.Code == 0) {
				notice.postNotificationName("RefreshOrder", true);//通知刷新
				$.alert("发货成功！");
				setTimeout(function () {
					$.backpage(1, function () { });
				}, 1000);
			} else {
				$.alert(res.Msg);
			}
		});
	},
  bindPickerChange: function (e) {//选择物流发货
    console.log('picker发送选择改变，携带值为', this.data.Companies[e.detail.value])
    this.setData({
      index: e.detail.value,
      logisticsname: this.data.Companies[e.detail.value].name,
      logisticsId: this.data.Companies[e.detail.value].id
    })
    var obj={
      index: e.detail.value,
      logisticsname: this.data.Companies[e.detail.value].name,
      logisticsId: this.data.Companies[e.detail.value].id
    }
    wx.setStorage({
      key: 'obj',
      data: obj,
    })
  },
  bindPickerChange1: function (e) {//选择配送方

    console.log('picker发送选择改变，携带值为', this.data.StoreList.CitySendTypeList[e.detail.value])
    this.setData({
      index1: e.detail.value,
      CitySendTypeStr: this.data.StoreList.CitySendTypeList[e.detail.value].CitySendTypeStr,
      CitySendTypeId: this.data.StoreList.CitySendTypeList[e.detail.value].CitySendTypeId
    })
    var obj = {
      index1: e.detail.value,
      CitySendTypeStr: this.data.StoreList.CitySendTypeList[e.detail.value].CitySendTypeStr,
      CitySendTypeId: this.data.StoreList.CitySendTypeList[e.detail.value].CitySendTypeId
    }
    wx.setStorage({
      key: 'obj1',
      data: obj,
    })
  },
  bindPickerChange6:function(e){ //uupaotui
  console.log("uupaot",e)
    this.setData({
      uugo: true,
      // index2: e.detail.value,
      // StoreName: this.data.StoreList.VendorStoreList[e.detail.value].StoreName,
      // StoreId: this.data.StoreList.VendorStoreList[e.detail.value].Id
    })
  },
  bindPickerChange2: function (e) {//选择商家自送门店
   
    this.setData({
      SuitProducts:true,
      // index2: e.detail.value,
      // StoreName: this.data.StoreList.VendorStoreList[e.detail.value].StoreName,
      // StoreId: this.data.StoreList.VendorStoreList[e.detail.value].Id
    })
    // var obj = {
    //   index2: e.detail.value,
    //   StoreName: this.data.StoreList.VendorStoreList[e.detail.value].StoreName,
    //   StoreId: this.data.StoreList.VendorStoreList[e.detail.value].Id
    // }
    // wx.setStorage({
    //   key: 'obj2',
    //   data: obj,
    // })
  },
  bindPickerChange3: function (e) {//选择达达门店
    // console.log('picker发送选择改变，携带值为', this.data.StoreList.DaDaShopList[e.detail.value])
    this.setData({
      Suit: true,
      // index3: e.detail.value,
      // DStoreName: this.data.StoreList.DaDaShopList[e.detail.value].StoreName,
      // ShopCode: this.data.StoreList.DaDaShopList[e.detail.value].ShopCode
    })
    // var obj = {
    //   index3: e.detail.value,
    //   DStoreName: this.data.StoreList.DaDaShopList[e.detail.value].StoreName,
    //   ShopCode: this.data.StoreList.DaDaShopList[e.detail.value].ShopCode
    // }
    // wx.setStorage({
    //   key: 'obj3',
    //   data: obj,
    // })
  },
  bindPickerChange4: function (e) {//选择保送价
    console.log('picker发送选择改变，携带值为', this.data.StoreList.DaDaKeepPriceList[e.detail.value])
    this.setData({
      index4: e.detail.value,
      DaDaKeepPriceRemark: this.data.StoreList.DaDaKeepPriceList[e.detail.value].DaDaKeepPriceRemark,
      DaDaKeepPriceId: this.data.StoreList.DaDaKeepPriceList[e.detail.value].DaDaKeepPriceId
    })
    var obj = {
      index4: e.detail.value,
      DaDaKeepPriceRemark: this.data.StoreList.DaDaKeepPriceList[e.detail.value].DaDaKeepPriceRemark,
      DaDaKeepPriceId: this.data.StoreList.DaDaKeepPriceList[e.detail.value].DaDaKeepPriceId
    }
    wx.setStorage({
      key: 'obj4',
      data: obj,
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  tongbindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      tongdate: e.detail.value
    })
  },
  uubindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      uudate: e.detail.value
    })
  },
  tongbindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      tongtime: e.detail.value
    })
  },
  uubindTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      uutime: e.detail.value
    })
  },
  yundanhao:function(e){ 
    
     
    this.setData({
      yundanhao: e.detail.value.replace(/\s+/g, '')
    })
    
  },
  kuaifahuoren: function (e) { 
    this.setData({
      kuaifahuoren: e.detail.value
    })
     
  },
  wuliufeiyong: function (e) {
   
    this.setData({
      wuliufeiyong: e.detail.value
    })
      //  if (this.data.wuliufeiyong.length>10){
      //    $.confirm("请输入正确运费！");
      //  }
      //  if (!patrn.exec(this.data.wuliufeiyong)){ 
      //    $.confirm("请输入正确运费！");
      //  }
  },
  kuaishoujihao: function (e) {
    console.log(e)
    this.setData({
      kuaishoujihao: e.detail.value
    })
    // if (!(/^0?(13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89])[0-9]{8}$/.test(this.data.kuaishoujihao)) || !(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(this.data.kuaishoujihao))) {
    //   $.alert("请输入正确的手机号！");
    // }
  },
  tongfahuoren: function (e) {
    console.log(e)
    this.setData({
      tongfahuoren: e.detail.value
    })
  },
  tongshoujihao:function(e){
    console.log(e)
    this.setData({
      tongshoujihao: e.detail.value
    })
    //  if (!(/^0?(13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89])[0-9]{8}$/.test(this.data.tongshoujihao)) || !(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/.test(this.data.tongshoujihao))){
    //   $.alert("请输入正确的手机号！");
    //}
  },
  kuaidi:function(e){
    this.setData({
      logisticsType: 1
    })
  },
  tongcheng: function () {
    this.setData({
      logisticsType: 2
    })
  },
  GetOrderDaDaFreight:function(){//查看配送费
  
    if (this.data.ShopCode==0){
      
      $.alert("请选择门店");
      return false
    }
    var val = {
      orderNum: this.data.orderNum,
      storeId: this.data.ShopCode,
      daDaKeepPriceId: this.data.DaDaKeepPriceId,
          type:0 , //0 dada   1 uu
  
    }
    console.log(val)
    var that = this;
    $.xsr($.makeUrl(orderapi.DeliveryOrder, val), function (res) {
      console.log(res)
      var numberqudou = Math.round(res.Info);
      Math.round
      // var numbera = numberqudou.toFixed(2)
      that.setData({
        peisongjia: numberqudou
      })
    });
  },
  uuGetOrderDaDaFreight: function () {//查看配送费

    if ($.isNull(this.data.uushowfont)) {

      $.alert("请选择门店");
      return;
    }
    if (this.data.CitySendTypeStr == "UU配送") {  //uu发货
      if (this.data.uumode == 1) {
        this.setData({
          sendDate: this.data.uudate + ' ' + this.data.uutime
        })
      } else {
        this.setData({
          sendDate: ''
        })
      }

      if ($.isNull(this.data.uushowfont)) {

        $.alert("请选择门店");
        return;
      }
      if (this.data.uudate == "" && this.data.uumode == 1) {
        $.alert("请选择发货日期");
        return;
      }
      if (this.data.uutime == "" && this.data.uumode == 1) {
        $.alert("请选择发货时间");
        return;
      }
    }
    var val = {
      orderNum: this.data.orderNum,
      storeId: this.data.uustoreid,
      daDaKeepPriceId: this.data.DaDaKeepPriceId,
      type: 1, //0 dada   1 uu
      specialType: this.data.specialType,  //uu保温箱
      sendDate: this.data.sendDate,//uu发货时间
      isCoupon: this.data.isCoupon,//uu是否使用优惠券
    }
    console.log(val)
    var that = this;
    $.xsr($.makeUrl(orderapi.DeliveryOrder, val), function (res) {
      console.log("uujiage",res)
      if (res.Code == 0){
        var numberqudou = Math.round(res.Info);
        Math.round
        // var numbera = numberqudou.toFixed(2)
        that.setData({
          uupeisongjia: numberqudou
        })
      }else{
        wx.showModal({
          title: '提示',
          content: "获取失败",
          success: function (res) {
          }
        })


      }
  
    });
  },
  fahuo:function(){
    
    var reg = /^[0-9a-zA-Z]+$/  //判断单号不能有汉字
    var patrn = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/; //判断不能以0开头
    console.log(this.data.logisticsType)
    if (this.data.logisticsType==1){
      if (this.data.logisticsname != "其他配送" && this.data.logisticsname != "商家自送"){
        this.setData({
          firstInfoText: this.data.yundanhao,
          secondUserName:this.data.kuaifahuoren,
          thirdSendTime:this.data.date+' '+this.data.time
        })
        if (!reg.test(this.data.yundanhao)) {
          $.alert("请输入正确单号！");
          return false;
        }
        if (!patrn.test(this.data.wuliufeiyong)) {
          $.alert("请输入正确运费！");
          return false;
        }
        if ($.isNull(this.data.yundanhao)){
          $.alert("请填写运单号");
          return false
        }
        if ($.isNull(this.data.kuaifahuoren)) {
          $.alert("请输入正确的姓名！");
          return false;
        }
        if ($.isNull(this.data.wuliufeiyong)) {
          $.alert("请输入正确运费！");
            return false
        }
      }
      if (this.data.logisticsname == "其他配送" || this.data.logisticsname == "商家自送"){
        this.setData({
          firstInfoText: this.data.kuaishoujihao,
          secondUserName: this.data.kuaifahuoren,
          thirdSendTime: this.data.date + ' ' + this.data.time
        })
        if ($.isNull(this.data.kuaifahuoren)) {
        
          $.alert("请填写送货人");
          return false
        }
        if (!(/^0?(13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89])[0-9]{8}$/.test(this.data.kuaishoujihao))) {

          $.alert("手机号格式有误");
          return false
        }
        if ($.isNull(this.data.kuaishoujihao)) {
          
          $.alert("手机号格式有误");
          return false
        }
        
      }
    }
    if (this.data.logisticsType==2){
    
      //同城配送商家自送
      if (this.data.CitySendTypeStr == "商家自送"){
        this.setData({
          vendorStoreId: this.data.StoreId,
          firstInfoText: this.data.tongshoujihao,
          secondUserName: this.data.tongfahuoren,
          thirdSendTime: this.data.uudate + ' ' + this.data.uutime
        })
        if ($.isNull(this.data.showfont)){
          
          $.alert("请选择门店");
          return false
        }
        if ($.isNull(this.data.tongfahuoren)) {
           
          $.alert("请填写发货人");
          return false
        }
        if (!(/^0?(13[0-9]|15[012356789]|18[012346789]|14[57]|17[678]|170[059]|14[57]|166|19[89])[0-9]{8}$/.test(this.data.tongshoujihao))) {
          $.alert("手机号格式有误");
          
          return false
        }
        if ($.isNull(this.data.tongshoujihao)) {
          $.alert("手机号格式有误");
          return false
        }
      }
      //同城配送达达配送
      if (this.data.CitySendTypeStr == "达达配送"){
        this.setData({
          vendorStoreId: this.data.ShopCode,
          
        })
        if ($.isNull(this.data.fontshow)){
          
          $.alert("请选择门店");
          return false
        }
        // if ($.isNull(this.data.peisongjia)) {
        
        //   $.alert("查看配送价");
        //   return false
        // }
      }
      if (this.data.CitySendTypeStr == "UU配送") {  //uu发货
        if (this.data.uumode == 1){
          this.setData({
            vendorStoreId: this.data.uustoreid,
            sendDate: this.data.uudate + ' ' + this.data.uutime
          })
        }else{
          this.setData({
            vendorStoreId: this.data.uustoreid,
            sendDate: ''
          })
        }
       
        if ($.isNull(this.data.uushowfont)) {

          $.alert("请选择门店");
          return;
        }
        if (this.data.uudate == "" &&this.data.uumode == 1){
          $.alert("请选择发货日期");
          return;
        }
        if (this.data.uutime == "" && this.data.uumode == 1) {
          $.alert("请选择发货时间");
          return;
        }
      }
    }
    var val = {
      orderNum: this.data.orderNum,
      orderSendTypeId: this.data.logisticsType,
      citySendTypeId: this.data.CitySendTypeId,
      logisticsId: this.data.logisticsId,
      vendorStoreId: this.data.vendorStoreId,
      dadaKeepPriceId: this.data.DaDaKeepPriceId,
      firstInfoText: this.data.firstInfoText,
      secondUserName: this.data.secondUserName,
      thirdSendTime: this.data.thirdSendTime,
      freightMoney: this.data.wuliufeiyong,
      specialType: this.data.specialType,  //uu保温箱
      sendDate: this.data.sendDate,//uu发货时间
      isCoupon: this.data.isCoupon,//uu是否使用优惠券
    }
    var time = new Date().getTime();
    console.log("time:",time)
    var fahuotime = new Date(Date.parse(val.sendDate.replace(/-/g, "/"))).getTime();
  
    console.log("fahuotime:", fahuotime)
    var shijiancha = fahuotime - time;
    var shijianfen = shijiancha / (1000 * 60);
    console.log("shijianfen", shijianfen)
    console.log("shijiancha", shijiancha)

    if (this.data.uumode == 1 && 30 > shijianfen  || shijianfen > 1440 ){

      $.alert("预约时间是当前时间30分钟之后,24小时之内")
      return;
    }else{
      console.log(val)
      var that = this;
      $.xsr($.makeUrl(orderapi.VendorSendOrder, val), function (res) {

        console.log("1231231", res)
        if (res.Code == 0) {
          $.alert('发货成功')
       
          setTimeout(function () {
            wx.switchTab({
              url: "../orderlist/orderlist" ,
              success: function (e) {
                var page = getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
              },
            })
            // wx.navigateBack({
            //   delta: 1
            // })
            // var page = getCurrentPages().pop();
            // if (page == undefined || page == null) return;
            // page.onLoad();
          }, 2000)
        } else {

          wx.showModal({
            title: '提示',
            content: res.Msg,
            success: function (res) {
            }
          })
          // $.alert(res.Msg)
        }

      });


    }
    
  }
})
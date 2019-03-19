var app = getApp();
var $ = require('../../utils/util.js');
var api = require('../../api/productAPI.js');
var WxParse = require('../../wxParse/wxParse.js');
var intervalDate;
Page({
	data: {
		selectsp: 0,
		selectct: 0,
		proId: 0,
		splist: [], //选择的规格列表
		splistStr: [], //选择的规格列表名称
		numval: 1,
		stock: 1, //库存
		inputval: 1, //接收输入框输入的值
		skuid: 0, //SKUID
		selectimg: "", //选择的图片
		pname: "", //商品名称
		desc: "", //描述
		isCollection: false, //是否收藏
		MEID: 0,
		eventId: 0,//拼团ID
		Parameters: [], //规格参数
		isdata: true, //是否有数据
		tapindex: 1, //当前选中项目
		IsChannel: true,//是否展示技术支持
		FGInfo: {},//拼团信息
		UDactivity: [],//正在进行的活动
		isAll: false,//是否查看所有拼团
		Time: {},
		ProductInfo: {},
	},
	onLoad: function (options) {
		var that = this;
		this.setData({
			proId: options.pid,
      splistStr: [],
		});
		that.InitProduct();
	},
	InitProduct: function () { //初始化商品
		var that = this;
		var val = {
			proId: that.data.proId,
      IsVendorMiniApp: 1
		}
		$.xsr($.makeUrl(api.GetProductById, val), function (data) {
      console.log("iuiu",data);
			if (data.Code > 0) {
				that.setData({
					isdata: false
				});
			} else {
				if (data.Info[0].EventType == "FIGHTGROUP" && data.Info[0].MarketingEventId > 0) {
					setInterval(function () {
						that.setData({
							Time: $.FormatTime(data.Info[0].EventEndTime),
							MEID: data.Info[0].MarketingEventId,
							eventId: data.Info[0].MarketingEventId
						});
					}, 1000);
				}
				that.setData({
					selectimg: data.Info[0].ProductPic
				})
				if (data.Info[0].SpecLst.length > 0) {
					for (var x in data.Info[0].SpecLst) { //筛选出已经选择的规格
						for (var m in data.Info[0].SpecLst[x].svLst) {
							if (data.Info[0].SpecLst[x].svLst[m].IsChecked) {
								data.Info[0].SpecLst[x].ckid = data.Info[0].SpecLst[x].svLst[m].Id; //保存选择的规格ID到最外面，后面对选择规格的替有用
								that.data.splist.push(data.Info[0].SpecLst[x].svLst[m].Id);
								that.data.splistStr.push(data.Info[0].SpecLst[x].svLst[m].Name);
							};
						}
					}
				} else {
					that.setData({
						selectimg: data.Info[0].ProductPic
					})
				}
				wx.setNavigationBarTitle({
					title: data.Info[0].SalesName
				})

				that.setData({
					ProductInfo: data.Info[0],
					isCollection: (data.Info[0].userAttentionCount > 0) ? true : false,
					skuid: data.Info[0].ProductSKU_Id,
					Parameters: data.Info[0].ProductParameters ? that.Grouping(data.Info[0].ProductParameters) : [],
					desc: data.Info[0].SellingPoints,
					pname: data.Info[0].ProductName,
					stock: data.Info[0].Stock
				});
				WxParse.wxParse('pinfo', 'html', data.Info[0].Describe, that);
				WxParse.wxParse('Services', 'html', data.Info[0].AfterService, that);
			}
		});
	},
	
	picDetail:function() { //图文详情
		this.setData({
			tapindex: 1
		});
	},
	spcParam:function() { //规格参数
		this.setData({
			tapindex: 2
		});
	},
	packingList:function() { //包装清单
		this.setData({
			tapindex: 3
		});
	},
	afterService:function() { //售后fuw
		this.setData({
			tapindex: 4
		});
	},
	Grouping: function (arr) { //进行分组
		var map = {},
			dest = [];
		for (var i = 0; i < arr.length; i++) {
			var ai = arr[i];
			if (!map[ai.ParameterGroupId]) {
				dest.push({
					ParameterGroupId: ai.ParameterGroupId,
					name: ai.ParameterGroupName,
					data: [ai]
				});
				map[ai.ParameterGroupId] = ai;
			} else {
				for (var j = 0; j < dest.length; j++) {
					var dj = dest[j];
					if (dj.ParameterGroupId == ai.ParameterGroupId) {
						dj.data.push(ai);
						break;
					}
				}
			}
		}
		return dest;
	}
})

function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
	return currentdate;
}


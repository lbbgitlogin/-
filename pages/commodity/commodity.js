var app = getApp()
var $ = require('../../utils/util.js');
var productapi = require('../../api/productAPI.js');
Page({
	data: {
		tapindex: 1, //当前项
		pageindex: 1,
		ispage: true,
		isdata: false,
		flag: true, //是否可以进行下次分页
		productlist: [],
		itemCount:10,
		startNumber:1,
		productStatus: 'online',
		isShowOperator: false,
		curIndex: -1
	},
	onLoad: function (options) {
		this.getProductlist();
	},


	selling: function () { //销售中
		if (this.data.tapindex == 1) {
			return;
		}
		this.setData({
			tapindex: 1,
			startNumber:1,
			itemCount:10,
			productlist: [],
			productStatus: 'online',
			isShowOperator: false,
			isdata: false,
			curIndex: -1
		});
		this.getProductlist();
	},
	storehouse: function () { //仓库中
		if (this.data.tapindex == 2) {
			return;
		}
		this.setData({
			tapindex: 2,
			startNumber:1,
			itemCount:10,
			productlist: [],
			productStatus: 'offline',
			isShowOperator: false,
			isdata: false,
			curIndex: -1
		});
		this.getProductlist({}, 1);
	},
	searchproduct: function () { //搜索
		this.setData({
			tapindex: 3
		});
	},
	scrollbottom: function (needLoading) { //进行分页
		if (this.data.flag) { //判断是否可以进行下次分页
			this.setData({
				flag: false
			});
			var thisobj = this;
			clearTimeout(time);
			var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
				thisobj.setData({
          startNumber: thisobj.data.startNumber + 1
				});
				thisobj.getProductlist(needLoading);
			}, 500);
		}
	},
	getProductlist: function (needLoading) { //统一获取订单列表
		var val = {
			productName: '',
			productStatus: this.data.productStatus,
			vendorId: app.globalData.VendorInfo.Id,
			startNumber:this.data.startNumber,
			itemCount: this.data.itemCount
		}
		var thisobj = this;
		$.xsr($.makeUrl(productapi.GetVendorProductListByStatus, val), function (res) {
			if (!$.isNull(res.Info) && res.Code == 0) {
				if (res.Info.length < 10) {
					thisobj.setData({
						productlist: thisobj.data.productlist.concat(res.Info),
						flag: false,
						ispage: false,
						isdata: true
					});
				} else {
					thisobj.setData({
						productlist: thisobj.data.productlist.concat(res.Info),
						flag: true,
						ispage: true,
						isdata: true
					});
				}
			} else {
				thisobj.setData({
					flag: false,
					ispage: false,
					isdata: true
				});
			}
		},needLoading);
	},

	deleteproduct: function (e) {//删除

		var thisobj = this;
		wx.showModal({
			title: '提示',
			content: "确认要删除这个商品吗？",
			success: function (res) {
				if (res.confirm) {
					thisobj.doDelete(e);
				}
			}
		});
		
	},

	doDelete:function(e){
		var val = {
			productId: e.currentTarget.dataset.pid,
			vendorId: app.globalData.VendorInfo.Id,
			index: e.currentTarget.dataset.index
		}
		var thisobj = this;
		$.xsr($.makeUrl(productapi.DeleteProduct, val), function (res) {
			if (res.Code == 0) {
				thisobj.setData({//关闭操作弹窗
					isShowOperator: false,
					curIndex: -1
				});
				$.alert("删除成功");

				var list = thisobj.data.productlist;
				list.splice(val.index, 1);
				thisobj.setData({//数组删除元素
					productlist: list
				});
				if (thisobj.data.flag && thisobj.data.productlist.length < 10) {//如果可以分页继续加载
					thisobj.scrollbottom(false);//继续加载下一页
				}
			}
		}, false);
	},
	undercarriage: function (e) {//下架
		var val = {
			productId: e.currentTarget.dataset.pid,
			vendorId: app.globalData.VendorInfo.Id,
			action: 'offline',
			index: e.currentTarget.dataset.index
		}
		this.action(val);
	},
	putonsale: function (e) {//上架
		if(e.currentTarget.dataset.stock == 0){
			$.alert("库存为0，不能上架！");
			this.setData({
				isShowOperator:false
			});
			return;
		}
		var val = {
			productId: e.currentTarget.dataset.pid,
			vendorId: app.globalData.VendorInfo.Id,
			action: 'online',
			index: e.currentTarget.dataset.index
		}
		this.action(val);
	},

	action: function (val) {//上下架统一处理
		var thisobj = this;
		$.xsr($.makeUrl(productapi.ChangeProductStatus, val), function (res) {
			if (res.Code == 0) {
				thisobj.setData({//关闭操作弹窗
					isShowOperator: false,
					curIndex: -1
				});
				if (val.action == 'online') {
					$.alert("该商品上架成功");
				} else if (val.action == 'offline') {
					$.alert("该商品下架成功");
				}

				var list = thisobj.data.productlist;
				list.splice(val.index, 1);
				thisobj.setData({//数组删除元素
					productlist: list
				});

				if (thisobj.data.flag && thisobj.data.productlist.length < 10) {
					thisobj.scrollbottom(false);		
				}
			}
		}, false);
	},

	operator: function (e) {//操作
		this.setData({
			isShowOperator: true,
			curIndex: e.currentTarget.dataset.index
		});
	},

	productdetail: function (e) {//跳转商品详情页面
		this.setData({
			isShowOperator: false,
			curIndex: -1
		});
		wx.navigateTo({
			url: '../productdetail/productdetail?pid=' + e.currentTarget.dataset.pid
		})
	}
})
var app = getApp()
var $ = require('../../utils/util.js');
var productapi = require('../../api/productAPI.js');
Page({
	data: {
		tapindex: 1, //当前项
		pageindex: 1,
		pagesize: 10,
		ispage: true,
		isdata: false,
		flag: true, //是否可以进行下次分页
		productlist: [],
		productStatus: 'online',
		isShowOperator: false,
		curIndex: -1,
		productName: '',
		orderBy: '',//销量"SaleNum"；新品"CreateTime"；价格"Price"
		priceOrder: false,
		post: {}
	},
	onLoad: function (options) {
		this.setData({
			productName: options.pname
		});
		wx.setNavigationBarTitle({
			title: options.pname
		})
		this.setData({
			isShowOperator: false,
			curIndex: -1,
			tapindex: 1,
			productlist: [],
			post: { //请求数据
				startNumber: 1,
				itemCount: 10,
				orderBy: 'SaleNum',
				productName: this.data.productName,
				sortingDirection: 'desc',
				vendorId: app.globalData.VendorInfo.Id
			},
		});
		this.getProductlist();
	},


	sealnum: function () { //销量

		if (this.data.tapindex == 1) {
			return;
		}
		this.setData({
			isShowOperator: false,
			isdata: false,
			curIndex: -1,
			tapindex: 1,
			productlist: [],
			post: { //请求数据
				startNumber: 1,
				itemCount: 10,
				orderBy: 'SaleNum',
				productName: this.data.productName,
				sortingDirection: 'desc',
				vendorId: app.globalData.VendorInfo.Id
			},
		});
		this.getProductlist();
	},
	newpd: function () { //上新
		if (this.data.tapindex == 2) {
			return;
		}
		this.setData({
			isShowOperator: false,
			isdata: false,
			curIndex: -1,
			tapindex: 2,
			productlist: [],
			post: { //请求数据
				startNumber: 1,
				itemCount: 10,
				orderBy: 'CreateTime',
				productName: this.data.productName,
				sortingDirection: 'desc',
				vendorId: app.globalData.VendorInfo.Id
			},
		});
		this.getProductlist();
	},
	pdprice: function () { //价格
  
		this.setData({
			priceOrder: !this.data.priceOrder
		});

		this.setData({
			isShowOperator: false,
			isdata: false,
			curIndex: -1,
			tapindex: 3,
			productlist: [],
			post: { //请求数据
				startNumber: 1,
				itemCount: 10,
				orderBy: 'Price',
				productName: this.data.productName,
				vendorId: app.globalData.VendorInfo.Id,
				sortingDirection: this.data.priceOrder ? 'desc' : 'asc'
			},
		});
    console.log("排序", this.data.post)
		this.getProductlist();
	},

	scrollbottom: function (needLoading) { //进行分页
		if (this.data.flag) { //判断是否可以进行下次分页
			this.setData({
				flag: false
			});
			var thisobj = this;
			clearTimeout(time);
			var time = setTimeout(function () { //延迟处理处理，防止多次快速滑动
				var newPost = thisobj.data.post;
        newPost.startNumber = thisobj.data.post.startNumber + 1;
				thisobj.setData({
					post: newPost
				});
				thisobj.getProductlist(needLoading);
			}, 500);
		}
	},
	getProductlist: function (needLoading) { //统一获取订单列表
		var thisobj = this;
		$.xsr($.makeUrl(productapi.GetVendorProductListByStatus, thisobj.data.post), function (res) {
      console.log("排序数据",res)
      console.log("thisobj.data.post", thisobj.data.post)
			if (!$.isNull(res.Info) && res.Code == 0) {
				if (res.Info.length < 10) {
					thisobj.setData({
						flag: false,
						ispage: false,
						isdata: true

					});
					thisobj.setData({
						productlist: thisobj.data.productlist.concat(res.Info)
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

	doDelete: function (e) {
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
				var list = thisobj.data.productlist;
				if (val.action == 'online') {
					$.alert("该商品上架成功");
					list[val.index].Status = 'online';
				} else if (val.action == 'offline') {
					$.alert("该商品下架成功");
					list[val.index].Status = 'offline';
				}
				thisobj.setData({
					productlist: list
				});
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
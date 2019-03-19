var cf = require('../config.js');
module.exports = {
	GetVendorProductListByStatus: { //获取商品列表
		url: cf.config.configUrl + 'ProudctWebService.asmx/GetVendorProductListByStatus',
		post: {
			vendorId: '?',
			productName: '?',
			productStatus: '?',//上架online,下架offline
			itemCount:'?',
			orderBy:'?',//销量"SaleNum"；新品"CreateTime"；价格"Price"
			sortingDirection:'?',//"as`c"正序；"desc"倒序
			startNumber:'?'
		}
	},

	ChangeProductStatus: { //商品上下架
		url: cf.config.configUrl + 'ProudctWebService.asmx/ChangeProductStatus',
		post: {
			productId: '?',
			vendorId: '?',
			action: '?'
		}
	},
	DeleteProduct: { //删除商品
		url: cf.config.configUrl + 'ProudctWebService.asmx/DeleteProduct',
		post: {
			productId: '?',
			vendorId: '?'
		}
	},
	
	GetProductById: { //商品详情
		url: cf.config.configUrl + 'ProudctWebService.asmx/GetProductById',
		post: {
			proId: '?',
      IsVendorMiniApp: '?'
		}
	}
	
}
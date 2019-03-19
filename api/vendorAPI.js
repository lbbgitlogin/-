var cf = require('../config.js');
module.exports = {
	GetAgent: { //获取代理商信息
		url: cf.config.configUrl + 'VendorWebService.asmx/GetVendorAgent',
		post: {
			vendorId: '?'
		}
	},
	GetVendorReport: { //销售数据总览
		url: cf.config.configUrl + 'VendorWebService.asmx/GetVendorReport',
		post: {
      storeAccountId: '?',
			vendorId: '?'
		}
	},
  GetStoreQuickPayQRCode: { //收款码
    url: cf.config.configUrl + 'VendorWebService.asmx/GetStoreQuickPayQRCode',
    post: {
      storeId: '?',
      vendorId: '?'
    }
  }
}
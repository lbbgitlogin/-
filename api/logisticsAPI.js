var cf = require('../config.js');
module.exports = {
	GetLogisticsCompanyList: { //获取物流公司列表
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/GetVendorLogistics',
	}
}
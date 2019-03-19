var cf = require('../config.js');

module.exports = {
	GetVendorOrderListByStatus: { //获取订单列表
    url: cf.config.configUrl + 'VendorOrderWebService.asmx/GetVendorOrderListByCondition',
		post: {
			vendorId: '?',
			type: '?',
			itemCount: '?',
			startNumber: '?',
      firstType:'?',
      orderNum:'?',
      storeAccountId: '?',
		}
	},

	GetOrderByOrderNum: { //根据订单编号查询订单详情
		url: cf.config.configUrl + 'ShoppingCartWebService.asmx/GetOrderByOrderNum',
		post: {
			orderNum: '?',
			userId: '?'
		}
	},

	// DeliveryOrder: { //订单发货
	// 	url: cf.config.configUrl + 'OrderWebService.asmx/DeliveryOrder',
	// 	post: {
	// 		orderNum: '?',
	// 		userAccount: '?',
	// 		trackingNum: '?',
	// 		logisticsKey: '?',
  //     phone: '?',
  //     Shipper: '?'
	// 	}
	// },
  DeliveryOrder: { //订单发货
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/GetOrderDaDaFreight',
    post: {
      orderNum:'?',
      storeId:'?',
      daDaKeepPriceId:'?',
      type: '?', //0 dada   1 uu
      specialType: '?',  //uu
      sendDate: '?',//uu
      isCoupon: '?',//uu


    }
  },
  PrintReceipt: {  //打印小票
    url: cf.config.configUrl + 'ReceiptWebService.asmx/PrintReceipt',
    post: {
      vendorId: '?',
      orderNum: '?'
    }
  },
  GetServiceOrderByReservationCode: {  //获取订单详情
    url: cf.config.configUrl + 'ServiceOrderWebService.asmx/GetServiceOrderByReservationCode',
    post: {
      vendorId: '?',
      reservationCode: '?'
    }
  },
  GetOrderByShipCode: {  //获取自提订单详情
    url: cf.config.configUrl + 'OrderWebService.asmx/GetOrderByShipCode',
    post: {
      vendorId: '?',
      shipCode: '?'
    }
  },
  GetCouponInfoByWriteOffCode: {  //核销优惠券查询优惠券
    url: cf.config.configUrl + 'UserWebService.asmx/GetCouponInfoByWriteOffCode',
    post: {
      vendorId: '?',
      writeOffCode: '?'
    }
  },
  WriteOffServiceOrderUsedByVendor: {  //核销
    url: cf.config.configUrl + 'ServiceOrderWebService.asmx/WriteOffServiceOrderUsedByVendor',
    post: {
      storeAccountId: '?',
      vendorId: '?',
      reservationCode: '?'
    }
  },
  WriteOffUserTakingOrder: {  //自提核销
    url: cf.config.configUrl + 'OrderWebService.asmx/WriteOffUserTakingOrder',
    post: {
      storeAccountId: '?',
      vendorId: '?',
      shipCode: '?'
    }
  },
  CouponOfflineWriteOff: {  //优惠券核销 

    url: cf.config.configUrl + 'UserWebService.asmx/CouponOfflineWriteOff',
    post: {
      vendorId: '?',
      couponItemId: '?'
    }
  },
  GetCouponLimitProduct: {  //搜索适用商品 
    
    url: cf.config.configUrl + 'UserWebService.asmx/GetCouponLimitProduct',
    isloading: false,
    post: {
      VendorId: '?',
      PageIndex: '?',
      PageSize: '?',
      CouponId: '?',
      ProductNameOrCode: '?',
      type:1
    }
  },
  
  CancelServiceOrders: {  //取消订单
    url: cf.config.configUrl + 'VendorOrderWebService.asmx/CancelServiceOrders',
    post: {
      vendorId: '?',
      orderNum: '?',
      cancelReasonId: '?',
      cancelReason: '?'
    }
  },
  PrintReceiptServiceOrders: {  //派单
    url: cf.config.configUrl + 'VendorOrderWebService.asmx/PrintReceiptServiceOrders',
    post: {
      orderNum : '?',
      workerName: '?',
      workerCellPhone: '?'
    }
  },
  GetOrderByOrderNum: {  //查看实物订单详情
    url: cf.config.configUrl + 'VendorOrderWebService.asmx/GetOrderByOrderNum',
    post: {
      orderNum: '?',
    }
  },
  GetServiceOrder: {  //查看服务订单详情
    url: cf.config.configUrl + 'VendorOrderWebService.asmx/GetServiceOrder',
    post: {
      orderNum: '?',
    }
  },
  GetMealOrder: {  //查看扫码订单详情
    url: cf.config.configUrl + 'VendorOrderWebService.asmx/GetMealOrder',
    post: {
      orderNum: '?',
      vendorId:'?'
    }
  },
  GetSendOrderData: {  //获取订单发货数据信息
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/GetSendOrderDataNotEncrypted',
    post: {
      orderNum: '?',
      vendorId: '?',
       isCache: true,
    }
  },
   
  GetVendorDaDaStoresList: {  //获取达达门店列表数据信息
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/GetVendorDaDaStoresList',
    post: {
      orderNum: '?',
      vendorId: '?',
      pageIndex:'?',
      storeAccountId: '?',
    }
},
  GetVendorUUStoresList: {  //uu门店列表数据信息
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/GetVendorUUStoresList',
    post: {
      orderNum: '?',
      vendorId: '?',
      pageIndex: '?',
      storeAccountId: '?',
    }
  },
  GetVendorStoresList: {  //获取商家自送门店列表数据信息
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/GetVendorStoresList',
    post: {
      orderNum: '?',
      vendorId: '?',
      pageIndex: '?',
      storeAccountId: '?',
    }
  },

  GetOrderDaDaFreight: {  //达达预发单计算配送费
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/GetOrderDaDaFreight',
    post: {
      orderNum: '?',
      storeId :'?',
      daDaKeepPriceId :'?'
    }
  },
  VendorSendOrder: {  //发货
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/VendorSendOrder',
    post: {
      orderNum: '?',
      orderSendTypeId: '?',
      citySendTypeId: '?',
      logisticsId: '?',
      vendorStoreId: '?',
      dadaKeepPriceId: '?',
      firstInfoText: '?',
      secondUserName:'?',
      thirdSendTime: '?',
      freightMoney: '?',
      specialType: '?',  //uu
      sendDate: '?',//uu
      isCoupon: '?',//uu

    }
  },
  ExpressQuery: {//查询物流进度
    url: cf.config.configUrl + 'ShoppingCartWebService.asmx/ExpressQuery',
    post: {
      OrderNum: "?"
    }
  },
  GetShipmentStakeholders: { //获取达达配送订单详情信息  
    url: cf.config.configUrl + 'CityDistribution.asmx/GetShipmentStakeholders',
    post: {
      orderNum: "?",
      vendorId: "?"
    }
  },
  GetShipmentDetailList: { //获取配送单详情  
    url: cf.config.configUrl + 'CityDistribution.asmx/GetShipmentDetailList',
    post: {
      orderNum: "?",
      vendorId: "?"
    }
  },
  UpdateServiceOrderInfo: { //服务订单更改预约时间与门店 
    url: cf.config.configUrl + 'VendorOrderWebService.asmx/UpdateServiceOrderInfo',
    post: {
      orderNum: "?",
      orderUpdateType : "?",
      updaeStoreId :"?",
      updateReservationTime :"?",
    }
  },
  GetVendorStores: { //服务订单更改预约时间与门店 
    url: cf.config.configUrl + 'VendorOrderWebService.asmx/GetVendorStores',
    post: {
      vendorId:"?"
    }
  },
  CancelReson: { //取消原因
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/CancelReson',
    post: {
      // num: "?"
    }
  },
  CancelSendDaDa: { //取消原因
    url: cf.config.configUrl + 'VendorDeliveryWebService.asmx/CancelSendDaDa',
    post: {
      orderNum: "?",
      vendorId: "?",
      cancelReasonId: "?",
      cancelReason: "?",
    }
  },
  
}
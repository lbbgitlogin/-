var cf = require('../config.js');
module.exports = {
    CheckLogin: { //商家用户登录接口，登录验证方法（返回用户资料）
        url: cf.config.configUrl + 'VendorWebService.asmx/CheckLogin',
        post: {
            UserAccount: '?',
            Password: '?',
            needAudit:'?',
            vendorOrStoreType :'?'
        }
    },

//短信类型：商家忘记密码VENDORFORGETPWD，商家修改密码CHANGEPASSWORD，商家修改手机号VENDORUPDATEPHONE
    SendSmsCode: { //发送短信验证码
        url: cf.config.configUrl + 'VendorWebService.asmx/SendSmsCode',
        post: {
            userAccount: '?',//选填
            cellPhone: '?',
            smsType: '?'
        }
    },
//短信类型：商家忘记密码VENDORFORGETPWD，商家修改密码CHANGEPASSWORD，商家修改手机号VENDORUPDATEPHONE
    ValidateSmsCode: { //验证短信验证码
        url: cf.config.configUrl + 'VendorWebService.asmx/ValidateSmsCode',
        post: {
            cellPhone: '?',
            smsCode: '?',
            smsType: '?'
        }
    },

    ResetPassword: { //忘记（找回）密码
        url: cf.config.configUrl + 'VendorWebService.asmx/ResetPassword',
       post: {
            cellPhone: '?',
            smsCode: '?',
            newPassword: '?',
            userAccount: '?'
        }
    },

    ChangePassword: { //修改密码
        url: cf.config.configUrl + 'VendorWebService.asmx/ChangePassword',
       post: {
            userAccount: '?',
            oldPassword: '?',
            newPassword: '?'
        }
    },

    ChangeCellPhone: { //修改密码
        url: cf.config.configUrl + 'VendorWebService.asmx/ChangeCellPhone',
       post: {
            userAccount: '?',
            password: '?',
            newCellPhone: '?',
            smsCode: '?'
        }
    },
  VendorRegister: { //商家注册
    url: cf.config.configUrl + 'VendorWebService.asmx/VendorRegister',
    post: {
      userAccount: '?',  //商家账号
		  passWord	: '?',	//密码
	    comPassWord: '?', // 确认密码
	 	  phone	: '?',		//注册手机号
		  code	: '?',		//手机验证码
      channelCode: '?',//邀请码
      isCache: true
    }
  },
  GetCheckCode: { //商家注册获取短信
    url: cf.config.configUrl + 'VendorWebService.asmx/GetCheckCode',
    post: {
      userAccount: '?',  //商家账号
      phone: '?',		//注册手机号
      isCache: true
    }
  },
  
  GetVendorBusinessCategory: { //获取一级类目
    url: cf.config.configUrl + 'VendorWebService.asmx/GetVendorBusinessCategory',
    post: {
      userAccount: '?',  //商家账号
      isCache: true
    }
  },
  
  GetVendorBusinessChildCategory: { //获取二级类目
     url: cf.config.configUrl + 'VendorWebService.asmx/GetVendorBusinessChildCategory',
    post: {
      userAccount: '?',  //商家账号
      categoryId: '?',//一级id
      isCache: true
    }
  },
  VendorSettingMsg: { //补全注册信息
    url: cf.config.configUrl + 'VendorWebService.asmx/VendorSettingMsg',
    post: {
      userAccount: '?',  //商家账号
      categoryId: '?',//一级id
      childcategoryId: '?',//二级id
      businessName: '?',//		企业信息
      personName: '?',//		法人姓名
      isCache: true
    }
  },
   
}
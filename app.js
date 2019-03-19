//app.js
var $ = require('utils/util.js');
var api = require('api/loginAPI.js');
App({
  onLaunch: function() {

  },
  GetVenderInfo: function(callback, val) {
    var that = this;
    $.xsr($.makeUrl(api.CheckLogin, val), function(data) {
      console.log("登录", data)
      if (data.Code == 1) {

        $.alert(data.Msg);
        return
      } else if (data.Code == 0 && data.Info[0].IsEnable == false) {
        $.alert("账户已停用");
        return


      } else if (data.Code == 0 && data.Info[0].IsEnable && data.Info[0].Name != null && data.Info[0].Name != '') {

        that.globalData.VendorInfo = data.Info[0];
        $.alert(data.Msg);
        callback && callback();
      } else if (data.Code == 0 && data.Info[0].IsEnable && data.Info[0].Name == null || data.Info[0].Name == '') {

        wx.navigateTo({
          url: '../../pages/nextregi/nextregi'
        })
      }
      //  else if (data.Code == 1) {
      //   debugger
      // 	$.alert(data.Msg);
      // }
    });
  },
  globalData: {
    VendorInfo: null
  }
})
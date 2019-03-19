var cj = require('CryptoJS-AES.js');
var cf = require('../config.js');

var keyval = cf.config.ASEkey;
var ivval = cf.config.ASEIv;

var key = cj.CryptoJS.enc.Utf8.parse(keyval);
var iv = cj.CryptoJS.enc.Utf8.parse(ivval);

//加密同时转成16进制
function Encrypt(word) {
	var srcs = cj.CryptoJS.enc.Utf8.parse(word);
	var encrypted = cj.CryptoJS.AES.encrypt(srcs, key, {
		iv: iv,
		mode: cj.CryptoJS.mode.CBC,
		padding: cj.CryptoJS.pad.Pkcs7
	});
	var base64 = cj.CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
	return stringToHex(base64);
}

//解密前先从16进制转成字符串q
function Decrypt(word) {
	var enstr = hexToString(word);
	var decrypt = cj.CryptoJS.AES.decrypt(enstr, key, {
		iv: iv,
		mode: cj.CryptoJS.mode.CBC,
		padding: cj.CryptoJS.pad.Pkcs7
	});
	var decryptedStr = decrypt.toString(cj.CryptoJS.enc.Utf8);
	return decryptedStr.toString();
}

function stringToHex(str) {
	if (str === "")
		return "";
	var hexCharCode = [];
	for (var i = 0; i < str.length; i++) {
		hexCharCode.push((str.charCodeAt(i)).toString(16));
	}
	return hexCharCode.join("");
}

function hexToString(hexCharCodeStr) {
	var trimedStr = hexCharCodeStr.trim();
	var rawStr = trimedStr;
	var len = rawStr.length;
	if (len % 2 !== 0) {
		wx.showToast({
			title: "Illegal Format ASCII Code!"
		});
		return "";
	}
	var curCharCode;
	var resultStr = [];
	for (var i = 0; i < len; i = i + 2) {
		curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
		resultStr.push(String.fromCharCode(curCharCode));
	}
	return resultStr.join("");
}

function merge() {
	if (arguments.length > 0) {
		var re = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			var o = arguments[i];
			for (var p in o) {
				if (o[p] != undefined) {
					re[p] = o[p];
				}
			}
		}
		return re;
	}
	return undefined;
}

function isNull(o) {
	return o == undefined || o == "undefined" || o == null || o == '';
}

function parseJSON(str) {
	try {
		return JSON.parse(str);
	} catch (e) {
		//todo
		return undefined;
	}
}

function makeUrl(api, data) {
	data = data || {};
	var search = '',
		url = api.url,
		re = {},
		getData = {};
	url = api.url.replace(/{{(\w+)}}/ig, function (all, param) {
		return data[param] || '';
	});
	re.method = 'get';
	if (api.urlEncodeCharset) {
		re.urlEncodeCharset = api.urlEncodeCharset;
	}
	if (api.get) {
		for (var param in api.get) {
			var k = param,
				v = api.get[param];
			var _value = getValue(v, k, data);
			getData[k] = _value;
			search += ((search.length ? '&' : '') + [k, getData[k]].join('='));
		}
	}
	//计算已经存在的searchString
	if (url.indexOf('?') > -1) {
		var _existedSearchStr = url.substring(url.indexOf('?') + 1);
		re.originUrl = url.substring(0, url.indexOf('?'));
		for (var i = 0, a = _existedSearchStr.split('&'); i < a.length; i++) {
			var o = a[i].split('=');
			getData[o[0]] = o[1] || '';
		}
	} else {
		re.originUrl = api.url;
	}
	re.getData = getData;
	if (search.length) {
		if (url.indexOf('?') > -1) {
			if (url.indexOf('?') == url.length - 1) {
				url += search;
			} else {
				url += '&' + search;
			}
		} else {
			url += '?' + search;
		}
	}
	re.url = url;
	if (api.post) {
		var postData = {};
		for (var param in api.post) {
			var _value = getValue(api.post[param], param, data);

			if (api.post[param] == '?' && _value == null && _value == '') {
				//
			} else {
				postData[param] = _value;
			}
		}
		re.method = 'post';
		re.postData = postData
	}
	if (api.isOnlyData == 1) {
		re.postData = {
			data: JSON.stringify(postData)
		};
	}

	function getValue(_v, _k, _d) {
		var v1;
		if (_v == '?') {
			if (_d[_k] === 0) {
				v1 = 0;
			} else {
				v1 = _d[_k] || '';
			}
		} else if (typeof _v == 'function') {
			v1 = _v(_d);
		} else if (_v == '??') {
			v1 = detailGP(_k);
		} else {
			if (_d[_k] === 0) {
				v1 = 0;
			} else {
				v1 = _d[_k] || _v;
			}
		}
		return v1;
	}
	//处理值为+号的
	function detailGP(GPkey) {
		var oJson = {},
			_k, _v, v1;
		var _data = data[GPkey];
		var _body = api[GPkey] || {};
		for (var param in _body) {
			_k = param;
			_v = _body[param];
			if (_v == '?') {
				if (_data[_k] === 0) {
					v1 = 0;
				} else {
					v1 = _data[_k] || '';
				}
			} else {
				if (_data[_k] === 0) {
					v1 = 0;
				} else {
					v1 = _data[_k] || _v;
				}
			}
			oJson[param] = v1;
		}
		return oJson;
	}

	if (api.method) {
		re.method = api.method;
	}
  if (typeof api.isloading != 'undefined'){
    re.isloading = api.isloading;
  }
	return re;
}

function xsr() {
	var headers = {
		//withCredentials : true
	};
	var timeout = 10000;
	switch (arguments.length) {
		case 1:
			//一个参数的时候
			var mixedRequest = arguments[0];
			if (typeof mixedRequest == 'object') {
				wx.request({
					url: mixedRequest.url,
					method: mixedRequest.method,
					header: {
						'content-type': 'application/json'
					},
					success: mixedRequest.success,
					fail: mixedRequest.error,
					complete: mixedRequest.complete //失败成功都会调用
				})
			} else {
				//
			}
			break;
		case 2:
			//两个参数的时候, 第2个参数一定是回调方法
			var mixedRequest = arguments[0],
				callback = arguments[1];
			if (typeof mixedRequest == 'string' && typeof callback == 'function') {
				wx.request({
					url: mixedRequest,
					method: "GET",
					header: {
						'content-type': 'application/json'
					},
					success: callback,
					fail: mixedRequest.error,
					complete: mixedRequest.complete //失败成功都会调用
				})
			} else if (typeof mixedRequest == 'object' && typeof callback == 'function') {
      
        if (typeof (mixedRequest.isloading)  == 'undefined' ){
          loading();
        }
				wx.request({
					url: mixedRequest.url + "?GUID=" + cf.config.GUID,
          
					method: "POST" || mixedRequest.method,
					data: isNull(Encrypt(mixedRequest.postData)) ? "" : {
						data: Encrypt(JSON.stringify(mixedRequest.postData))
					},
					header: {
						'content-type': 'application/json'
					},
					success: function (res) {
						hideloading()
            if (mixedRequest.postData != undefined && mixedRequest.postData.isCache)
 {// 不加密解析  true
							callback(JSON.parse(res.data.d));
						} else {
							callback(JSON.parse(Decrypt(res.data.d)));

						}
					},
					fail: function (res) {
						console.error("错误信息:", res);
					},
					complete: mixedRequest.complete//失败成功都会调用
          
				})
			}
			break;
		case 3:
			//两个参数的时候, 第2个参数一定是回调方法
			var mixedRequest = arguments[0],
				callback = arguments[1];
			if (typeof mixedRequest == 'string' && typeof callback == 'function') {
				wx.request({
					url: mixedRequest,
					method: "GET",
					header: {
						'content-type': 'application/json'
					},
					success: callback,
					fail: mixedRequest.error,
					complete: mixedRequest.complete //失败成功都会调用
				})
			} else if (typeof mixedRequest == 'object' && typeof callback == 'function') {
				if(typeof arguments[2] == 'object'|| typeof arguments[2] == 'undefined'){
					loading();
				}
				wx.request({
					url: mixedRequest.url + "?GUID=" + cf.config.GUID,
					method: "POST" || mixedRequest.method,
					data: isNull(Encrypt(mixedRequest.postData)) ? "" : {
						data: Encrypt(JSON.stringify(mixedRequest.postData))
					},
					header: {
						'content-type': 'application/json'
					},
					success: function (res) {
						if(typeof arguments[2] == 'object' || typeof arguments[2] == 'undefined'){
							hideloading()
						}
						if (mixedRequest.isCache) {
							callback(JSON.parse(res.data.d));
						} else {
							callback(JSON.parse(Decrypt(res.data.d)));

						}
					},
					fail: function (res) {
						console.error("错误信息:", res);
					},
					complete: mixedRequest.complete //失败成功都会调用
				})
			}
			break;
		default:
	}
}

function alert(content, callback, duration) { //普通弹出框
	wx.showToast({
		icon: "success",
		title: content || "成功",
		duration: duration || 2000,
		success: callback
	});
}

function loading(content, time, callback) { //数据加载
	wx.showToast({
		icon: "loading",
		mask: true,
		duration: time || 5000,
		title: content || "loading...",
		success: callback
	});
}

function hideloading() { //隐藏提示框
	clearTimeout(time);
	var time = setTimeout(function () {
		wx.hideToast()
	}, 1000);
}

function confirm(content, callback, isCancel) { //确认对话框
	wx.showModal({
		title: '提示',
		content: content,
		showCancel: isCancel || false,
		success: callback
	})
}

function gopage(url, callback) { //保留当前页，跳转页面
	wx.navigateTo({
		url: url,
		success: callback
	})
}

function gotopage(url, callback) { //关闭当前页面，跳转页面
	wx.redirectTo({
		url: url,
		success: callback
	})
}

function backpage(n, callback) { //返回第N页，大于跳转页面返回首页

	wx.navigateBack({
		delta: n || 1,
		success: callback
	})
}

function setCache(key, data, callback) { //添加缓存【异步】
	wx.setStorage({
		key: key,
		data: data,
		success: callback
	});
}

function getCache(key, callback, failback) { //获取缓存【异步】
	wx.getStorage({
		key: key,
		success: callback,
		fail: failback
	});
}

function removeCache(key, callback) { //移除缓存【异步】
	wx.removeStorage({
		key: key,
		success: callback
	})
}

function FormatTime(endTime) {
	endTime = endTime.replace(/-/g, "/");
	var nowTime = new Date().getTime();//当前时间
	var endTime = new Date(endTime).getTime();  //结束时间
	endTime = endTime > nowTime ? endTime : nowTime;//活动是否已经结束
	if (endTime <= nowTime) {
		clearInterval();
	} else {
		var t = endTime - nowTime;
		var day = Math.floor(t / 1000 / 60 / 60 / 24) + 1;
		var hour = Math.floor(t / 1000 / 60 / 60 % 24);
		var min = Math.floor(t / 1000 / 60 % 60);
		var sec = Math.floor(t / 1000 % 60);
		return {
			day: doubleNum(day),
			hour: doubleNum(hour),
			min: doubleNum(min),
			sec: doubleNum(sec)
		}
	}
}

function doubleNum(num) { //将个位数字变成两位
	if (num < 10) {
		return "0" + num;
	} else {
		return num + "";
	}
}

function sendTpl(val) {//发送模版消息
	xsr(makeUrl(val.api, val.value), function (data) {
		//开始发送模版
		wx.request({
			url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + data.Info.AccessToken,
			method: "POST",
			data: {
				touser:val.WeiXinOpenId,
				template_id: data.Info.WXTmessage_key,
				page: val.pages,
				form_id: val.formId,
				data:parseJSON(data.Info.data)
			},
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {
				console.log("模版消息发送成功",res,val);
			},
			fail: function (res) {
				console.log("模版消息发送失败");
			}
		})
	});
}

function formatTime() {
var date = new Date().getTime();//当前时间
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

module.exports = {
	merge: merge, //把参数2,3...的所有不为undefined的key复制到参数1上
	isNull: isNull, //判断是否为空
	parseJSON: parseJSON, //转json
	makeUrl: makeUrl, //参数化
	xsr: xsr, //发起网络请求
	alert: alert, //弹出框
	loading: loading, //数据加载
	gopage: gopage,
	confirm: confirm,
	gotopage: gotopage,
	backpage: backpage,
	setCache: setCache,
	getCache: getCache,
	removeCache: removeCache,
	hideloading: hideloading,
	FormatTime: FormatTime,
	formatTime:formatTime,
	doubleNum: doubleNum,
	sendTpl:sendTpl
}
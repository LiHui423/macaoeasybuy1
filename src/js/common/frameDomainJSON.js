/*
 * 請在Jquery編譯完成後調用
 * 
 * 以下方法需要先給getUserInfo對象賦值后
 * 最後調用 getUserInfo.go
 * 全局對象：
 * 
 	easyFrame   //框架全局對象
		 	getUserInfo.beforeDataJs  獲取用戶信息之前
		 	getUserInfo.startJs  獲取用戶信息成功之後
		 	getUserInfo.noInfoStartJs  獲取用戶信息失敗，沒有用戶信息
		 	getUserInfo.afterDataJs 獲取用戶信息之後觸發，無論成功還是失敗
		 	
		 	getUserInfo.beforeDataJsReady  獲取用戶信息之前 (ready之後)
		 	getUserInfo.startJsReady  獲取用戶信息成功之後(ready之後)
		 	getUserInfo.noInfoStartJsReady  獲取用戶信息失敗，沒有用戶信息(ready之後)
		 	getUserInfo.afterDataJsReady 獲取用戶信息之後觸發，無論成功還是失敗(ready之後)
 	
 	
 	
 	template 自己註冊的方法和屬性具體查看 template.helper();
 	<%=formatNum(str)%> //數字轉換成金額模式
 	<%=osURL%> //OS路徑
 	<%=cutContent(str,num)%> // 切割內容，str要切割的內容（string），num要返回多少個字（Number）
 	<%=cutModify(str)%> //修飾字符串，把有標籤的刪掉
 * */



window.easyBuy = {
	easyUser : {}, //登錄用戶信息
	pageUser : {}, //頁面所屬用戶信息
	isLogin : false,  //用戶是否登錄過
	easybuy : {}, //商場全局變量
	social : { //社交全局變量
		isEasyLife : false //判斷是否宜生活，用在宜生活的導航searchBar那裡
	},    
	userSpaceGlobal : { //用戶空間全局變量
		isFansFriends : false , //是否在好友粉絲頁（好友粉絲頁的關注與取消關注要進行特殊處理，具體查看userinfo.js）
	},  
	global : {   //通用全局變量
		beforeDataJs : null,  //頁面ready完后觸發 ,請求用戶信息之前  不需要用戶信息
		noInfoStartJs : null,  //頁面ready完后觸發，無用戶信息
		startJs : null,  //頁面ready完后觸發  有用戶信息
		afterDataJs : null,  //請求用戶信息之後，無論有無用戶信息都會調用
		dep : {},   //聲明dep庫
		template : {}, //存放頁面模板
		hasNav : true,  //默認頭部鼠標移入有導航
		easyHeaderFunc : null, //引入頭部的header
		searchBarFunc : null, //引入搜索框searchBar
		osURL : 'http://mbuy.oss-cn-hongkong.aliyuncs.com/', //OS文件路徑
		loginURL : 'http://usermanager.macaoeasybuy.com/login.html',//登錄頁面地址
		registerURL : 'http://usermanager.macaoeasybuy.com/register.html',//註冊頁面地址
		isSelf : false, //頁面是不是自己看自己的,
		pageParameter : {}, //頁面url所有的參數
	}
}

setTimeout(function(){
	console.log("%c \u0045\u0061\u0073\u0079\u0042\u0075\u0079\u5b89\u5168\u63d0\u793a","font-size:50px;color:#ffd0d1;-webkit-text-fill-color:#ffd0d1;-webkit-text-stroke: 2px #FF527C;");
	console.log("%c \u6b64\u700f\u89bd\u5668\u529f\u80fd\u5c08\u4f9b\u958b\u767c\u8005\u4f7f\u7528\uff0c\u8acb\u4e0d\u8981\u5617\u8a66\u5728\u9019\u88e1\u9ecf\u8cbc\u6216\u57f7\u884c\u4efb\u4f55\u5167\u5bb9\uff0c\u9019\u53ef\u80fd\u6703\u5c0e\u81f4\u60a8\u7684\u8cec\u6236\u53d7\u5230\u653b\u64ca\uff0c\u7d66\u60a8\u5e36\u4f86\u4e0d\u5fc5\u8981\u7684\u640d\u5931 \uff01","font-size: 20px;color:#333");
},1);

function FrameDomain(){
	this.domain = ".macaoeasybuy.com";
	
	//**********獲取用戶信息對象開始**********
	var frameInnerObj = this;
	this.getUserInfo = {};
	this.getUserInfo.go = function(fn){
		var self = this;
		self.beforeDataJs && self.beforeDataJs(); //獲取用戶信息之前 鉤子
		$(document).ready(function(){
			frameInnerObj.artTemplateHide(); //隱藏所有的模板script標籤
			self.beforeDataJsReady && self.beforeDataJsReady(); //獲取用戶信息之前 鉤子
			easyBuy.global.beforeDataJs&&easyBuy.global.beforeDataJs(); //頁面ready完后觸發 ,請求用戶信息之前  不需要用戶信息
		});
		
		//請求用戶數據
		this.reqFunc({
			hasLogin : function(data){
				easyBuy.isLogin = true;
				easyBuy.easyUser = data; //登錄成功用戶信息
				self.startJs && self.startJs(data); //成功獲取用戶信息 鉤子
				$(document).ready(function(){
					self.startJsReady && self.startJsReady(data); //成功獲取用戶信息 鉤子
					easyBuy.global.startJs && easyBuy.global.startJs(data); //頁面ready完后觸發  有用戶信息
				});
			},
			noLogin : function(){
				easyBuy.isLogin = false; //用戶沒有登錄
				easyBuy.easyUser.shopCartNum = frameInnerObj.getShopCartCookie('ShopCartCookie'); //沒有登錄的購物籃信息
				self.noInfoStartJs && self.noInfoStartJs(); //沒有用戶信息 鉤子
				$(document).ready(function(){
					self.noInfoStartJsReady && self.noInfoStartJsReady(); //沒有用戶信息 鉤子
					easyBuy.global.noInfoStartJs&&easyBuy.global.noInfoStartJs(); //頁面ready完后觸發，無用戶信息
				});
			},
			afterCheckIsLogin : function(){
				fn&&fn();
				self.afterDataJs && self.afterDataJs(); //獲取用戶信息之后 鉤子
				$(document).ready(function(){
					self.afterDataJsReady && self.afterDataJsReady(); //獲取用戶信息之后 鉤子
					easyBuy.global.afterDataJs&&easyBuy.global.afterDataJs(); //請求用戶信息之後，無論有無用戶信息都會調用
					easyBuy.global.easyHeaderFunc&&easyBuy.global.easyHeaderFunc(easyBuy.isLogin); //調用引入頭部的header
				});
			}
		});
		
	}

	
	//獲取用戶數據
	this.getUserInfo.reqFunc = function(opt){
		var self = this;
		var _info = frameInnerObj.getCookie("ENYSTRINETI_STRING");
		if(_info !== null){
			//已登錄狀態
			//有用戶信息，發送請求去後台獲取用戶信息
			var url = "http://userManager.macaoeasybuy.com/UserInfoManagerGetController/LoginTopInfo.easy?easybuyCallback=?";
			url = frameInnerObj.addHref(url);
			$.ajaxSettings.async = false;
			$.getJSON(url, "", function(data) {
				if (data != null && data != "") {
					var datas = data.userInfo;
					opt.hasLogin(datas);
				}else{
					opt.noLogin();
				}
				opt.afterCheckIsLogin();
			});
		}else{
			opt.noLogin();
			opt.afterCheckIsLogin();
		}
	}
	//*******獲取用戶信息對象結束**********
	
	this.loadCss = function(url){ 
		var link = document.createElement( "link" ); 
		link.type = "text/css"; 
		link.rel = "stylesheet"; 
		link.href = url; 
		document.getElementsByTagName( "head" )[0].appendChild(link); 
	}; 
	
	//獲取url後面所有的參數，存進全局對象組裡面
	this.setGlobalParameter = function(){
		var url = location.search; //获取url中"?"符后的字串 
		var theRequest = new Object(); 
		if(url.indexOf("?") != -1) { 
			var str = url.substr(1); 
			var strs = str.split("&"); 
			for(var i = 0; i < strs.length; i ++) { 
				theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]); 
			} 
		}
		$.each(theRequest, function(k,y) {
			easyBuy.global.pageParameter[k] = y;
			if(k == 'userid'){
				easyBuy.pageUser.id = parseInt(y);
			}
		});
	}
	this.setGlobalParameter();
	
	//讓arttempalte從頁面消失，存在easy.global.template裡面
	this.artTemplateHide = function(){
		$('script[data-type=template]').each(function(){
			easyBuy.global.template[$(this).attr('id')] = $(this).html().replace(/[\r\n]/g,"");
			$(this).remove();
		});
	}
	
	this.Isverify = function(){
		var self = this;
		var parmData = getUrlParam("_encryption");
		var parmData_ = getUrlParam("_term");
		var loadUrl = window.location.host + window.location.port;
		if(parmData == "null" || parmData == null || parmData == "" || parmData_ == "null" || parmData_ == null || parmData_ == "") {
			window.location.href = loadUrl;
		} else {
			var times = self.getNowFormatDate() - parmData_;
			if(times > 3000000 || times < 0) {
				alert("頁面丟失");
				window.location.href = loadUrl;
			}
			var los = location.href;
			los = los.replace("&_encryption=" + parmData, "");
			los = los.replace("?_encryption=" + parmData, "");
			los = los.replace("&_term=" + parmData_, "");
			if(parmData != self.systemAci(decodeURI(los))) {
				window.location.href = loadUrl;
			}
		}
	}
	
	this.generateverify = function(obj){
		var self = this;
		if(obj.length != 0){
			var box = obj;
		}else{
			var box = $('html');	
		}
		var dataeasybuy = box.find('a');
		for(var i = 0; i < dataeasybuy.length; i++) {
			var easys = dataeasybuy[i];
			var Tx = $(easys).attr("data-easybuy");
			if(Tx == "?") {
				var href = $(easys).attr("href");
				$(easys).attr("href",self.addUrlParamesIs(href));
			}
		}
	}
	//獲取Url參數
	this.getUrlParam = function(name,bol){
		//加了 bol = true 就是對參數解碼
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if(r != null){
			if(bol){
				return unescape(decodeURI(r[2]));
			}else{
				return unescape(r[2]);
			}
		}else{
			return null;
		}
	}
	
	//獲取cookie
	this.getCookie = function(name){
		var arr, 
			reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	     if(arr = document.cookie.match(reg)){
			return unescape(arr[2]);
		}else{
			return null;
		}
	}
	
	
	//獲取購物籃cookie
	this.getShopCartCookie = function(name){
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg)){
			var ShopCartCookie=unescape(arr[2]);
			return JSON.parse(JSON.parse(ShopCartCookie)).length;
		}else{
			return 0;
		}
	}
	
	//設置cookie
	this.setCookie = function(name,value,time){
		/*
		 	參數說明
			s20代表20秒
			m30代表30分鐘
			h12代表12小時
			d30代表30天
		*/
		var self = this;
		var strsec = self.getsec(time);
		var exp = new Date();
		exp.setTime(exp.getTime() + strsec * 1);
		document.cookie = name + "=" + escape(value) + ";expires=" +exp.toGMTString();
	}
	//刪除cookie
	this.delCookie = function(name){
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = getCookie(name);
		if(cval != null){
			document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
		}
	}
	// @param str  單個參數值
	this.parameIcy5c = function(str) {
		var _in = "";
		str = str.toLowerCase();
		var su = 1;
		for ( var i = 0,len=str.length; i < len; i++) {
			var ins = str[i];
			if (!isNaN(ins) && $.trim(ins) != "") {
				if (ins == 0)
					ins = "∝";
				if (ins == 1)
					ins = "∽";
				if (ins == 2)
					ins = "∈";
				if (ins == 3)
					ins = "∞";
				if (ins == 4)
					ins = "≌";
				if (ins == 5)
					ins = "∉";
				if (ins == 6)
					ins = "∥";
				if (ins == 7)
					ins = "∬";
				if (ins == 8)
					ins = "∭";
				if (ins == 9)
					ins = "∂";
			}
			if (su == 10000) {
				su = 1;
			}
			var os = (ins.charCodeAt(ins) + su) + "";
			su++;
			if (os.length == 1) {
				os = "00000" + os;
			} else if (os.length == 2) {
				os = "0000" + os;
			} else if (os.length == 3) {
				os = "000" + os;
			} else if (os.length == 4) {
				os = "00" + os;
			} else if (os.length == 5) {
				os = "0" + os;
			}
			_in += os;
		}
		return _in;
	}
	this.outLogin = function(){
		var self = this;
		var url = "http://userManager.macaoeasybuy.com/userInfoManagerController/outTimeLogin.easy?easybuyCallback=?";
		var href = self.addHref(url);
		$.get(href, "", function(data) {
			
		});
	}
	this.wxLogin = function(){
		window.location.href = "https://open.weixin.qq.com/connect/qrconnect?appid=wx47c5603ba720e93d&redirect_uri=https%3a%2f%2fwww.macaoeasybuy.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
	}
	//獲取服務器時間
	this.getServerTime = function(){
		var time = null, curDate = null;
		var enss = null;
		$.ajax({
			type : "OPTIONS",
			async : false,
			url : "/",
			complete : function(x) {
				time = x.getResponseHeader("Date");
				curDate = new Date(time);
				enss = curDate.getFullYear() + "-" + (curDate.getMonth() + 1) + "-"
						+ curDate.getDate() + " " + curDate.getHours() + ":"
						+ curDate.getMinutes() + ":" + curDate.getSeconds();
			}
		});
		return enss;
	}
	// DES加密 DES加密和解密过程中，密钥长度都必须是8的倍数
	this.encryptByDES = function(message){
		var key = "@vOW7dD0XA*PQKta1w2ZuQKLvr9D%OoA8Ol59wb06W&w!o1hH!#Waz!T";
		var keyHex = CryptoJS.enc.Utf8.parse(key);
		var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
			mode : CryptoJS.mode.ECB,
			padding : CryptoJS.pad.Pkcs7
		});
		return encrypted.toString();
	}
	//解密
	this.decryptByDES = function(ciphertext){
		var keyHex = CryptoJS.enc.Utf8.parse(key);
		var decrypted = CryptoJS.DES.decrypt({
			ciphertext : CryptoJS.enc.Base64.parse(ciphertext)
		}, keyHex, {
			mode : CryptoJS.mode.ECB,
		// 这一步 是来填写 加密时候填充方式 padding: CryptoJS.pad.Pkcs7
		});
		return decrypted.toString(CryptoJS.enc.Utf8);
	}
	//map 結構
	this.Map = function(){
		this.values = new Array();
		this.put = function(key, val) {
			var data = {
				val : [ {
					keys : key,
					vals : val
				} ]
			};
			this.values[this.isKey(key)] = data;
		};
		this.get = function(key) {
			var len = this.isKey(key);
			var newValues = this.values[len];
			if (undefined != newValues) {
				newValues = newValues.val[0].vals;
				return newValues;
			} else {
				return "";
			}
		};
		this.isKey = function(key) {
			key = key + "";
			key = frameInnerObj.replaceAtre(key);
			key = key.toLowerCase();
			var len = key.length;
			var strs = 0;
			for ( var i = 0; i < len; i++) {
				var ins = key[i];
				if (!isNaN(ins)) {
					strs = parseInt(strs);
					ins = parseInt(ins);
					strs = ins * 2 + strs;
				} else {
					var int = ins.charCodeAt(ins);
					strs = parseInt(strs);
					strs = strs + int * 2;
				}
			}
			return strs;
		};
	}
	this.prefixUrl = function(){
		var dataUrlA = $("a");
		var len = dataUrlA.length;
		var shoppingType = {
			xin : "xin",
			xian : "xian",
			liang : "liang",
			jiang : "jiang",
			re : "re"
		};
		var map = new Map();
		var shopping = new Map();
		shopping.put("0", "http://shopping.macaoeasybuy.com/");
		shopping.put("1", "http://shopping1.macaoeasybuy.com/");
		shopping.put("2", "http://shopping2.macaoeasybuy.com/");
		map.put("shopping", shopping);
		var social = new Map();
		social.put("0", "http://social.macaoeasybuy.com/");
		social.put("1", "http://social1.macaoeasybuy.com/");
		social.put("2", "http://social2.macaoeasybuy.com/");
		map.put("social", social);
		var userspace = new Map();
		userspace.put("0", "http://userspace.macaoeasybuy.com/");
		userspace.put("1", "http://userspace1.macaoeasybuy.com/");
		userspace.put("2", "http://userspace2.macaoeasybuy.com/");
		map.put("userspace", userspace);
		var index = new Map();
		index.put("0", "http://www.macaoeasybuy.com/");
		index.put("1", "http://www1.macaoeasybuy.com/");
		index.put("2", "http://www2.macaoeasybuy.com/");
		map.put("index", index);
		for ( var i = 0; i < len; i++) {
			var easys = dataUrlA[i];
			var prefix = $(easys).attr("data-prefix");
			var suffix = $(easys).attr("data-suffix");
			var Rand = Math.round(Math.random() * 2);
			var map1 = null;
			if (prefix == "shopping") {
				map1 = map.get("shopping");
				prefix = map1.get(Rand);
			} else if (prefix == "social") {
				map1 = map.get("social");
				prefix = map1.get(Rand);
			} else if (prefix == "userspace") {
				map1 = map.get("userspace");
				prefix = map1.get(Rand);
			} else if (prefix == "index") {
				map1 = map.get("index");
				prefix = map1.get(Rand);
			}
			if (suffix == "xin") {
				suffix = shoppingType.xin;
			} else if (suffix == "xian") {
				suffix = shoppingType.xian;
			} else if (suffix == "jiang") {
				suffix = shoppingType.jiang;
			} else if (suffix == "liang") {
				suffix = shoppingType.liang;
			} else if (suffix == "re") {
				suffix = shoppingType.re;
			}
			$(easys).attr("href", prefix + suffix);
		}
	}
	
}
FrameDomain.prototype = {
	addHref : function(href){
		var param = this.addUrlParamesIs(href);
		var time = this.addUrlTimeIs(href);
		return href + param + time;
	},
	addUrlTimeIs : function(href){
		var param = "&_term=" + this.getNowFormatDate();
		return param;
	},
	addUrlParamesIs : function(href){
		var hrefToken = this.systemAci(href);
		var param = "?_encryption=" + hrefToken;
		if (href.indexOf("?") >= 0) {
			param = "&_encryption=" + hrefToken;
		}
		return param;
	},
	systemAci : function(str){
		var self = this;
		str = self.replaceAtre(str);
		str = str.toLowerCase();
		var strs = "";
		for(var i = 0,len = str.length; i < len; i++) {
			var ins = str[i];
			if (!isNaN(ins)) {
				if (ins == 0){
					ins = "a";
				}else if(ins == 1){
					ins = "b";
				}else if(ins == 2){
					ins = "c";
				}else if(ins == 3){
					ins = "d";
				}else if(ins == 4){
					ins = "e";
				}else if(ins == 5){
					ins = "f";
				}else if(ins == 6){
					ins = "g";
				}else if(ins == 7){
					ins = "h";
				}else if(ins == 8){
					ins = "i";
				}else if(ins == 9){
					ins = "j";
				}
			}
			var int = ins.charCodeAt(ins);
			strs += (i + int);
		}
		return strs;
	},
	replaceAtre : function(str){
		str = str.replace(/ /g, "");
		str = str.replace("?", "");
		str = str.replace(/&/g, "");
		str = str.replace("easybuyCallback=?", "");
		return str;
	},
	getNowFormatDate : function(){
		var eay = this.getServerTime();
		var currentDateLong = new Date(eay.replace(new RegExp("-", "gm"), "/")).getTime();
		return currentDateLong;
	},
	getsec : function(str){
		var str1 = str.substring(1,str.length) * 1;
		var str2 = str.substring(0,1);
		if(str2 == 's'){
			return str1 * 1000;
		}else if(str == 'm'){
			return str1 * 60 * 1000;
		}else if(str2 == 'h'){
			return str1 * 60 * 60 * 1000;
		}else if(str2 == 'd'){
			return str1 * 24 * 60 * 60 * 1000;
		}
	}
}
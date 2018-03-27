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



const easyBuy = {
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
};

/**
 * 每个页面是一个 Easyframe 实例
 * 所以在每个页面的 js 文件里都需要做:
 * new Easyframe(options);
 *
 *
 */
class Easyframe {
  constructor() {
    this.data = {
      // 路由信息
      route: [],
      // 是否已经登录了
      isLogin: false,
      // 判断是不是用户空间
      isUserspace: false,
      // 登录的用户信息
      userInfo: {},
      // 当前页面
      search: {},
      // 当前用户登录的cookie
      loginCookie: '',
    };
    this.methods = {};

    this.data.module = window.location.hostname.split('.')[0] === 'userspace';

    if (this.data.login) {
      const ssUserinfo = this.recoverData('loginUserInfo');
      const ssCookie = this.recoverData('loginCookie');
      if (ssUserinfo === null) {

      }
    } else {

    }

    /**
     * 当页面跳转时
     * 将sessionStorage作为中转站去储存请求回来的数据
     * 在下个页面载入时会读取这部分的数据
     */
    window.addEventListener('unload', () => {
      // 当前已登录的用户的信息
      this.data.login && backupData('loginUserInfo', window.easyBuy.easyUser);
      // 当前页面的用户信息
      this.data.isUserspace && backupData('pageUser', window.easyBuy.pageUser);
      // 页面链接的参数
      backupData('pageParameter', window.easyBuy.pageParameter);
      /**
       * 如果用户已登录
       * 会储存当前登录的cookie
       * 用于在其他页面更换用户后，当前页面用户信息不变的错误
       */
      this.data.login && backupData('loginCookie', COOKIE);
    });



    const pageUser = recoverData('pageUser');
    typeof pageUser === 'string' && pageUser.indexOf('id') !== -1 && (easyBuy.pageUser = JSON.parse(pageUser));
    const _this = this;
    this.getUserInfo = {};

    //獲取用戶數據
    this.getUserInfo.reqFunc = function(opt) {
      const self = this;
      const _info = frameInnerObj.getCookie("ENYSTRINETI_STRING");
      if(_info !== null){
        //已登錄狀態
        window.easyBuy.isLogin = true;
        let oldCookie = recoverBackup('loginCookie') || '';
        oldCookie = oldCookie.replace('ENYSTRINETI_STRING=', '');
        const userInfo = recoverBackup('loginUserInfo');
        if (oldCookie !== _info || userInfo === null || userInfo.indexOf('id') === -1) {
          let url = "http://userManager.macaoeasybuy.com/UserInfoManagerGetController/LoginTopInfo.easy?easybuyCallback=?";
          url = frameInnerObj.addHref(url);
          $.ajaxSettings.async = false;
          $.getJSON(url, '', function(data) {
            if (data !== null && data !== "") {
              var datas = data.userInfo;
              opt.hasLogin(datas);
            }else{
              opt.noLogin();
            }
            opt.afterCheckIsLogin();
          });
        } else {
          opt.hasLogin(JSON.parse(userInfo));
          opt.afterCheckIsLogin();
        }
      }else{
        opt.noLogin();
        opt.afterCheckIsLogin();
      }
    }
    //*******獲取用戶信息對象結束**********


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
  }

  init() {

  }

  /**
   * 检查页面是否需要登录
   */
  checkJurisdiction() {
    const hasCookie = document.cookie.match(/ENYSTRINETI_STRING=\S+/gim);
    const COOKIE = hasCookie ? hasCookie[0] : '';
    const keyword = ['userspace'];
    const link = 'http://usermanager.macaoeasybuy.com/login.html';
    this.data.login = COOKIE !== '';
    const href = window.location.href;
    const mustLogin = keyword.filter((value) => {
      return href.indexOf(value) !== -1;
    }).length !== 0;
    !this.data.login && mustLogin && (window.location.href = link);
  }



  /**
   * @description 从 Sessionstorage 里恢复数据
   * @param {string} name
   * @returns {string | null}
   */
  static recoverData(name) {
    const backup = sessionStorage.getItem(name);
    sessionStorage.removeItem(name);
    return backup;
  }

  /**
   * @description 备份数据到 Sessionstorage
   * @param {string} key
   * @param {string|object} value
   * @returns {string | null}
   */
  static backupData(key, value) {
    const _value = typeof value === 'object' ? JSON.stringify(value) : value;
    sessionStorage.setItem(key, _value);
    return sessionStorage.getItem(key);
  }

  static loadCSS(url) {
    const link = document.createElement( "link" );
    link.rel = "stylesheet";
    link.href = url;
    document.head.appendChild(link);
  };

  /**
   * @description 把字符串转为对象
   * @param {string} string
   * @param {string} separator
   */
  static stringToObject(string, separator = '&') {
    const result = {};
    const keyValueArray = string.split(separator);
    keyValueArray.forEach((keyValue) => {
      const KV = keyValue.split('=');
      const valueIsNum = !isNaN(+KV[1]);
      result[KV[0]] = valueIsNum ? +decodeURIComponent(KV[1]) : decodeURIComponent(KV[1]);
    });
    return result;
  }

  /**
   * @description 把对象转为字符串
   * @param {object} object
   * @param {string} separator
   */
  static objectToString(object, separator = '&') {
    const keys = Object.keys(object);
    return keys.reduce((string, key) => {
      return `${string + key}=${object[key] + separator}`;
    }, '');
  }


  /**
   * @description 获取当前页面URL的 Query 部分
   * @returns {object}
   */
  static getHrefSearch() {
    const search = location.search.substring(0);
    return this.stringToObject(search);
  }

  //讓arttempalte從頁面消失，存在easy.global.template裡面
  artTemplateHide() {
    const templates = document.querySelectorAll(`script[data-type=template]`);
    [].splice.apply(templates).forEach((template) => {
      easyBuy.global.template[template.getAttribute('id')] = template.innerHTML.replace(/[\r\n]/gim, '');
      template.remove();
    });
  }

  // Isverify() {
  //   var self = this;
  //   var parmData = getUrlParam("_encryption");
  //   var parmData_ = getUrlParam("_term");
  //   var loadUrl = window.location.host + window.location.port;
  //   if(parmData == "null" || parmData == null || parmData == "" || parmData_ == "null" || parmData_ == null || parmData_ == "") {
  //     window.location.href = loadUrl;
  //   } else {
  //     var times = self.getNowFormatDate() - parmData_;
  //     if(times > 3000000 || times < 0) {
  //       alert("頁面丟失");
  //       window.location.href = loadUrl;
  //     }
  //     var los = location.href;
  //     los = los.replace("&_encryption=" + parmData, "");
  //     los = los.replace("?_encryption=" + parmData, "");
  //     los = los.replace("&_term=" + parmData_, "");
  //     if(parmData != self.systemAci(decodeURI(los))) {
  //       window.location.href = loadUrl;
  //     }
  //   }
  // }

  // generateverify(obj) {
  //   var self = this;
  //   if(obj.length != 0){
  //     var box = obj;
  //   }else{
  //     var box = $('html');
  //   }
  //   var dataeasybuy = box.find('a');
  //   for(var i = 0; i < dataeasybuy.length; i++) {
  //     var easys = dataeasybuy[i];
  //     var Tx = $(easys).attr("data-easybuy");
  //     if(Tx == "?") {
  //       var href = $(easys).attr("href");
  //       $(easys).attr("href",self.addUrlParamesIs(href));
  //     }
  //   }
  // }

  /**
   * @description 获取Cookie
   * @param name
   * @returns {*}
   */
  static getCookie(name) {
    const cookie = document.cookie;
    const startIndex = cookie.indexOf(name);
    if (index === -1) {
      console.log('找不到');
      return null;
    }
    const endIndex = cookie.indexOf(';', startIndex);
    return decodeURIComponent(cookie.substring(startIndex, endIndex));
  }


  //獲取購物籃cookie
  getShopCartCookie(name) {
    let arr;
    const reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)){
      var ShopCartCookie=unescape(arr[2]);
      return JSON.parse(JSON.parse(ShopCartCookie)).length;
    }else{
      return 0;
    }
  }

  /**
   * @description 设置Cookie
   * @param {string} name
   * @param {string} value
   * @param {string} expries s20代表20秒 m30代表30分鐘 h12代表12小時 d30代表30天
   */
  setCookie(name, value, expries) {
    var strsec = self.getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" +exp.toGMTString();
  }
  //刪除cookie
  delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if(cval != null){
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString();
    }
  }

  /**
   * @description
   * @param {string} args
   * @returns {string}
   */
  parameIcy5c(args) {
    const string = args.toLowerCase().split('');
    let count = 1;
    const word = ['∝', '∽', '∈', '∞', '≌', '∉', '∥', '∬', '∭', '∂'];
    const f = ['00000', '0000', '000', '00', '0'];
    return string.reduce((prev, cur, index) => {
      const a = isNaN(cur * 1) ? cur : word[cur];
      count === 10000 && (count = 1);
      const b = a.charCodeAt(0) + count + '';
      count += 1;
      return prev + f[b.length - 1] + b;
    });
  }

  outLogin() {
    var self = this;
    var url = "http://userManager.macaoeasybuy.com/userInfoManagerController/outTimeLogin.easy?easybuyCallback=?";
    var href = self.addHref(url);
    $.get(href, "", function(data) {

    });
  }

  wxLogin() {
    window.location.href = "https://open.weixin.qq.com/connect/qrconnect?appid=wx47c5603ba720e93d&redirect_uri=https%3a%2f%2fwww.macaoeasybuy.com&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
  }

  /**
   * @description 获取服务器的日期
   * @returns {Date}
   */
  getServerDate() {
    let date = '';
    $.ajax({
      type : 'OPTIONS',
      async : false,
      url : '/',
      complete(res) {
        date = res.getResponseHeader("Date");
      }
    });
    return new Date(date);
  }

  // 获取服务器的时间
  getServerTime() {
    return this.getServerDate().getTime();
  }

  // DES加密 DES加密和解密过程中，密钥长度都必须是8的倍数
  encryptByDES(message) {
    var key = "@vOW7dD0XA*PQKta1w2ZuQKLvr9D%OoA8Ol59wb06W&w!o1hH!#Waz!T";
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode : CryptoJS.mode.ECB,
      padding : CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }
  //解密
  decryptByDES(ciphertext) {
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var decrypted = CryptoJS.DES.decrypt({
      ciphertext : CryptoJS.enc.Base64.parse(ciphertext)
    }, keyHex, {
      mode : CryptoJS.mode.ECB,
      // 这一步 是来填写 加密时候填充方式 padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  prefixUrl() {
    const dataUrlA = $('a');
    const len = dataUrlA.length;
    const shoppingType = {
      xin: "xin",
      xian: "xian",
      liang: "liang",
      jiang: "jiang",
      re: "re"
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

  addHref(href) {
    const param = this.addUrlParamesIs(href);
    const time = this.addUrlTimeIs();
    return href + param + time;
  }

  addUrlTimeIs() {
    return '&_term=' + this.getNowFormatDate();
  }

  addUrlParamesIs(href) {
    const hrefToken = this.systemAci(href);
    let param = href.indexOf("?") !== -1 ? '&_encryption=' : '?_encryption=';
    return  param + hrefToken;
  }

  systemAci(args) {
    const _string = this.replaceAtre(args).toLowerCase().split('');
    const array = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    return _string.reduce((prev, cur, index) => {
      const _s = /\d/.test(cur) ? array[cur] : cur;
      return prev + index + _s.charCodeAt(0);
    }, '');
  }

  replaceAtre(args) {
    return args.replace(/(\?|&|easybuyCallback=)/gim, '');
  }


  // 获取毫秒
  getMsec(args) {
    const timeUnits = args[0];
    const value = args.substring(1, args.length) * 1;
    switch (timeUnits) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 1000 * 60;
      case 'h':
        return value * 1000 * 60 * 60;
      case 'd':
        return value * 1000 * 24 * 60 * 60;
    }
  }
}

class SetCookie {
  constructor({ name, value, time }) {
    this.name = name;
    this.value = value;
    this.time = time;
  }
// 設置cookie
  operate() {
    var cookieKey = 'MEB_Route';
    var cookieArr = [];
    //獲取原有的cookie
    var currentCookie = document.cookie.split(";");
    var length = currentCookie.length;
    var that = this;
    // 操作時間
    let strsec = that.getSecond(that.time);
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    currentCookie.forEach(Concrete);
    function Concrete(item1,index){
      var cookieObj = {key0:'',key1:'',key2:'',key3:'',key4:''};
      if(item1.indexOf(cookieKey) !== -1){ //說明有已經存儲的cookie路徑
        if(that.value === 'http://usermanager.macaoeasybuy.com/login.html'){
          that.delete(cookieKey);
        }else{
          var json = JSON.parse(unescape(item1.split('=')[1]));
          var arr = [];//用來存儲MEB_Route中的地址
          arr.push(that.value);
          for(var item in json){
            arr.push(json[item]);
            if(arr.length>5){
              arr.pop();
            }
            cookieObj.key0 = arr[0];
            cookieObj.key1 = arr[1];
            cookieObj.key2 = arr[2];
            cookieObj.key3 = arr[3];
            cookieObj.key4 = arr[4];
            document.cookie = that.name + '=' + escape(JSON.stringify(cookieObj)) + '; Domain=.macaoeasybuy.com' + '; path=/; expires=' + exp.toGMTString();
            // if(that.value === 'http://usermanager.macaoeasybuy.com/login.html'){
            // 	break;
            // 	that.delete(that.name);
            // 	cookieObj.key0 = arr[1];
            // 	cookieObj.key1 = arr[2];
            // 	cookieObj.key2 = arr[3];
            // 	cookieObj.key3 = arr[4];
            // 	cookieObj.key4 = arr[0];
            // 	document.cookie = that.name + '=' + escape(JSON.stringify(cookieObj)) + '; path=/; expires=' + exp.toGMTString();
            // }else{

            // }
          }
        }
      }else{
        length--;
        if(length <= 0){
          var cookieObj = {key0:'',key1:'',key2:'',key3:'',key4:''};
          cookieObj.key0 = window.location.href;
          document.cookie = cookieKey + '=' + escape(JSON.stringify(cookieObj)) + '; Domain=.macaoeasybuy.com' + '; path=/; expires=' + exp.toGMTString();
        }
      }
    }
  }
  // 刪除cookie
  delete(cookieName) {
    var cookies = document.cookie.split(";");//将所有cookie键值对通过分号分割为数组
    //循环遍历所有cookie键值对
    for (var i = 0; i < cookies.length; i++) {
      //比较每个cookie的名称，找到要删除的那个cookie键值对
      if (cookies[i].indexOf(cookieName) !== -1) {
        let exp = new Date();//获取客户端本地当前系统时间
        exp.setTime(exp.getTime() - 1);//将exp设置为客户端本地时间1分钟以前，将exp赋值给cookie作为过期时间后，就表示该cookie已经过期了, 那么浏览器就会将其立刻删除掉
        document.cookie = cookies[i] + ";expires=" + exp.toUTCString();//设置要删除的cookie的过期时间，即在该cookie的键值对后面再添加一个expires键值对，并将上面的exp赋给expires作为值(注意expires的值必须为UTC或者GMT时间，不能用本地时间），那么浏览器就会将该cookie立刻删除掉
        console.log('9999999');
        //break;//要删除的cookie已经在客户端被删除掉，跳出循环
      }
    }
  }
  getSecond(args) {
    const timeUnits = args[0];
    const value = args.substring(1, args.length) * 1;
    let result = 0;
    switch (timeUnits) {
      case 's':
        result = value * 1000;
        break;
      case 'm':
        result = value * 60 * 1000;
        break;
      case 'h':
        result = value * 60 * 60 * 1000;
        break;
      case 'd':
        result = value * 24 * 60 * 60 * 1000;
        break;
    }
    return result;
  }


}
// 實例化
const Instantiate = new SetCookie({
	name : 'MEB_Route',
	value : window.location.href,
	time : new Date().getDate().toString(),
});

Instantiate.operate();

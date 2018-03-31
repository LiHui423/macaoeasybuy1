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
		loginURL : '',//登錄頁面地址
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
  constructor({
    data = {},
    methods = {},
    module,
    nav = true,
    route = [],
  }) {
    this.data = data;
    this.methods = methods;
    this.module = module; // 判断是商城还是用户空间还是社交
    this.route = route; // 路由信息
    this.nav = nav; // 是否开启导航

    this.pageProtocol = 'http:';
    this.apiProtocol = 'http:';
    this.loginPage = 'usermanager.macaoeasybuy.com/login.html';
    this.callbackName = 'easybuyCallback';
    this.cookie = ''; // 当前用户登录的cookie
    this.cookieName = 'ENYSTRINETI_STRING';
    this.keyword = ['userspace'];
    this.search = {}; // 当前页面的 Query
    this.userInfo = {}; // 登录的用户信息

    /**
     * 判断当前访问的页面是否需要登录才能访问
     */
    this.checkJurisdiction();

    /**
     * 如果本地存在登录用的Cookie
     * 就会判断 Sessionstorage 里是否存有登录的用户信息
     */
    this.isLogin() && this.requestUserInfo();
  }

  init() {

  }

  isLogin() {
    return this.cookie !== '';
  }

  isUserspace() {
    return this.module === 'userspace';
  }

  isShopping() {
    return this.module === 'shopping';
  }

  isSocial() {
    return this.module === 'social';
  }

  /**
   * 检查页面是否需要登录
   */
  checkJurisdiction() {
    const href = window.location.href;
    const needJurisdiction = this.keyword.filter((value) => {
      return href.indexOf(value) !== -1;
    }).length !== 0;
    const cookie = this.getCookie(this.cookieName);
    cookie && (this.cookie = cookie);
    const link = `${this.pageProtocol}//${this.loginPage}`;
    needJurisdiction && !this.isLogin() && (window.location.href = link);
  }

  /**
   * 请求用户信息
   */
  requestUserInfo() {
    const ssUserinfo = this.recoverData('loginUserInfo');
    const ssCookie = this.recoverData('loginCookie');
    if (ssCookie === this.cookie && ssUserinfo !== null) {
      this.data.userInfo = JSON.parse(ssUserinfo);
    } else {
      const domain = 'userManager.macaoeasybuy.com';
      const pathname = 'UserInfoManagerGetController/LoginTopInfo.easy';
      const url = `${this.apiProtocol}//${domain}/${pathname}`;
    }
  }

  /**
   * @description 获取当前页面URL的 Query 部分
   * @returns {object}
   */
  getSearch() {
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

  /**
   * @description 获取Cookie
   * @param name
   * @returns {string | null}
   */
  getCookie(name) {
    const cookie = document.cookie;
    const nameIndex = cookie.indexOf(name);
    if (index === -1) return null;
    const startIndex = cookie.indexOf('=', nameIndex) + 1;
    const endIndex = cookie.indexOf(';', startIndex);
    return decodeURIComponent(cookie.substring(startIndex, endIndex));
  }

  /**
   * @description 设置Cookie
   * @param {string} name
   * @param {string} value
   * @param {string|number} maxAge s20代表20秒 m30代表30分鐘 h12代表12小時 d30代表30天
   */
  setCookie(name, value, maxAge) {
    const _maxAge = this.isString(maxAge) ? this.getMSecond(maxAge) : maxAge;
    const expires = new Date();
    expires.setTime(expires.getTime() + _maxAge);
    document.cookie = `${name}=${encodeURIComponent(value)};espires=${expires.toUTCString()}`;
  }

  /**
   * @description 删除Cookie
   * @param {string} name
   */
  delCookie(name) {
    const existed = this.getCookie(name);
    existed && this.setCookie(name, '', -1);
    return existed;
  }

  /**
   * @description 获取服务器的日期
   * @returns {Date}
   */
  getServerDate() {
    let date = '';
    $.ajax({
      url : '/',
      type : 'OPTIONS',
      async : false,
      complete(res) {
        date = res.getResponseHeader("Date");
      }
    });
    return new Date(date);
  }

  /**
   * @description 获取服务器的时间
   * @returns {number}
   */
  getServerTime() {
    return this.getServerDate().getTime();
  }

  /**
   * @description 清除符号和JSONP的回调函数
   * @param {string} args
   */
  clearSymbol(args) {
    return args.replace(/(\?|&|easybuyCallback=)/gim, '');
  }

  /**
   * @description 生成页面链接加密字符串
   * @param {string} args
   */
  generateEncryption(args) {
    const _string = this.clearSymbol(args).toLowerCase().split('');
    const word = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    return _string.reduce((prev, cur, index) => {
      const _s = /\d/.test(cur) ? word[cur] : cur;
      return prev + index + _s.charCodeAt(0);
    }, '');
  }

  /**
   * @description 获取加密参数字符串
   * @param {string} args
   */
  getEncryptParams(args) {
    const term = this.getServerTime();
    const encryption = this.generateEncryption(args);
    return `_encryption=${encryption}&_term=${term}`;
  }

  /**
   *
   * @param {string} API
   * @param {object} parameters
   * @param {boolean} encrypt
   */
  static getRequestURL(API, parameters, encrypt = false) {
    const invaild1 = this.isString(API);
    const invaild2 = this.isBoolean(parameters) || this.isString(parameters);
    const invaild3 = this.isBoolean(encrypt);
    if (invaild1 || invaild2 || invaild3) return null;
    let _params = this.isBoolean(parameters) ? null : parameters;

  }

  /**
   * @description 将特定格式转换为毫秒
   * @param {string} args
   * @returns {number}
   */
  getMSecond(args) {
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

  /**
   * @description 判断是否为 string
   * @param {*} args
   */
  isString(args) {
    return typeof args === 'string';
  }

  isObject(args) {
    return
  }

  /**
   * @description 判断类型是否为 boolean
   * @param {*} args
   * @returns {boolean}
   */
  isBoolean(args) {
    return typeof args === 'boolean';
  }

  /**
   * @description 判断对象是不是空对象
   * @param args
   * @returns {*}
   */
  objectIsEmpty(args) {
    return Object.keys(args).length === 0;
  }

  /**
   * @description 从 Sessionstorage 里恢复数据
   * @param {string} name
   * @returns {string | null}
   */
  recoverData(name) {
    const backup = sessionStorage.getItem(name);
    backup !== null && sessionStorage.removeItem(name);
    return backup;
  }

  /**
   * @description 备份数据到 Sessionstorage
   * @param {string} key
   * @param {string|object} value
   * @returns {string | null}
   */
  backupData(key, value) {
    const _value = typeof value === 'object' ? JSON.stringify(value) : value;
    sessionStorage.setItem(key, _value);
    return sessionStorage.getItem(key);
  }

  loadCSS(url) {
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
  stringToObject(string, separator = '&') {
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
  objectToString(object, separator = '&') {
    const keys = Object.keys(object);
    return keys.reduce((string, key) => {
      return `${string + key}=${object[key] + separator}`;
    }, '');
  }
}


/**
 * 加载完这个文件之后
 * 页面的JS文件必须实例化一个Easybuy的对象。
 * 所有的页面操作都在实例化里完成
 * 在页面显示之前会把页面做动画，不糊显示出来
 *
 */

class Easybuy {
  /**
   *
   * @param {object} data - 页面数据
   * @param {object} methods - 方法
   * @param {function} before - 页面完成加载之前
   * @param {function} uiBack - 如果有登录是用户数据回来之后
   * @param {function} after - 页面完成加载之后
   */
  constructor({
    data = {},
    methods = {},
    before = null,
    uiBack = null,
    after = null,
    nav = false,
  }) {
    this.data = data;
    this.methods = methods;
    this.before = before;
    this.uiBack = uiBack;
    this.after = after;
    this.nav = nav;

    /**
     * 这是一段检查当前页面是否需要登录的代码
     */
    const cookie = 'ENYSTRINETI_STRING';
    const keyword = ['userspace'];
    const link = 'http://usermanager.macaoeasybuy.com/login.html';
    this.data.login = document.cookie.indexOf(cookie) !== -1;
    const href = window.location.href;
    const mustLogin = keyword.filter((value) => {
      return href.indexOf(value) !== -1;
    }).length !== 0;
    !this.data.login && mustLogin && (window.location.href = link);

    /**
     * 初始化实例方法
     */
    const thisMethods = {
      /**
       * @description 把字符串转为对象
       * @param {string} string
       * @param {string} separator
       */
      stringToObject(string = '', separator = '&') {
        const result = {};
        const keyValueArray = string.split(separator);
        keyValueArray.forEach((keyValue) => {
          const KV = keyValue.split('=');
          const valueIsNum = !isNaN(+KV[1]);
          result[KV[0]] = valueIsNum ? +decodeURIComponent(KV[1]) : decodeURIComponent(KV[1]);
        });
        return result;
      },

      /**
       * @description 把对象转为字符串
       * @param {object} object
       * @param {string} separator
       */
      objectToString(object = {}, separator = '&') {
        const keys = Object.keys(object);
        const lastIndex = keys.length - 1;
        return keys.reduce((string, key, index) => {
          return `${string + key}=${object[key] + (index !== lastIndex ? separator : '')}`;
        }, '');
      },

      /**
       * @description 清除符号和JSONP的回调函数
       * @param {string} string
       */
      clearSymbol(string) {
        return string.replace(/(\?|&|easybuyCallback=)/gim, '');
      },

      /**
       * @description 生成时间字符串
       */
      generateTerm() {
        return this.getServerDate().getTime();
      },

      /**
       * @description 生成页面链接加密字符串
       * @param {string} string
       */
      generateEncryption(string) {
        const STRING = this.clearSymbol(string).toLowerCase();
        const word = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        return STRING.split('').map((value, index) => {
          const temp = !isNaN(+value) ? word[value] : value;
          return index + temp.charCodeAt(0);
        }).join('');
      },

      /**
       * @description 获取加密参数字符串
       * @param {string} stirng
       */
      getEncryptParams(string) {
        const term = this.generateTerm();
        const encryption = this.generateEncryption(string);
        return `_encryption=${encryption}&_term=${term}`;
      },


      /**
       * @description 加密用
       * @param {string} string
       */
      parameIcy5c(string) {
        const SA = string.toLowerCase().split();
        const symbol = ['∝', '∽', '∈', '∞', '≌', '∉', '∥', '∬', '∭', '∂'];
        const f = ['00000', '0000', '000', '00', '0'];
        let count = 1;
        return SA.reduce((pre, cur) => {
          const word = isNaN(cur) ? cur : symbol[cur];
          count === 10000 && (count = 1);
          const cc = `${word.charCodeAt(0)}${count}`;
          count += 1;
          return `${pre}${f[cc.length - 1]}${cc}`;
        }, '');
      },

      /**
       * @description 获取服务器时间
       */
      getServerDate() {
        let date = null;
        this.ajax({
          url: '/',
          method: 'OPTIONS',
          async: false,
          jsonp: false,
          after({ xhr }) {
            date = xhr.getResponseHeader('date');
          },
        });
        return new Date(date);
      },


      /**
       * @description 获取请求链接
       * @param {string} api
       * @param {object} params
       * @param {boolean} encrypt
       * @returns {string} x.x.x/x/x?x=x
       */
      getRequestURL(api, params, encrypt) {
        const PARAMSTRING = this.objectToString(params);
        const URL = `${api}?${PARAMSTRING}`;
        const result = encrypt ? URL + (PARAMSTRING ? '&' : '') + this.getEncryptParams(URL) : URL;
        return result;
      },

      ajax({
        api,
        params = {},
        encrypt = false,
        method = 'GET',
        jsonp = true,
        async = true,
        before = null,
        after = null,
      }) {
        const url = this.getRequestURL(api, params, encrypt) + (jsonp ? '&easybuyCallback=?' : '');
        const dataType = jsonp ? 'JSONP' : 'JSON';
        $.ajax({
          url,
          method,
          dataType,
          async,
          beforeSend(xhr) {
            before && before(xhr);
          },
          complete(xhr) {
            after && after({ xhr, data: xhr.responseJSON });
          },
        });
      },
    };
    Object.keys(thisMethods).forEach((name) => {
      this[name] = (...arg) => {
        return arg ? (arg.length > 1 ? thisMethods[name].apply(this, arg)
          : thisMethods[name].call(this, arg[0]))
          : thisMethods[name].call(this);
      };
    });
    Object.keys(this.methods).forEach((name) => {
      this[name] = (...arg) => {
        return arg ? (arg.length > 1 ? this.methods[name].apply(this, arg)
          : this.methods[name].call(this, arg[0]))
          : this.methods[name].call(this);
      }
    });

    /**
     * 初始化实例数据
     */
    this.data.oss = '//mbuy.oss-cn-hongkong.aliyuncs.com';

    /**
     * 检查完后会执行一个钩子
     */
    this.before && this.before();

    /**
     * 把链接的参数存起来
     */
    const search = window.location.search.substring(1);
    this.data.search = search === '' ? null : this.stringToObject(search);

    /**
     * 插入 header
     * 如果有导航栏的话，会生成导航
     */
    let navShoppingHTMLString = '';
    let navSocialHTMLString = '';
    if (this.data.nav) {
      const shoppingPage = [
        { name: '首頁', href: '#'},
        { name: '限量搶購', href: '#' },
        { name: '發現新品', href: '#' },
        { name: '今日降價', href: '#' },
        { name: '本週熱賣', href: '#' },
        { name: '敗家誌', href: '#' },
        { name: '尋寶市集', href: '#' },
        { name: '量販團', href: '#' },
        { name: '宜品館', href: '#' },
        { name: '著數換領', href: '#' },
        { name: '激平二手', href: '#' },
      ];
      const socialPage = [
        { name: '全球筍貨', href: '#' },
        { name: '福利社', href: '#' },
        { name: '宜買話題', href: '#' },
        { name: '生活圈', href: '#' },
        { name: '宜粉日誌', href: '#' },
        { name: '宜粉專輯', href: '#' },
      ];
      const shoppingLi = shoppingPage.reduce((HTMLString, page) => {
        return HTMLString + `<li><a href="${page.href}">${page.name}</a></li>`;
      }, '');
      const socialLi = socialPage.reduce((HTMLString, page) => {
        return HTMLString + `<li><a href="${page.href}">${page.name}</a></li>`;
      });
      navShoppingHTMLString = `
        <div class="hidden">
          <ul class="e-container">
            ${shoppingLi}
          </ul>
        </div>
      `;
      navSocialHTMLString = `
        <div class="hidden">
          <ul class="e-container">
            ${socialLi}
          </ul>
        </div>
      `;
    }
    const qrcode = [
      { img: '/img/common/header&search&footer/QR code.png', tips: '微信訂閱號' },
      { img: '/img/common/header&search&footer/QR code.png', tips: '微信服務號' },
      { img: '/img/common/header&search&footer/QR code.png', tips: '客戶端下載' },
    ];
    const qrCodeHTMLString = qrcode.reduce((HTMLString, item) => {
      return HTMLString + `<li><img src="${item.img}">${item.tips}</li>`;
    });
    const headerHTMLString = `
      <div class="e-container">
        <div class="nav">
          <div class="shopping">
            <span>宜買首頁</span>
            ${navShoppingHTMLString}
          </div>
          <div class="social">
            <span>宜生活</span>
            ${navSocialHTMLString}
          </div>
        </div>
        <div class="right">
          ${
            this.data.login ?
            `<div class="user">
              <span></span>
              <ul>
                <li><img src="" class="e-avatar"></li>
                <li>個人空間</li>
                <li>成長詳情</li>
                <li>退出賬號</li>
              </ul>
            </div>
            <a href="#" data-count="">心動</a>`
            : ''
          }
          ${
            this.data.login ? ''
            : `<a href="${link}">登入</a><a :href="${link}">註冊</a>`
          }
          <a href="#" data-count="">購物籃</a>
          ${
            this.data.login ?
            `<a href="#" data-count="">紅包</a>
            <a href="#" data-count="">積分</a>
            <a href="#">足跡</a>`
            : ''
          }
          <a href="#">申請開店</a>
          <div class="appdl">
            <span>APP下載</span>
            <ul class="hidden">
              ${qrCodeHTMLString}
            </ul>
          </div>
        </div>
      </div>
    `;
    const header = document.querySelector('#page-header');
    header.innerHTML = headerHTMLString;
    let headerElements = {};
    if (this.data.login) {
      const easybuy = this;
      headerElements = {
        userName: header.querySelector('.user > span'),
        avatar: header.querySelector('.e-avatar'),
        xindong: header.querySelector('.right a:nth-of-type(1)'),
        gouwulan: header.querySelector('.right a:nth-of-type(2)'),
        hongbao: header.querySelector('.right a:nth-of-type(3)'),
        jifen: header.querySelector('.right a:nth-of-type(4)'),
        insert() {
          const info = easybuy.data.userInfo;
          this.userName.innerHTML = `Hi, ${info.name}`;
          this.avatar.src = easybuy.data.oss + info.pic;
          this.xindong.setAttribute('data-count', info.loveNum);
          this.gouwulan.setAttribute('data-count', info.shopCarNum);
          this.hongbao.setAttribute('data-count', info.mop);
          this.jifen.setAttribute('data-count', info.integral);
        },
      }
    }

    /**
     * 插入 footer
     */
    $('#page-footer').load('/common/footer.html');

    /**
     * 为了避免重复向服务端请求当前登录的用户的信息
     * 在页面跳转之前会把信息放在sessionStorage里
     * 当新页面执行到这一步的时候，会从sessionStorage里读取信息并删除存起来的信息
     *
     * 如果本地存在cookie，就会判断sessionStorage里是否存在数据,
     * 没有的话再向服务端请求数据
     */
    if (this.data.login) {
      const loginUserInfo = sessionStorage.getItem('loginUserInfo');
      if (loginUserInfo !== 'undefined') {
        this.data.userInfo = JSON.parse(loginUserInfo);
        sessionStorage.removeItem('loginUserInfo');
        headerElements.insert();
      } else {
        this.ajax({
          api: 'http://userManager.macaoeasybuy.com/UserInfoManagerGetController/LoginTopInfo.easy',
          encrypt: true,
          after: ({ data }) => {
            data === '' && (window.location.href = link);
            this.data.userInfo = data['userInfo'];
            headerElements.insert();
            this.uiBack && this.uiBack();
          }
        })
      }
    }

    this.after && this.after();

    /**
     * 绑定页面销毁事件
     * 把信息存到sessionStorage
     */
    window.addEventListener('unload', () => {
      sessionStorage.setItem('loginUserInfo', JSON.stringify(this.data.userInfo));
    });
  }
}

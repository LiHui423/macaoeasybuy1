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
      /**
       *
       * @param {string} api 请求的接口
       * @param {object} params 请求的参数
       * @param {string} [method] 请求类型
       * @param {string} templateString 模板字符串
       * @param {HTMLElement|string|jQuery} container 渲染的容器
       * @param {object} [waterfall] 瀑布流
       * @param {object} [scrolloading] 滚动加载
       * @param {function} [before] 模板插入之前
       * @param {function} [after] 模板插入之后
       */
      templateRender({
        api,
        params,
        method = 'GET',
        templateString,
        container,
        waterfall = null,
        scrolloading = null,
        before = null,
        after = null
      }) {
        const page = params.page !== undefined ? params.page : null;
        const size = params.size !== undefined ? params.size : null;
        this.ajax({
          api,
          params,
          method,
          before: () => {
            if (params.page === -1) {
              return;
            }
            scrolloading && this.scrolloading(false, scrolloading);
          },
          after: ({ data }) => {
            const content = data.result;
            const dataPackage = { page, content };

            before && before(dataPackage, data);

            if (template === undefined) {
              return;
            }

            const $container = container instanceof jQuery ? container : $(container);
            const tr = template.render(templateString, dataPackage);
            (page === 0 || page === null) ? $container.html(tr) : $container.append(tr);

            waterfall && this.waterfall($container, waterfall);
            if (content.length === size) {
              setTimeout(() => {
                this.scrolloading(true, scrolloading);
              }, 2000);
            }
            params.page = content.length === size ? (params.page + 1) : -1;
            after && after();
          }
        })
      },
      /**
       * @author Lzq
       * @description 瀑布流
       * @since 2018.2.22
       * @param {HTMLElement|string|jQuery} container 作用瀑布流的容器
       * @param {number} [column] 列数
       * @param {number} [hGap] 水平间距
       * @param {number} [vGap] 垂直间距
       */
      waterfall(container, {column = 2, hGap = 0, vGap = 20}) {
        const $container = container instanceof jQuery ? container : $(container);
        const $items = $container.children();
        const containerWidth = $container.width();
        const columnWidth = containerWidth / column;
          // 修改定位
        const containerPosition = $container.css('position');
        const itemPosition = $items.eq(0).css('position');
        containerPosition !== 'relative' && containerPosition.css('position', 'relative');
        let columnHeightArray = [];
        for (let x = 0; x < column; x++) {
          columnHeightArray[x] = 0;
        }
        $container.imagesLoaded().always(() => {
          $items.each((index, item) => {
            const $item = $(item);
            const top = Math.min(...columnHeightArray);
            const columnIn = columnHeightArray.indexOf(top);
            $item.css({
              'left': (columnWidth * columnIn === 0) ? '0' : (columnWidth * columnIn + 'px'),
              'top': top === 0 ? '0' : top + 'px',
              'visibility': 'visible',
              'position': 'absolute'
            });
            columnHeightArray[columnIn] = top + $item.height() + vGap;
          });
          const containerHeight = Math.max(...columnHeightArray);
          $container.css('height', containerHeight + 'px');
        });
      },

      /**
       *
       * @param {boolean} open 状态
       * @param {HTMLElement|string|jQuery} viewport 可视窗口
       * @param {HTMLElement|string|jQuery} [context] 文档
       * @param {string} [namespace] 事件的命名空间
       * @param {function} [callbackfn] 回调函数
       */
      scrolloading(open, {viewport = window, context = document, namespace = 'loading', callbackfn = null}) {
        const $viewport = viewport instanceof jQuery ? viewport : $(viewport);
        const event = `scroll.${namespace}`;
        if (open === false) {
          $viewport.off(event);
        } else {
          const $context = context instanceof jQuery ? context : $(context);
          const vh = $viewport.height();
          $viewport.on(event, () => {
            const a = $viewport.scrollTop();
            const b = $context.height();
            if (a + vh >= b * 0.8) {
              callbackfn && callbackfn();
            }
          });
        }
      }
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
    this.data.search = search === '' ? {} : this.stringToObject(search);

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
        <div>
          <ul class="e-container">
            ${shoppingLi}
          </ul>
        </div>
      `;
      navSocialHTMLString = `
        <div>
          <ul class="e-container">
            ${socialLi}
          </ul>
        </div>
      `;
    }
    const qrcode = [
      { img: '/src/img/common/header&search&footer/QR code.png', tips: '微信訂閱號' },
      { img: '/src/img/common/header&search&footer/QR code.png', tips: '微信服務號' },
      { img: '/src/img/common/header&search&footer/QR code.png', tips: '客戶端下載' },
    ];
    const qrCodeHTMLString = qrcode.reduce((HTMLString, item) => {
      return HTMLString + `<li><img src="${item.img}">${item.tips}</li>`;
    }, '');
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
            <ul>
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
      if (loginUserInfo === 'undefined' || loginUserInfo === null) {
        this.ajax({
          api: 'http://userManager.macaoeasybuy.com/UserInfoManagerGetController/LoginTopInfo.easy',
          encrypt: true,
          after: ({ data }) => {
            data === '' && (window.location.href = link);
            this.data.userInfo = data['userInfo'];
            headerElements.insert();
          }
        })
      } else {
        this.data.userInfo = JSON.parse(loginUserInfo);
        sessionStorage.removeItem('loginUserInfo');
        headerElements.insert();
      }
    }

    const easybuy = this;
    this.Template = class {
      constructor({
        api,
        params = {},
        encrypt = false,
        method = 'GET',
        data = {},
        container,
        template,
        beforeReq = null,
        afterRes = null,
        beforeInsert = null,
        afterInsert = null,
      }) {
        this.request = {
          api,
          params,
          encrypt,
          method,
        };
        this.data = data;
        this.container = container;
        this.template = template;
        this.beforeReq = beforeReq;
        this.afterRes = afterRes;
        this.beforeInsert = beforeInsert;
        this.afterInsert = afterInsert;
      }
      run() {
        const container = this.container;
        const api = this.request.api;
        const params = this.request.params;
        easybuy.ajax({
          api,
          parmas,
          method,
          before() {
            this.beforeReq && this.beforeReq();
          },
          after({ data }) {
            const result = data['result'] || data['list'];
            const dataPackage = { page };
            if (Array.isArray(result)) {
              dataPackage.content = result;
            } else {
              Object.keys(result).forEach((value) => {
                (value === 'labellist' || value === 'pets')
                ? (dataPackage.content = result['labellist'] || result['pets'])
                : dataPackage[value] = result[value];
              })
            }
            dataPackage.content === undefined && (dataPackage.content = []);
            this.afterRes && this.afterRes(dataPackage);
            this.beforeInsert && this.beforeInsert(dataPackage);

            const containerChange = container === this.container;
            const noData = dataPackage.content.length > 0 || Object.key(dataPackage).length > 1;
            if (containerChange && noData) {
              return;
            }
            Template.insert(container, easybuy.data.template[this.template], dataPackage);
            this.afterInsert && this.afterInsert();
          }
        })
      }
      static insert(container, templateString, dataPackage) {
        const isPaging = dataPackage.page !== undefined;
        const isFirst = dataPackage.page === 0;

        if (template === undefined) {
          return;
        }

        const $container = $(container);
        (isFirst || !isPaging)
        ? $container.html(template.render(templateString, dataPackage))
        : $container.append(template.render(templateString, dataPackage));
      }
      static execute(tos) {
        Array.isArray(tos) ? apitos.forEach(to => to.run()) : to.run();
      }
    };

    /**
     * 绑定页面销毁事件
     * 把信息存到sessionStorage
     */
    window.addEventListener('unload', () => {
      sessionStorage.setItem('loginUserInfo', JSON.stringify(this.data.userInfo));
      sessionStorage.setItem('pageUser', JSON.stringify(this.data.spaceInfo));
    });


    /**
     * 把页面上的模板字符串隐藏起来
     */
    this.data.template = {};
    window.addEventListener('load', () => {
      document.querySelectorAll('script[data-art-template]').forEach(t => {
        const ID = t.getAttribute('data-art-template');
        const content = t.innerHTML;
        this.data.template[ID] = content;
        t.parentElement.removeChild(t);
      })
      if (this.data.login) {
        const uiBackClock = setInterval(() => {
          if (this.data.userInfo.id) {
            clearInterval(uiBackClock);
            this.uiBack && this.uiBack();
          }
        }, 25);
      }
      // ========== 一个钩子
      this.after && this.after();
    });

  }
}

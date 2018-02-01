(function () {

    const env = 'dev';

    const __cookie = () => 'ENYSTRINETI_STRING';
    const __keyword = () => ['userspace'];
    const __data = {
        userInfo: {},
        pageInfo: {},
        ownerInfo: {},
        isSelf: undefined,
        isLogin: undefined,
        oss: env === 'prod' ? 'http://mbuy.oss-cn-hongkong.aliyuncs.com' : 'https:',
    };
    const __link = {
        login: 'http://usermanager.macaoeasybuy.com/login.html',
    };

    // 立即执行权限判断
    (function () {
        const href = window.location.href;
        const mustLogin = __keyword().filter(value => {
            return href.indexOf(value) !== -1;
        }).length !== 0;
        __data.isLogin = document.cookie.indexOf(__cookie()) !== -1;

        // 需要登录并且没有登录, 跳转到登录页
        mustLogin && !__data.isLogin && (window.location.href = __link.login);

    }());

    const __api = (name) => {
        const _api = {
            userInfo: 'http://userManager.macaoeasybuy.com/UserInfoManagerGetController/LoginTopInfo.easy'
        };
        return _api[name];
    };


    const __process = {
        /**
         * @author Junhang
         * @description 将对象转换成特定字符串
         * @since 2018.1.26
         * @param {Object} obj
         * @param {string} separator
         * @returns {string}
         */
        getObjectToString(obj, separator) {
            const keys = Object.keys(obj);
            const lastIndex = keys.length - 1;
            return keys.reduce(function callback(string, key, index) {
                return string + key + '=' + obj[key] + (index !== lastIndex ? separator : '');
            }, '');
        },

        /**
         * @author Junhang
         * @description 将特定字符串解码后转换成对象
         * @since 2018.1.26
         * @param {string} str
         * @param {string} separator
         * @returns {Object}
         */
        getStringToObject(str, separator) {
            const result = {};
            const key$valueArray = str.split(separator);
            key$valueArray.forEach(function (value) {
                const key$value = value.split('=');
                const valueIsNum = !isNaN(+key$value[1]);
                result[key$value[0]] = valueIsNum ? +decodeURIComponent(key$value[1]) : decodeURIComponent(key$value[1]);
            });
            return result;
        },

        /**
         * @author dy
         * @description 加密字符串
         * @since 2018.1.26
         * @param {string} str
         * @returns {string}
         */
        parameIcy5c(str) {
            const _string = str.toLowerCase();
            let _in = "";
            let su = 1;
            const word = ['∝', '∽', '∈', '∞', '≌', '∉', '∥', '∬', '∭', '∂'];
            const f = ['00000', '0000', '000', '00', '0'];
            for (let i = 0, w; (w = _string[i++]);) {
                w = isNaN(w) ? w : word[w];
                su === 10000 && (su = 1);
                let os = w.charCodeAt(0) + su + "";
                su++;
                _in = _in + f[os.length - 1] + os;
            }
            return _in;
        },

        /**
         * @author dy
         * @description 获取服务器当前时间
         * @since 2018.1.26
         * @requires jQuery/ajax
         * @returns {string}
         */
        getServerDateTime() {
            let result = '';
            $.ajax({
                type: "OPTIONS",
                async: false,
                url: "/",
                complete(response) {
                    result = new Date(response.getResponseHeader("Date"));
                },
            });
            return result;
        },

        /**
         * @author dy
         * @description 去除所有符号
         * @since 2018.1.26
         * @param {string} str
         * @returns {string}
         */
        replaceAtre(str) {
            return str.replace(/(\?|&|easybuyCallback=)/gim, '');
        },

        /**
         * @author dy
         * @description 加密
         * @since 2018.1.26
         * @param {string} str
         * @returns {string}
         */
        getEncryption(str) {
            const _string = this.replaceAtre(str).toLowerCase();
            const word = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
            return _string.split('').map((v, i) => {
                const _value = !isNaN(+v) ? word[v] : v;
                return i + _value.charCodeAt(0);
            }).join('');
        },

        /**
         * @author dy
         * @description 加密时间
         * @since 2018.1.26
         * @returns {number}
         */
        getTerm() {
            return this.getServerDateTime().getTime();
        },

        /**
         * @author Junhang
         * @description 生成加密链接
         * @since 2018.1.26
         * @param {Object} opts
         * @param {string} opts.api
         * @param {Object} [opts.params]
         * @return {string}
         */
        getEncryptURL(opts) {
            let _params = {};
            const eString = __methods.getRequestURL({
                api: opts.api,
                params: opts.params,
                callback: false
            });
            if (opts.params !== undefined && typeof opts.params === 'object') {
                _params = opts.params;
            }
            _params['_encryption'] = this.getEncryption(eString);
            _params['_term'] = this.getTerm();
            return __methods.getRequestURL({api: opts.api, params: _params});
        },

        /**
         * @author Junhang
         * @description 插入头部
         * @since 2018.1.26
         * @param isLogin
         * @TODO 未完成
         */
        insertHeader(isLogin) {
        },

        /**
         * @author Junhang
         * @description 插入底部
         * @since 2018.1.26
         * @TODO 待优化
         */
        insertFooter() {
            $('#page-footer').load('/common/footer.html');
        },
    };

    const __methods = {
        /**
         *
         * @param opts
         * @param {string} opts.api
         * @param {Object} [opts.params]
         * @param {boolean} [opts.callback=true]
         * @param {string} [opts.callbackName]
         * @return {string}
         */
        getRequestURL(opts) {
            const api = opts.api;
            const params = opts.params ? __process.getObjectToString(opts.params, '&') + '&' : '';
            const callback = opts.callback !== undefined ? opts.callback : true;
            const callbackName = opts.callbackName || 'easybuyCallback=?';
            if (params === '' && callback === false) {
                return api;
            }
            return `${api}?${params}${callback && callbackName}`;
        },

        timeoutEvent(ms, time, fn) {
            let _time = time;
            const _clock = setInterval(() => {
                // 如果次数为0，清除定时器
                _time === 0 && clearInterval(_clock);
                let clear = false;
                // fn必须返回一个布尔值用于判断是否中止定时器
                fn && (clear = fn());
                clear && clearInterval(_clock);
                _time !== 0 && _time--;
            }, ms);
        },

        data(name, value) {
            value !== undefined && (__data[name] = value);
            return __data[name];
        },

        formatNum(num) {
            const str = num + '';//转换成字符串
            const str_num = str.split('.')[0];
            const str_last = str.split('.')[1] === undefined ? '' : '.' + str.split('.')[1];
            let ret_num = '';
            let counter = 0;
            for (let i = str_num.length - 1; i >= 0; i--) {
                ret_num = str_num.charAt(i) + ret_num;
                counter++;
                if (counter === 3) {
                    counter = 0;
                    if (i !== 0) {
                        ret_num = ',' + ret_num;
                    }
                }
            }
            return ret_num + str_last;
        },

        /**
         * @author Junhang
         * @description 等待用户信息回来的操作
         * @since 2018.1.26
         * @param {userInfoCallback} fn
         */
        back(fn) {
            const clock = setInterval(() => {
                const ID = __data.userInfo.id !== undefined;
                ID && clearInterval(clock);
                /**
                 * @callback userInfoCallback
                 */
                ID && fn && fn();
            }, 50);
        },

        maskClick(el, fn, str) {
            const SRT = str || 'maskClick';
            const $el = typeof el === 'string' ? $(el) : el;
            $(document).off('mouseup.' + SRT);
            $(document).on('mouseup.' + SRT, function (event) {
                const $t = $(event.target);
                $t !== $el && $el.has($t).length === 0 && fn && fn();
            });
        },

        /**
         *
         * @param opts
         * @param {boolean} opts.openState - 状态
         * @param {HTMLElement|jQuery|string} [opts.viewport] - 可视窗口
         * @param {HTMLElement|jQuery|string} [opts.context] - 文档
         * @param {string} [opts.eventNamespace] - 事件的命名空间
         * @param {function} [callbackfn] - 回调函数
         */
        scrolloading(opts, callbackfn) {
            const $viewport = opts.viewport ? (opts.viewport instanceof jQuery ? opts.viewport : $(opts.viewport)) : $(window);
            const $context = opts.context ? (opts.context instanceof jQuery ? opts.context : $(opts.context)) : $(document);
            const openState = opts.openState;
            const event = `scroll.${opts.eventNamespace || 'loading'}`;
            if (openState) {
                const vh = $viewport.height();
                $viewport.on(event, () => {
                    const a = $(this).scrollTop();
                    const b = $context.height();
                    if (a + vh >= b * 0.7) {
                        callbackfn && callbackfn();
                    }
                })
            } else {
                $viewport.off(event);
            }
        },
    };

    /**
     * @class Template
     * @classdesc
     */
    const __template = class Template {
        /**
         * @constructs
         * @param {Object} opts - 参数集合
         * @param {string} opts.api - 后台接口
         * @param {Object} [opts.params] - 接口参数
         * @param {string} [opts.method=GET] - 请求方法
         * @param {HTMLElement|string|jQuery} opts.container - 容器
         * @param {string} opts.templateID - 模板ID
         * @param {Object} [opts.data] - 数据
         * @param {Object} [opts.scrolloading] - 滚动加载
         * @param {boolean} opts.scrolloading.openState - 滚动加载的打开状态
         * @param {string} [opts.scrolloading.eventNamespace - 滚动加载事件的命名空间
         * @param {HTMLElement|string|jQuery} [opts.scrolloading.viewport] - 可视窗口
         * @param {HTMLElement|string|jQuery} [opts.scrolloading.context] - 文档
         * @param {function} [opts.beforeGetRes] - 获取请求数据之前
         * @param {function} [opts.afterGetRes] - 获取请求数据之后
         * @param {function} [opts.beforeInsert] - 插入模板之前
         * @param {function} [opts.afterInsert] - 插入模板之后
         */
        constructor(opts) {
            this.requestOptions = {
                api: opts.api || '',
                params: opts.params || {},
                method: opts.method || 'GET',
            };

            opts.container !== undefined && (this.container = opts.container instanceof jQuery ? opts.container : $(opts.container));
            opts.templateID !== undefined && (this.templateID = opts.templateID);
            this.data = opts.data || {};

            // 滚动加载
            if (opts.scrolloading !== undefined) {
                this.scrolloadingOptions = {
                    openState: opts.scrolloading.openState,
                };
                opts.scrolloading.eventNamespace !== undefined && (this.scrolloadingOptions.eventNamespace = opts.scrolloading.eventNamespace);
                opts.scrolloading.window !== undefined && (this.scrolloadingOptions.window = opts.scrolloading.window);
                opts.scrolloading.context !== undefined && (this.scrolloadingOptions.context = opts.scrolloading.context);
            }
            // 钩子

            // 获取数据前

            (opts.beforeGetRes !== undefined && typeof opts.beforeGetRes === 'function') && (this.beforeGetRes = opts.beforeGetRes);

            // 获取数据后
            (opts.afterGetRes !== undefined && typeof opts.afterGetRes === 'function') && (this.afterGetRes = opts.afterGetRes);

            // 插入模板前
            (opts.beforeInsert !== undefined && typeof opts.beforeInsert === 'function') && (this.beforeInsert = opts.beforeInsert);

            // 插入模板后
            (opts.afterInsert !== undefined && typeof opts.afterInsert === 'function') && (this.afterInsert = opts.afterInsert);

        }


        /**
         * @static
         * @param {jQuery} container
         * @param {string} templateString
         * @param {Object} dataPackage
         * @requires jQuery
         */
        static insert(container, templateString, dataPackage) {
            const isPaging = dataPackage.page !== undefined;
            const isFirst = dataPackage.page === 0;

            if (template === undefined) {
                return false;
            }

            (isFirst || !isPaging) ? container.html(template.render(templateString, dataPackage)) : container.append(template.render(templateString, dataPackage));
        }

        static hide() {
            __process.initTemplate();
        }

        /**
         * @static
         * @param {Template|Template[]} tos
         * @param {Object} templateArr
         */
        static execute(tos, templateArr) {

            function exe(to, templateArr) {
                const $container = to.container;
                const page = to.requestOptions.params.page !== undefined ? to.requestOptions.params.page : null;
                const size = to.requestOptions.params.size !== undefined ? to.requestOptions.params.size : null;
                const templateString = templateArr[to.templateID];
                const api = to.requestOptions.api;
                const params = to.requestOptions.params;
                const method = to.requestOptions.method;
                const url = __methods.getRequestURL({api, params});
                $.ajax({
                    url,
                    method,
                    dataType: 'JSONP',
                    context: to,
                    beforeSend() {
                        this.beforeGetRes && this.beforeGetRes();
                        this.scrolloadingOptions !== undefined && __methods.scrolloading({openState: false});
                    },
                    success(responseJSON) {
                        const result = responseJSON['result'] || responseJSON['list'];
                        const dataPackage = {
                            page,
                        };
                        if (Array.isArray(result)) {
                            dataPackage.content = result;
                        } else {
                            const keys = Object.keys(result);
                            keys.forEach(v => {
                                (v === 'labellist' || v === 'pets')
                                    ? (dataPackage.content = result['labellist'] || result['pets'])
                                    : dataPackage[v] = result[v];
                            });
                        }
                        dataPackage.content === undefined && (dataPackage.content = []);

                        // 钩子
                        this.afterGetRes && this.afterGetRes(dataPackage);

                        // 钩子
                        this.beforeInsert && this.beforeInsert(dataPackage);

                        // 插入模板
                        if ($container === this.container && (dataPackage.content.length > 0 || Object.keys(dataPackage).length > 1)) {
                            Template.insert($container, templateString, dataPackage);
                        } else {
                            return false;
                        }

                        // TODO: 滚动加载
                        if (dataPackage.content.length === size && this.scrolloadingOptions !== undefined) {
                            this.requestOptions.params.page++;
                            __methods.scrolloading(to.scrolloadingOptions, () => Template.execute(to));
                        }
                        // 钩子
                        this.afterInsert && this.afterInsert(dataPackage);
                    },
                });
            }

            Array.isArray(tos) ? tos.forEach(v => exe(v, templateArr)) : exe(tos, templateArr);
        }
    };

    // 设置页面信息，即链接参数
    __data.pageInfo = __process.getStringToObject(window.location.search.substring(1), '&');
    // 如果有登录
    if (__data.isLogin === true) {
        const url = __process.getEncryptURL({api: __api('userInfo')});
        $.ajax({
            url,
            method: 'GET',
            dataType: 'JSONP',
            success(responseJSON) {
                responseJSON === '' && (window.location.href = __link.login);
                __data.userInfo = responseJSON.userInfo;
            }
        });
    } else {
        // TODO: 插入未登录的头部
    }

    window.onload = () => {
        __process.insertFooter();
        window.onload = null;
    };

    window.Effect = class Effect {

        constructor(opts) {
            this.Template = __template;
            this.data = (opts && opts['data']) || {};
            this.data['template'] = {};
        }

        /**
         * @author Junhang
         * @description 把页面的模板字符串隐藏
         * @since 2018.1.26
         * @param {window} [obj] - window
         */
        initTemplate(obj) {
            const WINDOW = obj || window;
            WINDOW['document'].querySelectorAll('script[data-art-template]').forEach(v => {
                // TODO： 删除标签间的空格和换行
                this.data.template[v.getAttribute('data-art-template')] = v.innerHTML;
                v.parentElement.removeChild(v);
            });
        }

        static data(name, value) {
            return __methods.data(name, value);
        }

        static getRequestURL(opts) {
            return __methods.getRequestURL(opts);
        }

        static timeoutEvent(ms, time, fn) {
            __methods.timeoutEvent(ms, time, fn);
        }

        static back(fn) {
            __methods.back(fn);
        }

        static formatNum(num) {
            return __methods.formatNum(num);
        }

        static maskClick(el, fn, str) {
            __methods.maskClick(el, fn, str);
        }

        /**
         * @author Lzq
         * @description 瀑布流
         * @since 2018.1.27
         * @param {Object} opts
         * @param {HTMLElement|string|jQuery} opts.container
         * @param {HTMLElement|string|jQuery} [opts.item]
         * @param {number} [opts.column]
         * @param {string|number} [opts.hGap]
         * @param {number} [opts.vGap]
         * @param {window} [obj] - window:iframe
         */
        static waterfall(opts, obj) {
            const $ = (obj && obj.$) || $;
            const $container = opts.container instanceof jQuery ? opts.container : $(opts.container);
            const $item = opts.item ? (opts.item instanceof jQuery ? opts.item : $(opts.item)) : $container.children();
            const column = opts.column || 2;
            const hGap = opts.hGap || 'auto';
            const vGap = opts.vGap || 20;
            const containerWidth = $container.width();
            const columnWidth = containerWidth / column;
            $container.css('position') !== 'relative' && $container.css('position', 'relative');
            $item.css('position') !== 'absolute' && $item.css('position', 'absolute');
            let heightArr = [];
            for (let i = 0; i < column; i++) {
                heightArr[i] = 0;
            }
            $container.find('.page-main-head-img').imagesLoaded(() => {
                $item.each((idx, ele) => {
                    let minIndex = 0;
                    let minValue = heightArr[minIndex];
                    for (let i = 0; i < heightArr.length; i++) {
                        if (heightArr[i] < minValue) {
                            minIndex = i;
                            minValue = heightArr[i];
                        }
                    }
                    $(ele).css({
                        position: 'absolute',
                        left: columnWidth * minIndex,
                        top: minValue,
                        visibility: 'visible'
                    });
                    let oldHeight = heightArr[minIndex];
                    oldHeight += $(ele).outerHeight(true) + vGap;
                    heightArr[minIndex] = oldHeight;
                });
                $container.css('height', Math.max(...heightArr) + 'px');
                return heightArr;
            });
        }
    };
}());

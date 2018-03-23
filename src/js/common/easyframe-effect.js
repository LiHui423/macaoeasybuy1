class Effect {
    constructor(opts) {
        this.$_data = opts.data || {};

        // 初始化 $_methods
        this.$_methods = opts.methods || {};
        if (opts.methods) {
            Object.keys(opts.methods).forEach(mn => {
                this[mn] = (...a) => {
                    return a ? (a.length > 1 ? this.$_methods[mn].apply(this, a) : this.$_methods[mn].call(this, a[0])) : this.$_methods[mn].call(this);
                }
            })
        }
        // 初始化 $_el, 并且判断
        const _el = document.querySelector(opts.el);
        this.$_window = _el ? window : document.querySelector('iframe').contentWindow;
        this.$_document = this.$_window.document;
        this.$_el = _el ? _el : this.$_document.querySelector(opts.el);

        // 确定使用的 $
        this.$ = this.$_window.$;

        typeof opts.before === 'function' && (this.$_before = opts.before);
        typeof opts.resBack === 'function' && (this.$_resBack = opts.resBack);
        typeof opts.after === 'function' && (this.$_after = opts.after);


        // 上面的数据初始化完成后开始执行
        // =========== 判断本页面是否需要登录 ===========================
        const cookie = 'ENYSTRINETI_STRING';
        const keyword = ['userspace'];
        const link = 'http://usermanager.macaoeasybuy.com/login.html';
        const hasCookie = document.cookie.indexOf(cookie) !== -1;
        const href = window.location.href;
        const mustLogin = keyword.filter(value => {
            return href.indexOf(value) !== -1;
        }).length !== 0;
        !hasCookie && mustLogin && (window.location.href = link);

        // =========== 一个钩子 ========================================
        this.$_before && this.$_before();

        // 把当前的链接参数存起来
        const search = window.location.search.substring(1);
        this.$_data.search = search === '' ? null : Effect.stringToObject(search);

        // =========== 如果本地有cookie就向服务器请求用户数据 ============
        if (hasCookie && this.$_window.frameElement === null) {
            const userInfoAPI = 'http://userManager.macaoeasybuy.com/UserInfoManagerGetController/LoginTopInfo.easy';
            const url = Effect.methods('getEncryptURL')({api: userInfoAPI});
            $.ajax({
                url,
                method: 'GET',
                dataType: 'JSONP',
                success: (res) => {
                    res === '' && (window.location.href = link);
                    this.$_data.userInfo = res['userInfo'];
                    // ============= 一个钩子
                    this.$_resBack && this.$_resBack();
                }
            })
        }

        // 插入底部
        this.$_window.frameElement === null && $('#page-footer').load('/common/footer.html');

        // ============== 隐藏模板字符串 ==============
        this.$_data.template = {};
        this.$_window.onload = () => {
            this.$_window.document.querySelectorAll('script[data-art-template]').forEach(t => {
                const ID = t.getAttribute('data-art-template');
                const content = t.innerHTML;
                this.$_data.template[ID] = content;
                t.parentElement.removeChild(t);
            })
            // ========== 一个钩子
            this.$_after && this.$_after();
            this.$_window.onload = null;
        }
    }
    template(opts) {
        const effect = this;
        class Template {
            constructor(opts) {
                this.$_request = {
                    api: opts.api || '',
                    params: opts.params || {},
                    method: opts.method || 'GET',
                };
                this.$_data = opts.data || {};
                opts.container !== undefined && (this.$_container = typeof opts.container === 'string' ? effect.$_el.querySelector(opts.container): opts.container);
                opts.templateID !== undefined && (this.$_templateID = opts.templateID);

                // 滚动加载
                if (opts.scrolloading !== undefined) {
                    this.$_scrolloading = {
                        viewport: opts.scrolloading.window || effect.$_window,
                        context: opts.scrolloading.context || effect.$_document,
                        eventHandle: opts.scrolloading.eventHandle || 'scrolloading',
                    };
                }

                if (opts.waterfall !== undefined) {
                    this.$_waterfall = {
                        container: opts.waterfall.container || this.$_container,
                        column: opts.waterfall.column || 2,
                        hGap: opts.waterfall.hGap || 'auto',
                        vGap: opts.waterfall.vGap || 20,
                        isFrame: opts.waterfall.isFrame || false,
                    }
                }

                // 钩子
                // 获取数据前
                (opts.beforeRes !== undefined && typeof opts.beforeRes === 'function') && (this.$_beforeRes = opts.beforeRes);
                // 获取数据后
                (opts.afterRes !== undefined && typeof opts.afterRes === 'function') && (this.$_afterRes = opts.afterRes);
                // 插入模板前
                (opts.beforeInsert !== undefined && typeof opts.beforeInsert === 'function') && (this.$_beforeInsert = opts.beforeInsert);
                // 插入模板后
                (opts.afterInsert !== undefined && typeof opts.afterInsert === 'function') && (this.$_afterInsert = opts.afterInsert);
            }
            run() {
                const container = this.$_container;
                const api = this.$_request.api;
                const params = this.$_request.params;
                const method = this.$_request.method;
                const page = params.page !== undefined ? params.page : null;
                const size = params.size !== undefined ? params.size : null;
                $.ajax({
                    url: Effect.methods('getRequestURL')({api, params}),
                    method,
                    dataType: 'JSONP',
                    beforeSend: () => {
                        this.scrolloading !== undefined && effect.scrolloading(false, this.scrolloading);
                        this.$_beforeRes && this.$_beforeRes();
                    },
                    success: (res) => {
                        const result = res['result'] || res['list'];
                        const dataPackage = { page };
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
                        this.$_afterRes && this.$_afterRes(dataPackage);

                        // 钩子
                        this.$_beforeInsert && this.$_beforeInsert(dataPackage);

                        // 插入模板
                        if (container === this.$_container && (dataPackage.content.length > 0 || Object.keys(dataPackage).length > 1)) {
                            Template.insert(container, effect.$_data.template[this.$_templateID], dataPackage);
                        } else {
                            return;
                        }

                        // TODO: 滚动加载
                        if (dataPackage.content.length === size && this.$_scrolloading !== undefined) {
                            params.page++;
                            effect.scrolloading(true, this.$_scrolloading, () => Template.execute(to));
                        }
                        if (this.$_waterfall !== undefined) {
                            page > 0 && (this.$_waterfall.newItem = true);
                            this.$_waterfall.container = this.$_container;
                            this.$_waterfall && effect.waterfall(this.$_waterfall);
                        }
                        // 钩子
                        this.$_afterInsert && this.$_afterInsert(dataPackage);
                    },
                });
            }

            /**
             * @static
             * @param {HTMLElement} container
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

                const $container = effect.$(container);
                (isFirst || !isPaging) ? $container.html(template.render(templateString, dataPackage)) : $container.append(template.render(templateString, dataPackage));
            }

            /**
             * @static
             * @param {Template|Template[]} tos
             * @param {Object} templateArr
             */
            static execute(tos) {
                Array.isArray(tos) ? tos.forEach(v => v.run()) : v.run();
            }
        }

        return opts ? new Template(opts) : Template;
    }
    /**
     * @author Lzq
     * @description 瀑布流
     * @since 2018.1.27
     * @param {Object} opts
     * @param {HTMLElement|string} opts.container
     * @param {HTMLElement|string} [opts.item]
     * @param {number} [opts.column]
     * @param {string|number} [opts.hGap]
     * @param {number} [opts.vGap]
     * @param {boolean} [opts.isFrame] - 是否是iframe, 默认为false
     * @param {boolean} [opts.newItem]
     */
    waterfall(opts) {
        const container = opts.container instanceof this.$_window.HTMLElement ? opts.container : this.$_document.querySelector(opts.container);
        const item = [].slice.call(container.children);
        const column = opts.column || 2;
        const hGap = opts.hGap || 'auto';
        const vGap = opts.vGap || 20;
        const containerWidth = container.offsetWidth;
        const columnWidth = containerWidth / column;
        const iframe = opts.isFrame || false;
        const newItem = opts.newItem || false;
        // 修改定位
        const containerPosition = this.$_window.getComputedStyle(container, null).getPropertyValue('position');
        const itemPosition = this.$_window.getComputedStyle(item[0], null).getPropertyValue('position');
        containerPosition !== 'relative' && (container.style.position = 'relative');
        let columnHeight = [];
        if (newItem) {
            for (let i = item.length; i >= 0; i--) {
                const h = this.$_window.getComputedStyle(item[i], null).getPropertyValue('top');
                const c = this.$_window.getComputedStyle(item[i], null).getPropertyValue('left') / columnWidth;
                if (h === 0) {
                    break;
                }
                columnHeight[c] === undefined && (columnHeight[c] = h);
                if (columnHeight.length === column) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < column; i++) {
                columnHeight[i] = 0;
            }
        }
        imagesLoaded(container).on('always', () => {
            item.forEach(element => {
                // 获取最小的高度和其所在的列
                let top = Math.min(...columnHeight);
                let column = columnHeight.indexOf(top);
                // 修改样式
                element.style.left = columnWidth * column === 0 ? 0 : columnWidth * column + 'px';
                element.style.top = top === 0 ? 0 : top + 'px';
                element.style.visibility = 'visible';
                element !== 'absolute' && (element.style.position = 'absolute');
                // 更新高度数组
                columnHeight[column] = top + element.scrollHeight + vGap;
            });
            const containerHeight = Math.max(...columnHeight);
            container.style.height = containerHeight + 'px';
            iframe && (document.querySelector('iframe').style.height = document.querySelector('iframe').contentDocument.body.scrollHeight + 'px');
        });

    }

    removeSpaceInfo() {
        this.$_data.isSelf = sessionStorage.getItem('isSelf');
        this.$_data.userID = +sessionStorage.getItem('userID');
        this.$_data.spaceID = +sessionStorage.getItem('spaceID');
        sessionStorage.removeItem('isSelf');
        sessionStorage.removeItem('userID');
        sessionStorage.removeItem('spaceID');
    }

    /**
     *
     * @param {boolean} open - 状态
     * @param {Object} opts
     * @param {HTMLElement|jQuery|string} [opts.viewport] - 可视窗口
     * @param {HTMLElement|jQuery|string} [opts.context] - 文档
     * @param {string} [opts.eventNamespace] - 事件的命名空间
     * @param {function} [callbackfn] - 回调函数
     */
    scrolloading(open, opts, callbackfn) {
        const $viewport = opts.viewport ? (opts.viewport instanceof jQuery ? opts.viewport : $(opts.viewport)) : this.$(this.window);
        const $context = opts.context ? (opts.context instanceof jQuery ? opts.context : $(opts.context)) : this.$(this.document);
        const event = `scroll.${opts.eventNamespace || 'scrolloading'}`;
        if (open) {
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
    }


    static formatNumber(num) {
        const str = num + '';//转换成字符串
        const str_num = str.split('.')[0];
        var str_last = str.split('.')[1] == undefined ? '' : '.'+str.split('.')[1];
        var ret_num = '';
        var counter = 0;
        for(var i=str_num.length-1;i>=0;i--){
            ret_num = str_num.charAt(i) + ret_num;
            counter++;
            if(counter==3){
                counter = 0;
                if(i!=0){
                    ret_num = ',' + ret_num;
                }
            }}
        return ret_num + str_last;
    }

    static objectToString(obj, separator) {
        const keys = Object.keys(obj);
        const lastIndex = keys.length - 1;
        return keys.reduce(function callback(string, key, index) {
            return string + key + '=' + obj[key] + (index !== lastIndex ? separator : '');
        }, '');
    }
    static stringToObject(str, separator) {
        const result = {};
        const key$valueArray = str.split(separator);
        key$valueArray.forEach(function (value) {
            const key$value = value.split('=');
            const valueIsNum = !isNaN(+key$value[1]);
            result[key$value[0]] = valueIsNum ? +decodeURIComponent(key$value[1]) : decodeURIComponent(key$value[1]);
        });
        return result;
    }

    // 加密相关
    static methods(methodName) {
        const methods = {
            getRequestURL(opts) {
                const api = opts.api;
                const params = opts.params ? Effect.objectToString(opts.params, '&') + '&' : '';
                const callback = opts.callback !== undefined ? opts.callback : true;
                const callbackName = opts.callbackName || 'easybuyCallback=?';
                if (params === '' && callback === false) {
                    return api;
                }
                return `${api}?${params}${callback && callbackName}`;
            },
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
            replaceAtre(str) {
                return str.replace(/(\?|&|easybuyCallback=)/gim, '');
            },
            getEncryption(str) {
                const _string = methods.replaceAtre(str).toLowerCase();
                const word = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
                return _string.split('').map((v, i) => {
                    const _value = !isNaN(+v) ? word[v] : v;
                    return i + _value.charCodeAt(0);
                }).join('');
            },
            getServerDateTime() {
                const serverDate = $.ajax({
                    type: "OPTIONS",
                    async: false,
                    url: "/",
                }).getResponseHeader("Date");
                return new Date(serverDate);
            },
            getTerm() {
                return methods.getServerDateTime().getTime();
            },
            getEncryptURL(opts) {
                let _params = {};
                const eString = methods.getRequestURL({
                    api: opts.api,
                    params: opts.params,
                    callback: false
                });
                if (opts.params !== undefined && typeof opts.params === 'object') {
                    _params = opts.params;
                }
                _params['_encryption'] = methods.getEncryption(eString);
                _params['_term'] = methods.getTerm();
                return methods.getRequestURL({api: opts.api, params: _params});
            },
        }
        return methods[methodName];
    }

}

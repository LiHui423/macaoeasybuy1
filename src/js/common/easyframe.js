class Effect {
    constructor(opts) {
        this.$_data = opts.data || {};
        this.$_methods = opts.methods || {};
        this.$_el = null;
        (((el) => {
            const _el = document.querySelector(el);
            if (_el) {
                this.$_el = _el;
                return;
            }
            this.window = document.querySelector('iframe').contentWindow;
            this.document = this.window.document;
            this.$_el = this.document.querySelector(el);
        })(opts.el));
        // 钩子
        typeof opts.before === 'function' && (this.$_before = opts.before);
        typeof opts.resBack === 'function' && (this.$_resBack = opts.resBack);
        typeof opts.after === 'function' && (this.$_after = opts.after);
        // 把$_methods里的方法曝露出来
        opts.methods && (
            Object.keys(opts.methods).forEach(mn => {
                this[mn] = () => {
                    return this.$_methods[mn].call(this);
                }
            })
        );

        // 上面的数据初始化完成后开始执行
        ((()=>{
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
            this.$_data.URLParams = Effect.stringToObject(window.location.search.substring(1));
            // =========== 如果本地有cookie就向服务器请求用户数据 ============
            const userInfoAPI = 'http://userManager.macaoeasybuy.com/UserInfoManagerGetController/LoginTopInfo.easy';
            if (hasCookie && !this.window) {
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
            $('#page-footer').load('/common/footer.html');

            // ============== 隐藏模板字符串 ==============
            this.$_data.template = {};
            ((() => {
                const w = this.window ? this.window : window;
                w.onload = () => {
                    w.document.querySelectorAll('script[data-art-template]').forEach(t => {
                        const ID = t.getAttribute('data-art-template');
                        const content = t.innerHTML;
                        this.$_data.template[ID] = content;
                        t.parentElement.removeChild(t);
                    })
                    // ========== 一个钩子
                    this.$_after && this.$_after();
                    w.onload = null;
                }
            })());
        })());
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

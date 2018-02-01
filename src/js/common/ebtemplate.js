var Ebtemplate = (function() {

    /**
     *
     * @constructs Ebtemplate
     *
     * 基础配置
     * @param {Object} opts
     * @param {string} opts.targetURL - 目标链接
     * @param {Object} opts.parameters - 请求参数
     * @param {string} opts.requestMethod - 请求方式
     * @param {Object} opts.data - 数据
     * @param {Object} [opts.container] - 容器JQuery对象
     * @param {string} [opts.templateID] - 模板ID
     *
     * 滚动加载 可选
     * @param {Object} [opts.scrollLoading] - 滚动加载配置
     * @param {boolean} [opts.scrollLoading.state] - 滚动加载配置.开关
     * @param {Object} [opts.scrollLoading.window] - 滚动加载配置.窗口
     * @param {Object} [opts.scrollLoading.document] - 滚动加载配置.文档
     * @param {string} [opts.scrollLoading.eventSelector] - 滚动加载配置.事件选择器
     *
     * 钩子 可选
     * @param {Function} [opts.beforeGetRes] - 请求数据之前
     * @param {Function} [opts.afterGetRes] - 请求数据之后
     * @param {Function} [opts.beforeInsert] - 插入模板之前
     * @param {Function} [opts.afterInsert] - 插入模板之后
     *
     */
    function Ebtemplate(opts) {


        // 请求选项
        this.requestOptions = {
            targetURL: opts.targetURL || '',
            parameters: opts.parameters || {},
            method: opts.requestMethod || 'GET',
        };


        // 容器
        if(opts.container !== undefined) {
            this.$container = typeof opts.container === 'string' ? $(opts.container) : opts.container;
        }


        // 字符串
        opts.templateID !== undefined && (this.templateString = this.getTemplateString(opts.templateID));


        // 数据
        this.data = opts.data || {};


        // 方法
        opts.methods !== undefined && (this.methods = opts.methods);


        // 滚动加载 TODO: JQuery变量标识
        if(opts.scrollLoading !== undefined) {
            this.scrollLoadingOptions = {
                state: opts.scrollLoading.state,
                eventSelector: opts.scrollLoading.eventSelector || 'loading'
            };

            // 窗口
            if(opts.scrollLoading.window !== undefined) {
                this.scrollLoadingOptions.$window = opts.scrollLoading.window instanceof $ ? opts.scrollLoading.window : $(opts.scrollLoading.window);
            } else {
                this.scrollLoadingOptions.$window = $(window);
            }

            // 文档
            if(opts.scrollLoading.document !== undefined) {
                this.scrollLoadingOptions.$document = opts.scrollLoading.document instanceof $ ? opts.scrollLoading.document : $(opts.scrollLoading.document);
            } else {
                this.scrollLoadingOptions.$document = $(document);
            }

        }


        // 钩子

        // 获取数据前
        (opts.beforeGetRes !== undefined && opts.beforeGetRes instanceof Function) && (this.beforeGetRes = opts.beforeGetRes);


        // 获取数据后
        (opts.afterGetRes !== undefined && opts.afterGetRes instanceof Function) && (this.afterGetRes = opts.afterGetRes);


        // 插入模板前
        (opts.beforeInsert !== undefined && opts.beforeInsert instanceof Function) && (this.beforeInsert = opts.beforeInsert);


        // 插入模板后
        (opts.afterInsert !== undefined && opts.afterInsert instanceof Function) && (this.afterInsert = opts.afterInsert);
    }




    /**
     * @description 原型方法
     *
     */
    Ebtemplate.prototype = {

        constructor: Ebtemplate,


        /**
         * @description 获取JSONP用的请求链接合成
         * @returns {string}
         */
        getRequestURLofJSONP: function() {
            // 目标链接
            var targetURL = this.requestOptions.targetURL;
            // 请求参数
            var parameters = this.requestOptions.parameters;
            // 参数的键组
            var parametersKey = typeof parameters === 'object' ? Object.keys(parameters) : {};
            // 参数键值对字符串
            var parametersString = !(parametersKey instanceof Array) ? '' : parametersKey.reduce(function (string, key) {
                return string + key + '=' + parameters[key] + '&';
            }, '');
            // 返回字符串
            return targetURL + '?' + parametersString + 'easybuyCallback=?';
        },


        /**
         * @description 获取模板字符串
         * @returns {string}
         */
        getTemplateString: function(templateID) {
            if(templateID !== undefined) {
                var templateBlock = $(document).find('script#' + templateID + '[data-eb-template]');
                var templateString = templateBlock.html();  // TODO: 去除标签间的空格
                templateBlock.remove(); // 删除页面里的模板
                return templateString;
            }
        }
    };



    /**
     * @description 中央处理器
     * @param {Array} templateObjects
     */
    Ebtemplate.prototype.constructor.processor = function processor(templateObjects) {
        for(var i = 0, templateObject; (templateObject = templateObjects[i++]);) {
            // TODO: 未判断
            Ebtemplate.requestData(templateObject);
        }
    };


    /**
     * @description 请求数据
     * @param {Object} templateObject
     */
    Ebtemplate.prototype.constructor.requestData = function requestData(templateObject) {

        var $container = templateObject.$container;   // JQuery对象

        if(templateObject.requestOptions.parameters !== undefined) {
            var paramPage = typeof templateObject.requestOptions.parameters.page === 'number' ? templateObject.requestOptions.parameters.page : undefined;
            var paramSize = typeof templateObject.requestOptions.parameters.size === 'number' ? templateObject.requestOptions.parameters.size : undefined;
        }

        var templateString = templateObject.templateString;
        var method = templateObject.requestOptions.method;
        var url = templateObject.getRequestURLofJSONP();
        $.ajax({
            url: url,
            method: method,
            dataType: 'JSONP',
            context: templateObject,
            beforeSend: function() {
                this.beforeGetRes && this.beforeGetRes();
                // TODO: 滚动加载
                if(this.scrollLoadingOptions !== undefined) {
                    easyBuy.global.dep.easyScrollRequest('off', this.scrollLoadingOptions.eventSelector, this.scrollLoadingOptions.$window);
                }
            },
            success: function(responseJSON) {
                var result = responseJSON['result'];
                var dataPackage = {
                    page: paramPage
                };
                if (result instanceof Array) {
                    dataPackage.content = result;
                } else {
                    var keys = Object.keys(result);
                    for (var i = 0; i < keys.length; i++) {
                        if (keys[i] === 'labellist') {
                            dataPackage.content = result['labellist'];
                        } else {
                            dataPackage[keys[i]] = result[keys[i]];
                        }
                    }
                }

                // 钩子
                this.afterGetRes && this.afterGetRes(dataPackage);

                // 钩子
                this.beforeInsert && this.beforeInsert(dataPackage);

                // 插入模板
                if($container === templateObject.$container && dataPackage.content.length > 0) {
                    Ebtemplate.insertTemplate($container, templateString, dataPackage);
                } else {
                    return false;
                }

                // TODO: 滚动加载
                if(dataPackage.content.length === paramSize && this.scrollLoadingOptions !== undefined) {
                    var to = this;
                    to.requestOptions.parameters.page++;
                    easyBuy.global.dep.easyScrollRequest('on', to.scrollLoadingOptions.eventSelector, to.scrollLoadingOptions.$window, to.scrollLoadingOptions.$document, function() {
                        Ebtemplate.requestData(to);
                    });
                }
                // 钩子
                this.afterInsert && this.afterInsert();
            }
        });
    };



    /**
     * @description 插入模板
     * @param {Object} $container
     * @param {string} templateString
     * @param {Object} dataPackage
     * @param {number|undefined} dataPackage.page
     * @param {Array} dataPackage.content
     */
    Ebtemplate.prototype.constructor.insertTemplate = function insertTemplate($container, templateString, dataPackage) {
        // TODO: 使用缓存插入

        // 分页数据
        var isPaging = dataPackage.page !== undefined;

        // 首页数据
        var isFirst = dataPackage.page === 0;

        if(template === undefined) {
            return false;
        }

        if(isFirst || !isPaging) {
            $container.html(template.render(templateString, dataPackage));
        } else {
            $container.append(template.render(templateString, dataPackage));
        }
    };

    return Ebtemplate;

}());

easyBuy.global.startJs = function () {
    store.init(+easyFrame.getUrlParam('id'));
};

var store = (function () {
    // 规定操作的元素必定是JQuery对象
    var templateObjects = {};
    var dom = {
        labelTab: {
            show: '.labelTabs',
            created: '.tab.tab-created',
            used: '.tab.tab-used .tab-show',
            usedAll: '.tab.tab-used .all',
            usedDaily: '.tab.tab-used .daily',
            usedLiving: '.tab.tab-used .living',
            usedBuy: '.tab.tab-used .buy',
            usedUsed: '.tab.tab-used .used'
        },
        sortOrderTab: {
            show: '.sortOrderTabs',
            time: '.sortOrderTabs .tab:eq(0)',
            love: '.sortOrderTabs .tab:eq(1)',
            used: '.sortOrderTabs .tab:eq(2)',
        },
        labelAdd: {
            show: '.label-add',
            btn: '.label-add .add-btn',
            panel: '.label-add .add-panel',
            panelSelect: '.add-panel .select',
            panelConfirm: '.add-panel .confirm',
            tabs: '.select .header ul',
            input: '.select .header input',
            list: '.select > ul'
        },
        container: '.item-container'
    };
    var methods = {
        /**
		 * @desc 是否显示添加标签按钮
		 */
        hasShowAddLabelButton: function () {
            var isSelf = true;
            if (isSelf) {
                methods.bindAddLabelButtonEvent();
                methods.bindAddLabelPanelTypeTabsEvents();
                methods.bindSearchInputEvent();
            } else {
                $(dom.labelAdd.show).remove();
            }
        },


        /**
		 * @desc 添加标签按钮事件
		 */
        bindAddLabelButtonEvent: function () {
            $(document.body).on('click.addLabelBtn', function callback(event) {
                var target = $(event.target);
                var btn = $(dom.labelAdd.btn);
                var panel = $(dom.labelAdd.panel);
                if (target[0] === btn[0]) {
                    panel.toggle();
                } else {
                    panel.css('display') !== 'none' && target.parents('.add-panel').length === 0 && panel.css('display', 'none');
                }
            });
        },


        /**
		 * @desc 获取当前活动的索引组合
		 * @returns {string}
		 */
        getIndexGroup: function () {
            var labelTabIndex = +$(dom.labelTab.show).attr('data-eb-active');
            var sortOrderIndex = +$(dom.sortOrderTab.show).attr('data-eb-active');
            return labelTabIndex + '' + sortOrderIndex;
        },


        /**
		 * @desc template
		 * @param {number} id
		 */
        setTemplateObject: function (id) {
            templateObjects = {
                queryLabelPrevCount: new Ebtemplate({
                    targetURL: 'http://userspace1.macaoeasybuy.com/UserLabelConntroller/queryLabelPrevCount.easy',
                    parameters: {
                        userId: id
                    },
                }),
                queryUserUsedLabelCount: new Ebtemplate({
                    targetURL: 'http://social1.macaoeasybuy.com/SolrLabelsController/QueryUserUsedLabelCount.easy',
                    parameters: {
                        userId: id
                    }
                }),
                queryUserSpaceLabel: new Ebtemplate({
                    targetURL: 'http://social1.macaoeasybuy.com/SolrLabelsController/queryUserSpaceLabel.easy',
                    parameters: {
                        userId: id,
                        page: 0,
                        size: 10,
                        order: 'uptime',
                    },
                    templateID: 'queryUserSpaceLabel',
                    scrollLoading: {
                        state: true,
                    },
                    data: {
                        '00': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '01': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '02': {
                            responseJSON: [],
                            requestParams: ''
                        }
                    },
                    afterGetRes: function(dataPackage) {
                        var indexGroup = methods.getIndexGroup();
                        this.data[indexGroup].responseJSON.push(dataPackage);
                    },
                    afterInsert: function() {
                        easyBuy.global.dep.waterfall(this.$container, this.$container.children('.label-item'), 2, 10, 0, true);
                    }
                }),
                queryUserSpaceUsedLabel: new Ebtemplate({
                    targetURL: 'http://social1.macaoeasybuy.com/SolrLabelsController/queryUserSpaceUsedLabel.easy',
                    parameters: {
                        userId: id,
                        type: 0,
                        page: 0,
                        size: 10,
                        order: 'uptime'
                    },
                    templateID: 'queryUserSpaceUsedLabel',
                    scrollLoading: {
                        state: true
                    },
                    afterInsert: function() {
                        easyBuy.global.dep.waterfall(this.$container, this.$container.children('.post-item'), 2, 10, 0, true);
                    },
                    data: {
                        '10': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '11': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '12': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '20': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '21': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '22': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '30': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '31': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '32': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '40': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '41': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '42': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '50': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '51': {
                            responseJSON: [],
                            requestParams: ''
                        },
                        '52': {
                            responseJSON: [],
                            requestParams: ''
                        },
                    }
                }),
                queryLabelForUserSpace: new Ebtemplate({
                    targetURL: 'http://social1.macaoeasybuy.com/SolrLabelsController/QueryLabelForUserSpace.easy',
                    parameters: {
                        match: 1,
                        name: '',
                        type: 0,
                        size: 10,
                        page: 0,
                        order: 'addtime',
                        descOrAsc: 'desc',
                    },
                    container: $('.add-panel .select > ul'),
                    templateID: 'queryLabelForUserSpace',
                    beforeInsert: function (dataPackage) {
                        if (dataPackage['match'] === false) {
                            this.requestOptions.parameters.page = 1;
                            dataPackage['page'] = 1;
                        }
                        var REGEXP = RegExp(this.requestOptions.parameters.name, 'gim');
                        for (var i = 0, item; (item = dataPackage['content'][i++]);) {
                            var name = item.labelName.match(REGEXP)[0];
                            item.labelName = item.labelName.replace(REGEXP, '<span style="color:#ff567c">' + name + '</span>');
                        }
                    },
                })
            };
        },


        // TODO:
        requestData: function () {
            Ebtemplate.processor([templateObjects['active']]);
        },


        /**
		 * @desc 设置模板对象的请求参数的排序
		 * @param {number} index
		 */
        setRequestParamsOrder: function (index) {
            var order = '';
            switch (index) {
            case 0:
                order = 'uptime';
                break;
            case 1:
                order = 'loveCount';
                break;
            case 2:
                order = 'usedCount';
                break;
            }
            templateObjects['active'].requestOptions.parameters.order = order;
        },


        /**
		 * @desc 设置容器
		 * @param {number} index
		 */
        setTemplateObjectContainer: function (index) {
            templateObjects['active'].$container = $(dom.container).children().eq(index);
            $(dom.container).attr('data-eb-active', index);
            // 是否有内容
            var hasContent = templateObjects['active'].$container.children().length !== 0;
            if (!hasContent) {
                templateObjects['active'].requestOptions.parameters.page = 0;
                // TODO: 切换排序，切换标签
                methods.requestData();
            }
        },

        cleanContainer: function () {
            for(var i = 0; i < $(dom.container).children().length; i++) {
                $(dom.container).children().eq(i).html('');
            }
        },


        /**
		 * @desc 设置type参数，用过的标签
		 * @param {number} index
		 */
        setRequestParamsType: function (index) {
            var type = undefined;
            switch (index) {
            case 1: //All
                type = 0;
                break;
            case 2: // Daily
                type = 1;
                break;
            case 3: // living
                type = 5;
                break;
            case 4: // Buy
                type = 2;
                break;
            case 5: // Used
                type = 4;
                break;
            }
            templateObjects['active'].requestOptions.parameters.type = type;
        },


        /**
		 * @desc 标签数 TODO: 待优化抖动
		 */
        labelCount: function () {
            $.ajax({
                url: templateObjects['queryLabelPrevCount'].getRequestURLofJSONP(),
                method: 'GET',
                dataType: 'JSON',
                success: function (res) {
                    var person = +easyFrame.getUrlParam('id') === easyBuy.easyUser.id ? '我' : '佢';
                    var created = person + 'の標籤(' + res['result'].labelCount + ')';
                    var used = person + '用過の標籤(' + res['result'].usedLabelCount + ')';
                    $(dom.labelTab.created).html(created);
                    $(dom.labelTab.used).html(used);
                    $(dom.labelTab.usedAll).html(used);
                }
            });
            $.ajax({
                url: templateObjects.queryUserUsedLabelCount.getRequestURLofJSONP(),
                method: 'GET',
                dataType: 'JSON',
                success: function (res) {
                    $(dom.labelTab.usedDaily).html('日誌(' + res['result'].diaryCount + ')');
                    $(dom.labelTab.usedLiving).html('生活圈(' + res['result'].lifeCount + ')');
                    $(dom.labelTab.usedBuy).html('败家誌(' + res['result'].sentVolunteerCount + ')');
                    $(dom.labelTab.usedUsed).html('二手(' + res['result'].usedCount + ')');
                }
            });
        },


        /**
		 * @desc 备份请求参数
		 * @param {string} indexGroup
		 */
        backupRequestParams: function (indexGroup) {
            templateObjects['active'].data[indexGroup].requestParams = JSON.stringify(templateObjects['active'].requestOptions.parameters);
        },


        /**
		 * @desc 恢复请求参数
		 * @param {string} indexGroup
		 */
        recoverRequestParams: function (indexGroup) {
            templateObjects['active'].requestOptions.parameters = JSON.parse(templateObjects['active'].data[indexGroup].requestParams);
        },


        /**
		 * @desc 绑定标签选项卡事件
		 */
        bindLabelTabsEvent: function () {
            // var defaultParams = JSON.stringify(templateObjects['queryUserSpaceUsedLabel'].requestOptions.parameters);
            $(dom.labelTab.show).on('click', function (event) {
                var index = $(event.target).index();
                var isntSelf = +$(this).attr('data-eb-active') !== index;
                var isntUsedLabelShow = !$(event.target).hasClass('tab-show');
                if(isntSelf && isntUsedLabelShow) {
                    methods.changeLabelTabs(index);
                    methods.cleanContainer();
                    methods.setTemplateObjectContainer(0);
                }
            });
        },


        /**
         * @description 修改标签选项卡行为
         * @param {number} index 目标索引
         */
        changeLabelTabs: function (index) {
            var isUsedToUsed = +$(dom.labelTab.show).attr('data-eb-active') !== 0;
            var isEverywhereToUsed = index !== 0;
            // 修改排序选项卡
            methods.changeSortOrderTabs(0);
            // 修改活动状态
            $(dom.labelTab.show).attr('data-eb-active', index);
            // 刷新索引组
            var indexGroup = methods.getIndexGroup();
            // 判断目标位置
            if(isEverywhereToUsed) {
                if(isUsedToUsed) {
                    // 从用过的标签到用过的标签
                    methods.setRequestParamsType(index);
                } else {
                    // 从创建的标签到用过的标签
                    templateObjects['active'] = templateObjects['queryUserSpaceUsedLabel'];
                }
            } else {
                // 从用过的标签到创建的标签
                templateObjects['active'] = templateObjects['queryUserSpaceLabel'];
            }
            //判断是会有缓存
            var hasRequestParams = templateObjects['active'].data[indexGroup].requestParams !== '';
            if (hasRequestParams) {
                methods.recoverRequestParams(indexGroup);
            } else {
                templateObjects['active'].requestOptions.parameters.page = 0;
            }
            $(dom.labelTab.used).html($(dom.labelTab.show + ' div').eq(index + 2).html());
        },


        /**
		 * @desc 绑定排序选项卡事件
		 */
        bindSortOrderTabsEvent: function () {
            $(dom.sortOrderTab.show).on('click', function (event) {
                var index = $(event.target).index();
                var isntSelf = +$(this).attr('data-eb-active') !== index;
                if (isntSelf) {
                    methods.changeSortOrderTabs(index);
                    // 设置容器
                    methods.setTemplateObjectContainer(index);
                }
            });
        },

        /**
         * @description 绑定搜索框事件
         */
        bindSearchInputEvent: function () {
            var labelKeyword = '';
            var t = null;
            $(dom.labelAdd.input).on('input propertychange', function() {
                var inputValue = '#' + $(this).val() + '#';
                if($(dom.labelAdd.list).children('.first-item').length !== 0) {
                    $(dom.labelAdd.list).children('.first-item').children('span').html(inputValue);
                } else {
                    $(dom.labelAdd.list).html('<li class="first-item" style="color:#ff567c"><span>' + inputValue + '</span><button>創建新標籤</button></li>');
                }
                if($(this).val() === '') {
                    $(dom.labelAdd.list).empty();
                }
                if(t === null) {
                    t = setInterval(function callback() {
                        var now = $(dom.labelAdd.input).val();
                        if(now === labelKeyword && labelKeyword !== '') {
                            templateObjects['queryLabelForUserSpace'].requestOptions.parameters.page = 0;
                            templateObjects['queryLabelForUserSpace'].requestOptions.parameters.name = now;
                            Ebtemplate.processor([templateObjects['queryLabelForUserSpace']]);
                            clearInterval(t);
                            t = null;
                        } else {
                            labelKeyword = now;
                        }
                    }, 500);
                }
            });
        },

        /**
         * @description 绑定添加标签面板类型选项卡
         */
        bindAddLabelPanelTypeTabsEvents: function() {
            $(dom.labelAdd.tabs).on('click', function(event) {
                var activeIndex = +$(this).attr('data-eb-active');
                var index = $(event.target).index();
                if(index !== activeIndex) {
                    $(this).attr('data-eb-active', index);
                    var type = [0, 2, 1];
                    templateObjects['queryLabelForUserSpace'].requestOptions.parameters.type = type[index];
                    templateObjects['queryLabelForUserSpace'].requestOptions.parameters.page = 0;
                    $(dom.labelAdd.list).children('.first-item').siblings().remove();
                    Ebtemplate.processor([templateObjects['queryLabelForUserSpace']]);
                }
            });
        },

        /**
         * @description 点击标签
         */
        bindLabelNameClickEvent: function() {

        },

        /**
         * @description 修改排序选项卡
         * @param {number} index
         */
        changeSortOrderTabs: function (index) {
            // 获取索引组
            var indexGroup = methods.getIndexGroup();
            // 备份请求参数
            methods.backupRequestParams(indexGroup);
            // 修改活动状态
            $(dom.sortOrderTab.show).attr('data-eb-active', index);
            // 刷新索引组
            indexGroup = methods.getIndexGroup();
            // 判断是否有参数缓存
            var hasRequestParams = templateObjects['active'].data[indexGroup].requestParams !== '';
            if(hasRequestParams) {
                methods.recoverRequestParams(indexGroup);
            } else {
                templateObjects['active'].requestOptions.parameters.page = 0;
                methods.setRequestParamsOrder(index);
            }
        },


        /**
		 *
		 * @param id
		 */
        init: function (id) {
            methods.hasShowAddLabelButton();
            methods.setTemplateObject(id);
            methods.labelCount();
            templateObjects['active'] = templateObjects['queryUserSpaceLabel'];
            methods.bindSortOrderTabsEvent();
            methods.bindLabelTabsEvent();
            methods.setTemplateObjectContainer(0);
        },
    };
    return {
        init: methods.init
    };
}());

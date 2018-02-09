const Effect = parent.window.Effect;
const label = new Effect({
    el: '#label-list',
    data: {
        doms: {
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
        },
        ApiO: {
            active: {},
        }
    },
    methods: {
        /**
         * @desc 是否显示添加标签按钮
         */
        hasShowAddLabelButton() {
            if (this.$_data.isSelf) {
                this.bindAddLabelButtonEvent();
                this.bindAddLabelPanelTypeTabsEvents();
                this.bindSearchInputEvent();
            } else {
                $(this.$_data.doms.labelAdd.show).remove();
            }
        },

        /**
         * @desc 添加标签按钮事件
         */
        bindAddLabelButtonEvent() {
            $(document.body).on('click.addLabelBtn', event => {
                const target = $(event.target);
                const btn = $(this.$_data.doms.labelAdd.btn);
                const panel = $(this.$_data.doms.labelAdd.panel);
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
        getIndexGroup() {
            const labelTabIndex = +$(this.$_data.doms.labelTab.show).attr('data-eb-active');
            const sortOrderIndex = +$(this.$_data.doms.sortOrderTab.show).attr('data-eb-active');
            return labelTabIndex + '' + sortOrderIndex;
        },

        // 初始化ApiO
        initApiO() {
            const effect = this;
            this.$_data.ApiO = {
                // 创建的标签数量
                queryLabelPrevCount: this.template({
                    api: 'http://userspace1.macaoeasybuy.com/UserLabelConntroller/queryLabelPrevCount.easy',
                    params: {
                        userId: this.$_data.userID
                    },
                }),
                // 用过的标签数量
                queryUserUsedLabelCount: this.template({
                    api: 'http://social1.macaoeasybuy.com/SolrLabelsController/QueryUserUsedLabelCount.easy',
                    params: {
                        userId: this.$_data.userID
                    }
                }),
                // 创建的标签列表
                queryUserSpaceLabel: this.template({
                    api: 'http://social1.macaoeasybuy.com/SolrLabelsController/queryUserSpaceLabel.easy',
                    params: {
                        userId: this.$_data.userID,
                        page: 0,
                        size: 10,
                        order: 'uptime',
                    },
                    templateID: 'queryUserSpaceLabel',
                    waterfall: { isFrame: true },
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
                    afterRes(dataPackage) {
                        const indexGroup = effect.getIndexGroup();
                        this.$_data[indexGroup].responseJSON.push(dataPackage);
                    },
                }),
                queryUserSpaceUsedLabel: this.template({
                    api: 'http://social1.macaoeasybuy.com/SolrLabelsController/queryUserSpaceUsedLabel.easy',
                    params: {
                        userId: this.$_data.userID,
                        type: 0,
                        page: 0,
                        size: 10,
                        order: 'uptime'
                    },
                    templateID: 'queryUserSpaceUsedLabel',
                    waterfall: { isFrame: true },
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
                queryLabelForUserSpace: this.template({
                    api: 'http://social1.macaoeasybuy.com/SolrLabelsController/QueryLabelForUserSpace.easy',
                    params: {
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
                        for (var i = 0, item;
                            (item = dataPackage['content'][i++]);) {
                            var name = item.labelName.match(REGEXP)[0];
                            item.labelName = item.labelName.replace(REGEXP, '<span style="color:#ff567c">' + name + '</span>');
                        }
                    },
                })
            }
        },

        // TODO:
        requestData() {
            this.$_data.ApiO['active'].run();
        },


        /**
         * @desc 设置模板对象的请求参数的排序
         * @param {number} index
         */
        setRequestParamsOrder(index) {
            const order = ['uptime', 'loveCount', 'usedCount'];
            this.$_data.ApiO['active'].$_request.params.order = order[index];
        },


        /**
         * @desc 设置容器
         * @param {number} index
         */
        setTemplateObjectContainer(index) {
            this.$_data.ApiO['active'].$_container = $(this.$_data.doms.container).children()[index];
            $(this.$_data.doms.container).attr('data-eb-active', index);
            // 是否有内容
            const hasContent = this.$_data.ApiO['active'].$_container.children.length !== 0;
            if (!hasContent) {
                this.$_data.ApiO['active'].$_request.params.page = 0;
                // TODO: 切换排序，切换标签
                this.requestData();
            }
        },

        cleanContainer() {
            $(this.$_data.doms.container).children().eq(0).empty();
            $(this.$_data.doms.container).children().eq(1).empty();
            $(this.$_data.doms.container).children().eq(2).empty();
        },

        // 设置请求类型。用过的标签
        setRequestParamsType(index) {
            const type = [0, 1, 5, 2, 4];
            this.$_data.ApiO['active'].$_request.params.type = type[index];
        },


        /**
         * @desc 标签数 TODO: 待优化抖动
         */
        labelCount() {
            let api = this.$_data.ApiO['queryLabelPrevCount'].$_request.api;
            let params = this.$_data.ApiO['queryLabelPrevCount'].$_request.params;
            let url = Effect.methods('getRequestURL')({api, params});
            $.ajax({
                url,
                method: 'GET',
                dataType: 'JSONP',
                success: res => {
                    const person = this.$_data.isSelf ? '我' : '佢';
                    const created = person + 'の標籤(' + res['result'].labelCount + ')';
                    const used = person + '用過の標籤(' + res['result'].usedLabelCount + ')';
                    $(this.$_data.doms.labelTab.created).html(created);
                    $(this.$_data.doms.labelTab.used).html(used);
                    $(this.$_data.doms.labelTab.usedAll).html(used);
                }
            });
            api = this.$_data.ApiO['queryUserUsedLabelCount'].$_request.api;
            params = this.$_data.ApiO['queryUserUsedLabelCount'].$_request.params;
            url = Effect.methods('getRequestURL')({api, params});
            $.ajax({
                url,
                method: 'GET',
                dataType: 'JSONP',
                success: res => {
                    $(this.$_data.doms.labelTab.usedDaily).html('日誌(' + res['result'].diaryCount + ')');
                    $(this.$_data.doms.labelTab.usedLiving).html('生活圈(' + res['result'].lifeCount + ')');
                    $(this.$_data.doms.labelTab.usedBuy).html('败家誌(' + res['result'].sentVolunteerCount + ')');
                    $(this.$_data.doms.labelTab.usedUsed).html('二手(' + res['result'].usedCount + ')');
                }
            });
        },


        /**
         * @desc 备份请求参数
         * @param {string} indexGroup
         */
        backupRequestParams(indexGroup) {
            this.$_data.ApiO['active'].$_data[indexGroup].requestParams = JSON.stringify(this.$_data.ApiO['active'].$_request.params);
        },


        /**
         * @desc 恢复请求参数
         * @param {string} indexGroup
         */
        recoverRequestParams(indexGroup) {
            this.$_data.ApiO['active'].$_request.params = JSON.parse(this.$_data.ApiO['active'].$_data[indexGroup].requestParams);
        },


        /**
         * @desc 绑定标签选项卡事件
         */
        bindLabelTabsEvent() {
            const _this = this;
            // var defaultParams = JSON.stringify(templateObjects['queryUserSpaceUsedLabel'].requestOptions.parameters);
            $(this.$_data.doms.labelTab.show).on('click', function (event) {
                const index = $(event.target).index();
                const isntSelf = +$(this).attr('data-eb-active') !== index;
                const isntUsedLabelShow = !$(event.target).hasClass('tab-show');
                if (isntSelf && isntUsedLabelShow) {
                    _this.changeLabelTabs(index);
                    _this.cleanContainer();
                    _this.setTemplateObjectContainer(0);
                }
            });
        },


        /**
         * @description 修改标签选项卡
         * @param {number} index 目标索引
         */
        changeLabelTabs(index) {
            const isUsedToUsed = +$(this.$_data.doms.labelTab.show).attr('data-eb-active') !== 0;
            const isEverywhereToUsed = index !== 0;
            // 修改排序选项卡
            this.changeSortOrderTabs(0);
            // 修改活动状态
            $(this.$_data.doms.labelTab.show).attr('data-eb-active', index);
            // 刷新索引组
            const indexGroup = this.getIndexGroup();
            // 判断目标位置
            if (isEverywhereToUsed) {
                if (isUsedToUsed) {
                    // 从用过的标签到用过的标签
                    this.setRequestParamsType(index);
                } else {
                    // 从创建的标签到用过的标签
                    this.$_data.ApiO['active'] = this.$_data.ApiO['queryUserSpaceUsedLabel'];
                }
            } else {
                // 从用过的标签到创建的标签
                this.$_data.ApiO['active'] = this.$_data.ApiO['queryUserSpaceLabel'];
            }
            //判断是会有缓存
            const hasRequestParams = this.$_data.ApiO['active'].$_data[indexGroup].requestParams !== '';
            if (hasRequestParams) {
                this.recoverRequestParams(indexGroup);
            } else {
                this.$_data.ApiO['active'].$_request.params.page = 0;
            }
            $(this.$_data.doms.labelTab.used).html($(this.$_data.doms.labelTab.show + ' div').eq(index + 2).html());
        },


        /**
         * @desc 绑定排序选项卡事件
         */
        bindSortOrderTabsEvent() {
            const _this = this;
            const $e = $(this.$_data.doms.sortOrderTab.show);
            $e.on('click', e => {
                const index = $(e.target).index();
                const isntSelf = +$e.attr('data-eb-active') !== index;
                if (isntSelf) {
                    _this.changeSortOrderTabs(index);
                    // 设置容器
                    _this.setTemplateObjectContainer(index);
                }
            });
        },

        /**
         * @description 绑定搜索框事件
         */
        bindSearchInputEvent() {
            let labelKeyword = '';
            let t = null;
            const _this = this;
            const $list = $(this.$_data.doms.labelAdd.list);
            const $input = $(this.$_data.doms.labelAdd.input);
            $input.on('input propertychange', () => {
                const inputValue = '#' + $input.val() + '#';
                if ($list.children('.first-item').length !== 0) {
                    $list.children('.first-item').children('span').html(inputValue);
                } else {
                    $list.html('<li class="first-item" style="color:#ff567c"><span>' + inputValue + '</span><button>創建新標籤</button></li>');
                }
                $input.val() === '' && $list.empty();
                if (t === null) {
                    t = setInterval(() => {
                        const now = $input.val();
                        if (now === labelKeyword && labelKeyword !== '') {
                            _this.$_data.ApiO['queryLabelForUserSpace'].$_request.params.page = 0;
                            _this.$_data.ApiO['queryLabelForUserSpace'].$_request.params.name = now;
                            _this.$_data.ApiO['queryLabelForUserSpace'].run();
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
        bindAddLabelPanelTypeTabsEvents() {
            const _this = this;
            $(this.$_data.doms.labelAdd.tabs).on('click', function (event) {
                const activeIndex = +$(this).attr('data-eb-active');
                const index = $(event.target).index();
                if (index !== activeIndex) {
                    $(this).attr('data-eb-active', index);
                    var type = [0, 2, 1];
                    _this.$_data.ApiO['queryLabelForUserSpace'].$_request.params.type = type[index];
                    _this.$_data.ApiO['queryLabelForUserSpace'].$_request.params.page = 0;
                    $(this.$_data.doms.labelAdd.list).children('.first-item').siblings().remove();
                    _this.$_data.ApiO['queryLabelForUserSpace'].run();
                }
            });
        },

        /**
         * @description 点击标签
         */
        bindLabelNameClickEvent() {

        },

        /**
         * @description 修改排序选项卡
         * @param {number} index
         */
        changeSortOrderTabs(index) {
            // 获取索引组
            let indexGroup = this.getIndexGroup();
            // 备份请求参数
            this.backupRequestParams(indexGroup);
            // 修改活动状态
            $(this.$_data.doms.sortOrderTab.show).attr('data-eb-active', index);
            // 刷新索引组
            indexGroup = this.getIndexGroup();
            // 判断是否有参数缓存
            const hasRequestParams = this.$_data.ApiO['active'].$_data[indexGroup].requestParams !== '';
            if (hasRequestParams) {
                this.recoverRequestParams(indexGroup);
            } else {
                this.$_data.ApiO['active'].$_request.params.page = 0;
                this.setRequestParamsOrder(index);
            }
        },
    },
    after() {
        this.removeSpaceInfo();
        this.initApiO();
        this.hasShowAddLabelButton();
        this.labelCount();
        this.$_data.ApiO['active'] = this.$_data.ApiO['queryUserSpaceLabel'];
        this.bindSortOrderTabsEvent();
        this.bindLabelTabsEvent();
        this.setTemplateObjectContainer(0);
    }
});

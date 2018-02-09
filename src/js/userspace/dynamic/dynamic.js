const Effect = parent.window.Effect;
const d = new Effect({
    el: '#dynamic',
    data: {
        doms: {
            newCount: document.querySelectorAll('.info-news'),
            dynamicTabs: document.querySelector('.dynamic-type-tabs'),
            sortOrderTabs: document.querySelector('.sort-order-tabs'),
            container: document.querySelector('.dynamic-content'),
        },
        ApiO: {
            active: {},
        },
        reqCache: {

        },
    },
    methods: {
        initApiO() {
            const effect = this;
            const descOrAsc = 'desc';
            const size = 8;
            const userId = this.$_data.spaceID;
            this.$_data.ApiO = {
                queryDynamicRelease: this.template({
                    api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicRelease.easy',
                    params: {
                        page: 0,
                        order: 'uptime',
                        size,
                        descOrAsc,
                        userId,
                    },
                    templateID: 'queryDynamicRelease',
                    container: effect.$_data.doms.container.children[0],
                    waterfall: { column: 4, isFrame: true, vGap: 10, },
                    scrolloading: {},
                }),
                queryDynamicAlbum: this.template({
                    api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicAlbum.easy',
                    params: {
                        page: 0,
                        order: 'uptime',
                        size,
                        descOrAsc,
                        userId,
                    },
                    templateID: 'queryDynamicRelease',
                }),
                queryDynamicSuitableLife: this.template({
                    api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicSuitableLife.easy',
                    params: {
                        page: 0,
                        order: 'uptime',
                        size,
                        descOrAsc,
                        userId,
                    },
                    templateID: 'queryDynamicRelease',
                    container: effect.$_data.doms.container.children[0],
                }),
                queryDynamicSentVolunteers: this.template({
                    api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicSentVolunteers.easy',
                    params: {
                        page: 0,
                        order: 'uptime',
                        size,
                        descOrAsc,
                        userId,
                    },
                    templateID: 'queryDynamicRelease',
                    container: effect.$_data.doms.container.children[0],
                }),
                queryDynamicUsed: this.template({
                    api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicUsed.easy',
                    params: {
                        page: 0,
                        order: 'uptime',
                        size,
                        descOrAsc,
                        userId,
                    },
                    templateID: 'queryDynamicRelease',
                    container: effect.$_data.doms.container.children[0],
                }),
                queryDynamicFair: this.template({
                    api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicFair.easy',
                    params: {
                        page: 0,
                        order: 'uptime',
                        size,
                        descOrAsc,
                        userId,
                    },
                    templateID: 'queryDynamicRelease',
                    container: effect.$_data.doms.container.children[0],
                }),
            }
        },
        bindClickEvnet() {
            const $dt = $(this.$_data.doms.dynamicTabs);
            const $st = $(this.$_data.doms.sortOrderTabs);
            $dt.on('click', '.tab' , e => {
                const $e = $(e.target).hasClass('.tab') ? $(e.target) : $(e.target).parents('.tab');
                const nowActiveIndex = $dt.attr('data-active');
                $e.index() !== nowActiveIndex && $dt.attr('data-active', $e.index()) && this.changeSortOrdreTab($e.index());
            });
            $st.on('click', '.tab', e => {
                const $e = $(e.target);
                const nowActiveIndex = $st.attr('data-active');
                if ($e.index() !== nowActiveIndex) {
                    this.changeSortOrdreTab($e.index());
                };
            });
        },
        changeSortOrdreTab(index) {
            const order =  ['uptime', 'commentNums', 'loveNums'];
            const doms = this.$_data.doms;
            this.backupReqState(this.getIndexGroup());
            this.$_data.ApiO.active.$_request.params.order = order[index];
            $(doms.sortOrderTabs).attr('data-active', index);
            this.recoverReqState(this.getIndexGroup());
            this.changeContainer(index);
        },
        changeContainer(index) {
            const container = this.$_data.doms.container;
            this.$_data.ApiO.active.$_container = container.children[index];
            container.children[index].children.length ===0 && this.request();
            container.setAttribute('data-active', index);
        },
        updateClickTime(type) {
            let lastClickTime = null;
            const url = Effect.methods('getReuqestURL')({
                api: 'http://userspace1.macaoeasybuy.com/userDynamicController/updateClickTime.easy',
                params: {
                    type: type,
                    userId
                }
            })
            $.ajax({
                url,
                method: 'GET',
                dataType: 'JSONP',
                async: false,
                success(responseJSON) {
                    lastClickTime = responseJSON['result'];
                    activeTos.requestOptions.params['lastClickTime'] = lastClickTime;
                    Template.execute(activeTos, page.data.template);
                },
            });
        },
        queryDynamicCount() {
            const url = Effect.methods('getRequestURL')({
                api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicCount.easy',
                params: { userId: this.$_data.spaceID },
            });
            $.ajax({
                url,
                method: 'GET',
                dataType: 'JSONP',
                success: (res) => {
                    const newCountKey = ["releaseCount", "albumCount", "suitableLifeCount", "sentVolunteersCount", "usedCount", "fairCount"];
                    newCountKey.forEach((v, i) => {
                        const COUNT = res['result'][v];
                        const html = COUNT === 0 ? '暫無新發佈' : `有<span>${COUNT}</span>新發佈`;
                        $(this.$_data.doms.newCount).eq(i).html(html);
                    });
                },
            });
        },
        clearContent() {},
        getIndexGroup() {
            const typeIndex = this.$_data.doms.dynamicTabs.getAttribute('data-active');
            const sortIndex = this.$_data.doms.sortOrderTabs.getAttribute('data-active');
            return `${typeIndex}${sortIndex}`;
        },
        backupReqState(indexGroup) {
            const reqCache = JSON.stringify(this.$_data.ApiO.active.$_request.params);
            this.$_data.reqCache[indexGroup] = reqCache;
        },
        recoverReqState(indexGroup) {
            const reqCache = this.$_data.reqCache[indexGroup];
            const $_request = this.$_data.ApiO.active.$_request;
            if (reqCache !== undefined) {
                $_request.params = JSON.parse(reqCache);
                return;
            }
            $_request.params.size = 8;
            $_request.params.page = 0;
        },
        request() {
            this.$_data.ApiO['active'].run();
        }
    },
    after() {
        this.removeSpaceInfo();
        this.initApiO();
        this.queryDynamicCount();
        this.bindClickEvnet();
        this.$_data.ApiO['active'] = this.$_data.ApiO['queryDynamicRelease'];
        this.request();
    }
});

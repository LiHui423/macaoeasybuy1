new Effect({
    el: '#userspace',
    data: {
        ApiO: {
            spaceInfo: {
                api: 'http://userspace1.macaoeasybuy.com/userSpaceIndexController/queryUserSpaceInfo.easy',
                params: {
                    userId: null,
                    seeUserId: null,
                }
            },
            spaceNav: {
                api: 'http://userspace1.macaoeasybuy.com/userSpaceIndexController/userSpaceInfoCount.easy',
                params: {
                    userId: null,
                    seeUserId: null,
                }
            },
        }
    },
    methods: {
        insertHeader() {
            const $header = $('#page-header');
            const data = this.$_data.userInfo;
            $header.load('/common/header_login.html', function () {
                $header.find('.easy_buy_username').html(data.name); //用戶名字
                $header.find('.header_picBox').html(`<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/${data.pic}" onerror="this.onerror=null;this.src='/img/common/loading_pc_headPic.png'">`); //用戶名字
                $('#header_loveNum').html(Effect.formatNumber(data.loveNum)); //心動
                $('#header_buyNum').html(Effect.formatNumber(data.shopCarNum)); //購物籃
                $('#header_countNum').html('MOP ' + Effect.formatNumber(data.mop)); //紅包
                $('#header_pointNum').html(Effect.formatNumber(data.integral) + ' 分'); //積分
                // easyBuy.global.hasNav && insertNavToHeader();
            });
        },
        insertSpaceInfo() {
            const $container = $('#user-info');
            const apio = this.$_data.ApiO.spaceInfo;
            apio.params.userId = this.$_data.userInfo.id;
            apio.params.seeUserId = this.$_data.URLParams.uid ? this.$_data.URLParams.uid : apio.params.userId;
            const url = Effect.methods('getRequestURL')(apio);
            $.ajax({
                url,
                method: 'GET',
                dataType: 'JSONP',
                success: (res) => {
                    const data = res['userInfo'];
                    this.$_data.spaceInfo = data;
                    const templateString = this.$_data.template['userInfo'];
                    $container.html(template.render(templateString, data));
                    const style = `body{background-image: url(//img.macaoeasybuy.com/img/userspace/test-bgimage.jpg);}.userinfo-panel{background-image: url(//img.macaoeasybuy.com/img/userspace/common/userin_1.png);}`;
                    $('head > link[rel="stylesheet"]:last').after(`<style>${style}</style>`);
                }
            });
        },
        loadIframe() {
            const iframe = document.querySelector('iframe');
            iframe.setAttribute('src', '/dynamic/index.html');
        },
        insertControl() {
            const $container = $('#left-menu');
            const templateString = this.$_data.template['leftmenu'];
            $container.html(template.render(templateString));
        },
        insertSpaceNav() {
            const $container = $('#white-menu');
            const templateString = this.$_data.template['whitemenu'];
            const apio = this.$_data.ApiO.spaceNav;
            apio.params.userId = this.$_data.userInfo.id;
            apio.params.seeUserId = this.$_data.URLParams.uid ? this.$_data.URLParams.uid : apio.params.userId;
            const url = Effect.methods('getRequestURL')(apio);
            $.ajax({
                url,
                method: 'GET',
                dataType: 'JSONP',
                success: (responseJSON) => {
                    const data = responseJSON['userSpaceCount'];
                    $container.html(template.render(templateString, data));
                    this.bindSpaceNavClick();
                },
            });
        },
        insertNewPush() {
            const $container = $('#news-push');
            const templateString = this.$_data.template['newspush'];
            $container.html(template.render(templateString));
        },
        userInfoBindClickPoint(followed, isSelf) {
            const $followsShow = $('#follows-show');
            if (followed) {
                $('#follows-btn').append('<div id="cancel-follows-btn">取消關注</div>');
                const $cancelFollowsBtn = $('#cancel-follows-btn');
                $cancelFollowsBtn[0].isClick = false;
                Effect.maskClick($followsShow, function () {
                    $cancelFollowsBtn.slideUp(200);
                });
                $followsShow.off('click');
                $followsShow.on('click', function () {
                    $(this).siblings('div').stop().slideToggle(200);
                });
                $cancelFollowsBtn.off('click');
                $cancelFollowsBtn.on('click', function () {
                    $('#user-info-focus-box').css('display', 'block');
                });
                $('#user-info-focus-box .cancel-sure').on('click', function () {
                    $('#user-info-focus-box').css('display', 'none');
                });
                $('#user-info-focus-box .sure-cancel').on('click', function () {
                    if ($cancelFollowsBtn[0].isClick) return false;
                    $cancelFollowsBtn[0].isClick = true;
                    userInfoBindoffClickPoint($cancelFollowsBtn, isSelf);
                });
            } else {
                $followsShow.off('click');
                $followsShow.on('click', function () {
                    const $this = $(this);
                    if ($this[0].isClick) {
                        return false;
                    }
                    $this[0].isClick = true;
                    userInfoBindonClickPoint($this, isSelf);
                });
            }
        },
        userInfoBindonClickPoint(self, isSelf) {
            var ipurl = 'http://userspace1.macaoeasybuy.com/';
            var easyUrl = 'http://userspace1.macaoeasybuy.com/';
            var dataUrl = easyUrl + 'userFriendsConntroller/addFriend.easy?userId=' + userId + '&attentionId=' + seeUserId + '&easybuyCallback=?';
            $.getJSON(dataUrl, function (data) {
                if (data.result != 'success') return false;
                self.html('已關注對方');
                userInfoBindClickPoint('off', isSelf);
                self[0].isClick = false;
                if ($('#user-info-success').css('display') == 'none') $('#user-info-success').fadeIn(500).delay(1000).fadeOut(500);
                if (isSelf == 0) {
                    if (fn) fn('point');
                }
            });
        },
        userInfoBindoffClickPoint(self, isSelf) {
            var ipurl = 'http://userspace1.macaoeasybuy.com/';
            var easyUrl = 'http://userspace1.macaoeasybuy.com/';
            var dataUrl = easyUrl + 'userFriendsConntroller/removeFriend.easy?userId=' + userId + '&attentionId=' + seeUserId + '&easybuyCallback=?';
            $.getJSON(dataUrl, function (data) {
                if (data.fan != 'success') return false;
                $('#follows-btn span').html('關注');
                setTimeout(function () {
                    self.remove();
                }, 200);
                userInfoBindClickPoint('on', isSelf);
                self[0].isClick = false;
                $('#user-info-focus-box').css('display', 'none');
                if (isSelf == 0) {
                    if (fn) fn('cancel');
                }
            });
        },
        bindSpaceNavClick() {
            $('#white-menu').on('click', 'li', (e) => {
                console.log(e.target);
            })
        }
    },
    resBack() {
        this.insertHeader();
        this.loadIframe();
    },
    after() {
        this.insertSpaceInfo();
        this.insertSpaceNav();
        this.insertControl();
        this.insertNewPush();
    }
});

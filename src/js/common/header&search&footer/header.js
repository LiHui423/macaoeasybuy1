(function(){
    $('header').load('/common/header.html');
})();

easyBuy.global.easyHeaderFunc = function (state) {
    state ? headerNavLoadLogin() : headerNavLoad();
}

function headerNavLoad(fr) {
    $('header').load('/common/header.html', function () {
        easyBuy.global.hasNav && insertNavToHeader();
        $('#TopMenu_LoveNum').html(window.shopCartNum);
    });
}

function headerNavLoadLogin() {
    var data = easyBuy.easyUser;
    $('header').load('/common/header_login.html', function () {
        var formatNum = easyBuy.global.dep.formatNum;
        $('header').find('.easy_buy_username').html(data.name); //用戶名字
        $('header').find('.header_picBox').html('<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/' + data.pic + '" onerror="this.onerror=null;this.src=\'/src/img/common/loading_pc_headPic.png\'">'); //用戶名字
        $('#header_loveNum').html(formatNum(data.loveNum)); //心動
        $('#header_buyNum').html(formatNum(data.shopCarNum)); //購物籃
        $('#header_countNum').html('MOP ' + formatNum(data.mop)); //紅包
        $('#header_pointNum').html(formatNum(data.integral) + ' 分'); //積分
        easyBuy.global.hasNav && insertNavToHeader();
    });
}

function insertNavToHeader() {
    //一下為導航部分
    var shopNav = '<div class="headNav_secondNav easyBuyNav" id="easyBuyNav_shop">' +
        '<div class="navBar">' +
        '<ul class="clearfloat">' +
        '<li><a href="http://www.macaoeasybuy.com/page/html/easybuy_index.html">首頁</a></li>' +
        '<li><a href="http://shopping.macaoeasybuy.com/limited/limited.html">限量搶購</a></li>' +
        '<li><a href="http://shopping.macaoeasybuy.com/findNew/new.html">發現新品</a></li>' +
        '<li><a href="http://shopping.macaoeasybuy.com/discount/discount.html">今日降價</a></li>' +
        '<li><a href="http://shopping.macaoeasybuy.com/hit/hit.html">本周熱賣</a></li>' +
        '<li><a href="http://social.macaoeasybuy.com/liveshot/liveshot.html">敗家誌</a></li>' +
        '<li><a href="http://social.macaoeasybuy.com/market/market.html">尋寶市集</a></li>' +
        '<li><a href="http://shopping.macaoeasybuy.com/gruopBuy/groupBuy.html">量販團</a></li>' +
        '<li><a href="http://shopping.macaoeasybuy.com/museum/museum.html">宜品館</a></li>' +
        '<li><a href="http://shopping.macaoeasybuy.com/exchange/exchange.html">著數換領</a></li>' +
        '<li><a href="http://social.macaoeasybuy.com/secondhand/secondHand.html">激平二手</a></li>' +
        '</ul>' +
        '</div>' +
        '</div>';

    var socialNav = '<div class="headNav_secondNav easyaLifeNav" id="easyBuyNav_social">' +
        '<div class="navBar">' +
        '<ul class="clearfloat">' +
        '<li><a href="http://social.macaoeasybuy.com/easylive/easyliveglobalgoods/globalgoods.html">全球筍貨</a></li>' +
        '<li><a href="http://social.macaoeasybuy.com/easylive/easylivewelfare/easylivewelfare.html">福利社</a></li>' +
        '<li><a href="http://social.macaoeasybuy.com/easylive/easylivebuytopic/easylivebuytopic.html">宜買話題</a></li>' +
        '<li><a href="http://social.macaoeasybuy.com/easylive/easylivelifecircle/easylivelifecircle.html">生活圈</a></li>' +
        '<li><a href="http://social.macaoeasybuy.com/easylive/easylivelog/easylivelog.html">宜粉日誌</a></li>' +
        '<li><a href="http://social.macaoeasybuy.com/easylive/easylivealbum/easylivealbum.html">宜粉專輯</a></li>' +
        '</ul>' +
        '</div>' +
        '</div>';

    var timer = null;
    var delayTime = 250;
    $('header').find('.headNavBox').prepend(shopNav + socialNav);
    $('header').find('.headNavBox_left li').hover(function () {
        clearTimeout(timer);
        var idx = $(this).index();
        switch (idx) {
            case 0:
                $('#easyBuyNav_social').stop().slideUp('fast');
                $('#easyBuyNav_shop').stop().slideDown('fast');
                break;
            case 1:
                $('#easyBuyNav_shop').stop().slideUp('fast');
                $('#easyBuyNav_social').stop().slideDown('fast');
                break;
        }
    }, function () {
        var self = $(this);
        clearTimeout(timer);
        timer = setTimeout(function () {
            var idx = self.index();
            switch (idx) {
                case 0:
                    $('#easyBuyNav_shop').stop().slideUp('fast');
                    break;
                case 1:
                    $('#easyBuyNav_social').stop().slideUp('fast');
                    break;
            }
        }, delayTime);
    });
    $('#easyBuyNav_social,#easyBuyNav_shop').hover(function () {
        clearTimeout(timer);
        $(this).stop().slideDown('fast');
    }, function () {
        $(this).stop().slideUp('fast');
    });
}

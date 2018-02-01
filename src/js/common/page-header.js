(function () {
    const $header = $('#page-header');
    if (Effect.data('isLogin')) {
        Effect.back( ()=> {
            headerNavLoadLogin(Effect.data('userInfo'));
        })
    } else {
        $header.load('/common/header.html', () => {
            // TODO: 全局没有购物篮物品数量
            $('#TopMenu_LoveNum').html(window.shopCartNum);
        });
    }

    function headerNavLoadLogin(data) {
        $header.load('/common/header_login.html', function () {
            $header.find('.easy_buy_username').html(data.name); //用戶名字
            $header.find('.header_picBox').html(`<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/${data.pic}" onerror="this.onerror=null;this.src='/img/common/loading_pc_headPic.png'">`); //用戶名字
            $('#header_loveNum').html(Effect.formatNum(data.loveNum)); //心動
            $('#header_buyNum').html(Effect.formatNum(data.shopCarNum)); //購物籃
            $('#header_countNum').html('MOP ' + Effect.formatNum(data.mop)); //紅包
            $('#header_pointNum').html(Effect.formatNum(data.integral) + ' 分'); //積分
            // easyBuy.global.hasNav && insertNavToHeader();
        });
    }

    function insertNavToHeader() {
        //一下為導航部分
        const shopNav = `
            <div class="headNav_secondNav easyBuyNav" id="easyBuyNav_shop">
                <div class="navBar">
                    <ul class="clearfloat">
                        <li><a href="http://www.macaoeasybuy.com/page/html/easybuy_index.html">首頁</a></li>
                        <li><a href="http://shopping.macaoeasybuy.com/limited/limited.html">限量搶購</a></li>
                        <li><a href="http://shopping.macaoeasybuy.com/findNew/new.html">發現新品</a></li>
                        <li><a href="http://shopping.macaoeasybuy.com/discount/discount.html">今日降價</a></li>
                        <li><a href="http://shopping.macaoeasybuy.com/hit/hit.html">本周熱賣</a></li>
                        <li><a href="http://social.macaoeasybuy.com/liveshot/liveshot.html">敗家誌</a></li>
                        <li><a href="http://social.macaoeasybuy.com/market/market.html">尋寶市集</a></li>
                        <li><a href="http://shopping.macaoeasybuy.com/gruopBuy/groupBuy.html">量販團</a></li>
                        <li><a href="http://shopping.macaoeasybuy.com/museum/museum.html">宜品館</a></li>
                        <li><a href="http://shopping.macaoeasybuy.com/exchange/exchange.html">著數換領</a></li>
                        <li><a href="http://social.macaoeasybuy.com/secondhand/secondHand.html">激平二手</a></li>
                    </ul>
                </div>
            </div>`;

        const socialNav = `
            <div class="headNav_secondNav easyaLifeNav" id="easyBuyNav_social">
                <div class="navBar">
                    <ul class="clearfloat">
                        <li><a href="http://social.macaoeasybuy.com/easylive/easyliveglobalgoods/globalgoods.html">全球筍貨</a></li>
                        <li><a href="http://social.macaoeasybuy.com/easylive/easylivewelfare/easylivewelfare.html">福利社</a></li>
                        <li><a href="http://social.macaoeasybuy.com/easylive/easylivebuytopic/easylivebuytopic.html">宜買話題</a></li>
                        <li><a href="http://social.macaoeasybuy.com/easylive/easylivelifecircle/easylivelifecircle.html">生活圈</a></li>
                        <li><a href="http://social.macaoeasybuy.com/easylive/easylivelog/easylivelog.html">宜粉日誌</a></li>
                        <li><a href="http://social.macaoeasybuy.com/easylive/easylivealbum/easylivealbum.html">宜粉專輯</a></li>
                    </ul>
                </div>
            </div>`;
        let timer = null;
        let delayTime = 250;
        $header.find('.headNavBox').prepend(shopNav + socialNav);
        $header.find('.headNavBox_left li').hover(function () {
            clearTimeout(timer);
            const idx = $(this).index();
            const $navSocial = $('#easyBuyNav_social');
            const $navShop = $('#easyBuyNav_shop');
            if (idx === 0) {
                $navSocial.stop().slideUp('fast');
                $navShop.stop().slideDown('fast');
            } else {
                $navShop.stop().slideUp('fast');
                $navSocial.stop().slideDown('fast');
            }
        }, function () {
            const self = $(this);
            clearTimeout(timer);
            timer = setTimeout(function () {
                self.index() === 0 ? $('#easyBuyNav_shop').stop().slideUp('fast') : $('#easyBuyNav_social').stop().slideUp('fast');
            }, delayTime);
        });
        $('#easyBuyNav_social, #easyBuyNav_shop').hover(function () {
            clearTimeout(timer);
            $(this).stop().slideDown('fast');
        }, function () {
            $(this).stop().slideUp('fast');
        });
    }
}());


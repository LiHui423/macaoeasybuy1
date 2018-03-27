((() => {
  const nav = window.easyBuy.global.hasNav;
  const login = window.easyBuy.isLogin;
  const oss = window.easyBuy.global.osURL;
  const link = 'http://usermanager.macaoeasybuy.com/login.html';
  let navShoppingHTMLString = '';
  let navSocialHTMLString = '';
  if (nav) {
    const shoppingPage = [
      { name: '首頁', href: 'http://www.macaoeasybuy.com/page/html/easybuy_index.html'},
      { name: '限量搶購', href: 'http://shopping.macaoeasybuy.com/limited/limited.html' },
      { name: '發現新品', href: 'http://shopping.macaoeasybuy.com/findNew/new.html' },
      { name: '今日降價', href: 'http://shopping.macaoeasybuy.com/discount/discount.html' },
      { name: '本週熱賣', href: 'http://shopping.macaoeasybuy.com/hit/hit.html' },
      { name: '敗家誌', href: 'http://social.macaoeasybuy.com/liveshot/liveshot.html' },
      { name: '尋寶市集', href: 'http://social.macaoeasybuy.com/market/market.html' },
      { name: '量販團', href: 'http://shopping.macaoeasybuy.com/gruopBuy/groupBuy.html' },
      { name: '宜品館', href: 'http://shopping.macaoeasybuy.com/museum/museum.html' },
      { name: '著數換領', href: 'http://shopping.macaoeasybuy.com/exchange/exchange.html' },
      { name: '激平二手', href: 'http://social.macaoeasybuy.com/secondhand/secondHand.html' },
    ];
    const socialPage = [
      { name: '全球筍貨', href: 'http://social.macaoeasybuy.com/easylive/easyliveglobalgoods/globalgoods.html' },
      { name: '福利社', href: 'http://social.macaoeasybuy.com/easylive/easylivewelfare/easylivewelfare.html' },
      { name: '宜買話題', href: 'http://social.macaoeasybuy.com/easylive/easylivebuytopic/easylivebuytopic.html' },
      { name: '生活圈', href: 'http://social.macaoeasybuy.com/easylive/easylivelifecircle/easylivelifecircle.html' },
      { name: '宜粉日誌', href: 'http://social.macaoeasybuy.com/easylive/easylivelog/easylivelog.html' },
      { name: '宜粉專輯', href: 'http://social.macaoeasybuy.com/easylive/easylivealbum/easylivealbum.html' },
    ];
    const shoppingLi = shoppingPage.reduce((HTMLString, page) => {
      return HTMLString + `<li><a href="${page.href}">${page.name}</a></li>`;
    }, '');
    const socialLi = socialPage.reduce((HTMLString, page) => {
      return HTMLString + `<li><a href="${page.href}">${page.name}</a></li>`;
    },'');
    navShoppingHTMLString = `
      <div class="clearfloat" style="height:0px;overflow:hidden;transition:all .2s linear;z-index:6">
        <ul class="e-container">
          ${shoppingLi}
        </ul>
      </div>
    `;
    navSocialHTMLString = `
      <div class="clearfloat" style="height:0px;overflow:hidden;transition:all .2s linear;z-index:6">
        <ul class="e-container">
          ${socialLi}
        </ul>
      </div>
    `;
  }
  const qrcode = [
    { img: '/src/img/common/header&search&footer/QR code.png', tips: '微信訂閱號' },
    { img: '/src/img/common/header&search&footer/QR code.png', tips: '微信服務號' },
    { img: '/src/img/common/header&search&footer/QR code.png', tips: '客戶端下載' },
  ];
  const qrCodeHTMLString = qrcode.reduce((HTMLString, item) => {
    return HTMLString + `<li><img src="${item.img}"><span>${item.tips}</span></li>`;
  },'');
  const headerHTMLString = `
    <div class="e-container">
      <div class="nav">
        <div class="shopping">
          <span>宜買首頁</span>
          ${navShoppingHTMLString}
        </div>
        <div class="social">
          <span>宜生活</span>
          ${navSocialHTMLString}
        </div>
      </div>
      <div class="right">
        ${
          login ?
          `<div class="user">
            <span></span>
            <ul>
              <li><img src="" class="e-avatar"></li>
              <li>個人空間</li>
              <li>成長詳情</li>
              <li>退出賬號</li>
            </ul>
          </div>
          <a href="#" data-count="">心動</a>`
          : ''
        }
        ${
          login ? ''
          : `<a href="${link}" id="login">登入</a><a :href="${link}" id="register">註冊</a>`
        }
        <a href="http://www.macaoeasybuy.com/shopCartController/ShoppingCart.easy" data-count="0" id="shopCart">購物籃</a>
        ${
          login ?
          `<a href="#" data-count="">紅包</a>
          <a href="#" data-count="">積分</a>
          <a target="_blank" href="http://userspace.macaoeasybuy.com/footprint/footprintgoods/footprintgoods.html">足跡</a>`
          : ''
        }
        <a href="#">申請開店</a>
        <div class="appdl">
          <span>APP下載</span>
          <ul style="width: 478px;">
            ${qrCodeHTMLString}
          </ul>
        </div>
      </div>
    </div>
  `;
  const header = document.querySelector('#page-header');
  header.innerHTML = headerHTMLString;
  let headerElements = {};
  if (login) {
    const easybuy = this;
    headerElements = {
      userName: header.querySelector('.user > span'),
      avatar: header.querySelector('.e-avatar'),
      xindong: header.querySelector('.right a:nth-of-type(1)'),
      gouwulan: header.querySelector('.right a:nth-of-type(2)'),
      hongbao: header.querySelector('.right a:nth-of-type(3)'),
      jifen: header.querySelector('.right a:nth-of-type(4)'),
      insert() {
        const info = window.easyBuy.easyUser;
        this.userName.innerHTML = `Hi, ${info.name}`;
        this.avatar.src = oss + info.pic;
        this.xindong.setAttribute('data-count', info.loveNum);
        this.gouwulan.setAttribute('data-count', info.shopCarNum);
        this.hongbao.setAttribute('data-count', info.mop);
        this.jifen.setAttribute('data-count', info.integral);
      },
    }
    const uiBackClock = setInterval(() => {
      if (window.easyBuy.easyUser.id) {
        clearInterval(uiBackClock);
        headerElements.insert();
      }
    }, 50);
  };
  // 購物籃商品數量查詢
  queryShopCartCount();
  function queryShopCartCount(){
    if(easyBuy.easyUser.id !== undefined){
      var dataUrl = '//shopping1.macaoeasybuy.com/shopCartController/queryNoLoginShopCartInfo/0.easy?easybuyCallback=?';
      $.getJSON(dataUrl,function(data){
        $('#shopCart').attr('data-count',data.length);
      });
    }
  }
  // 鼠標懸浮導航欄事件
  $('.shopping').mouseover(function(){
    $('.shopping>div').css('height','50px');
  })
  $('.shopping').mouseout(function(){
    $('.shopping>div').css('height','0px');
  })
  $('.social').mouseover(function(){
    $('.social>div').css('height','50px');
  })
  $('.social').mouseout(function(){
    $('.social>div').css('height','0px');
  })
  //鼠標點擊導航事件
  $('.shopping>span').on('click',function(){
    window.location.href="http://www.macaoeasybuy.com/page/html/easybuy_index.html";
  })
  $('.social>span').on('click',function(){
    window.location.href="http://social.macaoeasybuy.com/easylive/easylive.html";
  })
  // $('#login').on('click',function(){
  //   console.log('登入按鈕被點擊');
  //   document.cookie="url"+window.location.href;
  //   console.log(document.cookie);
  // })
})());

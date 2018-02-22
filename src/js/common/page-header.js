((() => {
  const nav = window.easyBuy.global.hasNav;
  const login = window.easyBuy.isLogin;
  const oss = window.easyBuy.global.osURL;
  const link = 'http://usermanager.macaoeasybuy.com/login.html';
  let navShoppingHTMLString = '';
  let navSocialHTMLString = '';
  if (nav) {
    const shoppingPage = [
      { name: '首頁', href: '#'},
      { name: '限量搶購', href: '#' },
      { name: '發現新品', href: '#' },
      { name: '今日降價', href: '#' },
      { name: '本週熱賣', href: '#' },
      { name: '敗家誌', href: '#' },
      { name: '尋寶市集', href: '#' },
      { name: '量販團', href: '#' },
      { name: '宜品館', href: '#' },
      { name: '著數換領', href: '#' },
      { name: '激平二手', href: '#' },
    ];
    const socialPage = [
      { name: '全球筍貨', href: '#' },
      { name: '福利社', href: '#' },
      { name: '宜買話題', href: '#' },
      { name: '生活圈', href: '#' },
      { name: '宜粉日誌', href: '#' },
      { name: '宜粉專輯', href: '#' },
    ];
    const shoppingLi = shoppingPage.reduce((HTMLString, page) => {
      return HTMLString + `<li><a href="${page.href}">${page.name}</a></li>`;
    }, '');
    const socialLi = socialPage.reduce((HTMLString, page) => {
      return HTMLString + `<li><a href="${page.href}">${page.name}</a></li>`;
    });
    navShoppingHTMLString = `
      <div class="hidden">
        <ul class="e-container">
          ${shoppingLi}
        </ul>
      </div>
    `;
    navSocialHTMLString = `
      <div class="hidden">
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
    return HTMLString + `<li><img src="${item.img}">${item.tips}</li>`;
  });
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
          : `<a href="${link}">登入</a><a :href="${link}">註冊</a>`
        }
        <a href="#" data-count="">購物籃</a>
        ${
          login ?
          `<a href="#" data-count="">紅包</a>
          <a href="#" data-count="">積分</a>
          <a href="http://userspace.macaoeasybuy.com/footprint/footprintgoods/footprintgoods.html">足跡</a>`
          : ''
        }
        <a href="#">申請開店</a>
        <div class="appdl">
          <span>APP下載</span>
          <ul class="hidden">
            ${qrCodeHTMLString}
          </ul>
        </div>
      </div>
    </div>
  `;
  const header = document.querySelector('#page-header');
  console.log(header);
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
  }
})());

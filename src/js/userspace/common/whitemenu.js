(function () {
  const mainFunc = function (userID, spaceID) {
    const data = [
      { name: 'AllLoveNumber', title: '心動', path: '/love', icon: 'userin_ica2' },
      { name: 'LikeNumber', title: '讃好', path: '/praise', icon: 'userin_ica3' },
      { name: 'ReleaseNumber', title: '日誌', path: '/diary', icon: 'userin_ica4' },
      { name: 'AlbumNumber', title: '專輯', path: '/album', icon: 'userin_ica5' },
      { name: 'SuitableLifeNumber', title: '生活圈', path: '/life', icon: 'userin_ica6' },
      { name: 'SentVolunteersNumber', title: '敗家誌', path: '/buy', icon: 'userin_ica7' },
      { name: 'UsedNumber', title: '二手', path: '/used', icon: 'userin_ica8' },
      { name: 'FairNumber', title: '市集', path: '/fair', icon: 'userin_ica9' },
      { name: 'LabelControlNumber', title: '標籤', path: '/label', icon: 'userin_ica10' },
      { name: 'AttentionShopNumber', title: '關注店鋪', path: '/shop', icon: 'userin_ica11' },
      { name: 'friendsandfans', title: '好友粉絲', path: '/relation', icon: 'userin_ica12' },
    ];

    // 如果是自己的空间的话会显示 动态
    userID === spaceID && data.unshift({ name: 'DynamicNumber', title: '動態', path: '/', icon: 'userin_ica1' });

    // 列表的 html
    const html = data.reduce((html, cur) => {
      const string = [
        `<li data-name="${cur.name}">`,
	      `<a href="http://userspace.macaoeasybuy.com${cur.path}/index.html?spaceid=${spaceID}">`,
		    `<div><img src="/src/img/userspace/common/leftmenu/${cur.icon}.png"></div><span>${cur.title}</span><span></span>`,
	      '</a>',
        '</li>',
      ];
      return html + string.join('');
    }, '');

    // 插入HTML
    const $container = $('#white-menu');
    $container.html(html);

    // 高亮当前选择
    const whiteNavName = easyBuy.userSpaceGlobal.whiteNavName;
    whiteNavName != null && $container.children(`[data-name="${whiteNavName}"]`).addClass('select');

    // 获取需要插入数据的节点
    const els = {};
    $container.children().each((index, el) => {
      const $el = $(el);
      const dataName = 'user' + $el.attr('data-name');
      const newCountNode = $el.find('span:last-of-type');
      els[dataName] = newCountNode;
    });

    // 向后台请求数据
    const scheme = 'http://';
    const domain = 'userspace1.macaoeasybuy.com/';
    const path = 'userSpaceIndexController/';
    const file = 'userSpaceInfoCount.easy';
    const search = `?userId=${userID}&seeUserId=${spaceID}&easybuyCallback=?`;
    const url = scheme + domain + path + file + search;
    $.getJSON(url, (res) => {
      const data = res['userSpaceCount'];
      const keys = Object.keys(data);
      keys.forEach((key) => {
        els[key].innerHTML = `共${data[key]}篇`;
      });
    });
  }

  // 检查 登录的用户ID
  const clock = setInterval(() => {
    if (easyBuy.easyUser.id != null) {
      clearInterval(clock);
      mainFunc(easyBuy.easyUser.id, easyBuy.global.pageParameter.spaceid);
    }
  });

  // function userSpaceWhiteMenu(){
  //   $('#white-menu').load('/public/whitemenu.html', function () {
  //     const $this = $(this);
  //     var aArray = $this.find('a');
  //     $.each(aArray,function(k,y){
  //      var newHref = $(y).attr('href') + '?spaceid=' + easyBuy.global.pageParameter.spaceid;
  //      $(aArray[k]).attr('href',newHref);
  //     })
  //     const whiteNavName = easyBuy.userSpaceGlobal.whiteNavName;
  //     whiteNavName !== null && $(`#white-menu li[data-name="${whiteNavName}"]`).addClass('select');
  //     const url = `http://userspace1.macaoeasybuy.com/userSpaceIndexController/userSpaceInfoCount.easy?userId=${userID}&seeUserId=${SID}&easybuyCallback=?`;
  //     $.getJSON(url, function (data) {
  //       console.log(data);
  //       $.each(data.userSpaceCount, function (key, value) {
  //         $this.find(`li[data-name=${key.split('user').join('')}]`).find('span:last-of-type').html(`共${value}篇`);
  //       })
  //     });
  //   });
  // }
	// const clock = setInterval(function(){
  //   if (easyBuy.easyUser.id !== undefined) {
  //     userID = easyBuy.easyUser.id;
  //     clearInterval(clock);
	// 		userSpaceWhiteMenu();
  //   }
  // }, 100);
})();

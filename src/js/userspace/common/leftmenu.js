(function(){
  const leftMenuData = [
    { id: 'index', icon: 'userin_ic0', text: '我的<br>首頁', },
    { id: 'easylife', icon: 'userin_ic1', text: '宜生活', },
    { id: 'setinfo', icon: 'userin_ic2', text: '個人<br>設置' },
    { id: 'sendpost', icon: 'userin_ic3', text: '發佈<br>帖子', },
    { id: 'inform', icon: 'userin_ic4', text: '通知<br>消息', },
    { id: 'peep', icon: 'userin_ic5', text: '誰來<br>偷看', },
    { id: 'findfriend', icon: 'userin_ic6', text: '查找<br>宜粉', },
  ];
  const leftMenuList = leftMenuData.reduce((string, cur) => {
    const s = `
      <li id="${cur.id}-leftmenu">
        <div><img src="/src/img/userspace/common/leftmenu/${cur.icon}.png"></div>
        <div><span>${cur.text}</span></div>
      </li>`;
    return string + s;
  }, '');
  const leftMenuHTML = `<ul>${leftMenuList}</ul>`;
  const publishData = [
    {
      id: 'userReleaseNumber',
      file: 'diary',
      icon: 'userin_ica4',
      name: '日誌',
      text: '我要發佈我的生活文',
    },
    {
      id: 'userSentVolunteersNumber',
      file: 'liveshot',
      icon: 'userin_ica7',
      name: '敗家誌',
      text: '我要發佈我的嗮單',
    },
    {
      id: 'userAlbumNumber',
      file: 'album',
      icon: 'userin_ica5',
      name: '專輯',
      text: '我要發佈我的美美圖冊',
    },
    {
      id: 'userUsedNumber',
      file: 'secondHand',
      icon: 'userin_ica8',
      name: '二手',
      text: '我要為閒置物找到好主人',
    },
    {
      id: 'userSuitableLifeNumber',
      file: 'group',
      icon: 'userin_ica6',
      name: '生活圈',
      text: '我要發佈圈中話題',
    },
    {
      id: 'userFairNumber',
      file: 'market',
      icon: 'userin_ica9',
      name: '市集',
      text: '我要擺攤出售雜貨',
    },
  ];
  const publishList = publishData.reduce((string, cur) => {
    const li = `
      <li class="clearfloat" id="${cur.id}-postclick">
        <a href="/publish/pubilsh_${cur.file}.html">
          <div><img src="/src/img/userspace/common/leftmenu/${cur.icon}.png"></div>
          <div>
            <div>${cur.name}</div>
            <div>${cur.text}</div>
            <p>他們已發佈了<span>&nbsp;</span>篇</p>
          </div>
        </a>
      </li>`;
    return string + li;
  }, '');
  const publishHTML = `
    <div id="sendpost-leftmenu-box">
      <div class="release-shadow"></div>
      <div class="release-box">
        <img src="/src/img/common/tips-box/img-upload-close.png" class="cancel-btn">
        <ul class="clearfloat">${publishList}</ul>
      </div>
    </div>`;
  const $container = $('#left-menu');
  $container.html(leftMenuHTML + publishHTML);

  // 修改活动状态
  const URL = location.pathname;
  if (URL === '/usermessage/usermessage.html') {
    $('#left-menu ul li').eq(4).children().eq(1).css('display','table');
  } else if (URL === '/personalinfo/infoset/information/information.html' || URL === '/personalinfo/infoview/information/information.html') {
    $('#left-menu ul li').eq(2).children().eq(1).css('display','table');
  }else if(URL === '/'){
    $('#left-menu ul li').eq(0).children().eq(1).css('display','table');
  }else{
    let liArray = $('#left-menu ul li');
    $.each(liArray,function(k,y){
      let id = $(y).attr('id').split('-')[0];
      if(URL.indexOf(id) !== -1){
        $($(y).children()[1]).css('display','table');
      }
    })
  }

  $('#sendpost-leftmenu')[0].flag = true;
  const $lis = $('#sendpost-leftmenu-box ul li');
  $lis.each(function () {
    const $el = $(this).find('a');
    const preHref = $el.attr('href');
    $el.attr('href', preHref + '?spaceid=' + easyBuy.global.pageParameter.spaceid);
  });
  $('#sendpost-leftmenu').on('click.post', function () {
    if ($(this)[0].flag) {
      $(this)[0].flag = false;
      const dataUrl = 'http://userspace1.macaoeasybuy.com/UserPublishController/queryUserPublishCount.easy?userId=' + userId + '&easybuyCallback=?';
      $.getJSON(dataUrl, function (data) {
        const newData = data.publishCount;
        $.each(newData, function (k, y) {
          $('#' + k + '-postclick p span').html(y);
        });
      });
    }
    $('#sendpost-leftmenu-box').css('display', 'block');
  });
  $('#sendpost-leftmenu-box img.cancel-btn').on('click', function () {
      $('#sendpost-leftmenu-box').css('display', 'none');
  });
  // 左側按鈕點擊事件
  $('#left-menu ul li').on('click',function(){
    const seeUserId = easyBuy.global.pageParameter.spaceid;
    const userId = easyBuy.easyUser.id;
    const type = $(this).attr('id').split('-')[0];
    if(type === 'index'){
      location.href = 'http://userspace.macaoeasybuy.com/?spaceid=' + userId;
    }else if(type === 'easylife'){
      location.href = 'http://social.macaoeasybuy.com/easylive/easylive.html';
    }else if(type === 'setinfo'){
      location.href = 'http://userspace.macaoeasybuy.com/personalinfo/infoset/information/information.html?spaceid=' + userId;
    }else if(type === 'inform'){
      location.href = 'http://userspace.macaoeasybuy.com/usermessage/usermessage.html?spaceid=' + userId;
    }else if(type === 'peep'){
      location.href = 'http://userspace.macaoeasybuy.com/whospeep/whospeep.html?spaceid=' + userId;
    }else if(type ==='findfriend'){
      location.href = 'http://userspace.macaoeasybuy.com/relation/findfriends/findfriends.html?spaceid=' + userId;
    }
  })
})();
//是否登录
// function checkLogin(){
// 	var url="http://userManager.macaoeasybuy.com/userInfoManagerController/checkLogin.easy?easybuyCallback=?";
// 	var frame=new FrameDomain();
// 	var href=frame.addHref(url);
// 	$.getJSON(href, function (data) {
// 		var parmae=data.Info;
// 		if(parmae!=null&&parmae!==''){
// 			// var socket = io.connect('ws://116.62.109.210:26840?token='+parmae);
// 			// //消息监听事件
//             // socket.on('MsgEvent', function (data) {
//             //     console.log(data);
//             // });
// 		}
// 	});
// }

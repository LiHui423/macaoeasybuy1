void function() {
  checkLogin();
  $('#left-menu').load('/public/leftmenu.html', function () {
    navChange();
    $('#sendpost-leftmenu')[0].flag = true;
    let li = $('#sendpost-leftmenu-box ul li');
    $.each(li,function(k,y){
        let a = $(y).find('a');
        let preHref = $(a).attr('href');
        $(a).attr('href',preHref+'?spaceid='+easyBuy.global.pageParameter.spaceid);
    })
    $('#sendpost-leftmenu').on('click.post', function () {
        if ($(this)[0].flag) {
            $(this)[0].flag = false;
            var dataUrl = 'http://userspace1.macaoeasybuy.com/UserPublishController/queryUserPublishCount.easy?userId=' + userId + '&easybuyCallback=?';
            $.getJSON(dataUrl, function (data) {
                var newData = data.publishCount;
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
        let seeUserId = easyBuy.global.pageParameter.spaceid;
        let userId = easyBuy.easyUser.id;
        let type = $(this).attr('id').split('-')[0];
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
    function navChange(){
        let url = location.href.split('?')[0];
        if(url === 'http://userspace.macaoeasybuy.com/usermessage/usermessage.html'){
            $($($('#left-menu ul li')[4]).children()[1]).css('display','table');
        }else if(url === 'http://userspace.macaoeasybuy.com/personalinfo/infoset/information/information.html' || url === 'http://userspace.macaoeasybuy.com/personalinfo/infoview/information/information.html'){
            $($($('#left-menu ul li')[2]).children()[1]).css('display','table');
        }else if(url === 'http://userspace.macaoeasybuy.com/'){
            $($($('#left-menu ul li')[0]).children()[1]).css('display','table');
        }else{
            let liArray = $('#left-menu ul li');
            $.each(liArray,function(k,y){
                let id = $(y).attr('id').split('-')[0];
                if(url.indexOf(id) !== -1){
                    $($(y).children()[1]).css('display','table');
                }
            })
        }
    }
});
}();

//是否登录
function checkLogin(){
	var url="http://userManager.macaoeasybuy.com/userInfoManagerController/checkLogin.easy?easybuyCallback=?";
	var frame=new FrameDomain();
	var href=frame.addHref(url);
	$.getJSON(href, function (data) {
		var parmae=data.Info;
		if(parmae!=null&&parmae!==''){
			// var socket = io.connect('ws://116.62.109.210:26840?token='+parmae);
			// //消息监听事件
            // socket.on('MsgEvent', function (data) {
            //     console.log(data);
            // });
		}
	});
}

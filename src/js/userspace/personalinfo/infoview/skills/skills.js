var getRequestURL = easyBuy.global.dep.getRequestURL;
easyBuy.global.startJs = function(){
	getRequestFunc(6);
	userInfoPageView();
}

//設置樣式（用戶信息按鈕加個底色）
function userInfoPageView(){
	var timer = null;
	timer = setInterval(function(){
		if($('#go-editor-userinfo').length != 0){
			clearInterval(timer);
			$('#go-editor-userinfo').addClass('select');
		}
	},1);
}
function getRequestFunc(classId){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/queryUserSetting.easy';
	var templateHtml = easyBuy.global.template['list_template'];
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId,
			classId : classId,
			seeUserId
		},
		encryptData : false
	});
	$.getJSON(dataUrl,function(data){
		data = data.settingList[0];
		data.state = easyBuy.global.isSelf ? 'mine' : 'other';
		var html = template.render(templateHtml,data);
		$('#list_box').html(html);
	});
}

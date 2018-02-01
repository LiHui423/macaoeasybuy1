var getRequestURL = easyBuy.global.dep.getRequestURL;
easyBuy.global.startJs = function(){
	getRequestFunc(3);
	getRequestFunc(4);
	getRequestFunc(5);
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
	var templateHtml = classId != 5 ? easyBuy.global.template['list_template'] : easyBuy.global.template['boring_template'];
	var state = easyBuy.global.isSelf ? 'mine' : 'other';
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
		if(classId != 5){
			data = data.settingList[0];
			data.state = state;
		}else{
			data = data.settingList[0].nextClassList[0];
			data.state = state;
			console.log(data);
		}
		var html = template.render(templateHtml,data);
		if(classId == 3){
			$('#more_love').html(html);
		}else if(classId == 4){
			$('#point_about').html(html);
		}else{
			$('#boring_box').html(html);
		}
	});
}

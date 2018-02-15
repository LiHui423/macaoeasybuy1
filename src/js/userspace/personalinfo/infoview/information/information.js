easyBuy.global.startJs = function(){
	userState(); //判斷狀態
	userInfoPageView(); //設置樣式（用戶信息按鈕加個底色）
	queryUserBasicSetting();//信息
	queryUserBasicSettingInfo(); //經歷
	queryUserDynamicInfo();//動態
	querySeeUser(); //誰來偷看
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
//判斷狀態
function userState(){
	if(!easyBuy.global.isSelf){
		$('#growth,#sentiment').remove();
	}
}
//關於
function queryUserBasicSetting(){
	var dataUrl = 'http://userspace.macaoeasybuy.com/userSettingController/queryUserBasicSetting.easy?userId='+userId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var newData = data.userBasicInfo;
		$('#user-account').html(newData.account).addClass('select');
		$('#user-name').html(newData.name).addClass('select');
		if(newData.sex == 'Boy'){
			$('#user-sex span').html('男性');
			$('#user-sex img').attr('src','/img/common/boy.png');
			$('#user-sex').addClass('boy');
		}else{
			$('#user-sex span').html('女性');
			$('#user-sex img').attr('src','/img/common/girl.png');
			$('#user-sex').addClass('girl');
		}
		if(newData.birthday){
			$('#user-birthday').html(newData.birthday).addClass('select');
		}else{
			$('#user-birthday').html('未透露');
		}
		if(newData.aboutMeList[0].choosedList.length !=0){
			$('#user-constellation').html(newData.aboutMeList[0].choosedList[0].name);
			$('#user-constellation').addClass('select');
		}else{
			$('#user-constellation').html('未透露');
		}
		if(newData.aboutMeList[1].choosedList.length != 0){
			$('#user-feelings span').html(newData.aboutMeList[1].choosedList[0].name);
			$('#user-feelings').addClass('select');
		}else{
			$('#user-feelings span').html('未透露');
		}
		easyBuy.global.isSelf ? $('.content-title span').html('我') : $('.content-title span').html(newData.name);
	});
}
	
//動態
function queryUserDynamicInfo(){
	var dataUrl = 'http://userspace.macaoeasybuy.com/userSettingController/queryUserDynamicInfo.easy?userId='+userId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var newData = data.dynamicInfo;
		$('#user-registration').html(newData.addtime); //註冊時間
		$('#user-publish').html(newData.publishtime); //上次發表
		$('#user-age span').html(newData.buyAge); //宜買年齡
		$('#user-lastlogin').html(newData.visittime); //最後訪問
		$('#user-login span').html(newData.cumulativetime); //在線時間
		$('#user-update').html(newData.uptime); //更新資料
	});
}
//誰來偷看
function querySeeUser(){
	var dataUrl = 'http://userspace.macaoeasybuy.com/userSettingController/querySeeUser.easy?userId='+userId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var newData = data.seeUserList;
		if(newData.length == 0){
			$('#whos-look-me').html('<div>暫時沒人看過您的信息！</div>');
			return false;
		}
		for(var i=0;i<newData.length;i++){
			var li = '<li data-id="'+newData[i].id+'"><img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData[i].pic+'" alt=""></li>';
			$('#whos-look-me').append(li);
		}
		li = null;
	});
}
//經歷
function queryUserBasicSettingInfo(){
	var classId = 2;
	var dataUrl = 'http://userspace.macaoeasybuy.com/userSettingController/queryUserSetting.easy?userId='+userId+'&classId='+classId+'&easybuyCallback=?'
	$.getJSON(dataUrl,function(data){
		var myArr = [];
		var newData = data.settingList[0];
		for(var i=0;i<newData.nextClassList.length;i++){
			myArr.push(newData.nextClassList[i]);
		}
		for(var i=0;i<myArr.length;i++){
			for(var j=0;j<myArr[i].choosedList.length;j++){
				if(myArr[i].choosedList[j].name == '其他'){
					myArr[i].choosedList.push(myArr[i].choosedList[j]);
					myArr[i].choosedList.splice(j,1);
				}
			}
		}
		for(var i=0;i<myArr.length;i++){
			if(myArr[i].choosedList.length > 1){
				var listHtml = '';
				for(var j=0;j<myArr[i].choosedList.length;j++){
					listHtml += '<div>'+myArr[i].choosedList[j].name+'</div>';
				}
				var boxhtml = '<div class="other-list"><img src="/src/img/userspace/personalinfo/arrow.png" alt="" class="arrow"><div class="other-lister scrollIe scrollOther">'+listHtml+'</div></div>';
			}
			switch(i){
				case 0:
					if(myArr[i].choosedList.length > 1) $('#user-experience').append(boxhtml);
					addShowData($('#user-experience'),myArr[i]);
				break;
				case 1:
					if(myArr[i].choosedList.length > 1) $('#user-achievement').append(boxhtml);
					addShowData($('#user-achievement'),myArr[i]);
				break;
				case 2:
					if(myArr[i].choosedList.length > 1) $('#user-happiness').append(boxhtml);
					addShowData($('#user-happiness'),myArr[i]);
				break;
				case 3:
					if(myArr[i].choosedList.length > 1) $('#user-wantgo').append(boxhtml);
					addShowData($('#user-wantgo'),myArr[i]);
				break;
			}
			if(myArr[i].length > 1){
				listHtml = null;
				boxhtml = null;
			}
		}
	});
	function addShowData(obj,arr){
		var html = '';
		if(arr.choosedList.length == 0){
			html = '未透露'
		}else if(arr.choosedList.length == 1){
			obj.addClass('select');
			html = arr.choosedList[0].name;
		}else{
			obj.addClass('select');
			html = arr.choosedList[0].name+'...';
		}
		obj.find('span').html(html);
	}
}

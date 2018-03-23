easyBuy.global.startJs = function(){
	getBaseInfoData(); //獲取用戶的基本信息
	changeHeadImg(); //更換頭像
	changeCoverImg(); //更換封面
	changebgImg(); //更換背景
	changePhoneNum(); //更換手機號碼
	areaSelect(); //選擇收貨區域
	timeSelect(); //選擇收貨時間
	userNameListen(); //監聽姓名輸入框
	areaInfoListen(); //監聽收貨地址輸入框
	submitAllInfo(); //提交按鈕
}
var justNumInput  = easyBuy.global.dep.justNumInput;
var baseInfo = new Object();
var seeUserId = easyBuy.global.pageParameter.spaceid;
function getBaseInfoData(){
var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/queryUserReceive.easy?userId='+userId+'&seeUserId='+seeUserId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var newData = data.userReceive;
		//進度條
		changeProgress(
			$('#receiving-data .info-progress'),
			$('#receiving-data .info-progress div'),
			$('#receiving-data .info-progress span').eq(0),
			$('#receiving-data .info-progress span').eq(1),
			newData.complete,
			newData.total
		);
		//聯繫電話
		$('#contact-phone .phone-num').html(newData.phone);
		//聯繫姓名
		$('#contact-name input').val(newData.realName);
		//收貨區域
		if(newData.addressArea){
			$('#receiving-area .select-btn span').html(newData.addressArea);
			$('#receiving-area .select-btn').addClass('select');
		}else{
			$('#receiving-area .select-btn span').html('請選擇');
		}
		$('#receiving-area .select-btn img').css('visibility','visible');
		//收貨地址
		$('#receiving-address').val(newData.address ? newData.address : '');
		//收貨時段
		if(newData.receiveDay){
			$('#receiving-time .receiving-time-btn.first .select-btn span').html(newData.receiveDay);
			$('#receiving-time .receiving-time-btn.first .select-btn').addClass('select');
		}else{
			$('#receiving-time .receiving-time-btn.first .select-btn span').html('請選擇');
		}
		if(newData.receiveTime){
			$('#receiving-time .receiving-time-btn.second .select-btn span').html(newData.receiveTime);
			$('#receiving-time .receiving-time-btn.second .select-btn').addClass('select');
		}else{
			$('#receiving-time .receiving-time-btn.second .select-btn span').html('請選擇');
		}
		$('#receiving-time .select-btn img').css('visibility','visible');
		baseInfo = {
			phone : newData.phone || '',
			name : newData.realName || '',
			addressArea : newData.addressArea || '',
			address : newData.address || '',
			data : newData.receiveDay || '',
			time : newData.receiveTime || ''
		}
	});
}
//進度條使用函數
function changeProgress(box,progress,firstEle,secondEle,now,max){
	firstEle[0].num = now;
	secondEle[0].num = max;
	firstEle.html(now);
	secondEle.html(max);
	progress.css('width',now / max * 100 + '%');
	box.css('visibility','visible');
}
//更換頭像
function changeHeadImg() {
	$('#head-img .change-btn').on('click', function() {
		$('#change-head-img').css('display', 'block');
	});
	$('#change-head-img .box-btn').each(function(k) {
		$(this).on('click', function() {
			$(this).siblings('.box-btn').removeClass('select').end().addClass('select');
			if(k == 0) {
				$('#change-head-img .box-content').eq(1).siblings('.box-content').removeClass('select').end().addClass('select');
			} else {
				$('#change-head-img .box-content').eq(0).siblings('.box-content').removeClass('select').end().addClass('select');
			}
		});
	});
	$('#change-head-img .box-content.select-page .select-nav div').each(function(k) {
		$(this).on('click', function() {
			$(this).siblings('div').removeClass('select').end().addClass('select');
			$('#change-head-img .box-content.select-page .pages ul').eq(k).siblings('ul').removeClass('select').end().addClass('select');
		});
	});
	$('#change-head-img .box-content.select-page .pages ul li').each(function() {
		$(this).on('click', function() {
			$('#change-head-img .box-content.select-page .pages ul li').removeClass('select');
			$(this).addClass('select');
		});
	});
	$('#change-head-cancel,#change-head-cancel-s').on('click', function() {
		$('#change-head-img').css('display', 'none');
	});
}
//更換封面
function changeCoverImg() {
	$('#cover-img .change-btn').on('click', function() {
		$('#change-cover-img').css('display', 'block');
	});
	$('#change-cover-img .box-btn').each(function(k) {
		$(this).on('click', function() {
			$(this).siblings('.box-btn').removeClass('select').end().addClass('select');
			if(k == 0) {
				$('#change-cover-img .box-content').eq(1).siblings('.box-content').removeClass('select').end().addClass('select');
			} else {
				$('#change-cover-img .box-content').eq(0).siblings('.box-content').removeClass('select').end().addClass('select');
			}
		});
	});
	$('#change-cover-img .box-content.select-page .select-nav div').each(function(k) {
		$(this).on('click', function() {
			$(this).siblings('div').removeClass('select').end().addClass('select');
			$('#change-cover-img .box-content.select-page .pages ul').eq(k).siblings('ul').removeClass('select').end().addClass('select');
		});
	});
	$('#change-cover-img .box-content.select-page .pages ul li').each(function() {
		$(this).on('click', function() {
			$('#change-cover-img .box-content.select-page .pages ul li').removeClass('select');
			$(this).addClass('select');
		});
	});
	$('#change-cover-cancel,#change-cover-cancel-s').on('click', function() {
		$('#change-cover-img').css('display', 'none');
	});
}
//更換背景
function changebgImg() {
	$('#bg-img .change-btn').on('click', function() {
		$('#change-bg-img').css('display', 'block');
	});
	$('#change-bg-cancel').on('click', function() {
		$('#change-bg-img').css('display', 'none');
	});
	$('#change-bg-img .select-box ul li').each(function() {
		$(this).on('click', function() {
			$(this).siblings('li').removeClass('select').end().addClass('select');
		});
	});
}
//更換號碼
function changePhoneNum() {
	$('#contact-phone .phone-num-change').on('click', function() {
		$('#change-num-box').css('display', 'block');
	});
	$('#change-num-box .change-num-box img.cancel-btn').on('click', function() {
		$('#change-num-box').css('display', 'none');
	});
	$('#get-code-btn')[0].flag = false;
	$('#change-num-sure-btn')[0].flag = false;
	//監聽手機輸入框
	justNumInput('get-code-phone',function(str){
		$(this).val(str.replace(/[^\d]/g,''));
		var flag =  /^6[0-9]\d{6}$/.test(str);
		if(flag){
			$('#get-code-btn').addClass('select');
			$('#get-code-btn')[0].flag = true;
			window.baseInfo.phone = str;
		}else{
			$('#get-code-btn').removeClass('select');
			$('#get-code-btn')[0].flag = false;
		}
	});
	//獲取驗證碼按鈕
	$('#get-code-btn').on('click',function(){
		if(!$(this)[0].flag) return false;
		var self = $(this);
		$(this)[0].flag = false;
		
		var str = '';
		var texts = '';
		var phone = window.baseInfo.phone;
		var type = '';
		
		var dataUrl = 'http://118.190.114.118:8080/yez_sendTextMessages/messagesConterllor/sendMesgs.easy?str='+str+'&text='+texts+'&phone='+phone+'&type='+type+'&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			console.log(data);
			self[0].flag = true;
		});
	});
	//提交修改信息
	$('#change-num-sure-btn').on('click',function(){
		if(!$(this)[0].flag) return false;
		var self = $(this);
		$(this)[0].flag = false;
		
		var phone = window.baseInfo.phone;
		var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/updateUserPhone.easy?phone='+phone+'&userId='+userId+'&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			console.log(data);
			self[0].flag = true;
		});
	});
	
}
//地區選擇
function areaSelect() {
	$('#receiving-area .select-btn')[0].flag = true;
	$('#receiving-area .select-btn').on('click',function(){
		if($(this)[0].flag){
			getAreaSelectData($(this));
		}else{
			$('#receiving-area .receiving-area-selecter').css('display','block');
		}
	});
	$('#receiving-area .shadow-box').on('click',function(){
		$('#receiving-area .receiving-area-selecter').css('display','none');
	});
	function getAreaSelectData(obj){
		obj[0].flag = false;
		var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/queryReceivePlace.easy?easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			var newData = data.placeList;
			var html = '';
			$.each(newData, function(k,y) {
				html += '<li>'+y.str+'</li>';
			});
			$('#receiving-area ul').append(html);
			$('#receiving-area ul li').each(function(k){
				$(this).data('data',{
					name : newData[k].str
				});
				$(this).on('click',function(){
					$('#receiving-area .select-btn span').html($(this).data('data').name);
					window.baseInfo.addressArea = $(this).data('data').name;
					$('#receiving-area .select-btn').addClass('select');
					$('#receiving-area .receiving-area-selecter').css('display','none');
				});
			});
			$('#receiving-area .receiving-area-selecter').css('display','block');
		});
	}
}
//時間選擇
function timeSelect(){
	$('#receiving-time .select-btn').each(function(k){
		$(this)[0].flag = true;
		$(this).on('click',function(){
			if($(this)[0].flag){
				getTimeSelectData($(this),k);
			}else{
				$('#receiving-time .receiving-time-box').css('display','none');
				$(this).next().css('display','block');
				$('#receiving-time .shadow-box').css('display','block');
			}
		});
	});
	$('#receiving-time .shadow-box').on('click',function(){
		$(this).css('display','none');
		$('#receiving-time .receiving-time-box').css('display','none');
	});
	$('#receiving-time .receiving-time-btn .receiving-time-box .ul-box li').on('click',function(){
		var a = $(this).parents('.receiving-time-box');
		a.prev().find('span').html($(this).html());
		a.prev().addClass('select');
		$('#receiving-time .shadow-box').css('display','none');
		$('#receiving-time .receiving-time-box').css('display','none');
	});
	function getTimeSelectData(obj,idx){
		obj[0].flag = false;
		switch(idx){
			case 0:
				var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/queryReceiveDate.easy?easybuyCallback=?';
			break;
			case 1:
				var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/queryReceiveTime.easy?easybuyCallback=?';
			break;
		}
		$.getJSON(dataUrl,function(data){
			var newData = data.timeList;
			var html = '';
			
			$.each(newData, function(k,y) {
				html += '<li>'+y.str+'</li>';
			});
			$('#receiving-time .receiving-time-btn').eq(idx).find('ul').html(html);
			$('#receiving-time .receiving-time-btn').eq(idx).find('ul li').each(function(k){
				$(this).data('data',{
					name : newData[k].str
				});
				$(this).on('click',function(){
					var a = $(this).parents('.receiving-time-box');
					a.prev().find('span').html($(this).data('data').name);
					switch(idx){
						case 0:
							window.baseInfo.data = $(this).data('data').name;
						break;
						case 1:
							window.baseInfo.time = $(this).data('data').name;
						break;
					}
					a.prev().addClass('select');
					$('#receiving-time .shadow-box').css('display','none');
					$('#receiving-time .receiving-time-box').css('display','none');
				});
			});
			$('#receiving-time .receiving-time-box').css('display','none');
			obj.next().css('display','block');
			$('#receiving-time .shadow-box').css('display','block');
		});
	}
}
//監聽姓名輸入框
function userNameListen(){
	var inputObj = $('#contact-name input');
	inputObj.on('keyup',function(){
		window.baseInfo.name = $(this).val();
	});
}
//監聽收貨地址輸入框
function areaInfoListen(){
	var inputObj = $('#receiving-address');
	inputObj.on('keyup',function(){
		window.baseInfo.address = $(this).val();
	});
}
//提交按鈕
function submitAllInfo(){
	$('#submit-btn')[0].flag = true;
	$('#submit-btn').on('click',function(){
		if(!$('#submit-btn')[0].flag) return false;
		$('#submit-btn')[0].flag = false;
		var baseData = window.baseInfo;
		var realName = baseData.name;
		var AddressArea = baseData.addressArea;
		var Address = baseData.address;
		var receiveDay = baseData.data;
		var receiveTime = baseData.time;
		var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/updateUserReceive.easy?userId='+userId+'&realName='+realName+'&AddressArea='+AddressArea+'&Address='+Address+'&receiveDay='+receiveDay+'&receiveTime='+receiveTime+'&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			if(data.status != 'success') return false;
			$('#praise-post').css('display','block');
			$('#praise-post').fadeIn(500).delay(1000).fadeOut(500);
			$('#submit-btn')[0].flag = true;
		});
	});
}

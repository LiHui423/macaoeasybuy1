var getBeforeDate = easyBuy.global.dep.getBeforeDate;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var getRequestURL = easyBuy.global.dep.getRequestURL;
var globalObj = {};
var selectObj;
easyBuy.global.startJs = function(){
	globalObj.sexType = 0;
	globalObj.dataSize = 30;
	globalObj.dataPage = 0;
	dateFunc();
	sexSelect();
	focusBindEvent(); //添加關注，取消關注辦定事件
}
//日曆
function dateFunc(){
	var newDate = getBeforeDate(0);
	var oldDate = getBeforeDate(7);
	globalObj.beginDate = oldDate;
	globalObj.finalDate = newDate;
	requestData();
	new pickerDateRange('date-select-btn',{
		startDate:newDate,
		endDate:oldDate,
		defaultText : ' - ',
		calendars:1,
		startToday:false,
		stopToday:true,
		autoSubmit:true,
//		monthRangeMax:1,
		defaultText: ' - ',
		isClickCancel:true,
		success:function(obj){
			globalObj.beginDate = obj.startDate;
			globalObj.finalDate = obj.endDate;
			globalObj.dataPage = 0;
			requestData();
		}
	});
}
//性別選擇
function sexSelect(){
	$('#sex-select div').on('click',function(){
		if($(this).hasClass('select')) return false;
		$(this).siblings('div').removeClass('select').end().addClass('select');
		switch($(this).index()){
			case 0:
				globalObj.sexType = 0;
			break;
			case 1:
				globalObj.sexType = 2;
			break;
			case 2:
				globalObj.sexType = 1;
			break;
		}
		globalObj.dataPage = 0;
		requestData();
	});
}
//請求列表數據
function requestData(){
//	var dataUrl = 'http://userspace1.macaoeasybuy.com/seeController/queryWhoSeeMe.easy';
	var dataUrl = 'http://userspace1.macaoeasybuy.com/seeController/queryWhoSeeMe.easy';
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId,
			beginDate : globalObj.beginDate,
			finalDate : globalObj.finalDate,
			type : globalObj.sexType,
			size : globalObj.dataSize,
			page : globalObj.dataPage,
			order : 'uptime',
			descOrAsc : 'desc'
		},
		encryptData : false
	});
	var userListTemplate = easyBuy.global.template['user-list-template'];
	var userTemplate = easyBuy.global.template['user-template'];
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			easyScrollRequest('off','requestList',$(window));
			if(globalObj.dataPage == 0){
				$('#data-box').html('');
				globalObj.lastSaveDate = '';
				$('.data-show .no_more').css('display','none');
			}
		},
		success:function(data){
			var data = {
				seeFoot : data.result
			}
			var thisSize = 0;
			for(var i=0;i<data.seeFoot.length;i++){
				thisSize += data.seeFoot[i].count
			}
			if(data.seeFoot != undefined && data.seeFoot.length != 0){
				var lastDataTime = data.seeFoot[0].uptime;
				if(lastDataTime == globalObj.lastSaveDate){
					$('#data-box>ul:last-of-type').append(
						template.render(userListTemplate,data.seeFoot[0])
					);
					var a = {
						seeFoot:[]
					}
					for(var i=1;i<data.seeFoot.length;i++){
						a.seeFoot[i-1] = data.seeFoot[i];
					}
					if(data.seeFoot.length>1){
						$('#data-box').append(
							template.render(userTemplate,a)
						);
					}
				}else{
					$('#data-box').append(
						template.render(userTemplate,data)
					);
				}
				easyScrollRequest('on','requestList',$(window),$(document),function(){
					requestData();
				});
				globalObj.lastSaveDate = data.seeFoot[data.seeFoot.length - 1].uptime;
				globalObj.dataPage += 1;
				//辦定數據、辦定取消關注，添加關注事件
				$.each(data.seeFoot, function(k,y) {
					$.each(y.seeList,function(m,n){
						$('.data_timeList[data-id='+n.id+']').data('data',n).find('.focus-on').on('click',function(){
							var parent = $(this).parents('.data_timeList');
							var isFocus = parent.data('data').isFocus;
							var id = parent.data('data').id;
							if(isFocus == 0){
								//已關注  取消關注
								selectObj = parent;
								$('.cancelFocus_tips_box').css('display','block');
							}else{
								//未關注    添加關注
								focusRequest(1,id,function(){
									parent.data('data').isFocus = 0;
									parent.find('.focus-on').removeClass('noFocus').addClass('isFocus');
									focusScuess();
								});
							}
						})
					});
				});
			}
			if(thisSize < globalObj.dataSize){
				$('.data-show .no_more').css('display','block');
			}
			if(data.seeFoot.length == 0 && globalObj.dataPage == 0){
				var html = '<div class="no-speep"><img src="/img/common/05.png" alt=""><div>暫時還沒有人來偷看你！</div></div>';
				$('#data-box').html(html);
				$('.data-show .no_more').css('display','none');
			}
		}
	});
}
//添加關注，取消關注辦定事件
function focusBindEvent(){
	var box = $('.cancelFocus_tips_box');
	var sureBtn = box.find('.sure-cancel');
	var cancelBtn = box.find('.cancel-sure');
	sureBtn.on('click',function(){
		var id = selectObj.data('data').id;
		var obj = $('.data_timeList[data-id='+id+']');
		focusRequest(0,id,function(){
			box.css('display','none');
			obj.data('data').isFocus = 1;
			obj.find('.focus-on').removeClass('isFocus').addClass('noFocus');
		});
	});
	cancelBtn.on('click',function(){
		box.css('display','none');
	});
}
//關注成功彈框提示
function focusScuess(){
	var tips = $('.focus_success_tips_box');
	if(tips.css('display') == 'none'){
		tips.fadeIn(500).delay(1000).fadeOut(500);
	}
}
//添加關注、取消關注請求
function focusRequest(state,attentionId,fn){
	var dataUrl;
	if(state == 1){
		//關注
		dataUrl = 'http://userspace1.macaoeasybuy.com/userFriendsConntroller/addFriend.easy';
	}else{
		//取消關注
		dataUrl = ' http://userspace1.macaoeasybuy.com/userFriendsConntroller/removeFriend.easy';
	}
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId,
			attentionId : attentionId
		},
		encryptData : true
	});
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var result = state == 1 ? data.result : data.fan;
			if(result == 'success') fn&&fn(data);
		}
	});
}

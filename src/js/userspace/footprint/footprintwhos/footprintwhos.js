var getBeforeDate = easyBuy.global.dep.getBeforeDate;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var getRequestURL = easyBuy.global.dep.getRequestURL;
var globalObj = {};
easyBuy.global.startJs = function(){
	globalObj.sexType = 0;
	globalObj.dataSize = 50;
	globalObj.dataPage = 0;
	dateFunc();
	sexSelect();
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
function requestData(){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userFootprintsController/querySeeFootPrints.easy';
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
				$('.data-show .no-more').css('display','none');
			}
		},
		success:function(data){
			console.log(data);
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
			}
			if(thisSize < globalObj.dataSize){
				$('.data-show .no-more').css('display','block');
			}
			if(data.seeFoot.length ==0 && globalObj.dataPage == 0){
				var html = '<div id="no-post"><div><img src="/src/img/common/05.png" alt=""></div><span>目前沒有任何內容哦!</span></div>';
				$('#data-box').html(html);
				$('.data-show .no-more').css('display','none');
			}
		}
	});
}

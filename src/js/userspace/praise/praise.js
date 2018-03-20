var requestObj = {
	type : 7, //請求的類型
	size : 20, //請求的數量
	typeList : [
		{type:1, page:0, isComplete:false, order:'uptime', isFirst:true, count:-1, template:'praise_album_template', box:'praise_album_box'}, //專輯
		{type:2, page:0, isComplete:false, order:'uptime', isFirst:true, count:-1, template:'praise_label_template', box:'praise_label_box'}, //標籤
		{type:3, page:0, isComplete:false, order:'uptime', isFirst:true, count:-1, template:'praise_topic_template', box:'praise_topic_box'}, //話題
		{type:4, page:0, isComplete:false, order:'uptime', isFirst:true, count:-1, template:'praise_welfare_template', box:'praise_welfare_box'}, //福利社
		{type:5, page:0, isComplete:false, order:'uptime', isFirst:true, count:-1, template:'praise_liveshot_template', box:'praise_liveshot_box'}, //敗家誌
		{type:6, page:0, isComplete:false, order:'uptime', isFirst:true, count:-1, template:'praise_group_template', box:'praise_group_box'}, //生活圈
		{type:7, page:0, isComplete:false, order:'uptime', isFirst:false, count:-1, template:'praise_diary_template', box:'praise_diary_box'}, //日誌
		{type:8, page:0, isComplete:false, order:'uptime', isFirst:true, count:-1, template:'praise_secondHand_template', box:'praise_secondHand_box'} //二手
	]
}
var maskClick = easyBuy.global.dep.maskClick;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var formatNum = easyBuy.global.dep.formatNum;
var waterfall = easyBuy.global.dep.waterfall;

easyBuy.global.startJs = function(){
	praiseSlide();
	sortSelect();
	requestGetData();
};
//下拉選擇
function praiseSlide(){
	$(".praise_filterBox_name_show").click(function(){
		var checkBox = $(this).parents('.praise_filterBox_name').find(".praise_filterBox_slide")
		if(checkBox.hasClass("hideSlide")){
			checkBox.stop(true,true).slideDown('fast').removeClass("hideSlide");
		}else{
			checkBox.stop(true,true).slideUp("fast").addClass("hideSlide");
		}
	});
	$(".praise_filterBox_slide ul li").click(function(){
		var index = $(this).index();
		var flag = $(this).hasClass('praise_filterBox_slide_curr');
		$(".praise_filterBox_slide").slideUp('fast').addClass("hideSlide");
		if($(this).hasClass('praise_filterBox_slide_curr')) return false;
		$(this).addClass("praise_filterBox_slide_curr").siblings("li").removeClass("praise_filterBox_slide_curr");
		$(".praise_filterBox_name_show span:nth-of-type(2)").text($(this).text());
		$('.praise_tabBox').find('.praise_tabEach').eq($(this).index()).show().siblings().hide();
		switch(index){
			case 0:
				requestObj.type = 7; //日誌
			break;
			case 1:
				requestObj.type = 1; //專輯
			break;
			case 2:
				requestObj.type = 6; //生活圈
			break;
			case 3:
				requestObj.type = 5; //敗家誌
			break;
			case 4:
				requestObj.type = 8; //二手
			break;
			case 5:
				requestObj.type = 4; //福利社
			break;
			case 6:
				requestObj.type = 3; //話題
			break;
			case 7:
				requestObj.type = 2; //標籤
			break;
		}
		var requestObjItem =  requestObj.typeList[requestObj.type-1];
		var order = requestObjItem.order;
		if(order == 'uptime'){
			$('.praise_filterBox_right ul li').eq(0).addClass('praise_filterBox_right_curr').siblings().removeClass('praise_filterBox_right_curr');
		}else if(order == 'commentCount'){
			$('.praise_filterBox_right ul li').eq(1).addClass('praise_filterBox_right_curr').siblings().removeClass('praise_filterBox_right_curr');
		}else{
			$('.praise_filterBox_right ul li').eq(2).addClass('praise_filterBox_right_curr').siblings().removeClass('praise_filterBox_right_curr');
		}
		if(requestObjItem.isFirst){
			requestObjItem.isFirst = false;
			requestGetData();
			$('.praise_filterBox_right ul li').eq(0).addClass('praise_filterBox_right_curr').siblings().removeClass('praise_filterBox_right_curr');
		}
		if(requestObjItem.count != -1) $('#praise_filterBox_num span').html(formatNum(requestObjItem.count));
	});
	maskClick($('.praise_filterBox_slide ul,.praise_filterBox_name_show'),function(){
		$(".praise_filterBox_slide").slideUp('fast').addClass("hideSlide");
	},'praiseSelect');
}

//排序選擇
function sortSelect(){
	$('.praise_filterBox_right ul li').on('click',function(){
		if($(this).hasClass('praise_filterBox_right_curr')) return false;
		var index = $(this).index();
		$(this).addClass('praise_filterBox_right_curr').siblings().removeClass('praise_filterBox_right_curr');
		var order = '';
		switch(index){
			case 0:
				order = 'uptime';
			break;
			case 1:
				order = 'commentCount';
			break;
			case 2:
				order = 'loveCount';
			break;
		}
		var item = requestObj.typeList[requestObj.type-1];
		item.page = 0;
		item.isComplete = false;
		item.order = order;
		$('#'+item.box).parents('.dynamic_mainBox').siblings('.no-more').css('display','none');
		requestGetData();
		item = null;
	});
}


//請求函數
function requestGetData(){
	easyScrollRequest('off','praise',$(window));
	var request = requestObj;
	var type = request.type; //1（專輯），2（標籤），3（話題），4（福利社），5（敗家志），6（生活圈），7（日誌），8（二手）
	var size = request.size;
	var simpleRequest = request.typeList[type-1];
	var page = simpleRequest.page;
	var order = simpleRequest.order; //uptime(發佈時間)，commentCount(評論數)。loveCount(贊好數)
	var isComplete = simpleRequest.isComplete;
	var count = simpleRequest.count;
	var dataUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/queryLike.easy?page='+page+'&size='+size+'&order='+order+'&userId='+userId+'&seeUserId='+easyBuy.global.pageParameter.spaceid+'&type='+type+'&easybuyCallback=?';
	var templateId = simpleRequest.template;
	var boxId = simpleRequest.box;
	var templateHtml = easyBuy.global.template[templateId];
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			if(isComplete) return false;
		},
		success:function(data){
			console.log(data);
			var data = data.result;
			var resLen = data.returnList.length;
			data.page = page;
			if(count == -1){
				simpleRequest.count = data.count;
				$('#praise_filterBox_num span').html(formatNum(data.count));
			}
			var resHtml = template.render(templateHtml,data);
			page != 0 ? $('#'+boxId).append(resHtml) : $('#'+boxId).html(resHtml);
			if(type != 3 && type !=4 && type != 1 && type != 2) waterfall($('#'+boxId),$('#'+boxId+' .praise_item_box'),4,4,0,true); 
			simpleRequest.page++;
			if(resLen == size){
				easyScrollRequest('on','praise',$(window),$(document),function(){
					requestGetData();
				});
			}else{
				easyScrollRequest('off','praise',$(window));
				simpleRequest.isComplete = true;
			}
			if(resLen != 0 || page != 0) $('#'+boxId).parents('.dynamic_mainBox').siblings('.no-more').css('display','block');
		}
	});
}

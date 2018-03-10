easyBuy.global.startJs = function(){
	userloveType();
	userloveSort();
	queryUserLoveNum(); //用戶心動數量分類統計
	queryUserLoveDetial(); //用戶心動商品、帖子查看接口
	cancelLoveFunc(); //取消心動綁定事件，發出請求
}
var getRequestURL = easyBuy.global.dep.getRequestURL;
// var formatNum = easyBuy.global.dep.formatNum;
var waterfall = easyBuy.global.dep.waterfall;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var diffTime = easyBuy.global.dep.diffTime;

var requestObj = {
	easyState : easyBuy.global.isSelf ? 1 : 0, //看自己1    還是看他人 0
	size : 16,
	loveList : [], //心動選擇的Id
	selfLove : true,
	selectType : 'groupBuy',
	groupBuy : {sort : 'uptime', page : 0, isComplete : false, boxId:'groupBuy_box', templateId:'groupBuy_template', isFirst:true, inlineNum : 4}, //量販團
	limited :{sort : 'uptime', page : 0, isComplete : false, boxId:'limited_box', templateId:'limited_template', isFirst:true, inlineNum : 4}, //限量搶購
	discount : {sort : 'uptime', page : 0, isComplete : false, boxId:'discount_box', templateId:'discount_template', isFirst:true, inlineNum : 4}, //降價商品
	exchange : { sort : 'uptime', page : 0, isComplete : false, boxId:'exchange_box', templateId:'exchange_template', isFirst:true, inlineNum : 3}, //著數換領
	museum : {sort : 'uptime', page : 0, isComplete : false, boxId:'museum_box', templateId:'museum_template', isFirst:true, inlineNum : 4}, //宜品館
	fair : {sort : 'uptime', page : 0, isComplete : false, boxId:'fair_box', templateId:'fair_template', isFirst:true, inlineNum : 4}, //市集
	other : {sort : 'uptime', page : 0, isComplete : false, boxId:'other_box', templateId:'other_template', isFirst:true, inlineNum : 4} //其他商品
}
//用戶心動商品、帖子查看接口
function queryUserLoveDetial(){
	var type = requestObj.selectType;// groupBuy
	var requestData = requestObj[type];// obj
	var size = requestObj.size;//16
	var templateHtml = easyBuy.global.template[requestData.templateId];
	var box = $('#' + requestData.boxId + ' .userlove_mainEach_inner');
	var page = requestData.page;
	var order = requestData.sort;
	var isComplete = requestData.isComplete;
	var inlineNum = requestData.inlineNum;
	requestData.isFirst&&(requestData.isFirst = false);
	var dataUrl;
	if(type == 'groupBuy'){
		dataUrl = 'http://userspace1.macaoeasybuy.com/userLoveConntroller/queryUserTuanShangPin.easy';
	}else if(type == 'limited'){
		dataUrl = 'http://userspace1.macaoeasybuy.com/userLoveConntroller/queryUserXianShangPin.easy';
	}else if(type == 'discount'){
		dataUrl = 'http://userspace1.macaoeasybuy.com/userLoveConntroller/queryUserCutLoveShangPin.easy';
	}else if(type == 'exchange'){
		dataUrl = 'http://userspace1.macaoeasybuy.com/userLoveConntroller/queryUserChangeLoveShangPin.easy';
	}else if(type == 'museum'){
		dataUrl = 'http://userspace1.macaoeasybuy.com/userLoveConntroller/queryUserYiShangPin.easy';
	}else if(type == 'fair'){
		dataUrl = 'http://userspace1.macaoeasybuy.com/userLoveConntroller/queryUserFairLoveShangPin.easy';
	}else if(type == 'other'){
		dataUrl = 'http://userspace1.macaoeasybuy.com/userLoveConntroller/queryUserOtherLoveShangPin.easy';
	}
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId,
			size : size,
			page : page,
			order : order //uptime(心動時間)，salecount(銷量),lovecount(心動數量)，nowprice(當前價格),seecount(按查看數)
		},
		encryptData : true
	});
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		cache: requestObj.easyState == 1 ? false : true,
		success:function(data){
			if(type == 'groupBuy'){
				data = groupBuyDataFilter(data);
			}
			if(type == 'fair'){
				data = fairDataFilter(data);
			}
			data.page = page;
			data.easyState = requestObj.easyState;
			var len = data.result.length;
			var html = template.render(templateHtml,data);
			page != 0 ? box.append(html) : box.html(html);
			if(type == 'groupBuy'){
				groupListBar(data);
			}
			waterfall(box,box.children(),inlineNum,25,0,true);
			requestData.page++;
			//判斷是否請求完成
			if(len == size){
				easyScrollRequest('on',type,$(window),$(document),function(){
					queryUserLoveDetial();
				});
			}else{
				easyScrollRequest('off',type,$(window));
				requestData.isComplete = true;
				if(page != 0 || len != 0){
					box.siblings('.no-more').css('display','block');
				}
			}
			if(requestObj.easyState != 1) return false; 
			//辦定數據，添加事件
			$.each(data.result,function(k,y){
				var item = $(box).find('.'+type+'Item'+y.id);
				if(item.data('data') == undefined) item.data('data',y);
				item[0].isSelect = false;
				item.hover(function(){
					$(this).find('.hover-check-box-outer').css('display','block');
				},function(){
					if(!$(this)[0].isSelect){
						$(this).find('.hover-check-box-outer').css('display','none');
					}
				});
				item.find('.hover-check-box-outer').on('click',function(){
					var selectBox = $(this).parents('.userLoveItem');
					var itemId = selectBox.data('data').id;
					selectBox.toggleClass('select');
					if(selectBox[0].isSelect == false){
						//選上
						requestObj.loveList.push(itemId);
						selectBox[0].isSelect = true;
					}else{
						//取消
						requestObj.loveList.splice(requestObj.loveList.indexOf(itemId),1);
						selectBox[0].isSelect = false;
					}
					var len = requestObj.loveList.length;
					cancelLoveBtnClass(len); //改變按鈕樣式
				});
			});
		}
	});
}

//批量取消心動請求 
function cancelLoveRequest(){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userLoveConntroller/deleteBatchShangPinLove.easy';
	var sendList = requestObj.loveList;
	var selectType = requestObj.selectType;
	var type = selectType != 'fair' ? 0 : 9;
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId,
			ids : sendList.join(','),
			type:type,
		},
		encryptData : true
	});
	$.getJSON(dataUrl,function(data){
		if(data.result == 'success'){
			$('#delete-post').css('display','none');
			resetAndRequest(); //重新請求
		}
	});
}


//分類選擇
function userloveType(){
	$('.userlove_chooseType ul li').on('click',function(){
		if($(this).hasClass('userlove_chooseTypes_curr')) return false;
		$(this).addClass('userlove_chooseTypes_curr').siblings().removeClass('userlove_chooseTypes_curr');
		var index = $(this).index();
		$('.userlove_mainEach').eq(index).show().siblings().hide();
		switch(index){
			case 0:
				requestObj.selectType = 'groupBuy';
			break;
			case 1:
				requestObj.selectType = 'limited';
			break;
			case 2:
				requestObj.selectType = 'discount';
			break;
			case 3:
				requestObj.selectType = 'exchange';
			break;
			case 4:
				requestObj.selectType = 'museum';
			break;
			case 5:
				requestObj.selectType = 'fair';
			break;
			case 6:
				requestObj.selectType = 'other';
			break;
		}
		if(requestObj.selectType != 'fair'){
			$('.userlove_chooseSort_left li').eq(1).find('span').eq(1).html('按銷量');
		}else{
			$('.userlove_chooseSort_left li').eq(1).find('span').eq(1).html('按查看');
		}
		//切換回原來的排序
		var sortIdx = 0;
		var sort = requestObj[requestObj.selectType].sort;
		if(sort == 'uptime'){
			sortIdx = 0;
		}else if(sort == 'salecount'){
			sortIdx = 1;
		}else if(sort == 'lovecount'){
			sortIdx = 2;
		}else if(sort == 'nowprice'){
			sortIdx = 3;
		}
		$('.userlove_chooseSort_left ul li').eq(sortIdx).addClass('userlove_chooseSort_left_curr').siblings().removeClass('userlove_chooseSort_left_curr');
		if(requestObj[requestObj.selectType].isFirst){
			queryUserLoveDetial();
		}
		//看他人會辦定事件
		if(requestObj.easyState != 1) return false;
		requestObj.loveList.splice(0,requestObj.loveList.length); //清空選擇數組
		cancelLoveBtnClass(requestObj.loveList.length); //顯示數組長度
		$('#'+requestObj[requestObj.selectType].boxId).find('.userLoveItem').each(function(){
			$(this).removeClass('select');
			$(this)[0].isSelect = false;
		});
		
	});
}
//排序選擇
function userloveSort(){
	$('.userlove_chooseSort_left ul li').on('click',function(){
		if($(this).hasClass('userlove_chooseSort_left_curr')) return false;
		$(this).addClass('userlove_chooseSort_left_curr').siblings().removeClass('userlove_chooseSort_left_curr');
		var index = $(this).index();
		var sort = 'uptime';
		switch(index){
			case 0:
				sort = 'uptime';
			break;
			case 1:
				if(requestObj.selectType != 'fair'){
					sort = 'salecount';
				}else{
					sort = 'seecount';
				}
			break;
			case 2:
				sort = 'lovecount';
			break;
			case 3:
				sort = 'nowprice';
			break;
		}
		requestObj[requestObj.selectType].sort = sort;
		resetAndRequest(); //重新請求
	});
}
//用戶心動數量分類統計
function queryUserLoveNum(){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userLoveConntroller/queryUserLoveNum.easy';
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId
		},
		encryptData : true
	});
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var data = data.count;
			// $('#groupByCount').html(formatNum(data.groupByCount));
			// $('#freeCount').html(formatNum(data.freeCount));
			// $('#cutCount').html(formatNum(data.cutCount));
			// $('#changeCount').html(formatNum(data.changeCount));
			// $('#yiCount').html(formatNum(data.yiCount));
			// $('#fairCount').html(formatNum(data.fairCount));
			// $('#otherCount').html(formatNum(data.otherCount));
			$('#groupByCount').html(data.groupByCount.toString());
			$('#freeCount').html(data.freeCount.toString());
			$('#cutCount').html(data.cutCount.toString());
			$('#changeCount').html(data.changeCount.toString());
			$('#yiCount').html(data.yiCount.toString());
			$('#fairCount').html(data.fairCount.toString());
			$('#otherCount').html(data.otherCount.toString());
		}
	});
}
//取消心動辦定按鈕事件
function cancelLoveFunc(){
	var btn = $('#userlove_cancelLove');
	if(requestObj.easyState == 1){
		btn.css('display','block');
	}else{
		btn.remove();
		return false;
	}
	var box = $('#delete-post');
	var sureBtn = box.find('.sure-cancel');
	var cancelBtn = box.find('.cancel-sure');
	var selectList = requestObj.loveList;
	btn.on('click',function(){
		if(selectList.length == 0) return false;
		box.css('display','block');
	});
	sureBtn.on('click',function(){
		cancelLoveRequest();
	});
	cancelBtn.on('click',function(){
		box.css('display','none');
	});
}
//改變按鈕樣式
function cancelLoveBtnClass(len){
	$('#selectNum_view').html(len);
	len != 0 ? $('#userlove_cancelLove').addClass('userlove_cancelLove_curr') : $('#userlove_cancelLove').removeClass('userlove_cancelLove_curr');
}
//重新請求
function resetAndRequest(){
	requestObj[requestObj.selectType].page = 0;
	requestObj[requestObj.selectType].isComplete = false;
	queryUserLoveDetial();
	//看他人會辦定事件
	if(requestObj.easyState != 1) return false;
	requestObj.loveList.splice(0,requestObj.loveList.length); //清空選擇數組
	cancelLoveBtnClass(requestObj.loveList.length); //顯示數組長度
}
//量販團的數據格式化
function groupBuyDataFilter(data){
	$.each(data.result, function(k,y) {
		y.serverTimeNum = new Date(y.serverTime).getTime();
		y.startTimeNum = new Date(y.startTime).getTime();
		y.tuanEndNum = new Date(y.tuanEnd).getTime();
		y.distanceTimeNum = y.tuanEndNum - y.serverTimeNum;
		y.diffTime = diffTime(y.serverTimeNum,y.tuanEndNum);
		y.timeBarWidth = parseInt((y.serverTimeNum - y.startTimeNum) / (y.tuanEndNum - y.startTimeNum) * 100);
		if(y.isOn == 0){
			y.groupBuyState = 0; //團購結束
		}else{
			if(y.serverTimeNum < y.startTimeNum){
				y.groupBuyState = 1; //團購還沒開始
			}else{
				if(y.inTuanNum < y.tuanNum){
					y.groupBuyState = 2; //團購開始了，但是不夠人數
				}else{
					y.groupBuyState = 3; //正在開團
				}
			}
		}
		y.groupBuyState = 1; //團購還沒開始
	});
	return data;
}
//市集數據格式化
function fairDataFilter(data){
	$.each(data.result, function(k,y) {
		y.seeUserPics.splice(4,y.seeUserPics.length);
		y.resNum = new Number(y.nowPrice / y.oldPrice).toFixed(2) * 100;
	});
	return data
}

//量販團倒數時間
function groupListBar(data){
	$.each(data.result,function(k,y){
		if(y.groupBuyState == 0) return true;
		timeCounter(
			$('.groupBuyItem'+y.id).data('data',y) //辦定數據
		)
	});
	function timeCounter(obj){
		var data = obj.data('data');
		var groupBuyState = data.groupBuyState;
		if(groupBuyState == 1){
			var dayShow = obj.find('.group_notice_days');
			var hourShow = obj.find('.group_notice_hours');
			var minuteShow =obj.find('.group_notice_mins');
			var secondShow = obj.find('.group_notice_seconds');
		}else{
			var dayShow = obj.find('.group_days');
			var hourShow = obj.find('.group_hours');
			var minuteShow =obj.find('.group_mins');
			var secondShow = obj.find('.group_seconds');
			var bar = obj.find('.progressBar_curr');
		}
		obj[0].timer = setInterval(function(){
			data.tuanEndNum-=1000;
			var arr = diffTime(data.serverTimeNum,data.tuanEndNum);
			if(arr[0] <= 0 && arr[1] <= 0 && arr[2] <= 0 && arr[3] <= 0){
				$.each(arr,function(k,y){
					y = 0;
					data.diffTime[y] = 0;
				});
				clearInterval(obj[0].timer);
			}
			dayShow.html(arr[0]);
			hourShow.html(arr[1]);
			minuteShow.html(arr[2]);
			secondShow.html(arr[3]);
			if(groupBuyState != 1) bar.css('width',parseInt((data.serverTimeNum - data.startTimeNum) / (data.tuanEndNum - data.startTimeNum) * 100) + '%');
		},1000);
	}
}

easyBuy.global.startJs = function(data){
	userStatus();//用戶的狀態
}
var waterfall = easyBuy.global.dep.waterfall;
var getRequestURL = easyBuy.global.dep.getRequestURL;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;

var deleteIntegral = 0;
var requestObj = {
	selectArr : [],
	selectKey : 'uptime',
	size : 20,
	uptime : {
		page : 0, isComplete : false, isFirst : false, showBoxId : 'uptime'
	},
	topicNum : {
		page : 0, isComplete : false, isFirst : false, showBoxId : 'topicNum'
	},
	loveNums : {
		page : 0, isComplete : false, isFirst : false, showBoxId : 'loveNums'
	}
}

//判斷是自己看還是他人看
function userStatus(){
	if(easyBuy.global.isSelf){
		deleteIntegraFunc();//刪除帖子積分查詢（之後再執行其他函數)
		deletePostTips();
	}else{
		$('#delete-post,#album-delete').remove();
		sortSelectOther();
	}
}

//刪除帖子積分查詢
function deleteIntegraFunc(){
	$.getJSON('http://userspace1.macaoeasybuy.com/integralController/queryTopicIntegral.easy?type=releaseSentVolunteers&easybuyCallback=?',function(data){
		deleteIntegral = data.Integral;
		sortSelectOther();
	});
}

//排序選擇
function sortSelectOther(){
	getListdata();
	$('.mine-sort-menu>div').each(function(k){
		$(this).on('click',function(){
			if($(this).hasClass('select')) return false;
			//把上一個頁面勾選的去掉
			var type = requestObj.selectKey;
			var arr = requestObj.selectArr;
			$.each(arr,function(k,y){
				$('#'+y+type).data('isSelect',false).removeClass('select');
			});
			
			var idx = $(this).index();
			$(this).siblings('div').removeClass('select').end().addClass('select');
			$('.sort-box').eq(k).siblings('.sort-box').removeClass('select').end().addClass('select');
			switch(idx){
				case 0:
					requestObj.selectKey = 'uptime';
				break;
				case 1:
					requestObj.selectKey = 'topicNum';
				break;
				case 2:
					requestObj.selectKey = 'loveNums';
				break;
			}
			type = requestObj.selectKey;
			if(requestObj[type].isFirst){
				resetRequestFunc();
			}else if(!requestObj[type].isFirst && !requestObj[type].isComplete){
				getListdata();
			}
			//刪除所有選中的帖子
			requestObj.selectArr.splice(0,requestObj.selectArr.length);
			getSelect([]);
		});
	});
}

//獲取數據
function getListdata(){
	var type = requestObj.selectKey;
	var size = requestObj.size;
	var page = requestObj[type].page;
	var isComplete = requestObj[type].isComplete;
	var boxId = '#'+requestObj[type].showBoxId;
	var order = type;
	var dataUrl = 'http://userspace1.macaoeasybuy.com/UserLiveShotConntroller/queryUserSentVolunteers.easy';
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId,
			seeUserId : seeUserId,
			size : size,
			page : page,
			order : order,
			descOrasc : 'desc'
		},
		encryptData : false
	});
	var postTemplate = easyBuy.global.template['post-template'];
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		cache:!easyBuy.global.isSelf,
		beforeSend:function(){
			easyScrollRequest('off','listRequest',$(window));
			if(isComplete) return false;
			requestObj[type].isFirst = false;
		},
		success:function(data){
			data.order = order;
			data.page = page;
			var newData = data.UsersentVolunteersList.sentVolunteersList;
			var len = newData.length;
			var html = template.render(postTemplate,data);
			page != 0 ? $(boxId + ' .content-box-class').append(html) : $(boxId + ' .content-box-class').html(html);
			requestObj[type].page++;
			waterfall($(boxId + ' .content-box-class'),$(boxId + " .pillar-all"),4,0,0,true);
			if(len == size){
				easyScrollRequest('on','listRequest',$(window),$(document),function(){
					getListdata();
				});
			}else{
				requestObj[type].isComplete = true;
				easyScrollRequest('off','listRequest',$(window));
			}
			if(len != size && (page != 0 || len != 0)){
				$(boxId).find('.no-more').css('display','block');
			}
			if(data.UsersentVolunteersList.isSelf == 1){
				removeSelect(data); //如果是自己的帖子調用刪除帖子
			}
		}
	});
}

//選擇刪除辦定事件
function removeSelect(data){
	var dataList = data.UsersentVolunteersList.sentVolunteersList;
	$.each(dataList, function(k,y) {
		$('#'+y.id+data.order).data('data',y).data('isSelect',false).hover(function(){
			if(!$(this).data('isSelect')){
				$(this).find('.hover-check-box-outer').css('display','block');
			}
		},function(){
			if(!$(this).data('isSelect')){
				$(this).find('.hover-check-box-outer').css('display','none');
			}
		}).find('.hover-check-box-outer').on('click',function(){
			var father = $(this).parents('.pillar-all');
			var id = father.data('data').id;
			if(!father.data('isSelect')){
				//選擇
				father.data('isSelect',true);
				father.addClass('select');
				requestObj.selectArr.push(id);
			}else{
				//取消
				father.data('isSelect',false);
				father.removeClass('select');
				requestObj.selectArr.splice(requestObj.selectArr.indexOf(id),1);
			}
			getSelect(requestObj.selectArr);
		});
	});
}

//顯示刪除的數目
function getSelect(arr){
	$('#album-delete span').html(arr.length);
	$('.cancel-tips-text span').html(arr.length);
	$('.cancel-tips-text-tips span.remove-num').html(arr.length);
	$('.cancel-tips-text-tips span.remove-num-math').html(arr.length * deleteIntegral);
	if(arr.length == 0){
		$('#album-delete').css({
			'color':'#aaa',
			'cursor':'default',
			'background-color':'#fff',
			'border-color':'#aaa'
		});
		$('#album-delete').find('img').attr('src','/src/img/userspace/common/deletebtn.png');
		return false;
	}else{
		$('#album-delete').css({
			'color':'#fff',
			'cursor':'pointer',
			'background-color':'#e98900',
			'border-color':'#e98900'
		});
		$('#album-delete').find('img').attr('src','/src/img/userspace/common/deletebtn-s.png');
	}
}


//刪除帖子彈框辦定事件
function deletePostTips(){
	$('#album-delete').on('click',function(){
		if(requestObj.selectArr.length == 0) return false;
		$('#delete-post').css('display','block');
	});
	
	$('#delete-post .cancel-sure').on('click',function(){
		$('#delete-post').css('display','none');
	});
	
	$('#delete-post .sure-cancel').on('click',function(){
		var arr = requestObj.selectArr;
		if(arr.length == 0) return false;
		var idStr = '';
		for(var i=0;i<arr.length;i++){
			if(i == arr.length-1){
				idStr += parseInt(arr[i]);
			}else{
				idStr += parseInt(arr[i]) + ',';
			}
		}
		$.getJSON('http://userspace.macaoeasybuy.com/UserLiveShotConntroller/deleteBetchUserSentVolunteers.easy?idStr='+idStr+'&userId='+userId+'&integral='+arr.length * deleteIntegral+'&easybuyCallback=?',function(data){
			if(data.status == 'success'){
				$('#delete-post').css('display','none');
				//只要刪除數據的，其他盒子點過去的時候都要重新刷過
				requestObj.uptime.isFirst = true;
				requestObj.topicNum.isFirst = true;
				requestObj.loveNums.isFirst = true;
				resetRequestFunc();
			}
		});
	});
}

//重置請求函數
function resetRequestFunc(){
	var type = requestObj.selectKey;
	requestObj[type].page = 0;
	requestObj[type].isComplete = 0;
	requestObj[type].isFirst = true;
	getListdata();
}

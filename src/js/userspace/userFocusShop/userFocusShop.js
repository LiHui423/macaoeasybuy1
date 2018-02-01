var getRequestURL = easyBuy.global.dep.getRequestURL;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var clickObj;
var requestShopList = {
	size : 10,
	page : 0,
	isComplete : false
}
easyBuy.global.startJs = function(){
	focusShopList();
	focusBtnBind();
}
//請求數據
function focusShopList(){
	var size = requestShopList.size;
	var page = requestShopList.page;
	var isComplete = requestShopList.isComplete;
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userMarkShopConntroller/queryUserMarkShop.easy';
	var templateHtml = easyBuy.global.template['focusShop_template'];
	var showBox = $('#focusShopList');
	focusShopListRequestFunc(); //AJAX請求
	function focusShopListRequestFunc(){
		dataUrl = getRequestURL({
			targetURL : dataUrl,
			requestData : {
				userId : userId,
				seeUserId : seeUserId,
				size : size,
				page : page
			},
			encryptData : false
		});
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				easyScrollRequest('off','request',$(window));
				if(isComplete) return false;
			},
			success:function(data){
				data.page = page;
				var html = template.render(templateHtml,data);
				page == 0 ? showBox.html(html) : showBox.append(html);
				requestShopList.page++;
				$.each(data.shop,function(k,y){
					var obj = $('#focusShopEach'+y.id).data('data',y);
					slideBtn(obj); //辦定點擊展示信息事件
					operShopRequest(obj); //辦定加關注取消關注事件
				});
				var len = data.shop.length;
				if(len == size){
					easyScrollRequest('on','request',$(window),$(document),function(){
						focusShopListRequestFunc();
					});
				}else{
					requestShopList.isComplete = true;
					easyScrollRequest('off','request',$(window));
					if(page != 0 || len != 0){
						$('.noMore').css('display','block');
					}
				}
			}
		});
	}
}
// 1 已關注，  0未關注
//關注，取消辦定事件
function operShopRequest(obj){
	obj.find('.focusShopEach_btn_focus_box').on('click',function(){
		clickObj = obj;
		var objData = obj.data('data');
		var isMark = objData.isMark;
		var id = objData.id;
		if(isMark == 1){
			//取消關注
			 $('#cancelFocus').css('display','block');
		}else{
			//關注
			$(this).removeClass('focus').addClass('cancel');
			ajaxSendFocus(1,id,function(){
				obj.data('data').isMark = 1;
			});
		}
	});
}
//關注，取消關注請求
function ajaxSendFocus(type,id,fn){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userMarkShopConntroller/operShop.easy';
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId,
			type : type,
			shopId : id
		},
		encryptData : true
	});
	$.getJSON(dataUrl,function(data){
		if(type == 1){
			var showBox = $('#focusShop');
			if(showBox.css('display','none')) showBox.fadeIn(500).delay(800).fadeOut(500);
		}else{
			$('#cancelFocus').css('display','none');
		}
		fn&&fn(data);
	});
}
//關注商店按鈕
function focusBtnBind(){
	var box = $('#cancelFocus');
	var sureBtn = box.find('.sureCancel');
	var cancelBtn = box.find('.notSureCancel');
	cancelBtn.on('click',function(){
		box.css('display','none');
	});
	sureBtn.on('click',function(){
		ajaxSendFocus(0,clickObj.data('data').id,function(){
			if(easyBuy.global.isSelf){
				requestShopList.page = 0;
				requestShopList.isComplete = false;
				focusShopList();
			}else{
				var clickBtn = clickObj.find('.focusShopEach_btn_focus_box');
				clickBtn.removeClass('cancel').addClass('focus');
				$('#cancelFocus').css('display','block');
			}
			clickObj.data('data').isMark = 0;
		});
	});
}
//辦定點擊滑動事件
function slideBtn(obj){
	obj.find('.focusShopEach_seeMore_btn').on('click',function(){
		if($(this).hasClass('focusShopEach_seeMore_btn_slide')){
			$(this).removeClass('focusShopEach_seeMore_btn_slide');
			$(this).siblings('.focusShopEach_seeMore_slide').slideUp('fast');
			$(this).find('span:nth-of-type(1)').text('展開更多信息');
			$(this).find('span:nth-of-type(2) img').attr('src','/img/userspace/userFocusShop/focus_slide.png')
		}else{
			$(this).parents('.focusShopEach').siblings().find('.focusShopEach_seeMore_btn').removeClass("focusShopEach_seeMore_btn_slide")
			$(this).parents('.focusShopEach').siblings().find('.focusShopEach_seeMore_btn').find('span:nth-of-type(1)').text('展開更多信息');
			$(this).parents('.focusShopEach').siblings().find('.focusShopEach_seeMore_btn').find('span:nth-of-type(2) img').attr('src','/img/userspace/userFocusShop/focus_slide.png');
			$(this).parents('.focusShopEach').siblings().find('.focusShopEach_seeMore_slide').slideUp('fast')

			$(this).addClass('focusShopEach_seeMore_btn_slide');
			$(this).siblings('.focusShopEach_seeMore_slide').slideDown('fast');
			$(this).find('span:nth-of-type(1)').text('收起更多信息')
			$(this).find('span:nth-of-type(2) img').attr('src','/img/userspace/userFocusShop/focus_slide_up.png')
		}
	})
}

var getBeforeDate = easyBuy.global.dep.getBeforeDate;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var getRequestURL = easyBuy.global.dep.getRequestURL;
var globalObj = {};
easyBuy.global.startJs = function(){
	globalObj.shopArea = 0;
	globalObj.lastSaveDate = '';
	globalObj.page = 0;
	globalObj.fooShopArea = 0;
	globalObj.size = 8;
	isgraduation();
	shopData(); //宜買商城數據

	dateFunc(); //日曆
//	selectCheckBox();  //複選框按鈕
	scrollTopRight();//右側吸頂
}
function isgraduation(){
	//查看是否結業
	$('#shop-bought').find('.cancel-btn').on('click',function(){
		$('#shop-bought').css('display','none');
	})
}
//日曆
function dateFunc(){
	var newDate = getBeforeDate(0);
	var oldDate = getBeforeDate(7);
	globalObj.beginDate = oldDate;
	globalObj.finalDate = newDate;
	requestData(); //請求數據
	var a = new pickerDateRange('date-select-btn',{
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
			globalObj.page = 0;
			requestData(); //請求數據
		}
	});
}
//複選框按鈕
function selectCheckBox(){
	$('.date-select .checkit-box').on('click',function(){
		if($(this).parent().hasClass('select')){
			$(this).parent().removeClass('select');
			globalObj.shopArea = -1;
		}else{
			$(this).parent().addClass('select');
			globalObj.shopArea = globalObj.fooShopArea;
		}
		globalObj.page = 0;
		requestData();
	});
}
//下拉選項框
function selectBox(){
	var fadeTime = 1;
	$('.shop-select-btn,.museum-select-btn').on('click',function(){
		$(this).siblings('ul').fadeToggle(fadeTime);
		$('.date-select .box-shadow').fadeIn(fadeTime);
	});
	$('.date-select .box-shadow').on('click',function(){
		$(this).fadeOut(fadeTime);
		$('.date-select').find('ul').fadeOut(fadeTime);
	});
	$('#shop-select .shop-select-item li').each(function(){
		$(this).on('click',function(){
			var a = $(this).text();
			$(this).parent().prev().find('span').eq(1).html(a)
			a = null;
			$('.date-select .box-shadow').fadeOut(fadeTime);
			$('.date-select').find('ul').fadeOut(fadeTime);
			$(this).parent().siblings('.checkit-box').parent().addClass('select');
			globalObj.shopArea = $(this)[0].id;
			globalObj.fooShopArea = $(this)[0].id;
			globalObj.page = 0;
			requestData();
		});
	});
}
function requestData(){
	var beginDate = globalObj.beginDate;
	var finalDate = globalObj.finalDate;
	var shopArea = globalObj.shopArea;
	var size = globalObj.size;;
	var page = globalObj.page;
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userFootprintsController/queryShopFootPrints.easy';
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId,
			beginDate : beginDate,
			finalDate : finalDate,
			shopArea : shopArea,
			size : size,
			page : page,
			order : 'uptime',
			descOrAsc : 'desc'
		},
		encryptData : false
	});
	var liTemplate = easyBuy.global.template['li-template'];
	var shopTemplate = easyBuy.global.template['shop-template'];
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			easyScrollRequest('off','requestList',$(window));
			if(globalObj.page == 0){
				$('#data-box').html('');
				globalObj.lastSaveDate = '';
				$('.data-show .no-more').css('display','none');
			}
		},
		success:function(data){
			for(var i=0;i<data.shopList.length;i++){
				for(var j=0;j<data.shopList[i].shopList.length;j++){
					data.shopList[i].shopList[j].uptime = data.shopList[i].shopList[j].uptime.replace(/\//g,'');
				}
			}
			var dataSize = 0;
			for(var i=0;i<data.shopList.length;i++){
				dataSize += data.shopList[i].shopList.length;
			}
			if(data.shopList != undefined && data.shopList.length != 0){
				var lastDataTime = data.shopList[0].uptime;
				if(lastDataTime == globalObj.lastSaveDate){
					//添加在最後的那個裡面
					$('#data-box>ul:last-of-type').append(
						template.render(liTemplate,data.shopList[0])
					);
					var a = {
						shopList :[]
					};
					for(var i=1;i<data.shopList.length;i++){
						a.shopList[i-1] = data.shopList[i];
					}
					if(data.shopList.length >1){
						$('#data-box').append(
							template.render(shopTemplate,a)
						);
					}
				}else{
					//新建一個添加
					$('#data-box').append(
						template.render(shopTemplate,data)
					);
				}
				easyScrollRequest('on','requestList',$(window),$(document),function(){
					requestData();
				});
				globalObj.lastSaveDate = data.shopList[data.shopList.length - 1].uptime;;
				globalObj.page += 1;
			}
			if(data.shopList != undefined && data.shopList.length < size && page != 0){
				$('.data-show .no-more').css('display','block');
			}
			if(data.shopList.length == 0 && page == 0){
				var html = '<div id="no-post"><div><img src="/src/img/common/05.png" alt=""></div><span>目前沒有任何內容哦!</span></div>';
				$('#data-box').html(html);
				$('.data-show .no-more').css('display','none');
			}
			for(var i=0;i<data.shopList.length;i++){
				for(var j=0;j<data.shopList[i].shopList.length;j++){
					$('#'+data.shopList[i].shopList[j].id+data.shopList[i].shopList[j].uptime).data('data-id',data.shopList[i].shopList[j].id)
				}
			}
			scrollTopRight();
		}
	});
}
//宜買商城數據
function shopData(){
	var dataUrl = 'http://userspace.macaoeasybuy.com/userFootprintsController/queryAreaType.easy?easybuyCallback=?';
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			for(var i=0;i<data.areaList.length;i++){
				var html = '<li id="'+data.areaList[i].id+'shopSelect">'+data.areaList[i].name+'</li>';
				$('#shop-select .shop-select-item').append(html);
			}
			$('#shop-select .shop-select-item li').each(function(){
				$(this)[0].id = parseInt($(this).attr('id'));
				$(this)[0].type = 'shop';
			});
			selectBox();
		}
	});
}
//右側吸頂
function scrollTopRight(){
	var scrollBox = $('.footprint-right');//吸頂盒子
	var referBox = $('.footprint-left');//參照定位盒子
	var boxWidth = scrollBox.outerWidth(true);
	var boxHeight = scrollBox.outerHeight(true);
	if(referBox.outerHeight(true) < boxHeight){
		$(window).off('scroll.nav resize.nav');
		return false;
	}else{
		$(window).off('scroll.nav resize.nav');
		d(scrollBox,referBox,boxWidth,boxHeight);
		$(window).on('scroll.nav',function(){
			d(scrollBox,referBox,boxWidth,boxHeight);
		});
		$(window).on('resize.nav',function(){
			d(scrollBox,referBox,boxWidth,boxHeight);
		});
	}
	function d(scrollBox,referBox,boxWidth,boxHeight){
		var referHeight = referBox.outerHeight(true);
		var referWidth = referBox.outerWidth(true);
		var referLeft = referBox.offset().left;
		var referTop = referBox.offset().top;
		var minTop = referTop;
		var maxTop = referHeight + referTop - boxHeight;
		var left = referLeft + referWidth - $(window).scrollLeft();
		var windowTop = $(window).scrollTop();
		if(windowTop >= minTop && windowTop <= maxTop){
			//這裡吸頂
			scrollBox.css({
				'width':boxWidth,
				'position':'fixed',
				'top':'0px',
				'left':left
			});
		}else if(windowTop < minTop){
			//這裡在上面
			scrollBox.css({
				'width':boxWidth,
				'position':'static'
			});
		}else if(windowTop > maxTop){
			//這裡在下面
			scrollBox.css({
				'width':boxWidth,
				'position':'fixed',
				'top':maxTop - windowTop,
				'left':left
			});
		}
	}
}

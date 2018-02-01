var getBeforeDate = easyBuy.global.dep.getBeforeDate;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var getRequestURL = easyBuy.global.dep.getRequestURL;
var globalObj = {};
easyBuy.global.startJs = function(){
	globalObj.shopArea = 0;
	globalObj.ypgArea = 0;
	globalObj.lastSaveDate = '';
	globalObj.page = 0;
	globalObj.fooShopArea = 0;
	globalObj.fooYpgArea = 0;


	shopData(); //宜買商城數據
	ypgData(); //宜品館數據

	dateFunc(); //日曆
	selectCheckBox();  //複選框按鈕
	shopInfo();//售罄提示
	selectRightPage();//推薦新品最新下單切換
	scrollTopRight();//右側吸頂
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
		var idx = $(this).parent().index();
		if($(this).parent().hasClass('select')){
			$(this).parent().removeClass('select');
			if(idx == 2){
				globalObj.shopArea = -1;
			}else if(idx == 1){
				globalObj.ypgArea = -1;
			}
		}else{
			$(this).parent().addClass('select');
			if(idx == 2){
				globalObj.shopArea = globalObj.fooShopArea;
			}else if(idx == 1){
				globalObj.ypgArea = globalObj.fooYpgArea;
			}
		}
		globalObj.page = 0;
		requestData();
	});
}
//下拉選項框
function selectBox(){
	var fadeTime = 1;
	$('.shop-select-btn,.museum-select-btn').off('click');
	$('.shop-select-btn,.museum-select-btn').on('click',function(){
		$(this).parent().siblings('.clearfloat').find('ul').fadeOut(fadeTime);
		$(this).siblings('ul').fadeToggle(fadeTime);
		$('.date-select .box-shadow').fadeIn(fadeTime);
	});
	$('.date-select .box-shadow').off('click');
	$('.date-select .box-shadow').on('click',function(){
		$(this).fadeOut(fadeTime);
		$('.date-select').find('ul').fadeOut(fadeTime);
	});
	$('#shop-select .shop-select-item li,#museum-select .museum-select-item li').each(function(){
		$(this).off('click');
		$(this).on('click',function(){
			var a = $(this).text();
			$(this).parent().prev().find('span').eq(1).html(a)
			a = null;
			$('.date-select .box-shadow').fadeOut(fadeTime);
			$('.date-select').find('ul').fadeOut(fadeTime);
			$(this).parent().siblings('.checkit-box').parent().addClass('select');
			if($(this)[0].type == 'shop'){
				globalObj.shopArea = $(this)[0].id;
				globalObj.fooShopArea = $(this)[0].id;
			}else{
				globalObj.ypgArea = $(this)[0].id;
				globalObj.fooYpgArea = $(this)[0].id;
			}
			globalObj.page = 0;
			requestData();
		});
	});
}
//推薦新品最新下單切換
function selectRightPage(){
	$('.footprint-right .select-menu>div').each(function(k){
		$(this).on('click',function(){
			$(this).siblings('div').removeClass('select').end().addClass('select');
			$('.select-page .select-page-items').eq(k).siblings('.select-page-items').removeClass('select').end().addClass('select');
		});
	});
}
//售罄提示
function shopInfo(){
	$('#shop-bought .cancel-btn').on('click',function(){
		$('#shop-bought').css('display','none');
	});
}



//請求商品數據
function requestData(){
	var beginDate = globalObj.beginDate;
	var finalDate = globalObj.finalDate;
	var shopArea = globalObj.shopArea;
	var ypgArea = globalObj.ypgArea;
	var size = 6;
	var page = globalObj.page;
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userFootprintsController/queryShangPinFootPrints.easy';
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			userId : userId,
			beginDate : beginDate,
			finalDate : finalDate,
			shopArea : shopArea,
			ypgArea : ypgArea,
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
			if(shopArea == -1 && ypgArea == -1){
				showBackData({count:0,shangPinFoot:[]},size,page);
				return false;
			}
		},
		success:function(data){
			data = data.shangPinFoot;
			showBackData(data,size,page);
		}
	});
}
//顯示返回來的數據
function showBackData(data,size,page){
	if(data.shangPinFoot != undefined && data.shangPinFoot.length != 0){
		var lastDataTime = data.shangPinFoot[0].uptime;
		if(lastDataTime == globalObj.lastSaveDate){
			//添加在最後的那個裡面
			$('#data-box>ul:last-of-type').append(
				template.render(liTemplate,data.shangPinFoot[0])
			);
			var a = {
				shangPinFoot :[]
			};
			for(var i=1;i<data.shangPinFoot.length;i++){
				a.shangPinFoot[i-1] = data.shangPinFoot[i];
			}
			if(data.shangPinFoot.length >1){
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
		globalObj.lastSaveDate = data.shangPinFoot[data.shangPinFoot.length - 1].uptime;;
		globalObj.page += 1;
	}
	if(data.shangPinFoot != undefined && data.shangPinFoot.length < size && page != 0){
		$('.data-show .no-more').css('display','block');
	}
	if(data.shangPinFoot.length == 0 && page == 0){
		var html = '<div id="no-post"><div><img src="/img/common/05.png" alt=""></div><span>目前沒有任何內容哦!</span></div>';
		$('#data-box').html(html);
		$('.data-show .no-more').css('display','none');
	}
	scrollTopRight();
}
//宜買商城數據
function shopData(){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userFootprintsController/queryAreaType.easy?easybuyCallback=?';
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
//宜品館數據
function ypgData(){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userFootprintsController/queryYpgType.easy?easybuyCallback=?';
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			for(var i=0;i<data.YpgList.length;i++){
				var html = '<li id="'+data.YpgList[i].id+'museumSelect">'+data.YpgList[i].name+'</li>';
				$('#museum-select .museum-select-item').append(html);
			}
			$('#museum-select .museum-select-item li').each(function(){
				$(this)[0].id = parseInt($(this).attr('id'));
				$(this)[0].type = 'museum';
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

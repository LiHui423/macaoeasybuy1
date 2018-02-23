$(function(){
	checkClass()
	checkChooseEach()
	clearBox()
	chooseCheck()
	choosefilter()
	scrollLoading()
})

function scrollLoading(){
	$(window).on('scroll',function(){
		lazyLoad()
	})
	function lazyLoad(){
	    var aLi = $('.otherGoods.noPic .otherGoods_pic').children('img')
		var t = document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop) - 300;
	    for (var i = 0;i < aLi.length; i++) {
	        var oLi = aLi[i];
	        //检查oLi是否在可视区域
	        var h = getH(oLi);
	        if (h < t) {
	        	setImg(i)
	        }
	    }
	}
	function setImg(a){
	    var aLi = $('.otherGoods.noPic .otherGoods_pic').children('img')
	   	var src= $(aLi[a]).data('src');
	   	if($(aLi[a]).attr('src') == 'http://img.macaoeasybuy.com/img/common/loading_pc_220.jpg'){
	   		$(aLi[a]).attr('src',src);
	   	}else{
	   		return false;
		}
		$(aLi[a]).css('opacity','1');
	    // $(aLi[a]).load(function(){
	    // 	$(this).css('opacity','1')
	    // 	$(this).parents('.otherGoods').removeClass('noPic')
	    // })
	}
	
	//获得对象距离页面顶端的距离  
	function getH(obj) {  
	    var h = 0;  
	    while (obj) {  
	        h += obj.offsetTop;  
	        obj = obj.offsetParent;  
	    }  
	    return h;  
	}
}



/*子分類選擇框*/
function checkClass(){
	/*檢測分類是否大於一行*/
	var classLength = 0;
	var classList = $('.searchGood_secondclass .searchGood_middle ul li');
	$.each(classList, function() {
		classLength = classLength +$(this).outerWidth(true);
	});
	if(classLength > 1140){
		$('.searchGood_btn_slide').show();
	}
	/*大於一行之後的操作*/
	$('.searchGood_btn_slide').off('click').on('click',function(){
		if($(this).parents('.searchGood_secondclass').hasClass('searchGood_secondclass_up')){
			$(this).parents('.searchGood_secondclass').removeClass('searchGood_secondclass_up')
			$(this).text('收起')
		}else{
			$(this).parents('.searchGood_secondclass').addClass('searchGood_secondclass_up')
			$(this).text('展開')
		}
	})
	/*點擊選擇分類*/
	$('.searchGood_secondclass .searchGood_middle ul li').off('click').on('click',function(){
		var text = $(this).text();
		$('.secondClass').html('<span data-secondclass = "'+ text +'">' + text + '</span><span>&nbsp;&nbsp;&gt;&nbsp;&nbsp;</span>')
		$('.searchGood_secondclass').hide();
		$('.searchGood_conditionBox').show()
		secondclass = encodeURI(encodeURI(text))
		loadResult()
	})
}

/*選擇篩選條件多選框*/
function checkChooseEach(){
	/*刪除空白的選項*/
	$('.searchGood_sizeBox_middle ul li').each(function(){
		if($(this).find('span:nth-of-type(2)').text() == ''){
			$(this).remove()
		}
	})
	
	/*檢測標題的長度*/
	$('.searchGood_sizeBox .searchGood_title').each(function(){
		if($(this).text().length > 6){
			$(this).addClass('searchGood_title_long')	
		}
	})
	
	/*展開按鈕*/
	$('.searchGood_btn_morechoose').off('click').on('click',function(){
		if($(this).parents('.searchGood_sizeEach').hasClass('searchGood_sizeEach_up')){
			$(this).parents('.searchGood_sizeEach').removeClass('searchGood_sizeEach_up')
			$(this).hide()
			$(this).parents('.searchGood_sizeEach').find('.searchGood_sizeBox_middle ul li span:nth-of-type(2)').off('click')
		}else{
			$(this).parents('.searchGood_sizeEach').addClass('searchGood_sizeEach_up')
		}
	})
	/*單選*/
	$('.searchGood_sizeBox_middle ul li span:nth-of-type(2)').off('click').on('click',function(){
		var title = $(this).parents('.searchGood_sizeEach').find('.searchGood_title').text();
		var value = [];
		$('.chooseClassBox').append('<div class="hadchooseClass hadchooseClass_size" data-classname ="'+ title +'" title = "'+ $(this).text() +'"><span>'+ $(this).text() +'</span><span><img src="/src/img/common/search/search_good_clearEach.png"></span></div>')
		value.push($(this).text())
		if(spStandard == ''){
			spStandard = {}
		}else{
			spStandard = spStandard
		}
		spStandard[title] = value;
		spStandardcode = encodeURI(encodeURI(JSON.stringify(spStandard)))
		loadResult()
		clearBox()
	})
	/*勾選*/
	$('.searchGood_sizeBox_middle ul li span:nth-of-type(1)').off('click').on('click',function(){
		if($(this).parent('li').hasClass('searchGood_sizeBox_curr')){
			$(this).parent('li').removeClass('searchGood_sizeBox_curr')
		}else{
			$(this).parent('li').addClass('searchGood_sizeBox_curr')
		}
	})
	/*確定*/
	$('.searchGood_sizeBox_btn_sure').off('click').on('click',function(){
		var textAdd = '';
		var title = $(this).parents('.searchGood_sizeEach').find('.searchGood_title').text();
		var value = [];
		var textNode = $(this).parents('.searchGood_sizeBox_middle').find('.searchGood_sizeBox_curr span:nth-of-type(2)')
		$.each(textNode, function(index) {
			if(index == 0){
				textAdd = textAdd + $(this).text();
			}else{
				textAdd = textAdd + ',' +$(this).text();
			}
		});
		$('.chooseClassBox').append('<div class="hadchooseClass hadchooseClass_size" data-classname ="'+ title +'" title = "'+ textAdd +'"><span>'+ textAdd +'</span><span><img src="/src/img/common/search/search_good_clearEach.png"></span></div>')
		//將分類的欄目恢復原隱藏
		$('.searchGood_sizeBox_curr').each(function(){
			value.push($(this).find('span:nth-of-type(2)').text())
		})
		if(spStandard == ''){
			spStandard = {}
		}else{
			spStandard = spStandard
		}
		spStandard[title] = value;
		spStandardcode = encodeURI(encodeURI(JSON.stringify(spStandard)))
		loadResult()
		clearBox()
	})
	/*取消*/
	$('.searchGood_sizeBox_btn_cancel').off('click').on('click',function(){
		$(this).parents('.searchGood_sizeEach').addClass('searchGood_sizeEach_up')
		$(this).parents('.searchGood_sizeEach').find('.searchGood_btn_morechoose').show()
		$(this).parents('.searchGood_sizeEach').find('.searchGood_sizeBox_middle ul li span:nth-of-type(2)').on('click',function(){
			var title = $(this).parents('.searchGood_sizeEach').find('.searchGood_title').text();
			var value = [];
			$('.chooseClassBox').append('<div class="hadchooseClass hadchooseClass_size" data-classname ="'+ title +'" title = "'+ $(this).text() +'"><span>'+ $(this).text() +'</span><span><img src="/src/img/common/search/search_good_clearEach.png"></span></div>')
			value.push($(this).text())
			if(spStandard == ''){
				spStandard = {}
			}else{
				spStandard = spStandard
			}
			spStandard[title] = value;
			spStandardcode = encodeURI(encodeURI(JSON.stringify(spStandard)))
			loadResult()
			clearBox()
		})
	})
}

/*清除框*/
function clearBox(){
	/*清除篩選條件*/
	$('.hadchooseClass span:nth-last-of-type(1)').off('click').on('click',function(){
		if($(this).parents('.hadchooseClass').hasClass('hadchooseClass_size')){
			var title = $(this).parents('.hadchooseClass').data('classname');
			$(this).parents('.hadchooseClass').remove();
			delete spStandard[title]
			spStandardcode = encodeURI(encodeURI(JSON.stringify(spStandard)))
			loadResult()
		}else{
			var title = $(this).parents('.hadchooseClass').data('classname');
			$(this).parents('.hadchooseClass').remove();
			delete Parameter[title]
			Parametercode = encodeURI(encodeURI(JSON.stringify(Parameter)))
			loadResult()
		}
	})
	
	/*清除全部篩選條件*/
	$('.firstClass').off('click').on('click',function(){
		$('.searchGood_secondclass').show();
		$('.searchGood_conditionBox').hide();
		$('.chooseClassBox').html('')
		secondclass='',spStandard='',spStandardcode = '',Parameter='',Parametercode ='';
		loadResult()
	})
	
	/*清除全部規格參數*/
	$('.secondClass').off('click').off('click').on('click',function(){
		secondclass = encodeURI(encodeURI($(this).find('span:nth-of-type(1)').text()))
		spStandard='',spStandardcode = '',Parameter='',Parametercode ='';
		loadResult()
		$('.chooseClassBox').find('.hadchooseClass').remove();
	})
	
	/*清除所有分類*/
	$('.searchGood_clearall').off('click').on('click',function(){
		$('.searchGood_secondclass').show();
		$('.searchGood_conditionBox').hide();
		$('.chooseClassBox').html('');
		secondclass='',spStandard='',spStandardcode = '',Parameter='',Parametercode ='';
		loadResult()
	})
}

/*勾選部分*/
function chooseCheck(){
	//勾選排序
	$('.search_resultBox_choosesort').off('click').on('click',function(){
		Order = $(this).data('order');
		AscOrDesc = $(this).data('asc')
		$(this).addClass('search_resultBox_choosesort_curr').parents('.search_resultBox_sortEach').siblings().find('.search_resultBox_choosesort').removeClass('search_resultBox_choosesort_curr')
	})
	
	//勾選紅包
	$('.search_resultBox_chooseTicket').off('click').on('click',function(){
		if($(this).hasClass('search_resultBox_chooseTicket_curr')){
			$(this).removeClass('search_resultBox_chooseTicket_curr')
		}else{
			$(this).addClass('search_resultBox_chooseTicket_curr')
		}
		labelinfo = '';
		$('.search_resultBox_chooseTicket_curr').each(function(index){
			if(index == $('.search_resultBox_chooseTicket_curr').length -1){
				labelinfo = labelinfo + $(this).data('labelinfo')
			}else{
				labelinfo = labelinfo + $(this).data('labelinfo') + ','
			}
		})
		labelinfo = encodeURI(encodeURI(labelinfo))
	})
}

/*參數選擇*/
function Argument(){
	$('.searchGood_chooseOther_hover ul li').off('click').on('click',function(){
		var Argumentname = $(this).parents('li').find('span:nth-of-type(1)').text();
		if($('.chooseClassBox').find('hadchooseClass').length < 8){
			$('.chooseClassBox').append('<div class="hadchooseClass hadchooseClass_arg" data-classname ="'+ Argumentname +'" title = "'+ $(this).text() +'"><span>'+ $(this).text() +'</span><span><img src="/src/img/common/search/search_good_clearEach.png"></span></div>')
			if(Parameter == ''){
				Parameter = {}
			}else{
				Parameter = Parameter
			}
			Parameter[Argumentname] = $(this).text();
			Parametercode = encodeURI(encodeURI(JSON.stringify(Parameter)))
			loadResult()
		}else{
			alert('所選的篩選條件過多')	
		}
		clearBox()
	})
}

/*搜索結果數量*/
function resultNum(){
	var allnum = $('.search_result_title').find('span:nth-of-type(2)').text();
	$('.search_result_title').find('span:nth-of-type(1)').text(decodeURI(decodeURI(keyword)));
	$('.search_result_null p span').text(decodeURI(decodeURI(keyword)));
	if(allnum == 0){
		$('.search_result_null').show();
		$('.search_result_goodList').hide();
	}else if(allnum <= 72){
		$('.search_result_null').hide();
		$('.tcdPageCode').hide()
	}else{
		$('.search_result_null').hide();
		$('.search_result_goodList').show();
		/*分頁調用*/
		var pageCount = Math.ceil(allnum/72)
		$(".tcdPageCode").createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(p) {
				scrollListTop()
				choosePage(p-1)
			}
		});
	}
}

function scrollListTop(){
	var topHeight = $('.searchGood_seeOther').offset().top;
	$("body").animate({
		scrollTop:topHeight
	},0);
}
/*點擊選擇分類*/
function choosefilter(){
	$('.search_resultBox_sort_btn').off('click').on('click',function(){
		PriceStart = $('#priceStart').val()
		PriceEnd = $('#priceEnd').val()
		loadResult()
	})
}

/*跳轉*/
function uploadType(){
	$('.otherGoods').on('click',function(){
		var type = $(this).data('type');
		var id = $(this).data('id');
		if(type == '0'){
			window.open('http://shopping.macaoeasybuy.com/goodDetails/ordinaryGoodDetais.html?id=' + id +'');
		}else if(type == '1'){
			window.open('http://shopping.macaoeasybuy.com/goodDetails/limitedDetail.html?id=' + id +'');
		}else if(type == '2'){
			window.open('http://shopping.macaoeasybuy.com/goodDetails/ordinaryGoodDetais.html?id=' + id +'');
		}else if(type == '3'){
			window.open('http://shopping.macaoeasybuy.com/goodDetails/discountDetails.html?id=' + id +'');
		}else if(type == '4'){
			window.open('http://shopping.macaoeasybuy.com/goodDetails/ordinaryGoodDetais.html?id=' + id +'');
		}else if(type == '5'){
			window.open('http://shopping.macaoeasybuy.com/goodDetails/groupDetail.html?id=' + id +'');
		}else if(type == '6'){
			window.open('http://shopping.macaoeasybuy.com/goodDetails/museumDetails.html?id=' + id +'');
		}else if(type == '7'){
			window.open('http://shopping.macaoeasybuy.com/goodDetails/exchangeDetail.html?id=' + id +'');
		}
	})
}

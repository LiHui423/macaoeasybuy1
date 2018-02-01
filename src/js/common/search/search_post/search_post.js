$(function(){
	chooseTab()
	chooseSort()
})
function chooseTab(){
	/*左側選擇*/
	$('.search_sortBox_left ul li').on('click',function(){
		$(this).addClass('search_sortBox_left_curr').siblings().removeClass('search_sortBox_left_curr')
		fq = $(this).data('icon');
		chooseTypeGood()
		Page = 1;
		if(fq == '0'){
			$('.search_result_mainRight_title').text('宜生活')
			$('.search_result_right_tab_all').show().siblings().hide();
		}else if(fq == '5'){
			$('.search_result_mainRight_title').text('熱門專輯')
			$('.search_result_right_tab_album').show().siblings().hide();
			loadRightAlbum()
		}else{
			$('.search_result_mainRight_title').text('熱門'+$(this).find('p:nth-of-type(1)').text()+'')
			$('.search_result_right_tab_common').show().siblings().hide();
			loadRightCommon()
		}
	})
}

function chooseSort(){
	$('.search_sortBoxEach span').on('click',function(){
		if($(this).parents('.search_sortBoxEach').hasClass('search_sortBox_right_down')){
			$(this).parents('.search_sortBoxEach').removeClass('search_sortBox_right_down')
			$(this).parents('.search_sortBoxEach').find('.search_sortBox_right_slide').slideUp('fast');
			$('.transparent_bg').hide()
		}else{
			$(this).parents('.search_sortBoxEach').addClass('search_sortBox_right_down')
			$(this).parents('.search_sortBoxEach').siblings().find('.search_sortBox_right_slide').slideUp('fast');
			$(this).parents('.search_sortBoxEach').siblings().removeClass('search_sortBox_right_down')
			$(this).parents('.search_sortBoxEach').find('.search_sortBox_right_slide').slideDown('fast');
			$('.transparent_bg').show()
		}
	})
	$('.search_sortBox_right_slide ul li').on('click',function(){
		$(this).parents('.search_sortBoxEach').find('span:nth-of-type(1)').text($(this).text());
		$(this).parents('.search_sortBoxEach').removeClass('search_sortBox_right_down')
		$(this).parents('.search_sortBoxEach').find('.search_sortBox_right_slide').slideUp('fast');
		if($(this).parents('.search_sortBoxEach').hasClass('search_sortBoxEach_time')){
			fqTime = $(this).data('time')
			loadResult()
			Page = 1
		}else{
			DescOrAsc = $(this).data('asc')
			Orders = $(this).data('order')
			chooseTypeGood()
			Page = 1
		}
		$('.transparent_bg').hide()
	})
	$('.transparent_bg').on('click',function(){
		$('.search_sortBoxEach').removeClass('search_sortBox_right_down')
		$('.search_sortBox_right_slide').slideUp('fast');
		$('.transparent_bg').hide()
	})
}

/*搜索結果數量*/
function resultNum(){
	var allnum = $('.search_result_title').find('span:nth-of-type(2)').text();
	$('.search_result_title').find('span:nth-of-type(1)').text(decodeURI(decodeURI(keyword)));
	$('.search_label_noResult p span').text(decodeURI(decodeURI(keyword)))
	if(allnum == 0){
		$('.search_label_noResult').show();
	}else if(allnum <= 10){
		$('.search_label_noResult').hide();
	}else{
		$('.search_label_noResult').hide();
	}
}

function searchPostScroll(){
	/*定義頁碼*/
	Page = 1;
	/*定義是否滾動完的參數*/
	over = false;
	/*距下边界长度*/
	var range = 50;
	
	/*throttling節流*/
	function throttling(fn, wait, maxTimelong) {
	    var timeout = null,
	        startTime = Date.parse(new Date);
	
	    return function() {
	        if(timeout !== null) clearTimeout(timeout);
	        var curTime = Date.parse(new Date);
	        if(curTime-startTime>=maxTimelong) {
	            fn();
	            startTime = curTime;
	        } else {
	            timeout = setTimeout(fn, wait);
	        }
	    }
	}
	/*執行函數*/
	function handle() {
	   //填入要執行的函數
	  	checkScroll()
	}
	/*檢測是否到底部*/
	function checkScroll(){
		var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos);//加了400是想在距離底部還有400px的時候就提前請求
        if(over == false){
        	if(($(document).height()-range) <= totalheight) {
        		$('.loadNow').show()
	        	loadResultTabAppend();
				Page++;
	        }	
        }else{
        	return false;
        }
	}
	
	/*檢測是否到達視區*/
	function lazyLoad(){
		var aLi = $('.search_topic_resultListBox .search_topic_resultEach.search_topic_resultEach_nopic');
	    var t = document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop)-300;
	    for (var i = 0, l = aLi.length; i < l; i++) {
	        var oLi = aLi[i];
	        //检查oLi是否在可视区域
	        var h = getH(oLi);
	        if (h < t) {
	        	setImg(i)
	        }
	    }
	}
	function setImg(index){
		/*先換頭像*/
	    var aLiHead = $('.search_topic_resultListBox .search_topic_resultEach.search_topic_resultEach_nopic .search_topic_resultEach_left').children('img')
	   	var src= $(aLiHead[index]).data('src');
	    $(aLiHead[index]).attr('src',src);
	    $(aLiHead[index]).load(function(){
	    	$(this).css('opacity','1')
	    	$(this).parents('.ListBox_goodsEach').removeClass('noPic')
	    })
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
	/*綁定滾動*/
	$(window).off('scroll').on('scroll',throttling(handle, 300, 1000))
}
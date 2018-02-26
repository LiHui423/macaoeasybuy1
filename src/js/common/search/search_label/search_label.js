$(function(){
	chooseSort()
	rightCeil()
})

function chooseTab(){
	/*左側選擇*/
	$('.search_sortBox_left ul li').on('click',function(){
		$(this).addClass('search_sortBox_left_curr').siblings().removeClass('search_sortBox_left_curr')
		fq = $(this).data('icon');
		var url = window.location.search;
		var str = url.split("?");
		var strs = str[1].split("=");
		var keyword = strs[1];
		chooseTypeGood(keyword);
		Page = 1
	})
	
	
	/*右側*/
	$('.search_result_mainRight_sort ul li').on('click',function(){
		$(this).addClass('search_result_mainRight_sort_curr').siblings().removeClass('search_result_mainRight_sort_curr')
		var id = $(this).data('typeid');
		$("[data-boxid = '"+ id +"']").show().siblings().hide();
		if($("[data-boxid = '"+ id +"']").find('.search_result_hotLabel').length == 0){
			loadRightPart(id,$("[data-boxid = '"+ id +"']"))
		}else{
			return false;
		}
	})
}

function chooseSort(){
	$('.search_sortBox_right span').on('click',function(){
		if($(this).parents('.search_sortBox_right').hasClass('search_sortBox_right_down')){
			$(this).parents('.search_sortBox_right').removeClass('search_sortBox_right_down')
			$('.search_sortBox_right_slide').slideUp('fast');
			$('.transparent_bg').hide()
		}else{
			$(this).parents('.search_sortBox_right').addClass('search_sortBox_right_down')
			$('.search_sortBox_right_slide').slideDown('fast');
			$('.transparent_bg').show()
		}
	})
	$('.search_sortBox_right_slide ul li').on('click',function(){
		$(this).parents('.search_sortBox_right').find('span:nth-of-type(1)').text($(this).text());
		$(this).parents('.search_sortBox_right').removeClass('search_sortBox_right_down')
		$('.search_sortBox_right_slide').slideUp('fast');
		DescOrAsc = $(this).data('asc')
		Order = $(this).data('order')
		var url = window.location.search;
		var str = url.split("?");
		var strs = str[1].split("=");
		var keyword = strs[1];
		chooseTypeGood(keyword);
		Page = 1
		$('.transparent_bg').hide()
	})
	$('.transparent_bg').on('click',function(){
		$('.search_sortBox_right').removeClass('search_sortBox_right_down')
		$('.search_sortBox_right_slide').slideUp('fast');
		$('.transparent_bg').hide()
	})
}

/*右側欄目吸頂*/
function rightCeil(){
	/*獲取左側頂部的偏移量*/
	var navHeight = $(".search_result_mainRight_fixedBox").offset().top;
	$(window).off('scroll.rightceilscroll').on('scroll.rightceilscroll',function(){
		/*獲取左側文本的高度*/
		var maxHeight = navHeight + $('.search_result_mainLeft').outerHeight(true) - $(".search_result_mainRight_fixedBox").outerHeight(true)
	    if($(this).scrollTop() < navHeight){ 
	    	$(".search_result_mainRight_fixedBox").css('position','static')
	    }else if($(this).scrollTop() > navHeight&&$(this).scrollTop() < maxHeight){
	    	$(".search_result_mainRight_fixedBox").css({
	    		'position':'fixed',
				'top':'0px'
	    	})
	    }else{
	    	$(".search_result_mainRight_fixedBox").css({
				'position':'fixed',
				'top':maxHeight - $(this).scrollTop()
			});
	    } 
	})
}


/*搜索結果數量*/
function resultNum(keyword){
	var allnum = $('.search_result_title').find('span:nth-of-type(2)').text();
	$('.search_result_title').find('span:nth-of-type(1)').text(decodeURI(decodeURI(keyword)));
	$('.search_result_null p span').text(decodeURI(decodeURI(keyword)));
	if(allnum == 0){
		$('.search_result_null').show();
		$('.search_resultBox').hide();
	}else if(allnum <= 6){
		$('.search_result_null').hide();
		$('.tcdPageCode').hide()	
	}else{
		$('.search_result_null').hide();
		$('.search_resultBox').show();
	}
}

function searchTopicScroll(){
	/*定義頁碼*/
	Page = 1;
	/*定義是否滾動完的參數*/
	over = false;
	/*距下边界长度*/
	var range = 50;
	/*儲存偏移量*/
	var slidemap = {};
	
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
	  	lazyLoad()
	}
	/*檢測是否到底部*/
	function checkScroll(){
		var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos)+1200;//加了400是想在距離底部還有400px的時候就提前請求
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
		var aLi = $('.search_label_resultBox .search_label_resultEach.nopiclabel');
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
	    var aLiImg = $('.search_label_resultBox .search_label_resultEach.nopiclabel').children('.search_label_resultEach_left')
		   var src= $(aLiImg[index]).data('basrc');
		   console.log(src);
	    $(aLiImg[index]).css("background-image","url(" + src + ")");
	}
	
	//获得对象距离页面顶端的距离,將獲取到的偏移量存進slidemap
	function getH(obj) {
		var id = $(obj).data('id');
	    var h = 0;
	    if(slidemap[id]){
	    	h = slidemap[id].height;
	    }else{
	    	while (obj) {  
		        h += obj.offsetTop;  
		        obj = obj.offsetParent;
		    }
	    	slidemap[id] = {
	    		height:h
	    	}
	    }
	    return h;  
	}
	
	/*綁定滾動*/
	$(window).off('scroll.throttlescroll').on('scroll.throttlescroll',throttling(handle, 100, 500))
}

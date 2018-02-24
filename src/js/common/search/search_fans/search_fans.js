/*搜索結果數量*/
function resultNum(keyword){
	var allnum = $('.search_result_title').find('span:nth-of-type(2)').text();
	$('.search_result_title').find('span:nth-of-type(1)').text(decodeURI(decodeURI(keyword)));
	$('.search_result_null p span').text(decodeURI(decodeURI(keyword)));
	$('.search_result_null p span').text(decodeURI(decodeURI(keyword)))
	if(allnum == 0){
		$('.search_result_null').show();
		$('.search_resultBox').hide();
	}else if(allnum <= 16){
		$('.search_result_null').hide();
		$('.search_resultBox').show();
	}else{
		$('.search_result_null').hide();
		$('.search_resultBox').show();
	}
}


function searchFanScroll(){
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
	        	appendLoading();
				Page++;
	        }	
        }else{
        	return false;
        }
	}
	/*綁定滾動*/
	$(window).off('scroll').on('scroll',throttling(handle, 300, 1000))
}

$(function(){
	discountScroll();
	setInterval(discountCountDown,1000);
})

function discountCountDown(){
	var over_date = new Date(new Date(new Date().setHours(24,0,0,0)).getTime()-1)
	var current_date = new Date(); // 獲得一個固定的當前時間的值
	// 計算差值
	var difference = over_date - current_date;
	// 初始化單位
	var _second = 1000,
		_minute = _second * 60,
		_hour = _minute * 60,
		_day = _hour * 24;
	// 計算時間
		var hours = Math.floor((difference % _day) / _hour),
			minutes = Math.floor((difference % _hour) / _minute),
			seconds = Math.floor((difference % _minute) / _second);

		// 強制顯示兩位
		hours = (String(hours).length >= 2) ? hours : '0' + hours;
		minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
		seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;
		// 賦值
		$(".discount_Number").find('.discount_Number_hour').text(hours);
		$(".discount_Number").find('.discount_Number_min').text(minutes);
		$(".discount_Number").find('.discount_Number_second').text(seconds);
};

function currentDate(){
	//獲取當地的時間
	var date = new Date();
	// 將獲取到的時間轉化為UTC格式
	var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
	// 計算算入偏移量后的當地時間
	var new_date = new Date(utc + (3600000 * 8))
	return new_date;
};

/*發現新品詳情頁跳轉*/
// function discountOnload(){
// 	$('.discount_goodEach').on('click',function(){
// 		var id = $(this).data('id');
// 		window.open('/page/easybuy/goodDetails/discountDetails.html?id=' + id +'');
// 	})
// }

function discountScroll(){
	/*定義頁碼*/
	var page = 1;
	/*定義是否滾動完的參數*/
	var over = false;
	/*距下边界长度*/
	var range = 50;
	/*滾動方向判斷*/
	var lastScroll = 0;
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
	  	lazyLoad()
	  	checkScroll()
	}
	/*檢測是否到底部*/
	function checkScroll(){
		var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos) + 1200;//加了400是想在距離底部還有400px的時候就提前請求
        if(!over){
        	if(($(document).height()-range) <= totalheight) {
        		$('.loadingnow').show()
	        	discountListBoxAppend(page);
				page++;
	        }	
        }else{
        	return false;
        }
	}
	/*是否滾出視區*/
	/*這裡的想法是如果是檢測是否已經滾出範圍的話這個時候就需要循環遍歷，還是會存在遍歷多個造成卡的問題,所以只能修改成檢測是否是向上滾動*/
	function upScroll(){
		
	}

	
	/*檢測是否到達視區*/
	function lazyLoad(){
		var aLi = $('.discount_goods .discount_goodEach.noPic');
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
	function setImg(idx){
		var ali = $('.discount_goods .discount_goodEach.noPic .discount_goodEach_pic');
	    var aLiImg = $('.discount_goods .discount_goodEach.noPic .discount_goodEach_pic').children('img');
	    var secondimg = $(ali[idx]).siblings('.discount_goodEach_mess').find('.discount_goodEach_sizeShow img')
	    secondimg.each(function(){
	    	$(this).attr('src',$(this).attr('src'));
	    })
	   	var src= $(aLiImg[idx]).attr('src');
	    $(aLiImg[idx]).attr('src',src);
	    // $(aLiImg[idx]).load(function(){
	    // 	$(this).css('opacity','1')
	    // 	$(this).parents('.discount_goodEach').removeClass('noPic')
		// })
		$(aLiImg[idx]).css('opacity','1');
		$(aLiImg[idx]).parents('.discount_goodEach').removeClass('noPic');
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
	$(window).off('scroll').on('scroll',throttling(handle, 300, 1000))
}

// 點擊商品跳轉到今日降價商品詳情頁
function goDetail(a,b){
	var dataId=$(a).parents("[data-id]").attr("data-id");
	console.log(dataId);
	window.open("http://shopping.macaoeasybuy.com/goodDetails/discountDetails.html?id="+dataId);
}

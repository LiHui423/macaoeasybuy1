// easyBuy.global.beforeDataJs = function(){
// 	limitedScroll();
// 	bannerPicBox(); //加載banner
// 	hottestBox(); //加載最搶手模塊
// 	recentlyLookBox(); //加載最近查看的粉絲
// 	hotListBoxHtml();  //限量清單模板
// }
(function(){
	limitedScroll();
	bannerPicBox(); //加載banner
	hottestBox(); //加載最搶手模塊
	recentlyLookBox(); //加載最近查看的粉絲
	hotListBoxHtml();  //限量清單模板
})
//最搶手 的進度條
function calcProgressBar(){
	var $schedule = $(".hottestBox_each_schedule");
	var scheduleWidth = $(".hottestBox_each_schedule").width();
	$.each($schedule, function() {
		var allNumber = $(this).find(".hottestAllNumber").html();
		var LastNumber = $(this).find(".hottestLastNumber").html();
		if(LastNumber < 0){
			$(this).find(".hottestBox_each_scheduleCurr").hide();
		}
		$(this).find(".hottestBox_each_scheduleCurr").css('width',10 + scheduleWidth*LastNumber/allNumber + 'px');
	});
}
//限量清單的進度條
function calcHotListBar(obj){
	var $schedule = obj.find('.ListBox_goodsEach_schedule');
	var scheduleWidth = obj.find('.ListBox_goodsEach_schedule').width();
	$.each($schedule, function() {
		var allNumber = $(this).find(".ListBox_goodsEach_allNum").html();
		var LastNumber = $(this).find(".ListBox_goodsEach_lastNum").html();
		if(LastNumber <= 0){
			$(this).find(".ListBox_goodsEach_scheduleCurr").hide();
		}else if(LastNumber >= allNumber){
			$(this).find(".ListBox_goodsEach_scheduleCurr").css('width','220px');
		}else{
			$(this).find(".ListBox_goodsEach_scheduleCurr").css('width',10 + scheduleWidth*LastNumber/allNumber + 'px');
		}
	});
}
//限量搶購滾動
function limitedScroll(){
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
	        if(curTime-startTime>=maxTimelong){
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
	  	lazyLoad();
	  	checkScroll();
	}
	/*檢測是否到底部*/
	function checkScroll(){
		var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos) + 1200;//加了400是想在距離底部還有400px的時候就提前請求
        if(!over){
        	if(($(document).height()-range) <= totalheight) {
        		$('.loadingnow').show()
	        	hotListBoxAppend(page);
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
		var aLi = $('.limited_ListBox_goods .ListBox_goodsEach.noPic');
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
	/*設置顯示圖片 */
	function setImg(idx){
	    var aLiImg = $('.limited_ListBox_goods .ListBox_goodsEach.noPic .ListBox_goodsEach_pic').children('img')
	   	var src= $(aLiImg[idx]).attr('src');
	    $(aLiImg[idx]).attr('src',src);
	    // $(aLiImg[index]).each(function(){
	    // 	$(this).on('load',function(){
	    // 		$(this).css('opacity','1');
	    // 		$(this).parents('.ListBox_goodsEach').removeClass('noPic');
	    // 	});
		// });
		$(aLiImg[idx]).each(function(){
			$(this).css('opacity','1');
			$(this).parents('.ListBox_goodsEach').removeClass('noPic');
		})
	}
	//執行隱藏
	function hideDocument(obj){
		var page  = $(obj).parents('.listBoxEach').data('page');
		/*執行隱藏*/
		if(page >= 3){
			$('[data-page = '+ (page-2) +']').find('.ListBox_goodsEach').hide();
			$('[data-page = '+ (page-2) +']').css('height','2830px')
		}
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
	$(window).off('scroll').on('scroll',throttling(handle, 50, 1000));
}

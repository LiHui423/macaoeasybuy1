$(function(){
	chooseTypeBox()
	chooseTypeSlide()
	limitedScroll()
})

/*選擇分類的下拉*/
function chooseTypeSlide(){
	$(".goodBox_choose_type").click(function(){
		if($(this).find(".goodBox_choose_type_slide").hasClass("hideSlide")){
			$(this).find(".goodBox_choose_type_slide").stop(true,true).slideDown('fast').removeClass("hideSlide");
			$(".transparent_bg").show();
		}else{
			$(this).find(".goodBox_choose_type_slide").stop(true,true).slideUp("fast").addClass("hideSlide");
			$(".transparent_bg").hide();
		}
	})
	$(".goodBox_choose_type_slide ul li").click(function(event){
		$(this).addClass("goodBox_choose_type_curr").siblings("li").removeClass("goodBox_choose_type_curr");
		$(".goodBox_choose_type_text").text($(this).find("a").text());
		$(".goodBox_choose_type_slide").slideUp().addClass("hideSlide");
		$(".transparent_bg").hide();
		event.stopPropagation();
		var Areaid = $(".goodBox_choose_type_curr").data("id");
		var order = $(".sortEach.choose_sortCurr").data("id");
		if(Areaid == 5){
			$(".findNew_main_goodBox_themeBox").hide()
		}else{
			$(".findNew_main_goodBox_themeBox").show()
		}
		if($(".trueEach").hasClass("choose_sortCurr")){
			findNewListBoxHtml(order,1,Areaid)
		}else{
			findNewListBoxHtml(order,0,Areaid)
		}
		showFindNewBox(Areaid);
	})
	
	$(".transparent_bg").click(function(){
		$(".transparent_bg").hide();
		$(".goodBox_choose_type_slide").slideUp().addClass("hideSlide");
		event.stopPropagation();
	})
}
/*選擇排序*/
function chooseTypeBox(){
	$(".goodBox_checkBox").click(function(){
		$(this).parent(".sortEach").addClass("choose_sortCurr").siblings(".sortEach").removeClass("choose_sortCurr");
		var Areaid = $(".goodBox_choose_type_curr").data("id");
		var order = $(".sortEach.choose_sortCurr").data("id");
		if($(".trueEach").hasClass("choose_sortCurr")){
			findNewListBoxHtml(order,1,Areaid)
		}else{
			findNewListBoxHtml(order,0,Areaid)
		}
	})
	$(".trueEach").click(function(){
		var Areaid = $(".goodBox_choose_type_curr").data("id");
		var order = $(".sortEach.choose_sortCurr").data("id");
		if($(this).hasClass("choose_sortCurr")){
			$(this).removeClass("choose_sortCurr");
			findNewListBoxHtml(order,0,Areaid)
		}else{
			$(this).addClass("choose_sortCurr");
			findNewListBoxHtml(order,1,Areaid)
		}
	})
}

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
	  	upScroll()
	}
	/*檢測是否到底部*/
	function checkScroll(){
		var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos) + 1200;//加了400是想在距離底部還有400px的時候就提前請求
        var Areaid = $(".goodBox_choose_type_curr").data("id");
		var order = $(".sortEach.choose_sortCurr").data("id");
        if(!over){
        	if(($(document).height()-range) <= totalheight) {
        		$('.loadingnow').show()
	        	if($(".trueEach").hasClass("choose_sortCurr")){
					findNewListBoxAppend(page,order,1,Areaid)
				}else{
					findNewListBoxAppend(page,order,0,Areaid)
				}
				page++;
	        }	
        }else{
        	return false;
        }
	}
	/*是否滾出視區*/
	/*這裡的想法是如果是檢測是否已經滾出範圍的話這個時候就需要循環遍歷，還是會存在遍歷多個造成卡的問題,所以只能修改成檢測是否是向上滾動*/
	function upScroll(){
		$(window).scroll(function(){
			var scroH = $(this).scrollTop();
			if(lastScroll < scroH){
				
			}else if(lastScroll == scroH){
				
			}else{
				
			}
			lastScroll = scroH;
		})
	}

	
	/*檢測是否到達視區*/
	function lazyLoad(){
		var aLi = $('.findNew_main_goodBox_goodList .findNew_main_goodBox_goodEach.noPic');
	    var t = document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop)-300;
	    for (var i = 0, l = aLi.length; i < l; i++) {
	        var oLi = aLi[i];
	        //检查oLi是否在可视区域
	        var h = getH(oLi);
	        if (h < t) {
	        	setImg(i)
	        }
	    }
	}//
	function setImg(idx){
		var aLiImg = $('.findNew_main_goodBox_goodList .findNew_main_goodBox_goodEach.noPic .findNew_goodBox_each_pic').children('img');
		var src= $(aLiImg[idx]).attr('src');
		$(aLiImg[idx]).attr('src',src);
		$(aLiImg[idx]).css('opacity','1');
		$(aLiImg[idx]).parents('.findNew_main_goodBox_goodEach').removeClass('noPic');
	    // $(aLiImg[idx]).load(function(){
	    // 	$(this).css('opacity','1');
	    // 	$(this).parents('.findNew_main_goodBox_goodEach').removeClass('noPic')
	    // })
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
	$(window).off('scroll').on('scroll',throttling(handle, 300, 1000))
}




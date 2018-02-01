$(function(){
	chooseTypeBox()
	chooseTypeSlide()
	hitScroll();
	var timer = setInterval(scrollText,5000);
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
		if($(".trueEach").hasClass("choose_sortCurr")){
			hitListBoxHtml(order,1,Areaid)
		}else{
			hitListBoxHtml(order,0,Areaid)
		}
		hitScrollLoad();
	})
	
	$(".transparent_bg").click(function(){
		$(".transparent_bg").hide();
		$(".goodBox_choose_type_slide").slideUp().addClass("hideSlide");
		event.stopPropagation();
	})
}
/*本周熱賣選擇排序*/
function chooseTypeBox(){
	$(".goodBox_checkBox").click(function(){
		$(this).parent(".sortEach").addClass("choose_sortCurr").siblings(".sortEach").removeClass("choose_sortCurr");
		var Areaid = $(".goodBox_choose_type_curr").data("id");
		var order = $(".sortEach.choose_sortCurr").data("id");
		if($(".trueEach").hasClass("choose_sortCurr")){
			hitListBoxHtml(order,1,Areaid)
		}else{
			hitListBoxHtml(order,0,Areaid)
		}
		hitScrollLoad()
	})
	$(".trueEach").click(function(){
		var Areaid = $(".goodBox_choose_type_curr").data("id");
		var order = $(".sortEach.choose_sortCurr").data("id");
		if($(this).hasClass("choose_sortCurr")){
			$(this).removeClass("choose_sortCurr");
			hitListBoxHtml(order,0,Areaid)
		}else{
			$(this).addClass("choose_sortCurr");
			hitListBoxHtml(order,1,Areaid)
		}
		hitScrollLoad()
	})
}

//本周熱賣滾動加載
/*function hitScrollLoad(){
	var page = 1;
	var range = 100; //距下边界长度/单位px
    var totalheight = 300;
    var isLoading = false;
	var Overloading = false;
    $(window).off('scroll').on('scroll',function(){
    	if(isLoading){
			return false;
		}
    	if(Overloading){
			return false;
		}
    	var Areaid = $(".goodBox_choose_type_curr").data("id");
		var order = $(".sortEach.choose_sortCurr").data("id");
        var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);  
        if(($(document).height()-range) <= totalheight) {
        	if($(".trueEach").hasClass("choose_sortCurr")){
        		isLoading =true;
				hitListBoxAppend(page,order,1,Areaid)
				setInterval(function(){
					isLoading = false;
				},600)
			}else{
				isLoading =true;
				hitListBoxAppend(page,order,0,Areaid)
				setInterval(function(){
					isLoading = false;
				},600)
			}
			page++
       }
    });
}*/

//瀑布流
function waterfall(outer,item,num,margin,width) {
	var totalWidth = outer.width();
	var eachWidth = item.outerWidth(true) + width;
	var columNum = num;
	var margin = margin;
	var heightArr = [];
	for(var i = 0; i < columNum; i++) {
		heightArr[i] = 0;
	}
	var elementItems = item;
	elementItems.each(function(idx, ele) {
		var minIndex = 0;
		var minValue = heightArr[minIndex];
		for(var i = 0; i < heightArr.length; i++) {
			if(heightArr[i] < minValue) {
				minIndex = i;
				minValue = heightArr[i];
			}
		}
		$(ele).css({
			"left": eachWidth * minIndex + width,
			"top": minValue
		});
		var oldHeight = heightArr[minIndex];
		oldHeight += $(ele).outerHeight(true)+ margin;
		heightArr[minIndex] = oldHeight;
		outer.css("height",arrayGetMax(heightArr));
	});
	return heightArr;
}
//獲取數組最大值
function arrayGetMax(a){
	var max = a[0];
	for(var i=1;i<a.length;i++){ 
	  if(max<a[i]){
	  	max=a[i];
	  }
	}
	return max;
}
//評論上下滾動
//以下是針對每一個評論創建一個計時器
/*function scrollText(){
	var scrollBox = document.getElementsByClassName('goodEach_commentMain_ul');
	for(var i = 0; i<scrollBox.length;i++){
		(function(){
			var j = i;
			scrollBox[j].timer = setInterval(runScroll,3000);
			scrollBox[j].onmouseenter = function(){
				clearInterval(this.timer);
			}
			scrollBox[j].onmouseleave = function(){
				this.timer = setInterval(runScroll,3000);
			}
			function runScroll(){
				var lis = $(scrollBox[j]).find('li');
				if(lis.length > 1){
					lis.eq(0).animate({　　　　　　　　
						marginTop: "-170px",
						opacity:"0"　　　　　　
					}, 1500, function() {　　　　　　　　
						$(this).css({
							marginTop: "0px",
							opacity:"1"　
						}).appendTo($(this).parent());　　　　　　
					});
				}
			}
		})()
	}
}*/
//以下是只創建一個計時器
function scrollText(){
	var scrollBox = document.getElementsByClassName('goodEach_commentMain_ul');
	$.each(scrollBox, function() {
		var $lis = $(this).find('li');
		if($lis.length > 1){
			$lis.eq(0).animate({　　　　　　　　
				marginTop: "-170px",
				opacity:"0"　　　　　　
			}, 1200, function() {　　　　　　　　
				$(this).css({
					marginTop: "0px",
					opacity:"1"　
				}).appendTo($(this).parent());　　　　　　
			});
		}
	});
}

/*發現新品詳情頁跳轉*/
function hitOnload(){
	$('.hit_main_goodEach_mess').on('click',function(){
		var id = $(this).parents('[data-id]').attr('data-id');
		window.open('http://shopping.macaoeasybuy.com/goodDetails/ordinaryGoodDetais.html?id=' + id +'');
	})
}


function hitScroll(){
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
        var Areaid = $(".goodBox_choose_type_curr").data("id");
		var order = $(".sortEach.choose_sortCurr").data("id");
		var isLoading;
        if(!over){
        	if($(".trueEach").hasClass("choose_sortCurr")){
        		isLoading =true;
				hitListBoxAppend(page,order,1,Areaid)
				setInterval(function(){
					isLoading = false;
				},600)
			}else{
				isLoading =true;
				hitListBoxAppend(page,order,0,Areaid)
				setInterval(function(){
					isLoading = false;
				},600)
			}
			page++
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
		var aLi = $('.hit_main_goodList .hit_main_goodEach.noPic');
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
	    var aLiImg = $('.hit_main_goodList .hit_main_goodEach.noPic .hit_goodEach_messLeft').children('img');
	   	var src= $(aLiImg[index]).data('src');
	    $(aLiImg[index]).attr('src',src);
	    // $(aLiImg[index]).load(function(){
	    // 	$(this).css('opacity','1')
	    // 	$(this).parents('.hit_main_goodEach').removeClass('noPic')
		// })
		$(aLiImg[index]).css('opacity','1');
		$(aLiImg[index]).parents('.hit_main_goodEach').removeClass('noPic');
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

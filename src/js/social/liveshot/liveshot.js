$(function(){
	clickTabFunction($(".liveshotBox_topic_main"),3,$(".liveshotBox_topic_leftBtn"),$(".liveshotBox_topic_rightBtn"),440,3,90);
	labelRankTab();
	clickLabelScroll();
	showHover();
	easyBuy.global.dep.waterfall($('.liveshotBox_postList_main'),$('.pillar-all'),6,15,15);
	setPosition();
	clickEvent();//页面点击事件
})

function clickTabFunction($targetDiv,showNumber,$leftBtn,$RightBtn,scrollWidth,scrollNumber,otherWidth){
	var i = 1;
	var $length = Math.ceil($targetDiv.children('ul').children("li").length/scrollNumber);
	$leftBtn.click(function(){
		if(i > 1){
			if($(this).siblings("ul").is(":animated")){
				return;
			}else{
				var l = parseInt($(this).siblings("ul").css("left")) + scrollWidth * scrollNumber + otherWidth;
				$(this).siblings("ul").animate({
					"left":l
				},800)
				i--;
			}
		}else{
			return;
		}
	})
	$RightBtn.click(function(){
		if(i <= $length - showNumber/scrollNumber){
			if($(this).siblings("ul").is(":animated")){
				return;
			}else{
				var l = parseInt($(this).siblings("ul").css("left")) - scrollWidth * scrollNumber - otherWidth;
				$(this).siblings("ul").animate({
					"left":l
				},800)
				i = i + 1;
			}
		}else{
			return;
		}
	})
}
function showHover(){
	$(".liveshotBox_talent_eachPic").hover(function(){
		if($(this).children('.liveshotBox_talent_cover').is(":animated")){
			return;
		}else{
			$(this).children('.liveshotBox_talent_cover').fadeIn(300);
		}
	},function(){
		$(this).children('.liveshotBox_talent_cover').fadeOut(300);
	})
}
function clickLabelScroll(){
	var i = 1;
	var $length = $(".liveshotBox_labelRank_scroll ul li").length;
	$(".liveshotBox_labelRank_BtnLeft").click(function(){
		if(i > 1){
			if($(".liveshotBox_labelRank_scroll").children("ul").is(":animated")){
				return;
			}else{
				l = parseInt($(".liveshotBox_labelRank_scroll").children("ul").css("left")) + 1200;
				$(".liveshotBox_labelRank_scroll").children("ul").animate({
					"left":l
				},800)
				i--;
			}
		}else{
			return;
		}
	})
	$(".liveshotBox_labelRank_BtnRight").click(function(){
		if(i <= $length - 1){
			if($(".liveshotBox_labelRank_scroll").children("ul").is(":animated")){
				return;
			}else{
				l = parseInt($(".liveshotBox_labelRank_scroll").children("ul").css("left")) - 1200;
				$(".liveshotBox_labelRank_scroll").children("ul").animate({
					"left":l
				},800)
				i = i + 1;
			}
		}else{
			return;
		}
	})
	$(".liveshotBox_labelRank_BtnLeft").hover(function(){
		$(this).css('background','rgba(0,0,0,0.2)')
	},function(){
		$(this).css('background','transparent')
	})
	$(".liveshotBox_labelRank_BtnRight").hover(function(){
		$(this).css('background','rgba(0,0,0,0.2)')
	},function(){
		$(this).css('background','transparent')
	})
}

function labelRankTab(){
	$(".liveshotBox_labelRank_tab ul li").click(function(){
		$(this).addClass("labelRank_tab_curr").siblings().removeClass("labelRank_tab_curr");
		$(this).find('span:nth-child(1) img').attr('src','//img.macaoeasybuy.com/img/common/icon/labelIcon_white.png');
		$(this).siblings().find('span:nth-child(1) img').attr('src','//img.macaoeasybuy.com/img/common/icon/labelIcon_red.png')
	})
}

function setPosition(){
	$(".liveshotBox_labelRank_scroll ul li").hover(function(){
		var $lis = $(this).find('.liveshotBox_labelEach');
		$lis.hover(function(){
			var index = $lis.index(this);
			$('.liveshotBox_labelEach_showMess').find('.liveshotBox_labelEach_title').text($(this).find('.hiddenText').text())
			if(index < 6){
				$('.liveshotBox_labelEach_showMess').css('left',190 * index).css('top',90).show(0)
			}else if(5 < index&&index < 12){
				$('.liveshotBox_labelEach_showMess').css('left',190 * (index - 6)).css('top',150).show(0)
			}else if(11 < index&&index < 18){
				$('.liveshotBox_labelEach_showMess').css('left',190* (index - 12)).css('top',200).show(0)
			}
		},function(){
			$('.liveshotBox_labelEach_showMess').hide(0)
		})
	},function(){
		$('.liveshotBox_labelEach_showMess').hide(0)
	})
}

function consoletest(){
}

/*綁定滾動加載*/
function postScroll(){
	/*定義頁碼*/
	var Page = 1;
	/*定義是否滾動完的參數*/
	var over = false;
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
	}
	/*檢測是否到底部*/
	function checkScroll(){
		var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        var totalheight = parseFloat($(window).height()) + parseFloat(srollPos)+1200;//加了400是想在距離底部還有400px的時候就提前請求
        if(over == false){
        	if(($(document).height()-range) <= totalheight) {
        		$('.loadNow').show()
	        	postFuncAppend(Page)
				Page++;
	        }
        }else{
        	return false;
        }
	}

	/*綁定滾動*/
	$(window).off('scroll.throttlescroll').on('scroll.throttlescroll',throttling(handle, 100, 500))
}
// 頁面點擊事件
function clickEvent(){
	$('body').on('click',function(e){
		var target=e.target;
		if($(target).attr('id') === "underline"){
			var postId=$(target).parents('[data-id]').attr('data-id');
			window.open('http://social.macaoeasybuy.com/liveshot/ProdigalPostDetail/ProdigalPostDetail.html?postId='+postId);
			
		}
		if($(target).html() === '查看曬圖'){
			var userId=$(target).parents('[data-id]').attr('data-id');
			// 跳轉到用戶空間敗家志處
		}
		if($(target).hasClass('shadow-box')){
			var postId=$(target).parents('[data-id]').attr('data-id');
			window.open('http://social.macaoeasybuy.com/liveshot/ProdigalPostDetail/ProdigalPostDetail.html?postId='+postId);

		}
	})
}

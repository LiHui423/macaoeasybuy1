$(function(){
	var day = new Date().getDay();
	setCookie('MEB_Route',window.location.href,day);
	leftNav();
	indexBanner();
	indexScrollFunc();
	indexChangeFunc();
	
})
// easyBuy.global.afterDataJs = function(){
// 	leftNav();
// 	indexBanner();
// 	indexScrollFunc();
// 	indexChangeFunc();
// 	var day = new Date().getDay();
// 	setCookie('MEB_Route',window.location.href,day);
// };

/*頭部左側導航欄上下切換*/
function leftNav(){
	var scrollNum = 0;
	/*計算list的高度*/
	var num  = $('.index_headBox_left_mainEach').length;
	$('.index_headBox_left_mainList').height(93 * num + "px");
	if(num > 7){
		/*長度大於7綁定上下切換效果*/
		$('.index_headBox_left_iconTop').on('click',function(){
			if(scrollNum > 0){
				scrollNum--;
				$(".index_headBox_left_mainList").animate({
					'top': -(scrollNum * 93)
				})
			}
		})
		$('.index_headBox_left_iconBottom').on('click',function(){
			if(num - scrollNum > 7){
				scrollNum++;
				$(".index_headBox_left_mainList").animate({
					'top': -(scrollNum * 92)
				})
			}
		})
	}else{
		/*長度小於7上下切換失效*/
		$('.index_headBox_left_iconTop').addClass('index_headBox_left_icon_curr');
		$('.index_headBox_left_iconBottom').addClass('index_headBox_left_icon_curr');
	}
	/*劃出右側欄目*/
	hoverFunc();
}


function hoverFunc(){
	/*初始化需要用到的變量*/
	var delay = 10,
		timer1 = null,
		timer2 = null,
		status = false;
	/*事件綁定對象集合*/
	var list = $('.index_headBox_left_curr');
	var showList = $('.index_headBox_left_slideBar').find('.index_headBox_left_slideBox');

	$('.index_headBox_left_curr').hover(function(){
		//鼠標移入時
		var index = list.index(this)
		showList.eq(index).show().addClass('index_headBox_left_slideBox_curr').siblings().hide().removeClass('index_headBox_left_slideBox_curr');
		$('.index_headBox_left_slideBar').show(0)
		$(this).addClass('border_curr')
		if(index == 0){
			$(this).removeClass('prevborder_curr')
		}else{
	  		$(this).prev().addClass('prevborder_curr').siblings().removeClass('prevborder_curr');
		}
	},function(){
		var self = $(this);
		var index = list.index(this);
			//鼠標移出時
		$('.index_headBox_left_slideBar').hide(0)
		self.removeClass('border_curr');
		if(index == 0){
			self.removeClass('prevborder_curr')
		}else{
			self.prev().removeClass('prevborder_curr').siblings().removeClass('prevborder_curr');
		}
	})

	$('.index_headBox_left_slideBar').hover(function(){
		$(this).show(0);
		var showbox = $('.index_headBox_left_slideBox_curr');
		var index = showList.index(showbox);
		list.eq(index).addClass('border_curr');
		if(index == 0){
			return;
		}else{
	  		$('.border_curr').prev().addClass('prevborder_curr');
		}
	},function(){
		$(this).hide(0);
		var showbox = $('.index_headBox_left_slideBox_curr');
		var index = showList.index(showbox);
		list.eq(index).removeClass('border_curr');
		if(index == 0){
			$(this).removeClass('prevborder_curr');
		}else{
	  		$('.border_curr').prev().removeClass('prevborder_curr');
		}
	})
}

/*切換圖片*/
function indexBanner(){
	var $museumTabs = $(".index_headBox_right_banner_intro ul li");
	var $museumas = $(".index_headBox_right_banner_pic a")
	$museumTabs.hover(function(){
		clearInterval(museumBannerTimer)
		$(this).addClass("index_banner_curr").siblings().removeClass("index_banner_curr");
		var index = $museumTabs.index(this);
		doFunction(index);
	},function(){
		museumBannerTimer = setInterval(museumBannerTiming,2000);
	})


	function museumBannerTiming(){
		var index = $museumTabs.index($(".index_banner_curr"));
		if(index < $museumTabs.length-1){
			doFunction(index+1);
		}else if(index = $museumTabs.length-1){
			index = 0;
			doFunction(0);
		}
	}
	museumBannerTimer = setInterval(museumBannerTiming,1000);

	function doFunction(x){
		$museumTabs.eq(x).addClass("index_banner_curr").siblings().removeClass("index_banner_curr");
		$museumas.eq(x).stop().animate({
			opacity:"1"
		}).css('z-index','1').siblings().stop().animate({
			opacity:"0"
		}).css('z-index','0');
	}

	var i = 0;
	/*上下切換*/
	$('.index_headBox_top').on('click',function(){
		if(i > 0){
			if($(this).siblings(".index_headBox_right_bannerli").find('ul').is(":animated")){
				return;
			}else{
				h = parseInt($(this).siblings(".index_headBox_right_bannerli").find('ul').css("top")) + 50;
				$(this).siblings(".index_headBox_right_bannerli").find('ul').animate({
					"top":h
				},150)
				i--;
			}
		}else{
			return;
		}
	})
	$('.index_headBox_bottom').on('click',function(){
		if(i < $museumTabs.length-5){
			if($(this).siblings(".index_headBox_right_bannerli").find('ul').is(":animated")){
				return;
			}else{
				h = parseInt($(this).siblings(".index_headBox_right_bannerli").find('ul').css("top")) - 50;
				$(this).siblings(".index_headBox_right_bannerli").find('ul').animate({
					"top":h
				},150)
				i++;
			}
		}else{
			return;
		}
	})
}
/*切換商店*/
function indexScrollFunc(){
	var i = 1;
	$('.showshop_bottom_prev').click(function(){
		if(i > 1){
			if($(this).parents('.index_headBox_right_showshop_bottom').siblings(".index_headBox_right_showshop_middle").find('ul').is(":animated")){
				return;
			}else{
				l = parseInt($(this).parents('.index_headBox_right_showshop_bottom').siblings(".index_headBox_right_showshop_middle").find('ul').css("left")) + 798;
				$(this).parents('.index_headBox_right_showshop_bottom').siblings(".index_headBox_right_showshop_middle").find('ul').animate({
					"left":l
				},800)
				i--;
			}
		}else{
			return;
		}
	})

	$('.showshop_bottom_next').click(function(){
		if(i < 2){
			if($(this).parents('.index_headBox_right_showshop_bottom').siblings(".index_headBox_right_showshop_middle").find('ul').is(":animated")){
				return;
			}else{
				l = parseInt($(this).parents('.index_headBox_right_showshop_bottom').siblings(".index_headBox_right_showshop_middle").find('ul').css("left")) - 798;
				$(this).parents('.index_headBox_right_showshop_bottom').siblings(".index_headBox_right_showshop_middle").find('ul').animate({
					"left":l
				},800)
				i++;
			}
		}else{
			return;
		}
	})
}

/*福利社換一換*/
function indexChangeFunc(){
	var index = 1;
	$('.indexChange').on('click',function(){
		if(index < 3){
			var _this = $('.index_easylife_main_tabbox_curr');
			_this.removeClass('index_easylife_main_tabbox_curr').animate({
				opacity:"0"
			}).css('z-index','0').next().addClass('index_easylife_main_tabbox_curr').animate({
				opacity:"1"
			}).css('z-index','1');
			index++;
		}else{
			index = 1;
			$('.index_easylife_main_tabbox:nth-of-type(1)').addClass('index_easylife_main_tabbox_curr').animate({
				opacity:"1"
			}).css('z-index','1').siblings().removeClass('index_easylife_main_tabbox_curr').animate({
				opacity:"0"
			}).css('z-index','0');
		}
	})
}

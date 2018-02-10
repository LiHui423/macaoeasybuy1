$(function(){
	museumHeadSlide();
	museumBanner();
	todayDesign();
	popularDesign();
})

function museumHeadSlide(){
	$(".museum_navSlide_btn").click(function(){
		if($(".museumHome_head").hasClass("museumHome_head_slideUp")){
			$(".museumHome_head").removeClass("museumHome_head_slideUp").animate({height:"270px"});
			$(".museum_navSlide_btn").find("img").attr("src","/img/easybuy/museum/icon/museum_top_up.png");
		}else{
			$(".museumHome_head").addClass("museumHome_head_slideUp").animate({height:"225px"});
			$(".museum_navSlide_btn").find("img").attr("src","/img/easybuy/museum/icon/museum_top_down.png")
		}
	})
}

function museumBanner(){
	var $museumTabs = $(".museum_banner_tabBox ul li");
	var $museumas = $(".museum_banner_showBox a")
	$museumTabs.hover(function(){
		clearInterval(museumBannerTimer)
		$(this).addClass("museum_banner_tabcurr").siblings().removeClass("museum_banner_tabcurr");
		var index = $museumTabs.index(this);
		doFunction(index);
	},function(){
		var museumBannerTimer = setInterval(museumBannerTiming,2000);
	})

	function museumBannerTiming(){
		var index = $museumTabs.index($(".museum_banner_tabcurr"));
		if(index < 5){
			doFunction(index+1);
		}else if(index = 5){
			index = 0;
			doFunction(0);
		}
	}
	var museumBannerTimer = setInterval(museumBannerTiming,2000);

	function doFunction(x){
		$museumTabs.eq(x).addClass("museum_banner_tabcurr").siblings().removeClass("museum_banner_tabcurr");
		$museumas.eq(x).stop().animate({
			opacity:"1"
		}).siblings().stop().animate({
			opacity:"0"
		})
	}
}


function todayDesign(){
	var i = 1;
	var $length = $(".museum_todayDesign_box ul li").length;
	hoverMess($(".museum_todayDesign_box ul li"),".museum_goods_cover");

	$(".todayDesign_box_leftBtn").click(function(){
		if($(".museum_todayDesign_box ul").css("left") == "-120px"){
			l = parseInt($(".museum_todayDesign_box ul").css("left")) + 120;
			$(".museum_todayDesign_box ul").animate({
				"left":l
			},500)
			i = 1;
		}else if(i > 1){
			if($(".museum_todayDesign_box ul").is(":animated")){
				return;
			}else{
				l = parseInt($(".museum_todayDesign_box ul").css("left")) + 300;
				$(".museum_todayDesign_box ul").animate({
					"left":l
				},500)
				i--;
			}
		}else{
			return;
		}
	})
	$(".todayDesign_box_rightBtn").click(function(){
		if(i < $length - 4){
			if($(".museum_todayDesign_box ul").is(":animated")){
				return;
			}else{
				l = parseInt($(".museum_todayDesign_box ul").css("left")) - 300;
				$(".museum_todayDesign_box ul").animate({
					"left":l
				},500)
				i++;
			}
		}else if(i == $length - 4){
			if($(".museum_todayDesign_box ul").is(":animated")){
				return;
			}else{
				l = parseInt($(".museum_todayDesign_box ul").css("left")) - 120;
			$(".museum_todayDesign_box ul").animate({
				"left":l
			},500)
			i++;
			}
		}else{
			return;
		}
	})
}

function popularDesign(){
	hoverMess($(".popularDesign_li"),".museum_popularDesign_cover");
	clickTabFunction($(".museum_popularDesign_left"),4,$(".popularDesign_btnLeft"),$(".popularDesign_btnRight"),206,5);
}

function museumShowBox(){
	hoverMess($(".museum_museumShowBox_topRight ul li"),".museum_museumShowBox_cover");
	clickTabFunction($(".museum_Beautiful .museum_museumShowBox_topRight"),3,$(".museum_Beautiful .museumShowBox_topRight_btnLeft"),$(".museum_Beautiful .museumShowBox_topRight_btnRight"),230,3);
	clickTabFunction($(".museum_Practical .museum_museumShowBox_topRight"),3,$(".museum_Practical .museumShowBox_topRight_btnLeft"),$(".museum_Practical .museumShowBox_topRight_btnRight"),230,3);
	clickTabFunction($(".museum_Magical .museum_museumShowBox_topRight"),3,$(".museum_Magical .museumShowBox_topRight_btnLeft"),$(".museum_Magical .museumShowBox_topRight_btnRight"),230,3);
}

function clickTabFunction($targetDiv,showNumber,$leftBtn,$RightBtn,scrollWidth,scrollNumber){
	var i = 1;
	var $length = $targetDiv.find("li").length/scrollNumber;
	$leftBtn.click(function(){
		if(i > 1){
			if($(this).siblings("ul").is(":animated")){
				return;
			}else{
				var l = parseInt($(this).siblings("ul").css("left")) + scrollWidth * scrollNumber;
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
				var l = parseInt($(this).siblings("ul").css("left")) - scrollWidth * scrollNumber;
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

function hoverMess($targetBox,classCurr){
	$targetBox.hover(function(){
		$(this).find(classCurr).stop(true).animate({
			opacity:"1"
		},200)
	},function(){
		$(this).find(classCurr).animate({
			opacity:"0"
		},300)
	})
}

function museumTheme(){
	var $themeLi = $(".museum_themeBox_main_shwoBox ul li").length;
	$(".museum_sequenceBox").css("width",$themeLi*24);
	$(".museum_sequenceBox").css("margin-left",-$themeLi*12)
	for(var i = 0;i < $themeLi;i++){
		$(".museum_sequenceBox").append('<span></span>');
	}
	$(".museum_sequenceBox span:nth-child(1)").addClass("museum_sequence_curr");
	$(".museum_sequenceBox span").mouseenter(function(){
		$(this).addClass("museum_sequence_curr").siblings().removeClass("museum_sequence_curr");
		var index = $(".museum_sequenceBox span").index(this);
		l = -index * 1370
		$(".museum_themeBox_main_shwoBox ul").stop().animate({
			"left":l
		},500)
	})
}
function DetailsPop(){
	$(".museum_willSellBoxEach").click(function(){
		$(".detailsPopWindow").show();
		$(".headPop_BG").show();
		$(".headPop_BG").css('z-index','4');
		$('body').css('overflow','scroll');
		$('html').css('overflow-y','hidden');
		var id = $(this).data("id");
		console.log(id);
		DetailsPopBox(id);
	})

	$(".headPop_BG").click(function(){
		$(this).hide();
		$(".detailsPopWindow").hide()
		$('body').css('overflow','auto');
		$('html').css('overflow-y','scroll');
	})

}
function closeDetailsPop(){
	$(".detailsPopWindow_closeIcon").click(function(){
		$(".headPop_BG").hide();
		$(".detailsPopWindow").hide();
		$('body').css('overflow','auto');
		$('html').css('overflow-y','scroll');
	})
	$(".detailsPopWindow_Save a").click(function(){
		if($(this).hasClass("saveGoods_up")){
			$(".detailsPopWindow_Save a").removeClass("saveGoods_up").addClass("saveGoods")
			$(".detailsPopWindow_Save a").children("img").attr("src","/img/common/icon/saveGoods.png")
		}else if($(this).hasClass("saveGoods")){
			$(".detailsPopWindow_Save a").removeClass("saveGoods").addClass("saveGoods_up")
			$(".detailsPopWindow_Save a").children("img").attr("src","/img/common/icon/saveGoodsUp.png");
		}
	})
}


function museumOnload(){
	$('.museum_popularDesign_left ul li .popularDesign_li').on('click',function(){
		var id = $(this).data('id');
		window.open('http://shopping.macaoeasybuy.com/goodDetails/museumDetails.html?id=' + id +'');
	})
}

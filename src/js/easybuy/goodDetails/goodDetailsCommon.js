$(function(){
	getId()
	boomBox()
	pageHover()
	$('.sizeAssistantShow').load('/goodDetails/assistantData/assistant.html',function(){
		calcLengthFunc()
		sizeAssistant()
	})
});

/*讚好*/
function giveGreat(clickBtn,successBox,cancelBox,cancelPop,oldPic,newPic){
	clickBtn.click(function(){
		if(clickBtn.hasClass("checked")){
			successBox.css("top","500px");
			cancelBox.css("top","500px");
			cancelPop.show();
		}else{
			if(successBox.is(':animated')){
				return;
			}else{
				successBox.css('display','block').animate({
					opacity:'1',
					top:'350px'
				},"slow").animate({
					opacity:'0'
				},600,function(){
					$(this).css('display','none');
				});
				clickBtn.addClass("checked");
				clickBtn.find("img").attr("src",newPic);
				sentLoveStatus();
			}
		}
	})
	$(".sureCancel").click(function(){
		cancelPop.hide();
		clickBtn.removeClass("checked");
		clickBtn.find("img").attr("src",oldPic);
		
	})
	$(".notSureCancel").click(function(){
		cancelPop.hide();
	})
}
/*舉報彈框*/
function boomBox(){
	$(".article_report").click(function(){
		$("#bombBox").show();
	})
	$("#bombBox_back").click(function(){
		$("#bombBox").hide();
	})
}
/*計算字數*/
function calcNumber(){
	var lenInput = $('.textarea-item').val().length;
	$(".textarea-item").keyup(function() {
		lenInput = $(this).val().length;
		if(lenInput > 0 && lenInput <= 150) {
			$('.textareaInput').html(lenInput);
			$('.textarea-item').attr('disabled', false);
		} else {
			$('.textarea-item').attr("maxlength",150);
		}
	});
}
/*選擇詳情欄目*/
function tabDetailsSection(){
	$('.museumDetails_TabEach').click(function(){
		var mainHeight = $('.museumDetails_introductionBox_main').offset().top;
		console.log(mainHeight);
		$(this).addClass('museumDetails_TabEach_curr').siblings().removeClass('museumDetails_TabEach_curr');
		var index = $('.museumDetails_TabEach').index(this);
		console.log(index);
		$('.introductionBox_each').eq(index).removeClass('hide').siblings().addClass('hide');
		if($('.museumDetails_introductionBox_Tab').hasClass('nav_fixed')){
			$("body").animate({
				scrollTop:mainHeight
			},0);
		}else{
			$("body").animate({
				//60是固頂菜單欄的高度
				scrollTop:mainHeight - 60
			},0);
		}
		if(index == 1){
			if($('.introductionBox_intro ul').children().length == "0"){
				goodParameter();
			}
		}else if(index == 2){
			if($('.introductionBox_evaluation_dataBox').children().length == "0"){
				getCommentTop();
				getCommentBottom(0,2)
			}
		}else if(index == 3){
			if($('.all-main-container').children().length == "0"){
				defenderHtml();
			}
		}
	})
}
/*商品加入購物籃*/
function goodAddCart(){
	var offset = $("#shopCart").offset(); //结束的地方的元素位置
	console.log(offset);;
	$(".addShopCart,.museumDetails_addShopCar").click(function(event) { //是$(".addcar")这个元素点击促发的 开始动画的位置就是这个元素的位置为起点
		if($('.picSelected').length == '0'|| $('#goodChooseNumber').val() == "0"){
			$('.noChooseSize').fadeIn('fast')
		}else{
			var addcar = $(this);
			var img = $('.picSelected').find('img').attr('src');
			var flyer = $('<img class="u-flyer" src="' + img + '">');
			var top = $(document).scrollTop();
			flyer.fly({
				start: {
					left: event.pageX,
					top: event.pageY - $(document).scrollTop()
				},
				end: {
					left: offset.left + 20,
					top: offset.top + 10,
					width: 30,
					height: 30
				},
				onEnd: function() {
					this.destory();
				}
			});
			sentAddCartStatus();
		}
	});
	
	$('.noChooseSize_btn').on('click',function(){
		$('.noChooseSize').fadeOut('fast');
	});
	
	$('.addShopCart_success_see').on('click',function(){
		$('.addShopCart_success').fadeOut('fast');
	});
}
/*優惠券切換*/
function clickScrollFunction(tragetDiv,scrollWidth){
	var i = 1;
	var $length = tragetDiv.children(".goodMessBox_rightGift_main").find("li").length;
	tragetDiv.find(".goodMessBox_rightGift_BtnLeft").click(function(){
		if(i > 1){
			if($(this).siblings(".goodMessBox_rightGift_main").children("ul").is(":animated")){
				return;
			}else{
				l = parseInt($(this).siblings(".goodMessBox_rightGift_main").children("ul").css("left")) + scrollWidth;
				$(this).siblings(".goodMessBox_rightGift_main").children("ul").animate({
					"left":l
				},800)
				i--;
			}
		}else{
			return;
		}
	})
	tragetDiv.find(".goodMessBox_rightGift_BtnRight").click(function(){
		if(i <= $length - 1){
			if($(this).siblings(".goodMessBox_rightGift_main").children("ul").is(":animated")){
				return;
			}else{
				l = parseInt($(this).siblings(".goodMessBox_rightGift_main").children("ul").css("left")) - scrollWidth;
				$(this).siblings(".goodMessBox_rightGift_main").children("ul").animate({
					"left":l
				},800)
				i = i + 1;
			}
		}else{
			return;
		}
	})
}
/*檢測內容是否為空*/
function checkNoMain(){
	if($(".introductionBox_pic_main").find('img').length == 0){
		$(".introductionBox_noResult").show();
	}
}

/*頁面懸停*/
function pageHover(){
	$(".goodMessBox_messBox_ticketBox ul li").on('click',function(){
		$('.goodMessBox_messBox_ticketPopBox').fadeIn('fast');
		$('.headPop_BG').show();
	})
	$('.headPop_BG').on('click',function(){
		$('.headPop_BG').hide();
		$('.goodMessBox_messBox_ticketPopBox').fadeOut('fast');
	})
	$('.museumDetails_addShopCar span:nth-child(3)').hover(function(){
		$('.addShopCar_QRshow').stop(true,true).slideDown();
	},function(){
		$('.addShopCar_QRshow').stop(true,true).slideUp();
	})
}

/*獲取當前頁面id*/
function getId(){
	var url = location.href;
	var str = url.split("?");
	var strs = str[1].split("=");
	var id = strs[1]
	return id
}

/*獲取當前商品編號*/
function getNumber(){
	var number = $('.goodMessBox_intro_number').text();
	return number;
}

/*加減商品的數量*/
function calcNumber(){
	var i = 1;
	$('#goodChooseNumber').val(1)
	$('.showPrice').text($('.jg').text())
	var price =  $('.jg').text();
	var kucun = $('.kc').text();
	$('.messBox_calcBox_btnAdd').on('click',function(){
		if($('.picSelected').length == "0"){
			return;
		}
		var value = $('#goodChooseNumber').val();
		if(i < kucun){
			i++;
		}
		$('#goodChooseNumber').val(i);
		$('.showPrice').text(price*i);
	})
	$('.messBox_calcBox_btnLess').on('click',function(){
		if($('.picSelected').length == "0"){
			return;
		}
		var value = $('#goodChooseNumber').val();
		if(i > 1){
			i--;
		}
		$('#goodChooseNumber').val(i);
		$('.showPrice').text(price*i);
	})
	
	$('.picSelected').on('click',function(){
		$('.showPrice').text($('.jg').text());
	})
}

function resetAll(){
	$('.goodMessBox_messBox_eachSize').on('click',function(){
		calcNumber();
	})
	$('.goodMessBox_messBox_eachType').on('click',function(){
		calcNumber();
	})
}

/*星星評級顯示*/
function showStarLevel(){
	var $starLevel = $('.evaluation_levelEach_start_full');
	$.each($starLevel, function() {
		var width = ($(this).siblings('.evaluation_levelEach_start_number').text())/5*108;
		$(this).width(width);
	});
}

/*切換評論類型*/
function chooseEvaType(){
	$('.evaluation_choose').on('click',function(){
		$(this).addClass('evaluation_circle_curr').parent().siblings().find('.evaluation_choose').removeClass('evaluation_circle_curr');
		var type = $(this).data('id');
		getCommentBottom(0,type);
		choosePage();
	})
}

/*敗家曬圖滾動加載*/
function myscroll(height){
	var page = 1;
	$('.all-main').off('scroll');
	$('.all-main').on('scroll',function(){
		var scrollTop = $(this).scrollTop();
		var scrollHeight = height;
		var windowHeight = $(this).height();
		if(scrollTop + windowHeight >= scrollHeight){
			defenderAppend(page);
			page++
		}
	});
}

/*分頁的調用計算*/
function choosePage(){
	var allNum = $('.evaluation_circle_curr').siblings('.evaluation_number').text();
	var pageNum = Math.ceil(allNum/10)
	$(".tcdPageCode").createPage({
		pageCount: pageNum,
		current: 1,
		backFn: function(p) {
			var BestOrNotState = $('.evaluation_circle_curr').data('id');
			getCommentBottom(p-1,BestOrNotState);
		}
	});
}
/*計算分享窗的位置*/
function shareBth(){
	var id = getId()
	sessionStorage.weixinUrl = 'http://wap.macaoeasybuy.com/pview.aspx?id=' + id +'';
	sessionStorage.facebookUrl = 'https://segmentfault.com/q/1010000008120374';
	sessionStorage.facebookText = $('.goodMessBox_intro_name p:nth-child(1)').text();
	sessionStorage.picUrl = $('.museumDetails_goodMessBox_leftTop').find('img').attr('src');
	sessionStorage.introText = $('.goodMessBox_intro_mess_intro').text();
	$('.shareTo_bth').on('click',function(){
		var openUrl = "/page/common/share/share.html";//分享彈窗的地址
		var iWidth= 600; //分享彈窗的宽度;
		var iHeight=800; //分享彈窗的高度;
		var iTop = (window.screen.availHeight-30-iHeight)/2; //获得窗口的垂直位置;
		var iLeft = (window.screen.availWidth-10-iWidth)/2; //获得窗口的水平位置;
		window.open(openUrl,"","innerHeight="+iHeight+", innerWidth="+iWidth+", top="+iTop+", left="+iLeft+", depended=yes, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no, titlebar=no"); 
	})
}
/*計算尺碼的彈框長度*/
function calcLengthFunc(){
	var $showDataBox = $('.showDataBox_each');
	$.each($showDataBox, function(){
		if($(this).hasClass('showDataBox_each_dobule')){
			var width = $(this).find('.showDataBox_eachMain span').length*95*2 + 120
			if(width < 650){
				width = 650
			}
			$(this).width(width)
		}else if($(this).hasClass('showDataBox_each_four')){
			var width = $(this).find('.showDataBox_eachMain span').length*95*5 + 120
			if(width < 650){
				width = 650
			}
			$(this).width(width)
		}else{
			var width = $(this).find('.showDataBox_eachMain span').length*95 + 120
			if(width < 650){
				width = 650
			}
			$(this).width(width)
		}
		$(this).siblings('.showDataBox_each_intro').width(width)
	});
}

/*菜單吸頂*/
function scrollCeil(){
	var navHeight = $(".museumDetails_introductionBox_Tab").offset().top;
	var addCartLoacl = $('.museumDetails_goodMessBox').offset().top;
	$(window).scroll(function(){ 
	    if($(this).scrollTop() > navHeight&&$(this).scrollTop() < $('.museumDetails_othersGood').offset().top - 100){ 
	       $(".museumDetails_introductionBox_Tab").addClass("nav_fixed"); 
	    } 
	    else{ 
	       $(".museumDetails_introductionBox_Tab").removeClass("nav_fixed"); 
	    } 
    })
	$('.museumDetails_addShopCar').on('click',function(){
		$("body").animate({
			scrollTop:addCartLoacl
		},200);
	})
}

/*尺碼助手*/
function sizeAssistant(){
	$('.sizeAssistant').on('click',function(){
		if($(this).hasClass('sizeAssistant_slide')){
			$('.transparent_bg').hide();
			$('.sizeAssistantShow').fadeOut('fast');
			$(this).removeClass('sizeAssistant_slide');
		}else{
			$('.transparent_bg').show();
			$('.sizeAssistantShow').fadeIn('fast');
			$(this).addClass('sizeAssistant_slide');
		}
	})
	$('.transparent_bg').on('click',function(){
		$('.transparent_bg').hide();
		$('.sizeAssistantShow').fadeOut('fast');
		$('.sizeAssistant').removeClass('sizeAssistant_slide');
	})
	var lisList = $('.sizeAssistant_TypeBox ul li')
	lisList.on('click',function(){
		$(this).addClass('eachType_curr').siblings().removeClass('eachType_curr');
		$(this).parents('.sizeAssistant_TypeBox').siblings().find('li').removeClass('eachType_curr');
		var id = $(this).data('id');
		$('.showDataBar').find("[data-id='"+ id +"']").show().siblings().hide();
	})
}

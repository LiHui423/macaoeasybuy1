$(function(){
	searchSlide()
	QRhover()
	choostypeBar()
	chooseVoucher()
})



function mygoodbanner(obj){
    var box = obj.box // 外层容器
    var banner = obj.banner; // 轮播图
    clone();
    if(obj.childMargin){
    	var childMargin = obj.childMargin;
    }else{
    	var childMargin = 0;
    }
    var oWidth = Math.ceil(banner.children().eq(0).width()) + childMargin;//一张图片的长度

    banner.css('width',oWidth * banner.children().length);
    banner.css('left',-1 * oWidth);
    var goLeft = obj.goLeft;
    var goRight = obj.goRight;
    var index = 1;
    var len = banner.children().length-2; //图片的数量

    var interval = 2500; //多久跳一次
    var gogogo = 600; // 一张图片切换需要的时间
    var timer;
    drawCircle()

    function drawCircle(){
    	for(var i = 0;i < len;i++){
    		$('.circleBox').append("<span class='myborder-radius'></span>")
    	}
    	$('.circleBox span:nth-child(1)').addClass('circleBox_curr')
    }

    function animate(offset){
        var left = parseInt(banner.css('left')) + offset;
        if(offset>0){
            offset = '+=' + offset;
        }else{
            offset = '-=' + Math.abs(offset);
        }
        banner.animate({'left':offset},gogogo,function(){
            if(left > (-1 * oWidth)/3){
                banner.css('left', -1 * oWidth * len);
            }
            if(left < (-1 * oWidth * len)){
                banner.css('left',-1 * oWidth);
            }
        });
    }
    function play(){
    		stop();
        timer = setTimeout(function(){
            nextPage()
            play();
        },interval);
    }
    function stop(){
        clearTimeout(timer);
    }
    function clone(){
    	var first = banner.children().eq(0);
    	var last = banner.children().last();
    	first.clone(true,true).appendTo(banner);
    	last.clone(true,true).insertBefore(first);
    }

    if(obj.now){
    	var now = obj.now;
	     function showNow(index){
	    	now.html(index);
	    }
    }

    function nextPage(){
    	if(banner.is(':animated')){
            return;
        }
        if(index == len){
            index = 1;
        }
        else{
            index += 1;
        }
        animate(-1 * oWidth);
        if(obj.now){
        	showNow(index);
        }
        $('.circleBox').find('span').eq(index - 1).addClass('circleBox_curr').siblings().removeClass('circleBox_curr');
    }

    box.hover(stop,play); //鼠标移入 停止跳播
    play();
}

function searchSlide(){
	$('.shopDetails_searchBoxLeft').on('click',function(){
		if($(this).find('.shopDetails_searchBoxLeft_slideBox').css('display') == 'none'){
			$(this).find('.shopDetails_searchBoxLeft_slideBox').slideDown('fast')
		}else{
			$(this).find('.shopDetails_searchBoxLeft_slideBox').slideUp('fast')
		}
	})
	$('.shopDetails_searchBoxLeft_slideBox ul li').on('click',function(event){
		$(this).parents('.shopDetails_searchBoxLeft_slideBox').slideUp('fast');
		event.stopPropagation();
		$('.shopDetails_searchBoxLeft span:nth-child(1)').text($(this).text())
	})
}

function QRhover(){
	$('.focus_btn span:nth-child(2)').hover(function(){
		$('.addShopCar_QRshow').stop().fadeIn()
	},function(){
		$('.addShopCar_QRshow').stop().fadeOut()
	})
}

/*選擇排序方式*/
function choostypeBar(){
	$('.shopDetails_main_sorting_chooseLeft ul li').on('click',function(){
		if($(this).hasClass('sorting_curr')){
			if($(this).hasClass('choose_top')){
				$(this).removeClass('choose_top').find('span:nth-of-type(2) img').attr('src','/src/img/easybuy/moreshops/shopDetails_bottom.png')
			}else{
				$(this).addClass('choose_top').find('span:nth-of-type(2) img').attr('src','/src/img/easybuy/moreshops/shopDetails_top.png')
			}
		}else{
			if($(this).hasClass('sorting_more')){
				if($(this).hasClass('sorting_more_price')){
					$(this).find('span:nth-of-type(2) img').attr('src','/src/img/easybuy/moreshops/shopDetails_bottom.png')
				}else{
					$(this).find('span:nth-of-type(2) img').attr('src','/src/img/easybuy/moreshops/shopDetails_top.png')
				}
				$(this).addClass('sorting_curr').siblings().removeClass('sorting_curr ');
				$(this).siblings('.sorting_more').removeClass('choose_top').find('span:nth-of-type(2) img').attr('src','/src/img/easybuy/moreshops/shopDetails_null.png')
			}else{
				$(this).addClass('sorting_curr').siblings().removeClass('sorting_curr');
				$(this).siblings('.sorting_more').removeClass('choose_top').find('span:nth-of-type(2) img').attr('src','/src/img/easybuy/moreshops/shopDetails_null.png')
			}
		}
	})
}

/*勾選券*/
function chooseVoucher(){
	$('.shopDetails_main_sorting_chooseRight ul li span:nth-of-type(1)').on('click',function(){
		$(this).parents('li').addClass('sorting_chooseRight_curr').siblings().removeClass('sorting_chooseRight_curr')
	})
}

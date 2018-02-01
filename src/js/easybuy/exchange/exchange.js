$(function(){
	interchangeNavTab();
	var page1 = null;
	var page2 = null;
	var page3 = null;
	changeScrollLoad(1,1,$(".interchange_goods_popular"));
})

function clickTabFunction($targetDiv,showNumber,$leftBtn,$RightBtn,scrollWidth,scrollNumber){
	var i = 1;
	$length = $targetDiv.find("li").length/scrollNumber;
	$leftBtn.click(function(){
		if(i > 1){
			if($(this).siblings(".willbeShelves_scroll").find('ul').is(":animated")){
				return;
			}else{
				l = parseInt($(this).siblings(".willbeShelves_scroll").find('ul').css("left")) + scrollWidth * scrollNumber;
				$(this).siblings(".willbeShelves_scroll").find('ul').animate({
					"left":l
				},1000)
				i--;
			}
		}else{
			return;
		}
	})
	$RightBtn.click(function(){
		if(i <= $length - showNumber/scrollNumber){
			if($(this).siblings(".willbeShelves_scroll").find('ul').is(":animated")){
				return;
			}else{
				l = parseInt($(this).siblings(".willbeShelves_scroll").find('ul').css("left")) - scrollWidth * scrollNumber;
				$(this).siblings(".willbeShelves_scroll").find('ul').animate({
					"left":l
				},1000)
				i = i + 1;
				if((i-1)%2 == 0){
					willbeshelvesBoxAppend()
				}
			}
		}else{
			return;
		}
	})
}

function interchangeNavTab(){
	var $interchangeNavLis = $(".interchange_nav ul li")
	var $goodsLists = $(".interchange_goodsList")
	$interchangeNavLis.click(function(){
		$(this).addClass("interchange_navCurr").siblings().removeClass("interchange_navCurr");
		var status = $(this).data("id");
		var index = $interchangeNavLis.index(this);
		$goodsLists.eq(index).show().siblings().hide();
		if($goodsLists.eq(index).children(".interchange_each").length == "0"){
			var $loadBox = $goodsLists.eq(index);
			exchangeListBoxHtml(status,$loadBox);
		}else{
			changeScrollLoad();
		}
	})
}

function interchangeEachRightsEachHover(){
	$(".interchange_eachRightsEach").hover(function(){
		$(this).find(".eachRightsEach_cover").stop(false,true).animate({
			opacity:"1"
		},600);
	},function(){
		$(this).find(".eachRightsEach_cover").stop(false,true).animate({
			opacity:"0"
		},600);
	})
}


function changeScrollLoad(){
	if(page1 >= 1){
		page1 = page1;
	}else{
		page1 = 1;
	}
	if(page2 >= 1){
		page2 = page2;
	}else{
		page2 = 1;
	}
	if(page3 >= 1){
		page3 = page3;
	}else{
		page3 = 1;
	}
	var range = 50; //距下边界长度/单位px
    var totalheight = 300;;
    $(window).scroll(function(){
    	var status = $(".interchange_navCurr").data("id");
        var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);  
        if(($(document).height()-range) <= totalheight) {
        	if(status == 1 ){
				exchangeListBoxAppend(page1,1,$(".interchange_goods_popular"))
        		page1 ++;
			}else if(status == 2){
				exchangeListBoxAppend(page2,2,$(".interchange_goods_see"))
        		page2 ++;
			}else if(status == 3){
				exchangeListBoxAppend(page3,3,$(".interchange_goods_redbag"))
        		page3 ++;
			}
        }
    });
}

/*著數換領詳情頁跳轉*/
function exchangeOnload(){
	$('.willbeShelves_EachTop').on('click',function(){
		var id = $(this).parents('.interchange_each').data('id');
		window.open('http://shopping.macaoeasybuy.com/goodDetails/exchangeDetail.html?id=' + id +'');
	})
}

$(function(){
	navTab();
	chooseSortLabel($(".regionBox ul li"),"regionBox_curr");
	chooseSortLabel($(".typeBox ul li"),"typeBox_curr");
	groupBuyEndHover($(".groupBuy_end_goodsEach"),".groupBuy_end_hover");
	showDivTab();
	var page1 = null;
	var page2 = null;
	var page3 = null;
	scrollLoad(page1,page2,page3);
})

function navTab(){
	$(".navBar ul li").click(function(){
		$(this).addClass("navBarLi_curr").siblings().removeClass("navBarLi_curr");
	})
}

function chooseSortLabel(labelClick,classCurr){
	labelClick.click(function(){
		if($(this).hasClass(classCurr)){
			if($("." + classCurr).length == 1){
				return;
			}else{
				$(this).removeClass(classCurr);
			}
		}else{
			$(this).addClass(classCurr);
		}
		var page1 = 1,page2 = 1,page3 = 1;
		getLabelJson()
	})
}

function groupBuyEndHover(hoverBtn,hoverBox){
	hoverBtn.hover(function(){
		if($(this).find(hoverBox).is(':animated')){
			return;
		}else{
			$(this).find(hoverBox).fadeIn('fast');
		}
	},function(){
		$(this).find(hoverBox).fadeOut('fast');
	})
}

function showDivTab(){
	$(".groupBuy_tabBar_main ul li").click(function(){
		$(this).addClass("groupBuy_tabBar_curr").siblings().removeClass("groupBuy_tabBar_curr");
		var boxId = $(this).data("id");
		var index = $(".groupBuy_tabBar_main ul li").index(this);
		$(".groupBuy_goodsList").children().eq(index).removeClass("hide").siblings(".groupBuy_goodTab").addClass("hide");
		if($(".groupBuy_goodsList").children().eq(index).children(".groupBuy_goodsEach").length == "0"){
			emptyLoad();
		}else{
			
		}
	})
}


function scrollLoad(page1,page2,page3){
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
	var range = 0; //距下边界长度/单位px
    var totalheight = 300;
    var main = $(".groupBuy_goodTab");
    $(window).scroll(function(){
    	var Tabnum = $(".groupBuy_tabBar_curr").data("id");
        var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);  
        if(($(document).height()-range) <= totalheight) {
        	if(Tabnum == 1 ){
				tabStatusBox(page1);
        		page1 ++;
			}else if(Tabnum == 2){
				tabStatusBox(page2)
        		page2 ++;
			}else if(Tabnum == 3){
				tabStatusBox(page3)
        		page3 ++;
			}
        }
    });
}


/*發現新品詳情頁跳轉*/
function groupDetailsOnload(){
	$('.begin_hover_seeGoodDetails').on('click',function(){
		var id = $(this).parents('.groupBuy_goodsEach_begin').data('id');
		window.open('http://shopping.macaoeasybuy.com/goodDetails/groupDetail.html?id=' + id +'');
	});
	$('.begin_status_btn').on('click',function(){
		var id = $(this).parents('.groupBuy_goodsEach_begin').data('id');
		window.open('http://shopping.macaoeasybuy.com/goodDetails/groupDetail.html?id=' + id +'');
	});
}

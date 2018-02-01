$(function(){
	findNewScrollLoad()
})
function moreShopMenuClick(){
	$('.moreshopsBox_menuRight ul li').on('click',function(){
		$(this).addClass('moreshopsBox_menuCurr').siblings().removeClass('moreshopsBox_menuCurr')
		var id = $(this).data('id');
		moreShopEachBoxHtml(id)
		findNewScrollLoad()
	})
}

/*好店街滾動加載*/
function findNewScrollLoad(){
	var page = 1;
	var range = 50; //距下边界长度/单位px
    var totalheight = 300;;
    $(window).off('scroll').on('scroll',function(){
    	var id = $(".moreshopsBox_menuCurr").data("id");
        var srollPos = $(window).scrollTop();  //滚动条距顶部距离(页面超出窗口的高度)
        totalheight = parseFloat($(window).height()) + parseFloat(srollPos);  
        if(($(document).height()-range) <= totalheight) {
        	moreShopEachBoxAppend(page,id)
			page++
        }
    });
}
// 點擊商店logo跳轉到商店詳細頁
function goShopDetail(a,b){
	var dataId=$(a).parent().parent().attr("data-id");
	console.log(dataId);
	window.location.href="http://shopping.macaoeasybuy.com/moreshops/shopDetails/shopDetails_index.html?shopId="+dataId;
}

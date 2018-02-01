$(function(){
	marketGoodsHover()
	marketThemeHover()
})

function marketGoodsHover(){
	$(".marketBlock_main_each").hover(function(){
		$(this).find(".marketBlock_main_eachCover").stop(true).animate({
			opacity:"1",
			bottom:"0"
		},100)
	},function(){
		$(this).find(".marketBlock_main_eachCover").animate({
			opacity:"0",
			bottom:"-30px"
		},200)
	})
}

function marketThemeHover(){
	$(".marketBlock_main_theme").hover(function(){
		$(this).find(".marketBlock_main_themeCover").stop(true).animate({
			opacity:"1",
		},100);
	},function(){
		$(this).find(".marketBlock_main_themeCover").animate({
			opacity:"0"
		},100);
	})
}

// 點擊帖子跳轉到市集帖子詳情頁
function goFpDetail(a,b){
	var dataId=$(a).attr('data-id');
	window.open("http://social.macaoeasybuy.com/market/treasureclassifydetail/fairpostdetail/fairpostdetail.html?id="+dataId);
	
}

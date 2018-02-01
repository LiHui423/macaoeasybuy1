$(function(){
	moreShopBox()
	moreShopEachBoxHtml(0)
})

/*請求更多商店分類的數據*/
function moreShopBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/bestShopController/queryArea.easy",function(json){
		var moreShopMenuData = json;
		if(json.list.length < 7){
			$('.moreshopsBox_menuRight').addClass('moreshopsBox_menuRights_less')
		}
		var html = template("moreShopMenu", moreShopMenuData);
		$(".moreshopsBox_menuRight ul").append(html);
		moreShopMenuClick()
	});
}


/*請求商店類表的數據(替換)*/
function moreShopEachBoxHtml(id){
	$.getJSON("http://shopping1.macaoeasybuy.com/bestShopController/queryBestShop/0/9/"+ id +".easy",function(json){
		var moreShopEachData = json;
		if(json.list.length < 9){
			$('.moreshopsBox_noMore').show();
		}else{
			$('.moreshopsBox_noMore').hide();
		}
		var html = template("moreShopEach", moreShopEachData);
		$(".moreshopsBox_shopBox").html(html);
	});
}


/*請求商店類表的數據(補充)*/
function moreShopEachBoxAppend(page,id){
	$.getJSON("http://shopping1.macaoeasybuy.com/bestShopController/queryBestShop/"+ page +"/9/"+ id +".easy",function(json){
		var moreShopEachData = json;
		if(json.list.length < 9){
			$(window).off('scroll');
			$('.moreshopsBox_noMore').show();
		}
		var html = template("moreShopEach", moreShopEachData);
		// $(".moreshopsBox_shopBox").append(html);
	});
}

$(function(){
	bannerPicBox()
	hitListBoxHtml(1,0,5)
})

/*banner圖數據加載*/
function bannerPicBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/MallshopingMessController//queryMessAdvertisement/10109/10107/false/false.easy",function(json){
		var bannerPicList = json;
		var html = template("showBannerPic", bannerPicList);
		$(".scroll").html(html);
		mygoodbanner({
			box: $('#groupBuy_banner'),
			banner: $('#groupBuy_banner .scroll'),
			goLeft: $('#groupBuy_banner .before'),
			goRight: $('#groupBuy_banner .after'),
			childMargin: parseInt($('#groupBuy_banner .scroll').children().eq(0).css('margin-left'))
		});
	});
};

/*本周熱賣商品數據加載（替換）*/
function hitListBoxHtml(order,Hbstate,Areaid){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsHotsellController/queryGoodsHotSell/0/6/"+ order +"/0/"+ Hbstate +"/"+ Areaid +".easy",function(json){
		var hitGoodsList = json;
		var html = template("showHitGoods", hitGoodsList);
		$(".hit_main_goodList").html(html);
		$(".noMore").hide();
		hitScroll();
	});
}
/*本周熱賣商品數據加載（補充）*/
function hitListBoxAppend(page,order,Hbstate,Areaid){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsHotsellController/queryGoodsHotSell/"+ page +"/6/"+ order +"/0/"+ Hbstate +"/"+ Areaid +".easy",function(json){
		$('.loadingnow').hide()
		if(json.list.length >0){
			if(json.list.length < 6){
				var over = true;
				$(".noMore").show();
				var hitGoodsList = json;
				var html = template("showHitGoods", hitGoodsList);
				$(".hit_main_goodList").append(html);
				waterfall($(".hit_main_goodList"),$(".hit_main_goodEach"),2,27,27);
				return false;
			}else{
				var hitGoodsList = json;
				var html = template("showHitGoods", hitGoodsList);
				$(".hit_main_goodList").append(html);
				waterfall($(".hit_main_goodList"),$(".hit_main_goodEach"),2,27,27);
			}
		}
	});
}

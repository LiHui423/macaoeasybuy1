$(function(){
	goodDetails()
	otherGoodDetails()
})

function goodDetails(){
	var id = getId()
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsdetailController/queryAllGoodsdetaiInfo/" + id + "/1.easy?easybuyCallback=?",function(json){
		var shopMessData = json;
		if(shopMessData.list.length !== 0){
		/*店鋪信息*/
			var htmlShopMess = template("shopMess", shopMessData);
			$(".searchBox_left").html(htmlShopMess);
			
			/*商品信息*/
			var htmlGoodMess = template("goodDetailsMess", shopMessData);
			$(".museumDetails_goodMessBox_left").html(htmlGoodMess);
			giveGreat($(".saveGoods"),$(".like_success"),$(".cancelLike_success"),$(".cancelLikePop"),"/src/img/userspace/userspace_postDetails/icon/saveGoods.png","/src/img/userspace/userspace_postDetails/icon/saveGoodsUp.png");
			boomBox()
			
			var htmlDetailsPrice = template("goodDetailsPrice", shopMessData);
			$(".museumDetails_goodMessBox_messBox").prepend(htmlDetailsPrice);
			
			var htmlSize = template("goodDetailsSize", shopMessData);
			$(".goodMessBox_chooseSize").html(htmlSize);
			
			var htmlCoupon = template("goodDetailsCoupon", shopMessData);
			$(".goodMessBox_messBox_ticketBox").html(htmlCoupon);
			
			var htmlData = template("goodDataShow", shopMessData);
			$(".museumDetails_goodDataBox").html(htmlData);
			
			var htmlFans = template("goodfansShow", shopMessData);
			$(".museumDetails_visitorBox").html(htmlFans);
			
			/*商品信息詳情查看切換*/
			var htmlTab = template("introductionBoxab", shopMessData);
			$(".museumDetails_introductionBox_Tab").html(htmlTab);
			
			var htmlIntroPic = template("goodIntroShow", shopMessData);
			$(".introductionBox_pic_main").html(htmlIntroPic);
			
			var htmlCouponData = template("goodCouponData", shopMessData);
			$(".museumDetails_goodMessBox_right_main").html(htmlCouponData);
			
			GetRules(json);
			clickScrollFunction($('.museumDetails_goodMessBox_rightGift'),260)
			tabDetailsSection()
			goodAddCart()
			checkNoMain()
			pageHover()
			goodAddCart()
			scrollCeil()
		}
	});
}

function otherGoodDetails(){
	var id = getId()
	$.getJSON("http://shopping1.macaoeasybuy.com/ShangpinBottomController/queryTuanRandomSp/"+ id +".easy?easybuyCallback=?",function(json){
		var GroupBuyBeginList = json;
		var html = template("showGroupBuyBegin", GroupBuyBeginList);
		$(".groupBuy_goodTab").html(html);
		beginCount();
		groupBuyEndHover($(".groupBuy_goodsEach_begin .groupBuy_goodsEach_pic"),".goodsEach_begin_hover");
		groupDetailsGoodsTab()
	});
}

$(function(){
	goodDetails()
	otherGoodShow()
})
var shopId;
function goodDetails(){
	var id = getId()
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsdetailController/queryAllGoodsdetaiInfo/" + id + "/0.easy?easybuyCallback=?",function(json){
		var shopMessData = json;
		console.log(json)
		shopId=shopMessData.list[0].shopid;
		/*店鋪信息*/
		var htmlShopMess = template("shopMess", shopMessData);
		$(".searchBox_left").html(htmlShopMess);
		
		/*商品信息*/
		var htmlGoodMess = template("goodDetailsMess", shopMessData);
		$(".museumDetails_goodMessBox_left").html(htmlGoodMess);
		giveGreat($(".saveGoods"),$(".like_success"),$(".cancelLike_success"),$(".cancelLikePop"),"/img/common/icon/saveGoods.png","/img/common/saveGoodsUp.png");
		boomBox()
		shareBth()
		
		
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
		scrollCeil()
	});
}

/*底部其他商品*/
function otherGoodShow(){
	var id = getId()
	$.getJSON("http://shopping1.macaoeasybuy.com/ShangpinBottomController/queryShopRandomSp/"+ id +".easy?easybuyCallback=?",function(json){
		var otherGoodShowData = json;
		console.log(otherGoodShowData);
		var html = template("otherGoodShow", otherGoodShowData);
		$(".ordinarySeeOther ul").html(html);
	});
}

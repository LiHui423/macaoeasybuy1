$(function(){
	goodDetails()
	BottomOtherBox()
	seeOtherMusem()
})
function goodDetails(){
	var id = getId()
	$.getJSON("http://shopping.macaoeasybuy.com/goodsdetailController/queryAllGoodsdetaiInfo/" + id + "/5.easy?easybuyCallback=?",function(json){
		var shopMessData = json;
		console.log(json)
		/*商品信息*/
		var htmlGoodMess = template("goodDetailsMess", shopMessData);
		$(".museumDetails_goodMessBox_left").html(htmlGoodMess);
		giveGreat($(".saveGoods"),$(".like_success"),$(".cancelLike_success"),$(".cancelLikePop"),"/img/userspace/userspace_postDetails/icon/saveGoods.png","/img/userspace/userspace_postDetails/icon/saveGoodsUp.png");
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
		calcCost()
		scrollCeil()
	});
}

/*宜品館商品底部其他商品數據*/
function BottomOtherBox(){
	var id = getId()
	$.getJSON("http://shopping.macaoeasybuy.com/ShangpinBottomController/queryYiRandomSp/"+ id +".easy?easybuyCallback=?",function(json){
		var detailsBottomOtherData = json;
		console.log(detailsBottomOtherData)
		var html = template("detailsBottomOther", detailsBottomOtherData);
		$(".museumDetails_othersGood_showBox ul").html(html);
	});
}

/*宜品館商品底部去其他館看看數據*/
function seeOtherMusem(){
	$.getJSON("http://shopping.macaoeasybuy.com/ShangpinBottomController/queryYiSeeNumber.easy?easybuyCallback=?",function(json){
		var seeOtherMuseumData = json;
		var html = template("seeOtherMuseum", seeOtherMuseumData);
		$(".museumDetails_othersMuseum_showBox").html(html);
	});
}
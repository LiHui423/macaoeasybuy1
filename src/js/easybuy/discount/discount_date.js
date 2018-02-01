$(function(){
	bannerPicBox()
	discountListBoxHtml();
})

function bannerPicBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/MallshopingMessController//queryMessAdvertisement/10110/10107/false/false.easy",function(json){
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

function discountListBoxHtml(){
	$.getJSON("http://shopping1.macaoeasybuy.com/GoodsJiangController/queryDepreciateGoods/0/8.easy",function(json){
		var discountListList = json;
		var html = template("showDiscountList", discountListList);
		$(".discount_goods").html(html);
		// discountOnload()
	});
};

function discountListBoxAppend(page){
	$.getJSON("http://shopping1.macaoeasybuy.com/GoodsJiangController/queryDepreciateGoods/"+ page +"/8.easy",function(json){
		$('.loadingnow').hide()
		if(json.list.length < 8){
			var over = true;
			$(".noMore").show();
			var discountListList = json;
			var html = template("showDiscountList", discountListList);
			$(".discount_goods").append(html);
			// discountOnload()
			return false;
		}else{
			var discountListList = json;
			var html = template("showDiscountList", discountListList);
			$(".discount_goods").append(html);
			// discountOnload()
		}
	});
};

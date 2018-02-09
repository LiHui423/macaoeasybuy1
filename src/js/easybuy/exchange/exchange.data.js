$(function(){
	
	bannerPicBox();
	willbeshelvesBoxHtml();
	exchangeVisitBox();
	exchangeListBoxHtml(1,$(".interchange_goods_popular"));
})

/*banner圖數據加載*/
function bannerPicBox(){

	$.getJSON("http://shopping1.macaoeasybuy.com/MallshopingMessController/queryMessAdvertisement/10116/10107/false/false.easy",function(json){
		var bannerPicList = json;
		var shopId=bannerPicList.list[0].shopid;
		console.log(shopId);
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

/*即將上架數據加載(html)*/
function willbeshelvesBoxHtml(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsMopExChangeController/queryMianExchangeWillGrounding/25/0.easy",function(json){
		var willbeshelvesList = json;
		console.log(willbeshelvesList);
		var html = template("showWillbeshelves", willbeshelvesList);
		$(".willbeShelves_scroll ul").html(html);
		clickTabFunction($(".willbeShelves_scroll"),5,$(".willbeShelves_btnLeft"),$(".willbeShelves_btnRight"),247,5)
	});
};
/*即將上架數據加載(append)*/
/*function willbeshelvesBoxAppend(page){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsMopExChangeController/queryMianExchangeWillGrounding/15/"+ page +".easy",function(json){
		var willbeshelvesList = json;
		if(json.length < 15){
			var html = template("showWillbeshelves", willbeshelvesList);
			$(".willbeShelves_scroll ul").append(html);
			clickTabFunction($(".willbeShelves_scroll"),5,$(".willbeShelves_btnLeft"),$(".willbeShelves_btnRight"),247,5)
			return false;
		}
		if(json.length == 0){
			
		}
		var html = template("showWillbeshelves", willbeshelvesList);
		$(".willbeShelves_scroll ul").append(html);
		clickTabFunction($(".willbeShelves_scroll"),5,$(".willbeShelves_btnLeft"),$(".willbeShelves_btnRight"),247,5)
	});
};*/


/*宜粉換搶查看粉絲數據加載*/
function exchangeVisitBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsMopExChangeController/queryMopUserSeeInfo.easy",function(json){
		var interchangeVisitList = json;
		var html = template("showInterchangeVisit", interchangeVisitList);
		$(".interchange_head").html(html);
	});
};

/*宜粉換搶商品數據加載（替換）*/
function exchangeListBoxHtml(status,$loadBox){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsMopExChangeController/queryLaunchedMianExchange/0/12/"+ status +".easy",function(json){
		var exchangeGoodList = json;
		var html = template("showExchangeGood", exchangeGoodList);
		$loadBox.find(".mainBox").html(html);
		interchangeEachRightsEachHover()
		exchangeOnload()
	});
}
/*宜粉換搶商品數據加載（補充）*/
function exchangeListBoxAppend(page,status,$continueLoadBox){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsMopExChangeController/queryLaunchedMianExchange/"+ page +"/12/"+ status +".easy",function(json){
		if(json.list.length < 12){
			$continueLoadBox.find(".noMore").show();
			var exchangeGoodList = json;
			var html = template("showExchangeGood", exchangeGoodList);
			$continueLoadBox.find(".mainBox").append(html);
			interchangeEachRightsEachHover();
			exchangeOnload()
			return false;
		}else{
			var exchangeGoodList = json;
			var html = template("showExchangeGood", exchangeGoodList);
			$continueLoadBox.find(".mainBox").append(html);
			interchangeEachRightsEachHover()
			exchangeOnload()
		}
	});
}

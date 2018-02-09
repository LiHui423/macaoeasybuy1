$(function(){
	museumBannerBox();
	TodayDesignBox();
	popoularBox();
	willSellBox();
	showBeautifulBox();
	popularCommentBox();
	showPracticalBox();
	showMagicalBox();
	themeBox();
})
/*輪播圖請求數據*/
function museumBannerBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/MallshopingMessController/queryMessAdvertisement/10126/10107/false/true.easy",function(json){
		var museumBannerList = json;
		console.log(museumBannerList);
		var html = template("showMuseumBanner", museumBannerList);
		$(".museum_bannerBox").html(html);
		$(".museum_banner_tabBox ul li:nth-child(1)").addClass('museum_banner_tabcurr');
		museumBanner()
	});
}
/*TODAY'SDESIGN請求數據*/
function TodayDesignBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryYiShangpin/8/0/buy_date/desc/1.easy",function(json){
		var TodayDesignList = json;
		console.log(TodayDesignList);
		if(TodayDesignList.list[0].length===0){
			$('.museum_willSell').css('diaplay','none');
			
		}else{
			var html = template("showTodayDesign", TodayDesignList);
			$(".museum_todayDesign").html(html);
			todayDesign();
		}
	});
}
/*人氣設計的左邊商品數據*/
function popoularBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryYiShangpin/30/0/NEWID()/desc/3.easy",function(json){
		var popoularList = json;
		var html = template("showPopularBox", popoularList);
		$(".museum_popularDesign").html(html);
		popularDesign();
		popularCommentBox();
		museumOnload()
	});
}
/*人氣設計的右邊評論滾動請求數據*/
function popularCommentBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryYiShangpinDicuss.easy",function(json){
		var popularCommentList = json;
		var html = template("showPopularComment", popularCommentList);
		$(".popularDesign_right_commentBox ul").html(html);
		$(".popularDesign_right_commentBox").myScroll({
			speed: 40, //数值越大，速度越慢
			rowHeight: 175 //li的高度
		});
	});
	
}
// 即將開賣的模板
function willSellBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryYiShangpin/4/0/NEWID()/desc/2.easy",function(json){
		var willSellList = json;
		if(willSellList.list[0].length === 0){
			$('.museum_willSell').css('display','none');
		}else{
			var html = template("showWillSellBox", willSellList);
			$(".museum_willSell").html(html);
			setInterval(calcMuseumBegin, 1000);
			DetailsPop()
		}
	});
}

function showBeautifulBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryYiShangpinAreaClass/9/0/10117.easy",function(json){
		var showBeautifulList = json;
		var html = template("showBeautiful", showBeautifulList);
		$(".museum_Beautiful").html(html);
		hoverMess($(".museum_museumShowBox_topRight ul li"),".museum_museumShowBox_cover");
		clickTabFunction($(".museum_Beautiful .museum_museumShowBox_topRight"),3,$(".museum_Beautiful .museumShowBox_topRight_btnLeft"),$(".museum_Beautiful .museumShowBox_topRight_btnRight"),230,3);
		$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryUserSeeShangpinInfo/13/1/10117.easy",function(json){
			var visitFanList = json;
			var html = template("showVisitFan", visitFanList);
			$(".museumShowBox_bottom_beautiful").html(html);
		});
	});
}


function showPracticalBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryYiShangpinAreaClass/9/0/10113.easy",function(json){
		var showPracticalList = json;
		var html = template("showPractical", showPracticalList);
		$(".museum_Practical").html(html);
		hoverMess($(".museum_museumShowBox_topRight ul li"),".museum_museumShowBox_cover");
		clickTabFunction($(".museum_Practical .museum_museumShowBox_topRight"),3,$(".museum_Practical .museumShowBox_topRight_btnLeft"),$(".museum_Practical .museumShowBox_topRight_btnRight"),230,3);
		$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryUserSeeShangpinInfo/13/1/10113.easy",function(json){
			var visitFanList = json;
			var html = template("showVisitFan", visitFanList);
			$(".museumShowBox_bottom_practical").html(html);
		});
	});
}

function showMagicalBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryYiShangpinAreaClass/9/0/10111.easy",function(json){
		var showMagicalList = json;
		var html = template("showMagical", showMagicalList);
		$(".museum_Magical").html(html);
		hoverMess($(".museum_museumShowBox_topRight ul li"),".museum_museumShowBox_cover");
		clickTabFunction($(".museum_Magical .museum_museumShowBox_topRight"),3,$(".museum_Magical .museumShowBox_topRight_btnLeft"),$(".museum_Magical .museumShowBox_topRight_btnRight"),230,3);
		$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/queryUserSeeShangpinInfo/13/1/10111.easy",function(json){
			var visitFanList = json;
			var html = template("showVisitFan", visitFanList);
			$(".museumShowBox_bottom_magical").html(html);
		});
	});
}

function DetailsPopBox(id){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsYiPingController/QueryShangpinInfoById/"+ id +".easy",function(json){
		var DetailsPopList = json;
		var html = template("showDetailsPop", DetailsPopList);
		$(".detailsPopWindow").html(html);
		closeDetailsPop()
	});
}

function themeBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/MallshopingMessController/queryMessAdvertisement/10126/10107/true/false.easy",function(json){
		var themeList = json;
		var html = template("showTheme", themeList);
		$(".museum_themeBox_main_shwoBox ul").html(html);
		museumTheme()
	});
}

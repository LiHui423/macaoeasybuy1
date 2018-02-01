$(function(){
	bannerPicBox()
	classBox()
	dailyNecessitiesBox()
	homeAppliancesBox()
	photographicEquipmentBox()
	furnitureBox()
})

function bannerPicBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/MallshopingMessController/queryMessAdvertisement/10115/10107/false/false.easy",function(json){
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

function classBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/secondHandController/queryUsedClass.easy",function(json){
		var secondHandClassData = json;
		var html = template("secondHandClass", secondHandClassData);
		$(".secondHand_chooseType ul").html(html);
	});
};

function dailyNecessitiesBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/secondHandController/queryAllUsedCount/12.easy",function(json){
		var html = template("showEachNmuber", json);
		$(".dailyNecessitiesData").html(html);
	});
	
	$.getJSON("http://shopping1.macaoeasybuy.com/secondHandController/queryClassUsed/0/12/12.easy",function(json){
		var html = template("showEachGood", json);
		$(".dailyNecessitiesList").find('ul').html(html);
		clickScrollFunction($(".secondHand_exampleEach_life"))
	});
};

function homeAppliancesBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/secondHandController/queryAllUsedCount/5.easy",function(json){
		var html = template("showEachNmuber", json);
		$(".homeAppliancesData").html(html);
	});
	
	$.getJSON("http://shopping1.macaoeasybuy.com/secondHandController/queryClassUsed/0/12/5.easy",function(json){
		var html = template("showEachGood", json);
		$(".homeAppliancesList").find('ul').html(html);
		clickScrollFunction($(".secondHand_exampleEach_Electrical"));
	});
};

function photographicEquipmentBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/secondHandController/queryAllUsedCount/3.easy",function(json){
		var html = template("showEachNmuber", json);
		$(".photographicEquipmentData").html(html);
	});
	
	$.getJSON("http://shopping1.macaoeasybuy.com/secondHandController/queryClassUsed/0/12/3.easy",function(json){
		var html = template("showEachGood", json);
		$(".photographicEquipmentList").find('ul').html(html);
		clickScrollFunction($(".secondHand_exampleEach_baby"));
	});
};

function furnitureBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/secondHandController/queryAllUsedCount/15.easy",function(json){
		var html = template("showEachNmuber", json);
		$(".furnitureData").html(html);
	});
	
	$.getJSON("http://shopping1.macaoeasybuy.com/secondHandController/queryClassUsed/0/12/15.easy",function(json){
		var html = template("showEachGood", json);
		$(".furnitureList").find('ul').html(html);
		clickScrollFunction($(".secondHand_exampleEach_Furniture"));
	});
};

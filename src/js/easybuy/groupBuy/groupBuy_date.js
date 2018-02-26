$(function(){
	groupBuyBegin();
	bannerPicBox()
})
var place='';
var expertlable='';
var templateHtml = easyBuy.global.template;
/*頁面初始化默認加載第一個地址第一個選擇的商品*/
function groupBuyBegin(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsGroupBuyingController/queryTuanShangpin/1/41/12/0/1.easy?easybuyCallback?",function(json){
		var GroupBuyBeginList = json;
		var html = template.render(templateHtml["showGroupBuyBegin"], GroupBuyBeginList);
		$(".groupBuy_begin").html(html);
		groupBuyEndHover($(".groupBuy_goodsEach_begin .groupBuy_goodsEach_pic"),".goodsEach_begin_hover");
		groupDetailsOnload();
	});
};

function currLabel(){
	var $placeLis = $(".regionBox_curr");
	var $typeLis = $(".typeBox_curr");
	place = "";
	expertlable = "";
	$.each($placeLis,function(index){
		if(index == $placeLis.length - 1){
			place = place + $(this).data("id");
		}else{
			place = place + $(this).data("id") + ",";
		}
	})
	$.each($typeLis,function(index){
		if(index == $typeLis.length - 1){
			expertlable = expertlable + $(this).data("id");
		}else{
			expertlable = expertlable + $(this).data("id") + ",";
		}
	})
}

function getLabelJson(){
	currLabel();
	var status = $(".groupBuy_tabBar_curr").data("id");
	console.log(place);
	console.log(expertlable);
	console.log(status);

	$.getJSON('http://shopping1.macaoeasybuy.com/goodsGroupBuyingController/queryTuanShangpin/'+ place +'/'+ expertlable +'/12/0/'+ status +'.easy?easybuyCallback?',function(json){
		if(status == "1"){
			var GroupBuyBeginList = json;
			var html = template.render(templateHtml["showGroupBuyBegin"], GroupBuyBeginList);
			$(".groupBuy_begin").html(html);
			$(".groupBuy_ing").html("");
			$(".groupBuy_end").html("");
		}else if(status == "2"){
			var GroupBuyNoticeList = json;
			var html = template.render(templateHtml["showGroupBuyNotice"], GroupBuyNoticeList);
			$(".groupBuy_ing").html(html);
			$(".groupBuy_begin").html("");
			$(".groupBuy_end").html("");
		}else{
			var GroupBuy_endList = json;
			var html = template.render(templateHtml["showGroupBuy_end"], GroupBuy_endList);
			$(".groupBuy_end").html(html);
			groupBuyEndHover($(".groupBuy_end_goodsEach"),".groupBuy_end_hover");
			clacTimeFormat();
			$(".groupBuy_begin").html("");
			$(".groupBuy_ing").html("");
		}
		groupBuyEndHover($(".groupBuy_goodsEach_begin .groupBuy_goodsEach_pic"),".goodsEach_begin_hover");
		groupDetailsOnload();
	});
}

function emptyLoad(page){
	currLabel();
	var status = $(".groupBuy_tabBar_curr").data("id");
	$.getJSON('http://shopping1.macaoeasybuy.com/goodsGroupBuyingController/queryTuanShangpin/'+ place +'/'+ expertlable +'/12/0/'+ status +'.easy?easybuyCallback?',function(json){
		if(status == "1"){
			var GroupBuyBeginList = json;
			var html = template.render(templateHtml["showGroupBuyBegin"], GroupBuyBeginList);
			$(".groupBuy_begin").html(html);
		}else if(status == "2"){
			var GroupBuyNoticeList = json;
			var html = template.render(templateHtml["showGroupBuyNotice"], GroupBuyNoticeList);
			$(".groupBuy_ing").html(html);
		}else{
			var GroupBuy_endList = json;
			var html = template.render(templateHtml['showGroupBuy_end'], GroupBuy_endList);
			$(".groupBuy_end").html(html);
			groupBuyEndHover($(".groupBuy_end_goodsEach"),".groupBuy_end_hover");
			clacTimeFormat();
		}
		groupBuyEndHover($(".groupBuy_goodsEach_begin .groupBuy_goodsEach_pic"),".goodsEach_begin_hover");
		groupDetailsOnload();
	});
}

function tabStatusBox(page){
	console.log(page);
	currLabel();
	var status = $(".groupBuy_tabBar_curr").data("id");
	$.getJSON('http://shopping1.macaoeasybuy.com/goodsGroupBuyingController/queryTuanShangpin/'+ place +'/'+ expertlable +'/12/'+ page +'/'+ status +'.easy?easybuyCallback=?',function(json){
		if(status == "1"){
			var GroupBuyBeginList = json;
			var html = template.render(templateHtml['showGroupBuyBegin'], GroupBuyBeginList);
			$(".groupBuy_begin").append(html);
		}else if(status == "2"){
			var GroupBuyNoticeList = json;
			var html = template.render(templateHtml["showGroupBuyNotice"], GroupBuyNoticeList);
			$(".groupBuy_ing").append(html);
		}else{
			var GroupBuy_endList = json;
			var html = template.render(templateHtml["showGroupBuy_end"], GroupBuy_endList);
			$(".groupBuy_end").append(html);
			groupBuyEndHover($(".groupBuy_end_goodsEach"),".groupBuy_end_hover");
			clacTimeFormat();
		}
		groupBuyEndHover($(".groupBuy_goodsEach_begin .groupBuy_goodsEach_pic"),".goodsEach_begin_hover");
		groupDetailsOnload();
	});
}

function bannerPicBox(){
 	$.getJSON('http://shopping1.macaoeasybuy.com/MallshopingMessController//queryMessAdvertisement/10114/10107/false/false.easy?easybuyCallback=?',function(json){
		 var bannerPicList = json;
		var html = template('showBannerPic', bannerPicList);
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

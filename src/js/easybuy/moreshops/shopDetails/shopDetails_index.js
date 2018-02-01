$(function(){
	searchSlide(); //搜索框選目標
	getShopInfo(true); //獲取商店信息
	getShopMap(); //人氣推薦
	getHotComment(); //宜粉熱評
	printShopReq(); //宜粉嗮圖
});

//人氣推薦
function getShopMap(){
	var dataUrl = 'http://shopping1.macaoeasybuy.com/shopInfoController/queryShopMap.easy?Shopid='+shopId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		$('#sentiment-box').html(template('sentiment-template',data));
	});
}
//宜粉熱評
function getHotComment(){
	var dataUrl = 'http://shopping1.macaoeasybuy.com/shopInfoController/queryShopNewCommentMap.easy?Shopid='+shopId+'&easybuyCallback=?';
	var timer = 4000; //4s跳一次評論
	$.getJSON(dataUrl,function(data){
		//整理數據格式
		$.each(data.list,function(k,y){
			y.SeeNumber = easyBuy.global.dep.formatNum(y.SeeNumber);
			y.LoveNumber = easyBuy.global.dep.formatNum(y.LoveNumber);
			y.BuyNumber = easyBuy.global.dep.formatNum(y.BuyNumber);
			y.CostPrice = easyBuy.global.dep.formatNum(y.CostPrice);
			y.Price = easyBuy.global.dep.formatNum(y.Price);
		});
		//插入數據
		var box = $('#hot-comment-box');
		var leftHtml = '';
		if(data.list[0]){
			leftHtml = template('hot-comment-template',data.list[0]);
		}
		if(data.list[1]){
			leftHtml += template('hot-comment-template',data.list[1]);
		}
		box.find('.Subclasses_showBox_left').html(leftHtml);
		if(data.list[2]){
			box.find('.Subclasses_showBox_right').html(template('hot-comment-template',data.list[2]));
		}
		//把評論數組前面兩個放到後面，並且開始輪播評論
		$.each(data.list,function(k,y){
			if(y.userComment.length > 2){
				var beforeArr = y.userComment.splice(0,2);
				var newArr = y.userComment.concat(beforeArr);
				setIntervalFunc(y.id,newArr); //定時器函數
			}
		});
	});
	//定時器函數
	function setIntervalFunc(id,arr){
		var box = $('#hot-comments-shop'+id);
		box[0].timer = setTimeout(function(){
			clearTimeout(box[0].timer);
			var newArrData = arr.splice(0,2);
			var html = template('hot-commentList-template',{list:newArrData});
			box.find('.showBox_leftEach_commentBox').fadeOut('fast',function(){
				box.find('.showBox_leftEach_commentBox').html(html);
				$(this).fadeIn('fast');
			});
			var newArr = arr.concat(newArrData);
			setIntervalFunc(id,newArr);
		},timer);
	}
}
//宜粉嗮圖
function printShopReq(){
	var dataUrl = 'http://shopping1.macaoeasybuy.com/shopInfoController/queryShopSaiMap.easy?Shopid='+shopId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		$('#print-shop-box').html(template('print-shop-template',data));
	});
}

/*底部其他商品*/
function otherGoodShow(){
	reqFunc();
	function bindClickFunc(state){
		var btn = $('.shopCart_recommendBox_title_change');
		if(state == 'on'){
			btn.on('click',function(){
				reqFunc();
			});
		}else{
			btn.off('click');
		}
	}
	function reqFunc(){
		bindClickFunc('off');
		var dataUrl = '//shopping1.macaoeasybuy.com/ShangpinBottomController/queryShopRandomSp/0/6.easy?easybuyCallback=?';
		$.getJSON(dataUrl,function(json){
			var otherGoodShowData = json;
			var html = template("otherGoodShow", otherGoodShowData);
			$(".shopCart_recommendBox ul").html(html);
			bindClickFunc('on');
		});
	}
}
//訂單數量統計
function countOtderTopicInfo(){
	var dataUrl = '//shopping1.macaoeasybuy.com/shopCartController/querySpCartandSpOrderTopicInfo.easy?easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		$($($('.right').find('[data-count]'))[1]).attr('data-count',data.headInfo[0].shopCartCount);
		$('#shopCart_searchBoxLeft_box li').eq(0).find('p span').html(data.headInfo[0].shopCartCount); //購物籃
		$('#shopCart_searchBoxLeft_box li').eq(1).find('p span').html(data.headInfo[0].shipmentpendingCount); //待發貨
		$('#shopCart_searchBoxLeft_box li').eq(2).find('p span').html(data.headInfo[0].confirmedCount); //待確認
		$('#shopCart_searchBoxLeft_box li').eq(3).find('p span').html(data.headInfo[0].evaluationCount); //待評價
		$('#shopCart_searchBoxLeft_box li').eq(4).find('p span').html(data.headInfo[0].completeCount); //已完成
		$('#shopCart_searchBoxLeft_box').css('visibility','visible');
	});
}

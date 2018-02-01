var reqObj = {
	page : 0,
	size : 2, //一次請求兩個商店
	isComplete : false,
	sendData : {}
}
function startJs(){
	countOtderTopicInfo(); //訂單數量統計
	otherGoodShow(); //底部商品
	getShopOrders(); //查詢訂單信息
	bindClickEventFunc(); //辦定彈框點擊事件
}
//辦定彈框點擊事件
function bindClickEventFunc(){
	$('#receiving-box .wantSignUp_closeIcon').on('click',function(){
		$('#receiving-box').fadeOut('fast');
	});
	$('#after-receiving-box .hadSignUp_close,#after-receiving-box .hadSignUp_other_btn').on('click',function(){
		$('#after-receiving-box').fadeOut('fast');
	});
	$('#receiving-box .wantSignUp_bth').on('click',function(){
		var sendData = window.reqObj.sendData;
		var dataUrl = 'http://shopping.macaoeasybuy.com/ShopOrderController/SignOrders.easy?shoppingid='+sendData.shoppingid+'&iUserId='+userId+'&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			console.log(data);
			var data = data.list[0];
			if(data.state == 0) return false;
			$('#receiving-box').css('display','none');
			
			if(data.HBinfo >= 0){
				$('#after-receiving-box .hadSignUp_Evalua p').eq(0).find('span:last-of-type').html('+'+data.HBinfo+'元紅包');
			}else{
				$('#after-receiving-box .hadSignUp_Evalua p').eq(0).find('span:last-of-type').html(data.HBinfo+'元紅包');
			}
			if(data.JFinfo >= 0){
				$('#after-receiving-box .hadSignUp_Evalua p').eq(1).find('span:last-of-type').html('+'+data.JFinfo+'積分');
			}else{
				$('#after-receiving-box .hadSignUp_Evalua p').eq(1).find('span:last-of-type').html(data.JFinfo+'積分');
			}
			if(data.CommentPoint >=0){
				$('#after-receiving-box .hadSignUp_Evalua p').eq(2).find('span:last-of-type').html('+'+data.CommentPoint+'積分');
			}else{
				$('#after-receiving-box .hadSignUp_Evalua p').eq(2).find('span:last-of-type').html(data.CommentPoint+'積分');
			}
				
			$('#after-receiving-box').fadeIn('fast');
			resetContent(); //重新刷新數據
		})
	});
}

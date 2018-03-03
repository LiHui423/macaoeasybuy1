$(function(){
	startJs();
});
var reqObj = {
	page : 0,
	size : 2,
	isComplete : false,
	iknowId : -1,
	iknowIdLen : 0,
	destoryId : -1
}
function startJs(){
	allBindClickFunc(); //彈框按鈕辦定事件
	
	
	countOtderTopicInfo(); //訂單數量統計
	
	getShopOrders(); //查詢訂單信息
	
	
	
	otherGoodShow(); //底部其他商品
}

//彈框按鈕辦定事件
function allBindClickFunc(){
	$('.destroyOrder_know').on('click.show',function(){
		$(this).parents('.destroyOrder_box').fadeOut('fast');
	})
	$('.destroyOrder_cancel').on('click.show',function(){
		$(this).parents('.destroyOrder_box').fadeOut('fast');
	})
	//刪除商品
	$('#delete_shop .destroyOrder_know').on('click.req',function(){
		var myshoppingid = window.reqObj.destoryId;
		if(myshoppingid == undefined ||  myshoppingid <= 0) return false;
		$.getJSON('http://shopping1.macaoeasybuy.com/ShopOrderController/deleteShopOrder.easy?shoppingid='+myshoppingid+'&iUserId='+userId+'&easybuyCallback=?',function(data){
			resetContent();
		});
	});
	//知道了
	$('#destory_shop .destroyOrder_know').on('click.req',function(){
		var myshoppingid = window.reqObj.iknowId;
		if(myshoppingid==undefined ||  myshoppingid <= 0) return false;
		$.getJSON('http://shopping1.macaoeasybuy.com/ShopOrderController/ConfirmCancelOrder.easy?shoppingid='+myshoppingid+'&iUserId='+userId+'&easybuyCallback=?',function(data){
			if(data.state == 1 && window.reqObj.iknowIdLen == 1){
				console.log('跳到已完成頁面');
			}
			resetContent();
		});
	});
}

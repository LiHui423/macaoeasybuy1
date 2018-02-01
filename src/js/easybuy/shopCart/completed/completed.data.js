//查詢訂單信息
function getShopOrders(){
	var reqObj = window.reqObj;
	var page = reqObj.page;
	var size = reqObj.size;
	var GoodsNameKeyWord = encodeURI(encodeURI(reqObj.GoodsNameKeyWord));
	var ShopNameKeyWord = encodeURI(encodeURI(reqObj.ShopNameKeyWord));
	var TimeStart = reqObj.TimeStart;
	var TimeEnd = reqObj.TimeEnd;
	var FilterState = reqObj.FilterState;
	var dataUrl = 'http://shopping.macaoeasybuy.com/ShopOrderController/queryOrdersResult.easy?page='+page+'&size='+size+'&userid='+userId+'&OrdersiState=3&shoppingState=2&GoodsNameKeyWord='+GoodsNameKeyWord+'&ShopNameKeyWord='+ShopNameKeyWord+'&TimeStart='+TimeStart+'&TimeEnd='+TimeEnd+'&FilterState='+FilterState+'&easybuyCallback=?';
	
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			if(reqObj.isComplete) return false;
			shopScrollFunc('off');
		},
		success:function(data){
			var len = data.list.length;
			var preObj = $('#noMore');
			if(page == 0){
				searchBtnClick('on');
				preObj.siblings('.unprocessed_main_shop').remove();
			}
			if(len == 0 && page == 0){
				$('.unprocessed_mainBox,.unprocessed_mainTitle').css('display','none');
				$('.no_unprocessed_mainBox').css('display','block');
				return false;
			}else{
				$('.unprocessed_mainBox,.unprocessed_mainTitle').css('display','block');
				$('.no_unprocessed_mainBox').css('display','none');
			}
			$('.unprocessed_mainBox,.unprocessed_mainTitle').css('visibility','visible');
			
			//循環創建模板，添加模板
			//循環商店
			$.each(data.list, function(k,y) {
				preObj.before('<div class="unprocessed_main_shop" id="'+y.iShopId+'_store"></div>'); //創建盒子
				//商店頭部
				$('#'+y.iShopId+'_store').append(
					template('store_title_template',y)
				);
				//循環訂單
				$.each(y.shopOrders,function(m,n){
					n.shopname = y.shopname; //把一級list數據遷移過來二級list
					n.myExchangeList = []; //換貨
					n.myReturnList = []; //退貨
					$.each(n.shoppings, function(i,a) {
						a.fPrice = formatNum(a.fPrice) + '.00';
						a.fRealyPrice = formatNum(a.fRealyPrice) + '.00';
						/*
						 	狀態統一 1：申請中
						 				2：成功
						 				3：失敗
						 				4：完成 (只有2通過了才會有4)
						 * */
						//如果是換貨狀態的商品，把三級數據遷移到二級數據
						if(a.exiState != 0){
							n.myExchangeList.push({
								exiState : a.exiState, //狀態
								title : a.title, //標題
								sStandardPic : a.sStandardPic, //換前圖
								iCount : a.iCount, //換前數量
								sStandard : a.sStandard, //換前規格
								exsTargetPic : a.exsTargetPic, //換后圖
								exiCount : a.exiCount, //換后數量
								exsTarget : a.exsTarget, //換后規格
								exsReason : a.exsReason, //換貨原因
								exsResponses : a.exsResponses //商家回應
							});
						}
						//如果是退貨狀態的商品，把三級數據遷移到二級數據
						if(a.reiState != 0){
							n.myReturnList.push({
								reiState : a.reiState, //狀態
								sStandardPic : a.sStandardPic, //圖片
								title : a.title, //標題
								iCount : a.iCount, //數量
								sStandard : a.sStandard, //規格
								fPrice : a.fPrice, //單價
								fRealyPrice : a.fRealyPrice, //退款價格
								resReson : a.resReson, //退貨原因
								resRespone : a.resRespone //退貨回應
							});
						}
					});
					//訂單頭 + 訂單列表
					$('#'+y.iShopId+'_store').append(
						template('order_title_template',n) + template('shop_item_template',n)
					);
					//辦定查看訂單詳情事件
					//顯示
					$('#'+n.id+'_order').find('.unprocessed_main_order_mess_btn').on('click',function(){
						$(this).siblings('.unprocessed_main_order_mess').css('display','block');
					});
					//取消
					maskClick('.unprocessed_main_order_mess',function(){
						$('#'+n.id+'_order').find('.unprocessed_main_order_mess').css('display','none');
					},n.id+'_click');
				});
				$('#'+y.iShopId+'_store').removeAttr('id'); //把ID屬性節點刪除
			});
			window.reqObj.page++;
			if(len == size){
				shopScrollFunc('on');
			}else{
				window.reqObj.isComplete = true;
				shopScrollFunc('off');
				preObj.css('display','block');
			}
		}
	});
}
function searchBtnClick(state){
	if(state='on'){
		$('#search_btn').on('click',function(){
			$(this).off('click');
			window.reqObj.GoodsNameKeyWord = $('#search_shop_name').val();
			window.reqObj.ShopNameKeyWord = $('#search_store_name').val();
			window.reqObj.page = 0;
			window.reqObj.isComplete = false;
			getShopOrders();
		});
	}else{
		$('#search_btn').off('click');
	}
}
//監聽滾動條
function shopScrollFunc(state){
	if(state == 'on'){
		$(window).on('scroll.req',function(){
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(document).height();
			var windowHeight = $(this).height();
			if(scrollTop + windowHeight >= scrollHeight * 0.6){
				getShopOrders();
			}
		});
	}else{
		$(window).off('scroll.req');
	}
}
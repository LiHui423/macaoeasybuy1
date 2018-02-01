//查詢訂單信息
function getShopOrders(){
	var reqObj = window.reqObj;
	var page = reqObj.page;
	var size = reqObj.size;
	var dataUrl = 'http://shopping1.macaoeasybuy.com/ShopOrderController/queryOrdersResult.easy?page='+page+'&size='+size+'&userid='+userId+'&OrdersiState=0&shoppingState=0&easybuyCallback=?';
	
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
			if(len == 0 && page == 0){
				$('.unprocessed_mainBox,.unprocessed_mainTitle').remove();
				$('.no_unprocessed_mainBox').css('display','block');
				return false;
			}
			$('.unprocessed_mainBox,.unprocessed_mainTitle').css('visibility','visible');
			var preObj = $('#noMore');
			//循環創建模板，添加模板
			//循環商店
			if(page == 0) preObj.siblings('.unprocessed_main_shop').remove();
			$.each(data.list, function(k,y) {
				preObj.before('<div class="unprocessed_main_shop" id="'+y.iShopId+'_store"></div>'); //創建盒子
				//商店頭部
				$('#'+y.iShopId+'_store').append(
					template('store_title_template',y)
				);
				//循環訂單
				$.each(y.shopOrders,function(m,n){
					n.shopname = y.shopname; //把一級list數據遷移過來二級list
					n.cancelList = [];
					$.each(n.shoppings, function(i,a) {
						a.fPrice = formatNum(a.fPrice) + '.00';
						a.fRealyPrice = formatNum(a.fRealyPrice) + '.00';
						//如果是取消狀態的商品，把三級數據遷移到二級數據
						if(a.ordersiState == 10){
							n.cancelList.push({
								sStandardPic : a.sStandardPic,
								title : a.title,
								sStandard : a.sStandard,
								fPrice : a.fPrice,
								iCount : a.iCount,
								cancelReason : a.cancelReason
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
					//給操作按鈕辦定事件
					$.each(n.shoppings,function(i,a){
						if((a.ordersiState != 10 || a.iTake != 0) && (a.ordersiState != 1 || a.shoppingiState != 0)){
							return true;
						}
						var btn = $('#'+a.shoppingid+'operation_btn');
						btn.data('data',{
							shoppingid : a.shoppingid,
							dLength : n.iTakeCount,
							cancelReason : a.cancelReason
						});
						btn.removeAttr('id');
						if(a.ordersiState == 10 && a.iTake == 0){
							//給知道了按鈕辦定事件
							iKowClickFunc(btn);
						}else if(a.ordersiState == 1 && a.shoppingiState == 0){
							//給刪除按鈕辦定事件
							delClickFunc(btn);
						}
					});
					
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
//知道了
function iKowClickFunc(btn){
	btn.on('click',function(){
		var btnData = $(this).data('data');
		$('#destory_shop .reason_tips').html(btnData.cancelReason);
		$('#destory_shop').css('display','block');
		window.reqObj.iknowId = btnData.shoppingid;
		window.reqObj.iknowIdLen = btnData.dLength;
	});
}

//刪除商品
function delClickFunc(btn){
	btn.on('click',function(){
		var btnData = $(this).data('data');
		$('#delete_shop').css('display','block');
		window.reqObj.destoryId = btnData.shoppingid;
	});
}

//重置並且刷新內容
function resetContent(){
	window.scrollTo(0,0);
	window.reqObj.page = 0;
	window.reqObj.isComplete = false;
	window.reqObj.iknowId = -1;
	window.reqObj.destoryId = -1;
	getShopOrders();
	countOtderTopicInfo(); //訂單數量統計
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

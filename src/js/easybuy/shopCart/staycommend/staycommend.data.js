//查詢訂單信息
function getShopOrders(){
	var reqObj = window.reqObj;
	var page = reqObj.page;
	var size = reqObj.size;
	var dataUrl = 'http://shopping.macaoeasybuy.com/ShopOrderController/queryOrdersResult.easy?page='+page+'&size='+size+'&userid='+userId+'&OrdersiState=2&shoppingState=1&easybuyCallback=?';
	
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
					
					//給操作按鈕辦定數據   辦定事件
					var allHB = 0;
					var allJF = 0;
					var allJL = 0;
					var needLen = 0;
					$.each(n.shoppings,function(i,a){
						allHB+=a.HBinfo;
						allJF+=a.JFinfo;
						allJL+=a.commentPoint;
						if(a.haveEvaluated == 0){
							needLen++;
						}
					});
					$.each(n.shoppings,function(i,a){
						if(a.haveEvaluated == 1){
							return true;
						}
						var btn = $('#'+a.shoppingid+'operation_btn');
						
						btn.data('data',{
							needLen : needLen,
							allHB : allHB,
							allJF : allJF,
							allJL : allJL,
							list : n.shoppings,
							sNumber : n.sNumber
						});

						sureFunc(btn); //辦定事件(確認簽收)
						btn.removeAttr('id');
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

//辦定事件(確認簽收)
function sureFunc(btn){
	btn.on('click',function(){
		
		var btnData = $(this).data('data');
		var box  =$('#staycommend_evaluationPop');
		var liHtml = '';
		//重置數據
		window.reqObj.sendData.selectKey = 0;
		window.reqObj.sendData.dataList.splice(0,window.reqObj.sendData.dataList.length);
		//添加該訂單的內容
		if(btnData.allHB >= 0){
			box.find('.evaluationPop_settlement_left p').eq(0).find('span:last-of-type').html('+'+btnData.allHB+'元紅包');
		}else{
			box.find('.evaluationPop_settlement_left p').eq(0).find('span:last-of-type').html(btnData.allHB+'元紅包');
		}
		if(btnData.allJF >= 0){
			box.find('.evaluationPop_settlement_left p').eq(1).find('span:last-of-type').html('+'+btnData.allJF+'積分');
		}else{
			box.find('.evaluationPop_settlement_left p').eq(1).find('span:last-of-type').html(btnData.allJF+'積分');
		}
		if(btnData.allJL >= 0){
			box.find('.evaluationPop_settlement_left p').eq(2).find('span:last-of-type').html('+'+btnData.allJL+'積分');
		}else{
			box.find('.evaluationPop_settlement_left p').eq(2).find('span:last-of-type').html(btnData.allJL+'積分');
		}
		//添加點
		box.find('.dot_list').html('');
		if(btnData.needLen != 1){
			for(var i=0;i<btnData.needLen;i++){
				if(i==0){
					liHtml = '<li class="select"></li>';
				}else{
					liHtml+='<li></li>';
				}
			}
			box.find('.dot_list').html(liHtml);
		}
		//訂單編號
		box.find('.evaluationPop_order').html('訂單編號：'+btnData.sNumber);
		
		//添加需要評價的訂單信息
		box.find('.evaluationPop_mainMiddle ul').html('');
		$.each(btnData.list, function(k,y) {
			if(y.haveEvaluated == 1) return true;
			y.HBinfo = y.HBinfo >= 0 ? '+MOP '+y.HBinfo : '-MOP '+y.HBinfo;
			y.JFinfo = y.JFinfo >= 0 ? '+ '+y.JFinfo : y.JFinfo;
			y.YHinfo = y.YHinfo >= 0 ? '+MOP '+y.YHinfo : '-MOP '+y.YHinfo;
			box.find('.evaluationPop_mainMiddle ul').append(template('evaluation_info',y));
			window.reqObj.sendData.dataList.push({
				bol : false,
				shoppingid : y.shoppingid
			})
		});
		
		evapop(); //左右按鈕
		starEva(); //評級星級的函數
		box.fadeIn('fast');
	});
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

//重置並且刷新內容
function resetContent(){
	window.scrollTo(0,0);
	window.reqObj.page = 0;
	window.reqObj.isComplete = false;
	window.reqObj.sendData = {};
	window.reqObj.sendData = {
		selectKey : 0,
		dataList : []
	}
	getShopOrders();
	countOtderTopicInfo(); //訂單數量統計
}

//曬圖積分
function getIntegral(){
	$.getJSON('http://userspace1.macaoeasybuy.com/integralController/queryTopicIntegral.easy?type=releaseSentVolunteers&easybuyCallback=?',function(data){
		$('#staycommend_success .staycommend_success_btnBox p span').html(data.Integral);
	});
}

var reqObj = {
	page : 0,
	size : 2, //一次請求兩個商店
	isComplete : false,
	sendData : {
		selectKey : 0,
		dataList : []
	}
}
function startJs(){
	countOtderTopicInfo(); //訂單數量統計
	
	
	evaover(); //評價結束的彈框
	
	getShopOrders(); //請求
	
	otherGoodShow(); //底部商品
	
	getIntegral(); //曬圖積分
}
/*評價結束的彈框*/
function evaover(){
	$('#staycommend_success .staycommend_success_close,#staycommend_success .staycommend_success_btnBox span').on('click',function(){
		$('#staycommend_success').fadeOut('fast');
	});
	$('#staycommend_evaluationPop .evaluationPop_close').on('click',function(){
		$('#staycommend_evaluationPop').fadeOut('fast');
	});
}
/*評級星級的函數*/
function starEva(){
	/*這個星星的評級插件的原理是通過限制box的寬度來選擇選擇顯示的星星多少*/
	var now_cli;//鼠標選擇到哪一個a標籤層
	var atu;
	var fen_d = 11.5;
	var aLength = 10;
	var preA = (5 / aLength);
	var types = [
		"很不满意",
		"差得太离谱，与卖家描述的严重不符，非常不满",
		"不满意",
		"部分有破损，与卖家描述的不符，不满意", 
		"一般", "质量一般", "没有卖家描述的那么好", 
		"满意", 
		"质量不错，与卖家描述的基本一致，还是挺满意的", 
		"非常满意", 
		"质量非常好，与卖家描述的完全一致，非常满意"
	];
	var startBoxs = $('.eachstartBox');
	$.each(startBoxs,function(){
		var that = $(this);
		/*星星上添加選擇圖層*/
		for(var i = 0;i < aLength;i++){
			var newSpan = $("<a href='javascript:void(0)'></a>");
			newSpan.css({
				"left": 0,
				"width":fen_d * (i + 1),
				"z-index": aLength - i
			});
			newSpan.appendTo(that.find('.star_score'))
		}
		that.find('.star_score').off('mouseenter mouseleave');
		that.find('.star_score').on('mouseenter',function(){
			$(this).parents('.eachstartBox').find(".eachstart_intro").stop().fadeIn('fast')
		});
		that.find('.star_score').on('mouseleave',function(){
			$(this).parents('.eachstartBox').find(".eachstart_intro").stop().fadeOut('fast')
		});
		/*星星選擇*/
		that.find('.star_score a').each(function(index, element) {
			var popleft = parseInt(that.find(".eachstart_intro").css('left'));
			$(this).off('click');
			$(this).on('click',function() {
				now_cli = index;
				show(index, $(this));
				detection();
				$(this).addClass('numIcon').siblings('a').removeClass('numIcon');
				var dataIndex = $(this).parents('.eachstartBox').index(); //盒子index
				var scoreNum = (now_cli+1)/2; //分數
				switch(dataIndex){
					case 0:
						//描述
						window.reqObj.sendData.dataList[window.reqObj.sendData.selectKey].miao = scoreNum;
					break;
					case 1:
						//價格
						window.reqObj.sendData.dataList[window.reqObj.sendData.selectKey].jia = scoreNum;
					break;
					case 2:
						//商品質量
						window.reqObj.sendData.dataList[window.reqObj.sendData.selectKey].shang = scoreNum;
					break;
				}
			});
			$(this).off('mouseenter mouseleave');
			$(this).on('mouseenter',function() {
				show(index, $(this))
				that.find(".eachstart_intro").css('left',popleft + (Math.ceil((index + 1)/2) - 1)*2*fen_d + 'px')
			});
			$(this).on('mouseleave',function() {
				if(that.find('.numIcon')){
					now_cli = that.find('.numIcon').index();
				}else{
					now_cli = -1;
				}
				if(now_cli >= 0) {
					var scor = preA * (parseInt(now_cli) + 1);
					that.find('.star_score a').removeClass("clibg");
					that.find('.star_score a').eq(now_cli).addClass("clibg");
					var ww = fen_d * (parseInt(now_cli) + 1);
					that.find('.star_score a').eq(now_cli).css({
						"width": ww,
						"left": "0"
					});
				} else {
					that.find('.star_score a').removeClass("clibg");
				}
			})
		});
		
		function show(num,obj) {
			var n = parseInt(num) + 1;
			var lefta = num * fen_d;
			var ww = fen_d * n;
			var scor = preA * n;
			var levelname;
			var atu = types[parseInt(num)];
			that.find('.star_score a').removeClass("clibg");
			obj.addClass("clibg");
			obj.css({
				"width": ww,
				"left": "0"
			});
			switch(scor){
				case 0.5:
					levelname = '滿意0.5';
				break;
				case 1:
					levelname = '滿意1';
				break;
				case 1.5:
					levelname = '滿意1.5';
				break;
				case 2:
					levelname = '滿意2';
				break;
				case 2.5:
					levelname = '滿意2.5';
				break;
				case 3:
					levelname = '滿意3';
				break;
				case 3.5:
					levelname = '滿意3.5';
				break;
				case 4:
					levelname = '滿意4';
				break;
				case 4.5:
					levelname = '滿意4.5';
				break;
				case 5:
					levelname = '滿意5';
				break;
			}
			that.find('.grade').text(scor + '分');
			that.find('.level').text(levelname);
			that.find('.gradeMess').text(atu);
		}
	})	
}

/*評價框左右切換*/
function evapop(){
	var dotLen = $('#staycommend_evaluationPop .dot_list li').length;
	/*綁定第一個li的層級*/
	$('.evaluationPop_mainMiddle ul li:nth-of-type(1)').addClass('top_curr').css('opacity','1');
	/*綁定左右切換*/
	if(dotLen != 0){
		$('.evaluationPop_mainLeft,.evaluationPop_mainRight').css('visibility','visible');
		var lisList = $('.evaluationPop_mainMiddle').find('li');
		$('.evaluationPop_mainLeft').off('click');
		$('.evaluationPop_mainLeft').on('click',function(){		
			var index = $('.top_curr').index();
			lisList.eq(index).removeClass('top_curr').animate({
				opacity:'0'
			})
			lisList.eq(index - 1).addClass('top_curr').animate({
				opacity:'1'
			});
			$('#staycommend_evaluationPop .dot_list li').eq($('.top_curr').index()).siblings('li').removeClass('select').end().addClass('select');
			window.reqObj.sendData.selectKey = $('.top_curr').index();
		});
		$('.evaluationPop_mainRight').off('click');
		$('.evaluationPop_mainRight').on('click',function(){
			var index = $('.top_curr').index();
			lisList.eq(index).removeClass('top_curr').animate({
				opacity:'0'
			})
			if(index == lisList.length - 1){
				lisList.eq(0).addClass('top_curr').animate({
					opacity:'1'
				})
			}else{
				lisList.eq(index + 1).addClass('top_curr').animate({
					opacity:'1'
				});
			}
			$('#staycommend_evaluationPop .dot_list li').eq($('.top_curr').index()).siblings('li').removeClass('select').end().addClass('select');
			window.reqObj.sendData.selectKey = $('.top_curr').index();
		});
		$('#staycommend_evaluationPop .dot_list li').each(function(){
			$(this).off('click');
			$(this).on('click',function(){
				var index = $(this).index();
				$(this).siblings('li').removeClass('select').end().addClass('select');
				lisList.eq(index).siblings('li').removeClass('top_curr').animate({
					opacity:'0'
				}).end().animate({
					opacity:'1'
				}).addClass('top_curr');
				window.reqObj.sendData.selectKey = index;
			})
		});
	}else{
		$('.evaluationPop_mainLeft,.evaluationPop_mainRight').css('visibility','hidden');
	}
	
	/* 評論的字數檢測 */
	$('.evaluationPop_mainMiddle_bottom').find('textarea').off('keyup');
	$('.evaluationPop_mainMiddle_bottom').find('textarea').on('keyup',function() {
		var str = $(this).val();
		var lenInput = str.length;
		window.reqObj.sendData.dataList[window.reqObj.sendData.selectKey].comment = $(this).val();
		$(this).siblings('.evaluationPop_mainMiddle_bottom_num').find('.evaluationPop_mainMiddle_bottom_input').text(lenInput);
		detection();
	});
}

/*檢測輸入結果的函數*/
function detection(){
	var status  = false;
	/*從星星檢測*/
	var starBox = $('.clibg')
	$.each(starBox, function() {
		if($(this).parents('.evaluationPop_mainMiddle_top').find('.clibg').length == 3&&$(this).parents('.evaluationPop_mainMiddle_top').siblings('.evaluationPop_mainMiddle_bottom').find('.evaluationPop_mainMiddle_bottom_input').text() != 0){
			status = true;
		}else{
			status = false;
			return false;
		}
	});
	/*從輸入內容*/
	var inputBox = $('.evaluationPop_mainMiddle_bottom_input');
	$.each(inputBox, function() {
		if($(this).text() != '0'){
			if($(this).parents('.evaluationPop_mainMiddle_bottom').siblings('.evaluationPop_mainMiddle_top').find('.clibg').length != '3'){
				status = false;	
			}
		}
	});
	if(status){
		$('.evaluationPop_btn').addClass('evaluationPop_btn_curr')
		/*發表按鈕*/
		window.reqObj.sendData.dataList[window.reqObj.sendData.selectKey].bol = true;
		$('#evaluationPop_btn').off('click');
		$('#evaluationPop_btn').on('click',function(){
			requestFunc();
		});
	}else{
		window.reqObj.sendData.dataList[window.reqObj.sendData.selectKey].bol = false;
		$('.evaluationPop_btn').removeClass('evaluationPop_btn_curr');
		$('#evaluationPop_btn').off('click');
	}
}
//請求發送
function requestFunc(){
	$.each(window.reqObj.sendData.dataList, function(k,y) {
		if(y.comment == undefined) return true;
		y.comment = y.comment.substring(0,150);
	});
	var dataUrl = 'http://shopping.macaoeasybuy.com/ShopOrderController/EvaluationOrders.easy';
	var goData = {};
	goData.data = [];
	$.each(window.reqObj.sendData.dataList, function(k,y) {
		if(!y.bol) return true;
		goData.data.push(y);
	});
	createFormSubmit({
		listdata :  encodeURIComponent(JSON.stringify(goData)),
		userid : window.userId,
		path : 'http://192.168.3.38:8080/page/common/agency.html?'
	},dataUrl);
}
//返回的callback
function formCallbackData(data){
	var newData = JSON.parse(data.data);
	if(newData.state == 1){
		$('#staycommend_evaluationPop').css('display','none');
		if(newData.SumMop >= 0){
			$('#staycommend_success .staycommend_success_settle_main p').eq(0).find('span.data_num').html('+'+newData.SumMop+'元紅包');
		}else{
			$('#staycommend_success .staycommend_success_settle_main p').eq(0).find('span.data_num').html(newData.SumMop+'元紅包');
		}
		if(newData.SumCommentPoint >= 0){
			$('#staycommend_success .staycommend_success_settle_main p').eq(1).find('span.data_num').html('+'+newData.SumCommentPoint+'積分');
		}else{
			$('#staycommend_success .staycommend_success_settle_main p').eq(1).find('span.data_num').html(newData.SumCommentPoint+'積分');
		}
		if(newData.SumPoint >= 0){
			$('#staycommend_success .staycommend_success_settle_main p').eq(2).find('span.data_num').html('+'+newData.SumPoint+'積分');
		}else{
			$('#staycommend_success .staycommend_success_settle_main p').eq(2).find('span.data_num').html(newData.SumPoint+'積分');
		}
		$('#staycommend_success').fadeIn('fast');
		resetContent(); //重新刷新數據
	}else{
		alert('評價商品失敗，請檢查網絡');
	}
	$('#myIframeId,#myFormId').remove();
}
//獲取商品資料
function getShopData(){
	var dataUrl = 'http://shopping.macaoeasybuy.com/ShopOrderController/QueryReturnGoods.easy?iuserid='+userId+'&shoppingid='+dataId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var token = data.ReturnGoods.token;
		var newData = data.ReturnGoods.list[0];
		//商品圖片
		$('.unconfirmed_returnLeft_messleft').html('<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData.sStandardtupian+'">');
		//商品名稱
		$('.unconfirmed_returnLeft_messright p').eq(0).html(newData.title);
		//商品尺碼
		$('.unconfirmed_returnLeft_messright p').eq(1).html(newData.sStandardInfo);
		//訂單編號
		$('#order_number').html(newData.sNumber);
		//店鋪名稱
		$('#store_name').html(newData.shopname);
		//成交時間
		$('#clinch_time').html(newData.sPlaceOrderTime);
		//單價
		$('#simple_price,#shop_out_pice').html('MOP '+newData.fPrice+'.00');
		//數量
		$('#shop_number').html(newData.iCount);
		//商品券
		var shopNumber = newData.YHinfo >= 0 ? '+MOP '+newData.YHinfo+'／件' : '-MOP '+(newData.YHinfo * -1)+'／件';
		$('#after_shop').html(shopNumber);
		//統計
		$('#all_price').html(newData.fRealyPrice+'.00');

		//換貨
		if(returnState == 'change'){
			var htmlSize = template("goodDetailsSize", data.ReturnGoods);
			$(".unconfirmed_returnMain_size").html(htmlSize);
			GetRules(newData);
			$(".unconfirmed_returnMain_size").find('.kc').html(0);
			selectNumber(newData.iCount,'goodChooseNumber'); //辦定選擇數量事件
			$.each(data.ReturnGoods.list[0].guigelistSet,function(k,y){
				$.each(y, function(m,n) {
					$('#specification'+k+''+m).data('data',{
						className : n,
						isSelected : false
					}).removeAttr('id');
				});
			});
			$('#unconfirmed_returnPop_change').find('p.name_str_old').html(newData.title);
			$('#unconfirmed_returnPop_change').find('p.guige_str_old').html(newData.sStandardInfo);
			$('#unconfirmed_returnPop_change').find('p.num_str_old').html(newData.iCount+'件');
			$('#unconfirmed_returnPop_change').find('p.name_str_new').html(newData.title);
		}
		//退貨
		if(returnState == 'return'){
			selectNumber(newData.iCount,'goodChooseNumber_return',newData.fPrice); //辦定選擇數量事件
			$('#unconfirmed_returnPop_return').find('p.name_str').html(newData.title);
			$('#unconfirmed_returnPop_return').find('p.guige_str').html(newData.sStandardInfo);
			$('#unconfirmed_returnPop_return').find('p.num_str').html(newData.iCount+'件');
			$('#unconfirmed_returnPop_return').find('p.mop_str').html('MOP '+newData.fPrice+'.00');
			$('#shop_return_pice').html('MOP '+newData.fPrice+'.00');
		}
		//狀態  0代表允許退換貨
		window.canSubmitState.exiState = newData.exiState; //換貨
		window.canSubmitState.reiState = newData.reiState; // 退貨
	});
}
//查詢原因
function getReason(state){
	var flag = true;
	var btn = state == 'change' ? $('#change_reson_btn') : $('#return_reson_btn');
	var slideBox = btn.siblings('.unconfirmed_choosereason_slide');
	btn.on('click',function(){
		if(flag){
			getReq();
		}else{
			slideBox.stop().slideDown('fast');
		}
	});
	function getReq(){
		flag = false;
		if(state == 'change'){
			var dataUrl = 'http://shopping.macaoeasybuy.com/ShopOrderController/QueryExchangeReason.easy';
		}else{
			var dataUrl = 'http://shopping.macaoeasybuy.com/ShopOrderController/QueryReturnReason.easy';
		}
		$.getJSON(dataUrl,function(data){
			var html = '';
			$.each(data.list, function(k,y) {
				html+='<li id="'+y.id+state+'"><a>'+y.sValue+'</a></li>';
			});
			slideBox.find('ul').html(html);
			$.each(data.list, function(k,y) {
				$('#'+y.id+state).data('data',y.id).removeAttr('id');
			});
			slideBox.find('ul li').on('click',function(){
				btn.find('span').eq(0).html($(this).text());
				slideBox.stop().slideUp('fast');
				window.sendObj.sReasonId = $(this).data('data');
			});
			slideBox.stop().slideDown('fast');
		});
	}
	maskClick(slideBox,function(){
		slideBox.stop().slideUp('fast');
	},'slide');
}

//圖片上傳
function upLoadFunc(){
	var pickBtnId = returnState == 'return' ? '#return_filePicker' : '#change_filePicker';
	var sendBtnId = returnState == 'return' ? '#return_submit' : '#change_submit';
	var boxId = returnState == 'return' ? '.unconfirmed_returnMain_return' : '.unconfirmed_returnMain_change';
	imgUpload({
		pick : { //文件按鈕
			id : pickBtnId,
			multiple : true
		},
		cancelBtn:'.change_showpicEach_close', //取消圖片按鈕
		submitBtn: sendBtnId, //提交按鈕
		method : 'POST', //上傳方式
		swf: 'http://easyscript.macaoeasybuy.com/js/common/Uploader.swf', //swf路徑
		server : 'http://shopping.macaoeasybuy.com/ShopOrderController/UploadReturnPic.easy',
		fileNumLimit : 3, //文件总数量, 超出则不允许加入队列
		fileSingleSizeLimit: 4 * 1024 * 1024, //单个文件大小是否超出限制, 超出则不允许加入队列。
		fileSizeLimit: 3 * 4 * 1024 * 1024, //文件总大小是否超出限制, 超出则不允许加入队列。
		accept : { //允許文件
			title: 'Images',
			extensions: 'jpg,jpeg,png,gif,apng',
			mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/apng'
		},
		thumb:{ //縮略圖配置
		    width: 120,
		    height: 120,
		    quality: 100,
		    allowMagnify: false,
		    crop: false,
		    type: ''
		},
		compress : false, //是否壓縮文件
		//點擊發佈
		submitBtnClick : function(btn){
			btnOnSubmitFunc(this,btn);
		},
		 //顯示圖片 , 文件插入隊列時觸發
		showImg : function(fileURL,file){
			var newImgHtml = '<div class="change_showpicEach" id="' + file.id + '">'+
											'<div class="change_showpicEach_pic">'+
												'<img src="' + fileURL + '" alt="">'+
											'</div>'+
											'<div class="change_showpicEach_loadingBox">'+
												'<div class="progress-text">等待上傳</div>'+
												'<div class="change_showpicEach_load">'+
													'<div class="change_showpicEach_load_curr"></div>'+
												'</div>'+
											'</div>'+
											'<div class="change_showpicEach_hover">'+
												'<div class="change_showpicEach_close myborder-radius">'+
													'<img src="/src/img/common/tips-box/img-upload-close.png">'+
												'</div>'+
											'</div>'+
										'</div>';
			$(boxId).find('.change_showpic').append(newImgHtml);
			if(this.list.length == 3){
			}else{
				$(pickBtnId).css('float','left');
			}
		},
		//取消圖片
		cancelImg : function(btn,idList) {
			btn.parents('.change_showpicEach').remove();
			if(this.list.length == 0){
				$(pickBtnId).css('float','none');
			}else{
				$(pickBtnId).css('float','left');
			}
		},
		//文件上傳之前觸發(發送參數)
		uploadBeforeSend : function(obj,data,header){
			data.account = window.myuuid; // uuid

		},
		//当开始上传流程时触发。
		startUpload : function(){
			$.each(this.list, function(k,y) {
				if(!y.isComplete){
					$('#'+y.id).find('.change_showpicEach_hover').css({'display':'none','z-index':'0'}); //去掉取消按鈕按鈕
					$('#'+y.id).find('.change_showpicEach_close').off('click.cancel'); //解綁按鈕的取消事件
					$('#'+y.id).find('.change_showpicEach_loadingBox').css('display','block'); //顯示遮罩層
					$('#'+y.id).find('.change_showpicEach_loadingBox .progress-text').html('等待上傳'); //提示
				}
			});
		},
		//某个文件开始上传前触发，一个文件只会触发一次。
		uploadStart : function(file){
			$('#'+file.id).find('.change_showpicEach_loadingBox .progress-text').html('正在上傳'); //提示
			$('#'+file.id).find('.change_showpicEach_load').css('visibility','visible');
		},
		//單個文件上傳失敗
		uploadError : function(file,reason){
			$('#'+file.id).find('.change_showpicEach_loadingBox .progress-text').html('上傳失敗'); //提示
			$('#'+file.id).find('.change_showpicEach_load').css('visibility','hidden');
			$('#'+file.id).find('.change_showpicEach_hover').css({'display':'block','z-index':'1'}); //顯示取消按鈕按鈕
			this.closeUploadImg(file.id,this); //重新辦定事件
		},
		//單個文件上傳完成
		uploadSuccess : function(file,response){
			if(response.result == 'success'){
				updateArrObj(this.list,'id',file.id,'isComplete',true);
				$('#'+file.id).find('.change_showpicEach_loadingBox .progress-text').html('上傳成功'); //提示
				$('#'+file.id).find('.change_showpicEach_load').css('visibility','hidden');
			}else{
				$('#'+file.id).find('.change_showpicEach_loadingBox .progress-text').html('上傳失敗'); //提示
				$('#'+file.id).find('.change_showpicEach_load').css('visibility','hidden');
				$('#'+file.id).find('.change_showpicEach_hover').css({'display':'block','z-index':'1'}); //顯示取消按鈕按鈕
				this.closeUploadImg(file.id,this); //重新辦定事件
				switch(response.result.split(',')[1]){
					case 'type' :
						specialTips('請檢查文件類型！');
					break;
					case 'size' :
						specialTips('每張圖片大小不能超過4MB！');
					break;
					case 'num' :
						specialTips('圖片數量限制為3張！');
					break;
				}
			}
		},
		//進度條的API
		uploadProgress: function(file,percentage) {
			$('#'+file.id).find('.change_showpicEach_load_curr').css('width', percentage * 100 + 'px');
		},
		//文件數量超過限制觸發
		fileNumLimitEvent : function(){
			specialTips('圖片數量限制為3張！');
		},
		//文件大小超過限制觸發
		fileSizeLimitEvent : function(){
			specialTips('每張圖片大小不能超過4MB！');
		},
		//文件類型不符合標準觸發
		fileTypeDeniedEvent : function(){
			specialTips('請檢查文件類型！');
		},
		//所有文件上传结束时触发。
		uploadFinished : function(){
			//只要有一個是flase 都不行哦
			var flag = true;
			$.each(this.list, function(k,y) {
				if(y.isComplete == false) flag = false;
			});
			if(flag == true){
				sendRequest(this.publishData);// 圖片成功，發帖哦
			}else{
				specialTips('圖片上傳失敗，請檢查圖片！'); //有圖片不行，提示用戶
				errorFunc(sendBtnId);
			}
		}
	});
}

//給辦定點擊提交按鈕事件
function btnOnSubmitFunc(obj,btn){
	var self = obj;
	self.publishData = checkPost();
	if(self.publishData == false) return false; //先去檢查內容，是否允許上傳
	//如果沒有要上傳的圖片了，就直接發送內容
	//否則，點擊是繼續上傳圖片
	$(btn).off('click.uploader');
	var flag = true;
	$.each(self.list,function(k,y){
		if(!y.isComplete) flag = false;
	});
	if(self.list.length == 0 || flag){
		sendRequest(self.publishData);
	}else{
		$.each(self.list,function(k,y){
			if(!y.isComplete) self.upload(y.id);
		});
	}
}
//點擊按鈕先去檢查內容
function checkPost(){
	var checkObj = window.sendObj;
	checkObj.sMessage = checkObj.sMessage.substring(0,120);
	if(returnState == 'change'){
		checkObj.sMessage = $('.unconfirmed_change_input').val();
		//響應成功之後顯示的彈框內容
		$('#unconfirmed_returnPop_change').find('p.reason_str_first').html($('#change_reson_btn span:first-of-type').html());
//		$('#unconfirmed_returnPop_change').find('p.reason_str_second').html(checkObj.sMessage);
		var newsTarget = checkObj.sTarget.split('|');
		if(newsTarget[newsTarget.length-1] == '') newsTarget.splice(newsTarget.length-1,newsTarget.length);
		newsTarget = newsTarget.join(',');
		$('#unconfirmed_returnPop_change').find('p.guige_str_new').html(newsTarget);
		$('#unconfirmed_returnPop_change').find('p.num_str_new').html(checkObj.iCount+'件');
	}else if(returnState == 'return'){
		checkObj.sMessage = $('.unconfirmed_return_input').val();
		//響應成功之後顯示的彈框內容
		$('#unconfirmed_returnPop_return').find('p.reason_str_first').html($('#return_reson_btn span:first-of-type').html());
//		$('#unconfirmed_returnPop_return').find('p.reason_str_second').html(checkObj.sMessage);
	}
	if(returnState == 'change'){
		if(window.canSubmitState.exiState != 0){
			specialTips('您已經換過貨了，不提供第二次換貨');
			return false;
		}
		if(checkObj.sTarget == ''){
			specialTips('請選擇換貨商品的規格');
			return false;
		}
		if(window.kucunNum == 0){
			specialTips('您選的換貨商品暫時缺貨');
			return false;
		}
		if(checkObj.sMessage == ''){
			specialTips('請填寫換貨說明');
			return false;
		}
	}
	if(returnState == 'return' && window.canSubmitState.reiState != 0){
		specialTips('您已經退過貨了，不提供第二次退貨');
		return false;
	}else if(returnState == 'return' && checkObj.sMessage == ''){
		specialTips('請填寫退貨說明');
		return false;
	}
	return checkObj;
}
//發送內容請求
function sendRequest(data){
	if(returnState == 'change'){
		createFormSubmit(data,'http://shopping.macaoeasybuy.com/ShopOrderController/ApplyExchangeGoods.easy');
	}else if(returnState == 'return'){
		createFormSubmit(data,'http://shopping.macaoeasybuy.com/ShopOrderController/ApplyReturnGoods.easy');
	}
}
//錯誤重新辦定
function errorFunc(btn){
	$.each(uploader.list,function(k,y){
		y.isComplete = false;
	});
	$(btn).on('click.uploader',function(){
		btnOnSubmitFunc(window.uploader,$(this)[0]);
	});
}
//返回的callback
function formCallbackData(data){
	if(data.data != '-1'){
		if(returnState == 'change'){
			$('#unconfirmed_returnPop_change').css('display','block');
		}else if(returnState == 'return'){
			$('#unconfirmed_returnPop_return').css('display','block');
		}
	}else{
		specialTips('操作失敗，請檢查您的網絡！');
		errorFunc();
	}
}

function startJs(data){
	window.myuuid = uuid();
	if(returnState == 'return'){
		//退貨
		window.sendObj = {
			iCount : 1, //數量
			iShoppingId : dataId, //Id
			sReasonId : 9, //原因Id
			iUserId : data.id, //用戶Id
			sMessage : '', //說明
			account : myuuid,
			path : 'http://192.168.3.38:8080/page/common/agency.html?'
		}
	}else if(returnState == 'change'){
		//換貨
		window.sendObj = {
			iCount : 1, //數量
			iShoppingId : dataId, //Id
			sReasonId : 9, //原因Id
			sTarget : '',//規格
			iUserId : data.id, //用戶Id
			sMessage : '', //說明
			account : myuuid,
			path : 'http://192.168.3.38:8080/page/common/agency.html?'
		}
		window.kucunNum = 0;
	}
	window.canSubmitState = {}
	getShopData(); //獲取商品資料
	setHrefGo(); //設置按鈕的跳轉
	if(returnState == 'change'){
		getReason('change'); //查詢換貨原因
		clacfontNum($('.unconfirmed_change_input'),$('.unconfirmed_change_input_num'));
	}else{
		getReason('return'); //查詢退貨原因
		clacfontNum($('.unconfirmed_return_input'),$('.unconfirmed_return_input_num'));
	}
	upLoadFunc();//圖片上傳
}

//設置按鈕的跳轉
function setHrefGo(){
	$('.unconfirmed_tabBox li').eq(0).find('a').attr('href','http://192.168.3.38:8080/page/easybuy/shopCart/unconfirmed_return.html?state=change&dataid='+dataId);
	$('.unconfirmed_tabBox li').eq(1).find('a').attr('href','http://192.168.3.38:8080/page/easybuy/shopCart/unconfirmed_return.html?state=return&dataid='+dataId);
}

/*輸入理由的字數檢測*/
function clacfontNum($inputBox,$num){
	var lenInput = $inputBox.val().length;
	$inputBox.keyup(function() {
		lenInput = $(this).val().length;
		$num.html(lenInput);
	});
}

//辦定選擇數量事件
function selectNumber(num,inpId,fPrice){
	var maxNum = num;
	var num = $('#'+inpId).val();
	$('.messBox_calcBox_btnLess').on('click',function(){
		if(num == 1) return false;
		num--;
		$('#'+inpId).val(num);
		window.sendObj.iCount = num;
		if(fPrice) $('#shop_return_pice').html('MOP '+(fPrice*num)+'.00');
	});
	$('.messBox_calcBox_btnAdd').on('click',function(){
		if(num == maxNum) return false;
		num++;
		$('#'+inpId).val(num);
		window.sendObj.iCount = num;
		if(fPrice) $('#shop_return_pice').html('MOP '+(fPrice*num)+'.00');
	});
	justNumInput(inpId,function(){
		var str = parseInt($(this).val());
		if(str === NaN || $(this).val().length ==0) $(this).val(1);
		if(str > maxNum) $(this).val(maxNum);
		if(str < maxNum) $(this).val(1);
		window.sendObj.iCount = $(this).val();
		if(fPrice) $('#shop_return_pice').html('MOP '+(fPrice*$(this).val())+'.00');
	});
}

//提示。插入表情或者標籤，多出來的就提示
function specialTips(str,fn) {
	if($('#special-tips').length != 0) return false;
	var div = '<div class="fullAlertBox" id="special-tips">' + str + '</div>';
	$('body').append(div);
	$('#special-tips').css({
		'position': 'fixed',
		'z-index': '888',
		'top' : '50%',
		'left' : '50%',
		'-webkit-transform' : 'translate(-50%,-50%)',
		'-ms-transform' : 'translate(-50%,-50%)',
		'-o-transform' : 'translate(-50%,-50%)',
		'-moz-transform' : 'translate(-50%,-50%)',
		'transform' : 'translate(-50%,-50%)'
	});
	$('#special-tips').fadeIn(500).delay(1000).fadeOut(500, function() {
		$(this).remove();
		if(fn) fn();
	});
}
$(function(){
	$('#editor-box').load('pubilsh_editor-noother.html',function(){
		window.editor = new YezEditor('#editor'); //實例編輯器
		addSelect(false);
	});
	imgUpLoad();
	showInputNum(); //監聽標題框的長度並且輸出

	chooseType(); //選擇文章類型
	Openness(); //選擇市集狀態

	clacCost(); //折扣價計算
});
//點擊按鈕先去檢查內容
function checkPost(){
	var resData = editor.getYezContent();
	var labelList = editor.getLabelArr(); //標籤數組
	var cash = getCost(); //原價現價
	var obj = {
		titleName : getTitleName($('#diaryTitle'),24), //獲取標題名字
		res : resData.newres, //內容
		atPos : resData.atPos, //真實@人位置
		bigexpression : getBigExpression($('#replyBox_sendMess')[0].bigEmojiArr), //大錶情
		className : getDiaryClass(), //獲取文章的類別
		inventory : getDiaryState(), //獲取的市集狀態
		moneyOld : cash.oldNum, //原價
		moneyNew : cash.newNum, //現價
		weChat : $('#wechat').val() || '', //微信
		whatsApp : $('#whatsapp').val() || ''//whatsapp
	};
	if(obj.titleName == ''){
		specialTips('標題不能為空');
		return false;
	}
	if(obj.res == ''){
		specialTips('內容不能為空');
		return false;
	}
	if(obj.className == ''){
		specialTips('請選擇您要發佈的市集類別');
		return false;
	}
	if(obj.moneyOld == '' || obj.moneyNew == ''){
		specialTips('請輸入您要發佈市集的價格');
		return false;
	}
	if(obj.moneyOld < obj.moneyNew){
		specialTips('現售價不能高於原價哦');
		$('#marketNew').val('');
		return false;
	}
	if(obj.weChat == '' && obj.whatsApp == ''){
		specialTips('至少需要輸入一種聯絡方式哦~');
		return false;
	}
	return obj;
}
//發送
function sendRequest(obj){
	var titleName = encodeURIComponent(obj.titleName); // 文章標題
	var purchasedfrom = encodeURIComponent(obj.res); //文章內容
	var newLabelName = encodeURIComponent(obj.newLabelName); //新標籤名字
	var path = 'http://192.168.3.38:8080/page/common/agency.html?';
	//請求路徑
	var ipUrl = 'http://userspace1.macaoeasybuy.com';
	var dataUrl = ipUrl + '/UserPublishController/addFair.easy';
	//創建表單并提交
	createFormSubmit({
		account : myuuid,
		userId : userId,
		userName : userName,
		title : titleName, //標題
		content : purchasedfrom, //內容
		atPos : obj.atPos, //真實at人位置
		bigExpression : obj.bigexpression, //大錶情   |src|src
		className : obj.className, //市集類別
		inventory : obj.inventory, //市集狀態
		path : path, //iframe代理頁面的路徑
		moneyOld : obj.moneyOld, //原價
		moneyNew : obj.moneyNew, //現價
		weChat : obj.weChat,
		whatsApp : obj.whatsApp
	},dataUrl);
}
/*選擇文章類型*/
function chooseType(){
	var flag = false;
	$('.publishBox_articleTitleRight').on('click',function(){
		if(flag){
			if($(this).hasClass('publishBox_articleTitleRight_slideDown')){
				$(this).removeClass('publishBox_articleTitleRight_slideDown');
				$('.publishBox_articleTitleRight_slide').slideUp('fast');
				$('.transparent_bg').hide()
			}else{
				$(this).addClass('publishBox_articleTitleRight_slideDown');
				$('.publishBox_articleTitleRight_slide').slideDown('fast');
				$('.transparent_bg').show()
			}
		}else{
			requestDiaryFunc();
		}
	})
	$('.transparent_bg').on('click',function(){
		$(this).hide();
		$('.publishBox_articleTitleRight').removeClass('publishBox_articleTitleRight_slideDown');
		$('.publishBox_articleTitleRight_slide').slideUp('fast');
	});
	function requestDiaryFunc(){
		flag = true;
		var ipUrl = 'http://userspace1.macaoeasybuy.com';
		var dataUrl = ipUrl + '/UserPublishController/selectFairClass.easy?easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			if(!data) return false;
			//添加節點
			var html = '';
			$.each(data.fairClass, function(k,y) {
				html+='<li>'+y.className+'</li>';
			});
			$('#diary_class ul').append(html);
			//辦定數據
			$.each(data.fairClass, function(k,y) {
				$('#diary_class ul li').eq(k).data('data',y);
			});
			//辦定事件
			diaryClassBindClick();
			//顯示列表
			$('.publishBox_articleTitleRight').addClass('publishBox_articleTitleRight_slideDown');
			$('.publishBox_articleTitleRight_slide').slideDown('fast');
			$('.transparent_bg').show();
		});
	}
	function diaryClassBindClick(){
		$('.publishBox_articleTitleRight_slide ul li').on('click',function(){
			$('#diary_class').data('data',$(this).data('data'));
			$(this).addClass('publish_slide_curr').siblings().removeClass('publish_slide_curr');
			$('.publishBox_articleTitleRight span:nth-of-type(1)').text($(this).text())
		});
	}
}
/*選擇文章的公開性*/
function Openness(){
	$('.publishBox_choosebtn').on('click',function(){
		if($(this).hasClass('publishBox_choosebtn_down')){
			$(this).removeClass('publishBox_choosebtn_down');
			$('.publishBox_choosebtn_slide').fadeOut('fast');
			$('.transparent_bg').hide()
		}else{
			$(this).addClass('publishBox_choosebtn_down');
			$('.publishBox_choosebtn_slide').fadeIn('fast');
			$('.transparent_bg').show()
		}
	})
	$('.transparent_bg').on('click',function(){
		$(this).hide();
		$('.publishBox_choosebtn').removeClass('publishBox_choosebtn_down');
		$('.publishBox_choosebtn_slide').fadeOut('fast');
	})
	$('.publishBox_choosebtn_slide ul li').on('click',function(){
		var idx = $(this).index();
		switch(idx){
			case 0:
				$('#diary_state').data('data',{
					state : '有現貨'
				});
			break;
			case 1:
				$('#diary_state').data('data',{
					state : '無現貨'
				});
			break;
		}
		$('.publishBox_choosebtn span:nth-of-type(1)').text($(this).text());
	})
}
//獲取類別
function getDiaryClass(){
	var str = '';
	if($('#diary_class').data('data') != undefined){
		str = $('#diary_class').data('data').className;
	}
	return str;
}
//獲取的裝填
function getDiaryState(){
	var str = '有現貨';
	if($('#diary_state').data('data') != undefined){
		str = $('#diary_state').data('data').state;
	}
	return str;
}
//獲取原價現價
function getCost(){
	var obj = {}
	obj.oldNum = $('#marketOld').val().replace(/[^\d]/g,'') || '';
	obj.newNum = $('#marketNew').val().replace(/[^\d]/g,'') || '';
	return obj;
}
//折扣價計算
function clacCost(){
	easyBuy.global.dep.justNumInput('marketOld',function(){
		if($(this).val() == ''){
			return;
		}else{
			$(this).val(parseFloat($(this).val()));
			returnCost();
		}
	});
	easyBuy.global.dep.justNumInput('marketNew',function(){
		if($(this).val() == ''){
			return;
		}else{
			$(this).val(parseFloat($(this).val()));
			returnCost();
		}
	});
	function returnCost(){
		if($('#marketNew').val() > $('#marketOld').val()){
			$('.publishBox_market_prompt').show(10).animate({
				'opacity':'1'
			},800).delay(200).animate({
				'opacity':'0'
			},500).hide(10)
			$('#marketNew').val('')
		}else{
			var cost = (($('#marketNew').val()/$('#marketOld').val())*10).toFixed(1);
			cost = cost == 'NaN' ? '0.0' : cost;
			$('.publishBox_market_cost span').text(cost);
		}
	}
}

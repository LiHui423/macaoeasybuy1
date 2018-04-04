var secondInfos = {
	usedFunction : '完全正常',
	appearance : '完全新品',
	period : '保養期內',
	insurance : '三天',
	settlement : '相約面交',
	fineness : '9成新',
	place : '黑沙環'
}
var justNumInput = easyBuy.global.dep.justNumInput;
$(function(){
	$('#editor-box').load('pubilsh_editor.html',function(){
		window.editor = new YezEditor('#editor'); //實例編輯器
		addSelect(true,true);
	});
	// imgUpLoad();
	showInputNum(); //監聽標題框的長度並且輸出
	chooseType(); //選擇文章類型
	justNumInput('price_input'); //現價原價
	getAreaList(); //地區列表
})
easyBuy.global.startJs = function(){
	// 判断IE类型
	function judgeIE(){
		var type = navigator.userAgent;
		var isIE = type.indexOf("compatible") > -1 && type.indexOf("MSIE") > -1;
		if(isIE){
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
			reIE.test(type);
			var fIEVersion = parseFloat(RegExp["$1"]);
			return fIEVersion;
		}
	}
	var version = judgeIE();
	if(version === 9){
		imgUpLoad();
	}else{
		newUpload();
	}
}
//點擊按鈕先去檢查內容
function checkPost(){
	var resData = editor.getYezContent();
	var labelList = editor.getLabelArr(); //標籤數組
	var secondInfos = window.secondInfos;
	var obj = {
		account : myuuid,
		titleName : getTitleName($('#diaryTitle'),24), //獲取標題名字
		res : resData.newres, //內容
		atPos : resData.atPos, //真實@人位置
		labelPos : resData.labelPos,//真實標籤位置
		newLabelName : getNewLabelName(labelList,'labelName'), //獲取新標籤的名字
		newLabelType : getNewLabelName(labelList,'type'),//獲取新標籤的類型
		labelIdList : getLabelIdList(labelList), //獲取標籤列表
		shopIdNew : getShopIdNew($('#shop-btn').data('data')),
		shangpinId : getShangpinId($('#goods-btn').data('data')),
		usedClassId : getDiaryClass(), //獲取文章的類別
		weChat : $('#wechat').val() || '', //微信
		whatsApp : $('#whatsapp').val() || '',//whatsapp
		price : getPriceInput(), //現售價
		usedFunction : secondInfos.usedFunction, //功能
		appearance : secondInfos.appearance, //外觀
		period : secondInfos.period, //保養
		insurance : secondInfos.insurance, //私保
		settlement : secondInfos.settlement, //交收
		fineness : secondInfos.fineness, //新舊程度
		place : secondInfos.place //地區
	};
	if(obj.titleName == ''){
		specialTips('標題不能為空');
		return false;
	}
	if(obj.res == ''){
		specialTips('內容不能為空');
		return false;
	}
	if(obj.usedClassId == ''){
		specialTips('請選擇您要發佈的二手類別');
		return false;
	}
	if(obj.weChat == '' && obj.whatsApp == ''){
		specialTips('至少需要輸入一種聯絡方式哦~');
		return false;
	}
	if(obj.price == ''){
		specialTips('請輸入出讓的價格');
		return false;
	}
	return obj;
}
//發送
function sendRequest(obj){
	var titleName = encodeURIComponent(obj.titleName); // 文章標題
	var purchasedfrom = encodeURIComponent(obj.res); //文章內容
	var newLabelName = encodeURIComponent(obj.newLabelName); //新標籤名字
	var path = 'http://userspace.macaoeasybuy.com/agency.html?';
	//請求路徑
	// var ipUrl = 'http://userspace1.macaoeasybuy.com';
	// var dataUrl = ipUrl + '/UserPublishController/addSecondHand.easy';
	var ipUrl = 'http://192.168.3.127:8089';
	var dataUrl = ipUrl + '/yez_easyBuyMall_userSpace/UserPublishController/addSecondHand.easy';
	//創建表單并提交
	createFormSubmit({
		account : myuuid,
		userId : userId,
		userName : userName,
		titleName : titleName, //標題
		usedContent : purchasedfrom, //內容
		newLabelName : newLabelName, //新標籤名字 #阿斯蒂芬#，#阿斯蒂芬#
		labelPos : obj.labelPos, //真實#位置
		atPos : obj.atPos, //真實at人位置
		shangpinId : obj.shangpinId, //商品id，商品圖片src，商品編號 （ |||| 隔開）
		shopIdNew : obj.shopIdNew, //商店Id
		labelId : obj.labelIdList, //標籤Id 新標籤為0     10,0,20,451
		newLabelType : obj.newLabelType, //新標籤類型  1,2,0
		usedClassId : obj.usedClassId, //類別
		path : path,
		wechat : obj.weChat,
		whatsapp : obj.whatsApp,
		price : obj.price + '',
		usedFunction : obj.usedFunction, //功能
		appearance : obj.appearance, //外觀
		period : obj.period, //保養
		insurance : obj.insurance, //私保
		settlement : obj.settlement, //交收
		fineness : obj.fineness, //新舊程度
		place : obj.place, //地區
		isValid : '0' //二手狀態
	},dataUrl);
}
/*選擇文章類型*/
function chooseType(){
	var flag = false;
	$('.publishBox_articleTitleRight').on('click',function(){
		if(flag){
			if($(this).hasClass('publishBox_articleTitleRight_slideDown')){
				$('.publishBox_articleTitleRight_slide').slideUp('fast',function(){
					console.log('111')
					$('.publishBox_articleTitleRight').removeClass('publishBox_articleTitleRight_slideDown');
				});
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
		
		$('.publishBox_articleTitleRight_slide').slideUp('fast',function(){
			$('.publishBox_articleTitleRight').removeClass('publishBox_articleTitleRight_slideDown');
		});
	});
	function requestDiaryFunc(){
		flag = true;
		var ipUrl = 'http://userspace1.macaoeasybuy.com';
		var dataUrl = ipUrl + '/UserPublishController/selectUsedClass.easy?easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			if(!data) return false;
			//添加節點
			var html = '';
			$.each(data.usedClass, function(k,y) {
				html+='<li><div><img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+y.pic+'"></div><div>'+y.className+'</div></li>';
			});
			$('#diary_class ul').append(html);
			//辦定數據
			$.each(data.usedClass, function(k,y) {
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
			$('.publishBox_articleTitleRight span:nth-of-type(1)').text($(this).text());
		});
	}
}
//獲取文章類別
function getDiaryClass(){
	var str = '';
	if($('#diary_class').data('data') != undefined){
		str = $('#diary_class').data('data').id;
	}
	return str;
}
//獲取現價
function getPriceInput(){
	var res = '';
	res = $('#price_input').val();
	res = res.replace(/[^\d^\.]+/g,'');
	$('#price_input').val(res);
	return res;
}
//獲取地區列表
function getAreaList(){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/UserPublishController/queryPlace.easy?easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var html = '';
		$.each(data.result,function(k,y){
			html += '<li>'+y+'</li>';
		});
		$('#place_list .secondHand_chooseEach_slide ul').html(html);
		secondHandChoose(); //辦定事件
	})
}
//選擇事件辦定
function secondHandChoose(){
	$('.pubish_secondHand_chooseEach.sesList').each(function(){
		$(this).data('data',$(this).attr('id').split('_')[0]);
	});
	$('.secondHand_chooseEach_slide ul li').each(function(){
		$(this).data('data',{
			text : $(this).html(),
			class : $(this).parents('.pubish_secondHand_chooseEach').data('data')
		});
		$(this).on('click',function(){
			var data = $(this).data('data');
			window.secondInfos[data.class] = data.text;
			$(this).parents('.secondHand_chooseEach_slide').siblings('.secondHand_chooseEach_main').find('span:nth-of-type(1)').text($(this).text());
			$(this).parents('.secondHand_chooseEach_slide').siblings('.secondHand_chooseEach_main').removeClass('secondHand_chooseEach_slideNow');
			$(this).parents('.secondHand_chooseEach_slide').slideUp('fast');
			$('#shadow').css('display','none');
		});
	});
	$('.secondHand_chooseEach_main').on('click',function(){
		if($(this).hasClass('secondHand_chooseEach_slideNow')){
			$('#shadow').css('display','none');
			
			$(this).removeClass('secondHand_chooseEach_slideNow');
			$(this).siblings('.secondHand_chooseEach_slide').slideUp('fast');
		}else{
			$('#shadow').css('display','block');
			
			$('.secondHand_chooseEach_main').removeClass('secondHand_chooseEach_slideNow');
			$('.secondHand_chooseEach_slide').slideUp('fast');
			
			$(this).addClass('secondHand_chooseEach_slideNow');
			$(this).siblings('.secondHand_chooseEach_slide').slideDown('fast');
		}
	});
	$('#shadow').on('click',function(){
		$('.secondHand_chooseEach_main').removeClass('secondHand_chooseEach_slideNow');
		$('.secondHand_chooseEach_slide').slideUp('fast');
		$(this).css('display','none');
	});
}

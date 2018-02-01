$(function(){
	$('#editor-box').load('pubilsh_editor.html',function(){
		window.editor = new YezEditor('#editor'); //實例編輯器
		addSelect(true);
	});
	imgUpLoad();
	showInputNum(); //監聽標題框的長度並且輸出
	
	chooseType(); //選擇文章類型
});
//點擊按鈕先去檢查內容
function checkPost(){
	var resData = editor.getYezContent();
	var labelList = editor.getLabelArr(); //標籤數組
	var obj = {
		titleName : getTitleName($('#diaryTitle'),24), //獲取標題名字
		res : resData.newres, //內容
		atPos : resData.atPos, //真實@人位置
		labelPos : resData.labelPos,//真實標籤位置
		bigexpression : getBigExpression($('#replyBox_sendMess')[0].bigEmojiArr), //大錶情
		newLabelName : getNewLabelName(labelList,'labelName'), //獲取新標籤的名字
		newLabelType : getNewLabelName(labelList,'type'),//獲取新標籤的類型
		labelIdList : getLabelIdList(labelList), //獲取標籤列表
		shopIdNew : getShopIdNew($('#shop-btn').data('data')),
		shangpinId : getShangpinId($('#goods-btn').data('data')),
		typeName : getDiaryClass(), //獲取文章的類別
	};
	if(obj.titleName == ''){
		specialTips('標題不能為空');
		return false;
	}
	if(obj.res == ''){
		specialTips('內容不能為空');
		return false;
	}
	if(obj.typeName == ''){
		specialTips('請選擇您要發佈的生活圈類別');
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
	var dataUrl = ipUrl + '/UserPublishController/addLifeCycle.easy';
	//創建表單并提交
	createFormSubmit({
		account : myuuid,
		userId : userId,
		userName : userName,
		titleName : titleName, //標題
		lifeContent : purchasedfrom, //內容
		newLabelName : newLabelName, //新標籤名字 #阿斯蒂芬#，#阿斯蒂芬#
		labelPos : obj.labelPos, //真實#位置
		atPos : obj.atPos, //真實at人位置
		shangpinId : obj.shangpinId, //商品id，商品圖片src，商品編號 （ |||| 隔開）
		shopIdNew : obj.shopIdNew, //商店Id
		bigExpression : obj.bigexpression, //大錶情   |src|src
		labelId : obj.labelIdList, //標籤Id 新標籤為0     10,0,20,451
		newLabelType : obj.newLabelType, //新標籤類型  1,2,0
		typeName : obj.typeName, //生活圈類別
		path : path
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
		var dataUrl = ipUrl + '/UserPublishController/selectLifeCycleClass.easy?easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			if(!data) return false;
			//添加節點
			var html = '';
			$.each(data.lifeCycleClass, function(k,y) {
				html+='<li>'+y.className+'</li>';
			});
			$('#diary_class ul').append(html);
			//辦定數據
			$.each(data.lifeCycleClass, function(k,y) {
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
//獲取文章類別
function getDiaryClass(){
	var str = '';
	if($('#diary_class').data('data') != undefined){
		str = $('#diary_class').data('data').className;
	}
	return str;
}

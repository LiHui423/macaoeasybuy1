var createFormSubmit = easyBuy.global.dep.createFormSubmit;
$(function(){
	$('#editor-box').load('pubilsh_editor.html',function(){
		window.editor = new YezEditor('#editor'); //實例編輯器
		addSelect(true);
	});
	//imgUpLoad();
	// $('#publish_submit').on('click',function(){
	// 	newUpload();
	// })
	showInputNum(); //監聽標題框的長度並且輸出
});
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
	// newUpload();
}
//點擊按鈕先去檢查內容
function checkPost(){
	var resData = editor.getYezContent();
	var labelList = editor.getLabelArr(); //標籤數組
	var obj = {
		account : myuuid,
		titleName : getTitleName($('#diaryTitle'),24), //獲取標題名字
		res : resData.newres, //內容
		atPos : resData.atPos, //真實@人位置
		labelPos : resData.labelPos,//真實標籤位置
		bigexpression : getBigExpression($('#replyBox_sendMess')[0].bigEmojiArr), //大錶情
		newLabelName : getNewLabelName(labelList,'labelName'), //獲取新標籤的名字
		newLabelType : getNewLabelName(labelList,'type'),//獲取新標籤的類型
		labelIdList : getLabelIdList(labelList), //獲取標籤列表
		shopIdNew : getShopIdNew($('#shop-btn').data('data')),
		shangpinId : getShangpinId($('#goods-btn').data('data'))
	};
	if(obj.titleName == ''){
		specialTips('標題不能為空');
		return false;
	}
	if(obj.res == ''){
		specialTips('內容不能為空');
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
	var ipUrl = 'http://192.168.3.127:8089';
	var dataUrl = ipUrl + '/yez_easyBuyMall_userSpace/UserPublishController/addDissipate.easy';
	//創建表單并提交
	createFormSubmit({
		account : myuuid,
		userId : userId,
		userName : userName,
		titleName : titleName, //標題
		purchasedfrom : purchasedfrom, //內容
		newLabelName : newLabelName, //新標籤名字 #阿斯蒂芬#，#阿斯蒂芬#
		labelPos : obj.labelPos, //真實#位置
		atPos : obj.atPos, //真實at人位置
		shangpinId : obj.shangpinId, //商品id，商品圖片src，商品編號 （ |||| 隔開）
		shopIdNew : obj.shopIdNew, //商店Id
		bigExpression : obj.bigexpression, //大錶情   |src|src
		labelId : obj.labelIdList, //標籤Id 新標籤為0     10,0,20,451
		newLabelType : obj.newLabelType, //新標籤類型  1,2,0
		path : path
	},dataUrl);
}

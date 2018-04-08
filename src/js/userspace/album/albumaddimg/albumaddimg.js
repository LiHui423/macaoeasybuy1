$(function(){
	// 獲取數據
	getAlbumDetail();
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
	//點擊按鈕先去檢查內容
	function checkPost() {
		var obj = {
			account : myuuid,
			titleName: $('.album-info .album-title').html(), //獲取標題名字
			typeName: $('#selecter span').html(), //獲取文章的類別
			classId: '6', //類別Id
			albumId : easyBuy.global.pageParameter.albumId
		};
		// if(obj.titleName == '') {
		// 	specialTips('標題不能為空');
		// 	return false;
		// }
		// if(obj.typeName == '' || obj.typeName == undefined) {
		// 	specialTips('請選擇您要發佈的專輯類別');
		// 	return false;
		// }
		return obj;
	}
	editorEvent();
	var fileCount = 0;
	//舉報圖片上傳
	var version = judgeIE();
	if(version === 9){
		imgUpload({
			submitBtn: '#save-btn', //提交按鈕
			fileBtn: '#upload-btn', //文件按鈕
			pick : { //文件按鈕
				id : '#upload-btn',
				multiple : true
			},
			cancelBtn: '.editor-items-img .close-btn', //取消圖片按鈕
			swf: 'http://easyscript.macaoeasybuy.com/js/plug/Uploader.swf', //swf路徑 必須
			server:'http://192.168.3.127:8089/yez_easyBuyMall_userSpace/UserPublishController/preUpload.easy',
			maxNum: 6, //文件总数量, 超出则不允许加入队列
			fileMaxSize: 4 * 1024 * 1024,
			filesMaxSize: 4 * 4 * 1024 * 1024,
			fileAccept: {
				title: 'Images',
				extensions: 'jpg,jpeg,png,gif,apng',
				mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/apng'
			},
			uoloadMethod: 'POST', //上傳方式
			thumb:{
				width: 200,
				height: 200,
				quality: 100,
				allowMagnify: true,
				crop: false,
				type: 'image/jpeg'
			},
			//點擊發佈
			submitBtnClick : function(btn){
				console.log(this);
				btnOnSubmitFunc(this,btn);
			},
			//當選擇文件后顯示圖片的API
			showImg:function(fileURL, file){
				// var html = '<li class="editor-lister-item clearfloat" data-id="'+file.id+'">'+
				// 				+'<div class="editor-items-img">'+
				// 					+'<img src="'+fileURL+'">'+
				// 					+'<div class="close-btn">'+
				// 						+'<img src="/src/img/common/tips-box/img-upload-close.png" alt="">'+
				// 					+'</div>'+
				// 				+'</div>'+
				// 				+'<div class="editor-items-value scrollIe scrollOther" contenteditable="true" placeholder="為此圖片添加描述吧！"></div>'+
				// 			+'</li>';
				var html = `<li class="editor-lister-item clearfloat" id=${file.id}>
								<div class="editor-items-img">
									<img src=${fileURL}>
									<div class="close-btn">
										<img src="/src/img/common/tips-box/img-upload-close.png" alt="">
									</div>
								</div>
								<div class="editor-items-value scrollIe scrollOther" contenteditable="true" placeholder="為此圖片添加描述吧！"></div>
							</li>`;
				$('.editor-upload .editor-lister').prepend(html);
				html = null;
				fileCount++;
				$('.upload-count .now-num').html(fileCount);
				if(fileCount == 6){
					$('.editor-upload .upload-box').css('display','none');
				}
				editorEvent();
			},
			//取消圖片的API
			cancelImg: function(btn) {
				//我這裡做了移除BOM節點
				btn.parents('.editor-lister-item').remove();
				fileCount--;
				$('.upload-count .now-num').html(fileCount);
				$('.editor-upload .upload-box').css('display','block');
			},
			//進度條的API
			progressShow: function(percentage) {
				
			},
			//開始上傳API
			startUpload: function() {
				//console.log('開始上傳');
			},
			//當單個文件上傳成功時觸發
			uploadSuccess: function(file, response){
				//response服務器返回來的信息
			},
			//全部文件上傳完成
			uploadFinished: function(){
				console.log('全部文件上傳完成');
			},
			//傳送之前，傳送參數
			beforeSend:function(obj,data,headers){
				data=$.extend(data,{
					myid:data.id
				});
			}
		});
	}else{
		newUpload();
		// 調用新的上傳插件
		function newUpload(){
			new EasyUplader({
				pickerId : 'upload-btn',
				// server : 'http://userspace1.macaoeasybuy.com/UserPublishController/preUpload.easy',
				server : 'http://192.168.3.127:8089/yez_easyBuyMall_userSpace/UserPublishController/preUpload.easy',
				submitBtnId : 'save-btn',
				multiple : true,
				method : 'POST',
				isDropUpload:true,
				isPreview:true,
				maxlength : 6,
				maxSize:2,
				fileType : ['image/png','image/gif','image/jpeg'],
				onSelectImage : function(file,imgobj){
					var count = $('.now-num').html();
					$('form').append(imgobj);
					var self = this;
					//在body中动态生成div，其中包含img/textarea/span删除按钮
					var itemId='linshi'+Math.floor(Math.random()*100);
					/*var itemId = file.name.split('.')[0] + 'item';*/
					var html = '<div class="album-list-item clearfloat" id='+itemId+'><div class="album-list-img-view"><span></span></div><textarea class="album-list-img-content scrollIe scrollOther" placeholder="為您的圖片添加描述"></textarea></div>';
					/*$('.drop_area').append(html);*/
					// $('body').append(html);
					$('.editor-lister').prepend(html);
					// $('#publish_submit').addClass('select');
					count++;
					$('.now-num').html(count);
					$('#'+itemId).css({'position':'relative','display':'inline-block','margin-right':'10px'});
					$(imgobj).css({'width':'150px','height':'150px'});
					$('#'+itemId+' .album-list-img-view').append(imgobj);
					var span=$('#'+itemId).find('span');
					$(span).css({
						'position':'absolute',
						'cursor':'pointer',
						'width':'20px',
						'height':'20px',
						'border-radius':'10px',
						'background-color':'white',
						'line-height':'20px',
						'text-align':'center'
					})
					span.addClass('file-temp-btn').html('&times;');
					span.attr('id',itemId+'item');
					span.on('click',function(){
						self.cancelFile(file.id);
						var count = $('#nowNum').html();
						count--;
						$('#nowNum').html(count);
						$(this).parent().siblings().remove();
						$(this).parent().remove();
						
					});

					
				},
				onSelectFile:function(file){
					var str = file.name + '这是自定义的参数';
					// this.setFileParam(str);
				},
				onError : function(type){
					if(type == 'size'){
						specialTips('文件大小超过限制');
					}else if(type == 'type'){
						specialTips('文件格式有问题');
					}else if(type=='number'){
						specialTips('文件数量有问题')
					}else if(type == 'upload'){
						specialTips('發生未知錯誤');
					}
				},
				onBeforeSend : function(){
					var self = this;
					var re = checkPost();
					if(re == false) return false; //先去檢查內容，是否允許上傳
					//如果沒有要上傳的圖片了，就直接發送內容
					//否則，點擊時繼續上傳圖片
					$('#replyBox_sendMess').off('click.uploader');
					var flag = true;
					$.each(self.uploadList,function(k,y){
						if(!y.isComplete) flag = false;
					});
					if(self.uploadList.length == 0 || flag){
						sendRequest(re);
						self.setParm(re);
					}else{
						// $.each(self.uploadList,function(k,y){
						// 	self.setParm(re);
						// 	if(!y.isComplete) self.doSubmit();
						// });
						self.setParm(re);
						self.doSubmit();
						sendRequest(re);
					}
					// var title = $('#diaryTitle').val();
					// var content = $('#editor').html();
					// console.log(title);
					// console.log(content);
					// if(title === '' || content === ''){
					// 	alert('帖子標題或內文不能為空');
					// }else{
					// 	this.setParm({
					// 		title : title,
					// 		content : content,
					// 	});
					// }
				},
				onSubmitSuccess:function(data){
					if(data.result == 'success'){
						specialTips('上傳完成,3s后返回帖子詳細頁');
					}
				},
			});
		}

	}
	
});

//編輯框事件
function editorEvent(){
	$('.editor-items-value').off('focus blur');
	$('.editor-items-value').on('focus',function(){
		$(this).attr('placeholder','');
	});
	$('.editor-items-value').on('blur',function(){
		if($(this).text() == ''){
			$(this).attr('placeholder','為此圖片添加描述吧！');
		}else{
			$(this).attr('placeholder','');
		}
	});
}
function getAlbumDetail(){
	var albumId = easyBuy.global.pageParameter.albumId;
	var url = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryTheAlbumInfo.easy?id='+albumId+'&easybuyCallback=?';
	$.ajax({
		url: url,
		type: 'GET',
		dataType: 'json',
		success: function(data){
			console.log(data);
			var html = `<img style="width:180px;height:180px" src="//wap.macaoeasybuy.com/${data.thecoverpictureurl}" onerror="this.onerror=null;this.src='/src/img/userspace/album/album-no-img.png'">`;
			$('#userspace-content .album-cover').html(html);
			$('#userspace-content .album-info .album-title').html(`《${data.albumInfo.thealbumName}》`);
			$('#userspace-content .album-info .album-allnum').html(`專輯數：${data.albumInfo.groupIMgSum}張`);
			$('#selecter span').html(`${data.albumInfo.className}`);
			$('#userspace-content .album-info .album-info-num li:nth-child(1) div:nth-child(1)').html(data.albumInfo.seeNum);
			$('#userspace-content .album-info .album-info-num li:nth-child(2) div:nth-child(1)').html(data.albumInfo.topicSum);
			$('#userspace-content .album-info .album-info-num li:nth-child(3) div:nth-child(1)').html(data.albumInfo.loveNum);
			$('#userspace-content .album-info .album-info-num li:nth-child(4) div:nth-child(1)').html(data.albumInfo.collectionNum);
			
		},
		error: function(){
			console.log('發生未知錯誤');
		}
	});
}
//提示
function specialTips(str, fn) {
	// if($('#special-tips').length != 0) return false;
	// var div = '<div class="fullAlertBox" id="special-tips">' + str + '</div>';
	// $('body').append(div);
	// $('#special-tips').css({
	// 	'position': 'fixed',
	// 	'z-index': '888',
	// 	'top': '50%',
	// 	'left': '50%',
	// 	'-webkit-transform': 'translate(-50%,-50%)',
	// 	'-ms-transform': 'translate(-50%,-50%)',
	// 	'-o-transform': 'translate(-50%,-50%)',
	// 	'-moz-transform': 'translate(-50%,-50%)',
	// 	'transform': 'translate(-50%,-50%)'
	// });
	// $('#special-tips').fadeIn(500).delay(1000).fadeOut(500, function() {
	// 	// $(this).remove();
	// 	// if(fn) fn();$(this).remove();
	// 	// if(fn) fn();
	// });
	$('#comment-success-tips-empty .yez-tips-box div').html(`<img alt="" src="//img.macaoeasybuy.com/img/common/icon/focusShop_icon.png">
	已成功上傳圖片！`)
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
//發送
function sendRequest(obj) {
	console.log(obj);
	var titleName = encodeURIComponent(obj.titleName); // 文章標題

	//獲取路徑
	//	var path = window.location.href.split('/').splice(0, window.location.href.split('/').length - 1);
	//	path[1] = '';
	//	path = path.join('/') + '/publish_iframe.html?';
	var path = 'http://userspace.macaoeasybuy.com/agency.html?';
	//請求路徑
	// var ipUrl = 'http://userspace1.macaoeasybuy.com';
	// var dataUrl = ipUrl + '/UserPublishController/addAlbum.easy';
	var ipUrl = 'http://192.168.3.127:8089';
	var dataUrl = ipUrl +  '/yez_easyBuyMall_userSpace/UserPublishController/addAlbum.easy';
	//創建表單并提交
	easyBuy.global.dep.createFormSubmit({
		account: myuuid,
		userId: userId,
		userName: userName,
		thealbumname: titleName, //標題
		classname: obj.typeName, //類別
		classId: obj.classId,
		path: path,
		albumId : obj.albumId
	}, dataUrl);

}
//點擊按鈕先去檢查內容
function checkPost() {
	var obj = {
		account : myuuid,
		titleName: $('.album-info .album-title').html(), //獲取標題名字
		typeName: $('#selecter span').html(), //獲取文章的類別
		classId:'6', //類別Id
		albumId : easyBuy.global.pageParameter.albumId
	};
	// if(obj.titleName == '') {
	// 	specialTips('標題不能為空');
	// 	return false;
	// }
	// if(obj.typeName == '' || obj.typeName == undefined) {
	// 	specialTips('請選擇您要發佈的專輯類別');
	// 	return false;
	// }
	return obj;
}
//返回的callback
function formCallbackData(data) {
	console.log(data);
	if(data.data == '-1') {
		specialTips('發佈失敗，請檢查發佈內容！');
		errorFunc();
	} else {
		// $('#comment-success-tips-empty').attr('display','block');
		$('#comment-success-tips-empty').fadeIn(500).delay(1500).fadeOut(500);
	}
	// $('#myIframeId,#myFormId').remove();
}

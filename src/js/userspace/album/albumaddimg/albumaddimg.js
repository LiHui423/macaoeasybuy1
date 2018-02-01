$(function(){
	editorEvent();
	var fileCount = 0;
	//舉報圖片上傳
	imgUpload({
		submitBtn: '#save-btn', //提交按鈕
		fileBtn: '#upload-btn', //文件按鈕
		cancelBtn: '.editor-upload .editor-lister li .editor-items-img .close-btn', //取消圖片按鈕
		swf: '/js/Uploader.swf', //swf路徑 必須
		server:'http://shopping.macaoeasybuy.com/ceshiUpload/webUploader.easy',
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
		//當選擇文件后顯示圖片的API
		showImg:function(fileURL, file){
			var html = '<li class="editor-lister-item clearfloat" data-id="'+file.id+'">'+
							+'<div class="editor-items-img">'+
								+'<img src="'+fileURL+'">'+
								+'<div class="close-btn">'+
									+'<img src="/img/common/tips-box/img-upload-close.png" alt="">'+
								+'</div>'+
							+'</div>'+
							+'<div class="editor-items-value scrollIe scrollOther" contenteditable="true" placeholder="為此圖片添加描述吧！"></div>'+
						+'</li>';
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

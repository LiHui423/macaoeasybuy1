//編輯該專輯
function editorLabel(){
	$('#editor-label-btn').on('click',function(){
		$('#content-box').css('display','none');
		$('#editor-box').fadeIn();
	});
	$('#upload-exit').on('click',function(){
		$('#content-box').fadeIn();
		$('#editor-box').css('display','none');
	});
	//監聽輸入長度
	mathValueLength($('#editor-box .editor-input'),$('#editor-box .upload-describe-count span'),200);
	//圖片上傳
	imgUpload({
		submitBtn: '#upload-save', //提交按鈕
		multiple:false,
		fileBtn: '#upload-btn', //文件按鈕
		cancelBtn: '#editor-box .upload-label-img>div .close-btn', //取消圖片按鈕
		swf: '//js.macaoeasybuy.com/js/Uploader.swf', //swf路徑 必須
		server:'http://shopping1.macaoeasybuy.com/ceshi/ceshiupload.easy',
		maxNum: 1, //文件总数量, 超出则不允许加入队列
		fileMaxSize: 4 * 1024 * 1024,
		filesMaxSize: 4 * 1 * 1024 * 1024,
		fileAccept: {
			title: 'Images',
			extensions: 'jpg,jpeg,png,gif,apng',
			mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/apng'
		},
		uoloadMethod: 'POST', //上傳方式
		thumb:{
		    width: 864,
		    height: 496,
		    quality: 100,
		    allowMagnify: true,
		    crop: false,
		    type: 'image/jpeg'
		},
		//當選擇文件后顯示圖片的API
		showImg:function(fileURL, file){
			var html = '<div class="upload-img-box"><img src="'+fileURL+'" alt="" class="upload-picture"><img src="/src/img/userspace/label/upload-close.png" alt="" class="close-btn"></div>'
			$('#editor-box .upload-label-img>div').prepend(html);
			$('#upload-btn').css('display','none');
		},
		//取消圖片的API
		cancelImg: function(btn) {
			//我這裡做了移除BOM節點
			btn.parent().remove();
			$('#upload-btn').css('display','block');
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
		}
	});
}

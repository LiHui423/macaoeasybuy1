// 調用新的上傳插件
function newUpload(){
	new EasyUplader({
		pickerId : 'publish_submit',
		// server : 'http://userspace1.macaoeasybuy.com/UserPublishController/preUpload.easy',
		server : 'http://192.168.3.127:8089/yez_easyBuyMall_userSpace/UserPublishController/preUpload.easy',
		submitBtnId : 'replyBox_sendMess',
		multiple : true,
		method : 'POST',
		isDropUpload:true,
		isPreview:true,
		maxlength : 6,
		maxSize:2,
		fileType : ['image/png','image/gif','image/jpeg'],
		onSelectImage : function(file,imgobj){
			var count = $('#nowNum').html();
			$('form').append(imgobj);
			var self = this;
			//在body中动态生成div，其中包含img/textarea/span删除按钮
			var itemId='linshi'+Math.floor(Math.random()*100);
			/*var itemId = file.name.split('.')[0] + 'item';*/
			var html = '<div class="album-list-item clearfloat" id='+itemId+'><div class="album-list-img-view"><span></span></div><textarea class="album-list-img-content scrollIe scrollOther" placeholder="為您的圖片添加描述"></textarea></div>';
			/*$('.drop_area').append(html);*/
			// $('body').append(html);
			$('#preview-box').prepend(html);
			$('#publish_submit').addClass('select');
			count++;
			$('#nowNum').html(count);
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
			console.log(self.uploadList);
			var re = checkPost();
			console.log(re);
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
				self.doSubmit();
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
				sendRequest(checkPost());
				specialTips('上傳完成,3s后返回帖子詳細頁');
			}
		},
	});
}
// 調用上傳插件--舊的
function imgUpLoad(){
	imgUpload({
		pick : { //文件按鈕
			id : '#publish_submit',
			multiple : true
		},
		cancelBtn : '.upload-picboxEach_clear', //取消圖片按鈕的Class名
		submitBtn: '#replyBox_sendMess', //提交按鈕
		method : 'POST', //上傳方式
		swf: 'http://easyscript.macaoeasybuy.com/js/plug/Uploader.swf', //swf路徑
		server : 'http://192.168.3.127:8089/yez_easyBuyMall_userSpace/UserPublishController/preUpload.easy',
		fileNumLimit : 6, //文件总数量, 超出则不允许加入队列
		fileSingleSizeLimit: 4 * 1024 * 1024, //单个文件大小是否超出限制, 超出则不允许加入队列。
		fileSizeLimit: 6 * 4 * 1024 * 1024, //文件总大小是否超出限制, 超出则不允许加入队列。
		accept : { //允許文件
			title: 'Images',
			extensions: 'jpg,jpeg,png,gif,apng',
			mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/apng'
		},
		thumb:{ //縮略圖配置
		    width: 150,
		    height: 150,
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
			var html = template('upload-show-img',{
				pic : fileURL,
				id : file.id
			});
			//添加模板
			$('#preview-box').prepend(html);
			$('#nowNum').html(this.list.length);
		//			if(this.list.length >= 6){
		//				$('.upload-picbox').css('display','none');
		//			}
		},
		//取消圖片
		cancelImg : function(btn,idList) {
			btn.parents('.album-list-item').remove();
//			$('.upload-picbox').css('display','block');
			$('#nowNum').html(idList.length);
		},
		//文件上傳之前觸發(發送參數)
		uploadBeforeSend : function(obj,data,header){
			data.account = myuuid; // uuid
			data.desc = $('#'+data.id).find('textarea').val();
		},
		//当开始上传流程时触发。
		startUpload : function(){
			$.each(this.list, function(k,y) {
				if(!y.isComplete){
					$('#'+y.id).find('.upload-picboxEach_clear').css({'display':'none','z-index':'0'}); //去掉取消按鈕按鈕
					$('#'+y.id).find('.upload-picboxEach_clear').off('click.cancel'); //解綁按鈕的取消事件
					$('#'+y.id).find('.upload-picboxEach_clear_shadow').css('display','block'); //顯示遮罩層
					$('#'+y.id).find('.upload-picboxEach_clear_shadow .progress-text').html('等待上傳'); //提示
				}
			});
		},
		//某个文件开始上传前触发，一个文件只会触发一次。
		uploadStart : function(file){
			$('#'+file.id).find('.progress-text').html('正在上傳');
			$('#'+file.id).find('.progress').css('visibility','visible');
		},
		//單個文件上傳失敗
		uploadError : function(file,reason){
			$('#'+file.id).find('.progress-text').html('上傳失敗');
			$('#'+file.id).find('.progress').css('visibility','hidden');
			$('#'+file.id).find('.upload-picboxEach_clear').css({'display':'block','z-index':'1'}); //去掉取消按鈕按鈕
			this.closeUploadImg(file.id,this); //重新辦定事件
		},
		//單個文件上傳完成
		uploadSuccess : function(file,response){
			if(response.result == 'success'){
				updateArrObj(this.list,'id',file.id,'isComplete',true);
				$('#'+file.id).find('.progress-text').html('上傳成功');
				$('#'+file.id).find('.progress').css('visibility','hidden');
			}else{
				$('#'+file.id).find('.progress-text').html('上傳失敗');
				$('#'+file.id).find('.progress').css('visibility','hidden');
				$('#'+file.id).find('.upload-picboxEach_clear').css({'display':'block','z-index':'1'}); //去掉取消按鈕按鈕
				this.closeUploadImg(file.id,this); //重新辦定事件
				switch(response.result.split(',')[1]){
					case 'type' :
						specialTips('請檢查文件類型！');
					break;
					case 'size' :
						specialTips('每張圖片大小不能超過4MB！');
					break;
					case 'num' :
						specialTips('圖片數量限制為6張！');
					break;
				}
			}
		},
		//進度條的API
		uploadProgress: function(file,percentage) {
			$('#'+file.id).find('.progress div').css('width',percentage * 100 + '%');
		},
		//文件數量超過限制觸發
		fileNumLimitEvent : function(){
			specialTips('圖片數量限制為6張！');
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
				errorFunc();
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

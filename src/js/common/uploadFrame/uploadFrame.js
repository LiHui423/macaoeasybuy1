var deleteArrObj = easyBuy.global.dep.deleteArrObj;
function imgUpload(opts){
	window.uploader = new WebUploader.Uploader({
		pick : opts.pick, //配置按鈕
		accept : opts.accept, //配置允許文件
		thumb : opts.thumb, //配置縮略图片的选项。
		compress : opts.compress, //配置压缩的图片的选项。
		server : opts.server, //服務端 路徑
		swf : opts.swf, //false文件路徑
		method : opts.method, //POST或者GET
		fileNumLimit : opts.fileNumLimit, //验证文件总数量, 超出则不允许加入队列。
		fileSizeLimit: opts.fileSizeLimit, //验证文件总大小是否超出限制, 超出则不允许加入队列。
		fileSingleSizeLimit: opts.fileSingleSizeLimit, //验证单个文件大小是否超出限制, 超出则不允许加入队列。
		disableGlobalDnd : true, //禁掉整个页面的拖拽功能,避免圖片拖進來被打開
		dnd : undefined, //指定拖拽容器
		paste : undefined, //指定通過粘貼進來的容器,此功能为通过粘贴来添加截屏的图片
		auto : false,
		prepareNextFile : true,
		threads : 1, //上傳並發數
		fileVal : 'file',
		duplicate : true, //去重複
	});
	uploader.list = [];
	//向服務器提交文件
	$(opts.submitBtn).on('click.uploader', function() {
		if(opts.submitBtnClick) opts.submitBtnClick.call(uploader,this);
	});
	//插入圖片，辦定取消事件
	uploader.insertHtml = function(file,fileURL){
		var self = this;
		this.list.push({
			id : file.id,
			isComplete : false
		});
		if(opts.showImg){
			opts.showImg.call(this,fileURL,file);
		}
		this.closeUploadImg(file.id,this); //辦定事件
	}
	//給插入的圖片辦定取消事件
	uploader.closeUploadImg = function(fileId,self){
		$('#'+fileId+' '+opts.cancelBtn).on('click.cancel',function(){
			self.removeFile(fileId,true);
			deleteArrObj(self.list,'id',fileId);
			if(opts.cancelImg) opts.cancelImg.call(self,$(this),self.list);
		});
	}
	//文件插入隊列之前
	uploader.on('beforeFileQueued', function(file){
		if(opts.beforeFileQueued) opts.beforeFileQueued.call(this,file);
	});
	//文件插入隊列之後觸發
	uploader.on('fileQueued', function(file) {
		var self = this;
		uploader.makeThumb(file, function(error, ret) {
			if(!error){
				self.insertHtml(file, ret);
			}else{
				specialTips('添加'+file.name+'失敗');
				self.removeFile(file.id,true);
			}
		});
	});
	//当一批文件添加进队列以后触发。
	uploader.on('filesQueued', function(files) {
		if(opts.filesQueued) opts.filesQueued.call(this,files);
	});
	//當文件移除隊列
	uploader.on('fileDequeued', function(file) {
		if(opts.fileDequeued) opts.fileDequeued.call(this,file);
	});
	//当 uploader 被重置的时候触发。
	uploader.on('reset', function() {
		if(opts.reset) opts.reset.call(this);
	});
	//当开始上传流程时触发。
	uploader.on('startUpload', function() {
		if(opts.startUpload) opts.startUpload.call(this);
	});
	//当开始上传流程暂停时触发。
	uploader.on('stop', function() {
		if(opts.stop) opts.stop.call(this);
	});
	//所有文件上傳結束觸發
	uploader.on('uploadFinished', function() {
		if(opts.uploadFinished) opts.uploadFinished.call(this);
	});
	//某个文件开始上传前触发，一个文件只会触发一次。
	uploader.on('uploadStart', function(file) {
		if(opts.uploadStart) opts.uploadStart.call(this,file);
	});
	//傳送之前
	uploader.on('uploadBeforeSend', function(obj,data,header){
		if(opts.uploadBeforeSend) opts.uploadBeforeSend.call(this,obj,data,header);
	});
	//当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效。如果此事件handler返回值为false, 则此文件将派送server类型的uploadError事件。
	uploader.on('uploadAccept', function(object, ret){
		if(opts.uploadAccept) opts.uploadAccept.call(this,object,ret);
	});
	//進度條
	uploader.on('uploadProgress', function(file, percentage) {
		if(opts.uploadProgress) opts.uploadProgress.call(this,file,percentage);
	});
	//当文件上传出错时触发。
	uploader.on('uploadError', function(file, reason) {
		if(opts.uploadError) opts.uploadError.call(this,file,reason);
	});
	//当文件上传成功时触发。
	uploader.on('uploadSuccess', function(file, response) {
		console.log(file);
		console.log(response);
		if(opts.uploadSuccess) opts.uploadSuccess.call(this,file,response);
	});
	//不管成功或者失败，文件上传完成时触发。
	uploader.on('uploadComplete', function(file) {
		if(opts.uploadComplete) opts.uploadComplete.call(this,file);
	});
	uploader.on('error', function(type) {
		if(opts.error) opts.error.call(this,type);
		if(type == 'Q_EXCEED_NUM_LIMIT'){ 
			if(opts.fileNumLimitEvent) opts.fileNumLimitEvent.call(this); //數量超過限制
		}else if(type == 'F_EXCEED_SIZE'){ 
			if(opts.fileSizeLimitEvent) opts.fileSizeLimitEvent.call(this); //總大小超過限制
		}else if(type == 'Q_TYPE_DENIED'){
			if(opts.fileTypeDeniedEvent) opts.fileTypeDeniedEvent.call(this);//文件類型不滿足
		} 
	});
}

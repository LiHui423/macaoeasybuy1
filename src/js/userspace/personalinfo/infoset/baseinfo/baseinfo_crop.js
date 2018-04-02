window.onload = function(){
	headImgUpload();
	coverImgUpload();
}
function headImgUpload(){
	var box = $('#change-head-img');
	var uploadList = [];
	var uploader = new WebUploader.Uploader({
		pick: {
			id: '#change-head-upload',
			multiple: false
		},

		
		server: 'http://shopping1.macaoeasybuy.com/ceshi/ceshiupload.easy',
		swf: 'http://localhost:8080/js/common/Uploader.swf',
		fileNumLimit: 2,
		fileSingleSizeLimit: 4 * 1024 * 1024,
		fileSizeLimit: 2 * 4 * 1024 * 1024,
		accept: {
			title: 'Images',
			extensions: 'jpg,jpeg,png,gif,apng',
			mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/apng'
		},
		method: 'post',
		compress: false,
		thumb: {
			width: 1000,
			height: 1000,
			quality: 100,
			allowMagnify: true,
			crop: false,
		},
		threads: 1,
		prepareNextFile: true,
		duplicate: false,
		auto: false,
		disableGlobalDnd: true,
	});
	uploader.on('fileQueued', function(file) {
		uploader.makeThumb(file, function(error, ret) {
			if(error) {
				console.log('文件加入隊列失敗');
			} else {
				console.log(file.name + '加入隊列');
				insertHTML(ret);
				uploadList.push(file.id);
				setTimeout(function(){
					headImgCrop();
				},10);
			}
		});
	});
	uploader.on('beforeFileQueued',function(file){
		if(uploadList.length>0){
			uploader.removeFile(uploadList[0],true);
			uploadList.splice(0,uploadList.length);
		}
	});
	uploader.on('fileDequeued',function(file){
		console.log(file.name + '被移除隊列' + file.id);
	});
	function insertHTML(ret){
		var newImg = '<img id="crop-head-img" src="'+ret+'">';
		var previewImg = '<img id="preview-head-img" src="'+ret+'">';
		box.find('.head-img-show').html(newImg);
		box.find('.upload-page .head-img').html(previewImg);
		newImg = null;
		previewImg = null;
	}
	//頭像裁剪
	function headImgCrop(){
		var box = $('#change-head-img');
		var boxWidth = $('#change-head-img .box-content .head-img-show').width();
		var boxHeight = $('#change-head-img .box-content .head-img-show').height();
		var myWidth = 110; // 選框寬
		var myHeight = myWidth; //選框高
		var api = $.Jcrop('#crop-head-img',{
			allowSelect:true,
			allowMove: true,
			bgColor:'#444',
			maxSize:[boxHeight,boxHeight], //选框最大尺寸
			minSize:[myWidth,myHeight], //选框最小尺寸
			aspectRatio:myWidth/myHeight, //选框宽高比。说明：width/height
			onChange:function(){
				showPreview(
					this,
					$('#preview-head-img'),
					myWidth,
					myHeight
				);
			},
			onSelect:function(){
				showPreview(
					this,
					$('#preview-head-img'),
					myWidth,
					myHeight
				);
			},
			onRelease:function(){
				restoreSelecter(this,boxWidth,boxHeight,myWidth,myHeight);
			}
		});
		restoreSelecter(api,boxWidth,boxHeight,myWidth,myHeight);
		moveSlect(api,boxWidth,boxHeight,myWidth,myHeight);
	}

}
function coverImgUpload(){
	var box = $('#change-cover-img');
	var uploadList = [];
	var uploader = new WebUploader.Uploader({
		pick: {
			id: '#change-cover-upload',
			multiple: false
		},
		server: 'http://shopping1.macaoeasybuy.com/ceshi/ceshiupload.easy',
		swf: 'http://localhost:8080/js/common/Uploader.swf',
		fileNumLimit: 2,
		fileSingleSizeLimit: 4 * 1024 * 1024,
		fileSizeLimit: 2 * 4 * 1024 * 1024,
		accept: {
			title: 'Images',
			extensions: 'jpg,jpeg,png,gif,apng',
			mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/apng'
		},
		method: 'post',
		compress: false,
		thumb: {
			width: 1000,
			height: 1000,
			quality: 100,
			allowMagnify: true,
			crop: false,
		},
		threads: 1,
		prepareNextFile: true,
		duplicate: false,
		auto: false,
		disableGlobalDnd: true,
	});
	uploader.on('fileQueued', function(file) {
		uploader.makeThumb(file, function(error, ret) {
			if(error) {
				console.log('文件加入隊列失敗');
			} else {
				console.log(file.name + '加入隊列');
				insertHTML(ret);
				uploadList.push(file.id);
				setTimeout(function(){
					coverImgCrop();
				},10);
			}
		});
	});
	uploader.on('beforeFileQueued',function(file){
		if(uploadList.length>0){
			uploader.removeFile(uploadList[0],true);
			uploadList.splice(0,uploadList.length);
		}
	});
	uploader.on('fileDequeued',function(file){
		console.log(file.name + '被移除隊列' + file.id);
	});
	function insertHTML(ret){
		var newImg = '<img id="crop-cover-img" src="'+ret+'">';
		var previewImg = '<img id="preview-cover-img" src="'+ret+'">';
		var scaleImg = '<img id="preview-cover-img-scale" src="'+ret+'">';
		box.find('.upload-cover-show').html(newImg);
		box.find('.show-cover-box-pre').html(previewImg);
		box.find('#preview-cover-img-scale').remove();
		box.find('.show-cover-box-bgpre').append(scaleImg);
		newImg = null;
		previewImg = null;
		scaleImg = null;
	}
	function coverImgCrop(){
		var box = $('#change-cover-img');
		var boxWidth = box.find('.upload-cover-show').width();
		var boxHeight = box.find('.upload-cover-show').height();

		var myWidth = 270; // 選框寬
		var myHeight = (myWidth*boxHeight) / boxWidth; //選框高

		var api = $.Jcrop('#crop-cover-img',{
			allowSelect:true,
			allowMove:true,
			bgColor:'#444',
			maxSize:[boxWidth,boxHeight], //选框最大尺寸
			minSize:[myWidth,myHeight], //选框最小尺寸
			aspectRatio:myWidth/myHeight, //选框宽高比。说明：width/height
			onChange:function(){
				showPreview(
					this,
					$('#preview-cover-img'),
					myWidth,
					myHeight
				);
				showPreview(
					this,
					$('#preview-cover-img-scale'),
					myWidth,
					myHeight
				);
			},
			onSelect:function(){
				showPreview(
					this,
					$('#preview-cover-img'),
					myWidth,
					myHeight
				);
				showPreview(
					this,
					$('#preview-cover-img-scale'),
					myWidth,
					myHeight
				);
			},
			onRelease:function(){
				restoreSelecter(this,boxWidth,boxHeight,myWidth,myHeight);
			}
		});
		restoreSelecter(api,boxWidth,boxHeight,myWidth,myHeight);
		moveSlect(api,boxWidth,boxHeight,myWidth,myHeight);
	}
}
// 初始化選框
function restoreSelecter(self,boxWidth,boxHeight,myWidth,myHeight){
	var a = (boxWidth/2) - (myWidth/2);
	var b = (boxHeight/2) - (myHeight/2);
	self.setSelect([a,b,a+myWidth,b+myHeight]);
	a = null;
	b = null;
}
// 預覽圖
function showPreview(self,obj,myWidth,myHeight){
	var coords = self.tellSelect();
	var rx = myWidth / coords.w;
	var ry = myHeight / coords.h;
	obj.css({
		width: Math.round(rx * self.getBounds()[0]) + 'px',
		height: Math.round(ry * self.getBounds()[1]) + 'px',
		marginLeft: '-' + Math.round(rx * coords.x) + 'px',
		marginTop: '-' + Math.round(ry * coords.y) + 'px'
	});
	rx = null;
	ry = null;
}
// 拖動圖片
function moveSlect(self,boxWidth,boxHeight,myWidth,myHeight){
	var api = self;
	var bBox = api.ui.holder;
	var isCanMove = false;
	var starX;
	var starY;
	var moveX;
	var moveY;
	var endX;
	var endY;
	var boxLeft;
	var boxTop;
	var imgW;
	var imgH;
	var page = bBox.find('.jcrop-tracker').eq(1);
	page.on('mousedown',function(event){
		isCanMove = true;
		starX = event.offsetX;
		starY = event.offsetY;
		myWidth = api.tellSelect().w;
		myHeight = api.tellSelect().h;
		imgW = api.getBounds()[0];
		imgH = api.getBounds()[1];
	})
	page.on('mousemove',function(event){
		if(isCanMove){
			boxLeft = bBox.css('left').split('px').join('') - 0;
			boxTop = bBox.css('top').split('px').join('') - 0;
			if(!boxLeft) boxLeft = 0;
			if(!boxTop) boxTop = 0;
			var res = getMove(api,event,boxWidth,boxHeight,starX,starY,boxLeft,boxTop,imgW,imgH);
			bBox.css({
				'left' : boxLeft + res.moveX,
				'top' : boxTop + res.moveY
			});

			if(bBox.css('top').split('px').join('') - 0 >= 0){
				bBox.css({
					'left' : boxLeft + res.moveX,
					'top' : 0
				});
				apiPosition('no');
			}else if(bBox.css('top').split('px').join('') - 0 <= -1 * (imgH-boxHeight)){
				bBox.css({
					'left' : boxLeft + res.moveX,
					'top' : -1 * (imgH-boxHeight)
				});
				apiPosition('no');
			}else{
				apiPosition('yes');
			}
			res = null;
			function apiPosition(state){
				if(state == 'no'){
					api.setSelect([
						api.tellSelect().x,
						api.tellSelect().y,
						api.tellSelect().x + myWidth,
						api.tellSelect().y + myHeight
					]);
				}else{
					api.setSelect([
						api.tellSelect().x - res.moveX,
						api.tellSelect().y - res.moveY,
						api.tellSelect().x - res.moveX + myWidth,
						api.tellSelect().y - res.moveY + myHeight
					]);
				}
			}
		}
	});
	page.on('mouseup',function(event){
		isCanMove = false;
		leaveRestore();
	})
	page.on('mouseenter',function(event){
		isCanMove = false;
		leaveRestore();
	});
	page.on('mouseleave',function(event){
		isCanMove = false;
		leaveRestore();
	});
	function getMove(api,event,boxWidth,boxHeight,starX,starY,boxLeft,boxTop,imgW,imgH){
		var myJson;
		if(imgW <= boxWidth && imgH > boxHeight){
			moveX = 0;
			moveY = event.offsetY - starY;
		}else if(imgW > boxWidth && imgH <= boxHeight){
			moveX = event.offsetX - starX;
			moveY = 0;
		}else if(imgW <= boxWidth && imgH <= boxHeight){
			moveX = 0;
			moveY = 0;
		}else if(imgW > boxWidth && imgH > boxHeight){
			moveX = event.offsetX - starX;
			moveY = event.offsetY - starY;
		}
		myJson = {moveX : moveX,moveY : moveY}
		imgW = null;
		imgH = null;
		return myJson;
	}
	function leaveRestore(){
		moveX = null;
		moveY = null;
		starX = null;
		starY = null;
		boxLeft = null;
		boxTop = null;
		myWidth = null;
		myHeight = null;
		imgW = null;
		imgH = null;
	}
}

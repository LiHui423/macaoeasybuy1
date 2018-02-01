$(function() {
	photoDelete();
	mathValueLength($('.editor-bottom .album-info .album-title .album-title-input'), $('.editor-bottom .album-info .album-title p span:first-of-type'), 10);
	classSelect();
	Mock.mock(
		'http://mockjs', {
			'a': '@name'
		}
	);
});

function classSelect() {
	var btn = $('#selecter');
	var selecter = $('.editor-bottom .album-info .album-classification .classification-top ul');
	var shadow = $('.editor-bottom .album-info .album-classification .classification-top .select-shadow');
	btn.on('click', function() {
		styleChange();
	});
	shadow.on('click', function() {
		styleChange();
	})
	selecter.find('li').on('click', function() {
		var a = $(this).text();
		btn.find('span').html(a);
		a = null;
		styleChange();
	});
	function styleChange() {
		selecter.fadeToggle(150);
		shadow.fadeToggle(1);
		if(btn.css('border-color') == 'rgba(0, 0, 0, 0)') {
			btn.css('border-color', '#ccc');
		} else {
			btn.css('border-color', 'transparent');
		}
	}
}
//批量刪除
function photoDelete() {
	var arr = []; //選擇刪除舊的數組
	var deleteUploadList = []; //選擇刪除需要上傳圖片的數組
	var upLoadList = []; //最後得出來的數組
	var fileCount = 0; //上傳文件的數目

	var nowNum = 2; //目前有的數量
	var maxNum = 6; //最多能修改的數量
	var canUploadNum = maxNum - nowNum; //能上傳的文件的數量
	$('#nowNum').html(nowNum);
	$('#maxNum').html(maxNum);

	bindEvent(arr, deleteUploadList, upLoadList); //給每個元素辦定事件

	//初始化上傳插件webUploader
	var uploader = new WebUploader.Uploader({
		pick: {
			id: '#upload-btn',
			multiple: true
		},
		server: 'http://shopping1.macaoeasybuy.com/ceshi/ceshiupload.easy',
		swf: 'http://localhost:8080/js/common/Uploader.swf',
		fileNumLimit: maxNum,
		fileSingleSizeLimit: 4 * 1024 * 1024,
		fileSizeLimit: maxNum * 4 * 1024 * 1024,
		accept: {
			title: 'Images',
			extensions: 'jpg,jpeg,png,gif,apng',
			mimeTypes: 'image/jpg,image/jpeg,image/png,image/gif,image/apng'
		},
		method: 'post',
		compress: false,
		thumb: {
			width: 200,
			height: 200,
			quality: 100,
			allowMagnify: true,
			crop: false,
			type: 'image/jpeg'
		},
		threads: 1,
		prepareNextFile: true,
		duplicate: false,
		auto: false,
		disableGlobalDnd: true,
	});
	//每添加一個文件觸發事件
	uploader.on('fileQueued', function(file) {
		uploader.makeThumb(file, function(error, ret) {
			if(error) {
				console.log('文件加入隊列失敗');
			} else {
				console.log(file.name + '加入隊列');
				insertHtml(file, ret);
			}
		});
	});
	//插入html
	function insertHtml(file, url) {
		nowNum++;
		canUploadNum--;
		if(canUploadNum < 0 && nowNum > maxNum) {
			uploader.removeFile(file.id, true);
			canUploadNum = 0;
			nowNum = maxNum;
			return false;
		}
		if(canUploadNum == 0 && nowNum == maxNum){
			$('.editor-upload .upload-box').css('display','none');
		}
		console.log(canUploadNum,nowNum,maxNum);

		fileCount++; //需要上傳文件的數量

		//把需要上傳文件的id存到數組中，fileCount其實是等於upLoadList.length的
		upLoadList.push(file.id);

		//顯示需要上傳圖片的數量
		$('#nowNum').html(nowNum);

		//把新添加的文件，轉化成DOM節點，添加到document中
		var html = '<li class="clearfloat" data-id="' + file.id + '"><div class="editor-items-img"><img src="' + url + '"><div class="hover-check-box"></div></div><div class="editor-items-value scrollIe scrollOther" contenteditable="true" placeholder="為此圖片添加描述吧！"></div></li>';
		$('.editor-lister').prepend(html);

		bindEvent(arr, deleteUploadList, upLoadList); //給每個元素辦定事件
	}
	//給每個元素辦定事件
	function bindEvent(arr, deleteUploadList, upLoadList) {
		editorEvent(); //編輯框辦定輸入監聽事件
		$('.editor-lister li .editor-items-img').off('click');
		$('.editor-lister li .editor-items-img').on('click', function() {
			//選擇或者取消進行數組操作，操作的數組有arr,deleteUploadList
			if($(this).parent().hasClass('select')) {
				//取消
				var myParent = $(this).parent();
				myParent.removeClass('select');
				if(myParent.attr('data-id')) {
					shiftArr(deleteUploadList, myParent.data('id'));
				} else {
					shiftArr(arr, myParent.attr('id'));
				}
			} else {
				//選上
				var myParent = $(this).parent();
				myParent.addClass('select');
				if(myParent.attr('data-id')) {
					pushArr(deleteUploadList, myParent.data('id'));
				} else {
					pushArr(arr, myParent.attr('id'));
				}
			}
			//把選擇的需要刪除的圖片數量顯示出來
			$('#remove-btn span').html(arr.concat(deleteUploadList).length);
			//判斷條件 如果選的為零 則不刪除
			if(arr.concat(deleteUploadList).length == 0){
				btnStyleChange('restore'); //樣式變動
				return false;
			} else {
				btnStyleChange('change'); //樣式變動
				//刪除提示編輯樣式
				$('#remove-btn').on('click', function() {
					$('#delete-post').css('display', 'block');
				});
				$('#delete-post .cancel-sure').on('click', function() {
					$('#delete-post').css('display', 'none');
				});
				//確認刪除
				$('#delete-post .sure-cancel').on('click', function() {
					//刪除新圖的上傳隊列
					if(deleteUploadList.length > 0) {
						for(var i = 0; i < deleteUploadList.length; i++) {
							uploader.removeFile(deleteUploadList[i], true);
							shiftArr(upLoadList, deleteUploadList[i]);
							fileCount--;
							$('.editor-upload .editor-lister li[data-id=' + deleteUploadList[i] + ']').remove();

							//改變顯示 能上傳的圖片數量多了
							canUploadNum++;
							nowNum--;
							$('#nowNum').html(nowNum);
						}
						deleteUploadList.splice(0, deleteUploadList.length);
					}

					//刪除舊圖上傳隊列，并發出刪除請求
					if(arr.length > 0) {
						for(var j = 0; j < arr.length; j++) {
							$('.editor-upload .editor-lister li[id=' + arr[j] + ']').remove();

							//改變顯示 能上傳的圖片數量多了
							canUploadNum++;
							nowNum--;
							$('#nowNum').html(nowNum);
						}
						arr.splice(0, arr.length);
					}

					$('.editor-upload .upload-box').css('display','block'); //顯示點擊上傳按鈕
					//恢復刪除之前狀態
					btnStyleChange('restore');
					$('#remove-btn span').html(arr.concat(deleteUploadList).length);
					$('#delete-post').css('display', 'none');
				});
			}
		});
	}

	$('#save-btn').on('click', function() {
		if(upLoadList.length == 0) {
			return false;
		} else {
			console.log(upLoadList);
//			var files = uploader.getFiles();
//			console.log(files);
//			uploader.upload();
//			for(var i=0;i<upLoadList.length;i++){
//				這裡上傳新加的圖片
//			}
		}
	});

	//樣式的變動函數
	function btnStyleChange(state) {
		if(state == 'restore') {
			$('#remove-btn').css({
				'color': '#aaa',
				'cursor': 'default',
				'background-color': '#fff',
				'border-color': '#aaa'
			});
			$('#remove-btn').find('img').attr('src', '/img/userspace/common/deletebtn.png');
		} else {
			$('#remove-btn').css({
				'color': '#fff',
				'cursor': 'pointer',
				'background-color': '#e98900',
				'border-color': '#e98900'
			});
			$('#remove-btn').find('img').attr('src', '/img/userspace/common/deletebtn-s.png');
		}
		$('#remove-btn').off('click');
		$('#delete-post .cancel-sure').off('click');
		$('#delete-post .sure-cancel').off('click');
	}
	//編輯框事件
	function editorEvent() {
		$('.editor-items-value').off('focus blur');
		$('.editor-items-value').on('focus', function() {
			$(this).attr('placeholder', '');
		});
		$('.editor-items-value').on('blur', function() {
			if($(this).text() == '') {
				$(this).attr('placeholder', '為此圖片添加描述吧！');
			} else {
				$(this).attr('placeholder', '');
			}
		});
	}

	function shiftArr(arr, id) {
		if(id == undefined) return;
		deleteArr(arr, id);
	}

	function pushArr(arr, id) {
		if(id == undefined) return;
		arr.push(id);
	}
	uploader.on('fileDequeued', function(file) {
		console.log(file.id + '被移除隊列', file.name);
	});
	uploader.on('uploadStart', function(file) {
		console.log(file.id + '開始上傳', file.name);
	});
	uploader.on('uploadFinished', function() {
		console.log('所有文件上傳結束');
	});
	// 文件上传失败，显示上传出错。
	uploader.on('uploadError', function(file, reason) {
		console.log(reason);
	});
	uploader.on('uploadBeforeSend', function(obj, data, headers) {
		//console.log(data);
	});
}

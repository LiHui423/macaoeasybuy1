$(function() {
	showInputNum(); //監聽標題框的長度並且輸出
	chooseType(); //選擇文章類型
	chooseAlbum(); //懸著專輯按鈕
	// imgUpLoad();// 上傳插件--旧的
	// newUpload();//調用新的插件
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
}
//創建存儲內容對象
var chooseOtherAlbum = {
	title: '',
	id: -1
}
//點擊按鈕先去檢查內容
function checkPost() {
	var obj = {
		account : myuuid,
		titleName: chooseOtherAlbum.title, //獲取標題名字
		typeName: getDiaryClass().className, //獲取文章的類別
		classId: getDiaryClass().id, //類別Id
		albumId : chooseOtherAlbum.id
	};
	if(obj.titleName == '') {
		specialTips('標題不能為空');
		return false;
	}
	if(obj.typeName == '' || obj.typeName == undefined) {
		specialTips('請選擇您要發佈的專輯類別');
		return false;
	}
	return obj;
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
	var ipUrl = 'http://userspace1.macaoeasybuy.com';
	var dataUrl = ipUrl + '/UserPublishController/addAlbum.easy';
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
//錯誤重新辦定
function errorFunc() {
	$.each(uploader.list, function(k, y) {
		y.isComplete = false;
	});
	$('#replyBox_sendMess').on('click.uploader', function() {
		btnOnSubmitFunc(window.uploader, $(this)[0]);
	});
}
//返回的callback
function formCallbackData(data) {
	if(data.postId == '-1') {
		specialTips('發佈失敗，請檢查發佈內容！');
		errorFunc();
	} else {
		if(chooseOtherAlbum.id == -1){
			$('#comment-success-tips-empty .point-number').html(data.point);
			$('#comment-success-tips-empty').fadeIn(500).delay(1500).fadeOut(500);
		}else{
			$('#comment-success-tips-insert').fadeIn(500).delay(1500).fadeOut(500);
		}
	}
	console.log(data);
	$('#myIframeId,#myFormId').remove();
}
//選擇專輯
function chooseAlbum() {
	var box = $('.publishBox_articleTitleLeft'); //盒子
	var btn = $('.cleapublishBox_articleTitleLeft_slideIcon'); //按鈕（小箭頭）
	var slideBox = $('.publishBox_articleTitleLeft_slide'); //滑出的盒子
	var innerBox = $('.publishBox_articleTitleLeft_slide_inner'); //裡面的盒子
	var flag = true; //是否需要請求
	//點擊按鈕事件
	btn.on('click', function() {
		if(flag) {
			requestOtherAlbum();
		} else {
			showTo();
		}
		flag = false;
	});
	//點擊其他地方收回盒子
	easyBuy.global.dep.maskClick($('.publishBox_articleTitleLeft'), function() {
		hideTo();
	});
	//請求專輯回來
	function requestOtherAlbum() {
		var page = 0;
		var size = 8;
		var isComplete = false;
		requestFunc();
		//請求方法
		function requestFunc() {
			var dataUrl = 'http://userspace1.macaoeasybuy.com/UserPublishController/selectUserAlbum.easy?userId=' + userId + '&size=' + size + '&page=' + page + '&easybuyCallback=?';
			$.ajax({
				url: dataUrl,
				type: "get",
				async: true,
				dataType: 'jsonp',
				beforeSend: function() {
					otherAlbumScroll('off');
					if(isComplete) return false;
				},
				success: function(data) {
					data.page = page;
					$.each(data.albumClass, function(k, y) {
						y.picCount = y.picCount;
					});
					var html = template('other-album-template', data);
					$('#other_album_box').append(html);
					//其他專輯辦定事件
					$.each(data.albumClass, function(k, y) {
						$('#' + y.id + '_other_album').on('click', function() {
							chooseOtherAlbum.title = y.albumName;
							chooseOtherAlbum.id = y.id;
							$(this).siblings('.other_album_item').removeClass('select').end().addClass('select');
							$('#diaryTitle').val(y.albumName);
							$('#diaryTitle-num').html(y.albumName.length);

							//點擊去顯示分類
							$('#' + y.classId + '_album_classId').siblings('li').removeClass('publish_slide_curr').end().addClass('publish_slide_curr');
							$('.publishBox_articleTitleRight span:nth-of-type(1)').text(y.className);
							$('#diary_class').data('data', {
								className: y.className,
								id: y.classId,
								pic: y.classPic
							});

						});
					});
					page += 1;
					if(data.albumClass.length == size) {
						otherAlbumScroll('on');
					} else {
						isComplete = true;
						otherAlbumScroll('off');
					}
					if(page == 1) {
						showTo();
						$('#new_album').on('click', function() {
							chooseOtherAlbum.title = getTitleName($('#diaryTitle'), 24);
							chooseOtherAlbum.id = -1;
							$(this).siblings('.other_album_item').removeClass('select').end().addClass('select');
						});
					}
				}
			});
		}
		//辦定滾動事件
		function otherAlbumScroll(state) {
			if(state == 'on') {
				var scrollHeight = $(slideBox).height();
				var scrollTop;
				var windowHeight;
				slideBox.on('scroll', function() {
					scrollTop = $(slideBox).scrollTop();
					windowHeight = $(innerBox).outerHeight(true);
					if(scrollTop + scrollHeight >= windowHeight * 0.6) {
						requestFunc();
					}
				})
			} else {
				slideBox.off('scroll');
			}
		}
	}
	//出現
	function showTo() {
		box.addClass('select');
		slideBox.slideDown('fast');
	}
	//隱藏
	function hideTo() {
		slideBox.slideUp('fast', function() {
			box.removeClass('select');
		});
	}

}
//監聽標題框的長度並且輸出
function showInputNum() {
	$('#diaryTitle').on('keyup', function() {
		$('#diaryTitle-num').html($(this).val().length);
		chooseOtherAlbum.title = getTitleName($('#diaryTitle'), 24);
		chooseOtherAlbum.id = -1;
		$('#new_album').siblings('.other_album_item').removeClass('select').end().addClass('select');
	});
}
/*選擇文章類型*/
function chooseType() {
	var flag = false;
	$('.publishBox_articleTitleRight').on('click', function() {
		if(flag) {
			if($(this).hasClass('publishBox_articleTitleRight_slideDown')) {
				$(this).removeClass('publishBox_articleTitleRight_slideDown');
				$('.publishBox_articleTitleRight_slide').slideUp('fast');
				$('.transparent_bg').hide()
			} else {
				$(this).addClass('publishBox_articleTitleRight_slideDown');
				$('.publishBox_articleTitleRight_slide').slideDown('fast');
				$('.transparent_bg').show()
			}
		} else {
			requestDiaryFunc();
		}
	})
	$('.transparent_bg').on('click', function() {
		$(this).hide();
		$('.publishBox_articleTitleRight').removeClass('publishBox_articleTitleRight_slideDown');
		$('.publishBox_articleTitleRight_slide').slideUp('fast');
	});

	function requestDiaryFunc() {
		flag = true;
		var ipUrl = 'http://userspace1.macaoeasybuy.com';
		//		var dataUrl = 'http://userspace.macaoeasybuy.com/UserPublishController/selectLifeCycleClass.easy?easybuyCallback=?';
		var dataUrl = ipUrl + '/UserPublishController/selectAlbumClass.easy?easybuyCallback=?';
		$.getJSON(dataUrl, function(data) {
			if(!data) return false;
			//添加節點
			var html = '';
			$.each(data.albumClass, function(k, y) {
				html += '<li id="' + y.id + '_album_classId">' + y.className + '</li>';
			});
			$('#diary_class ul').append(html);

			//如果之前選過專輯了，那麼這裡就應該是之前選過的數據
			var oldData = $('#diary_class').data('data');
			if(oldData != undefined) {
				$('#' + oldData.id + '_album_classId').siblings('li').removeClass('publish_slide_curr').end().addClass('publish_slide_curr');
			}

			//辦定數據
			$.each(data.albumClass, function(k, y) {
				$('#' + y.id + '_album_classId').data('data', y);
			});
			//辦定事件
			diaryClassBindClick();
			//顯示列表
			$('.publishBox_articleTitleRight').addClass('publishBox_articleTitleRight_slideDown');
			$('.publishBox_articleTitleRight_slide').slideDown('fast');
			$('.transparent_bg').show();
		});
	}

	function diaryClassBindClick() {
		$('.publishBox_articleTitleRight_slide ul li').on('click', function() {
			$('#diary_class').data('data', $(this).data('data'));
			$(this).addClass('publish_slide_curr').siblings().removeClass('publish_slide_curr');
			$('.publishBox_articleTitleRight span:nth-of-type(1)').text($(this).text());
		});
	}
}
//獲取文章類別
function getDiaryClass() {
	var str = {};
	if($('#diary_class').data('data') != undefined) {
		str = $('#diary_class').data('data');
	}
	return str;
}
//獲取標題
function getTitleName(input, max) {
	var val = input.val().substring(0, max);
	return val;
}
//提示
function specialTips(str, fn) {
	if($('#special-tips').length != 0) return false;
	var div = '<div class="fullAlertBox" id="special-tips">' + str + '</div>';
	$('body').append(div);
	$('#special-tips').css({
		'position': 'fixed',
		'z-index': '888',
		'top': '50%',
		'left': '50%',
		'-webkit-transform': 'translate(-50%,-50%)',
		'-ms-transform': 'translate(-50%,-50%)',
		'-o-transform': 'translate(-50%,-50%)',
		'-moz-transform': 'translate(-50%,-50%)',
		'transform': 'translate(-50%,-50%)'
	});
	$('#special-tips').fadeIn(500).delay(1000).fadeOut(500, function() {
		$(this).remove();
		if(fn) fn();
	});
}

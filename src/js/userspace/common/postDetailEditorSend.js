/*
 		評論回復發送信息，獲取返回數據
 * */
var formatNum = easyBuy.global.dep.formatNum;
var deleteArr = easyBuy.global.dep.deleteArr;

//選擇、顯示選項卡
function addSelect() {
	//點擊顯示彈框控制器
	$('#editor-box .replyBox_add .replyBox_addUl>li>img').each(function(k) {
		$(this)[0].flag = true; //true是沒有請求過，false是請求過了
		$(this).on('click', function() {
			$('#editor-box .replyBox_add .replyBox_addUl>li .contains').css('display', 'none');
			$('#editor-box .replyBox_add .replyBox_addUl .shadow-box').css('display', 'block');
			$(this).siblings('.contains').fadeIn();
			if($(this)[0].flag) {
				switch(k) {
					case 0:
						//請求表情
						emoji();
						break;
					case 1:
						//請求好友
						at();
						break;
					case 2:
						//請求標籤
						label();
						break;
				}
			}
			$(this)[0].flag = false;
		});
	});
	$('#editor-box .replyBox_add .replyBox_addUl .shadow-box').on('click', function() {
		$('#editor-box .replyBox_add .replyBox_addUl>li .contains').css('display', 'none');
		$(this).css('display', 'none');
	});
}
function editorFunc(callBackAfterSend) {
	addSelect(); //點擊彈框事件
	//實例編輯器
	window.editor = new YezEditor('#editor');
	editor.editorHolder('我想對你說...');
	$('#replyBox_sendMess')[0].bigEmojiArr = [];
	$('#replyBox_sendMess').on('click.send', sendClick);

	function sendClick() {
		//點擊調用的函數
		if($('.replyUserTips1314').length >= 1) {
			var replyId = $('.replyUserTips1314')[0].id;
			var replyUserId = $('.replyUserTips1314')[0].userId;
		} else {
			var replyId = 0; //帖子類型
			var replyUserId = 0;
		}
		var resData = editor.getYezContent();
		var res = resData.newres;
		var atPos = resData.atPos;
		var labelPos = resData.labelPos;
		var bigexpression = '';
		for(var i = 0; i < $(this)[0].bigEmojiArr.length; i++) {
			bigexpression += '|' + $(this)[0].bigEmojiArr[i];
		}
		if(res.length == 0) {
			$('#comment-success-tips-empty').fadeIn(500).delay(1000).fadeOut(500);
		} else {
			sendMsg(res, bigexpression, replyId, replyUserId, atPos, labelPos);
		}
	}

	function sendMsg(str, bigexpression, replyId, replyUserId, atPos, labelPos) {
		var str = encodeURIComponent(str);
		var type = easyBuy.userSpaceGlobal.replyPostType;
		var topicType = easyBuy.userSpaceGlobal.replyVolunteersType;
		var replyId = replyId; //回復的id
		var bigexpression = bigexpression; //大錶情
		var sendUrl = 'http://userspace1.macaoeasybuy.com/topicReplyController/addReply.easy?id=' + postId + '&userId=' + userId + '&replyId=' + replyId + '&content=' + str + '&type=' + type + '&bigexpression=' + bigexpression + '&seeUserId=' + seeUserId + '&topicType=' + topicType + '&atPos=' + atPos + '&labelPos=' + labelPos + '&easybuyCallback=?';
		$.ajax({
			url: sendUrl,
			type: "get",
			async: true,
			dataType: 'jsonp',
			beforeSend: function(){
				$('#replyBox_sendMess').off('click.send');
				$('#replyBox_sendMess').css('cursor', 'wait');
			},
			success: function(data) {
				if(callBackAfterSend) callBackAfterSend();
				//清空內容跟大錶情
				editor.obj.html('');
				$('#replyBox_sendMess')[0].bigEmojiArr.splice(0, $('#replyBox_sendMess')[0].bigEmojiArr.length);
				$('#big-expression div').remove();
				$('#big-expression p').css('display', 'none');
				$('#big-expression p .now').html(0);
				$('#big-expression p .now')[0].bigExpNum = 0;
				$('.replyUserTips1314').remove();
				addComments(data); //評論成功，返回數據，添加進去頁面裡面
				$('#replyBox_sendMess').on('click.send', sendClick);
				$('#replyBox_sendMess').css('cursor', 'pointer');
				if($('.statistics .statistics-title li').eq(0)[0].isComplete) {
					if(easyBuy.social.isSocialPost){
						$('#response-list-inner').append('<div class="no-more">~沒有更多內容了哦~</div>');
					}else{
						if($('.statistics .statistics-page .person-messaage .no-more').length == 0){
							$('.statistics .statistics-page .person-messaage').append('<div class="no-more">~沒有更多內容了哦~</div>');
						}
					}
					$('.statistics .statistics-page .person-messaage .no-more').css('display', 'block');
				}
			},
			error: function() {
				//錯誤提示
				$('#replyBox_sendMess').on('click.send', sendClick);
				$('#comment-success-tips-error').fadeIn(500).delay(1000).fadeOut(500);
				$('#replyBox_sendMess').css('cursor', 'pointer');
			}
		});
	}

	function addComments(data) {
		//評論成功，返回數據，添加進去頁面裡面
		data.page = 1;
		var responseTemplate = easyBuy.global.template['response'];
		var html = template.render(responseTemplate, data.replyList);
		$('#response-list').prepend(html);
		if(data.replyList.integral != 0) {
			$('#comment-success-tips .praise>div').eq(1).css('display', 'block');
			$('#comment-success-tips .praise>div').eq(2).css('display', 'block');
			$('#comment-success-tips span').html('+' + data.replyList.integral);
			$('#comment-success-tips').fadeIn(500).delay(1000).fadeOut(500);
		} else {
			$('#comment-success-tips .praise>div').eq(1).css('display', 'none');
			$('#comment-success-tips .praise>div').eq(2).css('display', 'none');
			$('#comment-success-tips').fadeIn(500).delay(1000).fadeOut(500);
		}
		$('#statistics-title li:first-of-type .statistics-bubble div:first-of-type')[0].dataNum += 1;
		$('#statistics-title li:first-of-type .statistics-bubble div:first-of-type').html(formatNum($('#statistics-title li:first-of-type .statistics-bubble div:first-of-type')[0].dataNum));
		$('#' + data.replyList.replyList[0].id + 'response').find('.person-info-contain .person-info-text').html(data.replyList.replyList[0].replycontent);
		$('#' + data.replyList.replyList[0].id + 'response .person-info-contain .person-info-text').find('a').each(function() {
			if(/at/.test($(this).attr('id'))) {
				$(this).addClass('at');
			} else {
				$(this).addClass('myLabel');
			}
		});
		if(data.replyList.replyList[0].reply) {
			$('#' + data.replyList.replyList[0].id + 'response').find('.person-info-record .person-info-text').html(data.replyList.replyList[0].reply.replycontent);
			$('#' + data.replyList.replyList[0].id + 'response .person-info-record .person-info-text').find('a').each(function() {
				if(/at/.test($(this).attr('id'))) {
					$(this).addClass('at');
				} else {
					$(this).addClass('myLabel');
				}
			});
		}
		if($('#' + data.replyList.replyList[0].id + 'response').find('.person-info-revert').length != 0) {
			$('#' + data.replyList.replyList[0].id + 'response').find('.person-info-revert')[0].data = {
				id: data.replyList.replyList[0].id,
				name: data.replyList.replyList[0].name,
				userId: data.replyList.replyList[0].userid
			}
		}
		$('#' + data.replyList.replyList[0].id + 'response').find('.person-info-revert').on('click', function() {
			editor.obj.html('');
			editor.obj.focus();
			editor.setRange();
			editor.obj.blur();
			editor.insertBlock('回復 ' + $(this)[0].data.name + '：', 'replyUserTips1314', '#f00');
			$('.replyUserTips1314')[0].id = $(this)[0].data.id;
			$('.replyUserTips1314')[0].userId = $(this)[0].data.userId;
		});
		$('#response-list .no-more-good').remove();
	}
}

/*
 	評論回復帖子詳情頁編輯框功能
 * */

function at() {
	var size = 21;
	var maxUserNum = 20;
	$('#metiondPop-select')[0].arr = [];
	$('#metiondPop-select')[0].nameArr = [];
	$('#metiondPop-select')[0].accountArr = [];
	// var atPersonTemplate = easyBuy.global.template['at-person-template'];
	var atPersonTemplate = 'at-person-template';
	//點擊確認添加返回結果
	$('#at-btn').on('click', function() {
		var idArr = $('#metiondPop-select')[0].arr;
		var nameArr = $('#metiondPop-select')[0].nameArr;
		var accountArr = $('#metiondPop-select')[0].accountArr;
		var flag = false;
		if(editor.getUserArr().length + idArr.length > maxUserNum) {
			var num = editor.getUserArr().length + idArr.length - maxUserNum; //多出來的數目
			for(var i = 0; i < num; i++) {
				idArr.pop();
				nameArr.pop();
				accountArr.pop();
			}
			flag = true;
		}
		for(var i = 0; i < nameArr.length; i++) {
			editor.insertBlock('@' + nameArr[i], idArr[i] + 'username', '#e98900');
			for(var j = 0; j < $('.' + idArr[i] + 'username').length; j++) {
				$('#editor-box .' + idArr[i] + 'username')[j].dataId = idArr[i];
				$('#editor-box .' + idArr[i] + 'username')[j].dataName = '@' + nameArr[i];
				$('#editor-box .' + idArr[i] + 'username')[j].myType = 'user';
				$('#editor-box .' + idArr[i] + 'username')[j].dataAccount = accountArr[i];
			}
		}
		$('#metiondPop .at-contains').fadeOut(150, function() {
			specialClear(); //清空
			if(flag) {
				specialTips('您所@的好友達到上限');
			}
		});
		$('#editor-box .replyBox_add .replyBox_addUl .shadow-box').css('display', 'none');
	});
	function specialClear() {
		clearSearch($('#metiondPop'), $('#other-user-box'));
		var myIdx = $('#metiondPop .classList ul li.select').index();
		$('#metiondPop .fansListBox ul').eq(myIdx).siblings('ul').removeClass('select').end().addClass('select');
		if(myIdx == 3) {
			myScroll($('#metiondPop .fansListBox ul').eq(2), 2);
		} else {
			myScroll($('#metiondPop .fansListBox ul').eq(myIdx), myIdx);
		}
		$('#metiondPop-select')[0].arr.splice(0, $('#metiondPop-select')[0].arr.length);
		$('#metiondPop-select')[0].nameArr.splice(0, $('#metiondPop-select')[0].nameArr.length);
		$('#metiondPop-select')[0].accountArr.splice(0, $('#metiondPop-select')[0].accountArr.length);
		$('#cheackedUl').find('li').remove();
		$('#fansNumber').html($('#metiondPop-select')[0].arr.length);
		$('#metiondPop .fansListBox li').removeClass('select');
		if(myIdx == 3) {
			myScroll($('#metiondPop .fansListBox ul').eq(2), 2);
		} else {
			myScroll($('#metiondPop .fansListBox ul').eq(myIdx), myIdx);
		}
	}
	//獲取總數量
	$.getJSON('http://userspace1.macaoeasybuy.com/atUserController/queryUserCount.easy?userId=' + userId + '&easybuyCallback=?', function(data) {
		for(var i in data.atUserCount) {
			$('#' + i).find('.num').html(formatNum(data.atUserCount[i]));
			$('#' + i)[0].page = 0;
			$('#' + i)[0].isComplete = false;
			$('#' + i).removeAttr('id');
		}
		getMyData(0, size, 0); //請求第一次
	});
	//綁定事件
	$('#metiondPop .classList li').each(function(k) {
		$(this).on('click', function() {
			if(k != 3) {
				if($(this)[0].page == 0 && $(this)[0].isComplete == false) {
					getMyData(0, size, k); //請求第一次
				}
			}
			//盒子的切換
			$('#metiondPop .fansListBox ul').eq(k).siblings('ul').removeClass('select').end().addClass('select');
			if(k == 3) {
				myScroll($('#metiondPop .fansListBox ul').eq(2), 2);
				$('#metiondPop .metiond_searchBox').eq(2).siblings('.metiond_searchBox').removeClass('select').end().addClass('select');
			} else {
				myScroll($('#metiondPop .fansListBox ul').eq(k), k);
				$('#metiondPop .metiond_searchBox').eq(k).siblings('.metiond_searchBox').removeClass('select').end().addClass('select');
			}
			$(this).siblings('li').removeClass('select').end().addClass('select');
			clearSearch($('#metiondPop'), $('#other-user-box'));
		});
	});
	//發出請求
	function getMyData(page, size, idx) {
		var btn = $('#metiondPop .classList li').eq(idx);
		var box = $('#metiondPop .fansListBox ul').eq(idx);
		if(idx == 0) {
			var myUrl = 'http://userspace1.macaoeasybuy.com/atUserController/queryUserFriendsList.easy?userId=' + userId + '&page=' + page + '&size=' + size + '&order=addtime&descOrAsc=desc&easybuyCallback=?';
		} else if(idx == 1) {
			var myUrl = 'http://userspace1.macaoeasybuy.com/atUserController/queryUserFansList.easy?userId=' + userId + '&page=' + page + '&size=' + size + '&order=addtime&descOrAsc=desc&easybuyCallback=?';
		} else if(idx == 2) {
			var myUrl = 'http://userspace1.macaoeasybuy.com/atUserController/quryUserNoAttentionList.easy?userId=' + userId + '&page=' + page + '&size=' + size + '&order=addtime&descOrAsc=desc&easybuyCallback=?';
		}
		$.ajax({
			url: myUrl,
			type: "get",
			async: true,
			dataType: 'jsonp',
			beforeSend: function() {
				$('#metiondPop .fansListBox').off('scroll');
				if(btn[0].isComplete == true) return false;
			},
			success: function(data) {
				if(idx == 0) {
					var newData = data.userFriendsList;
				} else if(idx == 1) {
					var newData = data.userFansList;
				} else if(idx == 2) {
					var newData = data.userNoAttentionList;
				}
				if(newData.length < size) {
					btn[0].isComplete = true; //如果取回來的數據少於需要的數據，則標記完成
				}
				var html = template(atPersonTemplate, {
					'data': newData,
					'page' : page
				}); //獲取模板
				box.append(html); //模板插入
				for(var i = 0; i < newData.length; i++) {
					$('.' + newData[i].id + 'userclass').each(function() {
						$(this)[0].dataId = newData[i].id;
						$(this)[0].name = newData[i].name;
						$(this)[0].dataAccount = newData[i].account;
					});
					//$('#'+newData[i].id+'user').removeAttr('id'); //取消id，保持安全性
				}
				btn[0].page = btn[0].page + 1; //頁數加一
				bingSelect(); //辦定點擊選擇事件
				myScroll(box, idx);
			}
		});
	}
	//行為函數
	function bingSelect() {
		var list = $('#metiondPop .fansListBox ul.list-box li');
		list.each(function(k) {
			$(this).off('click');
			$(this).on('click', function() {
				var self = $(this);
				//獲取ID
				var id = $(this)[0].dataId + '';
				var name = $(this)[0].name + '';
				var dataAccount = $(this)[0].dataAccount + '';
				if($(this).hasClass('select')) {
					//取消
					$(this).removeClass('select');
					deleteArr($('#metiondPop-select')[0].arr, id);
					deleteArr($('#metiondPop-select')[0].nameArr, name);
					deleteArr($('#metiondPop-select')[0].accountArr, dataAccount);
					$('#cheackedUl' + ' #' + id + 'user').remove(); //取消選擇
				} else {
					if($('#metiondPop-select')[0].arr.length < maxUserNum) {
						cloneSelect($(this).clone(false), $(this));
						//選擇
						$(this).addClass('select');
						$('#metiondPop-select')[0].arr.push(id);
						$('#metiondPop-select')[0].nameArr.push(name);
						$('#metiondPop-select')[0].accountArr.push(dataAccount);
					} else {
						//到達最大限度
						if($('#metiondPop .fullAlertBox').css('display') == 'none') {
							$('#metiondPop .fullAlertBox').stop().fadeIn(500).delay(1000).fadeOut(500);
						}
					}
				}
				$('#fansNumber').html($('#metiondPop-select')[0].arr.length);
			});
		});

		function cloneSelect(newObj, oldObj) {
			newObj.addClass('select');
			$('#cheackedUl').append(newObj);
			var id = oldObj[0].dataId + 'user';
			var name = oldObj[0].name;
			var dataAccount = oldObj[0].dataAccount;
			newObj.on('click', function() {
				$('#' + id).removeClass('select');
				deleteArr($('#metiondPop-select')[0].arr, parseInt(id));
				deleteArr($('#metiondPop-select')[0].nameArr, name);
				deleteArr($('#metiondPop-select')[0].accountArr, dataAccount);
				$('#fansNumber').html($('#metiondPop-select')[0].arr.length);
				$(this).remove();
			});
		}
	}
	//滾動條加載
	function myScroll(box, idx) {
		var boxHeight = box.outerHeight();
		var wHeight = $('#metiondPop .fansListBox').outerHeight();
		if(boxHeight <= wHeight) return false;
		$('#metiondPop .fansListBox').off('scroll');
		$('#metiondPop .fansListBox').on('scroll', function() {
			var scrollTop = $(this).scrollTop();
			if(scrollTop + wHeight >= boxHeight) {
				getMyData($('#metiondPop .classList li').eq(idx)[0].page, size, idx);
			}
		});
	}
	searchBox(); //搜索結果 辦定事件，辦定行為
	function searchBox() {
		//點擊發送
		$('#metiondPop .searchBox_right').each(function(k) {
			$(this)[0].isClickSearch = false;
			$(this).on('click', function() {
				if($(this)[0].isClickSearch) return false;
				$(this)[0].isClickSearch = true;
				var val = $(this).siblings('div').find('input').val();
				requestSearch(val, k, 0,$(this));
				$('#other-user-box')[0].page = 0;
				$('#other-user-box')[0].isComplete = false;
				$('#other-user-box').siblings('ul').removeClass('select').end().addClass('select');
				$('#editor-box .metiondBox .searchBox_right').css('cursor', 'wait');
			})
		});
		//發出請求
		function requestSearch(str, type, page,btn) {
			str = encodeURI(encodeURI(str));
			var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrUsersController/queryUserByName.easy?userId=' + userId + '&name=' + str + '&type=' + type + '&size=' + size + '&page=' + page + '&order=addtime&descOrAsc=desc&easybuyCallback=?';
//			var dataUrl = 'http://userspace.macaoeasybuy.com/atUserController/queryUserByName.easy?userId=' + userId + '&name=' + str + '&type=' + type + '&size=' + size + '&page=' + page + '&order=addtime&descOrAsc=desc&easybuyCallback=?';
			$.ajax({
				url: dataUrl,
				type: "get",
				async: true,
				dataType: 'jsonp',
				beforeSend: function() {
					$('#metiondPop .fansListBox').off('scroll');
//					if($('#other-user-box')[0].isComplete) return false;
				},
				success: function(data) {
					btn[0].isClickSearch = false;
					var newData = data.userList;
					var html = template(atPersonTemplate, {
						'data': newData,
						'page' : page
					}); //獲取模板
					if(page == 0) {
						$('#other-user-box').html(html); //添加模板
					} else {
						$('#other-user-box').append(html); //添加模板
					}
					for(var i = 0; i < $('#metiondPop-select')[0].arr.length; i++) {
						$('#other-user-box #' + $('#metiondPop-select')[0].arr[i] + 'user').addClass('select'); //去掉選擇過的
					}
					for(var i = 0; i < newData.length; i++) {
						$('#other-user-box' + ' #' + newData[i].id + 'user')[0].dataId = newData[i].id; //給每個li都添加dataId
						$('#other-user-box' + ' #' + newData[i].id + 'user')[0].name = newData[i].name; //添加暱稱
						$('#other-user-box' + ' #' + newData[i].id + 'user')[0].dataAccount = newData[i].account;
						searchOnclick($('#other-user-box' + ' #' + newData[i].id + 'user'));
					}
					onKeyupEvent();
					$('#other-user-box')[0].page = $('#other-user-box')[0].page + 1;
					if(newData.length < size) {
						$('#other-user-box')[0].isComplete = true;
					} else {
						searchScroll(str, type, $('#other-user-box')[0].page,btn);
					}
					$('#editor-box .metiondBox .searchBox_right').css('cursor', 'pointer');
				}
			});
		}

		function searchOnclick(obj) {
			obj.on('click', function() {
				var id = $(this)[0].dataId + '';
				var name = $(this)[0].name;
				var dataAccount = $(this)[0].dataAccount;
				if($(this).hasClass('select')) {
					$('#' + id + 'user').removeClass('select');
					//取消
					deleteArr($('#metiondPop-select')[0].arr, parseInt(id));
					deleteArr($('#metiondPop-select')[0].nameArr, name);
					deleteArr($('#metiondPop-select')[0].accountArr, dataAccount);
					$(this).removeClass('select');
					$('#cheackedUl' + ' #' + id + 'user').remove(); //取消選擇
				} else {
					if($('#metiondPop-select')[0].arr.length < maxUserNum) {
						$('#' + id + 'user').addClass('select');
						//選擇
						$('#metiondPop-select')[0].arr.push(id);
						$('#metiondPop-select')[0].nameArr.push(name);
						$('#metiondPop-select')[0].accountArr.push(dataAccount);
						$(this).addClass('select');
						//把東西添加進去
						cloneSearchSelect($(this).clone(false), $(this));
					} else {
						//到達最大限度
						if($('#metiondPop .fullAlertBox').css('display') == 'none') {
							$('#metiondPop .fullAlertBox').stop().fadeIn(500).delay(1000).fadeOut(500);
						}
					}
				}
				$('#fansNumber').html($('#metiondPop-select')[0].arr.length);
			});
		}

		function cloneSearchSelect(newObj, oldObj) {
			newObj.addClass('select');
			$('#cheackedUl').append(newObj);
			var id = oldObj[0].dataId + 'user';
			var name = oldObj[0].name;
			var dataAccount = oldObj[0].dataAccount;
			newObj.on('click', function() {
				deleteArr($('#metiondPop-select')[0].arr, parseInt(id));
				deleteArr($('#metiondPop-select')[0].nameArr, name);
				deleteArr($('#metiondPop-select')[0].accountArr, dataAccount);
				$('#fansNumber').html($('#metiondPop-select')[0].arr.length);
				$(this).remove();
			});
		}

		function searchScroll(str, type, page,btn) {
			// 滾動繼續添加搜索
			var boxHeight = $('#other-user-box').outerHeight();
			var wHeight = $('#metiondPop .fansListBox').outerHeight();
			if(boxHeight <= wHeight) return false;
			$('#metiondPop .fansListBox').off('scroll');
			$('#metiondPop .fansListBox').on('scroll', function() {
				var scrollTop = $(this).scrollTop();
				if(scrollTop + wHeight == boxHeight) {
					requestSearch(str, type, page,btn)
				}
			});
		}
		//辦定鍵盤事件
		function onKeyupEvent() {
			$('#metiondPop .metiond_searchBox').each(function() {
				$(this).off('keyup');
				$(this).on('keyup', function() {
					var inBox = $(this).find('input');
					var val = inBox.val();
					if(val.length == 0) {
						//清空
						var myIdx = $('#metiondPop .classList ul li.select').index();
						$('#metiondPop .fansListBox ul').eq(myIdx).siblings('ul').removeClass('select').end().addClass('select');
						if(myIdx == 3) {
							myScroll($('#metiondPop .fansListBox ul').eq(2), 2);
						} else {
							myScroll($('#metiondPop .fansListBox ul').eq(myIdx), myIdx);
						}
						$(this).off('keyup');
					}
				});
			});
		}
	}
}

function label() {
	var size = 4;
	var maxLabelNum = 10;
	$('#addLabel-select')[0].arr = [];
	$('#addLabel-select')[0].nameArr = [];
	// var labelTemplate = easyBuy.global.template['label-template'];
	var labelTemplate = 'label-template';
	//點擊確認添加返回結果
	$('#label-btn').on('click', function() {
		var idArr = $('#addLabel-select')[0].arr;
		var nameArr = $('#addLabel-select')[0].nameArr;
		var flag = false;
		if(editor.getLabelArr().length + idArr.length > maxLabelNum) {
			var num = editor.getLabelArr().length + idArr.length - maxLabelNum; //多出來的數目
			for(var i = 0; i < num; i++) {
				idArr.pop();
				nameArr.pop();
			}
			flag = true;
		}
		for(var i = 0; i < nameArr.length; i++) {
			editor.insertBlock(nameArr[i], idArr[i] + 'labelname', '#ff567c');
			for(var j = 0; j < $('.' + idArr[i] + 'labelname').length; j++) {
				$('#editor-box .' + idArr[i] + 'labelname')[j].dataId = idArr[i];
				$('#editor-box .' + idArr[i] + 'labelname')[j].dataName = nameArr[i];
				$('#editor-box .' + idArr[i] + 'labelname')[j].myType = 'label';
			}
		}
		$('#addLabel .hash-contains').fadeOut(150, function() {
			specialClear();
			if(flag) {
				specialTips('您所插入的標籤達到上限');
			}
		});
		$('#editor-box .replyBox_add .replyBox_addUl .shadow-box').css('display', 'none');
	});

	function specialClear() {
		clearSearch($('#addLabel'), $('#other-label-box'));
		var myIdx = $('#addLabel .classList ul li.select').index();
		$('#addLabel .LabelListBox ul').eq(myIdx).siblings('ul').removeClass('select').end().addClass('select');
		if(myIdx == 3) {
			myScroll($('#addLabel .LabelListBox ul').eq(2), 2);
		} else {
			myScroll($('#addLabel .LabelListBox ul').eq(myIdx), myIdx);
		}
		$('#addLabel-select')[0].arr.splice(0, $('#addLabel-select')[0].arr.length);
		$('#addLabel-select')[0].nameArr.splice(0, $('#addLabel-select')[0].nameArr.length);
		$('#checkedLabel').find('li').remove();
		$('#labelNumber').html($('#addLabel-select')[0].arr.length);
		$('#addLabel .LabelListBox li').removeClass('select');
		if(myIdx == 3) {
			myScroll($('#addLabel .LabelListBox ul').eq(2), 2);
		} else {
			myScroll($('#addLabel .LabelListBox ul').eq(myIdx), myIdx);
		}
	}
	//獲取總數量
	$.getJSON('http://userspace1.macaoeasybuy.com/chooseLabelController/queryUserLabelCount.easy?easybuyCallback=?', function(data) {
		for(var i in data.labelCount) {
			$('#' + i).find('.num').html(formatNum(data.labelCount[i]));
			$('#' + i)[0].page = 0;
			$('#' + i)[0].isComplete = false;
			$('#' + i).removeAttr('id');
		}
		getMyData(0, size, 0); //請求第一次
	});
	//綁定事件
	$('#addLabel .classList li').each(function(k) {
		$(this).on('click', function() {
			if(k != 3) {
				if($(this)[0].page == 0 && $(this)[0].isComplete == false) {
					getMyData(0, size, k); //請求第一次
				}
			}
			//盒子的切換
			$('#addLabel .LabelListBox ul').eq(k).siblings('ul').removeClass('select').end().addClass('select');
			if(k == 3) {
				myScroll($('#addLabel .LabelListBox ul').eq(2), 2);
				$('#addLabel .metiond_searchBox').eq(2).siblings('.metiond_searchBox').removeClass('select').end().addClass('select');
			} else {
				myScroll($('#addLabel .LabelListBox ul').eq(k), k);
				$('#addLabel .metiond_searchBox').eq(k).siblings('.metiond_searchBox').removeClass('select').end().addClass('select');
			}
			$(this).siblings('li').removeClass('select').end().addClass('select');
			clearSearch($('#addLabel'), $('#other-label-box'));
		});
	});
	//發出請求
	function getMyData(page, size, idx) {
		var btn = $('#addLabel .classList li').eq(idx);
		var box = $('#addLabel .LabelListBox ul').eq(idx);
		var myUrl = 'http://userspace1.macaoeasybuy.com/chooseLabelController/queryUserLabelByType.easy?type=' + idx + '&page=' + page + '&size=' + size + '&order=addtime&descOrAsc=asc&easybuyCallback=?';
		$.ajax({
			url: myUrl,
			type: "get",
			async: true,
			dataType: 'jsonp',
			beforeSend: function() {
				$('#addLabel .LabelListBox').off('scroll');
				if(btn[0].isComplete == true) return false;
			},
			success: function(data) {
				var newData = data.labelList;
				data.page = page;
				$.each(newData, function(k,y) {
					y.seeNums = formatNum(y.seeNums);
					y.loveNums = formatNum(y.loveNums);
				});
				if(newData.length == 0) return false; // 如果請求回來的數據長度為0，則直接返回
				if(newData.length < size) {
					btn[0].isComplete = true; //如果取回來的數據少於需要的數據，則標記完成
				}
				var html = template(labelTemplate,data); //獲取模板
				box.append(html); //模板插入
				for(var i = 0; i < newData.length; i++) {
					$('.' + newData[i].id + 'labelclass').each(function() {
						$(this)[0].dataId = newData[i].id;
						$(this)[0].name = newData[i].labelName;
					});
				}
				btn[0].page = btn[0].page + 1; //頁數加一
				bingSelect(); //辦定點擊選擇事件
				myScroll(box, idx);
			}
		});
	}
	//行為函數
	function bingSelect() {
		var list = $('#addLabel .LabelListBox ul.list-box li');
		list.each(function(k) {
			$(this).off('click');
			$(this).on('click', function() {
				var self = $(this);
				//獲取ID
				var id = $(this)[0].dataId + '';
				var name = $(this)[0].name + '';
				if($(this).hasClass('select')) {
					//取消
					$(this).removeClass('select');
					deleteArr($('#addLabel-select')[0].arr, id);
					deleteArr($('#addLabel-select')[0].nameArr, name);
					$('#checkedLabel' + ' #' + id + 'label').remove(); //取消選擇
				} else {
					if($('#addLabel-select')[0].arr.length < maxLabelNum) {
						cloneSelect($(this).clone(false), $(this));
						//選擇
						$(this).addClass('select');
						$('#addLabel-select')[0].arr.push(id);
						$('#addLabel-select')[0].nameArr.push(name);
					} else {
						//到達最大限度
						if($('#addLabel .fullAlertBox').css('display') == 'none') {
							$('#addLabel .fullAlertBox').stop().fadeIn(500).delay(1000).fadeOut(500);
						}
					}
				}
				$('#labelNumber').html($('#addLabel-select')[0].arr.length);
			});
		});

		function cloneSelect(newObj, oldObj) {
			newObj.addClass('select');
			$('#checkedLabel').append(newObj);
			var id = oldObj[0].dataId + 'label';
			var name = oldObj[0].name;
			newObj.on('click', function() {
				$('#' + id).removeClass('select');
				deleteArr($('#addLabel-select')[0].arr, parseInt(id));
				deleteArr($('#addLabel-select')[0].nameArr, name);
				$('#labelNumber').html($('#addLabel-select')[0].arr.length);
				$(this).remove();
			});
		}
	}
	//滾動條加載
	function myScroll(box, idx) {
		var boxHeight = box.outerHeight();
		var wHeight = $('#addLabel .LabelListBox').outerHeight();
		if(boxHeight <= wHeight) return false;
		$('#addLabel .LabelListBox').off('scroll');
		$('#addLabel .LabelListBox').on('scroll', function() {
			var scrollTop = $(this).scrollTop();
			if(scrollTop + wHeight >= boxHeight) {
				getMyData($('#addLabel .classList li').eq(idx)[0].page, size, idx);
			}
		});
	}
	searchBox(); //搜索結果 辦定事件，辦定行為
	function searchBox() {
		//點擊發送
		$('#addLabel .searchBox_right').each(function(k) {
			$(this)[0].isClickSearch = false;
			$(this).on('click', function() {
				if($(this)[0].isClickSearch) return false;
				$(this)[0].isClickSearch = true;
				var val = $(this).siblings('div').find('input').val();
				requestSearch(val, k, 0,$(this));
				$('#other-label-box')[0].page = 0;
				$('#other-label-box')[0].isComplete = false;
				$('#other-label-box').siblings('ul').removeClass('select').end().addClass('select');
				$('#editor-box .metiondBox .searchBox_right').css('cursor', 'wait');
			})
		});
		//發出請求
		function requestSearch(name, type, page,btn) {
			var ipUrl = 'http://userspace1.macaoeasybuy.com';
			var easyUrl = 'http://userspace1.macaoeasybuy.com';
			name = encodeURI(encodeURI(name));
			$.ajax({
//				url: ipUrl + '/chooseLabelController/queryLabelByName.easy?match=0&name=' + name + '&type=' + type + '&size=' + size + '&page=' + page + '&order=addtime&descOrAsc=desc&easybuyCallback=?',
				url : 'http://shopping1.macaoeasybuy.com/SolrLabelsController/QueryLabelForUserSpace.easy?match=0&name=' + name + '&type=' + type + '&size=' + size + '&page=' + page + '&order=addtime&descOrAsc=desc&easybuyCallback=?',
				type: "get",
				async: true,
				dataType: 'jsonp',
				beforeSend: function() {
					$('#addLabel .LabelListBox').off('scroll');
//					if($('#other-label-box')[0].isComplete) return false;
				},
				success: function(data) {
					btn[0].isClickSearch = false;
					var newData = data.labelList;
					data.page = page;
					$.each(newData, function(k,y) {
						y.seeNums = formatNum(y.seeNums);
						y.loveNums = formatNum(y.loveNums);
					});
					var html = template(labelTemplate,data); //獲取模板
					if(page == 0) {
						$('#other-label-box').html(html); //添加模板
					} else {
						$('#other-label-box').append(html); //添加模板
					}
					for(var i = 0; i < $('#addLabel-select')[0].arr.length; i++) {
						$('#other-label-box #' + $('#addLabel-select')[0].arr[i] + 'label').addClass('select'); //去掉選擇過的
					}
					for(var i = 0; i < newData.length; i++) {
						$('#other-label-box' + ' #' + newData[i].id + 'label')[0].dataId = newData[i].id; //給每個li都添加dataId
						$('#other-label-box' + ' #' + newData[i].id + 'label')[0].name = newData[i].labelName; //添加暱稱
						searchOnclick($('#other-label-box' + ' #' + newData[i].id + 'label'));
					}
					onKeyupEvent();
					$('#other-label-box')[0].page = $('#other-label-box')[0].page + 1;
					if(newData.length < size) {
						$('#other-label-box')[0].isComplete = true;
					} else {
						searchScroll(name, type, $('#other-label-box')[0].page,btn);
					}
					$('#editor-box .metiondBox .searchBox_right').css('cursor', 'pointer');
				}
			});
		}

		function searchOnclick(obj) {
			obj.on('click', function() {
				var id = $(this)[0].dataId + '';
				var name = $(this)[0].name;
				if($(this).hasClass('select')) {
					$('#' + id + 'label').removeClass('select');
					//取消
					deleteArr($('#addLabel-select')[0].arr, parseInt(id));
					deleteArr($('#addLabel-select')[0].nameArr, name);
					$(this).removeClass('select');
					$('#checkedLabel' + ' #' + id + 'label').remove(); //取消選擇
				} else {
					if($('#addLabel-select')[0].arr.length < maxLabelNum) {
						$('#' + id + 'label').addClass('select');
						//選擇
						$('#addLabel-select')[0].arr.push(id);
						$('#addLabel-select')[0].nameArr.push(name);
						$(this).addClass('select');
						//把東西添加進去
						cloneSearchSelect($(this).clone(false), $(this));
					} else {
						//到達最大限度
						if($('#addLabel .fullAlertBox').css('display') == 'none') {
							$('#addLabel .fullAlertBox').stop().fadeIn(500).delay(1000).fadeOut(500);
						}
					}
				}
				$('#labelNumber').html($('#addLabel-select')[0].arr.length);
			});
		}

		function cloneSearchSelect(newObj, oldObj) {
			newObj.addClass('select');
			$('#checkedLabel').append(newObj);
			var id = oldObj[0].dataId + 'label';
			var name = oldObj[0].name;
			newObj.on('click', function() {
				deleteArr($('#addLabel-select')[0].arr, parseInt(id));
				deleteArr($('#addLabel-select')[0].nameArr, name);
				$('#labelNumber').html($('#addLabel-select')[0].arr.length);
				$(this).remove();
			});
		}

		function searchScroll(str, type, page,btn) {
			// 滾動繼續添加搜索
			var boxHeight = $('#other-label-box').outerHeight();
			var wHeight = $('#addLabel .LabelListBox').outerHeight();
			if(boxHeight <= wHeight) return false;
			$('#addLabel .LabelListBox').off('scroll');
			$('#addLabel .LabelListBox').on('scroll', function() {
				var scrollTop = $(this).scrollTop();
				if(scrollTop + wHeight == boxHeight) {
					requestSearch(str, type, page,btn)
				}
			});
		}
		//辦定鍵盤事件
		function onKeyupEvent() {
			$('#addLabel .metiond_searchBox').each(function() {
				$(this).off('keyup');
				$(this).on('keyup', function() {
					var inBox = $(this).find('input');
					var val = inBox.val();
					if(val.length == 0) {
						//清空
						var myIdx = $('#addLabel .classList ul li.select').index();
						$('#addLabel .LabelListBox ul').eq(myIdx).siblings('ul').removeClass('select').end().addClass('select');
						if(myIdx == 3) {
							myScroll($('#addLabel .LabelListBox ul').eq(2), 2);
						} else {
							myScroll($('#addLabel .LabelListBox ul').eq(myIdx), myIdx);
						}
						$(this).off('keyup');
					}
				});
			});
		}
	}
}
//提示。插入表情或者標籤，多出來的就提示
function specialTips(str) {
	var div = '<div class="fullAlertBox" id="special-tips">' + str + '</div>';
	$('body').append(div);
	$('#special-tips').css({
		'position': 'fixed',
		'z-index': '501'
	});
	$('#special-tips').fadeIn(500).delay(1000).fadeOut(500, function() {
		$(this).remove();
	});
}
//清空所有的輸入框內容
function clearSearch(box, obj) {
	box.find('#editor-box .metiond_searchBox input').each(function() {
		$(this).val('');
	});
	obj.find('li').each(function() {
		$(this).remove();
	});
}

function emoji() {
	addImg();
	//表情
	emojiList(); //表情列表
	function getEmoji(id, obj) {
		$.ajax({
			url: 'http://userspace1.macaoeasybuy.com/expressionClassController/getExpressionListByid.easy?id=' + id + '&easybuyCallback=?',
			type: "get",
			async: true,
			dataType: 'jsonp',
			beforeSend: function() {
				if(obj[0].isComplete) return false;
			},
			success: function(data) {
				var data = data.expressionList;
				var pageNum = data.size == 1 ? 12 : 40;
				var liHtml = '';
				var dotHtml = '';
				var divHtml = '';
				for(var i = 0; i < Math.ceil(data.pageCount / pageNum); i++) {
					for(var j = i * pageNum; j <= (i + 1) * pageNum - 1; j++) {
						if(j < data.pageCount) {
							divHtml += '<div><img id="' + data.group[j].id + 'emojiDetail" src="http://mbuy.oss-cn-hongkong.aliyuncs.com/' + data.group[j].src + '" alt=""></div>';
						}
					}
					liHtml += '<li class="item clearflaot">' + divHtml + '</li>'
					divHtml = '';
					if(data.pageCount > pageNum) {
						if(i == 0) {
							dotHtml += '<li class="select"></li>';
						} else {
							dotHtml += '<li></li>';
						}
					}
				}
				$('#' + data.id + 'emojiDetailBox').find('.item-select-btn').append(dotHtml);
				$('#' + data.id + 'emojiDetailBox').find('.father').append(liHtml);
				$('#' + data.id + 'emojiDetailBox').siblings('.expression-baby').removeClass('select').end().addClass('select');
				for(var k = 0; k < data.group.length; k++) {
					$('#' + data.group[k].id + 'emojiDetail').parent()[0].src = data.group[k].src;
				}
				bindSelectPage(data.id + 'emojiDetailBox');
				obj[0].isComplete = true;
				//每增加表情都觸發辦定事件
				imgBindClick();
			}
		});
	}
	//辦定事件
	function bindSelectPage(id) {
		var list = $('#' + id + ' .item');
		var width = list.eq(0).width();
		list.eq(0).parent().css('width', width * list.length);
		var btnList = $('#' + id + ' .item-select-btn li');
		btnList.each(function(k) {
			$(this).on('click', function() {
				$(this).siblings('li').removeClass('select').end().addClass('select');
				$('#' + id + ' .father').animate({
					'left': k * width * -1 + 'px'
				});
			})
		});
	}
	//圖標列表
	function emojiList() {
		var box = $('#emjoPop .expression-contains .expression-btn>div>div');
		var lBtn = $('#emjoPop .expression-contains .expression-btn li.left');
		var rBtn = $('#emjoPop .expression-contains .expression-btn li.right');
		var page = 0; //頁碼
		emojiListRequest(page); //請求數據
		function emojiListRequest(page) {
			var size = 10;
			$.ajax({
				url: 'http://userspace1.macaoeasybuy.com/expressionClassController/getExpressionClassList.easy?page=' + page + '&size=' + size + '&order=theorder&descOrAsc=desc&easybuyCallback=?',
				type: "get",
				async: true,
				dataType: 'jsonp',
				beforeSend: function() {
					if(rBtn[0].finish) return false;
				},
				success: function(data) {
					//判斷獲取的長度
					if(data.expressionClassList.length > 0) {
						page++;
						afterRequest(data.expressionClassList, page); //獲取盒子，把元素插入盒子，添加寬度
						nextPrev(page); //向前向後按鈕
						if(data.expressionClassList.length < 10) {
							rBtn[0].finish = true; //不用再請求了;
						}
					} else {
						rBtn[0].finish = true; //不用再請求了;
					}
					//獲取表情詳細表情
					if(page == 1) getEmoji(parseInt(data.expressionClassList[0].id), box.find('li').eq(0));
				}
			});
		}

		function afterRequest(data, page) {
			//獲取盒子，把元素插入盒子，添加寬度
			for(var i = 0; i < data.length; i++) {
				var html = '<li class="my-select" id="' + data[i].id + 'emojiList" title="' + data[i].name + '" size="' + data[i].isSize + '"><img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/' + data[i].headPic + '" alt=""></li>';
				if(data[i].isSize == 0) {
					var boxHtml = '<div class="expression-baby" size="small" id="' + data[i].id + 'emojiDetailBox"><ul class="father clearfloat"></ul><ul class="item-select-btn clearfloat"></ul></div>';
				} else if(data[i].isSize == 1) {
					var boxHtml = '<div class="expression-baby" size="big" id="' + data[i].id + 'emojiDetailBox"><ul class="father clearfloat"></ul><ul class="item-select-btn clearfloat"></ul></div>';
				}
				$('#expression-page-box').append(boxHtml);
				box.append(html);
			}
			//給每個li一個page屬性，方便獲取詳細表情
			box.find('li').each(function() {
				if($(this)[0].isComplete == undefined) {
					$(this)[0].isComplete = false;
				}
			});
			if(page == 1) {
				var width = box.find('li').eq(0).addClass('select').outerWidth();
			} else {
				var width = box.find('li').eq(0).outerWidth();
				var idx = box.find('li.select').index();
				box.find('li').eq(idx + 1).siblings('li').removeClass('select').end().addClass('select');
				box.animate({
					'left': parseInt(box.css('left')) - 600 + 'px'
				});
				//切換盒子哦
				var id = parseInt(box.find('li').eq(idx + 1).attr('id'));
				if(box.find('li').eq(idx + 1)[0].isComplete == true) {
					$('#' + id + 'emojiDetailBox').siblings('.expression-baby').removeClass('select').end().addClass('select');
				} else {
					getEmoji(id, box.find('li').eq(idx + 1));
				}
			}
			box.css('width', box.find('li').length * width + 'px');
			box.parent().css('width', box.find('li').length * width + 'px');
			bindEvent();
		}

		function bindEvent() {
			//綁定事件
			box.find('li').off('click');
			box.find('li').each(function() {
				$(this).on('click', function() {
					if($(this)[0].isComplete == false) {
						//點擊，如果為false 則是裡面沒有數據表情
						getEmoji(parseInt($(this).attr('id')), $(this));
					} else {
						$('#' + parseInt($(this).attr('id')) + 'emojiDetailBox').siblings('.expression-baby').removeClass('select').end().addClass('select');
					}
					$(this).siblings('li').removeClass('select').end().addClass('select');
				});
			});
		}

		function nextPrev(page) {
			//向前向後按鈕
			lBtn.off('click');
			rBtn.off('click');
			lBtn.on('click', function() {
				var idx = box.find('li.select').index();
				if(idx > 0) {
					//判斷是請求呢，還是換頁呢
					var id = parseInt(box.find('li').eq(idx - 1).attr('id'));
					if(box.find('li').eq(idx - 1)[0].isComplete) {
						$('#' + id + 'emojiDetailBox').siblings('.expression-baby').removeClass('select').end().addClass('select');
					} else {
						getEmoji(id, box.find('li').eq(idx - 1));
					}
					//向前
					box.find('li').eq(idx - 1).siblings('li').removeClass('select').end().addClass('select');
					if(idx % 10 == 0) {
						box.animate({
							'left': parseInt(box.css('left')) + 600 + 'px'
						});
					}
				}
			});
			rBtn.on('click', function() {
				var idx = box.find('li.select').index();
				var len = box.find('li').length;
				box.find('li').eq(idx + 1).siblings('li').removeClass('select').end().addClass('select');
				var id = parseInt(box.find('li').eq(idx + 1).attr('id'));
				if((idx - 9) % 10 == 0) {
					if(box.find('li').eq(idx + 1).length == 0) {
						if(rBtn[0].finish) {
							return false;
						} else {
							emojiListRequest(page);
						}
					} else {
						box.animate({
							'left': parseInt(box.css('left')) - 600 + 'px'
						});
						if(box.find('li').eq(idx + 1)[0].isComplete == true) {
							$('#' + id + 'emojiDetailBox').siblings('.expression-baby').removeClass('select').end().addClass('select');
						} else {
							getEmoji(id, box.find('li').eq(idx + 1));
						}
					}
				} else {
					//判斷是請求呢，還是換頁呢
					if(box.find('li').eq(idx+1)[0].isComplete == true) {
						$('#' + id + 'emojiDetailBox').siblings('.expression-baby').removeClass('select').end().addClass('select');
					} else {
						getEmoji(id, box.find('li').eq(idx + 1));
					}
				}
			});
		}
	}

	function imgBindClick() {
		var editor = window.editor;
		var exp = $('#emjoPop .expression-contains .expression-baby .father .item div');
		exp.each(function() {
			$(this).off('click');
			$(this).on('click', function() {
				var size = $(this).parents('.expression-baby').attr('size');
				var src = $(this).find('img').attr('src');
				var saveSrc = $(this)[0].src;
				var imgId = parseInt($(this).find('img').attr('id')) + '';
				if(size == 'small') {
					//添加小表情
					editor.insertEmoji('http://mbuy.oss-cn-hongkong.aliyuncs.com/'+saveSrc, imgId);
				} else if(size == 'big') {
					//判斷大錶情的個數
					if($('#big-expression p .now')[0].bigExpNum >= $('#big-expression p .now')[0].bigExpMax) return false;
					$('#big-expression p .now')[0].bigExpNum++;
					$('#big-expression p .now').html($('#big-expression p .now')[0].bigExpNum);
					$('#big-expression p').css('display', 'block');
					var newImg = '<div><img src="' + src + '" alt="" class="bigExpression"><img src="/src/img/common/cancel-big-expression.png" alt="" class="cancel-btn"></div>';
					$('#big-expression p').before(newImg);
					newImg = null;
					editor.obj.focus();
					editor.setRange();
					editor.getRange(editor.ran);
					$('#replyBox_sendMess')[0].bigEmojiArr.push(saveSrc);
					//給大錶情綁定取消事件
					$('#big-expression div').each(function() {
						$(this).find('.cancel-btn').off('click');
						$(this).find('.cancel-btn').on('click', function() {
							$(this).parent().remove();
							$('#big-expression p .now')[0].bigExpNum--;
							$('#big-expression p .now').html($('#big-expression p .now')[0].bigExpNum);
							deleteArr($('#replyBox_sendMess')[0].bigEmojiArr, saveSrc);
							if($('#big-expression p .now')[0].bigExpNum == 0) {
								$('#big-expression p').css('display', 'none');
							} else {
								$('#big-expression p').css('display', 'block');
							}
						});
					});
				}
				src = null;
				size = null;
				$('#emjoPop .expression-contains').fadeOut(150);
				$('.replyBox_add .replyBox_addUl .shadow-box').css('display', 'none');
			});
		});
	}

	function addImg() {
		//添加表情
		var bigExpNum = 0;
		var bigExpMax = 8;
		$('#big-expression p .now').html(bigExpNum)[0].bigExpNum = bigExpNum;
		$('#big-expression p .max').html(bigExpMax);
		$('#big-expression p .now')[0].bigExpMax = bigExpMax;
	}
}

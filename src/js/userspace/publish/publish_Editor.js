var formatNum = easyBuy.global.dep.formatNum;
var deleteArr = easyBuy.global.dep.deleteArr;
var cloneObject = easyBuy.global.dep.cloneObject;
//選擇、顯示選項卡
function addSelect(hasStoreGoods,noBigEmoji){
	/*
	 * 	第一個參數是有沒有  相關商店，想商品
	 * 第二個參數是有沒有大錶情(二手頁沒有大錶情)
	 	發佈市集沒有標籤,沒有添加商品商店
	 */
	noBigEmoji = noBigEmoji == true ? noBigEmoji : false;
	var hasStoreGoods = hasStoreGoods;
	if(hasStoreGoods) window.newLabel = {list : []}; //default一個容器存儲新標籤
	$('#replyBox_sendMess')[0].bigEmojiArr = []; //default大錶情容器
	//點擊顯示彈框控制器
	$('#editor-box .replyBox_add .replyBox_addUl>li>img').each(function(k) {
		$(this)[0].flag = true; //true是沒有請求過，false是請求過了
		$(this).on('click', function() {
			if(hasStoreGoods) $('#editor-box .replyBox_add .replyBox_addUl>li>.shopProduct').css('display','none');
			$('#editor-box .replyBox_add .replyBox_addUl>li .contains').css('display', 'none');
			$('#editor-box .replyBox_add .replyBox_addUl .shadow-box').css('display', 'block');
			$(this).siblings('.contains').fadeIn();
			if($(this)[0].flag) {
				switch(k) {
					case 0:
						//請求表情
						emoji(noBigEmoji);
						break;
					case 1:
						//請求好友
						at();
						break;
					case 2:
						//請求標籤
						if(hasStoreGoods) label();
						break;
					case 3:
						if(hasStoreGoods) storegoods();
				}
			}
			$(this)[0].flag = false;
		});
	});
	$('#editor-box .replyBox_add .replyBox_addUl .shadow-box').on('click', function() {
		if(hasStoreGoods){
			$('#editor-box .replyBox_add .replyBox_addUl>li .contains,#editor-box .replyBox_add .replyBox_addUl>li>.shopProduct').css('display', 'none');
		}else{
			$('#editor-box .replyBox_add .replyBox_addUl>li .contains').css('display', 'none');
		}
		$(this).css('display', 'none');
	});
	if(hasStoreGoods){
		$('#editor-box .replyBox_add .replyBox_addUl>li .add-contains div').each(function(k){
			$(this)[0].flag = true;
			$(this).on('click',function(){
				$('#editor-box .replyBox_add .replyBox_addUl>li .contains').css('display', 'none');
				$('#editor-box .replyBox_add .replyBox_addUl>li>.shopProduct').eq(k).siblings('div').css('display','none').end().fadeIn();
				switch(k){
					case 0:
						//請求商品
					break;
					case 1:
						//請求商店
					break;
				}
				$(this)[0].flag = false;
			});
		});
	}
	useIdPublishFunc(); //使用某些東西去發佈東西
}
function at() {
	var size = 21;
	var maxUserNum = 20;
	$('#metiondPop-select')[0].arr = [];
	$('#metiondPop-select')[0].nameArr = [];
	$('#metiondPop-select')[0].accountArr = [];
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
		var atPersonTemplate = easyBuy.global.template['at-person-template'];
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
				var html = template.render(atPersonTemplate, {
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
			var atPersonTemplate = easyBuy.global.template['at-person-template'];
			str = encodeURI(encodeURI(str));
			var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrUsersController/queryUserByName.easy?userId=' + userId + '&name=' + str + '&type=' + type + '&size=' + size + '&page=' + page + '&order=addtime&descOrAsc=desc&easybuyCallback=?';
			//var dataUrl = 'http://userspace1.macaoeasybuy.com/atUserController/queryUserByName.easy?userId=' + userId + '&name=' + str + '&type=' + type + '&size=' + size + '&page=' + page + '&order=addtime&descOrAsc=desc&easybuyCallback=?';
			$.ajax({
				url: dataUrl,
				type: "get",
				async: true,
				dataType: 'jsonp',
				beforeSend: function() {
					$('#metiondPop .fansListBox').off('scroll');
				},
				success: function(data) {
					btn[0].isClickSearch = false;
					var newData = data.userList;
					var html = template.render(atPersonTemplate,{
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
		var labelTemplate = easyBuy.global.template['label-template'];
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
				var html = template.render(labelTemplate,data); //獲取模板
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
			var newLabelName = name;
			var ipUrl = 'http://userspace11.macaoeasybuy.com';
			var easyUrl = 'http://userspace1.macaoeasybuy.com';
			var newLabelTemplate = easyBuy.global.template['new-label-template'];
			var labelTemplate = easyBuy.global.template['label-template'];
			name = encodeURI(encodeURI(name));
			$.ajax({
				url : 'http://shopping1.macaoeasybuy.com/SolrLabelsController/QueryLabelForUserSpace.easy?match=1&name=' + name + '&type=' + type + '&size=' + size + '&page=' + page + '&order=addtime&descOrAsc=desc&easybuyCallback=?',
				type: "get",
				async: true,
				dataType: 'jsonp',
				beforeSend: function() {
					$('#addLabel .LabelListBox').off('scroll');
				},
				success: function(data) {
					btn[0].isClickSearch = false;
					//判斷是否創建新標籤
					var newLabelMatch = data.labelList.match;

					if(!newLabelMatch){
						var newLabelId = window.newLabel.list.length == 0 ? 0 : -1 * window.newLabel.list.length;
						var newLabelData = {
							id : newLabelId,
							labelName : '#'+newLabelName+'#',
							loveNums : '0',
							seeNums : '0',
							type : type,
							userId : userId
						}
						window.newLabel.list.push(newLabelData);
						var newLabelHtml = template.render(newLabelTemplate,newLabelData);
					}

					var newData = data.labelList.labelList;
					$.each(newData, function(k,y) {
						y.seeNums = formatNum(y.seeNums);
						y.loveNums = formatNum(y.loveNums);
					});
					var html = template.render(labelTemplate, data.labelList); //獲取模板
					if(page == 0) {
						$('#other-label-box').html(html); //添加模板
						if(!data.labelList.match) $('#other-label-box').prepend(newLabelHtml); //如果有新標籤則添加新標籤
					} else {
						$('#other-label-box').append(html); //添加模板
					}

					for(var i = 0; i < $('#addLabel-select')[0].arr.length; i++) {
						$('#other-label-box #' + $('#addLabel-select')[0].arr[i] + 'label').addClass('select'); //去掉選擇過的
					}

					if(!data.labelList.match) newData.unshift(newLabelData); //如果有新標籤的時候添加進去
					for(var i = 0; i < newData.length; i++) {
						$('#other-label-box' + ' #' + newData[i].id + 'label')[0].dataId = newData[i].id; //給每個li都添加dataId
						$('#other-label-box' + ' #' + newData[i].id + 'label')[0].name = newData[i].labelName; //添加暱稱
						searchOnclick($('#other-label-box' + ' #' + newData[i].id + 'label'));
					}
					onKeyupEvent();
					$('#other-label-box')[0].page = $('#other-label-box')[0].page + 1;
					var checkLengthNum = data.labelList.match ? newData.length : newData.length-1;
					if(checkLengthNum < size) {
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
//清空所有的輸入框內容
function clearSearch(box, obj) {
	box.find('#editor-box .metiond_searchBox input').each(function() {
		$(this).val('');
	});
	obj.find('li').each(function() {
		$(this).remove();
	});
}
function emoji(noBigEmoji) {
	if(!noBigEmoji) addImg();
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
			var ipUrl = 'http://userspace1.macaoeasybuy.com';
			var easyUrl = 'http://userspace1.macaoeasybuy.com';
			if(noBigEmoji){
				var sendDataUrl = ipUrl + '/expressionClassController/getExpressionClassList.easy?isSize=0&page=' + page + '&size=' + size + '&order=theorder&descOrAsc=desc&easybuyCallback=?';
			}else{
				var sendDataUrl = ipUrl + '/expressionClassController/getExpressionClassList.easy?page=' + page + '&size=' + size + '&order=theorder&descOrAsc=desc&easybuyCallback=?';
			}
			$.ajax({
				url: sendDataUrl,
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
					// editor.insertEmoji('http://mbuy.oss-cn-hongkong.aliyuncs.com/'+saveSrc, imgId);
					editor.insertEmoji(saveSrc, imgId);
				} else if(size == 'big') {
					//判斷大錶情的個數
					if($('#big-expression .now')[0].bigExpNum >= $('#big-expression .max')[0].bigExpMax) return false;
					$('#big-expression .now')[0].bigExpNum++;
					$('#big-expression .now').html($('#big-expression .now')[0].bigExpNum);
					$('#big-expression').css('display', 'block');
					var newImg = '<div class="showbox_main_bigmoji_each"><img class="bigExpression" src="'+src+'"><div class="showbox_main_bigmoji_each_close cancel-btn"><img src="/src/img/userspace/publish/pubilsh_close.png"></div></div>';
					$('#big-expression .publishBox_showbox_main').append(newImg);
					newImg = null;
//					editor.obj.focus();
//					editor.setRange();
//					editor.getRange(editor.ran);
					$('#replyBox_sendMess')[0].bigEmojiArr.push(saveSrc);
					//給大錶情綁定取消事件
					$('#big-expression .publishBox_showbox_main>div').each(function() {
						$(this).find('.cancel-btn').off('click');
						$(this).find('.cancel-btn').on('click', function() {
							$(this).parent().remove();
							$('#big-expression .now')[0].bigExpNum--;
							$('#big-expression .now').html($('#big-expression .now')[0].bigExpNum);
							deleteArr($('#replyBox_sendMess')[0].bigEmojiArr, saveSrc);
							if($('#big-expression .now')[0].bigExpNum == 0) {
								$('#big-expression').css('display', 'none');
							} else {
								$('#big-expression').css('display', 'block');
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
		$('#big-expression .now').html(bigExpNum)[0].bigExpNum = bigExpNum;
		$('#big-expression .max').html(bigExpMax)[0].bigExpMax = bigExpMax;

		var a = $('#big-expression .now')[0].bigExpNum;
		var b = $('#big-expression .max')[0].bigExpMax;
	}
}
function storegoods(){
	var ipUrl = 'http://userspace11.macaoeasybuy.com';
	var easyUrl = 'http://userspace1.macaoeasybuy.com';
	myDefault(); //設置初始值
	//看過商店，看過商品第一次點擊去請求東西
	$('#store-goods .product,#store-goods .shop').on('click.first',function(){
		$(this).off('click.first');
		var idx = $(this).index();
		switch(idx){
			case 1:
				goodRequest(0); //數據請求
				goodStatistical(); //統計
			break;
			case 2:
				storeRequest(0); //數據請求
				storeStatistical(); //統計
			break;
		}
	});
	$('#goods-btn').on('click.add',function(){
		var data = $(this).data('data');
		var addGoodTemplate = easyBuy.global.template['add-good-template'];
		//添加進去，顯示添加的內容
		var html = template.render(addGoodTemplate,data);
		$('#add-good-show-box .publishBox_showbox_main').html(html);
		$('#add-good-show-box .publishBox_showbox_title span').html(data.list.length);
		if(data.list.length  == 0){
			$('#add-good-show-box').css('display','none');
		}else{
			$('#add-good-show-box').css('display','block');
		}
		//隱藏選擇框
		$('.shadow-box').css('display','none');
		$('#store-goods .add-contains-product').fadeOut(200);
		$.each(data.list,function(k,y){
			var obj = $('#'+y.id+'-add-good-item');
			obj.data('data',y);
			obj.find('.showbox_main_good_each_close').on('click',function(){
				var objData = $(this).parent().data('data');
				$('#selectProduct .'+objData.id+'-good').remove();
				$('.'+objData.id+'-good').each(function(){
					$(this).removeClass('select');
					$(this).data('data').isSelect = false;
				});
				deleteArrObj($('#goods-btn').data('data').list,'id',objData.id);
				$('#ProductNumber').html($('#goods-btn').data('data').list.length);
				$('#add-good-show-box .publishBox_showbox_title span').html($('#goods-btn').data('data').list.length);
				$(this).parent().remove();
				if(data.list.length == 0) $('#add-good-show-box').css('display','none');
			});
		});
	});
	$('#shop-btn').on('click.add',function(){
		var data = $(this).data('data');
		var addShopTemplate = easyBuy.global.template['add-shop-template'];
		//添加進去，顯示添加的內容
		var html = template.render(addShopTemplate,data);
		$('#add-shop-show-box .publishBox_showbox_main').html(html);
		$('#add-shop-show-box .publishBox_showbox_title span').html(data.list.length);
		if(data.list.length  == 0){
			$('#add-shop-show-box').css('display','none');
		}else{
			$('#add-shop-show-box').css('display','block');
		}
		//隱藏選擇框
		$('.shadow-box').css('display','none');
		$('#store-goods .add-contains-shop').fadeOut(200);
		$.each(data.list,function(k,y){
			var obj = $('#'+y.id+'-add-shop-item');
			obj.data('data',y);
			obj.find('.showbox_main_shop_each_close').on('click',function(){
				var objData = $(this).parent().data('data');
				$('#selectShop .'+objData.id+'-shop').remove();
				$('.'+objData.id+'-shop').each(function(){
					$(this).removeClass('select');
					$(this).data('data').isSelect = false;
				});
				deleteArrObj($('#shop-btn').data('data').list,'id',objData.id);
				$('#shopNumber').html($('#shop-btn').data('data').list.length);
				$('#add-shop-show-box .publishBox_showbox_title span').html($('#shop-btn').data('data').list.length);
				$(this).parent().remove();
				if(data.list.length == 0) $('#add-shop-show-box').css('display','none');
			});
		});
	});
	//商品請求
	function goodRequest(idx){
		var showBox = $('#good-show-ul-box>ul').eq(idx);
		var page = $('#good-ul-box li').eq(idx).data('data').page;
		var size = 12; //看過的商品數量
		var isComplete = $('#good-ul-box li').eq(idx).data('data').isComplete;
		var maxSelect = 4;
		var btnSelected = $('#goods-btn').data('data').list;
		var goodsTemplate = easyBuy.global.template['goods-template'];
		switch(idx){
			case 0:
			var dataUrl = ipUrl + '/addSupplyController/selectUserBoughtGood.easy?userId='+userId+'&page='+page+'&size='+size+'&easybuyCallback=?';
			break;
			case 1:
			var dataUrl = ipUrl + '/addSupplyController/selectUserSeeGood.easy?userId='+userId+'&page='+page+'&size='+size+'&easybuyCallback=?';
			break;
			case 2:
			var dataUrl = ipUrl + '/addSupplyController/selectAllGood.easy?page='+page+'&size='+size+'&easybuyCallback=?';
			break;
		}
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				bindBoxScroll('off',$('#good-show-ul-box'));
				if(isComplete) return false;
			},
			success:function(data){
				data.type = idx;
				data.page = page;
				$.each(data.good,function(k,y){
					y.loveCount = formatNum(y.loveCount);
					y.seeCount = formatNum(y.seeCount);
					y.saleCount = formatNum(y.saleCount);
					y.id = y.shangpinId;
					y.isSelect = false;
					$.each(btnSelected,function(m,n){
						if(y.id == n.id){
							y.isSelect = true;
						}
					});
				})
				$('#good-ul-box li').eq(idx).data('data').page+=1;
				var html = template.render(goodsTemplate,data);
				showBox.append(html);
				//辦定數據，添加事件
				$.each(data.good,function(k,y){
					$('#'+y.shangpinId+'-good-'+idx).data('data',y);
					clickSelectEvent($('#'+y.shangpinId+'-good-'+idx),$('#selectProduct'),$('#goods-btn'),maxSelect,'good');
				});
				if(data.good.length == size){
					bindBoxScroll('on',$('#good-show-ul-box'),showBox,function(){
						goodRequest(idx);
					});
				}else{
					bindBoxScroll('off',$('#good-show-ul-box'));
					$('#good-ul-box li').eq(idx).data('data').isComplete = true;
				}

			}
		});
	}
	//商店請求
	function storeRequest(idx){
		var showBox = $('#shop-show-ul-box>ul').eq(idx);
		var page = $('#shop-ul-box li').eq(idx).data('data').page;
		var size = 9; //看過的商品數量
		var isComplete = $('#shop-ul-box li').eq(idx).data('data').isComplete;
		var maxSelect = 4;
		var btnSelected = $('#shop-btn').data('data').list;
		var storeTemplate = easyBuy.global.template['store-template'];
		switch(idx){
			case 0:
			var dataUrl = ipUrl + '/addSupplyController/selectUserBoughtShop.easy?userId='+userId+'&page='+page+'&size='+size+'&easybuyCallback=?';
			break;
			case 1:
			var dataUrl = ipUrl + '/addSupplyController/selectUserSeeShop.easy?userId='+userId+'&page='+page+'&size='+size+'&easybuyCallback=?';
			break;
			case 2:
			var dataUrl = ipUrl + '/addSupplyController/selectAllShop.easy?page='+page+'&size='+size+'&easybuyCallback=?';
			break;
		}
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				bindBoxScroll('off',$('#shop-show-ul-box'));
				if(isComplete) return false;
			},
			success:function(data){
				data.type = idx;
				data.page = page;
				$.each(data.shop,function(k,y){
					y.saleCount = formatNum(y.saleCount);
					y.fanCount = formatNum(y.fanCount);
					y.id = y.shopId;
					y.isSelect = false;
					$.each(btnSelected,function(m,n){
						if(y.id == n.id){
							y.isSelect = true;
						}
					});
				});
				//辦定數據，添加事件
				$('#shop-ul-box li').eq(idx).data('data').page+=1;
				var html = template.render(storeTemplate,data);
				showBox.append(html);
				$.each(data.shop,function(k,y){
					$('#'+y.shopId+'-shop-'+idx).data('data',y);
					clickSelectEvent($('#'+y.shopId+'-shop-'+idx),$('#selectShop'),$('#shop-btn'),maxSelect,'shop');
				});
				if(data.shop.length == size){
					bindBoxScroll('on',$('#shop-show-ul-box'),showBox,function(){
						storeRequest(idx);
					});
				}else{
					bindBoxScroll('off',$('#shop-show-ul-box'));
					$('#shop-ul-box li').eq(idx).data('data').isComplete = true;
				}

			}
		});
	}
	//點擊選擇，添加進去第四個盒子裡面
	function clickSelectEvent(box,appendBox,btn,maxSize,state){
		box.on('click',function(){
			var self = $(this);
			var showNum = state == 'good' ? $('#ProductNumber') : $('#shopNumber');
			var data = $(this).data('data');
			var className = $(this).attr('class').split(' ')[0];
			if(!data.isSelect){
				//選擇
				if(btn.data('data').list.length >= maxSize){
					state == 'good' ? specialTips('您所選的商品達到上限') : specialTips('您所選的商店達到上限');
					return false;
				}
				cloneSearchSelect(self.clone(false),self,appendBox,state,btn,showNum);
				appendBox.parent().find('ul>li.'+className).each(function(){
					$(this).data('data').isSelect = true;
					$(this).addClass('select');
				});
				btn.data('data').list.push(data);
			}else{
				//取消
				appendBox.find('li.'+className).each(function(){
					$(this).remove();
				});
				appendBox.parent().find('ul>li.'+className).each(function(){
					$(this).data('data').isSelect = false;
					$(this).removeClass('select');
				});
				deleteArrObj(btn.data('data').list,'id',data.id);
			}
			showNum.html(btn.data('data').list.length);
		});
	}
	//克隆 ，辦定取消事件
	function cloneSearchSelect(newObj, oldObj,box,state,btn,showNum) {
		var oldData = oldObj.data('data');
		newObj.addClass('select');
		if(state == 'good'){
			newObj.attr('id',oldData.id+'-good-3');
		}else{
			newObj.attr('id',oldData.id+'-shop-3');
		}
		box.append(newObj);
		newObj.data('data',cloneObject(oldData));
		newObj.on('click',function(){
			var className = $(this).attr('class').split(' ')[0];
			var newData = $(this).data('data');
			deleteArrObj(btn.data('data').list,'id',newData.id);
			showNum.html(btn.data('data').list.length);
			box.parent().find('ul>li.'+className).each(function(){
				$(this).data('data').isSelect = false;
				$(this).removeClass('select');
			});
			$(this).remove();
		});
	}
	//商品統計
	function goodStatistical(){
		var dataUrl = ipUrl + '/addSupplyController/countGoods.easy?userId='+userId+'&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			$('#goods-buys p.num').html(formatNum(data.goodsCount.buyNum));
			$('#goods-looked p.num').html(formatNum(data.goodsCount.seeNum));
			$('#goods-all p.num').html(formatNum(data.goodsCount.totalNum));
		});
	}
	//商店統計
	function storeStatistical(){
		var dataUrl = ipUrl + '/addSupplyController/countShop.easy?userId='+userId+'&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			$('#shop-buys p.num').html(formatNum(data.shopCount.buyNum));
			$('#shop-looks p.num').html(formatNum(data.shopCount.seeNum));
			$('#shop-all p.num').html(formatNum(data.shopCount.totalNum));
		});
	}
	//設置初始值
	function myDefault(){
		//給每個搜索框添加事件
		inputListenEvent(
			$('#goods-input input'), //輸入框
			$('#goods-input .searchBox_right'), //搜索按鈕
			$('#other-goods-box'), //搜索結果顯示盒子
			$('#goods-btn'), //提交的按鈕
			'good',
			$('#good-ul-box')
		);
		inputListenEvent(
			$('#shop-input input'), //輸入框
			$('#shop-input .searchBox_right'), //搜索按鈕
			$('#other-shop-box'), //搜索結果顯示盒子
			$('#shop-btn'), //提交的按鈕
			'shop',
			$('#shop-ul-box')
		);
		//給按鈕添加初始值
		$('#goods-btn').data('data',{
			list : [],
			idx : 0,
			search : {
				page : 0,
				isComplete : false
			}
		});
		$('#shop-btn').data('data',{
			list : [],
			idx : 0,
			search : {
				page : 0,
				isComplete : false
			}
		});
		//給每個導航按鈕添加點擊事件
		navDefault($('#good-ul-box>li'),$('#good-show-ul-box>ul'),function(k){
			goodRequest(k);
		},'good');
		navDefault($('#shop-ul-box>li'),$('#shop-show-ul-box>ul'),function(k){
			storeRequest(k);
		},'shop');
	}
	//按鈕導航
	function navDefault(item,box,fn,state){
		item.each(function(k){
			if(k != 3) $(this).data('data',{page:0,isComplete:false});
			$(this).on('click',function(){
				if($(this).hasClass('select')) return false;
				var data = $(this).data('data');
				$(this).siblings('li').removeClass('select').end().addClass('select');
				box.eq(k).siblings('ul').removeClass('select').end().addClass('select');
				if(k != 3 && data.page == 0){
					fn(k);
				}
				if(k != 3 && !data.isComplete){
					bindBoxScroll('on',box.parent(),box.eq(k),function(){
						fn(k);
					});
				}
				if(state == 'good'){
					if(k != 3) $('#goods-btn').data('data').idx = k;
					$('#goods-btn').data('data').search.page = 0;
					$('#goods-btn').data('data').search.isComplete = false;
					$('#other-goods-box').html('');
				}else{
					if(k != 3) $('#shop-btn').data('data').idx = k;
					$('#shop-btn').data('data').search.page = 0;
					$('#shop-btn').data('data').search.isComplete = false;
					$('#other-shop-box').html('');
				}
			});
		});
	}
	//監聽 input 框
	function inputListenEvent(inp,btn,searchBox,submitBtn,state,navList){
		var str = '';
		inp.on('keyup',function(){
			var val = $(this).val();
			var idx = submitBtn.data('data').idx;
			if(val == ''){
				searchBox.siblings('ul').eq(idx).siblings('ul').removeClass('select').end().addClass('select');
				navList.find('li').eq(idx).siblings('li').removeClass('select').end().addClass('select');
				if(state == 'good'){
					var bigBox = $('#good-show-ul-box');
				}else{
					var bigBox = $('#shop-show-ul-box');
				}
				if(!navList.find('li').eq(idx).data('data').isComplete){
					bindBoxScroll('on',bigBox,searchBox.siblings('ul').eq(idx),function(){
						state == 'good' ? goodRequest(idx) : storeRequest(idx);
					});
				};
				searchBox.html('');
				submitBtn.data('data').search.page = 0;
				submitBtn.data('data').search.isComplete = false;
			}
			str = val;
		});
		btn.on('click',function(){
			if(str == '' ) return false;
			submitBtn.data('data').search.page = 0;
			submitBtn.data('data').search.isComplete = false;

			searchBox.siblings('ul').removeClass('select').end().addClass('select');
			searchRequest(str,submitBtn,searchBox,state);
		});
	}
	//搜索
	function searchRequest(str,btn,box,state){
		var btnData = btn.data('data');
		var page = btnData.search.page;
		var type = btnData.idx;
		var encodeStr = encodeURI(encodeURI(str)); //轉碼
		var goodsTemplate = easyBuy.global.template['goods-template'];
		var storeTemplate = easyBuy.global.template['store-template'];
		if(state == 'good'){
			var size = 12;
			var maxSelect = 4;
			var btnSelected = $('#goods-btn').data('data').list;
			if(type == 2){
				//全部商品
				var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrGoodsController/QueryGoodsForUserSpace.easy?userId='+userId+'&size='+size+'&page='+page+'&type='+type+'&cond='+encodeStr+'&easybuyCallback=?';
			}else{
				//其他
				var dataUrl = ipUrl + '/addSupplyController/searchGood.easy?userId='+userId+'&size='+size+'&page='+page+'&type='+type+'&cond='+str+'&easybuyCallback=?';
			}
		}else{
			var size = 9;
			var maxSelect = 4;
			var btnSelected = $('#shop-btn').data('data').list;
			if(type == 2){
				//全部商店
				var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrShopsController/QuerySolrShopForUserSpace.easy?userId='+userId+'&size='+size+'&page='+page+'&type='+type+'&cond='+encodeStr+'&easybuyCallback=?';
			}else{
				//其他
				var dataUrl = ipUrl + '/addSupplyController/searchShop.easy?userId='+userId+'&size='+size+'&page='+page+'&type='+type+'&cond='+str+'&easybuyCallback=?';
			}
		}
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				state == 'good' ? bindBoxScroll('off',$('#good-show-ul-box')) : bindBoxScroll('off',$('#shop-show-ul-box'));
				if(btn.data('data').search.isComplete) return false;
			},
			success:function(data){
				data.type = 'search';
				data.page = page;
				if(state == 'good'){
					if(data.good == null) data.good = [];
					$.each(data.good,function(k,y){
						y.loveCount = formatNum(y.loveCount);
						y.seeCount = formatNum(y.seeCount);
						y.saleCount = formatNum(y.saleCount);
						y.id = y.shangpinId;
						y.isSelect = false;
						$.each(btnSelected,function(m,n){
							if(y.id == n.id){
								y.isSelect = true;
							}
						});
					});
					var html = template.render(goodsTemplate,data);
				}else{
					if(data.shop == null) data.shop = [];
					$.each(data.shop,function(k,y){
						y.saleCount = formatNum(y.saleCount);
						y.fanCount = formatNum(y.fanCount);
						y.id = y.shopId;
						y.isSelect = false;
						$.each(btnSelected,function(m,n){
							if(y.id == n.id){
								y.isSelect = true;
							}
						});
					});
					var html = template.render(storeTemplate,data);
				}
				page == 0 ? box.html(html) : box.append(html);
				btn.data('data').search.page += 1;
				if(state == 'good'){
					$.each(data.good,function(k,y){
						$('#'+y.shangpinId+'-good-search').data('data',y);
						clickSelectEvent($('#'+y.shangpinId+'-good-search'),$('#selectProduct'),$('#goods-btn'),maxSelect,'good');
					});
				}else{
					$.each(data.shop,function(k,y){
						$('#'+y.shopId+'-shop-search').data('data',y);
						clickSelectEvent($('#'+y.shopId+'-shop-search'),$('#selectShop'),$('#shop-btn'),maxSelect,'shop');
					});
				}
				if(state == 'good'){
					if(data.good.length == size){
						bindBoxScroll('on',$('#good-show-ul-box'),box,function(){
							searchRequest(str,btn,box,state);
						});
					}else{
						bindBoxScroll('off',$('#good-show-ul-box'));
						btn.data('data').search.isComplete = true;
					}
				}else{
					if(data.shop.length == size){
						bindBoxScroll('on',$('#shop-show-ul-box'),box,function(){
							searchRequest(str,btn,box,state);
						});
					}else{
						bindBoxScroll('off',$('#shop-show-ul-box'));
						btn.data('data').search.isComplete = true;
					}
				}

			}
		});
	}
	//監聽盒子滾動條
	function bindBoxScroll(state,bigBox,box,fn){
		if(state == 'on'){
			var boxHeight = box.outerHeight();
			var wHeight = bigBox.outerHeight();
			if(boxHeight <= wHeight) return false;
			bigBox.off('scroll');
			bigBox.on('scroll',function(){
				var scrollTop = $(this).scrollTop();
				if(scrollTop + wHeight >= boxHeight * 0.6){
					fn();
				}
			});
		}else{
			bigBox.off('scroll');
		}
	}
}
//提示。插入表情或者標籤，多出來的就提示
function specialTips(str,fn) {
	if($('#special-tips').length != 0) return false;
	var div = '<div class="fullAlertBox" id="special-tips">' + str + '</div>';
	$('body').append(div);
	$('#special-tips').css({
		'position': 'fixed',
		'z-index': '888',
		'top' : '50%',
		'left' : '50%',
		'-webkit-transform' : 'translate(-50%,-50%)',
		'-ms-transform' : 'translate(-50%,-50%)',
		'-o-transform' : 'translate(-50%,-50%)',
		'-moz-transform' : 'translate(-50%,-50%)',
		'transform' : 'translate(-50%,-50%)'
	});
	$('#special-tips').fadeIn(500).delay(1000).fadeOut(500, function() {
		$(this).remove();
		if(fn) fn();
	});
}
//獲取商品的內容
function getShangpinId(obj){
	var res = [];
	if(obj != undefined){
		$.each(obj.list, function(k,y) {
			var str = y.id;
			res.push(str);
		});
	}
	return res.join(',');
}
//獲取商店Id
function getShopIdNew(obj){
	var res = '';
	if(obj != undefined){
		var arr = [];
		$.each(obj.list, function(k,y) {
			arr.push(y.id);
		});
		res = arr.join(',');
	}
	return res;
}
//獲取新標籤內容
function getNewLabelName(arr,type){
	var res = [];
	$.each(arr,function(k,y){
		if(y<=0){
			$.each(window.newLabel.list, function(m,n) {
				if(y == n.id){
					res.push(n[type]);
				}
			});
		}
	});
	return res.join(',');
}
//獲取大錶情
function getBigExpression(arr){
	var bigexpression = ''
	for(var i = 0; i < arr.length; i++) {
		bigexpression += '|' + arr[i];
	}
	return bigexpression;
}
//獲取標籤Id列表
function getLabelIdList(arr){
	var res = [];
	$.each(arr, function(k,y) {
		y<=0 ? res.push('0') : res.push(y);
	});
	return res.join(',');
}
//獲取標題
function getTitleName(input,max){
	var val = input.val().substring(0,max);
	return val;
}


//使用某些東西去發佈東西
function useIdPublishFunc(){

}

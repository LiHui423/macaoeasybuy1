var classId = 6; //技能設置
var seeUserId = easyBuy.global.pageParameter.spaceid;
easyBuy.global.startJs = function(){
	getData(userId, classId);
	$('#submit-btn').data('data', {
		isCanSubmit: false, //是否修改了
		sendRes: '', //發送的結果
		secondArr: [] //修改了的二級分類數組
	})
}
function getData(userId, classId) {
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/queryUserSetting.easy?userId=' + userId + '&classId=' + classId + '&seeUserId=' + seeUserId +'&easybuyCallback=?';
	$.getJSON(dataUrl, function(data) {
		console.log(data);
		var newData = data.settingList[0];
		var html = template('skill-data', newData);
		$('#skill-lister').html(html); //模板添加
		progressFunc(newData.complete, newData.sum); //進度條
		bindDataName(data.settingList[0]); //把數據辦定到節點裡面
		skillListSelect(); //點擊顯示列表
		submitClick(); //發送按鈕
	});
}
//進度條
function progressFunc(now, sum) {
	$('#info-progress div').css('width', now / sum * 100 + '%');
	$('#info-progress span').eq(0)[0].num = now
	$('#info-progress span').eq(0).html(now);
	$('#info-progress span').eq(1)[0].num = sum;
	$('#info-progress span').eq(1).html(sum);
	$('#info-progress').css('display', 'block');
}
//把數據辦定到節點裡面
function bindDataName(data) {
	//一級
	var contentTitle = $('.content-title');
	contentTitle.data('data', {
		name: data.parentCode,
		id: data.parentId
	});
	//二級
	var listLi = $('.skill-lister>li');
	listLi.each(function(k) {
		$(this).data('data', {
			name: data.nextClassList[k].code,
			newList: data.nextClassList[k].choosedList,
			isChange: false,
			id: data.nextClassList[k].id
		});
	});
}
//點擊顯示列表
function skillListSelect() {
	var liList = $('.skill-lister>li .info-content>span');
	liList.each(function() {
		$(this)[0].isClick = false;
		$(this).on('click', function() {
			$('.skill-lister>li .list-select').css('display', 'none');
			if(!$(this)[0].isClick) {
				getListData($(this));
			} else {
				$(this).parent().siblings('.list-select').css('display', 'block');
			}
		});
	});
	$('.skill-lister>li .shadow-box').on('click', function() {
		$('.skill-lister>li .list-select').css('display', 'none');
	});
}
//點擊后，獲取列表數據內容
function getListData(obj) {
	var parentId = $('.content-title').data('data').id;
	var secondData = obj.parents('.second-list').data('data');
	var id = secondData.id;
	var newList = secondData.newList;
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/querySelectList.easy?parentId=' + parentId + '&secondClassId=' + id + '&easybuyCallback=?';
	$.ajax({
		url: dataUrl,
		type: "get",
		async: true,
		dataType: 'jsonp',
		beforeSend: function() {
			obj[0].isClick = true;
		},
		success: function(data) {
			var newData = data.selectList;
			//判斷是否已經選擇好了
			for(var i = 0; i < newData.length; i++) {
				newData[i].isSelect = 0;
				for(var j = 0; j < newList.length; j++) {
					if(newData[i].code == newList[j].code) {
						newData[i].isSelect = 1;
					}
				}
			}
			//創建模板
			var html = template('list-data', data);
			//添加模板
			obj.parent().siblings('.list-select').find('.ul-box ul').html(html);
			//事件觸發，顯示列表
			obj.parent().siblings('.list-select').css('display', 'block');
			//給節點辦定事件與數據
			var listBtn = obj.parent().siblings('.list-select').find('.ul-box ul>li');
			listBtn.each(function(k) {
				$(this).data('data', newData[k]);
				skillSelect($(this));
			});
		}
	});
}


function skillSelect(btn) {
	btn.on('click', function() {
		var oneData = $('.content-title').data('data'); //一級數據
		var twoData = $(this).parents('.second-list').data('data'); //二級數據
		var threeData = $(this).data('data'); //三級數據
		var sendBtn = $('#submit-btn') //發送按鈕
		var sendData = sendBtn.data('data'); //發送數據
		//改變發送按鈕狀態
		if(!sendData.isCanSubmit) {
			sendData.isCanSubmit = true;
			sendBtn.removeClass('can-not-save');
		}
		//把修改了的選項的二級數據添加進數組裡面
		if(!twoData.isChange) {
			twoData.isChange = true;
			sendData.secondArr.push(twoData.name);
		}
		//判斷data修改樣式跟data
		if(threeData.isSelect == 0) {
			//選上
			$(this).addClass('select');
			threeData.isSelect = 1;
			twoData.newList.push({
				code: threeData.code,
				name: threeData.name
			});
			if(twoData.newList.length == 1) progressFunc($('#info-progress span').eq(0)[0].num += 1, $('#info-progress span').eq(1)[0].num);
		} else {
			//取消
			$(this).removeClass('select');
			threeData.isSelect = 0;
			deleteArrObj(twoData.newList, 'code', threeData.code);
			if(twoData.newList.length == 0) progressFunc($('#info-progress span').eq(0)[0].num -= 1, $('#info-progress span').eq(1)[0].num);
		};
		//把選項的第一個顯示在節點上
		showDataHtml(
			$(this).parents('.list-select').siblings('.info-content').find('img').siblings('span'),
			twoData.newList,
			$(this).parent().find('li')
		);
	});
}
//把選項的第一個顯示在節點上
function showDataHtml(obj, arr, btns) {
	var name = '';
	for(var i = 0; i < btns.length; i++) {
		if(btns.eq(i).data('data').isSelect == 1) {
			name = btns.eq(i).data('data').name;
			break;
		}
	}
	if(arr.length == 0) {
		obj.parents('.second-list').removeClass('select');
		obj.html('未選擇');
	} else if(arr.length == 1) {
		obj.parents('.second-list').addClass('select');
		obj.html(name);
	} else {
		obj.parents('.second-list').addClass('select');
		obj.html(name + '...');
	}
}
//點擊發送
function submitClick() {
	var sendBtn = $('#submit-btn') //發送按鈕
	var sendData = sendBtn.data('data'); //發送數據
	var res = '';
	//點擊觸發
	sendBtn.on('click.submit', function() {
		if(sendData.isCanSubmit) {
			res = getRes();
			submitSend(res);
			$('.list-select').css('display', 'none');
		}
	});
	//整理節點數據
	function getRes() {
		var returnRes = '';
		var oneList = $('.content-title'); //一級節點
		var twoList = $('.skill-lister>li'); //二級節點
		var oneData = oneList.data('data'); //一級節點數據
		var oneArr = [
			'|',
			oneData.name + ':',
			'|'
		];
		twoList.each(function(k) {
			var twoData = $(this).data('data'); //二級節點數據
			if(twoData.isChange) {
				var threeList = $(this).find('.list-select .ul-box ul li'); //三級節點
				var threeData = []; //三級節點數據
				for(var i = 0; i < threeList.length; i++) {
					threeData.push(threeList.eq(i).data('data'));
				}
				var twoArr = [
					'$',
					twoData.name + ':#',
					'#$'
				];
				var threeArr = []; //三級節點已選數據數據
				for(var i = 0; i < threeData.length; i++) {
					if(threeData[i].isSelect == 1) {
						threeArr.push(
							threeData[i].code + ':' + threeData[i].name
						)
					}
				}
				twoArr.splice(2, 0, threeArr.join(','));
				oneArr.splice(oneArr.length - 1, 0, twoArr.join(''));
			}
		});
		returnRes = oneArr.join('');
		return returnRes;
	}
	//發送數據
	function submitSend(res) {
		res = encodeURIComponent(res);
		var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/updateInfo.easy?userId=' + userId + '&infos=' + res + '&easybuyCallback=?';
		$.ajax({
			url: dataUrl,
			type: "get",
			async: true,
			dataType: 'jsonp',
			beforeSend: function() {
				sendData.isCanSubmit = false;
			},
			success: function(data) {
				if(data.state != 'success') return false;
				if($('#praise-post').css('display') == 'none') $('#praise-post').fadeIn(500).delay(1000).fadeOut(500);
				//恢復初始狀態
				$('.skill-lister>li').each(function() {
					$(this).data('data').isChange = false;
				});
				sendBtn.addClass('can-not-save');
			}
		});
	}
}

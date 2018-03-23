var cloneObject = easyBuy.global.dep.cloneObject;
var deleteArrObj = easyBuy.global.dep.deleteArrObj;
var seeUserId = easyBuy.global.pageParameter.spaceid;
easyBuy.global.startJs = function(){
	getMyData();
}
function getMyData(){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/queryUserSetting.easy?userId=' + userId + '&classId=3,4,5&seeUserId=' + seeUserId + '&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		console.log(data);
		var newData = data.settingList;
		for(var i=0;i<newData.length;i++){
			if(i !=2 ){
				var html = template.render(easyBuy.global.template['data-template'],newData[i]);
				$('.skill-lister').eq(i).html(html);
				switch(i){
					case 0:
						progressFunc(newData[i].complete,newData[i].sum,$('#like-title'));
					break;
					case 1:
						progressFunc(newData[i].complete,newData[i].sum,$('#point-title'));
					break;
				}
				bindDataName(newData[i],i); //把數據辦定到節點裡面
				skillListSelect(i); //點擊顯示列表事件
			}else{
				if(newData[i].nextClassList[0].choosedList.length == newData[i].sum) $('#add-boring').css('display','none');
				var html = template.render(easyBuy.global.template['boring-template'],newData[i].nextClassList[0]);
				$('#add-boring').before(html);
				$('#boring-lister .boring-item>li.boring-list').each(function(k){
					$(this).attr('id',newData[i].nextClassList[0].choosedList[k].code+'-boring');
					$(this).data('data',newData[i].nextClassList[0].choosedList[k]);
				});
				bindBoringData(newData[i]); //把數據辦定到節點裡面
				bindClickShow(); //點擊顯示列表事件
				deleteBoring(); //點擊刪除
			}
		}
		//給點擊按鈕默認屬性
		$('#submit-btn').data('data',{
			isCanSubmit : false
		});
		//點擊發送函數
		submitClick();
	});
}
//進度條
function progressFunc(now, sum,box) {
	box.find('.info-progress div').css('width', now / sum * 100 + '%');
	box.find('.info-progress span').eq(0)[0].num = now
	box.find('.info-progress span').eq(0).html(now);
	box.find('.info-progress span').eq(1)[0].num = sum;
	box.find('.info-progress span').eq(1).html(sum);
	box.find('.info-progress').css('display', 'block');
}
//把數據辦定到節點裡面
function bindDataName(data,idx) {
	//一級
	var contentTitle = $('.content-title').eq(idx);
	contentTitle.data('data', {
		name: data.parentCode,
		id: data.parentId,
		isChange : false
	});
	//二級
	var listLi = $('.skill-lister').eq(idx).find('li');
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
function skillListSelect(idx) {
	idx+=1
	var liList = $('.skill-lister:nth-of-type('+idx+')>li .info-content>span');
	liList.each(function() {
		$(this)[0].isClick = false;
		$(this).on('click', function() {
			$('.skill-lister>li .list-select').css('display','none');
			$('#add-boring .add-list-box').css('display','none');
			if(!$(this)[0].isClick) {
				getListData($(this));
			} else {
				$(this).parent().siblings('.list-select').css('display', 'block');
			}
		});
	});
	$('.skill-lister:nth-of-type('+idx+')>li .shadow-box').on('click', function() {
		$('.skill-lister:nth-of-type('+idx+')>li .list-select').css('display', 'none');
	});
}
//點擊后，獲取列表數據內容
function getListData(obj) {
	var parentId = obj.parents('.skill-lister').prev().data('data').id;
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
			var html = template.render(easyBuy.global.template['list-tempalte'], data);
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
		var titleBox = $(this).parents('.skill-lister').prev();
		var oneData = $(this).parents('.skill-lister').prev().data('data'); //一級數據
		var twoData = $(this).parents('.second-list').data('data'); //二級數據
		var threeData = $(this).data('data'); //三級數據
		var sendBtn = $('#submit-btn') //發送按鈕
		var sendData = sendBtn.data('data'); //發送數據
		//改變發送按鈕狀態
		canSend();
		//把修改了的選項的二級數據添加進數組裡面
		if(!twoData.isChange) twoData.isChange = true;
		//判斷data修改樣式跟data
		if(threeData.isSelect == 0) {
			//選上
			$(this).addClass('select');
			threeData.isSelect = 1;
			twoData.newList.push({
				code: threeData.code,
				name: threeData.name
			});
			if(twoData.newList.length == 1) progressFunc(titleBox.find('.info-progress span').eq(0)[0].num+=1,titleBox.find('.info-progress span').eq(1)[0].num,titleBox);
		} else {
			//取消
			$(this).removeClass('select');
			threeData.isSelect = 0;
			deleteArrObj(twoData.newList, 'code', threeData.code);
			if(twoData.newList.length == 0) progressFunc(titleBox.find('.info-progress span').eq(0)[0].num-=1,titleBox.find('.info-progress span').eq(1)[0].num,titleBox);
		};
		//把選項的第一個顯示在節點上
		showDataHtml(
			$(this).parents('.list-select').siblings('.info-content').find('img').siblings('span'),
			twoData.newList,
			$(this).parent().find('li')
		);
		oneData.isChange = true;
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
//修改發送按鈕狀態
function canSend(){
	var sendBtn = $('#submit-btn'); //發送按鈕
	var sendData = sendBtn.data('data');//放數據
	if(!sendData.isCanSubmit){
		sendData.isCanSubmit = true;
		sendBtn.removeClass('can-not-save');
	}
}
//點擊發送函數
function submitClick(){
	var sendBtn = $('#submit-btn') //發送按鈕
	var sendData = sendBtn.data('data');//放數據
	sendBtn.on('click',function(){
		if(!$(this).data('data').isCanSubmit) return false;
		var res = getRes($('#like-title').data('data'),$('#like-content>li'));
		res += getRes($('#point-title').data('data'),$('#point-content>li'));
		res += getBoringRes();
		res = (res.length == 0) ? 'null' : res;
		submitSend(res);
		$('.list-select').css('display','none');
		$('.add-list-box').css('display','none');
	});
	//發送數據
	function submitSend(res) {
		res = encodeURIComponent(res);
//		var dataUrl = 'http://userspace.macaoeasybuy.com/userSettingController/updateInfo.easy?userId=' + userId + '&infos=' + res + '&easybuyCallback=?';
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
				$('.skill-lister>li').each(function() {
					$(this).data('data').isChange = false;
				});
				$('.content-title').each(function(){
					$(this).data('data').isChange = false;
				});
				sendBtn.addClass('can-not-save');
			}
		});
	}
	//獲取平時無聊的數據
	function getBoringRes(){
		var str = '';
		var oneData = $('#boring-title').data('data');
		if(!oneData.isChange) return str;
		var twoData = $('#add-boring').data('data');
		var arr = [
			'|',
			oneData.name + ':',
			'|'
		];
		var secondArr = [
			'$',
			twoData.name + ':#',
			'#$'
		];
		var threeArr = [];
		for(var i=0;i<twoData.newList.length;i++){
			threeArr.push(twoData.newList[i].code + ':' + twoData.newList[i].name);
		}
		secondArr.splice(2,0,threeArr.join(','));
		arr.splice(arr.length-1,0,secondArr.join(''));
		str = arr.join('');
		return str;
	}
	//獲取數據
	function getRes(one,list){
		var str = '';
		if(!one.isChange) return str;
		var arr = [
			'|',
			one.name + ':',
			'|'
		];
		list.each(function(){
			var data = $(this).data('data');
			if(data.isChange){
				var secondArr = [
					'$',
					data.name + ':#',
					'#$'
				];
				var threeArr = [];
				for(var i=0;i<data.newList.length;i++){
					threeArr.push(data.newList[i].code + ':' + data.newList[i].name);
				}
				secondArr.splice(2,0,threeArr.join(','));
				arr.splice(arr.length-1,0,secondArr.join(''));
			}
		});
		str = arr.join('');
		return str;
	}
}



//平時無聊辦定數據
function bindBoringData(data){
	var secondData = data.nextClassList[0];
	//一級
	var contentTitle = $('#boring-title');
	contentTitle.data('data', {
		name: data.parentCode,
		id: data.parentId,
		isChange : false
	});
	//二級
	var listLi = $('#add-boring');
	listLi.data('data', {
		name : secondData.code,
		newList : secondData.choosedList,
		isChange: false,
		id: secondData.id
	});
}
function bindClickShow(){
	var add = $('#add-boring'); //這個功能li
	var btn = add.find('img.add'); //加號按鈕
	var box = add.find('.add-list-box'); //點擊顯示的盒子
	var shadow = add.find('.shadow-box'); //陰影
	btn[0].isClick = false;
	btn.on('click',function(){
		$('.skill-lister>li .list-select').css('display','none');
		$('#add-boring .add-list-box').css('display','none');
		if(!$(this)[0].isClick){
			addBoring($(this));
		}else{
			box.css('display','block');
			add.find('img.up').css('display','inline-block');
		}
	});
	shadow.on('click',function(){
		$('#add-boring .add-list-box').css('display','none');
	});
}
function addBoring(obj){
	var parentId = $('#boring-title').data('data').id;
	var secondData = $('#add-boring').data('data');
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
			//添加模板
			var html = template.render(easyBuy.global.template['boring-list-tempalte'],data);
			$('#add-boring .add-list-inner').html(html);
			//顯示節點
			$('#add-boring .add-list-box').css('display','block');
			$('#add-boring').find('img.up').css('display','inline-block');
			var listBtn = $('#add-boring .add-list-inner li');
			listBtn.each(function(k){
				for(var i=0;i<newData.length;i++){
					if($(this).attr('id').split('-')[0] == newData[i].code){
						$(this).data('data',newData[i]);
					}
				}
				boringSelect($(this));
			});
			//確認添加
			boringSure();
		}
	});
}
//勾選
function boringSelect(btn){
	var oneData = $('#boring-title').data('data');
	var twoData = $('#add-boring').data('data');
	btn.on('click',function(){
		var threeData = $(this).data('data');
		if(threeData.isSelect == 0){
			$(this).addClass('select');
			threeData.isSelect = 1;
		}else{
			$(this).removeClass('select');
			threeData.isSelect = 0;
		}
	});
}
//點擊確認
function boringSure(){
	var sureBtn  = $('#add-boring .btn');
	var oneData = $('#boring-title').data('data');
	var twoData = $('#add-boring').data('data');
	sureBtn.on('click',function(){
		if(!twoData.isChange) twoData.isChange = true;
		$('#add-boring .add-list-inner li').each(function(k){
			var threeData = cloneObject($(this).data('data'));
			if(threeData.isSelect == 1){
				$(this).remove();
				var html = '<li class="boring-list" id="'+threeData.code+'-boring"><span>'+threeData.name+'</span><img src="/src/img/userspace/personalinfo/delete-boring.png" alt="" class="delete"></li>';
				$('#add-boring').before(html);
				$('#'+threeData.code+'-boring').data('data',{
					code : threeData.code,
					name : threeData.name
				});
				twoData.newList.push({
					code : threeData.code,
					name : threeData.name
				})
				deleteBoring();
			}
		});
		$('.add-list-box').css('display','none');
		if($('#add-boring .add-list-inner li').length == 0) $('#add-boring').css('display','none');
		oneData.isChange = true;
		canSend();
	});
}
//點擊刪除
function deleteBoring(){
	$('#boring-lister img.delete').each(function(){
		$(this).off('click');
		$(this).on('click',function(){
			var secondData = $('#add-boring').data('data');
			var parent = $(this).parent();
			var idx = parent.index();
			var parentData = cloneObject(parent.data('data'));
			$('.add-list-box').css('display','none');
			$('#add-boring').css('display','block');
			secondData.newList.splice(idx,1);
			if(!secondData.isChange) secondData.isChange = true;
			parent.remove();
			//如果選擇列表已經請求回來了，就添加到節點裡面
			if($('#add-boring img.add')[0].isClick){
				var html = '<li class="clearfloat" id="'+parentData.code+'-boring"><div></div><span>'+parentData.name+'</span></li>';
				$('#add-boring .add-list-inner').append(html);
				$('#'+parentData.code+'-boring').data('data',{
					code : parentData.code,
					name : parentData.name,
					isSelect : 0
				});
				boringSelect($('#'+parentData.code+'-boring'));
			}
			$('#boring-title').data('data').isChange = true;
			canSend();
		});
	});
}

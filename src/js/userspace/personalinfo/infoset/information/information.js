var resData = new Object();
var deleteArrObj = easyBuy.global.dep.deleteArrObj;
easyBuy.global.startJs = function(){
	aboutMeData(); //關於我
	$('#submit-btn').data('data',{
		isCanSubmit : false,//是否修改了
		sendRes : '', //發送的結果
		secondArr : [] //修改了的二級分類數組
	});
	through();//經歷
}
//關於我
function aboutMeData(){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/queryUserAboutMeEditor.easy?userId='+userId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var newData = data.userBasicInfo;
		 //賬號
		$('#easybuy-account .info-content span').html(newData.account);
		//暱稱
		nameSelect($('#easybuy-nickname input'),newData.name);
		//性別
		sex(newData.sex);
		//生日
		birthday(newData.birthday.split('-')[0],newData.birthday.split('-')[1],newData.birthday.split('-')[2],newData.birthday);
		//星座
		radioSelect(newData.nextClassList[0],$('#easybuy-constellation'),newData.parentId);
		//感情狀況
		radioSelect(newData.nextClassList[1],$('#easybuy-state'),newData.parentId);
		resData.aboutMe = [
			'|',
			newData.parentCode + ':',
			'|'
		]
		aboutProgress(newData.complete,newData.sum);
	});
}

function aboutProgress(a,b){
	if(a > b) a = b;
	$('#about-me-title .info-progress span').eq(0)[0].num = a;
	$('#about-me-title .info-progress span').eq(0).html(a);
	$('#about-me-title .info-progress span').eq(1)[0].num = b;
	$('#about-me-title .info-progress span').eq(1).html(b);
	$('#about-me-title .info-progress div').css('width',a/b * 100 + '%');
	$('#about-me-title .info-progress').css('display','block');
}
//星座感情狀況
function radioSelect(data,box,parentId){
	var btn = box.find('.info-content>span');
	if(data.choosedList.length != 0){
		btn.find('span').html(data.choosedList[0].name);
		box.addClass('select');
	}
	btn.on('click.request',function(){
		var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/querySelectList.easy?parentId='+parentId+'&secondClassId='+data.id+'&easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				btn.off('click.request');
			},
			success:function(newData){
				for(var i=0;i<newData.selectList.length;i++){
					var html = '<li>'+newData.selectList[i].name+'</li>';
					btn.siblings('.radio-box').find('ul').append(html);
				}
				btn.siblings('.radio-box').find('ul li').each(function(k){
					$(this).data('data',{
						name : newData.selectList[k].name,
						code : newData.selectList[k].code,
						type : data.id
					})
				});
				btn.siblings('.radio-box').css('display','block');
				$('.list-select').css('display','none');
				bindClick(btn,data)//辦定事件
			}
		});
	});
	function bindClick(myBtn,data){
		myBtn.data('data',{
			code : data.code,
			name : data.name,
			selectData : []
		});
		$('#easybuy-constellation .info-content>span, #easybuy-state .info-content>span').off('click.show')
		$('#easybuy-constellation .info-content>span, #easybuy-state .info-content>span').on('click.show',function(){
			$('.skill-lister.check-select>li .list-select').css('display','none');
			$('.skill-lister>li .radio-box').css('display','none');
			$(this).siblings('.radio-box').css('display','block');
			$('.list-select').css('display','none');
		});
		$('.skill-lister>li .radio-box .shadow-box').off('click.show');
		$('.skill-lister>li .radio-box .shadow-box').on('click.show',function(){
			$(this).parent().css('display','none');
		});
		$('.skill-lister>li .radio-box .ul-box ul li').off('click.show');
		$('.skill-lister>li .radio-box .ul-box ul li').on('click.show',function(){
			var thisData = $(this).data('data');
			$('.skill-lister>li .radio-box').css('display','none');
			var html = thisData.name;
			$(this).parents('.radio-box').siblings('span').data('data').selectData = [thisData.code,thisData.name];
			$(this).parents('.radio-box').siblings('span').find('span').html(html);
			$(this).parents('.check-box').addClass('select');
			submitBtn();
			if(data.choosedList.length == 0){
				aboutProgress($('#about-me-title .info-progress span').eq(0)[0].num+=1,$('#about-me-title .info-progress span').eq(1)[0].num);
			}
		});
	}
}
//暱稱輸入
function nameSelect(obj,data){
	obj.attr('value',data);
	resData.name = data;
	obj.on('keyup',function(){
		var val = $(this).val();
		resData.name = val;
		submitBtn();
	});
}
//生日選擇
function birthday(a,b,c,all){
	resData.birthday = all;
	var arr = [];
	new YMDselect('year','month','day',a,b,c);
	$('#birthday-select .select-box select').each(function(k){
		$(this).on('change',function(event){
			var a = saveAll();
			for(var i=0;i<a.length;i++){
				if(a[i] == 0){
					a = null;
					break;
				}
			}
			resData.birthday = a ==null ? null :  a.join('-');
			submitBtn();
		});
	});
	function saveAll(){
		var newArr = [];
		$('#birthday-select .select-box select').each(function(k){
			newArr[k] = $(this)[0].value;
		});
		return newArr;
	}
}
//性別選擇
function sex(sex){
	if(sex == 'Boy'){
		$('#easybuy-sex .man').addClass('select');
		resData.sex = 1;
	}else{
		$('#easybuy-sex .girl').addClass('select');
		resData.sex = 0;
	}
	$('#easybuy-sex .info-content div').on('click',function(){
		switch($(this).index()){
			case 0:
				resData.sex = 1;
			break;
			case 1:
				resData.sex = 0;
			break;
		}
		$(this).siblings('div').removeClass('select').end().addClass('select');
		submitBtn();
	});
}
function submitBtn(){
	var btn = $('#submit-btn');
	if(btn.data('data').isCanSubmit) return false;
	btn.data('data').isCanSubmit = true;
	btn.removeClass('can-not-save');
}


function through(){
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/queryUserSetting.easy?userId='+userId+'&classId=2&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var newData = data.settingList[0];
		var html = template('through-template',newData);
		$('#live-content').html(html); //模板添加
		progressFunc(newData.complete,newData.sum); //進度條
		bindDataName(data.settingList[0]); //把數據辦定到節點裡面
		skillListSelect(); //點擊顯示列表
		submitClick(); //提交按鈕
	});
	//進度條
	function progressFunc(a,b){
		if(a > b) a = b;
		$('#live-title .info-progress span').eq(0)[0].num = a;
		$('#live-title .info-progress span').eq(0).html(a);
		$('#live-title .info-progress span').eq(1)[0].num = b;
		$('#live-title .info-progress span').eq(1).html(b);
		$('#live-title .info-progress div').css('width',a/b * 100 + '%');
		$('#live-title .info-progress').css('display','block');
	}
	//把數據辦定到節點裡面
	function bindDataName(data){
		//一級
		var contentTitle = $('#live-title');
		contentTitle.data('data',{
			name : data.parentCode,
			id : data.parentId
		});
		//二級
		var listLi = $('#live-content>li');
		listLi.each(function(k){
			$(this).data('data',{
				name : data.nextClassList[k].code,
				newList : data.nextClassList[k].choosedList,
				isChange : false,
				id : data.nextClassList[k].id
			});
		});
	}
	//點擊顯示列表
	function skillListSelect(){
		var liList = $('#live-content>li .info-content>span');
		liList.each(function(){
			$(this)[0].isClick = false;
			$(this).on('click',function(){
				$('#live-content>li .list-select').css('display','none');
				if(!$(this)[0].isClick){
					getListData($(this));
				}else{
					$(this).parent().siblings('.list-select').css('display','block');
					$('#about-me-content .radio-box').css('display','none');
				}
			});
		});
		$('#live-content>li .shadow-box').on('click',function(){
			$('#live-content>li .list-select').css('display','none');
		});
	}
	//點擊后，獲取列表數據內容
	function getListData(obj){
		var parentId = $('#live-title').data('data').id;
		var secondData = obj.parents('.second-list').data('data');
		var id = secondData.id;
		var newList = secondData.newList;
		var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/querySelectList.easy?parentId='+parentId+'&secondClassId='+id+'&easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				obj[0].isClick = true;	
			},
			success:function(data){
				var newData = data.selectList;
				//判斷是否已經選擇好了
				for(var i=0;i<newData.length;i++){
					newData[i].isSelect = 0;
					for(var j=0;j<newList.length;j++){
						if(newData[i].code == newList[j].code){
							newData[i].isSelect = 1;
						}
					}
				}
				//創建模板
				var html = template('list-template',data);
				//添加模板
				obj.parent().siblings('.list-select').find('.ul-box ul').html(html);
				//事件觸發，顯示列表
				obj.parent().siblings('.list-select').css('display','block');
				$('#about-me-content .radio-box').css('display','none');
				//給節點辦定事件與數據
				var listBtn = obj.parent().siblings('.list-select').find('.ul-box ul>li');
				listBtn.each(function(k){
					$(this).data('data',newData[k]);
					skillSelect($(this));
				});
			}
		});
	}
	function skillSelect(btn){
		btn.on('click',function(){
			var oneData = $('#live-title').data('data'); //一級數據
			var twoData = $(this).parents('.second-list').data('data'); //二級數據
			var threeData = $(this).data('data'); //三級數據
			var sendBtn = $('#submit-btn') //發送按鈕
			var sendData = sendBtn.data('data'); //發送數據
			//改變發送按鈕狀態
			if(!sendData.isCanSubmit){
				sendData.isCanSubmit = true;
				sendBtn.removeClass('can-not-save');
			}
			//把修改了的選項的二級數據添加進數組裡面
			if(!twoData.isChange){
				twoData.isChange = true;
				sendData.secondArr.push(twoData.name);
			}
			//判斷data修改樣式跟data
			if(threeData.isSelect == 0){
				//選上
				$(this).addClass('select');
				threeData.isSelect = 1;
				twoData.newList.push({
					code : threeData.code,
					name : threeData.name
				});
				if(twoData.newList.length == 1) progressFunc($('#live-title .info-progress span').eq(0)[0].num+=1,$('#live-title .info-progress span').eq(1)[0].num);
			}else{
				//取消
				$(this).removeClass('select');
				threeData.isSelect = 0;
				deleteArrObj(twoData.newList,'code',threeData.code);
				if(twoData.newList.length == 0) progressFunc($('#live-title .info-progress span').eq(0)[0].num-=1,$('#live-title .info-progress span').eq(1)[0].num);
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
	function showDataHtml(obj,arr,btns){
		var name = '';
		for(var i=0;i<btns.length;i++){
			if(btns.eq(i).data('data').isSelect == 1){
				name = btns.eq(i).data('data').name;
				break;
			}
		}
		if(arr.length == 0){
			obj.parents('.second-list').removeClass('select');
			obj.html('未選擇');
		}else if(arr.length == 1){
			obj.parents('.second-list').addClass('select');
			obj.html(name);
		}else{
			obj.parents('.second-list').addClass('select');
			obj.html(name + '...');
		}
	}
	//點擊發送
	function submitClick(){
		var sendBtn = $('#submit-btn') //發送按鈕
		var sendData = sendBtn.data('data'); //發送數據
		var res = '';
		var oneRes = '';
		//點擊觸發
		sendBtn.on('click.submit',function(){
			if(sendData.isCanSubmit){
				oneRes = getAboutMe();
				res = getRes();
				(oneRes + res == '') ? submitSend('null') : submitSend(oneRes + res);
				$('.radio-box,.list-select').css('display','none');
			}
		});
		//整理我的經歷
		function getRes(){
			var returnRes = '';
			var oneList = $('#live-title'); //一級節點
			var twoList = $('#live-content>li'); //二級節點
			var oneData = oneList.data('data'); //一級節點數據
			var oneArr = [
				'|',
				oneData.name + ':',
				'|'
			];
			twoList.each(function(k){
				var twoData = $(this).data('data'); //二級節點數據
				if(twoData.isChange){
					var threeList = $(this).find('.list-select .ul-box ul li'); //三級節點
					var threeData = []; //三級節點數據
					for(var i=0;i<threeList.length;i++){
						threeData.push(threeList.eq(i).data('data'));
					}
					var twoArr = [
						'$',
						twoData.name + ':#',
						'#$'
					];
					var threeArr = []; //三級節點已選數據數據
					for(var i=0;i<threeData.length;i++){
						if(threeData[i].isSelect == 1){
							threeArr.push(
								threeData[i].code+':'+threeData[i].name
							)
						}
					}
					twoArr.splice(2,0,threeArr.join(','));
					oneArr.splice(oneArr.length-1,0,twoArr.join(''));
				}
			});
			returnRes = oneArr.join('');
			if(/#/g.test(returnRes)){
				return returnRes;
			}else{
				return '';
			}
		}
		//獲取關於我的
		function getAboutMe(){
			var res = [];
			var oneData = $('#easybuy-constellation .info-content>span').data('data');
			var twoData = $('#easybuy-state .info-content>span').data('data');
			$('#easybuy-constellation .info-content>span,#easybuy-state .info-content>span').each(function(k){
				var data = $(this).data('data');
				if(data != undefined){
					if(data.selectData.length != 0){
						res[k] = '&'+data.code+':#'+data.selectData[0]+':'+data.selectData[1]+'#&';
					}
				}
			});
			resData.aboutMe.splice(resData.aboutMe.length-1,0,res.join(''));
			var str = resData.aboutMe.join('');
			if(/#/g.test(str)){
				return str
			}else{
				return '';
			}
		}
		//發送數據
		function submitSend(res){
			resData.name = encodeURIComponent(resData.name);
			res = encodeURIComponent(res);
			var dataUrl = 'http://userspace1.macaoeasybuy.com/userSettingController/updateUserBasicSetting.easy?userId='+userId+'&sex='+resData.sex+'&name='+resData.name+'&birthday='+resData.birthday+'&info='+res+'&easybuyCallback=?';
			$.ajax({
				url:dataUrl,
				type:"get",
				async:true,
				dataType:'jsonp',
				beforeSend:function(){
					sendData.isCanSubmit = false;
				},
				success:function(data){
					if(data.status != 'success') return false;
					resData.aboutMe.splice(resData.aboutMe.length-2,1);
					if($('#praise-post').css('display')=='none') $('#praise-post').fadeIn(500).delay(1000).fadeOut(500);
					//恢復初始狀態
					$('#live-content>li').each(function(){
						$(this).data('data').isChange = false;
					});
					sendBtn.addClass('can-not-save');
				}
			});
		}
	}
}

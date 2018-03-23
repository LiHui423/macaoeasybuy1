var postId = easyBuy.global.pageParameter.postId || 428;
var seeUserId = easyBuy.global.pageParameter.spaceid;
easyBuy.global.startJs = function(){
	easyBuy.userSpaceGlobal.replyPostType = '4';
	easyBuy.userSpaceGlobal.replyVolunteersType = 'replyUsed'; //回復貼子分類
	userStatus(); //帖子狀態
}

//判斷是自己看還是他人看
function userStatus(){
	updateSeeLog(4);//所有帖子(点击量/查看量)
	if(easyBuy.global.isSelf){
		$('#other-mess-name').remove();
		$('.messBox_pic').remove();
		$('.messBox_logo').remove();
		$('#violation').remove();
		//刪除帖子
		myDeletePost({
			type : 'releaseUsed',
			delUrl : 'http://userspace1.macaoeasybuy.com/UserUsedConntroller/deleteBatchUserUsed.easy'
		}); 
	}else{
		$('#delete-post').remove();
		$('#mine-mess-name').remove();
		$('#post-delete').remove();
		$('#second-state').remove();
		reportPost(); //舉報帖子
	}
	function afterSendFunc(){
		$('#whatsapp-num').html($('#whatsapp-num')[0].num);
		$('#wechat-num').html($('#wechat-num')[0].num);
	}
	//編輯器
	$('#editor-box').load('/public/postDetailEditor.html',function(){
		editorFunc(afterSendFunc);
	});
	//輪播圖
	postContent();//帖子內容
	postBanner({
		dataUrl : 'http://userspace1.macaoeasybuy.com/UserUsedConntroller/queryUsedInfoPics.easy',
		values : 'usedInfoPics',
		id: postId
	});
	queryTopicCount(4,'Used');//评论查看赞好数统计
	isClickLove(2,2); //點讚
	responseCard(4);//回復查看讃好，數據
	handPost();//上下篇
}
//選項卡(待評論列表加載完之後調用)
function selectPage(){
	var btn = $('.statistics-title li');
	var page = $('.statistics-page .statistics-page-item');
	btn.each(function(k){
		if(k!=0) $(this)[0].flag = true;
		$(this).on('click',function(){
			if($(this).hasClass('select')){
				return false;
			}
			$(this).siblings('li').removeClass('select').end().addClass('select');
			page.eq(k).siblings('.statistics-page-item').removeClass('select').end().addClass('select');
			if(k==0){
				boxTop({
					box:$('#editor-box'),
					boxOuter:$('.userspace-content-inner'),
					referBox:$('.statistics'),
					fadeTime:150,
				});
			}else{
				restoreEditorBox($('#editor-box'));
			}
			if($(this)[0].flag){
				switch(k){
					case 1:
						//初次請求查看
						checkCard($(this),4);
					break;
					case 2:
						//初次請求讃好
						mygoodCard($(this),2);
					break;
				}
			}
		});
	});
}


//帖子內容
function postContent(){
	$.ajax({
		url:'http://userspace1.macaoeasybuy.com/UserUsedConntroller/queryUsedInfo.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var newData = data.usedInfo;
			$('#messBox_mess_time .articleTime span').html(newData.addtime); //發佈時間
			$('#messBox_mess_time .articleType span').html(newData.typename); //二手類型
			$('.commodity_Mess .commodity_MessUl li:nth-of-type(1) p').eq(1).html(newData.usedfunction);//二手功能
			$('.commodity_Mess .commodity_MessUl li:nth-of-type(2) p').eq(1).html(newData.appearance);//二手外觀
			$('.commodity_Mess .commodity_MessUl li:nth-of-type(6) p').eq(1).html(newData.fineness);//二手新舊
			$('.commodity_Mess .commodity_MessUl li:nth-of-type(4) p').eq(1).html(newData.insurance);//二手私保
			$('.commodity_Mess .commodity_MessUl li:nth-of-type(3) p').eq(1).html(newData.period);//二手保養
			$('.commodity_Mess .commodity_MessUl li:nth-of-type(7) p').eq(1).html('MOP'+newData.price);//二手價格
			$('.commodity_Mess .commodity_MessUl li:nth-of-type(5) p').eq(1).html(newData.settlement);//二手交收
			$('.commodity_Mess .commodity_MessUl li:nth-of-type(8) p').eq(1).html(newData.place ? newData.place : '無');//二手交收
			$('#whatsapp-num')[0].num = newData.whatsapp ? newData.whatsapp : '無';
			$('#wechat-num')[0].num = newData.wechat ? newData.wechat : '無';
			$('#atricle_title span:first-of-type').html(newData.titlename); //標題
			myContent(newData.usedcontent);//內容
			labelClass([newData.placeLabel,newData.brandLabel,newData.hotLabel]);//標籤分類
			changePostStatus(newData.isSelf,newData.state);//帖子狀態
			commodity(newData);//相關商品
			if(newData.shopList != undefined){
				otherMessShop(newData.shopList);//相關商店
			}else{
				$('#otherMess_shop').parent().remove();
			}
			if(newData.isSelf == 1){
				$('#whatsapp-num').html($('#whatsapp-num')[0].num);
				$('#wechat-num').html($('#wechat-num')[0].num);
			}else if(newData.isSelf == 0){
				userInfo(newData.username,newData.headPic,newData.sex); //用戶性別，頭像，姓名
				if(newData.isDisplay != 0){
					$('#whatsapp-num').html($('#whatsapp-num')[0].num);
					$('#wechat-num').html($('#wechat-num')[0].num);
				}
			}
			//調用吸頂評論框
			boxTop({
				box:$('#editor-box'),
				boxOuter:$('.userspace-content-inner'),
				referBox:$('.statistics'),
				fadeTime:150,
			});
		}
	});
}


//上下篇
function handPost(){
	var handPostTemplate = easyBuy.global.template['handPost'];
	//上一篇
	$.getJSON('http://userspace1.macaoeasybuy.com/UserUsedConntroller/queryPreUsed.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		if(data.preUsed){
			var html = template.render(handPostTemplate,data.preUsed);
			$('.other-post-box.first').html(html);
			$('#'+data.preUsed.id+'handPost').find('.handPost-content').html(data.preUsed.usedcontent);
			$('#'+data.preUsed.id+'handPost').find('.handPost-year').html(data.preUsed.uptime.split(' ')[0]);
			$('#'+data.preUsed.id+'handPost').find('.handPost-time').html(data.preUsed.uptime.split(' ')[1]);
			$('#'+data.preUsed.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.preUsed.pictureurl){
				imgOnMiddle($('.other-post .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.first').remove();
			$('.other-post .other-post-box.first').remove();
		}
	});
	//下一篇
	$.getJSON('http://userspace1.macaoeasybuy.com/UserUsedConntroller/queryLastUsed.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		if(data.lastUsed){
			var html = template.render(handPostTemplate,data.lastUsed);
			$('.other-post-box.second').html(html);
			$('#'+data.lastUsed.id+'handPost').find('.handPost-content').html(data.lastUsed.usedcontent);
			$('#'+data.lastUsed.id+'handPost').find('.handPost-year').html(data.lastUsed.uptime.split(' ')[0]);
			$('#'+data.lastUsed.id+'handPost').find('.handPost-time').html(data.lastUsed.uptime.split(' ')[1]);
			$('#'+data.lastUsed.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.lastUsed.pictureurl){
				imgOnMiddle($('.other-post .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.second').remove();
			$('.other-post .other-post-box.second').remove();
		}
	});
}


//帖子的狀態選擇
function changePostStatus(isSelf,postStateNum){
	var showHtml = '';
	var postStateNum = postStateNum;
	if(postStateNum == 0){
		showHtml = '已成交';
		changeSelect('ready',showHtml);
	}else if(postStateNum == 1){
		showHtml = '待成交';
		changeSelect('deter',showHtml);
	}else if(postStateNum == -1){
		showHtml = '取消出讓';
		changeSelect('cancel',showHtml);
	}
	if(isSelf == 1) postState('on');
	
	function innerChange(state){
		//改狀態
		var dataUrl = 'http://userspace1.macaoeasybuy.com/UserUsedConntroller/changeUsedState.easy?status='+state+'&id='+postId+'&easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				postState('off');
			},
			success:function(data){
				if(data.status == 'success'){
					postStateNum = state;
					switch(state){
						case 1:
							showHtml = '待成交';
							changeSelect('deter',showHtml);
						break;
						case 0:
							showHtml = '已成交';
							changeSelect('ready',showHtml);
						break;
						case -1:
							showHtml = '取消出讓';
							changeSelect('cancel',showHtml);
						break;
					}
					postState('on');
				}
			}
		});
	}
	function postState(clickState){
		if(clickState == 'on'){
			var sendPostState;
			//帖子的狀態選擇
			$('#second-state').on('click',function(){
				if($(this).find('ul').css('display') == 'block'){
					hide();
				}else{
					show();
				}
			});
			$('#second-state ul li').each(function(k){
				$(this).on('click',function(event){
					event.stopPropagation();
					if(k == 0){
						sendPostState = 1;
					}else if(k == 1){
						sendPostState = 0;
					}else if(k == 2){
						sendPostState = -1;
					}
					if(sendPostState != postStateNum) innerChange(sendPostState);
					hide();
				});
				$(this).on('mouseenter',function(){
					$(this).siblings('li').removeClass('select').end().addClass('select');
				});
				$(this).on('mouseleave',function(){
					$(this).removeClass('select');
				});
			});
			function show(){
				$('#second-state .state-bg').css('display','block');
				$('#second-state').find('ul').css('display','block');
				$('#second-state').find('.after-select-item').stop().slideDown(200);
			}
			function hide(){
				$('#second-state').find('.after-select-item').stop().slideUp(200,function(){
					$('#second-state').find('ul').css('display','none');
					$('#second-state .state-bg').css('display','none');
				});
			}
		}else{
			$('#second-state').off('click');
			$('#second-state ul li').each(function(){
				$(this).off('click');
			});
		}
	}
	function changeSelect(state,text){
		$('#second-state>div.after-select .state-icon img').attr('src','/src/img/userspace/secondhand/'+state+'.png');
		$('#second-state>div.after-select span').html(text);
		$('#second-state ul div.after-select .state-icon img').attr('src','/src/img/userspace/secondhand/'+state+'-after-select.png');
		$('#second-state ul div.after-select span').html(text);
		$('.atricle_title_second').html(text);
	}
}

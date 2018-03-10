var postId = easyBuy.global.pageParameter.id || 494;
easyBuy.global.startJs = function(){
	easyBuy.userSpaceGlobal.replyPostType = '7';
	easyBuy.userSpaceGlobal.replyVolunteersType = 'replyShiJi'; //回復貼子分類
	userStatus(); //帖子狀態
	// loadEditor();
}
//判斷是自己看還是他人看
function userStatus(){
	updateSeeLog(11);//所有帖子(点击量/查看量)
	if(easyBuy.global.isSelf){
		$('#other-mess-name').remove();
		$('.messBox_pic').remove();
		$('.messBox_logo').remove();
		$('#violation').remove();
		//刪除帖子
		myDeletePost({
			type : 'releaseFair',
			delUrl : 'http://userspace1.macaoeasybuy.com/UserFairsConntroller/deleteBatchUserFairs.easy'
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
	postContent();//帖子內容
	//輪播圖
	postBanner({
		dataUrl : 'http://userspace1.macaoeasybuy.com/UserFairsConntroller/queryFairInfoPics.easy',
		values : 'fairInfoPics'
	});
	queryTopicCount(7,'Fair');//评论查看赞好数统计
	isClickLove(9,9); //點讚
	responseCard(7);//回復查看讃好，數據
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
					box:$('#editor-box'),// 編輯框
					boxOuter:$('.userspace-content-inner'),// 編輯框的父元素
					referBox:$('.statistics'),// 編輯框的下一個兄弟元素
					fadeTime:150,// 淡入淡出時間
				});
			}else{
				restoreEditorBox($('#editor-box'));
			}
			if($(this)[0].flag){
				switch(k){
					case 1:
						//初次請求查看
						checkCard($(this),11);
					break;
					case 2:
						//初次請求讃好
						mygoodCard($(this),9);
					break;
				}
			}
		});
	});
}

//帖子內容
function postContent(){
	$.ajax({
		url:'http://userspace1.macaoeasybuy.com/UserFairsConntroller/queryFairsInfo.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var newData = data.userFairInfo;
			$('#messBox_mess_time .articleTime span').html(newData.addtime); //發佈時間
			$('#messBox_mess_time .articleType span').html(newData.classname); //類型
			$('#atricle_title span:first-of-type').html(newData.title); //標題
			changePostStatus(newData.isSelf,newData.inventory);//市集帖子狀態
			$('#whatsapp-num')[0].num = newData.whatsapp ? newData.whatsapp : '無';
			$('#wechat-num')[0].num = newData.wechat ? newData.wechat : '無';
			bigEmoji(newData.bigExpressionGroup);//大錶情
			myContent(newData.content);//內容
			$('#discount-number').html(newData.discount); //折扣
			$('#now-price-number span').html(newData.moneyNew);//現價
			$('#old-price-number span').html(newData.moneyold);//現價
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
	$.getJSON('http://userspace1.macaoeasybuy.com/UserFairsConntroller/queryPreFair.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		console.log(data);
		if(data.preFair){
			if(data.preFair.inventory == '0'){
				data.preFair.inventory = '沒有現貨，可提供代購哦！';
			}else{
				data.preFair.inventory = '有現貨，手快有手慢無哦！';
			}
			var html = template.render(handPostTemplate,data.preFair);
			$('.other-post-box.first').html(html);
			$('#'+data.preFair.id+'handPost').find('.handPost-content').html(data.preFair.content);
			$('#'+data.preFair.id+'handPost').find('.handPost-year').html(data.preFair.uptime.split(' ')[0]);
			$('#'+data.preFair.id+'handPost').find('.handPost-time').html(data.preFair.uptime.split(' ')[1]);
			$('#'+data.preFair.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.preFair.pictureurl){
				imgOnMiddle($('.other-post .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.first').remove();
			$('.other-post .other-post-box.first').remove();
		}
	});
	//下一篇
	$.getJSON('http://userspace1.macaoeasybuy.com/UserFairsConntroller/queryLastFair.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		if(data.lastFair){
			if(data.lastFair.inventory == '0'){
				data.lastFair.inventory = '沒有現貨，可提供代購哦！';
			}else{
				data.lastFair.inventory = '有現貨，手快有手慢無哦！';
			}
			var html = template.render(handPostTemplate,data.lastFair);
			$('.other-post-box.second').html(html);
			$('#'+data.lastFair.id+'handPost').find('.handPost-content').html(data.lastFair.content);
			$('#'+data.lastFair.id+'handPost').find('.handPost-year').html(data.lastFair.uptime.split(' ')[0]);
			$('#'+data.lastFair.id+'handPost').find('.handPost-time').html(data.lastFair.uptime.split(' ')[1]);
			$('#'+data.lastFair.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.lastFair.pictureurl){
				imgOnMiddle($('.other-post .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.second').remove();
			$('.other-post .other-post-box.second').remove();
		}
	});
}


//帖子的狀態選擇
function changePostStatus(isSelf,inventory){
	var showHtml = inventory == 1 ? '有現貨，手快有手慢無哦！' : '沒有現貨，可提供代購哦！';
	var postStateNum = inventory;
	changeSelect(showHtml);
	if(isSelf == 1) postState('on');
	function innerChange(state){
		var dataUrl = 'http://userspace1.macaoeasybuy.com/UserFairsConntroller/changeFairInventory.easy?id='+postId+'&state='+state+'&easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				postState('off');
			},
			success:function(data){
				if(data.status = 'success'){
					switch(state){
						case 0:
							showHtml = '沒有現貨，可提供代購哦！';
							inventory = 0;
						break;
						case 1:
							showHtml = '有現貨，手快有手慢無哦！';
							inventory = 1;
						break;
					}
					changeSelect(showHtml);
					postState('on');
				}
			}
		});
	}
	function postState(clickState){
		if(clickState == 'on'){
			var sendPostState;
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
					}
					if(sendPostState != inventory) innerChange(sendPostState);
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
				$(this).off('click')
			});
		}
	}
	function changeSelect(text){
		$('#second-state-show span').html(text);
		$('#second-state-change .after-select span').html(text);
		$('#atricle_title span.second').html(text);
	}
}

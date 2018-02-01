var postId = easyBuy.global.pageParameter.postid || 2141;
easyBuy.global.startJs = function(){
	easyBuy.userSpaceGlobal.replyPostType = '3';
	easyBuy.userSpaceGlobal.replyVolunteersType = 'replylog'; //回復貼子分類
	userStatus(); //帖子狀態
}
//判斷是自己看還是他人看
function userStatus(){
	updateSeeLog(7);//所有帖子(点击量/查看量)
	if(easyBuy.global.isSelf){
		$('#other-mess-name').remove();
		$('.messBox_pic').remove();
		$('.messBox_logo').remove();
		$('#violation').remove();
		//刪除帖子
		myDeletePost({
			type : 'releaselog',
			delUrl : 'http://userspace.macaoeasybuy.com/UserDiaryConntroller/deleteBatchRelease.easy'
		});
	}else{
		$('#delete-post').remove();
		$('#mine-mess-name').remove();
		$('#post-delete').remove();
		$('#second-state').remove();
		reportPost(); //舉報帖子
	}
	//編輯器
	$('#editor-box').load('/page/userspace/common/postDetailEditor.html',function(){
		editorFunc();
	});
	//輪播圖
	postContent();//帖子內容
	//輪播圖
	postBanner({
		dataUrl : 'http://userspace.macaoeasybuy.com/UserDiaryConntroller/queryReleasePics.easy',
		values : 'releaseInfoPics'
	});
	queryTopicCount(3,'release');//评论查看赞好数统计
	isClickLove(7,7); //點讚
	responseCard(3);//回復查看讃好，數據
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
						checkCard($(this),7);
					break;
					case 2:
						//初次請求讃好
						mygoodCard($(this),7);
					break;
				}
			}
		});
	});
}


//帖子內容
function postContent(){
	$.ajax({
		url:'http://userspace.macaoeasybuy.com/UserDiaryConntroller/queryUserReleaseInfo.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var newData = data.releaseInfo;
			$('#messBox_mess_time .articleTime span').html(newData.addtime); //發佈時間
			$('#messBox_mess_time .articleType span').html(newData.classname); //日誌類型
			$('#atricle_title').html(newData.titlename); //標題
			bigEmoji(newData.bigExpressionGroup);//大錶情
			myContent(newData.contents);//內容
			labelClass([newData.placeLabel,newData.brandLabel,newData.hotLabel]);//表情分類
			commodity(newData);//相關商品
			if(newData.shopList != undefined){
				otherMessShop(newData.shopList);//相關商店
			}else{
				$('#otherMess_shop').parent().remove();
			}
			if(newData.isSelf == 1){
				changePostStatus(newData.isSelf,newData.privaryshow);//日誌帖子狀態
			}else if(newData.isSelf == 0){
				userInfo(newData.username,newData.headPic,newData.sex); //用戶性別，頭像，姓名
			}
			//調用吸頂評論框
			boxTop({
				box:$('#editor-box'),
				boxOuter:$('.userspace-content-inner'),
				referBox:$('.statistics'),
				fadeTime:150
			});
		}
	});
}


//上下篇
function handPost(){
	var handPostTemplate = easyBuy.global.template['handPost'];
	//上一篇
	$.getJSON('http://userspace.macaoeasybuy.com/UserDiaryConntroller/queryPreRelease.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		if(data.preRelease){
			var html = template.render(handPostTemplate,data.preRelease);
			$('.other-post-box.first').html(html);
			$('#'+data.preRelease.id+'handPost').find('.handPost-content').html(data.preRelease.contents);
			$('#'+data.preRelease.id+'handPost').find('.handPost-year').html(data.preRelease.addtime.split(' ')[0]);
			$('#'+data.preRelease.id+'handPost').find('.handPost-time').html(data.preRelease.addtime.split(' ')[1]);
			$('#'+data.preRelease.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.preRelease.pictureurl){
				imgOnMiddle($('.other-post .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.first').remove();
			$('.other-post .other-post-box.first').remove();
		}
	});
	//下一篇
	$.getJSON('http://userspace.macaoeasybuy.com/UserDiaryConntroller/queryLastRelease.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		if(data.lastRelease){
			var html = template.render(handPostTemplate,data.lastRelease);
			$('.other-post-box.second').html(html);
			$('#'+data.lastRelease.id+'handPost').find('.handPost-content').html(data.lastRelease.contents);
			$('#'+data.lastRelease.id+'handPost').find('.handPost-year').html(data.lastRelease.addtime.split(' ')[0]);
			$('#'+data.lastRelease.id+'handPost').find('.handPost-time').html(data.lastRelease.addtime.split(' ')[1]);
			$('#'+data.lastRelease.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.lastRelease.pictureurl){
				imgOnMiddle($('.other-post .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.second').remove();
			$('.other-post .other-post-box.second').remove();
		}
	});
}



//日誌帖子改狀態
function changePostStatus(isSelf,postStateNum){
	var postStateNum = postStateNum;
	var showHtml = postStateNum == 1 ? '所有人可見' : '僅好友可見';
	changeSelect(showHtml);
	if(isSelf == 1) postState('on');
	function innerChange(state){
		//改狀態
		var dataUrl = 'http://userspace.macaoeasybuy.com/UserDiaryConntroller/changeStatus.easy?id='+postId+'&state='+state+'&easybuyCallback=?';
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
					switch(state){
						case 0:
							showHtml = '僅好友可見';
						break;
						case 1:
							showHtml = '所有人可見';
						break;
					}
					changeSelect(showHtml);
					postStateNum = state;
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
	function changeSelect(text){
		$('#second-state-show span').html(text);
		$('#second-state-change .after-select span').html(text);
	}
}

var postId = easyBuy.global.pageParameter.postId || 500;
easyBuy.global.startJs = function(){
	easyBuy.userSpaceGlobal.replyPostType = '1';
	easyBuy.userSpaceGlobal.replyVolunteersType = 'replySuitableLife'; //回復貼子分類
	userStatus(); //帖子狀態
}
//判斷是自己看還是他人看
function userStatus(){
	updateSeeLog(6);//所有帖子(点击量/查看量)
	if(easyBuy.global.isSelf){
		$('#other-mess-name').remove();
		$('.messBox_pic').remove();
		$('.messBox_logo').remove();
		$('#violation').remove();
		 //刪除帖子
		myDeletePost({
			type : 'releaseSuitableLife',
			delUrl : 'http://userspace1.macaoeasybuy.com/UserSuitableLifeConntroller/deleteBatchUserSuitableLife.easy'
		});
	}else{
		$('#delete-post').remove();
		$('#mine-mess-name').remove();
		$('#post-delete').remove();
		reportPost(); //舉報帖子
	}
	//編輯器
	$('#editor-box').load('/public/postDetailEditor.html',function(){
		editorFunc();
	});
	postContent();//帖子內容
	//輪播圖
	postBanner({
		dataUrl : 'http://userspace1.macaoeasybuy.com/UserSuitableLifeConntroller/querySuitableLifeInfoPics.easy',
		values : 'suitableLifeInfoPics',
		id: postId
	});
	queryTopicCount(1,'suitablelife');//评论查看赞好数统计
	isClickLove(4,4); //點讚
	responseCard(1);//回復查看讃好，數據
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
						checkCard($(this),6);
					break;
					case 2:
						//初次請求讃好
						mygoodCard($(this),4);
					break;
				}
			}
		});
	});
}

//帖子內容
function postContent(){
	$.ajax({
		url:'http://userspace1.macaoeasybuy.com/UserSuitableLifeConntroller/queryUserSuitableLifeInfo.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var newData = data.suitableLifeInfo;
			$('#messBox_mess_time .articleTime span').html(newData.uptime); //發佈時間
			$('#messBox_mess_time .articleType span').html(newData.typename); //發佈時間
			$('#atricle_title').html(newData.titlename); //標題
			bigEmoji(newData.bigExpressionGroup);//大錶情
			myContent(newData.lifecontent);//內容
			labelClass([newData.placeLabel,newData.brandLabel,newData.hotLabel]);//表情分類
			commodity(newData);//相關商品
			if(newData.shopList != undefined){
				otherMessShop(newData.shopList);//相關商店
			}else{
				$('#otherMess_shop').parent().remove();
			}
			if(newData.isSelf == 0){
				userInfo(newData.username,newData.headPic,newData.sex); //用戶性別，頭像，姓名
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
	$.getJSON('http://userspace1.macaoeasybuy.com/UserSuitableLifeConntroller/queryPreSuitableLife.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		if(data.preSuitableLife){
			var html = template.render(handPostTemplate,data.preSuitableLife);
			$('.other-post-box.first').html(html);
			$('#'+data.preSuitableLife.id+'handPost').find('.handPost-content').html(data.preSuitableLife.lifecontent);
			$('#'+data.preSuitableLife.id+'handPost').find('.handPost-year').html(data.preSuitableLife.addtime.split(' ')[0]);
			$('#'+data.preSuitableLife.id+'handPost').find('.handPost-time').html(data.preSuitableLife.addtime.split(' ')[1]);
			$('#'+data.preSuitableLife.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.preSuitableLife.pictureurl){
				imgOnMiddle($('.other-post .first .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.first').remove();
			$('.other-post .other-post-box.first').remove();
		}
	});
	//下一篇
	$.getJSON('http://userspace1.macaoeasybuy.com/UserSuitableLifeConntroller/queryLastSuitableLife.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		if(data.lastSuitableLife){
			var html = template.render(handPostTemplate,data.lastSuitableLife);
			$('.other-post-box.second').html(html);
			$('#'+data.lastSuitableLife.id+'handPost').find('.handPost-content').html(data.lastSuitableLife.lifecontent);
			$('#'+data.lastSuitableLife.id+'handPost').find('.handPost-year').html(data.lastSuitableLife.addtime.split(' ')[0]);
			$('#'+data.lastSuitableLife.id+'handPost').find('.handPost-time').html(data.lastSuitableLife.addtime.split(' ')[1]);
			$('#'+data.lastSuitableLife.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.lastSuitableLife.pictureurl){
				imgOnMiddle($('.other-post .second .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.second').remove();
			$('.other-post .other-post-box.second').remove();
		}
	});
}

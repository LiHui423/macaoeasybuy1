var postId = easyBuy.global.pageParameter.postid || 24;
easyBuy.global.startJs = function(){
	easyBuy.userSpaceGlobal.replyPostType = '5';
	easyBuy.userSpaceGlobal.replyVolunteersType = 'replySentVolunteers'; //敗家志回復貼子分類
	userStatus(); //帖子狀態
}


//判斷是自己看還是他人看
function userStatus(){
	updateSeeLog(3);//所有帖子(点击量/查看量)
	if(easyBuy.global.isSelf){
		$('#other-mess-name').remove();
		$('.messBox_pic').remove();
		$('.messBox_logo').remove();
		$('#violation').remove();
		 //刪除帖子
		myDeletePost({
			type : 'releaseSentVolunteers',
			delUrl : 'http://userspace.macaoeasybuy.com/UserLiveShotConntroller/deleteBetchUserSentVolunteers.easy'
		});
	}else{
		$('#mine-mess-name').remove();
		$('#delete-post').remove();
		$('#post-delete').remove();
		reportPost(); //舉報帖子
	}
	//編輯器
	$('#editor-box').load('/page/userspace/common/postDetailEditor.html',function(){
		editorFunc();
	});
	postContent();//帖子內容
	
	//輪播圖
	postBanner({
		dataUrl : 'http://userspace.macaoeasybuy.com/UserLiveShotConntroller/querySentVolunteersInfoPics.easy',
		values : 'sentVolunteersInfoPics'
	});
	queryTopicCount(5,'SentVolunteers');//评论查看赞好数统计
	isClickLove(3,3); //點讚
	responseCard(5);//回復查看讃好，數據
	handPost();//上下篇
}

//帖子內容
function postContent(){
	$.ajax({
		url:'http://userspace.macaoeasybuy.com/UserLiveShotConntroller/querySentVolunteersInfo.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var newData = data.suitableLifeInfo;
			$('#messBox_mess_time span').html(newData.addtime); //發佈時間
			$('#atricle_title').html(newData.titlename); //標題
			bigEmoji(newData.bigExpressionGroup);//大錶情
			myContent(newData.purchasedfrom);//內容
			labelClass([newData.placeLabel,newData.brandLabel,newData.hotLabel]);//表情分類
			commodity(newData);//相關商品
			if(newData.shopList != undefined){
				otherMessShop(newData.shopList);//相關商店
			}else{
				$('#otherMess_shop').parent().remove();
			}
			if(newData.isSelf == 0){ //看他人
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
						checkCard($(this),3);
					break;
					case 2:
						//初次請求讃好
						mygoodCard($(this),3);
					break;
				}
			}
		});
	});
}
//上下篇
function handPost(){
	var handPostTemplate = easyBuy.global.template['handPost'];
	//上一篇
	$.getJSON('http://userspace.macaoeasybuy.com/UserLiveShotConntroller/queryPreSentVolunteers.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		if(data.preSentVolunteers){
			var html = template.render(handPostTemplate,data.preSentVolunteers);
			$('.other-post-box.first').html(html);
			$('#'+data.preSentVolunteers.id+'handPost').find('.handPost-content').html(data.preSentVolunteers.purchasedfrom);
			$('#'+data.preSentVolunteers.id+'handPost').find('.handPost-year').html(data.preSentVolunteers.addtime.split(' ')[0]);
			$('#'+data.preSentVolunteers.id+'handPost').find('.handPost-time').html(data.preSentVolunteers.addtime.split(' ')[1]);
			$('#'+data.preSentVolunteers.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.preSentVolunteers.pictureurl){
				imgOnMiddle($('.other-post .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.first').remove();
			$('.other-post .other-post-box.first').remove();
		}
	});
	//下一篇
	$.getJSON('http://userspace.macaoeasybuy.com/UserLiveShotConntroller/queryLastSentVolunteers.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',function(data){
		if(data.lastSentVolunteers){
			var html = template.render(handPostTemplate,data.lastSentVolunteers);
			$('.other-post-box.second').html(html);
			$('#'+data.lastSentVolunteers.id+'handPost').find('.handPost-content').html(data.lastSentVolunteers.purchasedfrom);
			$('#'+data.lastSentVolunteers.id+'handPost').find('.handPost-year').html(data.lastSentVolunteers.addtime.split(' ')[0]);
			$('#'+data.lastSentVolunteers.id+'handPost').find('.handPost-time').html(data.lastSentVolunteers.addtime.split(' ')[1]);
			$('#'+data.lastSentVolunteers.id+'handPost').find('.handPost-content a').each(function(){
				$(this).before(' '+$(this).html()+' ');
				$(this).remove();
			});
			if(data.lastSentVolunteers.pictureurl){
				imgOnMiddle($('.other-post .page-items .page-items-list .items-img')); //圖片居中
			}
		}else{
			$('.other-post .other-post-title.second').remove();
			$('.other-post .other-post-box.second').remove();
		}
	});
}
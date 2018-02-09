easyBuy.global.beforeDataJs = function(){
	queryTopicCount(7,'Fair'); //评论查看赞好数统计
	responseCard(7); //回復查看讃好，數據
	//輪播圖
	postBanner({
		dataUrl : 'http://userspace1.macaoeasybuy.com/UserFairsConntroller/queryFairInfoPics.easy',
		values : 'fairInfoPics'
	});
	mineOtherReq(); //帖主還有其他帖子
	allLookReq(); //他們都在看其他帖子
	clickEvent();//页面点击事件
}
easyBuy.global.afterDataJs = function(){
	if(easyBuy.isLogin){
		updateSeeLog(11); //查看用戶統計
	}
	postContent(); //帖子內容
	isClickLove(9,9); //查看用戶是否點讚
	//判斷登錄引入編輯框
	loadEditor(function(){
		$('#whatsapp-num').html($('#whatsapp-num')[0].num);
		$('#wechat-num').html($('#wechat-num')[0].num);
	});
	reportPost(); //舉報
}
easyBuy.social.isSocialPost = true;
easyBuy.userSpaceGlobal.replyPostType = '7';
easyBuy.userSpaceGlobal.replyVolunteersType = 'replyShiJi'; //回復貼子分類
var waterfall = easyBuy.global.dep.waterfall;
var mygoodbanner = easyBuy.global.dep.mygoodbanner;
var arrayGetMax = easyBuy.global.dep.arrayGetMax;
var imgOnMiddle = easyBuy.global.dep.imgOnMiddle;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var postId = easyBuy.global.pageParameter.id;
//var postId = 494;
var checkFinsh = {
	banner : false,
	editor : false,
	content : false,
	firstReply : false,
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
			rightScrollTop();
		});
	});
}

postContent();
//帖子內容
function postContent(){
	$.ajax({
		//url:'http://userspace1.macaoeasybuy.com/UserFairsConntroller/queryFairsInfo.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',
		url:'http://userspace1.macaoeasybuy.com/UserFairsConntroller/queryFairsInfo.easy?userId=5&seeUserId=6&id='+postId+'&easybuyCallback=?',
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var newData = data.userFairInfo;
			$('#messBox_mess_time p.articleType span').html(newData.classname); //帖子類型
			$('#messBox_mess_time p:last-of-type span').html(newData.addtime); //發佈時間

			$('#whatsapp-num')[0].num = newData.whatsapp ? newData.whatsapp : '無';
			$('#wechat-num')[0].num = newData.wechat ? newData.wechat : '無';
			$('#discount-number').html(newData.discount); //折扣
			$('#now-price-number span').html(newData.moneyNew);//現價
			$('#old-price-number span').html(newData.moneyold);//現價

			$('#atricle_title').html(newData.title); //標題
			bigEmoji(newData.bigExpressionGroup);//大錶情
			myContent(newData.content);//內容
			userInfo(newData.username,newData.headPic,newData.sex); //用戶性別，頭像，姓名
			//吸頂檢測
			checkFinsh.content = true;
			checkAndGoScrollTop();
		}
	});
}
//帖主還有其他帖子
function mineOtherReq(){
	var page = 0;
	var size = 15;
	var isComplete = false;
	var postTemplate = easyBuy.global.template['post-template'];
	var box = $('#masonry .mine_main_inner');
	reqFunc();
	function reqFunc(){
		var dataUrl = 'http://social1.macaoeasybuy.com/FairDetailController/queryPeopleAllFairDetailInfo.easy?postId='+postId+'&page='+page+'&size='+size+'&easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				easyScrollRequest('off','mineOtherPost',$('#masonry-box'));
				if(isComplete) return false;
			},
			success:function(data){
				data.type = 'mine';
				data.page = page;
				if(page == 0) $('#mine-other-post .poster-number').html(data.result.count);
				$.each(data.result.returnList, function(k,y) {
					y.loveNumber = formatNum(y.loveNumber);
					y.seeNumber = formatNum(y.seeNumber);
					y.moneyNew = formatNum(y.moneyNew);
					y.content = y.content.replace(/src="/g,'src="'+easyBuy.global.osURL+'"');
				});
				var html = template.render(postTemplate,data);
				box.append(html);
				waterfall($('#masonry'),$('#masonry .pillar-all'),6,4,0,true);
				page++;
				if(data.result.returnList.length == size){
					easyScrollRequest('off','mineOtherPost',$('#masonry-box'),box,function(){
						reqFunc();
					});
				}else{
					easyScrollRequest('off','mineOtherPost',$('#masonry-box'));
					isComplete = true;
					if(data.result.returnList.length != 0 || page !=1) $('#masonry .no-more').css('display','block');
				}
			}
		});
	}
}
//他們都在看其他帖子
function allLookReq(){
	var page = 0;
	var size = 20;
	var isComplete = false;
	var postTemplate = easyBuy.global.template['post-template'];
	var box = $('#all-look-post-inner .all_main_container_inner');
	reqFunc();
	function reqFunc(){
		var dataUrl = 'http://social1.macaoeasybuy.com/FairDetailController/queryYiFansSeeDetailInfo.easy?postId='+postId+'&page='+page+'&size='+size+'&easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				easyScrollRequest('off','allLookPost',$('#all-look-post-inner-box'));
				if(isComplete) return false;
			},
			success:function(data){
				var data = {result : {returnList : data.result}}; //修改數據格式
				console.log(data);
				data.type = 'other';
				data.page = page;
				$.each(data.result.returnList, function(k,y) {
					y.loveNumber = formatNum(y.loveNumber);
					y.seeNumber = formatNum(y.seeNumber);
					y.moneyNew = formatNum(y.moneyNew);
					y.content = y.content.replace(/src="/g,'src="'+easyBuy.global.osURL+'"');
				});
				var html = template.render(postTemplate,data);
				box.append(html);
				waterfall($('#all-look-post-inner'),$('#all-look-post-inner .pillar-all'),6,4,0,true);
				page++;
				if(data.result.returnList.length == size){
					easyScrollRequest('on','allLookPost',$('#all-look-post-inner-box'),box,function(){
						reqFunc();
					});
				}else{
					easyScrollRequest('off','allLookPost',$('#all-look-post-inner-box'));
					isComplete = true;
					if(data.result.returnList.length != 0 || page !=1) $('#all-look-post-inner .no-more').css('display','block');
				}
			}
		});
	}
}
// 頁面點擊事件
function clickEvent(){
	$('body').on('click',function(e){
		var target=e.target;
		if($(target).hasClass('pillar-shadow')){
			console.log('true');
			var postId=$(target).parents('.pillar-all').attr('id').split('-')[0];
			console.log(postId);
			window.location.href="http://social.macaoeasybuy.com/market/treasureclassifydetail/fairpostdetail/fairpostdetail.html?id="+postId;
		}
	})
}

easyBuy.global.beforeDataJs = function(){
	queryTopicCount(1,'suitablelife'); //评论查看赞好数统计
	responseCard(1); //回復查看讃好，數據
	//輪播圖
	postBanner({
		dataUrl : 'http://userspace1.macaoeasybuy.com/UserSuitableLifeConntroller/querySuitableLifeInfoPics.easy',
		values : 'suitableLifeInfoPics'
	});
	mineOtherReq(); //帖主還有其他帖子
	allLookReq(); //他們都在看其他帖子
}
easyBuy.global.afterDataJs = function(){
	if(easyBuy.isLogin){
		updateSeeLog(6); //查看用戶統計
	}
	postContent(); //帖子內容
	isClickLove(4,4); //查看用戶是否點讚
	loadEditor(); ;//判斷登錄引入編輯框
	selectPage()//選項卡
	reportPost(); //舉報
}
easyBuy.social.isSocialPost = true;
easyBuy.userSpaceGlobal.replyPostType = '1';
easyBuy.userSpaceGlobal.replyVolunteersType = 'replySuitableLife'; //回復貼子分類
var waterfall = easyBuy.global.dep.waterfall;
var mygoodbanner = easyBuy.global.dep.mygoodbanner;
var arrayGetMax = easyBuy.global.dep.arrayGetMax;
var imgOnMiddle = easyBuy.global.dep.imgOnMiddle;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
//var postId = easyBuy.global.pageParameter.id;
//var postId = 644;
var postId=location.href.split('=')[1];
console.log(postId);
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
						checkCard($(this),6);
					break;
					case 2:
						//初次請求讃好
						mygoodCard($(this),4);
					break;
				}
			}
			rightScrollTop();
		});
	});
}

//帖子內容
function postContent(){
	var userId=5;
	var seeUserId=30;
	var id=3;
	$.ajax({
		url:'http://userspace1.macaoeasybuy.com/UserSuitableLifeConntroller/queryUserSuitableLifeInfo.easy?userId='+userId+'&seeUserId='+seeUserId+'&id='+postId+'&easybuyCallback=?',
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			console.log('發出內容的請求')
		},
		success:function(data){
			console.log(data);
			var newData = data.suitableLifeInfo;
			$('#messBox_mess_time p.articleType span').html(newData.typename); //帖子類型
			$('#messBox_mess_time p:last-of-type span').html(newData.addtime); //發佈時間
			$('#atricle_title').html(newData.titlename); //標題
			bigEmoji(newData.bigExpressionGroup);//大錶情
			myContent(newData.lifecontent);//內容
			labelClass([newData.placeLabel,newData.brandLabel,newData.hotLabel]);//標籤分類
			commodity(newData);//相關商品
			if(newData.shopList != undefined){
				otherMessShop(newData.shopList);//相關商店
			}else{
				$('#otherMess_shop').parent().remove();
			}
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
		var dataUrl = 'http://social1.macaoeasybuy.com/suitableLifeDetailController/queryAllPeopleSuitableLife.easy?postId='+postId+'&page='+page+'&size='+size+'&easybuyCallback=?';
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
				console.log(data);
				data.type = 'mine';
				data.page = page;
				if(page == 0) $('#mine-other-post .poster-number').html(data.result.count);
				$.each(data.result.returnList, function(k,y) {
					
					y.seeNumbers = formatNum(y.seeNumbers);
					y.loveNumber = formatNum(y.loveNumber);
					y.commentCount = formatNum(y.commentCount);
					y.lifecontent = y.lifecontent.replace(/src="/g,'src="'+easyBuy.global.osURL+'"');
				});
				var html = template('post-template',data);
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
		var dataUrl = 'http://social1.macaoeasybuy.com/suitableLifeDetailController/queryYiFansSeeSuiTablelifeInfo.easy?postId='+postId+'&page='+page+'&size='+size+'&easybuyCallback=?';
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
				data.type = 'other';
				data.page = page;
				$.each(data.result.returnList, function(k,y) {
					y.seeNumbers = formatNum(y.seeNumbers);
					y.loveNumber = formatNum(y.loveNumber);
					y.commentCount = formatNum(y.commentCount);
					y.lifecontent = y.lifecontent.replace(/src="/g,'src="'+easyBuy.global.osURL+'"');
				});
				var html = template('post-template',data);
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
				// 宜粉們都在看的點擊事件
				$(document).on('click',function(e){
					var target=e.target;
					if($(target).attr('class')==="shadow-box"){
						var postId=$(target).parents('.pillar-all').attr('id').split('-')[0];
						window.open('http://social.macaoeasybuy.com/easylive/easylivelifecircle/lifecirclepostdetail/lifecirclepostdetail.html?id='+postId);
					}
				})
			}
		});
	}
}

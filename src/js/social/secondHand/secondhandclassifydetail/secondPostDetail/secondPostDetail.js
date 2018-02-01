easyBuy.global.beforeDataJs = function(){
	queryTopicCount(4,'Used'); //评论查看赞好数统计
	responseCard(4); //回復查看讃好，數據
	//輪播圖
	postBanner({
		dataUrl : 'http://userspace1.macaoeasybuy.com/UserUsedConntroller/queryUsedInfoPics.easy',
		values : 'usedInfoPics'
	});
	mineOtherReq(); //帖主還有其他帖子
	allLookReq(); //他們都在看其他帖子
}
easyBuy.global.afterDataJs = function(){
	if(easyBuy.isLogin){
		updateSeeLog(4); //查看用戶統計
	}
	postContent(); //帖子內容
	isClickLove(2,2); //查看用戶是否點讚
	//判斷登錄引入編輯框
	loadEditor(function(){
		$('#whatsapp-num').html($('#whatsapp-num')[0].num);
		$('#wechat-num').html($('#wechat-num')[0].num);
	});
	reportPost(); //舉報
}
easyBuy.social.isSocialPost = true;
easyBuy.userSpaceGlobal.replyPostType = '4';
easyBuy.userSpaceGlobal.replyVolunteersType = 'replyUsed'; //回復貼子分類
var waterfall = easyBuy.global.dep.waterfall;
var mygoodbanner = easyBuy.global.dep.mygoodbanner;
var arrayGetMax = easyBuy.global.dep.arrayGetMax;
var imgOnMiddle = easyBuy.global.dep.imgOnMiddle;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
//var postId = easyBuy.global.pageParameter.id;
var postId = 428;
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
						checkCard($(this),4);
					break;
					case 2:
						//初次請求讃好
						mygoodCard($(this),2);
					break;
				}
			}
			rightScrollTop();
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
			$('#messBox_mess_time p.articleType span').html(newData.typename); //帖子類型
			$('#messBox_mess_time p:last-of-type span').html(newData.addtime); //發佈時間

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

			$('#atricle_title').html(newData.titlename); //標題
			myContent(newData.usedcontent);//內容
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
		var dataUrl = 'http://social1.macaoeasybuy.com/usedDetailController/queryPeopleAllUsedlist.easy?postId='+postId+'&page='+page+'&size='+size+'&easybuyCallback=?';
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
					y.seeNumber = formatNum(y.seeNumber);
					y.loveNumber = formatNum(y.loveNumber);
					y.commentCount = formatNum(y.commentCount);
					y.usedcontent = y.usedcontent.replace(/src="/g,'src="'+easyBuy.global.osURL+'"');
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
		var dataUrl = 'http://social1.macaoeasybuy.com/usedDetailController/queryYiFansSeeUsedlist.easy?postId='+postId+'&page='+page+'&size='+size+'&easybuyCallback=?';
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
				var data = {result : {returnList : data.returnList}}; //修改數據格式
				console.log(data);
				data.type = 'other';
				data.page = page;
				$.each(data.result.returnList, function(k,y) {
					y.seeNumber = formatNum(y.seeNumber);
					y.loveNumber = formatNum(y.loveNumber);
					y.commentCount = formatNum(y.commentCount);
					y.usedcontent = y.usedcontent.replace(/src="/g,'src="'+easyBuy.global.osURL+'"');
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

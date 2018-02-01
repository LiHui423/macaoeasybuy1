easyBuy.global.beforeDataJs = function(){
	getContent(); //獲取內容
	queryTopicCount(); //评论查看赞好数统计
	responseCard(); //評論回復
	easyBuyFansSeeing(); //宜粉們都在看
	//吸頂評論框
	boxTop({
		box:$('#what_say'),
		boxOuter:$('.post-right'),
		referBox:$('.post-left')
	});
}
easyBuy.global.afterDataJs = function(){
	if(easyBuy.isLogin){
		updateSeeLog(); //查看用戶統計
	}
	isClickLove(); //讃好按鈕
	loadEditor(); //引入編輯器
}
var mygoodbanner = easyBuy.global.dep.mygoodbanner;
var getRequestURL = easyBuy.global.dep.getRequestURL;
var formatNum = easyBuy.global.dep.formatNum;
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var postId = location.href.split('?')[1].split('=')[1]; //話題帖子的Id
console.log(postId);
//var postId;
easyBuy.userSpaceGlobal.replyPostType = '2';
easyBuy.userSpaceGlobal.replyVolunteersType = 'replyMess'; //話題回復貼子分類
//宜粉們都在看
function  easyBuyFansSeeing(num){
	var page = 0;
	var size = 6;
	var isComplete = false;
	var listTemplate = easyBuy.global.template['bottom_list'];
	var box = $('.post-list-content');
	reqFunc();
	function reqFunc(){
		var dataUrl = 'http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryEasyBuyFansSeeing.easy';
		dataUrl = getRequestURL({
			targetURL : dataUrl,
			requestData : {
				id : postId,
				page : page,
				size : size,
				number : easyBuy.social.postListSeeNum || 0
			},
			encryptData : false
		});
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			cache:true,
			dataType:'jsonp',
			beforeSend:function(){
				easyScrollRequest('off','easyBuyFansSee',$(window));
				if(isComplete) return false;
			},
			success:function(data){
				data.page = page;
				console.log(data);
				var len = data.result.length;
				var html = template.render(listTemplate,data);
				page == 0 ? box.html(html) : box.append(html);
				page++;
				if(len == size){
					easyScrollRequest('on','easyBuyFansSee',$(window),$(document),function(){
						reqFunc();
					});
				}else{
					easyScrollRequest('off','easyBuyFansSee',$(window));
					isComplete = true;
					if(page != 0 || len != 0) box.siblings('.no_more').css('display','block');
				}
			}
		});
	}
}
//獲取內容
function getContent(){
	var dataUrl = 'http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryEasyBuyDetail.easy';
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			id : postId
		},
		encryptData : false
	});
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		cache:true,
		dataType:'jsonp',
		success:function(data){
			console.log(data);
			data = data.result;
			//官方小編
			var posterBox = $('#poster');
			posterBox.find('.poster_name').html(data.adminName); //小編 姓名
			posterBox.find('.head-img').html('<img src="'+easyBuy.global.osURL+data.adminPic+'" onerror="this.onerror=null;this.src=\'/img/common/loading_pc_headPic.png\'">');
			posterBox.find('.poster_hot_number').html(formatNum(data.shouldBuyCount)); //話題數
			posterBox.find('.poster_welcome_number').html(formatNum(data.adminLoveCount)); //受歡迎數
			//帖子
			var postHead = $('#post_title');
			postHead.find('.big_title').html(data.title); //帖子標題
			postHead.find('.post_title_class').html(data.className); //帖子類型
			postHead.find('.post_uptime').html(data.uptime); //帖子發佈時間
			//內容
			$('#content_article').html(data.content);
			//帖子讃好數
			$('#post_loveNumber').html(formatNum(data.loveCount));
			//吸頂評論框
			positionBox($('#what_say'),$('.post-left'));
		}
	});
}

//评论查看赞好数统计
function queryTopicCount(){
	$.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/queryTopicCount.easy?type=2&id='+postId+'&topicType=shouldbuy&easybuyCallback=?',function(data){
		console.log(data);
		var formatNum = easyBuy.global.dep.formatNum;
		$('#statistics-title li:first-of-type .statistics-bubble div:first-of-type')[0].dataNum = data.topicCount.commentNum;
		$('#statistics-title li:nth-of-type(2) .statistics-bubble div:first-of-type')[0].dataNum = data.topicCount.seeNums;
		$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum = data.topicCount.loveNums;
		$('#statistics-title li:first-of-type .statistics-bubble div:first-of-type').html(formatNum(data.topicCount.commentNum)); //評論總數
		$('#statistics-title li:nth-of-type(2) .statistics-bubble div:first-of-type').html(formatNum(data.topicCount.seeNums)); //查看總數
		$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum(data.topicCount.loveNums)); //點讚總數
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
			if($(this)[0].flag){
				switch(k){
					case 1:
						//初次請求查看
						checkCard($(this));
					break;
					case 2:
						//初次請求讃好
						mygoodCard($(this));
					break;
				}
			}
			positionBox($('#what_say'),$('.post-left'));
		});
	});
}
//最近讃好宜粉
function mygoodCard(objBtn){
	var postType = 5;
	var page = 0;
	var size = 16;
	var goodTemplate = easyBuy.global.template['good'];
	firstBlood(page,size);
	function firstBlood(page,size){
		$.ajax({
			url:'http://userspace1.macaoeasybuy.com/loveController/queryLoveFriends.easy?id='+postId+'&type='+postType+'&size='+size+'&page='+page+'&order=uptime&descOrAsc=desc&easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				$('.person-good .click-upload-more span').off('click');
			},
			success:function(data){
				var len = data.loveList.length;
				var delIdx = -1;
				$.each(data.loveList,function(k,y){
					if($('#good-list').find('#'+y.id+'good-id').length == 1) delIdx = k;
				});
				if(delIdx != -1){
					data.loveList.splice(delIdx,1);
				}

				var html = template.render(goodTemplate,data);
				$('#good-list').append(html);
				if(page==0){
					objBtn[0].flag = false;
				}
				if(len == 0 && page == 0){
					$('#good-list .no-more-good').css('display','block');
				}else{
					$('#good-list .no-more-good').css('display','none');
				}
				page++;
				if(len == size){
					$('.person-good .click-upload-more span').on('click',function(){
						firstBlood(page,size);
					});
				}else{
					$('.person-good .click-upload-more').remove();
					$('#good-list').siblings('.no-more').css('display','block');
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].isComplete = true;
				}
				if(len == 0){
					$('#good-list').siblings('.no-more').css('display','none');
				}
				positionBox($('#what_say'),$('.post-left'));//吸頂評論框
			}
		});
	}
}
//最近查看宜粉
function checkCard(objBtn){
	var postType = 5;
	var page = 0;
	var size = 20;
	var checkTemplate = easyBuy.global.template['check'];
	firstBlood(page,size);
	function firstBlood(page,size){
		$.ajax({
			url:'http://userspace1.macaoeasybuy.com/seeController/querySeeFriends.easy?id='+postId+'&type='+postType+'&size='+size+'&page='+page+'&order=uptime&descOrAsc=desc&easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				$('.person-check .click-upload-more span').off('click');
			},
			success:function(data){
				var html = template.render(checkTemplate,data.topicSee);
				if(page == 0){
					var tourists = '<li class="tourists"><div class="respondBox_fandPic"><div>'+data.topicSee.touristcount+'</div><div>遊客</div></div><div class="respondBox_fansMess clearfloat"><div></div><div></div></div></li>';
					$('#check-list').html(tourists);
					objBtn[0].flag = false;
				}
				$('.tourists').before(html);
				page++;
				if(data.topicSee.userList.length == size){
					$('.person-check .click-upload-more span').on('click',function(){
						firstBlood(page,size);
					});
				}else{
					$('.person-check .click-upload-more span').off('click');
					$('.person-check .click-upload-more').remove();
					$('.person-check .no-more').css('display','block');
				}
				positionBox($('#what_say'),$('.post-left'));//吸頂評論框
			}
		});
	}
}

//初次請求評論列表
function responseCard(){
	var page = 0;
	var size = 8;
	var postType = 2;
	$('.statistics .statistics-title li').eq(0)[0].isComplete = false;
	var responseTemplate = easyBuy.global.template['response'];
	firstBlood(page,size);
	function firstBlood(page,size){
		$.ajax({
			url:'http://userspace1.macaoeasybuy.com/topicReplyController/getReplyList.easy?id='+postId+'&type='+postType+'&size='+size+'&page='+page+'&order=uptime&descOrAsc=desc&easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				$('.person-messaage .click-upload-more span').off('click');
			},
			success:function(data){
				data.replyList.page = page;
				var html = template.render(responseTemplate,data.replyList);
				$('#response-list').append(html);
				if(data.replyList.replyList.length == 0 && page == 0){
					$('.person-messaage .no-more').remove();
					$('.person-messaage .no-more-good .no-btn').on('click',function(){
						if(easyBuy.isLogin){
							editor.obj.focus();
						}else{
							alert('跳去登錄註冊頁面');
						}
					});
				}
				for(var i=0;i<data.replyList.replyList.length;i++){
					$('#'+data.replyList.replyList[i].id+'response').find('.person-info-contain .person-info-text').html(data.replyList.replyList[i].replycontent);
					$('#'+data.replyList.replyList[i].id+'response .person-info-contain .person-info-text').find('a').each(function(){
						if(/at/.test($(this).attr('id'))){
							$(this).addClass('at');
						}else{
							$(this).addClass('myLabel');
						}
					});
					if(data.replyList.replyList[i].reply){
						$('#'+data.replyList.replyList[i].id+'response').find('.person-info-record .person-info-text').html(data.replyList.replyList[i].reply.replycontent);
						$('#'+data.replyList.replyList[i].id+'response .person-info-record .person-info-text').find('a').each(function(){
							if(/at/.test($(this).attr('id'))){
								$(this).addClass('at');
							}else{
								$(this).addClass('myLabel');
							}
						});
					}
					if($('#'+data.replyList.replyList[i].id+'response').find('.person-info-revert').length != 0){
						$('#'+data.replyList.replyList[i].id+'response').find('.person-info-revert')[0].data = {
							id:data.replyList.replyList[i].id,
							name:data.replyList.replyList[i].name,
							userId:data.replyList.replyList[i].userid
						}
					}
					$('#'+data.replyList.replyList[i].id+'response').find('.person-info-revert').on('click',function(){
						if(easyBuy.isLogin){
							editor.obj.html('');
							editor.obj.focus();
							editor.setRange();
							editor.obj.blur();
							editor.insertBlock('回復 '+$(this)[0].data.name+'：','replyUserTips1314','#f00');
							$('.replyUserTips1314')[0].id = $(this)[0].data.id;
							$('.replyUserTips1314')[0].userId = $(this)[0].data.userId;
						}else{
							alert('去登錄');
						}
					});
				}
				$('.person-messaage').siblings('ul').removeClass('select').end().addClass('select');
				page++;
				if(data.replyList.replyList.length == size){
					$('.person-messaage .click-upload-more').css('visibility','visible');
					$('.person-messaage .click-upload-more span').on('click',function(){
						firstBlood(page,size);
					});
				}else{
					$('.person-messaage .click-upload-more span').off('click');
					$('.person-messaage .click-upload-more').remove();
					$('.person-messaage .no-more').css('display','block');
					$('.statistics .statistics-title li').eq(0)[0].isComplete = true;
				}
				if(page == 1){
					selectPage(); //回復，查看，讃好選項卡
				}
				positionBox($('#what_say'),$('.post-left'));//吸頂評論框
			}
		});
	}
}
//所有帖子(点击量/查看量)
function updateSeeLog(){
	$.getJSON('http://userspace1.macaoeasybuy.com/seeLogController/updateSeeLog.easy?type=5&seeId='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){
		//console.log(data);
		//成功就成功唄，關我屁事
	})
}
//点赞
function isClickLove(){
	if(!easyBuy.isLogin){
		$('#good-for-post').on('click',function(){
			alert('沒登錄，去登錄也');
		});
		return false;
	}
	var goodTemplate = easyBuy.global.template['good'];
	//請求查看帖子是否點讚過
	$.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/isClickLove.easy?lovetype=5&id='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){
		goodPost(data.isClickLove);
	});
	var type = 5;
	function goodPost(datas){
		//帖子點讚
		if(datas == 1){
			$('#good-for-post').addClass('select');
			cancelPost();
		}else if(datas == 0){
			clickPost();
			if($('#good-list>li').length == 0){
				secondGood();
			}
		}
		function clickPost(){
			//讃好
			$('#good-for-post').off('click');
			$('#good-for-post').on('click',function(){
				var goUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type='+type+'&status=1&easybuyCallback=?';
//				goUrl = addHref(goUrl);
				$.getJSON(goUrl,function(data){
					var html = template.render(goodTemplate,data);
					if($('#good-list>li').length <= 0){
						$('#good-list .no-more-good').css('display','none');
					}
					$('#good-list').prepend(html);
					if($('#'+data.loveList[0].id + 'good-id').length == 0) $('#good-list').prepend(html);
					if($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].isComplete) $('#good-list').siblings('.no-more').css('display','block');
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum += 1
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum));
					$('#good-for-post').addClass('select');
					if($('#praise-post .praise.click').css('display') == 'none') $('#praise-post .praise.click').stop().fadeIn(500).delay(1000).fadeOut(500);
					cancelPost();
				});
				$('#good-for-post').off('click');
				$('#second-good').off('click');
				positionBox($('#what_say'),$('.post-left'));//吸頂評論框
			});
		}
		function cancelPost(){
			//取消讃好
			$('#good-for-post').off('click');
			$('#good-for-post').on('click',function(){
				var goUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type='+type+'&status=0&easybuyCallback=?';
//				goUrl = addHref(goUrl);
				$.getJSON(goUrl,function(data){
					//找到那個id刪除掉然後
					$('#'+data.id+'good-id').remove();
					if($('#good-list>li').length == 0){
						$('#good-list .no-more-good').css('display','block');
						$('#good-list').siblings('.no-more').css('display','none');
						secondGood();
					}
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum -= 1
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum));
					$('#good-for-post').removeClass('select');
					if($('#praise-post .praise.cancel').css('display') == 'none') $('#praise-post .praise.cancel').stop().fadeIn(500).delay(1000).fadeOut(500);
					clickPost();
				});
				$('#good-for-post').off('click');
				positionBox($('#what_say'),$('.post-left'));//吸頂評論框
			});
		}
		function secondGood(){
			$('#second-good').off('click');
			$('#second-good').on('click',function(){
				$.getJSON('http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type='+type+'&status=1&easybuyCallback=?',function(data){
					var html = template.render(goodTemplate,data);
					if($('#good-list>li').length <= 0){
						$('#good-list .no-more-good').css('display','none');
					}
					$('#good-list').prepend(html);
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum += 1
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum));
					$('#good-for-post').addClass('select');
					if($('#praise-post .praise.click').css('display') == 'none') $('#praise-post .praise.click').stop().fadeIn(500).delay(1000).fadeOut(500);
					cancelPost();
				});
				$('#good-for-post').off('click');
				$('#second-good').off('click');
				$('#good-list').siblings('.no-more').css('display','block');
				positionBox($('#what_say'),$('.post-left'));//吸頂評論框
			});
		}
	}
}

//判斷是否登錄，引入編輯器
function loadEditor(){
	if(easyBuy.isLogin){
		//登錄的
		$('#editor-box').load('/userspace/common/postDetailEditor.html',function(){
			editorFunc();
			$('#what_say .head-img').html('<img src="'+easyBuy.global.osURL+easyBuy.easyUser.pic+'" onerror="this.onerror=null;this.src=\'/img/common/loading_pc_headPic.png\'">');
			$('#what_say').css('display','block');
		});
	}else{
		//沒登錄
		$('#what_say').load('/social/common/post_editor_logintips.html',function(){
			$('#what_say').css('display','block');
		});
	}
}


//提及到的商店
function makeShop(){
	mygoodbanner({
		box: $('.poster-slider'),
		banner: $('.poster-slider ul'),
		goLeft: $('#goLeft'),
		goRight: $('#goRight'),
		timer: false
	});
}



//吸頂評論框
function boxTop(opts){
	var box = opts.box;
	var referBox = opts.referBox;
	box.css({
		'width':opts.boxOuter.width(),
		'display':'block'
	});
	var min = box.offset().top;
	box.attr('min-offset',min);
	positionBox(box,referBox);
	$(window).on('scroll',function(){
		positionBox(box,referBox);
	});
	$(window).on('resize',function(){
		positionBox(box,referBox);
	});
}
function positionBox(box,referBox){
	var min = box.attr('min-offset');
	var max = referBox.offset().top + referBox.outerHeight(true) - box.outerHeight(true);
	var scrollTop = $(window).scrollTop();
	box.css('left',referBox.offset().left - $(window).scrollLeft() + referBox.outerWidth(true));
	if(scrollTop <= min){
		box.css({
			'position':'static',
		});
	}else if(scrollTop > min && scrollTop < max){
		box.css({
			'position':'fixed',
			'top':'0px'
		});
	}else{
		box.css({
			'position':'fixed',
			'top':max - scrollTop
		});
	}
}

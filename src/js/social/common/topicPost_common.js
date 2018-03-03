// $(function(){
// 	getContent(); //獲取內容
// 	queryTopicCount(); //评论查看赞好数统计
// 	responseCard(); //評論回復
// 	easyBuyFansSeeing(); //宜粉們都在看
// 	//吸頂評論框
// 	boxTop({
// 		box:$('#what_say'),
// 		boxOuter:$('.post-right'),
// 		referBox:$('.post-left')
// 	});
// 	if(easyBuy.isLogin){
// 		updateSeeLog(); //查看用戶統計
// 	}
// 	isClickLove(); //讃好按鈕
// 	loadEditor(); //引入編輯器
// })
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
			posterBox.find('.head-img').html('<img data-type="userAvatar" src="'+easyBuy.global.osURL+data.adminPic+'" onerror="this.onerror=null;this.src=\'/src/img/common/loading_pc_headPic.png\'">');
			posterBox.find('.head-img').attr('data-id',data.adminId);
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
				console.log(data);	
				var html = template.render(checkTemplate,data.result);
				if(page == 0){
					var tourists = '<li class="tourists"><div class="respondBox_fandPic"><div>'+data.result.touristcount+'</div><div>遊客</div></div><div class="respondBox_fansMess clearfloat"><div></div><div></div></div></li>';
					$('#check-list').html(tourists);
					objBtn[0].flag = false;
				}
				$('.tourists').before(html);
				page++;
				if(data.result.userList.length == size){
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
	var responseTemplate = 'response';
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
				console.log(data);
				data.replyList.page = page;
				var html = template(responseTemplate,data.replyList);
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
function loadEditor(fn){
	if(easyBuy.isLogin){
		//登錄的
		// $('#editor-box').load('http://userspace.macaoeasybuy.com/public/postDetailEditor.html',function(){
		// 	console.log('已登錄');
		// 	$(this).prepend('<div class="replyBox_title">我想說說...</div>');
		// 	if(fn){
		// 		editorFunc(fn);
		// 	}else{
		// 		editorFunc();
		// 	}
		// 	//吸頂檢測
		// 	checkFinsh.editor = true;
		// 	checkAndGoScrollTop();
		// });
		var html=`
		<div class="edit-box">
		<div class="edit-box-inner">
			<div class="replyBox_inputBar">
				<div class="replyBox_inputBox">
					<div class="replyBox_input scrollIe scrollOther">
						<div id="editor" contenteditable="true" class="scrollIe scrollOther"></div>
						<div id="big-expression" class="clearfloat">
							<p><span class="now">0</span>/<span class="max">8</span></p>
						</div>
					</div>
					<div class="replyBox_toolBox clearfloat">
						<div class="replyBox_add">
							<ul class="replyBox_addUl clearfloat">
								<!--表情卡-->
								<li class="emjoPop" id="emjoPop">
									<img src="/src/img/social/liveshot/ProdigalPostDetail/add_face.png" alt="">
									<div class="expression-contains contains">
										<!--這裡插入表情-->
										<div class="expression-page-box" id="expression-page-box"></div>
										<ul class="expression-btn clearfloat">
											<li class="lr left"></li>
											<div>
												<div class="clearfloat"></div>
											</div>
											<li class="lr right"></li>
										</ul>
										<img src="/src/img/social/label/labeldetail/liveshotdetail_triangle_up.png" alt="" class="labeldetail_triangle">
									</div>
								</li>
								<!--@人卡-->
								<li class="metiondPop" id="metiondPop">
									<img src="/src/img/social/liveshot/ProdigalPostDetail/add_@.png" alt="">
									<div class="at-contains contains">
										<img src="/src/img/social/label/labeldetail/liveshotdetail_triangle_up.png" alt="" class="labeldetail_triangle">
										<div class="metiondBox emjoBoxPop">
											<div class="metiondBox_title">把您的內容同時彈送給：</div>
											<div class="classList">
												<ul class="clearfloat">
													<li class="select" id="userFriendsCount">
														<p><b>@</b>我的好友</p>
														<p class="num">0</p>
														<span class="curr_down"><img src="/src/img/social/label/labeldetail/curr_down.png"></span>
													</li>
													<li class="" id="userFansCount">
														<p><b>@</b>我的粉絲</p>
														<p class="num">0</p>
														<span class="curr_down"><img src="/src/img/social/label/labeldetail/curr_down.png"></span>
													</li>
													<li class="" id="userNoAttentionCount">
														<p><b>@</b>其他宜粉</p>
														<p class="num">0</p>
														<span class="curr_down"><img src="/src/img/social/label/labeldetail/curr_down.png"></span>
													</li>
													<li class="" id="metiondPop-select">
														<p>已選的宜粉</p>
														<p><span id="fansNumber">0</span>/20</p>
														<span class="curr_down"><img src="/src/img/social/label/labeldetail/curr_down.png"></span>
													</li>
												</ul>
											</div>
											<!--輸入框-->
											<div class="metiond_searchBox select" id="userFriendsCount-input">
												<div class="searchBox_leftt"><input type="text" name="" id="" placeholder="請輸入好友昵稱來找到對方"></div>
												<div class="searchBox_right"><img src="/src/img/social/label/labeldetail/searchIcon.png"></div>
											</div>
											<div class="metiond_searchBox" id="userFansCount-input">
												<div class="searchBox_leftt"><input type="text" name="" id="" placeholder="請輸入粉絲昵稱來找到對方"></div>
												<div class="searchBox_right"><img src="/src/img/social/label/labeldetail/searchIcon.png"></div>
											</div>
											<div class="metiond_searchBox" id="userNoAttentionCount-input">
												<div class="searchBox_leftt"><input type="text" name="" id="" placeholder="請輸入宜粉昵稱來找到對方"></div>
												<div class="searchBox_right"><img src="/src/img/social/label/labeldetail/searchIcon.png"></div>
											</div>
											<!--盒子-->
											<div class="fansListBox scrollIe scrollOther">
												<ul id="friendUl" class="select list-box clearfloat"></ul>
												<ul id="fansUl" class="list-box clearfloat"></ul>
												<ul id="otherFansUl" class="list-box clearfloat"></ul>
												<ul id="cheackedUl" class="clearfloat"></ul>
												<ul id="other-user-box" class="clearfloat"></ul>
											</div>
											<!--按鈕-->
											<div class="metiond_sureBox">
												<div id="at-btn" class="metiond_sureButton">
													<img src="/src/img/social/label/labeldetail/sureBtn.png">
													<spsn>確認彈送</spsn>
												</div>
											</div>
											<!--上限提示-->
											<div class="fullAlertBox">您所選好友數量超過上限</div>
										</div>
									</div>
								</li>
	
								<li class="addLabel" id="addLabel">
									<img src="/src/img/social/liveshot/ProdigalPostDetail/add_labelIcon.png" alt="">
									<div class="hash-contains contains">
										<img src="/src/img/social/label/labeldetail/liveshotdetail_triangle_up.png" alt="" class="labeldetail_triangle">
										<div class="metiondBox emjoBoxPop">
											<div class="metiondBox_title">在您的內容中插入標籤：</div>
											<div class="classList labelClassList">
												<ul class="clearfloat">
													<li class="select" id="placeLabelCount">
														<p><b>#</b>地點</p>
														<p class="num">0</p>
														<span class="curr_down"><img src="/src/img/social/label/labeldetail/curr_down.png"></span>
													</li>
													<li class="" id="brandLabelCount">
														<p><b>#</b>品牌</p>
														<p class="num">0</p>
														<span class="curr_down"><img src="/src/img/social/label/labeldetail/curr_down.png"></span>
													</li>
													<li class="" id="hotLabelCount">
														<p><b>#</b>熱點</p>
														<p class="num">0</p>
														<span class="curr_down"><img src="/src/img/social/label/labeldetail/curr_down.png"></span>
													</li>
													<li class="" id="addLabel-select">
														<p><b>#</b>已選標籤</p>
														<p><span id="labelNumber">0</span>/10</p>
														<span class="curr_down"><img src="/src/img/social/label/labeldetail/curr_down.png"></span>
													</li>
												</ul>
											</div>
											<div class="metiond_searchBox select">
												<div class="searchBox_leftt"><input type="text" name="" id="" value="" placeholder="您可搜索您想要使用的標籤"></div>
												<div class="searchBox_right"><img src="/src/img/social/label/labeldetail/searchIcon.png"></div>
											</div>
											<div class="metiond_searchBox">
												<div class="searchBox_leftt"><input type="text" name="" id="" value="" placeholder="您可搜索您想要使用的標籤"></div>
												<div class="searchBox_right"><img src="/src/img/social/label/labeldetail/searchIcon.png"></div>
											</div>
											<div class="metiond_searchBox">
												<div class="searchBox_leftt"><input type="text" name="" id="" value="" placeholder="您可搜索您想要使用的標籤"></div>
												<div class="searchBox_right"><img src="/src/img/social/label/labeldetail/searchIcon.png"></div>
											</div>
											<div class="LabelListBox scrollIe scrollOther">
												<ul id="placeLabel" class="list-box select"></ul>
												<ul id="brandLabel" class="list-box"></ul>
												<ul id="hotLabel" class="list-box"></ul>
												<ul id="checkedLabel" class=""></ul>
												<ul id="other-label-box"></ul>
											</div>
											<div class="metiond_sureBox">
												<div id="label-btn" class="metiond_sureButton">
													<img src="/src/img/social/label/labeldetail/sureBtn.png">
													<span>確認插入</span>
												</div>
											</div>
											<div class="fullAlertBox">您所選標籤數量超過上限</div>
										</div>
									</div>
								</li>
								<div class="shadow-box"></div>
							</ul>
						</div>
						<div class="replyBox_sendMess" id="replyBox_sendMess">
							<div><img src="/src/img/social/liveshot/ProdigalPostDetail/sendMessButton.png"></div><span>送出消息</span></div>
					</div>
				</div>
			</div>
		</div>
	</div>
		`;
		$('#editor-box').html(html);
		$('#editor-box').prepend('<div class="replyBox_title">我想說說...</div>');
		if(fn){
			editorFunc(fn);
		}else{
			editorFunc();
		}
		//吸頂檢測
		// checkFinsh.editor = true;
		// checkAndGoScrollTop();
	}else{	
		//沒登錄
		const html = `<div class="edit-box">
			<div class="edit-box-no-login clearfloat">
				<div class="no-login-icon"><img src="/src/img/common/05.png" alt=""></div>
				<div class="no-login-tips">
					<div class="no-login-tips-text">未登入無法留言哦！</div>
					<div class="clearfloat no-login-tips-btn">
						<div><a href="http://usermanager.macaoeasybuy.com/login.html">馬上登入</a></div>
						<div><a>馬上註冊</a></div>
					</div>
				</div>
			</div>
		</div>`;
		$('#editor-box').html(html);
		// checkFinsh.editor = true;
		// checkAndGoScrollTop();
		//沒登錄
		// $('#editor-box').load('//social/common/post_editor_logintips.html',function(){
		// 	//吸頂檢測
		// 	checkFinsh.editor = true;
		// 	checkAndGoScrollTop();
		// });
	}
}
// function loadEditor(){
// 	if(easyBuy.isLogin){
// 		//登錄的
// 		$('#editor-box').load('/userspace/common/postDetailEditor.html',function(){
// 			editorFunc();
// 			$('#what_say .head-img').html('<img src="'+easyBuy.global.osURL+easyBuy.easyUser.pic+'" onerror="this.onerror=null;this.src=\'/src/img/common/loading_pc_headPic.png\'">');
// 			$('#what_say').css('display','block');
// 		});
// 	}else{
// 		//沒登錄
// 		$('#what_say').load('/social/common/post_editor_logintips.html',function(){
// 			$('#what_say').css('display','block');
// 		});
// 	}
// }


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

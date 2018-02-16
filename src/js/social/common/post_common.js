
//檢測並且執行吸頂
function checkAndGoScrollTop(){
	var flag = false;
	if(checkFinsh.banner == true && checkFinsh.editor == true && checkFinsh.content == true){
		flag = true;
	}
	if(flag) rightScrollTop(); //吸頂
}
//右側吸頂
function rightScrollTop(){
	var scrollBox = $('#person-right'); //吸頂盒子
	var reference = $('#editor-box'); //參照盒子
	var minTop = $('#person-left').offset().top; //最初的高度
	var minLeft = $('#person-left').outerWidth(true) + $('#person-left').offset().left - $(window).scrollLeft(); //最初的left
	var windowScrollTop = 0; //滾動條高度
	var maxTop = reference.offset().top + reference.outerHeight() - scrollBox.outerHeight(); //最高的高度

	scrollChangeCSS($(window));

	$(window).off('scroll.top');
	$(window).off('resize.top');
	$(window).on('scroll.top',function(){
		scrollChangeCSS($(this));
	});
	$(window).on('resize.top',function(){
		scrollChangeCSS($(this));
	});
	function scrollChangeCSS(self){
		windowScrollTop = self.scrollTop();
		minLeft = $('#person-left').outerWidth(true) + $('#person-left').offset().left - $(window).scrollLeft();
		if(windowScrollTop < minTop){
			scrollBox.css({
				position : 'static',
				top : 'auto',
				left : 'auto',
				'margin-top' : '0px'
			});
		}else if(windowScrollTop >= minTop && windowScrollTop < maxTop){
			scrollBox.css({
				position : 'fixed',
				top : '0px',
				left : minLeft + 'px',
				'margin-top' : '0px'
			});
		}else{
			scrollBox.css({
				position : 'static',
				top : 'auto',
				left : 'auto',
				'margin-top' : maxTop - minTop + 'px'
			});
		}
	}
}
//用戶姓名，頭像，性別
function userInfo(a,b,c){
	console.log(a);
	console.log(b);
	console.log(c);
	$('#other-mess-name span,#mine-other-post .poster-name,#mine-other-poster .poster-name').html(a);
	$('#messBox_pic img,#mine-other-poster img.head-img').attr('src','//wap.macaoeasybuy.com'+b);
	$('#messBox_pic img,#mine-other-poster img.head-img').attr('data-type','userAvatar');
	if(c=='Girl'){
		$('#other-mess-name img').attr('src','/src/img/common/girl.png');
	}else{
		$('#other-mess-name img').attr('src','/src/img/common/boy.png');
	}
}
//相關商店
function otherMessShop(data){
	if(data.length != 0){
		for(var i=0;i<data.length;i++){
			var html = '<li data-id="'+data[i].id+'"><img src="'+'//wap.macaoeasybuy.com'+data[i].logo+'"></li>';
			$('#otherMess_shop').append(html);
		}
	}else{
		$('#otherMess_shop').parent().remove();
	}
	if($('.otherMess_shop')) $('.otherMess_shop').css('display','block');
}
//相關商品
function commodity(data){
	if(data.shangpinList == undefined){
		$('.otherMess_commodity').remove();
		return false;
	}
	if(data.shangpinList.length != 0){
		var html = template.render(easyBuy.global.template['otherMess_commodityBox-template'],data);
		$('#otherMess_commodityBox').html(html);
	}else{
		$('#otherMess_commodityBox').parent().remove();
	}
	if($('.otherMess_commodity')) $('.otherMess_commodity').css('display','block');
}
//大錶情
function bigEmoji(data){
	if(data == undefined) return false;
	for(var i=0;i<data.length;i++){
		var html = '<li><img src="'+'//wap.macaoeasybuy.com'+data[i]+'"></li>'
		$('#atricle_emjo').append(html);
	}
}
//內容
function myContent(data){
	$('#articleMain').html(data);
	$('#articleMain a').each(function(){
		var html = $(this).attr('id');
		var res = /label/.test(html);
		if(/label/.test(html)){
			$(this).addClass('label-content');
		}else if(/at/.test(html)){
			$(this).addClass('at-content');
		}
	});
}
//標籤分類
function labelClass(data){
	for(var i=0;i<data.length;i++){
		if(data[i].length == 0){
			if(i==0){
				$('#atricle_label li.placeLabel').remove();
			}else if(i==1){
				$('#atricle_label li.brandLabel').remove();
			}else if(i==2){
				$('#atricle_label li.hotLabel').remove();
			}
		}else{
			for(var j=0;j<data[i].length;j++){
				if(i==0){
					$('#atricle_label li.placeLabel').append(data[i][j]);
				}else if(i==1){
					$('#atricle_label li.brandLabel').append(data[i][j]);
				}else if(i==2){
					$('#atricle_label li.hotLabel').append(data[i][j]);
				}
			}
		}
	}
	$('#atricle_label a').each(function(){
		//這裡可以改跳轉
	});
	if($('.atricle_label')) $('.atricle_label').css('display','block');
}
//舉報帖子
function reportPost(){
	if(!easyBuy.isLogin){
		$('#violation').on('click',function(){
			alert('沒登錄，跳到登錄頁');
		});
	}else{
		$('#violation').on('click',function(){
			alert('舉報你哦，大壞蛋');
		});
	}
}
//判斷是否登錄，引入編輯器
function loadEditor(fn){
	if(easyBuy.isLogin){
		//登錄的
		$('#editor-box').load('/html/userspace/public/postDetailEditor.html',function(){
			$(this).prepend('<div class="replyBox_title">我想說說...</div>');
			if(fn){
				editorFunc(fn);
			}else{
				editorFunc();
			}
			//吸頂檢測
			checkFinsh.editor = true;
			checkAndGoScrollTop();
		});
	}else{
		//沒登錄
		const html = `<div class="edit-box">
			<div class="edit-box-no-login clearfloat">
				<div class="no-login-icon"><img src="/src/img/common/05.png" alt=""></div>
				<div class="no-login-tips">
					<div class="no-login-tips-text">未登入無法留言哦！</div>
					<div class="clearfloat no-login-tips-btn">
						<div>馬上登入</div>
						<div>馬上註冊</div>
					</div>
				</div>
			</div>
		</div>`;
		$('#editor-box').html(html);
		checkFinsh.editor = true;
		checkAndGoScrollTop();
		//沒登錄
		// $('#editor-box').load('//social/common/post_editor_logintips.html',function(){
		// 	//吸頂檢測
		// 	checkFinsh.editor = true;
		// 	checkAndGoScrollTop();
		// });
	}
}
//初次請求評論列表
function responseCard(postType){
	var page = 0;
	var size = 8;
	var postType = postType;
	var responseTemplate = easyBuy.global.template['response'];
	$('.statistics .statistics-title li').eq(0)[0].isComplete = false;
	firstBlood(page,size);
	function firstBlood(page,size){
		$.ajax({
			url:'http://userspace1.macaoeasybuy.com/topicReplyController/getReplyList.easy?id='+postId+'&type='+postType+'&size='+size+'&page='+page+'&order=uptime&descOrAsc=desc&easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				scrollReq('off');
				if($('.statistics .statistics-title li').eq(0)[0].isComplete) return false;
			},
			success:function(data){
				console.log(data);
				data.replyList.page = page;
				var html = template('response', data.replyList);
				$('#response-list-inner .no-more').before(html);
				//如果沒有數據的時候，出現暫時沒有任何人評論
				if(data.replyList.replyList.length == 0 && page == 0){
					$('.person-messaage .no-more').remove();
					$('.person-messaage .no-more-good .no-btn').on('click',function(){
						editor.obj.focus();
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
					//給回應按鈕辦定數據
					if($('#'+data.replyList.replyList[i].id+'response').find('.person-info-revert').length != 0){
						$('#'+data.replyList.replyList[i].id+'response').find('.person-info-revert')[0].data = {
							id:data.replyList.replyList[i].id,
							name:data.replyList.replyList[i].name,
							userId:data.replyList.replyList[i].userid
						}
					}
					//給回應按鈕辦定事件
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
							alert('沒有登錄，去登錄註冊頁面');
						}
					});
				}

				$('.person-messaage').siblings('ul').removeClass('select').end().addClass('select');
				page++;
				if(data.replyList.replyList.length == size){
					scrollReq('on',page);
				}else{
					scrollReq('off');
					$('.person-messaage .click-upload-more').remove();
					$('.person-messaage .no-more').css('display','block');
					$('.statistics .statistics-title li').eq(0)[0].isComplete = true;
				}
				if(page == 1){
					selectPage(); //回復，查看，讃好選項卡
				}
				checkFinsh.firstReply = true;
				checkAndGoScrollTop();
			},
			error:function(){
				console.log('發生未知錯誤')
			}
		});
	}
	//滾動
	function scrollReq(state,page){
		if(state == 'on'){
			$('#response-list').on('scroll.req',function(){
				var scrollTop = $(this).scrollTop();
				var scrollHeight = $('#response-list-inner').height();
				var windowHeight = $(this).height();
				if(scrollTop + windowHeight >= scrollHeight * 0.6){
					firstBlood(page,size);
				}
			});
		}else{
			$('#response-list').off('scroll.req')
		}
	}
}

//最近查看宜粉
function checkCard(objBtn,postType){
	var postType = postType;
	var page = 0;
	var size = 24;
	var checkTemplate = easyBuy.global.template['check'];
	firstBlood(page,size);
	function firstBlood(page,size){
		$.ajax({
			url:'http://userspace1.macaoeasybuy.com/seeController/querySeeFriends.easy?id='+postId+'&type='+postType+'&size='+size+'&page='+page+'&order=uptime&descOrAsc=desc&easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				scrollReq('off');
			},
			success:function(data){
				console.log(data);
				var html = template('check', data.result);
				if(page == 0){
					var tourists = '<li class="tourists"><div class="respondBox_fandPic"><div>'+data.result.touristcount+'</div><div>遊客</div></div><div class="respondBox_fansMess clearfloat"><div></div><div></div></div></li>';
					$('#check-list-inner').prepend(tourists);
					objBtn[0].flag = false;
				}
				$('.tourists').before(html);
				page++;
				if(data.result.userList.length == size){
					scrollReq('on',page);
				}else{
					scrollReq('off');
					$('.person-check .click-upload-more').remove();
					$('.person-check .no-more').css('display','block');
				}
			}
		});
	}
	function scrollReq(state,page){
		if(state == 'on'){
			$('#check-list').on('scroll.req',function(){
				var scrollTop = $(this).scrollTop();
				var scrollHeight = $('#check-list-inner').height();
				var windowHeight = $(this).height();
				if(scrollTop + windowHeight >= scrollHeight * 0.6){
					firstBlood(page,size);
				}
			});
		}else{
			$('#check-list').off('scroll.req');
		}
	}
}

//最近讃好宜粉
function mygoodCard(objBtn,postType){
	var postType = postType;
	var page = 0;
	var size = 24;
	var goodTemplate = easyBuy.global.template['good'];
	firstBlood(page,size);
	function firstBlood(page,size){
		$.ajax({
			url:'http://userspace1.macaoeasybuy.com/loveController/queryLoveFriends.easy?id='+postId+'&type='+postType+'&size='+size+'&page='+page+'&order=uptime&descOrAsc=desc&easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				scrollReq('off');
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
				$('#good-list-inner .no-more').before(html);
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
					scrollReq('on',page);
				}else{
					scrollReq('off');
					$('.person-good .click-upload-more').remove();
					$('#good-list-inner').find('.no-more').css('display','block');
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].isComplete = true;
				}
				if(len == 0){
					$('#good-list-inner').find('.no-more').css('display','none');
				}
			}
		});
	}
	function scrollReq(state,page){
		if(state == 'on'){
			$('#good-list').on('scroll.req',function(){
				var scrollTop = $(this).scrollTop();
				var scrollHeight = $('#good-list-inner').height();
				var windowHeight = $(this).height();
				if(scrollTop + windowHeight >= scrollHeight * 0.6){
					firstBlood(page,size);
				}
			});
		}else{
			$('#good-list').off('scroll.req');
		}
	}
}

//請求查看帖子是否點讚過
function isClickLove(lovetype,type){
	if(!easyBuy.isLogin){
		$('#good-for-post').on('click',function(){
			alert('沒有登錄，跳到登錄頁');
		});
		return false;
	}
	var lovetype = lovetype;
	var type = type;
	$.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/isClickLove.easy?lovetype='+lovetype+'&id='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){
		goodPost(data.isClickLove);
	});
	var goodTemplate = easyBuy.global.template['good'];
	function goodPost(datas){
		//帖子點讚
		if(datas == 1){
			$('#good-for-post').addClass('select');
			cancelPost();
		}else if(datas == 0){
			clickPost();
			if($('#good-list-inner>li').length == 0){
				secondGood();
			}
		}
		function clickPost(){
			//讃好
			$('#good-for-post').off('click');
			$('#good-for-post').on('click',function(){
				var goUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type='+type+'&status=1&easybuyCallback=?';
				$.getJSON(goUrl,function(data){
					var html = template.render(goodTemplate,data);
					if($('#good-list-inner>li').length > 0){
						$('#good-list-inner').prepend(html);
					}else{
						$('#good-list-inner .no-more-good').css('display','none');
						$('#good-list-inner').prepend(html);
					}
					if($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].isComplete) $('#good-list-inner .no-more').css('display','block');
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum += 1
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum));
					$('#good-for-post').addClass('select');
					if($('#praise-post .praise.click').css('display') == 'none') $('#praise-post .praise.click').stop().fadeIn(500).delay(1000).fadeOut(500);
					cancelPost();
				});
				$('#good-for-post').off('click');
				$('#second-good').off('click');
			});
		}
		function cancelPost(){
			//取消讃好
			$('#good-for-post').off('click');
			$('#good-for-post').on('click',function(){
				var goUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type='+type+'&status=0&easybuyCallback=?';
				$.getJSON(goUrl,function(data){
					//找到那個id刪除掉然後
					$('#'+data.id+'good-id').remove();
					if($('#good-list-inner>li').length == 0){
						$('#good-list-inner .no-more-good').css('display','block');
						$('#good-list-inner .no-more').css('display','none');
						secondGood();
					}
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum -= 1
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum));
					$('#good-for-post').removeClass('select');
					if($('#praise-post .praise.cancel').css('display') == 'none') $('#praise-post .praise.cancel').stop().fadeIn(500).delay(1000).fadeOut(500);
					clickPost();
				});
				$('#good-for-post').off('click');
			});
		}
		function secondGood(){
			$('#second-good').off('click');
			$('#second-good').on('click',function(){
				$.getJSON('http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type='+type+'&status=1&easybuyCallback=?',function(data){
					var html = template.render(goodTemplate,data);
					if($('#good-list-inner>li').length > 0){
						$('#good-list-inner').prepend(html);
					}else{
						$('#good-list-inner .no-more-good').css('display','none');
						$('#good-list-inner').prepend(html);
					}
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum += 1
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum));
					$('#good-for-post').addClass('select');
					if($('#praise-post .praise.click').css('display') == 'none') $('#praise-post .praise.click').stop().fadeIn(500).delay(1000).fadeOut(500);
					cancelPost();
				});
				$('#good-for-post').off('click');
				$('#second-good').off('click');
				$('#good-list-inner .no-more').css('display','block');
			});
		}
	}
}

//评论查看赞好数统计
function queryTopicCount(type,topicType){
	var type = type;
	var topicType = topicType;
	$.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/queryTopicCount.easy?type='+type+'&id='+postId+'&topicType='+topicType+'&easybuyCallback=?',function(data){
		console.log(data);
		$('#statistics-title li:first-of-type .statistics-bubble div:first-of-type')[0].dataNum = data.topicCount.commentNum;
		$('#statistics-title li:nth-of-type(2) .statistics-bubble div:first-of-type')[0].dataNum = data.topicCount.seeNums;
		$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum = data.topicCount.loveNums;
		$('#statistics-title li:first-of-type .statistics-bubble div:first-of-type').html(formatNum(data.topicCount.commentNum)); //評論總數
		$('#statistics-title li:nth-of-type(2) .statistics-bubble div:first-of-type').html(formatNum(data.topicCount.seeNums)); //查看總數
		$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum(data.topicCount.loveNums)); //點讚總數
	})
}

//所有帖子(点击量/查看量)
function updateSeeLog(type){
	var type = type;
	$.getJSON('http://userspace1.macaoeasybuy.com/seeLogController/updateSeeLog.easy?type='+type+'&seeId='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){

		//成功就成功唄，關我屁事
	})
}

//輪播圖
function postBanner(opt){
	var dataUrl = opt.dataUrl;
	var values = opt.values;
	$.ajax({
		url:dataUrl+'?id='+postId+'&easybuyCallback=?',
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var newData = data[values];
			if(newData.length == 0){
				$('#foodBannerul').parents('.showPicBox').remove();
				checkFinsh.banner = true;
				checkAndGoScrollTop();
				return false;
			}
			for(var i=0;i<newData.length;i++){
				if(newData[i].pic===undefined){
					var html='<li><img middle="true" src="/src/img/common/loadnow.jpg"></li>'
				}else{
					var html = '<li><img middle="true" src="'+'//wap.macaoeasybuy.com'+newData[i].pic+'" onerror=this.src="/src/img/common/loadnow.jpg"></li>';
				}
				$('#foodBannerul').append(html);
			}
			mygoodbanner({
				box: $('.showPicBox'),
				banner: $('#foodBannerul'),
				now: $('.showPicBox').find('.now'),
				goLeft: $('#goLeft'),
				goRight: $('#goRight'),
			},{
				grassBox:$('#big-grass-page'),
				grassUl:$('#big-grass-page .big-grass-ul'),
				grassclose:$('#big-grass-page .close-grass'),
				grassL:$('#big-grass-page .prev'),
				grassR:$('#big-grass-page .next'),
				grassNow:$('#big-grass-page .BannerCountBox .now')
			},function(){
				$('#foodBannerul li').each(function(){
					imgOnMiddle($(this));
				});
				//吸頂檢測
				checkFinsh.banner = true;
				checkAndGoScrollTop();
			});
		}
	});
}

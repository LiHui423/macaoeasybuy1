//吸頂回復框(輪播圖加載完成調用)
function boxTop(opts){
	var box = opts.box;
	var boxOuter = opts.boxOuter;
	var referBox = opts.referBox;
	var fadeTime = opts.fadeTime;
	imagesLoaded(box.prev().find('img'),function(){
		box.css({
			'display':'block',
			'top':box.prev().outerHeight(true),
			'width':boxOuter.width()
		})
		box.attr({
			'min-offset':box.offset().top,
			'now-top':parseInt(box.css('top'))
		});
		bindEditorBox(box,boxOuter,referBox,fadeTime);
	});
}
//給編輯框綁定事件
function bindEditorBox(box,boxOuter,referBox,fadeTime){
	positionBox(box,boxOuter,referBox,fadeTime);
	$(window).off('scroll resize');
	$(window).on('scroll',function(){
		positionBox(box,boxOuter,referBox,fadeTime);
	});
	$(window).on('resize',function(){
		bindEditorBox(box,boxOuter,referBox,fadeTime);
	});
}
//給編輯框取消辦定事件
function restoreEditorBox(box){
	$(window).off('scroll');
	$(window).off('resize');
	box.css({
		'position':'absolute',
		'top':parseInt(box.attr('now-top')),
		'left':'0px',
		'box-shadow':'0px 0px 0px transparent'
	});
}
//給出編輯框的位置
function positionBox(box,boxOuter,referBox,fadeTime){
	var min = box.attr('min-offset');
	var max = referBox.offset().top + referBox.outerHeight() - box.outerHeight(true);
	// var scrollTop = $(this).scrollTop();
	var scrollTop = $(window).scrollTop();
	if(scrollTop <= min){
		box.css({
			'position':'absolute',
			'top':parseInt(box.attr('now-top')),
			'left':'0px',
			'box-shadow':'0px 0px 0px transparent',
			'height':'300px'
		});
		box.stop().fadeIn(fadeTime);
	}else if(scrollTop > min && scrollTop < max){
		box.css({
			'position':'fixed',
			'top':'0px',
			// 'left':boxOuter.offset().left - $(this).scrollLeft(),
			'left' :'940px',
			'box-shadow': '0px 5px 15px #ccc',
			'height':'300px'
		});
		box.stop().fadeIn(fadeTime);
	}else{
		box.css({
			'position':'fixed',
			'top' : max - scrollTop,
			'left':boxOuter.offset().left - $(this).scrollLeft(),
			'box-shadow': '0px 5px 15px #ccc',
			'height':'300px'
		});
		box.stop().fadeOut(fadeTime);
	}
}

//用戶姓名，頭像，性別
function userInfo(a,b,c){
	$('#other-mess-name span').html(a);
	$('#messBox_pic img').attr('src','//wap.macaoeasybuy.com'+b);
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
			var html = '<li data-id="'+data[i].id+'"><img src="'+easyBuy.global.osURL+data[i].logo+'"></li>';
			$('#otherMess_shop').append(html);
		}
	}else{
		$('#otherMess_shop').parent().remove();
	}
}
//相關商品
function commodity(data){
	var otherMessCommodityBoxTemplate = easyBuy.global.template['otherMess_commodityBox-template'];
	if(data.shangpinList == undefined){
		$('.otherMess_commodity').remove();
		return false;
	}
	if(data.shangpinList.length != 0){
		var html = template.render(otherMessCommodityBoxTemplate,data);
		$('#otherMess_commodityBox').html(html);
	}else{
		$('#otherMess_commodityBox').parent().remove();
	}
}
//大錶情
function bigEmoji(data){
	if(data == undefined) return false;
	for(var i=0;i<data.length;i++){
		var html = '<li><img src="//wap.macaoeasybuy.com'+data[i]+'"></li>'
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
}
//刪除帖子
function myDeletePost(opt){
	var num = '';
	var type = opt.type;
	var delUrl = opt.delUrl;
	$.getJSON('http://userspace1.macaoeasybuy.com/integralController/queryTopicIntegral.easy?type='+type+'&easybuyCallback=?',function(data){
		$('#delete-post .cancel-tips-text-tips span').html(data.Integral);
		num = data.Integral;
		$('#post-delete').on('click',function(){
			$('#delete-post').css('display','block');
		});
		$('#delete-post .sure-cancel').on('click',function(){
			$.getJSON(delUrl+'?idStr='+postId+'&userId='+userId+'&integral='+num+'&easybuyCallback=?',function(data){
				if(data.status == 'success'){
					alert('刪除帖子成功,頁面準備跳轉列表頁');
				}else{
					alert('刪除帖失敗,不知道什麼鬼問題');
				}
			});
		});
		$('#delete-post .cancel-sure').on('click',function(){
			$('#delete-post').css('display','none');
		});
	});
}
//舉報帖子
function reportPost(){
	$('#violation').on('click',function(){
		alert('舉報你哦，大壞蛋');
	});
}



//輪播圖
function postBanner(opt){
	var dataUrl = opt.dataUrl;
	var values = opt.values;
	var postId = opt.id;
	$.ajax({
		url:dataUrl+'?id='+postId+'&easybuyCallback=?',
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			var newData = data.releaseInfoPics || data.sentVolunteersInfoPics || data.usedInfoPics || data.suitableLifeInfoPics || data.fairInfoPics;
			if(newData.length == 0){
				$('#foodBannerul').parents('.showPicBox').remove();
				return false;
			}
			for(var i=0;i<newData.length;i++){
				if(newData[i].pic !== undefined){
					var html = '<li><img middle="true" src="//wap.macaoeasybuy.com'+newData[i].pic+'"></li>';
				}else{
					var html = '<li><img middle="true" src="/src/img/common/loadnow.jpg"></li>';
				}
				$('#foodBannerul').append(html);
			}
			easyBuy.global.dep.mygoodbanner({
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
					easyBuy.global.dep.imgOnMiddle($(this));
				});
			});
		}
	});
}

//最近讃好宜粉
function mygoodCard(objBtn,postType){
	var postType = postType;
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
				var html = template.render(goodTemplate,data);
				$('#good-list').append(html);
				if(page==0){
					objBtn[0].flag = false;
				}
				if(data.loveList.length == 0 && page == 0){
					$('#good-list .no-more-good').css('display','block');
				}else{
					$('#good-list .no-more-good').css('display','none');
				}
				page++;
				if(data.loveList.length == size){
					$('.person-good .click-upload-more span').on('click',function(){
						firstBlood(page,size);
					});
				}else{
					$('.person-good .click-upload-more').remove();
					$('#good-list').siblings('.no-more').css('display','block');
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].isComplete = true;
				}
				if(data.loveList.length == 0){
					$('#good-list').siblings('.no-more').css('display','none');
				}
			}
		});
	}
}

//最近查看宜粉
function checkCard(objBtn,postType){
	var postType = postType;
	var page = 0;
	var size = 15;
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
			}
		});
	}
}

//初次請求評論列表
function responseCard(postType){
	var page = 0;
	var size = 8;
	var postType = postType;
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
				var html = template('response',data.replyList);
				$('#response-list').append(html);
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
					if($('#'+data.replyList.replyList[i].id+'response').find('.person-info-revert').length != 0){
						$('#'+data.replyList.replyList[i].id+'response').find('.person-info-revert')[0].data = {
							id:data.replyList.replyList[i].id,
							name:data.replyList.replyList[i].name,
							userId:data.replyList.replyList[i].userid
						}
					}
					$('#'+data.replyList.replyList[i].id+'response').find('.person-info-revert').on('click',function(){
						editor.obj.html('');
						editor.obj.focus();
						editor.setRange();
						editor.obj.blur();
						editor.insertBlock('回復 '+$(this)[0].data.name+'：','replyUserTips1314','#f00');
						$('.replyUserTips1314')[0].id = $(this)[0].data.id;
						$('.replyUserTips1314')[0].userId = $(this)[0].data.userId;
					});
				}
				$('.person-messaage').siblings('ul').removeClass('select').end().addClass('select');
				page++;
				if(data.replyList.replyList.length == size){
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
			}
		});
	}
}
//评论查看赞好数统计
function queryTopicCount(type,topicType,postId){
	var type = type;
	var topicType = topicType;
	$.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/queryTopicCount.easy?type=5&id='+postId+'&topicType='+topicType+'&easybuyCallback=?',function(data){
		var formatNum = easyBuy.global.dep.formatNum;
		$('#statistics-title li:first-of-type .statistics-bubble div:first-of-type')[0].dataNum = data.topicCount.commentNum;
		$('#statistics-title li:nth-of-type(2) .statistics-bubble div:first-of-type')[0].dataNum = data.topicCount.seeNums;
		$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum = data.topicCount.loveNums;
		$('#statistics-title li:first-of-type .statistics-bubble div:first-of-type').html(formatNum(data.topicCount.commentNum)); //評論總數
		$('#statistics-title li:nth-of-type(2) .statistics-bubble div:first-of-type').html(formatNum(data.topicCount.seeNums)); //查看總數
		$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum(data.topicCount.loveNums)); //點讚總數
	})
}

//点赞
function isClickLove(lovetype,type){
	var goodTemplate = easyBuy.global.template['good'];
	var lovetype = lovetype;
	var type = type;
	//請求查看帖子是否點讚過
	$.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/isClickLove.easy?lovetype='+lovetype+'&id='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){
		goodPost(data.isClickLove);
	});
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
				$.getJSON(goUrl,function(data){
					var html = template.render(goodTemplate,data);
					if($('#good-list>li').length > 0){
						$('#good-list').prepend(html);
					}else{
						$('#good-list .no-more-good').css('display','none');
						$('#good-list').prepend(html);
					}
					if($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].isComplete) $('#good-list').siblings('.no-more').css('display','block');
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
			});
		}
		function secondGood(){
			$('#second-good').off('click');
			$('#second-good').on('click',function(){
				$.getJSON('http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type='+type+'&status=1&easybuyCallback=?',function(data){
					var html = template.render(goodTemplate,data);
					if($('#good-list>li').length > 0){
						$('#good-list').prepend(html);
					}else{
						$('#good-list .no-more-good').css('display','none');
						$('#good-list').prepend(html);
					}
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum += 1
					$('#statistics-title li:last-of-type .statistics-bubble div:first-of-type').html(formatNum($('#statistics-title li:last-of-type .statistics-bubble div:first-of-type')[0].dataNum));
					$('#good-for-post').addClass('select');
					if($('#praise-post .praise.click').css('display') == 'none') $('#praise-post .praise.click').stop().fadeIn(500).delay(1000).fadeOut(500);
					cancelPost();
				});
				$('#good-for-post').off('click');
				$('#second-good').off('click');
				$('#good-list').siblings('.no-more').css('display','block');
			});
		}
	}
}

//所有帖子(点击量/查看量)
function updateSeeLog(type){
	var type = type;
	$.getJSON('http://userspace1.macaoeasybuy.com/seeLogController/updateSeeLog.easy?type='+type+'&seeId='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){
		//console.log(data);
		//成功就成功唄，關我屁事
	})
}

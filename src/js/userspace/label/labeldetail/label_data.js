
//內容數據
function queryLabelInfo(){
	var sendUrl = 'http://userspace1.macaoeasybuy.com/UserLabelConntroller/queryLabelInfo.easy?id='+postId+'&easybuyCallback=?';
	$.ajax({
		url:sendUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){

		},
		success:function(data){
			var newData = data.labelInfo;
			switch(newData.type){
				case 0:
					var labelTypeHtml = '地點';
				break;
				case 1:
					var labelTypeHtml = '品牌';
				break;
				case 2:
					var labelTypeHtml = '熱點';
				break;
			}
			if(yezState == 'mine'){
				$('#label-create-time-mine').html(newData.addtime); //創建時間
				$('#label-create-from-mine').html('#'+labelTypeHtml+'#'); //創建於
			}else{
				$('#label-create-time-other').html(newData.addtime); //創建時間
				$('#label-create-from-other').html('#'+labelTypeHtml+'#'); //創建於
				$('#label-user span').html(newData.username); //用戶名字
				var sexHtml = newData.sex == 'Boy' ? 'boy' : 'girl';
				$('#label-user img').attr('src','/src/img/common/'+sexHtml+'.png'); //用戶性別
				//用戶頭像，Id
				$('#label-user-head img').attr({
					'src' : 'http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData.userPic,
					'id' : newData.userId + 'userId'
				});
			}
			$('#label-name span').html(newData.labelName); //標籤名
			$('#label-level span').html(newData.level); //標籤排行
			labelDes(newData.picture,newData.describe);//標籤描述跟圖片
			countNum(newData.loveNums,newData.seeNums,newData.relatedNums); //讃好，查看，相關數量總數
		}
	});
	//標籤描述跟圖片
	function labelDes(pic,des){
		if(pic != undefined && des == undefined){
			$('#label-picture').html('<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+pic+'" alt="">');
			$('#label-describe').remove();
		}
		if(pic == undefined && des != undefined){
			$('#label-picture').remove();
			$('#label-describe').html(des);
		}
		if(pic != undefined && des != undefined){
			$('#label-picture').html('<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+pic+'" alt="">');
			$('#label-describe').html(des);
		}
		if(pic == undefined && des == undefined){
			$('#label-describe').html('樓主太懶，又沒有配圖，又沒有寫上標籤描述...');
			$('#label-picture').remove();
		}
	}
	//讃好，查看，相關數量總數
	function countNum(a,b,c){
		$('#good-count-num')[0].count = a;
		$('#good-count-num .count-num').html($('#good-count-num')[0].count);
		$('#check-count-num')[0].count = b;
		$('#check-count-num .count-num').html($('#check-count-num')[0].count);
		$('#relate-count-num')[0].count = c;
		$('#relate-count-num .count-num').html($('#relate-count-num')[0].count);
	}
}
//最近讃好宜粉
function mygoodCard(objBtn){
	var postType = 10;
	var page = objBtn[0].page;
	var size = 16;
	var goodTemplateHtml = easyBuy.global.template['good-template'];
	firstBlood(page,size);
	function firstBlood(page,size){
		$.ajax({
			url:'http://userspace1.macaoeasybuy.com/loveController/queryLoveFriends.easy?id='+postId+'&type='+postType+'&size='+size+'&page='+page+'&order=uptime&descOrAsc=desc&easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				bindScroll('off');
				if(objBtn[0].isComplete) return false;
			},
			success:function(data){
				var html = template.render(goodTemplateHtml,data);
				$('#statistics-goods .statistics-goods-inner').append(html);
				objBtn[0].page+=1;
				if(data.loveList.length == size){
					bindScroll('on',function(){
						mygoodCard(objBtn);
					});
				}else{
					$('#statistics-goods .no-more').css('display','block');
					objBtn[0].isComplete = true;
					bindScroll('off');
				}
				if(page == 0 && data.loveList.length == 0){
					$('#statistics-goods .no-more-good').css('display','block');
					$('#statistics-goods .no-more').css('display','none');
				}
				if(page == 0) pageSelectBindClick();
			}
		});
	}
}
//最近查看宜粉
function myCheckCard(objBtn){
	//最近查看宜粉
	var postType = 12;
	var page = objBtn[0].page;
	var size = 15;
	var checkTamplateHtml = easyBuy.global.template['check-template'];
	firstBlood(page,size);
	function firstBlood(page,size){
		$.ajax({
			url:'http://userspace1.macaoeasybuy.com/seeController/querySeeFriends.easy?id='+postId+'&type='+postType+'&size='+size+'&page='+page+'&order=uptime&descOrAsc=desc&easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				bindScroll('off');
				if(objBtn[0].isComplete) return false;
			},
			success:function(data){
				var newData = data.topicSee;
				if(page == 0){
					var tourists = '<li class="tourists"><div class="respondBox_fandPic"><div>'+newData.touristcount+'</div><div>遊客</div></div><div class="respondBox_fansMess clearfloat"><div></div><div></div></div></li>';
					$('#statistics-looks .statistics-looks-inner').html(tourists);
				}
				var html = template.render(checkTamplateHtml,newData);
				$('#statistics-looks .statistics-looks-inner .tourists').before(html);
				objBtn[0].page+=1;
				if(newData.userList.length == size){
					bindScroll('on',function(){
						myCheckCard(objBtn);
					});
				}else{
					$('#statistics-looks .no-more').css('display','block');
					objBtn[0].isComplete = true;
					bindScroll('off');
				}
			}
		});
	}
}
//相關帖子
function relatedPost(myData){
	var myLabelIndex = $('.statistics-title li').eq(2)[0].selectNum;
	var btn = $('#related-posts-nav li').eq(myLabelIndex);
	var box = $('#related-posts-page>li').eq(myLabelIndex);
	var page = myData.page;
	var size = 12;
	var postState = myData.postState;
	var templateId; //獲取模板Id
	switch(myLabelIndex){
		case 0:
			templateId = 'log-template';
		break;
		case 1:
			templateId = 'life-template';
		break;
		case 2:
			templateId = 'second-template';
		break;
		case 3:
			templateId = 'shot-template';
		break;
		case 4:
			templateId = 'topic-template';
		break;
	}
	if(myLabelIndex != 4){
		//日誌、生活圈、二手、敗家志
		var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrPostsController/QueryPostsByLabel.easy?page='+page+'&rows='+size+'&postState='+postState+'&labelid='+postId+'&easybuyCallback=?';
	}else{
		//話題
		var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrTopicsController/queryTopicByLabel.easy?page='+page+'&rows='+size+'&labelid='+postId+'&easybuyCallback=?'
	}
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			bindScroll('off');
			if(myData.isComplete) return false;
		},
		success:function(data){
			var newData = data.list; //返回來的信息
			console.log(newData);
			var dataLen = newData.classList.length;
			newData.page = page;
			$.each(newData.classList,function(k,y){
				if(myLabelIndex != 4){
					y.postContent = y.postContent.replace(/<.*?>/ig,'').substring(0,110);
					y.postSeeNumber = formatNum(y.postSeeNumber);
					y.postLoveNumber = formatNum(y.postLoveNumber);
					y.replyCount = formatNum(y.replyCount);
				}else{
					y.topicContent = y.topicContent.replace(/<.*?>/ig,'').substring(0,100);
					y.topicSeeNumber = formatNum(y.topicSeeNumber);
					y.topicreplyCount = formatNum(y.topicreplyCount);
					y.topicLoveNumber = formatNum(y.topicLoveNumber);
				}
			});
			var html = template.render(easyBuy.global.template[templateId],newData);
			myData.page++;
			box.find('.post-list-inner').append(html);
			if(myLabelIndex != 4){
				imagesLoaded(box.find('img'),function(){
					var a = waterfall(box,box.find('.pillar-all'),4,0,0,true);
					var sum = arrayGetMax(a);
					box.find('.post-list-inner').css('height',sum+'px');
				});
			}
			if(dataLen == size){
				//繼續
				bindScroll('on',function(){
					relatedPost($('#related-posts-nav li').eq(myLabelIndex).data('data'));
				});
			}else{
				//結束
				myData.isComplete = true;
				bindScroll('off');
				if(dataLen != 0 || page != 0) box.find('.no-more').css('display','block');
			}
		}
	});
}
//相關帖子數量
function relatedPostNum(){
	var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrLabelsController/QueryRelevantLabelCount.easy?id='+postId+'&easybuyCallback=?';
	var boxList = $('#related-posts-page>li');
	$.getJSON(dataUrl,function(data){
		$('#related-posts-nav li').each(function(k){
			var isFirst = k == 0 ? false : true;
			$(this).data('data',{
				postState : data.list[k].postState,
				page : 0,
				isFirst : isFirst,
				isComplete : false
			});
			if(k == 0) relatedPost($(this).data('data'));
			$(this).find('span').html(data.list[k].PostCount);
			$(this).on('click',function(){
				if($(this).hasClass('select')) return false;
				$('.statistics-title li').eq(2)[0].selectNum = k;
				//頁面盒子切換
				$(this).siblings('li').removeClass('select').end().addClass('select');
				boxList.eq(k).siblings('.page-boss').removeClass('select').end().addClass('select');
				//獲取數據並且調用
				var thisData = $(this).data('data');
				if(thisData.isFirst) relatedPost(thisData);
				thisData.isFirst  = false;
				if(!thisData.isComplete){
					bindScroll('on',function(){
						relatedPost(thisData);
					});
				}
			});
		});
	});
}
//点赞
function isClickLove(){
	//請求查看帖子是否點讚過
	$.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/isClickLove.easy?lovetype=10&id='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){
		goodPost(data.isClickLove);
	});
	function goodPost(datas){
		var goodTemplateHtml = easyBuy.global.template['good-template'];
		//帖子點讚
		if(datas == 1){
			$('#good-click-btn').addClass('select');
			cancelPost();
		}else if(datas == 0){
			clickPost();
			if($('#statistics-goods .statistics-goods-inner>li').length == 0){
				secondGood();
			}
		}

		function clickPost(){
			//讃好
			$('#good-click-btn').off('click');
			$('#good-click-btn').on('click',function(){
				var goUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type=10&status=1&easybuyCallback=?';
//				goUrl = addHref(goUrl);
				$.getJSON(goUrl,function(data){
					var html = template.render(goodTemplateHtml,data);
					if($('#statistics-goods .statistics-goods-inner>li').length > 0){
						$('#statistics-goods .statistics-goods-inner').prepend(html);
					}else{
						$('#statistics-goods .no-more-good').css('display','none');
						$('#statistics-goods .statistics-goods-inner').prepend(html);
					}
					if($('.statistics-title li').eq(0)[0].isComplete) $('#statistics-goods .no-more').css('display','block');
					$('#good-count-num')[0].count+=1;
					$('#good-count-num .count-num').html($('#good-count-num')[0].count);
					$('#good-click-btn').addClass('select');
					if($('#praise-post .praise.click').css('display') == 'none') $('#praise-post .praise.click').stop().fadeIn(500).delay(1000).fadeOut(500);
					cancelPost();
				});
				$('#good-click-btn').off('click');
				$('#second-good').off('click');
			});
		}
		function cancelPost(){
			//取消讃好
			$('#good-click-btn').off('click');
			$('#good-click-btn').on('click',function(){
				var goUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type=10&status=0&easybuyCallback=?';
//				goUrl = addHref(goUrl);
				$.getJSON(goUrl,function(data){
					//找到那個id刪除掉然後
					$('#'+data.id+'good-id').remove();
					if($('#statistics-goods .statistics-goods-inner>li').length == 0){
						$('#statistics-goods .no-more-good').css('display','block');
						$('#statistics-goods .no-more').css('display','none');
						secondGood();
					}
					$('#good-count-num')[0].count-=1;
					$('#good-count-num .count-num').html($('#good-count-num')[0].count);
					$('#good-click-btn').removeClass('select');
					if($('#praise-post .praise.cancel').css('display') == 'none') $('#praise-post .praise.cancel').stop().fadeIn(500).delay(1000).fadeOut(500);
					clickPost();
				});
				$('#good-click-btn').off('click');
			});
		}
		function secondGood(){
			$('#second-good').off('click');
			$('#second-good').on('click',function(){
				var goUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type=10&status=1&easybuyCallback=?';
//				goUrl = addHref(goUrl);
				$.getJSON(goUrl,function(data){
					var html = template.render(goodTemplateHtml,data);
					if($('#statistics-goods .statistics-goods-inner>li').length > 0){
						$('#statistics-goods .statistics-goods-inner').prepend(html);
					}else{
						$('#statistics-goods .no-more-good').css('display','none');
						$('#statistics-goods .statistics-goods-inner').prepend(html);
					}
					$('#good-count-num')[0].count+=1;
					$('#good-count-num .count-num').html($('#good-count-num')[0].count);
					$('#good-click-btn').addClass('select');
					if($('#praise-post .praise.click').css('display') == 'none') $('#praise-post .praise.click').stop().fadeIn(500).delay(1000).fadeOut(500);
					cancelPost();
				});
				$('#good-click-btn').off('click');
				$('#second-good').off('click');
				$('#statistics-goods .no-more').css('display','block');
			});
		}
	}
}
//所有帖子(点击量/查看量)
function updateSeeLog(){
	$.getJSON('http://userspace1.macaoeasybuy.com/seeLogController/updateSeeLog.easy?type=12&seeId='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){
//		console.log(data);
		//成功就成功唄，關我屁事
	})
}

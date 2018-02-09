 
 //瀑布流
 function waterfall(outer, item, num, margin, width,flag){
	outer.css('position','relative');
	var totalWidth = outer.width();
	flag = flag == undefined ? false : flag;
	width = flag ? (totalWidth - num * item.width()) / (num - 1) : width;
	var eachWidth = item.width() + width;
	var columNum = num;
	var heightArr = [];
	for(var i = 0; i < columNum; i++) {
		heightArr[i] = 0;
	}
	outer.find('img').imagesLoaded(function(){
		item.each(function(idx, ele) {
			var minIndex = 0;
			var minValue = heightArr[minIndex];
			for(var i = 0; i < heightArr.length; i++) {
				if(heightArr[i] < minValue) {
					minIndex = i;
					minValue = heightArr[i];
				}
			}
			$(ele).css({
				'position': 'absolute',
				left: eachWidth * minIndex,
				top: minValue,
				'visibility' : 'visible'
			});
			var oldHeight = heightArr[minIndex];
			oldHeight += $(ele).outerHeight(true) + margin;
			heightArr[minIndex] = oldHeight;
		});
		outer.css('height',arrayGetMax(heightArr)+'px');
		//获取数组最大值
		function arrayGetMax(a){
			var max = a[0];
			for(var i = 1; i < a.length; i++) {
				if(max < a[i]) {
					max = a[i];
				}
			}
			return max;
		};
		return heightArr;
	});
};
 //轉換數值
 function formatNum(num){
	var str = num + '';//转换成字符串
	var str_num = str.split('.')[0];
	var str_last = str.split('.')[1] == undefined ? '' : '.'+str.split('.')[1];
	var ret_num = '';
	var counter = 0;
	for(var i=str_num.length-1;i>=0;i--){
		ret_num = str_num.charAt(i) + ret_num;
		counter++;
		if(counter==3){
			counter = 0;
			if(i!=0){
				ret_num = ',' + ret_num;
			}
		}}
	return ret_num + str_last;
};
//內容數據
function queryLabelInfo(){
	var sendUrl = 'http://userspace1.macaoeasybuy.com/UserLabelConntroller/queryLabelInfo.easy?id='+postId+'&easybuyCallback=?';
	$.getJSON(sendUrl,function(data){
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
		$('#label-container-title .container-title-about,#editor-box div,#release .release-title span').html(newData.labelName); //標籤名字
		$('#label-container-title .container-title-items div').html('#'+labelTypeHtml+'#'); //標籤類型
		if(newData.describe != undefined || newData.describe != ''){
			$('#introduce-article').html(newData.describe);
		}else{
			$('#introduce-article').addClass('no-more').html('暫時沒有標籤描述...');
		}
		$('#label-update-time').html('創建於'+newData.addtime.split(' ')[0]); //創建時間
		$('#label-look-number').html(formatNum(newData.seeNums)+'宜粉查看');
		$('#label-love-number').html(formatNum(newData.loveNums)+'宜粉讃好');
		
		//查看是否有圖片
		console.log(newData.picture);
		if(newData.picture != undefined && newData.picture!=""){
			$('#label-cover').prepend('<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData.picture+'" alt="" class="label-banner">');
		}else{
			$('#label-cover').addClass('hasShadow').prepend('<p>'+newData.labelName+'</p>');
		}
		$('#label-user-info .info-name span,#founder-other-btn span').html(newData.username); //標籤創建人名字
		var sexHtml = newData.sex == 'Boy' ? 'boy' : 'girl';
		$('#label-user-info .info-name img').attr('src','/img/common/'+sexHtml+'.png'); //用戶性別
		//用戶頭像，Id
		$('#label-user-info .head img').attr({
			'src' : 'http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData.userPic,
			'id' : newData.userId + 'userId'
		});
		var myLabelName = newData.labelName//相關帖子
	});
}
//查看是否關注(並且點讚取消關注)
function checkIsPoint(){
	var ipurl = 'http://userspace1.macaoeasybuy.com/';
	var easyUrl = 'http://userspace.macaoeasybuy.com/';
	var dataUrl = 'http://userspace1.macaoeasybuy.com/userFriendsConntroller/isFriend.easy?userId='+userId+'&labelUserId='+seeUserId+'&easybuyCallback=?';
	var cancelBtn = '<div class="cancel" id="cancel-point">取消關注</div>';
	var addBtn = '<div class="add" id="add-point">加入關注</div>';
	if(!isLogin){
		$('#user-info-about').append(addBtn);
		$('#add-point').on('click',function(){
			alert('還沒登陸，跳到登陸也');
		});
		return false;
	}
	$.getJSON(dataUrl,function(data){
		if(data.result == 'no'){
			//可以加關注
			$('#user-info-about').append(addBtn);
			bindAdd(); //辦定事件
		}else{
			//可以取消關注
			$('#user-info-about').append(cancelBtn);
			bindCancel(); //辦定事件
		}
	});
	//辦定加關注事件
	function bindAdd(){
		$('#add-point').off('click.point');
		$('#add-point').on('click.point',function(){
			$(this).off('click.point');
			addPointFunc();
		});
	}
	//辦定取消關注事件
	function bindCancel(){
		$('#cancel-point').off('click.point');
		$('#cancel-point').on('click.point',function(){
			var self = $(this);
			$('#user-info-focus-box').css('display','block');
			$('#user-info-focus-box .sure-cancel').off('click');
			$('#user-info-focus-box .sure-cancel').on('click',function(){
				self.off('click.point');
				cancelPointFunc();
				$('#user-info-focus-box').css('display','none');
			});
		});
	}
	$('#user-info-focus-box .cancel-sure').on('click',function(){
		$('#user-info-focus-box .sure-cancel').off('click');
		$('#user-info-focus-box').css('display','none');
	})
	//加關注函數
	function addPointFunc(){
		var dataUrl = ipurl+'userFriendsConntroller/addFriend.easy?userId='+userId+'&attentionId='+seeUserId+'&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			if(data.result != 'success') return false;
			$('#add-point').remove();
			$('#user-info-about').append(cancelBtn);
			bindCancel(); //辦定事件
			if($('#user-info-success').css('display') == 'none') $('#user-info-success').fadeIn(500).delay(1000).fadeOut(500);
		});
	}
	//取消關注函數
	function cancelPointFunc(){
		var dataUrl = ipurl + 'userFriendsConntroller/removeFriend.easy?userId='+userId+'&attentionId='+seeUserId+'&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			if(data.fan != 'success') return false;
			$('#cancel-point').remove();
			$('#user-info-about').append(addBtn);
			bindAdd(); //辦定事件
		});
	}
}
//最近查看宜粉
function myCheckCard(){
	var postType = 12; //標籤的是12
	var dataUrl = 'http://userspace1.macaoeasybuy.com/seeController/querySeeFriends.easy?id='+postId+'&type='+postType+'&size=10&page=0&order=uptime&descOrAsc=desc&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var newData = data.result.userList;
		var html = '';
		$.each(newData, function(k,y) {
			html += '<li data-id="'+y.id+'"><a><img data-type="userAvatar" src="//wap.macaoeasybuy.com/'+y.pic+'" alt="" title="'+y.name+'" onerror="this.src=\'/img/common/loading_pc_headPic.png\'"></a></li>';
		});
		$('#recent-look-user').html(html);
	})
}
//点赞
function isClickLove(){
	var goodHtml = '<div id="good-btn"><img src="/img/userspace/userspace_postDetails/icon/albumData4.png" alt="">值得讃好</div>';
	var cancelHtml = '<div id="cancel-good-btn"><img src="/img/social/label/labeldetail/click-good.png" alt="">取消讃好</div>';
	//判斷是否登錄
	if(!isLogin){
		$('#label-btn').prepend(goodHtml);
		$('#good-btn').on('click',function(){
			alert('沒有登錄，跳去登錄頁');
		});
		return false;
	}
	//請求查看帖子是否點讚過
	$.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/isClickLove.easy?lovetype=10&id='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){
		if(data.isClickLove == 0){
			//點讚
			$('#label-btn').prepend(goodHtml);
			goodBind();
		}else{
			//取消點讚
			$('#label-btn').prepend(cancelHtml);
			cancelBind();
		}
	});
	//辦定點讚
	function goodBind(){
		$('#good-btn').off('click.point');
		$('#good-btn').on('click.point',function(){
			$(this).off('click.point');
			goodReq();
		});
	}
	//辦定取消點讚
	function cancelBind(){
		$('#cancel-good-btn').off('click.point');
		$('#cancel-good-btn').on('click.point',function(){
			$(this).off('click.point');
			cancelReq();
		});
	}
	//讃好請求
	function goodReq(){
		var dataUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type=10&status=1&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			$('#good-btn').remove();
			if($('#praise-post .praise.click').css('display') == 'none') $('#praise-post .praise.click').stop().fadeIn(500).delay(1000).fadeOut(500);
			$('#label-btn').prepend(cancelHtml);
			cancelBind();
		});
	}
	//取消請求
	function cancelReq(){
		var dataUrl = 'http://userspace1.macaoeasybuy.com/UserLikeConntroller/changeLove.easy?userId='+userId+'&id='+postId+'&type=10&status=0&easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			$('#cancel-good-btn').remove();
			if($('#praise-post .praise.cancel').css('display') == 'none') $('#praise-post .praise.cancel').stop().fadeIn(500).delay(1000).fadeOut(500);
			$('#label-btn').prepend(goodHtml);
			goodBind();
		});
	}
}
//用戶還創建了其他標籤
function userOtherLabel(){
	var dataUrl = 'http://social1.macaoeasybuy.com/labelSocialConntroller/queryOtherLabel.easy?userId='+userId+'&labelId='+postId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var nameHtml = '';
		var numHtml = '';
		$.each(data.result, function(k,y) {
			nameHtml += '<li>'+y.labelName+'</li>';
			numHtml += '<li>'+y.loveCount+'個讃好</li>';
		});
		$('#userOtherLabel-name').html(nameHtml);
		$('#userOtherLabel-number').html(numHtml);
	});
}
//所有帖子(点击量/查看量)
function updateSeeLog(){
	$.getJSON('http://userspace1.macaoeasybuy.com/seeLogController/updateSeeLog.easy?type=12&seeId='+postId+'&userId='+userId+'&easybuyCallback=?',function(data){
//		console.log(data);
		//成功就成功唄，關我屁事
	})
}
//排行榜
function levelRank(idx){
	var time = idx;
	var dataUrl = 'http://social1.macaoeasybuy.com/labelSocialConntroller/queryLabelRank.easy?time='+time+'&id='+postId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		console.log(data);
		$.each(data.result, function(k,y) {
			y.labelName = y.labelName.replace(/#/g,'');
			y.loveCount = formatNum(y.loveCount);
			y.index = k;
		});
		var len = data.result.length;
		var html = '';
		html = template('level-template',data.result[len - 1]);
		$.each(data.result, function(k,y) {
			if(k != len -1) html += template('level-template',y);
		});
		$('.chart-card-data').eq(idx).html(html);
		// 排行榜點擊事件
		$('.chart-card-data').on('click',function(e){
			var target=e.target;
			if($(target).attr('id')==="underline"){
				var labelId=$(target).parents('[data-id]').attr('data-id');
				location.href="http://social.macaoeasybuy.com/label/labeldetail/labeldetail.html?id="+labelId;
			}
		})
	})
}
//相關帖子
function relatedPost(myData){
	console.log(myData);
	var btn = $('#related-posts-nav li').eq(myLabelIndex);
	var box = $('#container .container-right .related-posts .page .page-boss').eq(myLabelIndex);
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
		var dataUrl = 'http://social1.macaoeasybuy.com/SolrPostsController/QueryPostsByLabel.easy?page='+page+'&rows='+size+'&postState='+postState+'&labelid='+postId+'&easybuyCallback=?';
	}else{
		//話題
		var dataUrl = 'http://social1.macaoeasybuy.com/SolrTopicsController/queryTopicByLabel.easy?page='+page+'&rows='+size+'&labelid='+postId+'&easybuyCallback=?'
	}
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			bindScrollReq('off');
			if(myData.isComplete) return false;
		},
		success:function(data){
			var newData = data.list; //返回來的信息
			var dataLen = newData.classList.length;
			console.log(newData);
			console.log(dataLen);
			newData.page = page;
			$.each(newData.classList,function(k,y){
				if(myLabelIndex != 4){
					y.postContent = y.postContent.replace(/<.*?>/ig,'').substring(0,110);
					y.postSeeNumber = formatNum(y.postSeeNumber);
					y.postLoveNumber = formatNum(y.postLoveNumber);
					y.replyCount = formatNum(y.replyCount);
					if(myLabelIndex == 2){
						y.usedprice = formatNum(y.usedprice);
					}
				}else{
					y.topicContent = y.topicContent.replace(/<.*?>/ig,'').substring(0,100);
					y.topicSeeNumber = formatNum(y.topicSeeNumber);
					y.topicreplyCount = formatNum(y.topicreplyCount);
					y.topicLoveNumber = formatNum(y.topicLoveNumber);
				}
			});
			var html = template(templateId,newData);
			myData.page++;
			box.find('.box-inner').append(html);
			if(myLabelIndex != 4){
				imagesLoaded(box.find('img'),function(){
					var a = waterfall(box,box.find('.pillar-all'),4,0,0,true);
					var sum = arrayGetMax(a);
					function arrayGetMax(a){
						var max = a[0];
						for(var i = 1; i < a.length; i++) {
							if(max < a[i]) {
								max = a[i];
							}
						}
						return max;
					};
					box.find('.box-inner').css('height',sum+'px');
				});
			}
			if(dataLen == size){
				//繼續
				bindScrollReq('on');
			}else{
				//結束
				myData.isComplete = true;
				bindScrollReq('off');
				if(dataLen != 0 || page != 0) box.find('.no-more').css('display','block');
			}
			// 相關帖子點擊事件
			$('.post-log .box-inner').on('click',function(e){
				var target=e.target;
				if($(target).hasClass('shadow-box')){
					var postId=$(target).parents('.pillar-all').attr('data-id');
           			 window.open('http://social.macaoeasybuy.com/easylive/easylivelog/logpostdetail/logpostdetail.html?postId='+postId);
				}
			})
			$('.post-topic .box-inner').on('click',function(e){
				var target=e.target;
				if($(target).hasClass('shadow-box')){
					var topicid=$(target).parents('.post-topic-box').attr('data-id');
					window.open('http://social.macaoeasybuy.com/easylive/easylivebuytopic/buytopicpostdetail/buytopicpostdetail.html?topicId='+topicid);
				}
			})
		}
	});
}
//辦定滾動加載事件
function bindScrollReq(state){
	if(state == 'on'){
		$(window).off('scroll');
		$(window).on('scroll',function(){
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(document).height();
			var windowHeight = $(this).height();
			if(scrollTop + windowHeight >= scrollHeight * 0.6){
				relatedPost($('#related-posts-nav li').eq(myLabelIndex).data('data'));
			}
		});
	}else{
		$(window).off('scroll');
	}
}
//相關帖子數量
function relatedPostNum(){
	var dataUrl = 'http://social1.macaoeasybuy.com/SolrLabelsController/QueryRelevantLabelCount.easy?id='+postId+'&easybuyCallback=?';
	var boxList = $('#container .container-right .related-posts .page .page-boss');
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
				myLabelIndex = k;
				//頁面盒子切換
				$(this).siblings('li').removeClass('select').end().addClass('select');
				boxList.eq(k).siblings('.page-boss').removeClass('select').end().addClass('select');
				//獲取數據並且調用
				var thisData = $(this).data('data');
				if(thisData.isFirst) relatedPost(thisData);
				thisData.isFirst  = false;
				if(!thisData.isComplete) bindScrollReq('on');
			});
		});
	});
}

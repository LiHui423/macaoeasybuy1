$(function(){
	classReq(); //獲取分類
	frontCover(); //封面信息
	queryEasyBuyUserSee(); //最近查看宜粉
	hotTopicReq();//熱門話題
	otherTopicReq(); //其他話題列表
	//話題點擊事件
	topicClickEvent();
});
//獲取分類
function classReq(){
	var dataUrl = 'http://social1.macaoeasybuy.com/easyBuyTopicController/queryShouldbuyClass/9/3.easy?easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var len = data.list.length;
		if(len <= 8){
			var html = template('head-template',data);
			$('#golbal-list-item>div:first-of-type').html(html);
		}else{
			var firstData = {
				list : data.list.splice(0,7)
			}
			var secondData = {
				list : data.list.splice(0,data.list.length)
			}
			var firsthtml = template('head-template',firstData);
			var secondhtml = template('head-template',secondData);
			$('#golbal-list-item>div:first-of-type').html(firsthtml);
			$('#golbal-list-item>div:first-of-type').append(template('arrow-template'));
			$('#golbal-list-item>div:nth-of-type(2)').html(secondhtml);
			$('#more-class-btn').on('click',function(){
				$('#golbal-list-item,.global-nav').addClass('select');
			});
			maskClick($('.global-nav'),function(){
				$('#golbal-list-item,.global-nav').removeClass('select');
			});
		}
		var classTitle = $('#'+classId+'-list-item').addClass('select').find('.global-list-text').text();
		$('#list-hot-instruc span').html(classTitle);
		$('#list-other-instruc span').html(classTitle);
	});
}
//封面信息
function frontCover(){
	request(3);
	//封面信息導航點擊事件
	$("#golbal-list-item").on('click',function(e){
		var target=e.target;
		if($(target).is('div')){
			classId=$(target).parents('.global-list-item').attr('id').split('-')[0];
			$(target).parents('.global-list-item').addClass(' select').siblings().removeClass('select');
			request(classId);
		}else{
		}
	});
	function request(classId){
		var dataUrl = 'http://social1.macaoeasybuy.com/guangGaoController/queryguanggaoInfo/1/'+classId+'.easy?easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			var newData = data.list[0];
			$('#best-count').html(newData.bestCount);
			$('#see-number').html(newData.seeNumber);
			$('#top-artical-title').html(newData.title);
			$('#top-image').html('<img src="//wap.macaoeasybuy.com/'+newData.img+'">');
		});
	}
}
//最近查看宜粉
function queryEasyBuyUserSee(){
	var dataUrl = 'http://social1.macaoeasybuy.com/easyBuyTopicController/QueryEasyBuyUserSee.easy?Type=101&SeeId=0&size=11&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var html = '';
		$.each(data.list, function(k,y) {
			html += '<li><img src="http://wap.macaoeasybuy.com/'+y.Pic+'" onerror="this.src=\'/img/common/loading_pc_headPic.png\'"></li>';
		});
		$('#header-head-img').html(html);
	});
}
//熱門話題
function hotTopicReq(){
	var dataUrl = 'http://social1.macaoeasybuy.com/easyBuyTopicController/queryHotShouldBuy/0/1/'+classId+'.easy?easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		console.log(data);
		var newData = data.list[0];
		//封面
		$('#list-hot-cover').html('<img src="http://wap.macaoeasybuy.com/'+newData.shouldbuygroupPic+'">');
		$('#list-hot-cover').parent().attr('id',newData.id);
		//頭像
		$('#hot-box-main-head-img').html('<img src="http://wap.macaoeasybuy.com/'+newData.adminpic+'" onerror="this.src=\'/img/common/loading_pc_headPic.png\'">');
		//標題
		$('#hot-box-main-head-info-title').html(newData.title);
		//小編名字
		$('#hot-author-name span').html(newData.adminName);
		//發佈時間
		$('#hot-author-time span').html(newData.timeDiff);
		//內容
		$('#hot-content').html(newData.content.replace(/<.*?>/ig,'').substring(0,100));
		//宜粉查看
		$('#hot-look').html(newData.seeNumber);
		//宜粉回應
		$('#hot-response').html(newData.disCount);
		//無縫滾動
		scrollBoxFunc(newData);
	});
	//無縫滾動
	function scrollBoxFunc(newData){
		var scrollBox = $('#hot-comments .hot-comments-inner'); //滾動的盒子
		var html = template('hot-response-template',newData); //獲取模板
		scrollBox.html(html); //添加模板
		var len = newData.usercommentinflist.length;
		if(len == 1) return false;
		var speed = 28; //越大越慢
		var timer = null;
		var oneItem = scrollBox.find('.hot-comments-item').eq(0);
		var oneItemheight = oneItem.outerHeight(true);
		scrollBox.css({
			'top' : -1 * oneItemheight + 'px'
		});
		var aClone = scrollBox.find('.hot-comments-item').eq(0).clone(true);
		var bClone = scrollBox.find('.hot-comments-item').last().clone(true);
		scrollBox.append(aClone);
		scrollBox.prepend(bClone);
		//目前的高度
		var nowTop = parseInt(scrollBox.css('top'));
		timer = setInterval(function(){
			nowTop = parseInt(scrollBox.css('top'));
			if(nowTop <= -1 * len * oneItemheight){
				nowTop = 0;
			}
			scrollBox.css({
				'top' : nowTop - 1
			});
		},speed);
	}
}
//其他話題列表
function otherTopicReq(){
	var page = 0;
	var size = 6;
	var userSeeSize = 12;
	var isComplete = false;
	req();
	//請求
	function req(){
		var dataUrl = 'http://social1.macaoeasybuy.com/easyBuyTopicController/queryShouldBuy/'+page+'/'+size+'/'+classId+'/1/'+userSeeSize+'.easy?easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				scrollReq('off');
				if(isComplete) return false;
			},
			success:function(data){
				console.log(data);
				page += 1;
				$.each(data.list, function(k,y) {
					y.content = y.content.replace(/<.*?>/ig,'').substring(0,110);
					y.seeNumber = y.seeNumber;
					y.disCount = y.disCount;
					y.loveNum = y.loveNum;
				});
				var len = data.list.length;
				var html = template('other-topic-template',data);
				$('#list-other').append(html);
				if(len == size){
					scrollReq('on');
				}else{
					isComplete = true;
					scrollReq('off');
					$('.no-more').css('display','block');
				}
			}
		});
	}
	//滾動
	function scrollReq(state){
		if(state == 'on'){
			$(window).on('scroll.req',function(){
				var scrollTop = $(this).scrollTop();//滾動條高度
				var scrollHeight = $(document).height();
				var windowHeight = $(this).height();
				if(scrollTop + windowHeight >= scrollHeight * 0.6){
					req();
				}
			});
		}else{
			$(window).off('scroll.req');
		}
	}
}
//話題點擊事件
function topicClickEvent(){
	$('#hot-box-main-head-info-title').on('click',function(){
		var postId=$(this).parents('.list-hot-main').attr('id');
		console.log(postId);
		easyBuy.global.pageParameter.postId=postId;
		window.open('http://social.macaoeasybuy.com/easylive/easylivebuytopic/buytopicpostdetail/buytopicpostdetail.html?id='+postId);

	})
	$('#list-other').on('click',function(e){
		var target=e.target;
		if($(target).attr('class')==='box-main-head-info-title'){
			var postId=$(target).parents('.post-topic-box').attr('id');
			console.log(postId);
			easyBuy.global.pageParameter.postId=postId;
			window.open('http://social.macaoeasybuy.com/easylive/easylivebuytopic/buytopicpostdetail/buytopicpostdetail.html?id='+postId);
		}
	})
}

$(function(){
	bannerData();
	queryFairClassInfoFunc();
	townData();
	goTopicDetail();//話題列表點擊事件
})
	
// easyBuy.global.beforeDataJs = function(){
// 	bannerData();
// 	queryFairClassInfoFunc();
// 	townData();
// 	goTopicDetail();//話題列表點擊事件
// }
var mygoodbanner = easyBuy.global.dep.mygoodbanner;
var formatNum = easyBuy.global.dep.formatNum;
var waterfall = easyBuy.global.dep.waterfall;
function mySlider(obj) {
	var sliderObj = obj.slider; //滑動的UL
	var sliderObjChild = sliderObj.children(); //Li 
	var sliderObjChildWidthMargin = parseInt(sliderObjChild.eq(0).css('margin-right'));
	var sliderObjChildWidth = Math.ceil(sliderObjChild.eq(0).width()) + sliderObjChildWidthMargin;
	var pageWidth = (4 * sliderObjChildWidth) - sliderObjChildWidthMargin; //一頁的寬度
	var index = 1;
	var len = sliderObjChild.length;
	var maxNum = Math.ceil(len / 4);
	if(maxNum == 1){
		$('.mdcategory_topicDiv2 .select-number').remove();
		return false;
	}else{
		$('.mdcategory_topicDiv2 .select-number').css('display','block');
	}
	var jpr = $('.jp-hidden').eq(1);
	var jpl = $('.jp-hidden').eq(0);
	getWidth();
	createBtn();
	goBtn();
	eachNumber();
	$('.holder a.jp-current:gt(9)').css('margin-left', '13px');
	function getWidth() {
		sliderObj.css('width', pageWidth * maxNum);
		var a = (4 - len % 4);
		if(a != 0 && a != 4) {
			for(var i = 0; i < a; i++) {
				var h = '<li style="visibility:hidden;"></li>';
				$('#itemContainer').append(h);
			}
		}
	}
	function createBtn() {
		for(var i = 1; i <= maxNum; i++) {
			var html = '<a class="jp-current">' + i + '</a>';
			$('.jp-hidden:last-of-type').before(html);
		}
		checkShow();
		selectBtn(index);
	}
	function selectBtn(index) {
		var btn = $('.holder .jp-current');
		if(btn.eq(index - 1).hasClass('select')) {
			return false;
		} else {
			btn.eq(index - 1).siblings('.jp-current').removeClass('select');
			btn.eq(index - 1).addClass('select');
			myMath()
			function myMath() {
				var page = 15;
				var pageMiddle = Math.ceil(page / 2) + 1;
				if(index < pageMiddle + 1) {
					btn.css('display', 'none');
					for(var i = 0; i < 15; i++) {
						btn.eq(i).css('display', 'inline-block');
						jpr.css('display', 'inline');
						jpl.css('display', 'none');
						btn.eq(maxNum - 1).css('display', 'inline-block');
					}
				} else if((maxNum - index) < 9) {
					btn.css('display', 'none');
					for(var j = maxNum; j >= maxNum - 15; j--) {
						btn.eq(j).css('display', 'inline-block');
						jpl.css('display', 'inline');
						jpr.css('display', 'none');
						btn.eq(0).insertBefore(jpl);
						btn.eq(0).css('display', 'inline-block');
					}
				} else {
					btn.css('display', 'none');
					for(var k = index - 7; k <= index + 7; k++) {
						btn.eq(k - 1).css('display', 'inline-block');
						btn.eq(0).css('display', 'inline-block');
						btn.eq(maxNum - 1).css('display', 'inline-block');
						jpl.css('display', 'inline');
						jpr.css('display', 'inline');
						btn.eq(0).insertBefore(jpl)
					}
				}
				if(maxNum <= 16) {
					jpl.css('display', 'none');
					jpr.css('display', 'none');
				}
			}
		}
	}
	function goBtn() {
		$('.jp-previous').on('click', function() {
			if(sliderObj.is(':animated')) {
				return false;
			} else {
				var index = $('.holder .jp-current.select').html();
				if(index == 1) {
					return false;
				} else {
					index--;
					selectBtn(index);
					sliderAnimate(index, index + 1);
				}
			}
		});
		$('.jp-next').on('click', function() {
			if(sliderObj.is(':animated')) {
				return false;
			} else {
				var index = $('.holder .jp-current.select').html();
				if(index == maxNum) {
					return false;
				} else {
					index++;
					selectBtn(index);
					sliderAnimate(index, index - 1);
				}
			}
		});
	}
	function sliderAnimate(index, oldIndex) {
		var all = $('.artTempEasybuyTopic li');
		var f = index - oldIndex;
		var oldA = 4 * (oldIndex - 1);
		var a = 4 * (index - 1);
		var li = all.slice(a, a + 4);
		if(f > 0) {
			if(f == 1) {
				if(li.eq(0).find('.mdetail_div_topicfont').html().length == 0) {
					getData(li,false,null,index);
				}
				var oLeft = parseInt(sliderObj.css('left'));
				sliderObj.animate({
					left: oLeft - pageWidth
				}, 'easein');
			} else {
				if(li.eq(0).find('.mdetail_div_topicfont').html().length == 0) {
					getData(li,true,'next',index);
				}else{
					sliderAnimateNext();
				}
			}
		}else if(f < 0) {
			if(f == -1) {
				if(li.eq(0).find('.mdetail_div_topicfont').html().length == 0) {
					getData(li,false,null,index);
				}
				var oLeft = parseInt(sliderObj.css('left'));
				sliderObj.animate({
					left: oLeft + pageWidth
				}, 'easein');
			} else {
				if(li.eq(0).find('.mdetail_div_topicfont').html().length == 0) {
					getData(li,true,'prev',index);
				}else{
					sliderAnimatePrev();
				}
			}
		}
		function getData(li,bool,btn,idx) {
			var size = 4;
			var dataUrl = 'http://social1.macaoeasybuy.com/fairQuerySocialController/queryFairTopic.easy?size='+size+'&page='+(idx-1)+'&easybuyCallback=?';
			$.getJSON(dataUrl,function(data){
				var newData = data.result;
				$.each(newData.fairTopicList,function(k,y){
					li.eq(k).find('.title-img').html('<img src="'+easyBuy.global.osURL+y.pic+'">');
					li.eq(k).find('.mdetail_div_topic_detail').attr('data-id',y.id);
					li.eq(k).find('.mdetail_div_topicfont').html('<a id="underline">'+y.title+'</a>');
					li.eq(k).find('.mdetail_topic_text').html(y.content.replace(/<.*?>/ig,'').substring(0,70));
				});
				if(bool==true && btn == 'next'){
					sliderAnimateNext();
				}else if(bool==true && btn == 'prev'){
					sliderAnimatePrev();
				}
			});
		}
		function sliderAnimateNext(){
			var oLeft = parseInt(sliderObj.css('left'));
			var cloneLi = all.slice(a, a + 4).clone(true);
			var oldB = all.eq(oldA + 3);
			var oWidth = parseInt(sliderObj.css('width'));
			sliderObj.css('width', oWidth + pageWidth);
			oldB.after(cloneLi);
			sliderObj.animate({
				left: oLeft - pageWidth
			}, 'easein', function() {
				cloneLi.remove();
				$(this).css('left', -1 * pageWidth * (index - 1));
				sliderObj.css('width', oWidth);
			});
		}
		function sliderAnimatePrev(){
			var oLeft = parseInt(sliderObj.css('left'));
			var cloneLi = all.slice(a, a + 4).clone(true);
			var oldB = all.eq(oldA);
			var oWidth = parseInt(sliderObj.css('width'));
			sliderObj.css('width', oWidth + pageWidth);
			oldB.before(cloneLi);
			sliderObj.css('left', oLeft - pageWidth);
			var ooLeft = parseInt(sliderObj.css('left'));
			sliderObj.animate({
				left: ooLeft + pageWidth
			}, 'easein', function() {
				cloneLi.remove();
				$(this).css('left', -1 * pageWidth * (index - 1));
				sliderObj.css('width', oWidth);
			});
		}
	}
	function eachNumber() {
		$('.jp-current').each(function(k) {
			$(this).on('click', function() {
				if(sliderObj.is(':animated')) {
					return false;
				} else {
					var s = $('.holder .jp-current.select').html();
					if((k + 1) == parseInt($('.holder .jp-current.select').html())) {
						return false;
					} else {
						sliderAnimate(k + 1, s);
						selectBtn(k + 1);
					}
				}
			});
		});
	}
	function checkShow() {
		var a = $('.holder .jp-current');
		if(maxNum > 15) {
			a.eq(14).nextAll('.jp-current').css('display', 'none');
			jpr.css('display', 'inline');
			var last = a.eq(maxNum - 1);
			last.insertAfter(jpr);
			last.css('display', 'inline-block');
		} else {
			jpl.css('display', 'none');
			jpr.css('display', 'none');
			var last = a.eq(maxNum - 1);
			last.insertBefore(jpr);
			last.css('display', 'inline-block');
		}
	}
}

//吸頂
function menuScroll() {
	var box = $('.nav-select');
	var s = $('.scroll-reference');
	box.children().each(function() {
		$(this).css('width', 100 / box.children().length + '%');
	});
	$(window).on('scroll.topNav', function() {
		var boxOffset = s.offset().top - box.height();
		var m = $(this).scrollTop();
		if(m >= boxOffset) {
			box.addClass('fixed');
			box.css('left',$('.container-swapper').offset().left - $(this).scrollLeft());
		} else {
			box.removeClass('fixed');
			box.css('left','0px');
		}
	});
	$(window).on('resize.topNav',function(){
		if(box.hasClass('fixed')){
			box.css('left',$('.container-swapper').offset().left - $(this).scrollLeft());
		}
	});
	tipsLeft();
}
//提示的left值
function tipsLeft() {
	var tips = $('#container .nav-select li .tips');
	var boxLeft = $('.container-swapper').offset().left;
	var boxWidth = parseInt($('.container-swapper').css('width'));
	var arrowOffset = 50;
	tips.each(function() {
		var self = $(this);
		var tipsWidth = parseInt($(this).css('width'));
		
		var tipsOffsetLeft = $(this).offset().left - parseInt($('#container .nav-select').css('border-width')) - boxLeft;
		var arrowWidth = parseInt($(this).find('.arrow-tips').css('width'));
		
		var fatherWidth = parseInt($(this).parent('li').css('width'));
		if(tipsOffsetLeft + tipsWidth > boxWidth){
			//出去了
			$(this).find('.arrow-tips').css('left',tipsWidth - arrowOffset - arrowWidth);
			var c  = (tipsWidth - arrowOffset - arrowWidth) + (arrowWidth/2);
		}else{
			//在裡面
			$(this).find('.arrow-tips').css('left',arrowOffset);
			var c = arrowOffset + (arrowWidth/2);
		}
		
		var a = $(this).parent().height() + (parseInt($(this).parent().css('padding-bottom')) * 2);
		var b = $(this).find('.arrow-tips').height();
		$(this).css({
			left: (fatherWidth/2) - c,
			top: a + b,
			display:'none'
		});
		$(this).parent('li').hover(function(){
			self.css('display','block');
		},function(){
			self.css('display','none');
		});
	});
}
//點擊菜單切換選項卡
function menuSelect() {
	var page = $('#container .nav-select li');
	page.each(function(k) {
		$(this)[0].flag = (k != 0);
		$(this).on('click', function() {
			if($(this).hasClass('select')) {
				return false;
			} else {
				var showBox = $('#'+$(this).data('data').id + '-queryFairClassInfo-box');
				$(this).siblings().removeClass('select').end().addClass('select');
				showBox.siblings('.mdcategory_title').removeClass('select').end().addClass('select');
				if($(this)[0].flag){
					queryFairClassDetailInfo($(this).data('data').id,$(this).data('data').fairClassName);
					queryFairList($(this));
					$(this)[0].flag = false;
				}
				if($('#nav-scroll').css('position') == 'fixed'){
					window.scrollTo($(window).scrollLeft(),$('.scroll-reference').offset().top - $('#nav-scroll').outerHeight(true) + parseInt($('#nav-scroll').css('border-width')));
				}
			}
		});
	});
}



//banner輪播圖
function bannerData() {
	var ipUrl = 'http://social1.macaoeasybuy.com';
	var easyUrl = 'http://social.macaoeasybuy.com';
	var dataUrl = ipUrl + '/fairQuerySocialController/queryFairMess.easy?easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var html = '';
		$.each(data.fairMess, function(k,y) {
			if(y.titlephoto==""){
				html += '<div><img src=//img.macaoeasybuy.com/img/common/loadnow.jpg></div>';
			}else{
				html += '<div><img src=http://wap.macaoeasybuy.com/'+y.titlephoto+'></div>';
			}
		});
		$('#groupBuy_banner .bannerCon .scroll').append(html);
		mygoodbanner({
			box: $('#groupBuy_banner .bannerCon'),
			banner: $('#groupBuy_banner .scroll'),
			now : false,
			goLeft: $('#groupBuy_banner .before'),
			goRight: $('#groupBuy_banner .after'),
			childMargin: parseInt($('#groupBuy_banner .scroll').children().eq(0).css('margin-right')),
			timer : false
		},false);
	});
}
//導航
function queryFairClassInfoFunc(){
	var ipUrl = 'http://social1.macaoeasybuy.com';
	var easyUrl = 'http://social.macaoeasybuy.com';
	var dataUrl = ipUrl + '/fairQuerySocialController/queryFairClassInfo.easy?easybuyCallback=?';
	var queryFairClassInfoTemplate = 'queryFairClassInfo-template';
	var infoBoxTemplate = 'info-box-template';
	$.getJSON(dataUrl,function(data){
		queryFairClassDetailInfo(data.result[0].id,data.result[0].fairClassName); //請求內容頭信息
		var html = template(queryFairClassInfoTemplate,data);
		$('#nav-scroll').html(html);
		imagesLoaded($('#nav-scroll img'),function(){
			menuScroll();
			menuSelect();
		});
		var boxHtml = template(infoBoxTemplate,data);
		$('#contaner-box').append(boxHtml);
		$.each(data.result, function(k,y) {
			$('#' + y.id + '-queryFairClassInfo').data('data',y);
			$('#' + y.id + '-queryFairClassInfo').data('data-list',{
				page : 0,
				isComplete : false
			});
		});
		queryFairList($('#'+data.result[0].id+'-queryFairClassInfo')); //請求內容
	});
}
//導航數據內容
function queryFairClassDetailInfo(id,className){
	var ipUrl = 'http://social1.macaoeasybuy.com';
	var easyUrl = 'http://social.macaoeasybuy.com';
	var dataUrl = ipUrl + '/fairQuerySocialController/queryFairClassDetailInfo.easy?id='+id+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		console.log(data);
		$('#' + id + '-queryFairClassInfo-box .mdetail_div_topic_right .number').each(function(k){
			switch(k){
				case 0:
					$(this).html(formatNum(data.result[0].seeCount));
				break;
				case 1:
					$(this).html(formatNum(data.result[0].totalCount));
				break;
				case 2:
					$(this).html(formatNum(data.result[0].loveCount));
				break;
			}
		});
		var html = ''
		$.each(data.result[0].userList, function(k,y) {
			html += '<li data-id='+y.id+'><img data-type="userAvatar" src=http://mbuy.oss-cn-hongkong.aliyuncs.com/' + y.pic + '></li>';
		});
		html = html == '' ? '<div>暫無人訪問</div>' : html;
		$('#' + id + '-queryFairClassInfo-box .artTempFans').html(html);
	});
}
//頁面內容
function queryFairList(obj){
	var data = obj.data('data');
	var dataList = obj.data('data-list');
	var id = data.id;
	var className = data.fairClassName;
	var page = dataList.page;
	var size = 30;
	var showBox = $('#'+id+'-queryFairClassInfo-box .full-box .inner-box');
	var ipUrl = 'http://social1.macaoeasybuy.com';
	var easyUrl = 'http://social.macaoeasybuy.com';
	var dataUrl = ipUrl + '/fairQuerySocialController/queryFairList.easy?id='+id+'&size='+size+'&page='+page+'&easybuyCallback=?';
	var ideasTemplate = 'ideas';
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			bindScrollItem('off');
			if(dataList.isComplete) return false;
		},
		success:function(data){
			data.page = page;
			data.itemType = id;
			$.each(data.result, function(k,y) {
				y.seeCount = formatNum(y.seeCount);
				y.loveCount = formatNum(y.loveCount);
				y.moneyNew = formatNum(y.moneyNew);
				$('#'+y.id+'-item-'+id+' .laster-main').html(y.content);
			});
			var html = template(ideasTemplate,data);
			showBox.append(html);
			$.each(data.result, function(k,y) {
				$('#'+y.id+'-item-'+id+' .laster-main').html(y.content);
			});
			waterfall(showBox.parent(), showBox.find('.pillar-all'), 6, 0, 28);
			obj.data('data-list').page += 1;
			if(data.result.length == size){
				bindScrollItem('on',obj);
			}else{
				obj.data('data-list').isComplete = true;
				showBox.parent().siblings('.no-more').css('display','block');
				bindScrollItem('off');
			}
			if(page == 0 && data.result.length ==0){
				showBox.parent().siblings('.no-more').css('display','none');
			}
		}
	});
}
function bindScrollItem(state,obj){
	if(state == 'on'){
		$(window).off('scroll.itemData');
		$(window).on('scroll.itemData',function(){
		　	var scrollTop = $(this).scrollTop();
		　	var scrollHeight = $(document).height();
		　	var windowHeight = $(this).height();
		　	if(scrollTop + windowHeight >= scrollHeight * 0.6){
				queryFairList(obj);
		　	}
		});
	}else{
		$(window).off('scroll.itemData');	
	}
}
//市集話題
function townData() {
	var size = 4;
	var dataUrl = 'http://social1.macaoeasybuy.com/fairQuerySocialController/queryFairTopic.easy?size='+size+'&page=0&easybuyCallback=?';
	var townDataHtmlTemplate = 'townDataHtml';
	$.getJSON(dataUrl,function(data){
		var newData = data.result;
		console.log(newData);
		var html = template(townDataHtmlTemplate, newData);
		$('#itemContainer').html(html);

		//多少個宜粉查看
		$('#mdcategory_TopicFansNum').html(formatNum(newData.seeCount));
		//一開始的四個數據
		$.each(newData.fairTopicList,function(k,y){
			$('.mdetail_div_topic_detail .title-img').eq(k).html('<img src="'+easyBuy.global.osURL+y.pic+'">');
			$('.mdetail_div_topic_detail').eq(k).attr('data-id',y.id);
			$('.mdetail_div_topicfont').eq(k).html('<a id="underline">'+y.title+'</a>');
			$('.mdetail_topic_text').eq(k).html(y.content.replace(/<.*?>/ig,'').substring(0,70));
		});
		mySlider({
			slider: $('#itemContainer')
		});
	});
}
//市集話題點擊跳轉事件
function goTopicDetail(){
	$('#itemContainer').on('click',function(e){
		var target=e.target;
		console.log(target);
		if($(target).attr('id')==="underline"){
			console.log('34');
			var topicId=$(target).parent().parent().attr('data-id');
			window.open('http://social.macaoeasybuy.com/market/treasureclassifydetail/fairofficialpost/fairofficialpost.html?topicId='+topicId);
		}
	})
	$('body').on('click',function(e){
		var target=e.target;
		if($(target).hasClass('pillar-shadow')){
			var postId=$(target).parents('.pillar-all').attr('id').split('-')[0];
			window.open('http://social.macaoeasybuy.com/market/treasureclassifydetail/fairpostdetail/fairpostdetail.html?id='+postId);
		}
	})
}

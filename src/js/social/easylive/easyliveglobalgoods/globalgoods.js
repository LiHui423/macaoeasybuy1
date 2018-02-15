var classId =easyFrame.getUrlParam('id') || 14;
var formatNum = easyBuy.global.dep.formatNum;
var maskClick = easyBuy.global.dep.maskClick;
$(function(){
	classReq(); //獲取分類
	frontCover(); //封面信息
	queryEasyBuyUserSee(); //最近查看宜粉
	otherTopicReq(); //其他話題列表
});
//獲取分類
function classReq(){
//	var dataUrl = 'http://shopping1.macaoeasybuy.com/easyBuyTopicController/queryShouldbuyClass/17/10.easy?easybuyCallback=?';
	var dataUrl = 'http://social1.macaoeasybuy.com/easyBuyTopicController/queryShouldbuyClass/17/10.easy?easybuyCallback=?';
	var headTemplate = easyBuy.global.template['head-template'];
	$.getJSON(dataUrl,function(data){
		var len = data.list.length;
		if(len <= 8){
			var html = template.render(headTemplate,data);
			$('#golbal-list-item>div:first-of-type').html(html);
			var lifirst=$('#golbal-list-item>div:first-of-type').find('li');
			$(lifirst[0]).addClass('select');
			$('#golbal-list-item>div:first-of-type>li').not('li:first').removeClass('select');
		}else{
			var firstData = {
				list : data.list.splice(0,7)
			}
			var secondData = {
				list : data.list.splice(0,data.list.length)
			}
			var firsthtml = template.render(headTemplate,firstData);
			var secondhtml = template.render(headTemplate,secondData);
			var arrowTemplate = easyBuy.global.template['arrow-template'];
			$('#golbal-list-item>div:first-of-type').html(firsthtml);
			$('#golbal-list-item>div:first-of-type').append(template.render(arrowTemplate,{}));
			$('#golbal-list-item>div:nth-of-type(2)').html(secondhtml);
			// $('#more-class-btn').on('click',function(){
			// 	$('#golbal-list-item,.global-nav').toggleClass('select');
			// });
			// maskClick($('.global-nav'),function(){
			// 	$('#golbal-list-item,.global-nav').removeClass('select');
			// });
		}
		
		var classTitle = $('#'+classId+'-list-item').addClass('select').find('.global-list-text').text();
		$('#list-hot-instruc span').html(classTitle);
		$('#list-other-instruc span').html(classTitle);
	});
}
//封面信息
function frontCover(){
	$('#golbal-list-item').on('click',function(e){
		var target=e.target;
		if($(target).is('div')){
			classId=$(target).parents('.global-list-item').attr('id').split('-')[0];
			console.log(classId);
			$(target).parents('.global-list-item').addClass(' select').siblings().removeClass('select');
			var dataUrl = 'http://social1.macaoeasybuy.com/guangGaoController/queryguanggaoInfo/1/'+classId+'.easy?easybuyCallback=?';
			$.getJSON(dataUrl,function(data){
				if(data.list.length == 0) return false;
				var newData = data.list[0];
				console.log(newData);
				$('#best-count').html(formatNum(newData.bestCount));
				$('#see-number').html(formatNum(newData.seeNumber));
				if(newData.title===""){
					$('#top-artical-title').html('暫無介紹');
				}else{
					$('#top-artical-title').html(newData.title);
				}
				if(newData.img===""){
					$('#top-image').html('<img src="//wap.macaoeasybuy.com/uploadfile/201709/20170920091145636415387059556426.jpg">');
				}else{
					$('#top-image').html('<img src="//wap.macaoeasybuy.com/'+newData.img+'">');
				}
			});
		}
	})
	var dataUrl = 'http://social1.macaoeasybuy.com/guangGaoController/queryguanggaoInfo/1/'+classId+'.easy?easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		if(data.list.length == 0) return false;
		var newData = data.list[0];
		$('#best-count').html(formatNum(newData.bestCount));
		$('#see-number').html(formatNum(newData.seeNumber));
		$('#top-artical-title').html(newData.title);
		$('#top-image').html('<img src=//wap.macaoeasybuy.com/'+newData.img+'>');
	});
}
//最近查看宜粉
function queryEasyBuyUserSee(){
//	var dataUrl = 'http://shopping1.macaoeasybuy.com/easyBuyTopicController/QueryEasyBuyUserSee.easy?Type=101&SeeId=0&size=11&easybuyCallback=?';
	var dataUrl = 'http://social1.macaoeasybuy.com/easyBuyTopicController/QueryEasyBuyUserSee.easy?Type=101&SeeId=0&size=11&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var html = '';
		$.each(data.list, function(k,y) {
			if(y.Pic===null||y.Pic===""){
				html += '<li data-id="'+y.id+'"><img data-type="userAvatar" src="/src/img/common/loading_pc_headPic.png"></li>';
			}else{
				html += '<li data-id="'+y.id+'"><img data-type="userAvatar" src="http://wap.macaoeasybuy.com/'+y.Pic+'"></li>';
			}
		});
		$('#header-head-img').html(html);
	});
}

//其他話題列表
function otherTopicReq(){
	var page = 0;
	var size = 6;
	var userSeeSize = 12;
	var isComplete = false;
	var otherPostTemplate = easyBuy.global.template['other-post'];
	req();
	//請求
	console.log(classId);
	function req(){
//		var dataUrl = 'http://shopping1.macaoeasybuy.com/easyBuyTopicController/queryShouldBuy/'+page+'/'+size+'/'+classId+'/1/'+userSeeSize+'.easy?easybuyCallback=?';
		var dataUrl = 'http://social1.macaoeasybuy.com/easyBuyTopicController/queryShouldBuy/'+page+'/'+size+'/'+classId+'/1/'+userSeeSize+'.easy?easybuyCallback=?';
		console.log(dataUrl);
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
					y.seeNumber = formatNum(y.seeNumber);
					y.disCount = formatNum(y.disCount);
					y.loveNum = formatNum(y.loveNum);
				});
				var len = data.list.length;
				var html = template.render(otherPostTemplate,data);
				$('#list').append(html);
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

easyBuy.global.startJs = function(){
	userState();
}
var mathValueLength = easyBuy.global.dep.mathValueLength;
function userState(){
	if(yezState == 'mine'){
		$('#labeler-header').remove();
		editorLabel();
	}else{
		$('#editor-box').remove();
		$('#editor-label-btn').remove();
	}
	pageSelect();//定義默認值
	updateSeeLog(); //所有帖子(点击量/查看量)
	queryLabelInfo();//內容數據
	isClickLove();//點讚
	
	myRelease();
}
//查看，讃好，帖子選項卡
function pageSelect(){
	window.postNum = 0;
	$('.statistics-title li').each(function(k){
		$(this)[0].isFirst = true;
		if(k != 2){
			$(this)[0].page = 0;
			$(this)[0].isComplete = false;
		}else{
			//準備點什麼東西好呢
			$(this)[0].selectNum = 0;
		}
		if(k==0){
			mygoodCard($(this));
			$(this)[0].isFirst = false;
		}
	});
}
//綁定點擊事件
function pageSelectBindClick(){
	$('.statistics-title li').each(function(k){
		$(this).on('click',function(){
			var self = $(this);
			bindScroll('off');
			$(this).siblings('li').removeClass('select').end().addClass('select');
			$('.statistics-page>ul').eq(k).siblings('ul').css('display','none').end().css('display','block');
			//如果是第一次請求，則點擊直接請求
			//否則是點擊之後去辦定事件
			if($(this)[0].isFirst){
				$(this)[0].isFirst = false;
				switch(k){
					case 1:
						myCheckCard($(this));
					break;
					case 2:
						relatedPostNum();
					break;
				}
			}else{
				switch(k){
					case 0:
						if(!self[0].isComplete){
							bindScroll('on',function(){
								mygoodCard(self);
							});
						}
					break;
					case 1:
						if(!self[0].isComplete){
							bindScroll('on',function(){
								myCheckCard(self);
							});
						}
					break;
					case 2:
						var goData = $('#related-posts-nav li').eq(self[0].selectNum).data('data');
						if(!goData.isComplete){
							bindScroll('on',function(){
								relatedPost(goData);
							});
						}
					break;
				}
			}
		});
	});
}
//綁定滾動事件
function bindScroll(state,fn){
	if(state == 'on'){
		$(window).off('scroll.data');
		$(window).on('scroll.data',function(){
			var scrollTop = $(this).scrollTop();
			var scrollHeight = $(document).height();
			var windowHeight = $(this).height();
		　 if(scrollTop + windowHeight >= scrollHeight * 0.6){
				fn();
		　 }
		});
	}else{
		$(window).off('scroll.data');
	}
}
//使用此標籤發佈帖子按鈕
function myRelease(){
	$('#other-use-post').on('click',function(){
		$('#release').css('display','block');
	});
	$('#release .cancel-btn').on('click',function(){
		$('#release').css('display','none');
	});
}
$(function(){
	pageSelect();
	bannerImgMiddle($('#foodBannerul li'));
	albumCollects();
	mygoodbanner({
		box:$('.showPicBox'),
		banner:$('#foodBannerul'),
		now:$('.showPicBox').find('.now'),
		goLeft:$('#goLeft'),
		goRight:$('#goRight')
	});
});
function bannerImgMiddle(box){
	box.each(function(){
		easyBuy.global.dep.imgOnMiddle($(this));
	});
}
function pageSelect(){
	$('.statistics .statistics-title li').each(function(k){
		$(this).on('click',function(){
			$(this).siblings('li').removeClass('select').end().addClass('select');
			$('.statistics .statistics-page .statistics-page-item').eq(k).siblings('ul').removeClass('select');
			$('.statistics .statistics-page .statistics-page-item').eq(k).addClass('select');
		})
	});
}
function albumCollects(){
	$('#collects').on('click',function(){
		$('#album-collect').addClass('select');
	});
	var hasAddAlbum = false;
	var isCanCollect = false;
	listerSelect();
	//關閉窗口
	$('#album-collect .close-collect').on('click',function(){
		$('#album-collect').removeClass('select');
		if(hasAddAlbum){
			$('.collect-list ul li').eq(0).remove();
		}
		hasAddAlbum = false;
		$('.collect-list-title').html('');
		$('.collect-create input').val('');
		$('.collect-list ul li').removeClass('select');
	});
	//監聽選擇
	function listerSelect(){
		$('.collect-list ul li').each(function(){
			$(this).off('click');
			$(this).on('click',function(){
				if($(this).hasClass('select')){
					$(this).removeClass('select');
					isCanCollect = false;
					changeCollectBtnColor(isCanCollect);
					$('.collect-list-title').html('');
				}else{
					$(this).siblings('li').removeClass('select').end().addClass('select');
					isCanCollect = true;
					changeCollectBtnColor(isCanCollect);
					$('.collect-list-title').html($(this).find('.collect-list-div').eq(1).html());
				}
			})
		});
	}
	//改變採集專輯按鈕
	function changeCollectBtnColor(flag){
		if(flag){
			$('.want-collect').removeClass('cannot-collect');
		}else{
			$('.want-collect').addClass('cannot-collect');
		}
	}
	//添加專輯
	$('.create-btn').on('click',function(){
		var title = $('.collect-create input')[0].value;
		if(title.length==0){
			return false;
		}else{
			isCanCollect = true;
			changeCollectBtnColor(isCanCollect);
			var html = '<li class="select"><div class="collect-list-div"><img class="collect-list-div-img" src="/img/social/easylive/no-collect.png" alt=""><div class="collect-select"><img src="/img/social/easylive/collect-select.png" alt=""></div></div><div class="collect-list-div">'+title+'</div></li>';
			$('.collect-list ul li').removeClass('select');
			if(hasAddAlbum == false){
				$('.collect-list ul').prepend(html);
			}else{
				$('.collect-list ul li').eq(0).replaceWith(html);
			}
			$('.collect-list-title').html(title);
			hasAddAlbum = true;
			listerSelect();
		}
	});
}

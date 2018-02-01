//不需要用戶信息
function beforeDataJs(){
	themeDetailFunc(); //請求列表內容
	themeDetailsVisit(); //主題廣告詳細頁最近查看模板
}
//沒有用戶數據
function noInfoStartJs(){
	redBagNoLogin();
}
//在獲取用戶信息之後觸發，無論有無信息
function startJs(data){
	canClickMop(data.id); //查看是否有無領過紅包
}
//紅包
function redBag(state,userId){
	if(state == 0){
		var timer = null;
		//領取紅包字體的動畫
		$('.redbag_notOpen').hover(function(){
			timer = setInterval(function(){
				$('.redbag_notOpen').find('img').animate({
					width:'45px',
					height:'45px'
				}).animate({
					width:'35px',
					height:'35px'
				});
			},50)
		},function(){
			clearInterval(timer)
			$('.redbag_notOpen').find('img').stop(true,true)
		});
		//點擊領取紅包的動畫
		$('.redbag_notOpen').on('click',function(){
			$(this).off('click');
			saveMopReq(userId);
		});
	}else{
		$('.redbag_notOpen').css('opacity','0');
		$('.redbag_openIng').css('opacity','0');
		$('.redbag_openUp').css('opacity','0');
		$('.redbag_openOver').css('opacity','1');
	}
}
//紅包沒登錄
function redBagNoLogin(){
	$('.redbag_notOpen').on('click',function(){
		alert('您沒有登錄，是否跳到登錄頁');
	});
}
//hover效果
function eachGoodHover(box){
	box.find('.themeDetails_eachPic_border').hover(function(){
		$(this).find('.themeDetails_eachPic_cover').stop().fadeIn('fast');
	},function(){
		$(this).find('.themeDetails_eachPic_cover').stop().fadeOut('fast');
	});
}

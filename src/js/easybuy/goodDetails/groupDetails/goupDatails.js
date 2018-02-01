


function groupBuyEndHover(hoverBtn,hoverBox){
	hoverBtn.hover(function(){
		if($(this).find(hoverBox).is(':animated')){
			return;
		}else{
			$(this).find(hoverBox).fadeIn();
		}
	},function(){
		$(this).find(hoverBox).fadeOut();
	})
}

function groupDetailsGoodsTab(){
	$('.museumDetails_othersGood_titleRight').on('click',function(){
		if($('.groupBuy_goodTab').hasClass('groupDetailsone')){
			$('.groupBuy_goodTab').addClass('groupDetailstwo').removeClass('groupDetailsone');
		}else if($('.groupBuy_goodTab').hasClass('groupDetailstwo')){
			$('.groupBuy_goodTab').addClass('groupDetailsthree').removeClass('groupDetailstwo');
		}else if($('.groupBuy_goodTab').hasClass('groupDetailsthree')){
			$('.groupBuy_goodTab').addClass('groupDetailsone').removeClass('groupDetailsthree');
		}
	})
}

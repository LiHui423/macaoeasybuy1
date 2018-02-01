function beforeDataJs(){
	getThemeMuseum();
	getThemeShop();
}
//鼠標移入
function moreThemeHover(box){
	$(box).find('.moreThemeMain_left_top').hover(function(){
		$(this).find('.moreThemeMain_left_pic').stop().hide('slow');
		$(this).find('.moreThemeMain_left_intro').stop().show('slow');
	},function(){
		$(this).find('.moreThemeMain_left_pic').stop().show('slow');
		$(this).find('.moreThemeMain_left_intro').stop().hide('slow');
	});
}

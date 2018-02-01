$(function(){
	chooseSort()
})

/*商店搜索結果頁勾選條件*/
function chooseSort(){
	$('.search_resultBox_choosesort').on('click',function(){
		$(this).addClass('search_resultBox_checkBox_curr').parents('.search_resultBox_sortEach').siblings().find('.search_resultBox_choosesort').removeClass('search_resultBox_checkBox_curr')
		Order = $(this).data('main');
		DescOrAsc = $(this).data('descorasc');
		console.log(DescOrAsc)
	})
	$('.search_resultBox_only').on('click',function(){
		if($(this).hasClass('search_resultBox_checkBox_curr')){
			$(this).removeClass('search_resultBox_checkBox_curr')
			NewOrNot = 0
		}else{
			$(this).addClass('search_resultBox_checkBox_curr')
			NewOrNot = 1
		}
	})
	$('.search_resultBox_sort_btn').on('click',function(){
		loadResult()
	})
}

/*展示商品切換*/
function shopScrollFunc(){
	var i ;
	$('.search_shop_show_btnLeft').click(function(){
		i = $(this).siblings('.search_shop_show_main').data('page')
		if(i > 1){
			if($(this).siblings(".search_shop_show_main ").find('ul').is(":animated")){
				return;
			}else{
				l = parseInt($(this).siblings(".search_shop_show_main ").find('ul').css("left")) + 912;
				$(this).siblings(".search_shop_show_main ").find('ul').animate({
					"left":l
				},800)
				i--;
				$(this).siblings('.search_shop_show_main').data('page',i)
			}
		}else{
			return;
		}
	})
	
	$('.search_shop_show_btnRight').click(function(){
		i = $(this).siblings('.search_shop_show_main').data('page')
		if(i < 2){
			if($(this).siblings(".search_shop_show_main ").find('ul').is(":animated")){
				return;
			}else{
				l = parseInt($(this).siblings(".search_shop_show_main ").find('ul').css("left")) - 912;
				$(this).siblings(".search_shop_show_main ").find('ul').animate({
					"left":l
				},800)
				i++;
				$(this).siblings('.search_shop_show_main').data('page',i)
			}
		}else{
			return;
		}
	})
}

/*搜索結果數量*/
function resultNum(){
	var allnum = $('.search_result_title').find('span:nth-of-type(2)').text();
	$('.search_result_title').find('span:nth-of-type(1)').text(decodeURI(decodeURI(keyword)));
	$('.search_result_null p span').text(decodeURI(decodeURI(keyword)));
	if(allnum == 0){
		$('.search_result_null').show();
		$('.search_resultBox').hide();
	}else if(allnum <= 6){
		$('.search_result_null').hide();
		$('.tcdPageCode').hide()	
	}else{
		$('.search_result_null').hide();
		$('.search_resultBox').show();
		/*分頁調用*/
		var pageCount = Math.ceil(allnum/6)
		$(".tcdPageCode").createPage({
			pageCount: pageCount,
			current: 1,
			backFn: function(p) {
				scrollListTop()
				choosePage(p-1)
			}
		});
	}
}

/*分頁回頂*/
function scrollListTop(){
	var topHeight = $('.search_result_main').offset().top;
	$("body").animate({
		scrollTop:topHeight
	},0);
}

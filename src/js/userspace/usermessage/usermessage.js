$(function(){
	userMessType()
	userMessMove()
});

function userMessType(){
	$('.noslideLi').click(function(){
		$(this).find('.newMessIcon').addClass('hide')
		$(this).addClass('usermess_nav_curr').siblings().removeClass('usermess_nav_curr');
		type = $(this).data('type');
		receiveType = $(this).data('receivetype');
		loadMessList()
	})
	$('.slideLi').hover(function(){
		$(this).find('.usermess_nav_slide').stop().slideDown('fast')
	},function(){
		$(this).find('.usermess_nav_slide').stop().slideUp('fast')
	})
	$('.usermess_nav_slide ul li').click(function(event){
		$(this).parents('.slideLi').find('.slideLiText').text($(this).find('span:nth-of-type(1)').text())
		$(this).find('span:nth-of-type(2)').remove()
		$(this).parents('.usermess_nav_slide').stop().slideUp('fast')
		$(this).addClass('usermess_nav_slide_curr').siblings().removeClass('usermess_nav_slide_curr');
		if($(this).parents('li').hasClass('noslideLi')){
			$(this).parents('.slideLi').siblings('.noslideLi').removeClass('usermess_nav_curr')
		}
		if($(this).parent('ul').hasClass('choosesee')){
			ifLook = $(this).data('iflook');
		}else{
			type = $(this).data('type');
			receiveType = $(this).data('receivetype');	
		}
		event.stopPropagation();
		loadMessList()
	})
}
/*通知動作*/
function userMessMove(){
	$('.usermess_main_listEach_right').off('click').on('click',function(){
		$(this).parents('.usermess_main_listEach').removeClass('usermess_main_listEach_up').addClass('usermess_main_listEach_dark').siblings('.usermess_main_listEach').addClass('usermess_main_listEach_up');
		if($(this).parents('.usermess_main_listEach').hasClass('usermess_main_listEach_dark')){
			var ids = $(this).parents('.usermess_main_listEach').data('id')
			hadsee(ids)
		}
		var windowHeight = $(window).height();
		var clickTop = $(this).parents('.usermess_main_listEach').offset().top - windowHeight/8;
		$('body,html').animate({
			scrollTop:clickTop
		},300);
	})
	$('.usermess_main_listEach_slideup').off('click').on('click',function(event){
		$(this).parents('.usermess_main_listEach').addClass('usermess_main_listEach_up')
		event.stopPropagation();
		
		var windowHeight = $(window).height();
		var clickTop = $(this).parents('.usermess_main_listEach').offset().top - windowHeight/3;
		$('body,html').animate({
			scrollTop:clickTop
		},300);
	})
	/*單獨勾選*/
	$('.usermess_check_each').off('click').on('click',function(){
		/*規則是需要先判斷是否已經查看過了,查看過了才能刪除*/
		if($(this).hasClass('usermess_check_each_curr')){
			$(this).removeClass('usermess_check_each_curr')
			$('.usermess_check_all').removeClass('usermess_check_all_curr');
			if($('.usermess_check_each_curr').length == 0){
				$('.mark_btn').removeClass('mark_btn_curr').find('span:nth-of-type(2)').text(0)
			}else{
				$('.mark_btn').find('span:nth-of-type(2)').text($('.usermess_check_each_curr').length)
			}
			$('.delete_btn').find('span:nth-of-type(3)').text($('.usermess_check_each_curr').length)
		}else{
			$(this).addClass('usermess_check_each_curr');
			if($('.usermess_check_each_curr').length == $('.usermess_main_listEach').length){
				$('.usermess_check_all').addClass('usermess_check_all_curr')
			}else{
				$('.usermess_check_all').removeClass('usermess_check_all_curr')
			}
			$('.delete_btn').find('span:nth-of-type(3)').text($('.usermess_check_each_curr').length)
			$('.mark_btn').addClass('mark_btn_curr').find('span:nth-of-type(2)').text($('.usermess_check_each_curr').length)
		}
	})
	/*全部勾選*/
	$('.usermess_check_all').off('click').on('click',function(){
		if($(this).hasClass('usermess_check_all_curr')){
			$(this).removeClass('usermess_check_all_curr')
			$('.usermess_check_each').removeClass('usermess_check_each_curr')
			$('.mark_btn').removeClass('mark_btn_curr').find('span:nth-of-type(2)').text(0);
			$('.delete_btn').find('span:nth-of-type(3)').text('0')
		}else{
			$(this).addClass('usermess_check_all_curr')
			$('.usermess_check_each').addClass('usermess_check_each_curr')
			$('.mark_btn').addClass('mark_btn_curr').find('span:nth-of-type(2)').text($('.usermess_check_each_curr').length)
			$('.delete_btn').find('span:nth-of-type(3)').text($('.usermess_check_each_curr').length)
		}
	})
	
	$('.mark_btn').off('click').on('click',function(){
		var idlists = '';
		$('.usermess_check_each_curr').each(function(index){
			if($(this).parents('.usermess_main_listEach').hasClass('usermess_main_listEach_dark')){
				return;
			}else{
				if($('.usermess_check_each_curr').length-1==index){
					idlists = idlists +	$(this).parents('.usermess_main_listEach').data('id');
				}else{
					idlists = idlists +	$(this).parents('.usermess_main_listEach').data('id') + ',';
				} 
			}
		})
		hadsee(idlists)
		$('.usermess_check_each_curr').parents('.usermess_main_listEach').addClass('usermess_main_listEach_dark');
		$('.usermess_check_each').removeClass('usermess_check_each_curr');
		$('.usermess_check_all').removeClass('usermess_check_all_curr');
		$(this).removeClass('mark_btn_curr').find('span:nth-of-type(2)').text(0);
		$('.delete_btn').find('span:nth-of-type(3)').text('0')
	})
	
	$('.delete_btn').off('click').on('click',function(){
		var curr = $('.usermess_check_each_curr').length;
		var currsee = $('.usermess_check_each_curr').parents('.usermess_main_listEach_dark').length;
		var idlists = '';
		if(curr == currsee){
			$('.usermess_check_each_curr').each(function(index){
				if($('.usermess_check_each_curr').length-1==index){
					idlists = idlists +	$(this).parents('.usermess_main_listEach').data('id');
				}else{
					idlists = idlists +	$(this).parents('.usermess_main_listEach').data('id') + ',';
				} 
			})
		}else{
			if($('.usermess_nav_curr').hasClass('noslideLi_easy')){
				easydelete()
			}else{
				$('.usermess_check_each_curr').each(function(index){
					if($('.usermess_check_each_curr').length-1==index){
						idlists = idlists +	$(this).parents('.usermess_main_listEach').data('id');
					}else{
						idlists = idlists +	$(this).parents('.usermess_main_listEach').data('id') + ',';
					} 
				})
			}
		}
		deletemess(idlists)
	})
}

/*宜買部分的刪除*/
function easydelete(){
	var curr = $('.usermess_check_each_curr').length;
	var idlists='';
	var deleidlists=''
	curr.each(function(){
		if($(this).parents('.usermess_main_listEach').hasClass('usermess_main_listEach_dark')){
			return;
		}else{
			idlists = idlists +	$(this).parents('.usermess_main_listEach').data('id') + ',';			
		}
	})
	curr.each(function(){
		deleidlists = deleidlists +	$(this).parents('.usermess_main_listEach').data('id') + ',';
	})
	idlists = idlists.Substring(0,idlists.Length - 1);
	deleidlists = deleidlists.Substring(0,deleidlists.Length - 1);
	$.getJSON("http://192.168.3.123:8092/yez_easyBuyMall_userSpace/userNoticleController/updateUserSystemInfo.easy?systemSeeId="+idlists+"&easybuyCallback=?",function(data){
		$.getJSON("http://192.168.3.123:8092/yez_easyBuyMall_userSpace/userNoticleController/deleteSystemInfo.easy?systemSeeId="+deleidlists+"&easybuyCallback=?",function(data){
			
		})
	})
}

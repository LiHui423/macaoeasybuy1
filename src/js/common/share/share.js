$(function(){
	sharePostBox()
	dofristshare()
	shareMain()
})
//分享好友
function sharePostBox(){
	var shareBox = $('.share-out');
	shareBoxFunc();
	easyBuy();
	
	function shareBoxFunc() {
		//分享選項卡
		shareBox.find('.share-out-nav li').on('click',function(){
			$(this).addClass('select').siblings().removeClass('select');
			var type = $(this).data('type');
			$('.' + type).addClass('select').siblings('.share-out-page-items').removeClass('select');
		})
	}

	function easyBuy(){
		//好友選項卡
		$('.easybuy-content-nav-item').each(function(k) {
			$(this).on('click', function() {
				if($(this).hasClass('select')) {
					return;
				} else {
					$(this).siblings('.easybuy-content-nav-item').removeClass('select').end().addClass('select');
					$('.easybuy-fans-outer li').eq(k).siblings('li').removeClass('select');
					$('.easybuy-fans-outer li').eq(k).addClass('select');
				}
			});
		});
		//選擇好友
		$('.easybuy-fans-selecter .easybuy-fans-item').each(function() {
			$(this).on('click', function() {
				if($(this).hasClass('select')) {
					$(this).removeClass('select');
				} else {
					$(this).addClass('select');
				}
			});
		});
		//監聽並且限定字數;
		mathValueLength($('#easybuy-bombBox_input .textarea-item'), $('#easybuy-bombBox_input .textareaInput'), 150);
	}
}
function dofristshare() {
    var title = encodeURIComponent(sessionStorage.facebookText);
    var link = encodeURIComponent(sessionStorage.facebookUrl);
    $('.facebook_btn').click(function(){
    	window.location.href = "https://www.facebook.com/share.php??s=100&p[url]=" + link + "&p[title]=" + title;
    })
}

function shareMain(){
	console.log(sessionStorage.picUrl)
	$('.bombMain_leftTitle').text(sessionStorage.facebookText)
	$('.bombMain_leftMain').text(sessionStorage.introText)
	$('.bombMain_left').find('img').attr("src",sessionStorage.picUrl);
}


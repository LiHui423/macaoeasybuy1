$(function(){
	changePath()
})

/*換一換*/
function changePath(){
	$('.museumDetails_othersGood_titleRight').on('click',function(){
		if($('.museumDetails_othersGood_showBox').hasClass('changePath')){
			$('.changePath ul li .museumDetails_othersGood_each:nth-child(2)').stop(true,true).animate({
				opacity: 0
			})
			
			$('.changePath  ul li .museumDetails_othersGood_each:nth-child(1)').stop(true,true).animate({
				opacity: 1
			},600)
			$('.museumDetails_othersGood_showBox').removeClass('changePath');
		}else{
			$('.museumDetails_othersGood_showBox').addClass('changePath');
			$('.changePath  ul li .museumDetails_othersGood_each:nth-child(1)').stop(true,true).animate({
				opacity: 0
			})
			
			$('.changePath  ul li .museumDetails_othersGood_each:nth-child(2)').stop(true,true).animate({
				opacity: 1
			},600)
		}
	})
}

/*計算折扣*/
function calcCost(){
	var cost = $('.goodMessBox_messBox_eachNowPrice span').text()/$('.goodMessBox_messBox_eachOldPrice span').text()
	var finalCost = parseFloat(cost*10).toFixed(1)
	$('.goodMessBox_messBox_eachDiscount').html(finalCost+"折")
	if(finalCost < 6){
		$('.goodMessBox_messBox_eachPrice span:nth-child(3)').show()
	}else{
		$('.goodMessBox_messBox_eachPrice span:nth-child(3)').hide()
	}
}

easyBuy.global.beforeDataJs = function(){
	goodDetails();
	otherGoodShow();
}
/*計算數量寬度*/
function clacWidth(){
	var last = $('.goodMessBox_messBox_Remaining').text();
	var all = $('.goodMessBox_messBox_All').text();
	if(last == '0'){
		$('.goodMessBox_messBox_limitedBox_curr').css('width','0px');
	}else if(last == all){
		$('.goodMessBox_messBox_limitedBox_curr').css('width','270px');
	}else{
		var width = (last/all)*270 + 10;
		$('.goodMessBox_messBox_limitedBox_curr').width(width)
	}
}
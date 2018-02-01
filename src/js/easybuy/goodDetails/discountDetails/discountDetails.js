$(function(){
	var t = setInterval(discountDetailsCountDown,10)
})

function discountDetailsCountDown(){
	var over_date = new Date(new Date(new Date().setHours(24,0,0,0)).getTime()-1)
	var current_date = new Date(); // 獲得一個固定的當前時間的值
	// 計算差值
	var difference = over_date - current_date;
	// 初始化單位
	var _second = 1000,
		_minute = _second * 60,
		_hour = _minute * 60,
		_day = _hour * 24;
	// 計算時間
	var hours = Math.floor((difference % _day) / _hour),
		minutes = Math.floor((difference % _hour) / _minute),
		seconds = Math.floor((difference % _minute) / _second),
		minseconds = Math.floor((difference % _second)/10);
	// 強制顯示兩位
	hours = (String(hours).length >= 2) ? hours : '0' + hours;
	minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
	seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;
	minseconds = (String(minseconds).length >= 2) ? minseconds : '0' + minseconds;
	// 賦值
	$('.disconutDetails_countTimeLeft').find('.disconutDetails_hours_first').text(String(hours).substr(0, 1))
	$('.disconutDetails_countTimeLeft').find('.disconutDetails_hours_second').text(String(hours).substr(-1))
	$('.disconutDetails_countTimeLeft').find('.disconutDetails_min_first').text(String(minutes).substr(0, 1))
	$('.disconutDetails_countTimeLeft').find('.disconutDetails_min_second').text(String(minutes).substr(-1))
	$('.disconutDetails_countTimeLeft').find('.disconutDetails_second_first').text(String(seconds).substr(0, 1))
	$('.disconutDetails_countTimeLeft').find('.disconutDetails_second_second').text(String(seconds).substr(-1))
	$('.disconutDetails_countTimeLeft').find('.disconutDetails_minsecond_first').text(String(minseconds).substr(0, 1))
	$('.disconutDetails_countTimeLeft').find('.disconutDetails_minsecond_second').text(String(minseconds).substr(-1))
};

function currentDate(){
	//獲取當地的時間
	var date = new Date();
	// 將獲取到的時間轉化為UTC格式
	var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
	// 計算算入偏移量后的當地時間
	var new_date = new Date(utc + (3600000 * 8))
	return new_date;
};

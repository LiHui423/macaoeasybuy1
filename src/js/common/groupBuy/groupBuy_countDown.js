$(function(){
	beginCount();
	imgCount();
	clacTimeFormat();
})

function beginCount(){
	var timeNum = 0;
	var interval_begin = setInterval(function(){
		calcDownCount(timeNum);
		timeNum++;
	}, 1000);
}

function imgCount(){
	var timeNum2 = 0;
	interval_img = setInterval(function(){
		calcDownCountNotice(timeNum2);
		timeNum2++;
	}, 1000);
}

function calcDownCount(timeNum) {
	var $groupBuy_goodsEach = $(".groupBuy_goodsEach_begin");
	$.each($groupBuy_goodsEach, function(){
		var begindate = $(this).find(".begindate").val();
		var overdate = $(this).find(".overdate").val();
		var nowdate = $(this).find(".nowdate").val();
		var joinNumber = $(this).find(".joinPeopleNunber").text();
		var allNumber = $(this).find(".allPeopleNunber").text();
		if(joinNumber == allNumber){
			$(this).addClass("groupBuy_begin_finished");
		}
		var target_date = new Date(overdate), // 結束時間
			begin_date = new Date(begindate), // 開始時間
			now_date = new Date(nowdate); // 獲得一個固定的當前時間的值 
			
		// 計算差值
		var difference = target_date - now_date - timeNum * 1000,
			alltime = target_date - begin_date,
			passtime = now_date - timeNum * 1000 - begin_date,
			percentage = passtime / alltime;
			percentage = percentage.toFixed(5);
		if(difference > 0){
			$(this).find(".progressBar_curr").width(Math.floor(percentage*240) + "px");
		}else{
			$(this).find(".progressBar_curr").css("width","248px");
			$(this).find(".progressBar_curr").css("border-top-right-radius","30px");
			$(this).find(".progressBar_curr").css("border-bottom-right-radius","30px");
		}
		// 初始化單位
		var _second = 1000,
			_minute = _second * 60,
			_hour = _minute * 60,
			_day = _hour * 24;

		// 計算時間
		var days = Math.floor(difference / _day),
			hours = Math.floor((difference % _day) / _hour),
			minutes = Math.floor((difference % _hour) / _minute),
			seconds = Math.floor((difference % _minute) / _second);
		// 強制顯示兩位
		days = (String(days).length >= 2) ? days : '0' + days;
		hours = (String(hours).length >= 2) ? hours : '0' + hours;
		minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
		seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;
		// 賦值
		$(this).find(".groupBuy_begin_leastTime").find('.group_days').text(days);
		$(this).find(".groupBuy_begin_leastTime").find('.group_hours').text(hours);
		$(this).find(".groupBuy_begin_leastTime").find('.group_mins').text(minutes);
		$(this).find(".groupBuy_begin_leastTime").find('.group_seconds').text(seconds);
	});
}

function calcDownCountNotice(timeNum2) {
	var $groupBuy_goodsEach = $(".groupBuy_goodsEach_notice");
	$.each($groupBuy_goodsEach, function(){
		var begindate_notice = $(this).find(".noticeTime").val();
		var nowdate = $(this).find(".nowdate").val();
		var begin_date = new Date(begindate_notice), // 開始時間
			now_date = new Date(nowdate); // 獲取一個服務器的當前時間
		// 計算差值
		var difference = begin_date - now_date - timeNum2 * 1000;
		// 初始化單位
		var _second = 1000,
			_minute = _second * 60,
			_hour = _minute * 60,
			_day = _hour * 24;

		// 計算時間
		var days = Math.floor(difference / _day),
			hours = Math.floor((difference % _day) / _hour),
			minutes = Math.floor((difference % _hour) / _minute),
			seconds = Math.floor((difference % _minute) / _second);

		// 強制顯示兩位
		days = (String(days).length >= 2) ? days : '0' + days;
		hours = (String(hours).length >= 2) ? hours : '0' + hours;
		minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
		seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;
		// 賦值
		$(this).find(".groupBuy_goodsEach_reciprocal").find('.group_notice_days').text(days);
		$(this).find(".groupBuy_goodsEach_reciprocal").find('.group_notice_hours').text(hours);
		$(this).find(".groupBuy_goodsEach_reciprocal").find('.group_notice_mins').text(minutes);
		$(this).find(".groupBuy_goodsEach_reciprocal").find('.group_notice_seconds').text(seconds);
		// 賦值給開始時間
		begin_month = begin_date.getMonth() + 1;
		begin_day = begin_date.getDate();
		begin_hour = begin_date.getHours();
		begin_minute = begin_date.getMinutes();
		begin_second = begin_date.getSeconds();
		
		begin_month = (String(begin_month).length >= 2) ? begin_month : '0' + begin_month;
		begin_day = (String(begin_day).length >= 2) ? begin_day : '0' + begin_day;
		begin_hour = (String(begin_hour).length >= 2) ? begin_hour : '0' + begin_hour;
		begin_minute = (String(begin_minute).length >= 2) ? begin_minute : '0' + begin_minute;
		begin_second = (String(begin_second).length >= 2) ? begin_second : '0' + begin_second;
		
		$(this).find(".groupBuy_goodsEach_beginTime").find('.beginTime_month').text(begin_month);
		$(this).find(".groupBuy_goodsEach_beginTime").find('.beginTime_day').text(begin_day);
		$(this).find(".groupBuy_goodsEach_beginTime").find('.beginTime_hour').text(begin_hour);
		$(this).find(".groupBuy_goodsEach_beginTime").find('.beginTime_minite').text(begin_minute);
		$(this).find(".groupBuy_goodsEach_beginTime").find('.beginTime_second').text(begin_second);
	});
}

function calcMuseumBegin() {
	var $groupBuy_goodsEach = $(".museum_willSellBoxEach");
	$.each($groupBuy_goodsEach, function(){
		var begindate_notice = $(this).find(".museumBeginTime").val();
		var begin_date = new Date(begindate_notice), // 開始時間
			current_date = currentDate(); // 獲得一個固定的當前時間的值
		// 計算差值
		var difference = begin_date - current_date;
		// 初始化單位
		var _second = 1000,
			_minute = _second * 60,
			_hour = _minute * 60,
			_day = _hour * 24;

		// 計算時間
		var days = Math.floor(difference / _day),
			hours = Math.floor((difference % _day) / _hour),
			minutes = Math.floor((difference % _hour) / _minute),
			seconds = Math.floor((difference % _minute) / _second);

		// 強制顯示兩位
		days = (String(days).length >= 2) ? days : '0' + days;
		hours = (String(hours).length >= 2) ? hours : '0' + hours;
		minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
		seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;
		// 賦值
		$(this).find(".museum_willSellBoxEach_reciprocal").find('.willSellBoxEach_days').text(days);
		$(this).find(".museum_willSellBoxEach_reciprocal").find('.willSellBoxEach_hours').text(hours);
		$(this).find(".museum_willSellBoxEach_reciprocal").find('.willSellBoxEach_mins').text(minutes);
		$(this).find(".museum_willSellBoxEach_reciprocal").find('.willSellBoxEach_seconds').text(seconds);
	});
}


/*先假設後臺傳過來的時間和本地的一樣*/
function currentDate(){
	//獲取當地的時間
	var date = new Date();
	// 將獲取到的時間轉化為UTC格式
	var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
	// 計算算入偏移量后的當地時間
	var new_date = new Date(utc + (3600000 * 8))
	return new_date;
};

function clacTimeFormat(){
	var $groupBuy_end_goodsEach = $(".groupBuy_end_goodsEach");
	$.each($groupBuy_end_goodsEach, function() {
		var end_overTime = $(this).find(".GroupBuy_end_overTime").val();
		
		var end_overTime_date = new Date(end_overTime);
		end_overTime_month = end_overTime_date.getMonth() + 1;
		end_overTime_day = end_overTime_date.getDate();
		end_overTime_hour = end_overTime_date.getHours();
		end_overTime_minute = end_overTime_date.getMinutes();
		end_overTime_second = end_overTime_date.getSeconds();
		
		overTime_month = (String(end_overTime_month).length >= 2) ? end_overTime_month : '0' + end_overTime_month;
		overTime_day = (String(end_overTime_day).length >= 2) ? end_overTime_day : '0' + end_overTime_day;
		overTime_hour = (String(end_overTime_hour).length >= 2) ? end_overTime_hour : '0' + end_overTime_hour;
		overTime_minute = (String(end_overTime_minute).length >= 2) ? end_overTime_minute : '0' + end_overTime_minute;
		overTime_second = (String(end_overTime_second).length >= 2) ? end_overTime_second : '0' + end_overTime_second;
		
		$(this).find(".GroupBuy_end_overTimeBox").find('.end_overTime_month').text(overTime_month);
		$(this).find(".GroupBuy_end_overTimeBox").find('.end_overTime_day').text(overTime_day);
		$(this).find(".GroupBuy_end_overTimeBox").find('.end_overTime_hour').text(overTime_hour);
		$(this).find(".GroupBuy_end_overTimeBox").find('.end_overTime_minite').text(overTime_minute);
		$(this).find(".GroupBuy_end_overTimeBox").find('.end_overTime_second').text(overTime_second);
	});
}

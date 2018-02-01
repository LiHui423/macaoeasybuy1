var reqObj = {
	page : 0,
	size : 2, //一次請求兩個商店
	GoodsNameKeyWord : '',
	ShopNameKeyWord : '',
	TimeStart : '',
	TimeEnd : '',
	FilterState : 0,
	isComplete : false
}
function startJs(){
	countOtderTopicInfo(); //訂單數量統計
	getShopOrders(); //數據
	otherGoodShow(); //底部商品
	
	slideSelecBindClick(); //下拉選項
	dateFunc(); //日曆
	
}
//日曆
function dateFunc(){
	var a = new pickerDateRange('completed_searchBox_timeBtn',{
		defaultText : ' - ',
		calendars:1,
		startToday:false,
		stopToday:true,
		autoSubmit:true,
//		monthRangeMax:1,
		defaultText: ' - ',
		isClickCancel:true,
		isScrollCancel : true,
		success:function(obj){
			window.reqObj.TimeStart = obj.startDate;
			window.reqObj.TimeEnd = obj.endDate;
			$('.completed_searchBox_timeBar span').html(window.reqObj.TimeStart + ' - ' + window.reqObj.TimeEnd);
		}
	});
	$('#cancel_time_search').on('click',function(){
		window.reqObj.TimeStart = '';
		window.reqObj.TimeEnd = '';
		$('.completed_searchBox_timeBar span').html('');
	});
}
//下拉選項
function slideSelecBindClick(){
	$('.completed_showpic_main_btn').on('click',function(){
		$(this).siblings('.completed_showpic_mainslide').slideToggle('fast');
	});
	$('.completed_showpic_mainslide li').on('click',function(){
//		var sta = $(this).parents('.completed_stateSelect').index(); // 1 售後     2  曬圖
		var idx = $(this).index(); // 點擊第幾個選項
		window.reqObj.FilterState = idx;
		$(this).siblings('li').removeClass('completed_aftersell_slide_curr').end().addClass('completed_aftersell_slide_curr');
		$(this).parents('.completed_showpic_mainslide').slideUp('fast').siblings('.completed_showpic_main_btn').find('.completed_showpic_main_text').html($(this).text());
	})
	maskClick('.completed_showpic_mainslide',function(){
		$('.completed_showpic_mainslide').slideUp('fast');
	},'slideSelect');
}

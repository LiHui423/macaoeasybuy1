var getBeforeDate = easyBuy.global.dep.getBeforeDate;
easyBuy.global.startJs = function(){
	userInfoPageView();
	getSentimentData(); //統計數量
	//配置Canvas圖標信息
	var paraObj = {
		timeRangeStyle:'auto',//標尺時間是按年顯示 'year','month','auto'
		lineWidth:2,//折線寬度
		lineColor:'rgba(233,137,0,1)',//折線顏色
		bgColor:'rgba(233,137,0,.4)',//背景顏色
		scaleWidth:2,//標尺寬度
		scaleColor:'rgba(233,137,0,1)',//標尺字體顏色
		scaleSize:'14px',//標尺字體大小
		scaleDashedColor:'#aaa',//標尺虛線顏色
		scaleSolidColor:'#888',//標尺實線顏色
		radius:6,//圓點半徑
		bigDotColor:'rgba(233,137,0,.4)',//大圓點顏色
		smallDotColor:'rgba(233,137,0,1)',//小圓點顏色
		hoverDotColor:'rgba(233,137,0,1)',//鼠標移動上去圓點顏色
		dotRadio:1.7,//小圓點與大圓點比例 (數值越小,小圓點越大)
		marginVertical:35,//上下距離
		marginAlign:60,//兩邊距離
		calibration:6,//橫坐標標尺長度
		outline:40,//坐標值的兩邊漏出的距離（小龜頭）
		maxScaleNum:3,//縱坐標分成多少行
		scaleStyle:'solid', // 標尺的樣式  'solid' 實線  'dashed' 虛線
		tolerantNum:12,//圓點周圍的值(鼠標hover上這個區域都可以顯示矩形彈框)
		rectWidth:112,//矩形寬
		rectHeight:45,//矩形高
		rectMargin:6,//矩形邊距
		rectColor:'rgba(84,84,86,1)',//矩形背景顏色
		lineOneText:'^time^',//顯示文字形式(第一行) time是個變量(變量兩邊用^分割)
		lineTwoText:'閱讀數：^data^',//顯示文字形式(第二行) data是個變量(變量兩邊用^分割)
		rectOneTextColor:'#fff',//矩形字體顏色(第一行)
		rectTwoTextColor:'#fff',//矩形字體顏色(第二行)
		rectOneTextSize:'13px',//矩形字體大小(第一行)
		rectTwoTextSize:'13px',//矩形字體大小(第二行)
		rectOnePosition:-5,//字體垂直位置(第一行)
		rectTwoPosition:13,//字體垂直位置(第二行)
		rectOneTextAlign:1,//字體水平位置(第一行)
		rectTwoTextAlign:1,//字體水平位置(第二行)
	};
	fansChange('fans-change-date',paraObj); //粉絲變化
	fansChange('interactive-change-date',paraObj); //互動變化
	fansChange('space-change-date',paraObj);//我的空間
	fansChange('mine-change-date',paraObj); //我的發佈
}
//設置樣式（用戶信息按鈕加個底色）
function userInfoPageView(){
	var timer = null;
	timer = setInterval(function(){
		if($('#go-editor-userinfo').length != 0){
			clearInterval(timer);
			$('#go-editor-userinfo').addClass('select');
		}
	},1);
}
function fansChange(id,paraObj) {
	var newDate = getBeforeDate(0);
	var oldDate = getBeforeDate(7);
	var idName = id.split('-date')[0];
	var a = new pickerDateRange(id, {
		startDate: newDate,
		endDate: oldDate,
		defaultText: ' - ',
		calendars: 1,
		startToday: false,
		stopToday: true,
		autoSubmit: true,
		monthRangeMax: 1,
		defaultText: ' - ',
		success: function(obj) {
			queryFansVariation(idName,paraObj,obj.startDate,obj.endDate);
		},
		isSelectHide: true, //自己添加的，選擇完成后是否隱藏日曆 （默認為false）
		isScrollCancel : true
	});
	queryFansVariation(idName,paraObj,oldDate,newDate);
}
function getSentimentData(){
	//凈增粉絲數
	var queryUserPopularity = 'http://userspace.macaoeasybuy.com/userPopularityController/queryUserPopularity.easy?userId='+userId+'&easybuyCallback=?';
	$.getJSON(queryUserPopularity,function(data){
		var newData = data.userPopularity;
		showData($('#fans-add'),newData);
	});
	//帖子閱讀數
	var queryUserReadCount = 'http://userspace.macaoeasybuy.com/userPopularityController/queryUserReadCount.easy?userId='+userId+'&easybuyCallback=?';
	$.getJSON(queryUserReadCount,function(data){
		var newData = data.userPopularity;
		showData($('#post-read'),newData);
	});
	//帖子讃好數
	var queryUserLoveCount = 'http://userspace.macaoeasybuy.com/userPopularityController/queryUserLoveCount.easy?userId='+userId+'&easybuyCallback=?';
	$.getJSON(queryUserLoveCount,function(data){
		var newData = data.userPopularity;
		showData($('#post-good'),newData);
	});
	//互動數
	var queryUserHuDongCount = 'http://userspace.macaoeasybuy.com/userPopularityController/queryUserHuDongCount.easy?userId='+userId+'&easybuyCallback=?';
	$.getJSON(queryUserHuDongCount,function(data){
		var newData = data.userPopularity;
		showData($('#users-interactive'),newData);
	});
	//空間瀏覽量
	var queryUserPageViewsCount = 'http://userspace.macaoeasybuy.com/userPopularityController/queryUserPageViewsCount.easy?userId='+userId+'&easybuyCallback=?';
	$.getJSON(queryUserPageViewsCount,function(data){
		var newData = data.userPopularity;
		showData($('#users-browse'),newData);
	});
	function showData(box,newData){
		box.find('.num').html(newData.variation);//變化量
		box.find('.prev-day span').html(newData.lastDayPercentage);//較前日
		box.find('.prev-week span').html(newData.lastMonthPercentage);//較上週
		box.find('.prev-month span').html(newData.lastWeekPercentage);//較上月
		box.find('.compare').css('visibility','visible');
	}
}
function queryFansVariation(id,paraObj,beginDate,finalDate){
	var upId = id+'-up';
	var downId = id+'-down';
	if(id == 'fans-change'){
		//粉絲變化
		var dataUrl = 'http://userspace.macaoeasybuy.com/userPopularityController/queryFansVariation.easy?userId='+userId+'&beginDate='+beginDate+'&finalDate='+finalDate+'&easybuyCallback=?';
	}else if(id == 'interactive-change'){
		//互動變化
		var dataUrl = 'http://userspace.macaoeasybuy.com/userPopularityController/queryInteractionVariation.easy?userId='+userId+'&beginDate='+beginDate+'&finalDate='+finalDate+'&easybuyCallback=?';
	}else if(id == 'space-change'){
		//我的空間
		var dataUrl = 'http://userspace.macaoeasybuy.com/userPopularityController/queryMySpace.easy?userId='+userId+'&beginDate='+beginDate+'&finalDate='+finalDate+'&easybuyCallback=?';
	}else if(id == 'mine-change'){
		//我的發佈
		var dataUrl = 'http://userspace.macaoeasybuy.com/userPopularityController/queryPublishCount.easy?userId='+userId+'&beginDate='+beginDate+'&finalDate='+finalDate+'&easybuyCallback=?';
	}
	$.getJSON(dataUrl,function(data){
		if(id == 'fans-change'){
			//粉絲變化
			var newData = data.fansList.list;
			var upData = data.fansList.firstCount;
			var downData = data.fansList.secondCount;
		}else if(id == 'interactive-change'){
			//互動變化
			var newData = data.interactionList.list;
			var upData = data.interactionList.firstCount;
			var downData = data.interactionList.secondCount;
		}else if(id == 'space-change'){
			//我的空間
			var newData = data.spaceList.list;
			var upData = data.spaceList.firstCount;
			var downData = data.spaceList.secondCount;
		}else if(id == 'mine-change'){
			//我的發佈
			var newData = data.publishList.list;
			var upData = data.publishList.firstCount;
			var downData = data.publishList.secondCount;
		}
		$('#'+upId+'-num span').html(upData);
		$('#'+downId+'-num span').html(downData);
		var dateArr = [];
		var upArr = [];
		var downArr = [];
		$.each(newData, function(k,y) {
			dateArr.push(y.time);
			upArr.push(y.firstcount);
			downArr.push(y.senondcount);
		});
		new Chart({
			id:upId,//盒子ID
			dataArr:upArr,//數據數組
			timeRange:dateArr
		},paraObj);
		new Chart({
			id:downId,//盒子ID
			dataArr:downArr,//數據數組
			timeRange:dateArr
		},paraObj);
	});
}
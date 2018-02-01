function dateSignIn(state){
	if(state == 0){
		console.log('未簽到');
		$('.integral .integral-img').on('click',function(){
			$.ajax({
				url:'http://shopping.macaoeasybuy.com/bonusPointsController/SignPointMop.easy?easybuyCallback=?',
				type:"get",
				async:true,
				dataType:'jsonp',
				beforeSend:function(){
					
				},
				success:function(data){
					if(data.messageState == -1){
						console.log('已經簽到過')
					}else if(data.messageState == 1){
						console.log('未登錄')
					}else if(data.messageState == 0){
						console.log('成功簽到');
					}
				}
			});
		});
	}else if(state == 1){
		console.log('已經簽到');
	}
}
function integralStrategy(){
	$.ajax({
		url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryBonusPointsSetTable.easy?easybuyCallback=?",
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			for(var i in data.list[0]){
				$('#'+i+'-release').html('+'+data.list[0][i]+'分').removeAttr('id');
			}
		}
	});
}
function headTop(){
	//頭部的內容請求
	$.ajax({
		url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryUserBonusPoints.easy?easybuyCallback=?",
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			dateSignIn(data.list[0].signState);
			$('.envelope .head-position .big-text span.mop').eq(1).html(formatNum(data.list[0].mop)); //紅包
			$('.integral .head-position .big-text span.score').html(formatNum(data.list[0].point) + '分'); //積分
			$('.integral .head-position .big-text span.exchange span').html(data.list[0].point/data.list[0].moneyintegral); //可兌換紅包數額
			$('.envelope .small-text span:first-of-type,.integral .small-text span:first-of-type').html(data.list[0].nowTime.substring(0,4) + '-12-31'); //到期時間
			$('.envelope .small-text span:last-of-type,.integral .small-text span:last-of-type').html(data.list[0].endCount); //還剩多少天
			$('.head-position').css('display','block');
			$('.instructions .title-describe .machine').css('display','block');
			//給兌換器辦定事件
			machineMop(data.list[0].point,data.list[0].moneyintegral);
			justNumInput('instructions-input',function(val){
				if(val - 0 > data.list[0].point){
					$('#instructions-input').val(data.list[0].point);
				}
				$('.instructions .title-describe .machine .machine-content .result-tips span').html($('#instructions-input').val()/data.list[0].moneyintegral);
			});
		}
	});
	//積分紅包兌換器
	function machineMop(point,moneyintegral){
		$('.instructions .instructions-btn').off('click');
		//全部積分
		$('.instructions .instructions-btn').eq(0).on('click',function(){
			$('#instructions-input').val(point);
			$('.instructions .title-describe .machine .machine-content .result-tips span').html(point/moneyintegral);
		});
		//重新輸入
		$('.instructions .instructions-btn').eq(1).on('click',function(){
			$('#instructions-input').val('');
			$('.instructions .title-describe .machine .machine-content .result-tips span').html('0');
		});
		//確認並且兌換
		$('.instructions .instructions-btn').eq(2).on('click',function(){
			var res = $('#instructions-input').val().replace(/[^\d]/g,'');
			if(res - 0 >= point){
				$('#instructions-input').val(point);
				$('.instructions .title-describe .machine .machine-content .result-tips span').html(point/moneyintegral);
			}
			if(res == '' || res == 0 || res == '0') return false;
			//發出請求兌換紅包
			$.ajax({
				url:'http://shopping.macaoeasybuy.com/bonusPointsController/ExchangeBonusPoints/'+res+'.easy?easybuyCallback=?',
				type:"get",
				async:true,
				dataType:'jsonp',
				success:function(data){
					if(data.messageState > -1){
						$('#machine-succeed').stop().fadeIn(1000).fadeOut(1000);
					}else{
						$('#machine-fail').stop().fadeIn(1000).fadeOut(1000);
					}
					headTop();
				},
				error:function(){
					$('#machine-fail').stop().fadeIn(1000).fadeOut(1000);
				}
			});
		});
	}
}
function integralsMonthDetail(){
	var dataNum = 5; //一次請求5條數據
	var boxHeight = $('.envelopesubsidiary-box.integrals .table-detail .scrollBox').outerHeight(); //獲取盒子高度
	var integralsFirstObj = $('.envelopesubsidiary-box.integrals .table-detail-btn .month-select li').eq(0); //第一頁的數據對象
	integralsFirstObj[0].page = 0;
	integralsDetail(integralsFirstObj,1,dataNum);//積分發出請求獲取數據
	integralsMonthAll(1)
	$('.envelopesubsidiary-box.integrals .table-detail-btn .month-select li').each(function(k){
		if(k!=0){
			$(this)[0].page = 0;
		}
		$(this).on('click',function(){
			$(this).siblings('li').removeClass('select').end().addClass('select');
			$(this).parents('.table-detail-btn').siblings('.table-detail').find('.scrollBox>div').eq(k).siblings('div').removeClass('select').end().addClass('select');
			integralsMonthAll(k+1)
			if($(this)[0].page == 0){
				integralsDetail($(this),k+1,dataNum);//積分發出請求獲取數據
			}else{
				integralsBindScroll($(this),k+1,dataNum,'on');
			}
		});
	});
	//積分發出請求獲取數據
	function integralsDetail(obj,month,dataNum){
		$.ajax({
			url:'http://shopping.macaoeasybuy.com/bonusPointsController/queryMonthDetailInfo/'+dataNum+'/'+obj[0].page+'/'+month+'.easy?easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				integralsBindScroll(obj,month,dataNum,'off');
				if(obj[0].complete == true) return false;
			},
			success:function(data){
				var newData = data.list.detailInfo;
				for(var i=0;i<newData.length;i++){
					if(newData[i].picture == ''){
						var html = '<ul class="clearfloat table-body"><li class="clearfloat"><div></div><span>'+newData[i].title+'</span></li><li>'+newData[i].pointClass+'</li><li>'+newData[i].pointStr+'</li><li><span class="date">'+newData[i].uptime.split(' ')[0]+'</span><span>'+newData[i].uptime.split(' ')[1]+'</span></li></ul>';
					}else{
						var html = '<ul class="clearfloat table-body"><li class="clearfloat"><div><img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData[i].picture+'" alt=""></div><span>'+newData[i].title+'</span></li><li>'+newData[i].pointClass+'</li><li>'+newData[i].pointStr+'</li><li><span class="date">'+newData[i].uptime.split(' ')[0]+'</span><span>'+newData[i].uptime.split(' ')[1]+'</span></li></ul>';
					}
					$('.envelopesubsidiary-box.integrals .table-detail .scrollBox>div').eq(month-1).append(html);
				}
				//頁數+1
				obj[0].page = obj[0].page + 1;
				if(newData.length < dataNum){
					var divHtml = '<div class="no-more">~沒有更多內容了哦~</div>';
					$('.envelopesubsidiary-box.integrals .table-detail .scrollBox>div').eq(month-1).append(divHtml);
					obj[0].complete = true;
					integralsBindScroll(obj,month,dataNum,'off');//數據沒有了，接下來也會沒有數據，取消綁定事件
				}else{
					integralsBindScroll(obj,month,dataNum,'on');
				}
			}
		});
	}
	stopScroll($('.envelopesubsidiary-box.integrals .table-detail .scrollBox'));
	//辦定滾動事件
	function integralsBindScroll(obj,month,dataNum,state){
		if(state == 'on'){
			var height = $('.envelopesubsidiary-box.integrals .table-detail .scrollBox>div').eq(month-1).outerHeight();
			var scrollTop = null;
			$('.envelopesubsidiary-box.integrals .table-detail .scrollBox').off('scroll');
			$('.envelopesubsidiary-box.integrals .table-detail .scrollBox').on('scroll',function(){
				scrollTop = $(this).scrollTop();
				if(scrollTop + boxHeight >= height * 0.85){
					integralsDetail(obj,month,dataNum);
				}
			});
		}else{
			$('.envelopesubsidiary-box.integrals .table-detail .scrollBox').off('scroll');
		}
	}
	function integralsMonthAll(month){
		if($('.envelopesubsidiary-box.integrals .table-detail-btn .month-select li').eq(month-1)[0].mop == undefined){
			$.getJSON('http://shopping.macaoeasybuy.com/bonusPointsController/queryPointSum/'+month+'.easy?easybuyCallback=?',function(data){
				if(data.list[0].bonusOrMopCount<=0){
					var res = data.list[0].bonusOrMopCount + '分';
				}else{
					var res = '+' + data.list[0].bonusOrMopCount + '分';
				}
				$('.envelopesubsidiary-box.integrals .table-detail-btn .month-select li').eq(month-1)[0].point = res;
				$('.envelopesubsidiary-box.integrals .table-detail-btn .all-mop span').html(res);
			});
		}else{
			$('.envelopesubsidiary-box.integrals .table-detail-btn .all-mop span').html($('.envelopesubsidiary-box.integrals .table-detail-btn .month-select li').eq(month-1)[0].point);
		}
	}
}
function redMonthDetail(){
	var dataNum = 5; //一次請求5條數據
	var boxHeight = $('.envelopesubsidiary-box.red .table-detail .scrollBox').outerHeight(); //紅色盒子的高度
	var redFirstObj = $('.envelopesubsidiary-box.red .table-detail-btn .month-select li').eq(0); //第一頁的數據
	redFirstObj[0].page = 0;
	redDetail(redFirstObj,1,dataNum);//紅包發出請求獲取數據
	redGetMonthAll(1);
	$('.envelopesubsidiary-box.red .table-detail-btn .month-select li').each(function(k){
		if(k!=0){
			$(this)[0].page = 0;
		}
		$(this).on('click',function(){
			$(this).siblings('li').removeClass('select').end().addClass('select');
			$(this).parents('.table-detail-btn').siblings('.table-detail').find('.scrollBox>div').eq(k).siblings('div').removeClass('select').end().addClass('select');
			redGetMonthAll(k+1);
			if($(this)[0].page == 0){
				redDetail($(this),k+1,dataNum);//紅包發出請求獲取數據
			}else{
				redBindScroll($(this),k+1,dataNum,'on');
			}
		});
	});
	//紅包發出請求獲取數據
	function redDetail(obj,month,dataNum){
		$.ajax({
			url:'http://shopping.macaoeasybuy.com/bonusPointsController/queryMonthMopDetailInfo/'+dataNum+'/'+obj[0].page+'/'+month+'.easy?easybuyCallback=?',
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				redBindScroll(obj,month,dataNum,'off');
				if(obj[0].complete == true) return false;
			},
			success:function(data){
				var newData = data.list.detailInfo;
				for(var i=0;i<newData.length;i++){
					if(newData[i].picture == ''){
						var html = '<ul class="clearfloat table-body"><li class="clearfloat"><div></div><span>'+newData[i].title+'</span></li><li>'+newData[i].mopClass+'</li><li>'+newData[i].mopStr+'</li><li><span class="date">'+newData[i].uptime.split(' ')[0]+'</span><span>'+newData[i].uptime.split(' ')[1]+'</span></li></ul>';
					}else{
						var html = '<ul class="clearfloat table-body"><li class="clearfloat"><div><img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData[i].picture+'" alt=""></div><span>'+newData[i].title+'</span></li><li>'+newData[i].mopClass+'</li><li>'+newData[i].mopStr+'</li><li><span class="date">'+newData[i].uptime.split(' ')[0]+'</span><span>'+newData[i].uptime.split(' ')[1]+'</span></li></ul>';
					}
					$('.envelopesubsidiary-box.red .table-detail .scrollBox>div').eq(month-1).append(html);
				}
				//頁數+1
				obj[0].page = obj[0].page + 1;
				if(newData.length < dataNum){
					var divHtml = '<div class="no-more">~沒有更多內容了哦~</div>';
					$('.envelopesubsidiary-box .table-detail .scrollBox>div').eq(month-1).append(divHtml);
					obj[0].complete = true;
					redBindScroll(obj,month,dataNum,'off');//數據沒有了，接下來也會沒有數據，取消綁定事件
				}else{
					redBindScroll(obj,month,dataNum,'on');
				}
			}
		});
	}
	stopScroll($('.envelopesubsidiary-box.red .table-detail .scrollBox'));
	//辦定滾動事件
	function redBindScroll(obj,month,dataNum,state){
		if(state == 'on'){
			var height = $('.envelopesubsidiary-box.red .table-detail .scrollBox>div').eq(month-1).outerHeight();
			var scrollTop = null;
			$('.envelopesubsidiary-box.red .table-detail .scrollBox').off('scroll');
			$('.envelopesubsidiary-box.red .table-detail .scrollBox').on('scroll',function(){
				scrollTop = $(this).scrollTop();
				if(scrollTop + boxHeight >= height * 0.85){
					redDetail(obj,month,dataNum);
				}
			});
		}else{
			$('.envelopesubsidiary-box.red .table-detail .scrollBox').off('scroll');
		}
	}
	function redGetMonthAll(month){
		if($('.envelopesubsidiary-box.red .table-detail-btn .month-select li').eq(month-1)[0].mop == undefined){
			$.getJSON('http://shopping.macaoeasybuy.com/bonusPointsController/queryMopSum/'+month+'.easy?easybuyCallback=?',function(data){
				if(data.list[0].bonusOrMopCount<0){
					var res = '-MOP' + (data.list[0].bonusOrMopCount * -1)
				}else if(data.list[0].bonusOrMopCount==0){
					var res = 'MOP' + data.list[0].bonusOrMopCount
				}else{
					var res = '+MOP' + data.list[0].bonusOrMopCount
				}
				$('.envelopesubsidiary-box.red .table-detail-btn .month-select li').eq(month-1)[0].mop = res;
				$('.envelopesubsidiary-box.red .table-detail-btn .all-mop span').html(res);
			});
		}else{
			$('.envelopesubsidiary-box.red .table-detail-btn .all-mop span').html($('.envelopesubsidiary-box.red .table-detail-btn .month-select li').eq(month-1)[0].mop);
		}
	}
}
function myCanvasData(){
	var res = myCanvas(); //獲取參數配置
	redYear(res.objRed);
	blueYear(res.objBlue);
	$('.envelopesubsidiary-box.red .table-btn .time-select').each(function(k){
		//紅色請求
		if(k != 0){
			$(this)[0].flag = true;
		}else{
			$(this)[0].flag = false;
		}
		$(this).on('click',function(){
			$(this).siblings('.time-select').removeClass('select').end().addClass('select');
			$('.envelopesubsidiary-box.red .easy-canvas').eq(k).siblings('.easy-canvas').removeClass('select').end().addClass('select');
			if($(this)[0].flag){
				requestRedData(k);
			}
			$(this)[0].flag = false;
		});
	});
	$('.envelopesubsidiary-box.integrals .table-btn .time-select').each(function(k){
		//藍色請求
		if(k != 0){
			$(this)[0].flag = true;
		}else{
			$(this)[0].flag = false;
		}
		$(this).on('click',function(){
			$(this).siblings('.time-select').removeClass('select').end().addClass('select');
			$('.envelopesubsidiary-box.integrals .easy-canvas').eq(k).siblings('.easy-canvas').removeClass('select').end().addClass('select');
			if($(this)[0].flag){
				requestBlueData(k);
			}
			$(this)[0].flag = false;
		});
	});
	//調用取數據
	function requestRedData(idx){
		if(idx == 1){
			redMonth(res.objRed);
		}else if(idx == 2){
			redLastYear(res.objRed);
		}else if(idx == 3){
			redLastMonth(res.objRed);
		}
	}
	function requestBlueData(idx){
		if(idx == 1){
			blueMonth(res.objBlue);
		}else if(idx == 2){
			blueLastYear(res.objBlue);
		}else if(idx == 3){
			blueLastMonth(res.objBlue);
		}
	}
	function redYear(res){
		//本年紅包
		$.ajax({
			url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryYearMop/0.easy?easybuyCallback=?",
			type:"get",
			async:true,
			dataType:'jsonp',
			success:function(data){
				if(data.list.length == 0) return false;
				data.list[0].timeStamp = data.list[0].timeStamp + '';
				res.lineOneText = data.list[0].timeStamp.split(' ')[0] + '-^time^ 紅包餘額';
				var timeRange = [];
				var dataArr = [];
				for(var i=0;i<data.list.length;i++){
					timeRange[i] = data.list[i].time;
					dataArr[i] = data.list[i].timeBonusPoint;
				}
				new Chart({
					id:'envelopesubsidiary-table-red-year',
					dataArr:dataArr,
					timeRange:timeRange
				},res);
			}
		});
	}
	function redMonth(res){
		//本月紅包
		$.ajax({
			url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryMonthMop/0.easy?easybuyCallback=?",
			type:"get",
			async:true,
			dataType:'jsonp',
			success:function(data){
				res.lineOneText = data.list[0].timeStamp.split(' ')[0]+'-'+data.list[0].timeStamp.split(' ')[1]+'-^time^ 紅包餘額';
				res.rectWidth = 136;
				var timeRange = [];
				var dataArr = [];
				for(var i=0;i<data.list.length;i++){
					timeRange[i] = data.list[i].time;
					dataArr[i] = data.list[i].timeBonusPoint;
				}
				new Chart({
					id:'envelopesubsidiary-table-red-month',
					dataArr:dataArr,
					timeRange:timeRange
				},res);
			}
		});
	}
	function redLastYear(res){
		//上年紅包
		$.ajax({
			url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryYearMop/-1.easy?easybuyCallback=?",
			type:"get",
			async:true,
			dataType:'jsonp',
			success:function(data){
				res.lineOneText = data.list[0].timeStamp.split(' ')[0] + '-^time^ 紅包餘額';
				var timeRange = [];
				var dataArr = [];
				for(var i=0;i<data.list.length;i++){
					timeRange[i] = data.list[i].time;
					dataArr[i] = data.list[i].timeBonusPoint;
				}
				new Chart({
					id:'envelopesubsidiary-table-red-lastyear',
					dataArr:dataArr,
					timeRange:timeRange
				},res);
			}
		});
	}
	function redLastMonth(res){
		//上月紅包
		$.ajax({
			url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryMonthMop/-1.easy?easybuyCallback=?",
			type:"get",
			async:true,
			dataType:'jsonp',
			success:function(data){
				res.lineOneText = data.list[0].timeStamp.split(' ')[0]+'-'+data.list[0].timeStamp.split(' ')[1]+'-^time^ 紅包餘額';
				res.rectWidth = 136;
				var timeRange = [];
				var dataArr = [];
				for(var i=0;i<data.list.length;i++){
					timeRange[i] = data.list[i].time;
					dataArr[i] = data.list[i].timeBonusPoint;
				}
				new Chart({
					id:'envelopesubsidiary-table-red-lastmonth',
					dataArr:dataArr,
					timeRange:timeRange
				},res);
			}
		});
	}
	function blueYear(res){
		//本年積分
		$.ajax({
			url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryYearPoint/0.easy?easybuyCallback=?",
			type:"get",
			async:true,
			dataType:'jsonp',
			success:function(data){
				console.log(data);
				if(data.list.length == 0) return false;
				res.lineOneText = data.list[0].timeStamp.split(' ')[0] + '-^time^ 積分餘額';
				var timeRange = [];
				var dataArr = [];
				for(var i=0;i<data.list.length;i++){
					timeRange[i] = data.list[i].time;
					dataArr[i] = data.list[i].timeBonusPoint;
				}
				new Chart({
					id:'envelopesubsidiary-table-blue-year',
					dataArr:dataArr,
					timeRange:timeRange
				},res);
			}
		});
	}
	function blueMonth(res){
		//本月積分
		$.ajax({
			url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryMonthPoint/0.easy?easybuyCallback=?",
			type:"get",
			async:true,
			dataType:'jsonp',
			success:function(data){
				res.lineOneText = data.list[0].timeStamp.split(' ')[0]+'-'+data.list[0].timeStamp.split(' ')[1]+'-^time^ 積分餘額';
				res.rectWidth = 136;
				var timeRange = [];
				var dataArr = [];
				for(var i=0;i<data.list.length;i++){
					timeRange[i] = data.list[i].time;
					dataArr[i] = data.list[i].timeBonusPoint;
				}
				new Chart({
					id:'envelopesubsidiary-table-blue-month',
					dataArr:dataArr,
					timeRange:timeRange
				},res);
			}
		});
	}
	function blueLastYear(res){
		//去年積分
		$.ajax({
			url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryYearPoint/-1.easy?easybuyCallback=?",
			type:"get",
			async:true,
			dataType:'jsonp',
			success:function(data){
				res.lineOneText = data.list[0].timeStamp.split(' ')[0] + '-^time^ 積分餘額';
				var timeRange = [];
				var dataArr = [];
				for(var i=0;i<data.list.length;i++){
					timeRange[i] = data.list[i].time;
					dataArr[i] = data.list[i].timeBonusPoint;
				}
				new Chart({
					id:'envelopesubsidiary-table-blue-lastyear',
					dataArr:dataArr,
					timeRange:timeRange
				},res);
			}
		});
	}
	function blueLastMonth(res){
		$.ajax({
			url:"http://shopping.macaoeasybuy.com/bonusPointsController/queryMonthPoint/-1.easy?easybuyCallback=?",
			type:"get",
			async:true,
			dataType:'jsonp',
			success:function(data){
				res.lineOneText = data.list[0].timeStamp.split(' ')[0]+'-'+data.list[0].timeStamp.split(' ')[1]+'-^time^ 積分餘額';
				res.rectWidth = 136;
				var timeRange = [];
				var dataArr = [];
				for(var i=0;i<data.list.length;i++){
					timeRange[i] = data.list[i].time;
					dataArr[i] = data.list[i].timeBonusPoint;
				}
				new Chart({
					id:'envelopesubsidiary-table-blue-lastmonth',
					dataArr:dataArr,
					timeRange:timeRange
				},res);
			}
		});
	}
}


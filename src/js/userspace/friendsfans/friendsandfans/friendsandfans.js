var formatNum = easyBuy.global.dep.formatNum;
easyBuy.global.startJs = function(){
	userFriendsConntroller();//用戶好友粉絲數量統計
	DataFunc();
}
var getRequestURL = easyBuy.global.dep.getRequestURL;
/*
 	這個頁面邏輯非常複雜，如果需要優化更改，請耐心看一遍代碼
 * */
	//用戶好友粉絲數量統計
function userFriendsConntroller(){
	var ipurl = 'http://userspace1.macaoeasybuy.com/userFriendsConntroller/queryUserRelationNum.easy';
	var easyUrl = 'http://userspace.macaoeasybuy.com/userFriendsConntroller/queryUserRelationNum.easy';
	var goUrl;
	var sendId;
	sendId = easyBuy.global.isSelf ? userId : seeUserId;
	goUrl = getRequestURL({
		targetURL : ipurl,
		requestData : {
			userId : sendId
		},
		encryptData : true
	});
	$.getJSON(goUrl,function(data){
		$('#friends-state>div').each(function(k){
			switch(k){
				case 0:
					$(this)[0].dataNum = data.friend.friendCount;
					$(this).find('span').html(formatNum(data.friend.friendCount));
				break;
				case 1:
					$(this)[0].dataNum = data.friend.fanCount;
					$(this).find('span').html(formatNum(data.friend.fanCount));
				break;
				case 2:
					$(this)[0].dataNum = data.friend.friendFanCount;
					$(this).find('span').html(formatNum(data.friend.friendFanCount));
				break;
			}
		});
	});
}
function DataFunc(){
	var ipurl = 'http://userspace1.macaoeasybuy.com/';
	var easyUrl = 'http://userspace.macaoeasybuy.com/';
	var navBtn = $('#friends-state>div'); //導航按鈕
	var sexBtn = $('#friends-sex>div'); //性別按鈕
	var dataBox = $('#user-list .user-list-box'); //大盒子
	window.boxNum = 0; //大盒子目前是選擇哪個的
	window.dataSize = 9; //一次請求多少條數據
	var focusBtnHtml = '<div class="shadow-box-btn focus-it focus-btn"><div><img src="/img/userspace/friendsfans/add.png" alt="">關注</div></div>';
	var cancelBtnHtml = '<div class="shadow-box-btn cancel-focus focus-btn"><div>已關注</div></div>';
	navBtn.each(function(k){
		$(this)[0].data = {
			sexSelect : 0, //每個導航按鈕都存儲性別
			gay : {
				page:0, //男女的頁數
				end:false, //男女是否加載完成
				isFirst:true, //是否第一次請求
				isFirstClick:true //頁面加載第一次點擊(存儲，避免數據卡慢時多次點擊發出請求)
			},
			girl : {
				page:0, //女的頁數
				end:false, //女是否加載完成
				isFirst:true //是否第一次請求
			},
			boy : {
				page:0, //男的頁數
				end:false, //男是否加載完成
				isFirst:true //是否第一次請求
			}
		}
		$(this).on('click.nav',function(){
			if($(this).hasClass('select')) return false;
			//類別選項卡切換
			var sexSelect = $(this)[0].data.sexSelect
			$(this).siblings('div').removeClass('select').end().addClass('select');
			sexBtn.eq(sexSelect).siblings('div').removeClass('select').end().addClass('select');
			dataBox.eq(k).siblings('.user-list-box').removeClass('select').end().addClass('select');
			dataBox.eq(k).find('.sex-change-box').eq(sexSelect).siblings('.sex-change-box').removeClass('select').end().addClass('select');
			boxNum = k;
			//每種類別第一次請求
			if($(this)[0].data.gay.isFirstClick){
				requestData();
			}
			bindScroll('on');
		});
	});
	sexBtn.each(function(k){
		$(this).on('click.sex',function(){
			if($(this).hasClass('select')) return false;
			//性別選項卡切換
			$(this).siblings('div').removeClass('select').end().addClass('select');
			navBtn.eq(boxNum)[0].data.sexSelect = k;
			dataBox.eq(boxNum).find('.sex-change-box').eq(k).siblings('.sex-change-box').removeClass('select').end().addClass('select');
			//性別類別請求
			var navBtnData = navBtn.eq(window.boxNum)[0].data;
			switch(k){
				case 0:
					var sexData = navBtnData.gay;
				break;
				case 1:
					var sexData = navBtnData.girl;
				break;
				case 2:
					var sexData = navBtnData.boy;
				break;
			}
			if(sexData.isFirst == true && sexData.page == 0){
				requestData();
			}
			bindScroll('on');
		})
	});
	//監聽滾動條
	function bindScroll(state){
		if(state == 'on'){
			var wheight = $(window).height();
			var bheight = $(document).outerHeight(true);
			$(window).off('scroll');
			$(window).on('scroll',function(){
				var wT = $(this).scrollTop();
				if(wT + wheight >= bheight * 0.6){
					requestData();
				}
			});
		}else{
			$(window).off('scroll');
		}
	}
	requestData();
	function requestData(){
		var navBtnData = navBtn.eq(window.boxNum)[0].data; //顯示盒子的按鈕的數據
		var fansTemplate = easyBuy.global.template['fans-template'];
		//獲取頁數，性別
		switch(navBtnData.sexSelect){
			case 0:
				var sex = 0;
				var sexData = navBtnData.gay;
			break;
			case 1:
				var sex = 1;
				var sexData = navBtnData.girl;
			break;
			case 2:
				var sex = 2;
				var sexData = navBtnData.boy;
			break;
		}
		var insertBox = dataBox.eq(window.boxNum).find('.sex-change-box').eq(sex); //要插入內容的盒子
		var page = sexData.page;
		//存儲請求的URL
		switch(window.boxNum){
			case 0:
				var dataUrl = ipurl+'userFriendsConntroller/queryUserFriends.easy';
			break;
			case 1:
				var dataUrl = ipurl+'userFriendsConntroller/queryUserFans.easy';
			break;
			case 2:
				var dataUrl = ipurl+'userFriendsConntroller/queryUserFriendsAndFans.easy';
			break;
		}
		dataUrl = getRequestURL({
			targetURL : dataUrl,
			requestData : {
				userId : userId,
				size : window.dataSize,
				page : page,
				seeUserId : seeUserId,
				type : sex
			},
			encryptData : true
		});
		//請求
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				navBtnData.gay.isFirstClick = false;
				sexData.isFirst = false;
				bindScroll('off');
				if(sexData.end) return false;
			},
			success:function(data){
				//改變數據結構
				data.page = page;
				for(var i=0;i<data.fan.length;i++){
					data.fan[i].friendCount = formatNum(data.fan[i].friendCount);
					data.fan[i].fanCount = formatNum(data.fan[i].fanCount);
					data.fan[i].publishCount = formatNum(data.fan[i].publishCount);
					data.fan[i].loveCount = formatNum(data.fan[i].loveCount);
					data.fan[i].sexType = sex;
				}
				//如果長度小於數據長度，請求結束
				if(data.fan.length < window.dataSize){
					sexData.end = true;
					insertBox.find('.no-more').css('display','block');
				}
				//如果沒有數據，並且頁數為第一頁
				if(data.fan.length == 0 && page == 0){
					insertBox.find('.no-more').css('display','none');
				}
				//模板添加
				var html = template.render(fansTemplate,data);
				page == 0 ? insertBox.find('.inner-boxing').html(html) : insertBox.find('.inner-boxing').append(html);
				//頁數加一頁
				sexData.page += 1;
				//分辨是否已經關注或者未關注，辦定事件
				for(var i=0;i<data.fan.length;i++){
					$('#'+data.fan[i].id+data.fan[i].type+data.fan[i].sexType)[0].data = {
						//存儲數據進去盒子裡面
						id:data.fan[i].id,
						isFocus:data.fan[i].isFocus,
						isFriFan:data.fan[i].isFriFan,
						type:data.fan[i].type
					}
					$('#'+data.fan[i].id+data.fan[i].type+data.fan[i].sexType).find('.share-btn').on('click.share',function(){
						console.log('分享',$(this).parents('.result-box-item')[0].data);
					});
					$('#'+data.fan[i].id+data.fan[i].type+data.fan[i].sexType).find('.focus-btn').on('click.focus',function(){
						var boxData = $(this).parents('.result-box-item')[0].data;
						if(boxData.isFocus == 0){
							cancelPoint(boxData,$(this).parents('.result-box-item'),$(this)); //取消關注
						}else{
							focusFans(boxData,$(this).parents('.result-box-item'),$(this)); //關注
						}
					});
				}
				bindScroll('on');
			}
		});
	}
	//取消關注
	function cancelPoint(data,box,btn){
		$('#focus-box').css('display','block');
		$('#focus-box .cancel-sure').off('click');
		$('#focus-box .sure-cancel').off('click');
		$('#focus-box .cancel-sure').on('click',function(){
			$('#focus-box').css('display','none');
		});
		$('#focus-box .sure-cancel').on('click',function(){
			var attentionId = data.id;
			var dataUrl = ipurl + 'userFriendsConntroller/removeFriend.easy';
			dataUrl = getRequestURL({
				targetURL : dataUrl,
				requestData : {
					userId : userId,
					attentionId : attentionId
				},
				encryptData : true
			});
			$.ajax({
				url:dataUrl,
				type:"get",
				async:true,
				dataType:'jsonp',
				success:function(backData){
					if(backData.fan == 'success'){
						$('#focus-box').css('display','none');
						easyBuy.global.isSelf  ? nodeChange() : otherChange();
					}
				}
			});
		});
		//看自己的點擊關注操作
		function nodeChange(){
			var type = data.type;
			if(type == 'friend'){
				friendFunc();
			}else if(type == 'fan'){
				fanFunc();
			}else if(type == 'frifan'){
				frifanFunc();
			}
			//好友
			function friendFunc(){
				//互相關注
				if(data.isFriFan == 0){
					navBtn.eq(0)[0].dataNum -= 1;
					navBtn.eq(2)[0].dataNum -= 1;
					navBtn.eq(0).find('span').html(formatNum(navBtn.eq(0)[0].dataNum));
					navBtn.eq(2).find('span').html(formatNum(navBtn.eq(2)[0].dataNum));
					$('#user-list .user-list-box.fans-box').find('.'+data.id+'fan').each(function(){
						var fanBox = $(this);
						if(fanBox.length != 0){
							fanBox[0].data.isFocus = 1;
							var opBtn = fanBox.find('.cancel-focus');
							opBtn.before(focusBtnHtml);
							opBtn.siblings('.focus-it').on('click',function(){
								focusFans(
									$(this).parents('.result-box-item')[0].data,
									$(this).parents('.result-box-item'),
									$(this)
								);
							});
							opBtn.remove();
						}
					});
					clearData([2],true);
				}else if(data.isFriFan == 1){
				//不是互相關注
					navBtn.eq(0)[0].dataNum -= 1;
					navBtn.eq(0).find('span').html(formatNum(navBtn.eq(0)[0].dataNum));
				}
				clearData([0],false);
			}
			//粉絲
			function fanFunc(){
				var className = box.attr('class').split(' ')[1];
				box.parents('.user-list-box').find('.'+className).each(function(){
					var opBtn = $(this).find('.cancel-focus');
					opBtn.before(focusBtnHtml);
					opBtn.siblings('.focus-it').on('click',function(){
						focusFans(
							$(this).parents('.result-box-item')[0].data,
							$(this).parents('.result-box-item'),
							$(this)
						);
					});
					opBtn.remove();
				});
				navBtn.eq(0)[0].dataNum -= 1;
				navBtn.eq(2)[0].dataNum -= 1;
				navBtn.eq(0).find('span').html(formatNum(navBtn.eq(0)[0].dataNum));
				navBtn.eq(2).find('span').html(formatNum(navBtn.eq(2)[0].dataNum));
				clearData([0,2],true);
			}
			//互相關注
			function frifanFunc(){
				navBtn.eq(0)[0].dataNum -= 1;
				navBtn.eq(2)[0].dataNum -= 1;
				navBtn.eq(0).find('span').html(formatNum(navBtn.eq(0)[0].dataNum));
				navBtn.eq(2).find('span').html(formatNum(navBtn.eq(2)[0].dataNum));
				$('#user-list .user-list-box.fans-box').find('.'+data.id+'fan').each(function(){
					var fanBox = $(this);
					if(fanBox.length != 0){
						fanBox[0].data.isFocus = 1;
						var opBtn = fanBox.find('.cancel-focus');
						opBtn.before(focusBtnHtml);
						opBtn.siblings('.focus-it').on('click',function(){
							focusFans(
								$(this).parents('.result-box-item')[0].data,
								$(this).parents('.result-box-item'),
								$(this)
							);
						});
						opBtn.remove();
					}
				});
				clearData([0],true);
				clearData([2],false);
			}
		}
		//看他人點擊關注操作
		function otherChange(){
			var className = box.attr('class').split(' ')[1];
			var classNameId = parseInt(className);
			$('#user-list .friends-box').find('.'+classNameId+'friend').each(function(){
				nodeOtherChangeFunc($(this));
			});
			$('#user-list .fans-box').find('.'+classNameId+'fan').each(function(){
				nodeOtherChangeFunc($(this));
			});
			$('#user-list .friendsfans-box').find('.'+classNameId+'frifan').each(function(){
				nodeOtherChangeFunc($(this));
			});
			function nodeOtherChangeFunc(ele){
				ele[0].data.isFocus = 1;
				var opBtn = ele.find('.cancel-focus');
				opBtn.before(focusBtnHtml);
				opBtn.siblings('.focus-it').on('click',function(){
					focusFans(
						$(this).parents('.result-box-item')[0].data,
						$(this).parents('.result-box-item'),
						$(this)
					);
				});
				opBtn.remove();
			}
		}
	}
	//點擊關注
	function focusFans(data,box,btn){
		var attentionId = data.id;
		var dataUrl = ipurl+'userFriendsConntroller/addFriend.easy';
		dataUrl = getRequestURL({
			targetURL : dataUrl,
			requestData : {
				userId : userId,
				attentionId : attentionId
			},
			encryptData : true
		});
		//請求
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){},
			success:function(backData){
				if(backData.result == 'success'){
					if($('#focus-tips').css('display')=='none') $('#focus-tips').fadeIn(300).delay(1000).fadeOut(300);
					easyBuy.global.isSelf ? nodeChange() : otherChange();
				}
			}
		});
		//看自己的點擊關注操作
		function nodeChange(){
			navBtn.eq(0)[0].dataNum += 1;
			navBtn.eq(2)[0].dataNum += 1;
			navBtn.eq(0).find('span').html(formatNum(navBtn.eq(0)[0].dataNum));
			navBtn.eq(2).find('span').html(formatNum(navBtn.eq(2)[0].dataNum));
			var className = box.attr('class').split(' ')[1];
			box.parents('.user-list-box').find('.'+className).each(function(){
				var opBtn = $(this).find('.focus-it');
				opBtn.before(cancelBtnHtml);
				opBtn.parents('.result-box-item')[0].data.isFocus = 0;
				opBtn.siblings('.cancel-focus').on('click',function(){
					cancelPoint(
						$(this).parents('.result-box-item')[0].data,
						$(this).parents('.result-box-item'),
						$(this)
					);
				});
				opBtn.remove();
			});
			clearData([0,2],true);
		}
		//看他人點擊關注操作
		function otherChange(){
			var className = box.attr('class').split(' ')[1];
			var classNameId = parseInt(className);
			$('#user-list .friends-box').find('.'+classNameId+'friend').each(function(){
				nodeOtherChangeFunc($(this));
			});
			$('#user-list .fans-box').find('.'+classNameId+'fan').each(function(){
				nodeOtherChangeFunc($(this));
			});
			$('#user-list .friendsfans-box').find('.'+classNameId+'frifan').each(function(){
				nodeOtherChangeFunc($(this));
			});
			function nodeOtherChangeFunc(ele){
				ele[0].data.isFocus = 0;
				var opBtn = ele.find('.focus-it');
				opBtn.before(cancelBtnHtml);
				opBtn.siblings('.cancel-focus').on('click',function(){
					cancelPoint(
						$(this).parents('.result-box-item')[0].data,
						$(this).parents('.result-box-item'),
						$(this)
					)
				});
				opBtn.remove();
			}
		}
	}
	//清空內容，點擊后可以重新請求
	function clearData(nArr,bind){
		if(bind == true){
			navBtn.off('click.addBindData');
		}
		for(var i=0;i<nArr.length;i++){
			var idx = nArr[i];

			navBtn.eq(idx)[0].data.gay.page = 0;
			navBtn.eq(idx)[0].data.gay.end = false;
			navBtn.eq(idx)[0].data.gay.isFirst = true;

			navBtn.eq(idx)[0].data.girl.page = 0;
			navBtn.eq(idx)[0].data.girl.end = false;
			navBtn.eq(idx)[0].data.girl.isFirst = true;

			navBtn.eq(idx)[0].data.boy.page = 0;
			navBtn.eq(idx)[0].data.boy.end = false;
			navBtn.eq(idx)[0].data.boy.isFirst = true;

			dataBox.eq(idx).find('.inner-boxing').each(function(){
				$(this).html('');
			});
			if(bind == true){
				navBtn.eq(idx).on('click.addBindData',function(){
					$(this).off('click.addBindData');
					requestData();
				});
			}else{
				requestData();
			}
		}
	}
}

/*主題廣告詳細頁最近查看模板*/
function themeDetailsVisit(){
	var dataUrl = 'http://shopping1.macaoeasybuy.com/ThemePavilionController/queryThemeMessByid.easy?id='+dataId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		console.log(data);
		var newData = data.list[0];
		var bannerImg = '<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData.smallphoto+'">';
		$('.themeDetails_banner').html(bannerImg);
		$('.themeDetails_top_intro').html(newData.content);
		$('.themeDetails_top_name').html(newData.title);
		var html = template('showFindNewVisit',{
			messUser : newData.messUser,
			UserInterestCount : newData.UserInterestCount
		});
		$(".findNew_main_visitBox").html(html);
	});
}
//請求列表內容
function themeDetailFunc(){
	var page = 0;
	var size = 10;
	var isComplete = false;
	reqFunc(page);
	function reqFunc(page){
		var dataUrl = 'http://shopping1.macaoeasybuy.com/ThemePavilionController/QueryThemeMessShangpins.easy?id='+dataId+'&page='+page+'&size='+size+'&easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				getScrollFunc('off');
				if(isComplete) return false;
			},
			success:function(data){
				console.log(data);
				var html = template('more_list_template',data);
				$('#more_list_box').append(html);
				$.each(data.list, function(k,y) {
					eachGoodHover($('#'+y.id+'data_id'));
				});
				imagesLoaded($('.themeDetails_each'),function(){
					var s = waterfall($('.themeDetails_mainDetails'),$('.themeDetails_each'),5,30,30);
					var sum = arrayGetMax(s);
					sum = Math.floor(sum);
					$('.themeDetails_mainDetails').css('height',sum+'px');
					$.each(data.list, function(k,y) {
						$('#'+y.id+'data_id').css('visibility','visible');
					});
				});
				page++;
				if(data.list.length == size){
					getScrollFunc('on',page);
				}else{
					getScrollFunc('off');
					isComplete = true;
					$('.noMore').css('display','block');
				}
			}
		});
	}
	//監聽滾動條
	function getScrollFunc(state,page){
		if(state == 'on'){
			$(window).on('scroll.listdata',function(){
				var scrollTop = $(this).scrollTop();
				var windowHeight= $(this).height();
				var scrollHeight = $(document).height();
				if(scrollTop + windowHeight >= scrollHeight*0.6){
					reqFunc(page);
				}
			});
		}else{
			$(window).off('scroll.listdata');
		}
	}
}
//點擊領取積分紅包請求
function saveMopReq(userId){
	var dataUrl = 'http://shopping1.macaoeasybuy.com/bonusPointsController/saveUserMop.easy?MopId='+dataId+'&userid='+userId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		console.log(data);
		if(data.messageState > 0){
			$('.redbag_notOpen').css('opacity','0').css('z-index','-1');
			$('.redbag_openIng').css('opacity','1');
			$('.redbag_openHead').animate({
				marginTop:'-49px'
			},150);
			setTimeout(function(){
				$('.redbag_openUp').animate({
					opacity:'1',
					top:'-40px'
				},1000)
			},100);
			setTimeout(function(){
				$('.redbag_openIng').css('opacity','0');
				$('.redbag_openUp').css('opacity','0');
				$('.redbag_openOver').css('opacity','1');
			},1500);
		}else{
			alert('領取失敗！');	
			$('.redbag_notOpen').on('click',function(){
				$(this).off('click');
				saveMopReq(userId);
			});
		}
	});
}
//查看是否有無領過紅包
function canClickMop(userId){
	var dataUrl = 'http://shopping1.macaoeasybuy.com/ThemePavilionController/QueryUserReceiveMopOrNot.easy?iuserid='+userId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		console.log(data);
		redBag(data.Mopstate,userId);
	});
}

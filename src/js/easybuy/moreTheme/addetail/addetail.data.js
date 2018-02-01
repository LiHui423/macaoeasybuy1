//頭部內容
function themeDetailsVisit(){
	var dataUrl = 'http://shopping1.macaoeasybuy.com/MallshopingMessController/queryMessByid.easy?id='+dataId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var newData = data.list[0];
		var bannerImg = '<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData.smallphoto+'">';
		$('.addetail_banner').html(bannerImg);
		$('.themeDetails_top_intro').html(newData.content);
		$('.themeDetails_top_name').html(newData.title);

		var html = template('showFindNewVisit',{
			messUser : newData.messUser,
			UserInterestCount : newData.UserInterestCount
		});
		$(".findNew_main_visitBox").html(html);
	});
}
//列表數據
function themeListData(){
	var page = 0;
	var size = 10;
	var isComplete = false;
	reqFunc(page);
	function reqFunc(page){
		var dataUrl = 'http://shopping1.macaoeasybuy.com/MallshopingMessController/queryMessGoods.easy?id='+dataId+'&page='+page+'&size='+size+'&easybuyCallback=?';
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
				var html = template('list_box_template',data);
				$('#list_box').append(html);
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

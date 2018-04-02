$(function(){
	welfareHeadReq(); //封面信息
	listData(); //數據列表
	queryEasyBuyUserSee(); //最近查看宜粉
});
//封面信息
function welfareHeadReq(){
	var dataUrl = 'http://social1.macaoeasybuy.com/guangGaoController/queryguanggaoInfo/1/2.easy?easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
			console.log(data);
			var newData = data.list[0];
			$('#good-number').html(newData.bestCount);
			$('#love-number').html(newData.seeNumber);
			$('#top-image').html('<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData.img+' "onerror="this.onerror=null;this.src=\'/src/img/common/loading_pc_loadnow.jpg\'">');
			$('#top-artical-text').html(newData.title);
	});
}
//最近查看宜粉
function queryEasyBuyUserSee(){
	var dataUrl = 'http://social1.macaoeasybuy.com/easyBuyTopicController/QueryEasyBuyUserSee.easy?Type=101&SeeId=0&size=11&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var html = '';
		$.each(data.list, function(k,y) {
			html += '<li data-id="'+y.id+'"><img data-type="userAvatar" src="http://mbuy.oss-cn-hongkong.aliyuncs.com/'+y.Pic+'" onerror="this.onerror=null;this.src=\'/src/img/common/loading_pc_headPic.png\'"></li>';
		});
		$('#header-head-img').html(html);
		
	});
}
//數據列表
function listData(){
	var page = 0;
	var size = 9;
	var userSeeSize = 6;
	var isComplete = false;
	listDataReq();
	//列表數據請求
	function listDataReq(){
		var dataUrl = 'http://social1.macaoeasybuy.com/easyBuyTopicController/queryShouldBuy/'+page+'/'+size+'/2/0/'+userSeeSize+'.easy?easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				$(window).off('scroll.data');
				if(isComplete) return false;
			},
			success:function(data){
				console.log(data);
				$.each(data.list, function(k,y) {
					y.content = y.content.replace(/<.*?>/ig,'');
					y.seeNumber = y.seeNumber;
					y.disCount = y.disCount;
					y.loveNum = y.loveNum;
				});
				var html = template('item-template',data);
				$('#list').append(html);
				page+=1;
				if(data.list.length  == size){
					scrollData('on');
				}else{
					scrollData('off');
					isComplete = true;
					$('.no-more').css('display','block');
				}
			}
		});
	}
	//監聽滾動條
	function scrollData(state){
		if(state == 'on'){
			$(window).on('scroll.data',function(){
			　	var scrollTop = $(this).scrollTop(); //滾動條高度
			　	var scrollHeight = $(document).height();
			　	var windowHeight = $(this).height();
			　	if(scrollTop + windowHeight >= scrollHeight * 0.6){
					listDataReq();
				}
			});
		}else{
			$(window).off('scroll.data');
		}
	}
}

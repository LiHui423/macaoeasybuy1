$(function() {
	if(isLogin) updateSeeLog(); //所有帖子(点击量/查看量)
	chartBtn(); //標籤排行榜選項卡
	queryLabelInfo(); //內容數據
	if(userId != seeUserId) checkIsPoint();//查看是否關注(並且點讚取消關注)
	myCheckCard();//最近查看宜粉
	isClickLove(); //點讚
	myRelease(); //使用此標籤發佈帖子按鈕
	userOtherLabel(); //用戶還創建了其他標籤
	relatedPostNum(); //相關帖子數量
});
var myLabelIndex = 0;
//標籤排行榜
function chartBtn() {
	var btn = $('#container .container-left .chart .chart-card-btn li');
	var boxList = $('#container .container-left .chart-card-data');
	levelRank(0); //請求第一次
	btn.each(function(k){
		$(this)[0].flag = k == 0 ? true : false;
		$(this).on('click',function(data){
			$(this).siblings('li').removeClass('select').end().addClass('select');
			boxList.eq(k).siblings('.chart-card-data').removeClass('select').end().addClass('select');
			if($(this)[0].flag) return false;
			levelRank(k); //請求
			$(this)[0].flag = true;
		});
	});
}
//使用此標籤發佈帖子按鈕
function myRelease(){
	if(isLogin){
		$('#other-use-post').on('click',function(){
			$('#release').css('display','block');
		});
		$('#release .cancel-btn').on('click',function(){
			$('#release').css('display','none');
		});
	}else{
		$('#release').remove();
		$('#other-use-post').on('click',function(){
			alert('還沒登陸，跳到登錄頁');
		});
	}
}
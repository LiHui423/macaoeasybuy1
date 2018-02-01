//看別人的選項排序
function sortSelectOther() {
	var listdata = window.albumData.listdata;
	getListData(listdata[0])
	$('.describe-title-mine div').on('click', function() {
		if($(this).hasClass('select')) return false;
		var idx = $(this).index();
		window.albumData.selectIdx = idx;
		if(listdata[idx].isFirst) getListData(listdata[idx]); //發出請求
		$('.album-lister').eq(idx).siblings('.album-lister').removeClass('select').end().addClass('select');
		$(this).siblings('div').removeClass('select').end().addClass('select');
	});
}
//看別人的採集
window.albumData.otherFunc.albumCollect = function(){
	var listData = window.albumData.selectId;
	var golbal = window.albumData.collect; //回去全局變量
	bindNum(listData);
	//顯示數字
	function bindNum(list){
		if(list.length ==0 ){
			$('#collect-btn').css({
				'background' : '#aaa',
				'border-color' : '#aaa',
				'cursor' : 'normal'
			})
		}else{
			$('#collect-btn').css({
				'background' : '#e98900',
				'border-color' : '#e98900',
				'cursor' : 'pointer'
			})
		}
	}
}
//辦定顯示採集窗口事件
function collectOnClick(){
	$('#collect-btn').on('click',function(){
		if(window.albumData.selectId.length == 0) return false;
		$('#album-collect .collect-box').css('margin-top',$(window).scrollTop() + 15 +'px');
		$('#album-collect').css('display','block');
	});
}
//關閉採集窗口
function closeCollect(){
	$('#album-collect img.close-collect').off('click');
	$('#album-collect img.close-collect').on('click',function(){
		$('#album-collect').css('display','none');
	});
}
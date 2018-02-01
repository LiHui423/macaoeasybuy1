$(function(){
	choostypeBar(); //選擇排序方式
	chooseVoucher(); //勾選券
	searchSlide(); //搜索框選目標
	getShopInfo(false); //獲取商店信息
	searchData();
	$('#search-input').val(queryStr);
});
var searchOpt = {
	page : 0, //頁數
	size : 18, //請求的數目
	order : 0, //0 随机 1 时间 2心动数 3 价格
	descOrAsc : 0, //0 降序 1 升序
	labelidinfoStr : [0],  //0全部 1 红包卷 2 优惠卷 3 积分卷 4.其他卷 eg:1,2,3,4 (多選)
	queryStr : queryStr,
	isComplete : false, //是否已經全部請求完成
	isFirstReq : true //是否頁面第一次加載
}
//請求數據
function searchData(){
	var searchOpt = window.searchOpt;
	if(searchOpt.isComplete) return false; //如果已經請求完成了，就不執行以下操作
	var page = searchOpt.page;
	if(page == 0) $('.no-more').css('visibility','hidden');
	var size = searchOpt.size;
	switch(searchOpt.order){
		case 1:
			var order = 'spAddtime';
		break;
		case 2:
			var order = 'LoveNumber';
		break;
		case 3:
			var order = 'spprice';
		break;
		default:
			var order = '';
		break;
	}
	var descOrAsc = searchOpt.descOrAsc == 0 ? 'desc' : 'asc'; //0 降序 1 升序
	var labelidinfoStr = searchOpt.labelidinfoStr.join(','); //0全部 1 红包卷 2 优惠卷 3 积分卷 4.其他卷 eg:1,2,3,4 (多選)
	if(labelidinfoStr.length > 1) labelidinfoStr = labelidinfoStr.replace('0,','');
	var query = encodeURI(encodeURI(searchOpt.queryStr));
	var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrGoodsController/QueryGoodsByShop.easy?Desc='+descOrAsc+'&Order='+order+'&Page='+page+'&Query='+query+'&Rows='+size+'&ishopid='+shopId+'&labelidinfoStr='+labelidinfoStr+'&easybuyCallback=?';
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			scrollFunc('off');
			$('.shopDetails_main_searchResult span.text_tips,.shopDetails_main_search_null span.text_tips').html(searchOpt.queryStr);
		},
		success:function(data){
			var newData = data.Results;
			newData.page = page;
			$.each(newData.classList,function(k,y){
				y.spprice = formatNum(y.spprice);
				y.costPrice = formatNum(y.costPrice);
				y.buyNumber = formatNum(y.buyNumber);
				y.loveNumber = formatNum(y.loveNumber);
			});
			var html = template('shop_list_template',newData);
			var len = newData.classList.length;

			if(searchOpt.isFirstReq){
				if(len == 0){
					//沒有搜索到任何商品
					$('.shopDetails_main_search_null').css('display','block');
					$('.shopDetails_main_sortingBox').css('display','none');
				}else{
					//搜索有結果
					$('.shopDetails_main_searchResult span.num_tips').html(newData.numFound);
					$('.shopDetails_main_searchResult').css('display','block');
				}
				window.searchOpt.isFirstReq = false;
			}
			page == 0 ? $('#shop_list_box').html(html) : $('#shop_list_box').append(html);
			if(page == 0) $('.shopDetails_main').css('visibility','visible');
			window.searchOpt.page++;
			if(len == size){
				scrollFunc('on');
			}else{
				window.searchOpt.isComplete = true;
				scrollFunc('off');
			}
			if(len != size && len != 0) $('.no-more').css('visibility','visible');
		}
	});
}
//滾動加載
function scrollFunc(state){
	if(state == 'on'){
		$(window).on('scroll.req',function(){
			var scrollTop = $(this).scrollTop();//滾動條高度
			var scrollHeight = $(document).height();
			var windowHeight = $(this).height();
			if(scrollTop + windowHeight >= scrollHeight * 0.6){
				searchData();
			}
		});
	}else{
		$(window).off('scroll.req');
	}
}

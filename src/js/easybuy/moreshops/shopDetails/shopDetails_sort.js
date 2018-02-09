$(function(){
	choostypeBar(); //選擇排序方式
	chooseVoucher(); //勾選券
	searchSlide(); //搜索框選目標
	getShopInfo(true); //獲取商店信息
	$('.shopDetails_main_sorting_chooseLeft ul li').eq(shopOrder).addClass('sorting_curr');
	searchData();
	clickEvent();

});
var searchOpt = {
	page : 0, //頁數
	size : 18, //請求的數目
	order : shopOrder, //0 随机 1 时间 2心动数 3 价格
	descOrAsc : descOrAsc, //0 降序 1 升序
	labelidinfoStr : [0],  //0全部 1 红包卷 2 优惠卷 3 积分卷 4.其他卷 eg:1,2,3,4 (多選)
	isComplete : false //是否已經全部請求完成
}
//請求數據
function searchData(){
	var searchOpt = window.searchOpt;
	if(searchOpt.isComplete) return false; //如果已經請求完成了，就不執行以下操作
	var page = searchOpt.page;
	if(page == 0) $('.no-more').css('visibility','hidden');
	var size = searchOpt.size; 
	var order = searchOpt.order; //0 随机 1 时间 2心动数 3 价格
	var descOrAsc = searchOpt.descOrAsc; //0 降序 1 升序
	var labelidinfoStr = searchOpt.labelidinfoStr.join(','); //0全部 1 红包卷 2 优惠卷 3 积分卷 4.其他卷 eg:1,2,3,4 (多選)
	if(labelidinfoStr.length > 1) labelidinfoStr = labelidinfoStr.replace('0,','');
	var dataUrl = 'http://shopping1.macaoeasybuy.com/shopInfoController/queryShopSpinfo/'+shopId+'/'+page+'/'+size+'/'+order+'/'+descOrAsc+'/'+labelidinfoStr+'.easy?easybuyCallback=?';
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			scrollFunc('off');
		},
		success:function(data){
			data.page = page;
			$.each(data.list,function(k,y){
				y.price = easyBuy.global.dep.formatNum(y.price);
				y.costPrice = easyBuy.global.dep.formatNum(y.costPrice);
				y.buynumber = easyBuy.global.dep.formatNum(y.buynumber);
				y.loveNumber = easyBuy.global.dep.formatNum(y.loveNumber);
			});
			var html = template('shop_list_template',data);
			page == 0 ? $('#shop_list_box').html(html) : $('#shop_list_box').append(html);
			if(page == 0) $('.shopDetails_main_sortingBox').css('visibility','visible');
			window.searchOpt.page++;
			var len = data.list.length;
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
		})
	}else{
		$(window).off('scroll.req');
	}
}
function clickEvent(){
	$(document).on('click',function(e){
		var target=e.target;
		if($(target).attr('id') === "underline"){
			var productId=$(target).parents('[data-id]').attr('data-id');
			console.log(productId);
			window.open('http://shopping.macaoeasybuy.com/goodDetails/ordinaryGoodDetais.html?productId='+productId);
		}
		if($(target).html() === "首頁"){
			var shopId=location.href.split('=')[1].split('&')[0];
			location.href="http://shopping.macaoeasybuy.com/moreshops/shopDetails/shopDetails_index.html?shopId="+shopId;
		}
	})
}

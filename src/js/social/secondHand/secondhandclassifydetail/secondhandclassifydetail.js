var justNumInput = easyBuy.global.dep.justNumInput;
var maskClick = easyBuy.global.dep.maskClick;
//var postType = easyBuy.global.pageParameter.type || 13;
var postType=location.href.split('=')[1];
console.log(postType);
easyBuy.global.beforeDataJs = function(){
	bannerImage(); //廣告圖
	reqClassName(); //獲取二手類名
	navSelect(); //導航欄
	checkboxSelect(); //複選框選擇
	fixedUpNav(); //吸頂導航條
	searchBtnClick(); //辦定點擊搜索事件
	//只允許輸入數字
	justNumInput('begin-price');
	justNumInput('end-price');
}
var requestData = {
	BeginPrice : '-1',
	EndPrice : '-1',
	Orders : 'uptime',
	Query : '',
	Page : 0,
	isComplete : false
}
var classTypeName = '';
//廣告圖
function bannerImage(){
	var urlStr = '';
	postType+='';
	switch(postType){
		case '13':
			urlStr = 'banner01.png'; //美容化妝
		break;
		case '2':
			urlStr = 'banner02.png'; //3C產品
		break;
		case '1':
			urlStr = 'banner03.png'; //育嬰用品
		break;
		case '15':
			urlStr = 'banner04.png'; //傢私家具
		break;
		case '10':
			urlStr = 'banner05.png'; //服裝飾物
		break;
		case '3':
			urlStr = 'banner06.png'; //攝影器材
		break;
		case '11':
			urlStr = 'banner07.png'; //寵物用品
		break;
		case '5':
			urlStr = 'banner08.png'; //家庭電器
		break;
		case '8':
			urlStr = 'banner09.png'; //車輛買賣
		break;
		case  '14':
			urlStr = 'banner10.png'; //票券轉讓
		break;
		case '7':
			urlStr = 'banner11.png'; //玩具模型
		break;
		case '4':
			urlStr = 'banner00.png'; //音響設備
		break;
		case '12':
			urlStr = 'banner12.png'; //生活用品
		break;
		case '16':
			urlStr = 'banner13.png'; //閒置物品
		break;
		case '9':
			urlStr = 'banner14.png'; //書刊雜誌
		break;
		case '6':
			urlStr = 'banner15.png'; //體育用品
		break;
		default :
			urlStr = 'banner.png'
		break;
	}
	$('#second-banner-bar').html('<img src="/img/social/secondHand/secondhandclassifydetail/'+urlStr+'" alt="">');
}
//導航欄
function navSelect(){
	var flag = true;
	$('#second-nav-bar .navbtn').on('click',function(){
		var self = $(this);
		var slider = $('#second-slider-nav');
		if(flag){
			reqClass(self,slider); //獲取分類
			flag = false;
		}else{
			if(self.hasClass('select')){
				self.removeClass('select');
				slider.stop().slideUp(150);
			}else{
				self.addClass('select');
				slider.stop().slideDown(150);
			}
		}
	});
	maskClick('#second-slider-nav',function(){
		$('#second-nav-bar .navbtn').removeClass('select');
		$('#second-slider-nav').stop().slideUp(150);
	});
}
//複選框選擇
function checkboxSelect(){
	$('.nav .check-box-swapper').each(function(k){
		$(this).on('click',function(){
			if($(this).children('.check-box').hasClass('select')) return false;
			$(this).siblings('.check-box-swapper').children('.check-box').removeClass('select');
			$(this).children('.check-box').addClass('select');
			var Orders = k == 0 ? 'uptime' : 'postSeeNumber';
			getReqInfo();
			requestData.Orders = Orders;
			requestSecondSearch();
		});
	});
}
//點擊搜索
function searchBtnClick(){
	var btn =  $('#search-btn-go');
	btn.off('click.go');
	btn.on('click.go',function(){
		btn.off('click.go');
		getReqInfo();
		requestSecondSearch();
	})
}
//獲取請求的信息
function getReqInfo(){
	var BeginPrice = $('#begin-price').val().replace(/[^\d^\.]+/g,'');
	var EndPrice = $('#end-price').val().replace(/[^\d^\.]+/g,'');
	if(BeginPrice == '' || BeginPrice == NaN){
		BeginPrice = '-1';
	}
	if(EndPrice == '' || EndPrice == NaN){
		EndPrice = '-1';
	}
	var Query = $('#search-content').val();
	requestData.BeginPrice = BeginPrice;
	requestData.EndPrice = EndPrice;
	requestData.Query = Query;
	requestData.Page = 0;
	requestData.isComplete = false;
}
//吸頂導航條
function fixedUpNav(){
	var nav = $('#second-nav-bar');
	var navOffset = nav.offset().top;
	var m = $(window).scrollTop();
	var bannerBar = $('#second-banner-bar');
	$(window).on('scroll resize',function(){
		goScroll($(this));
	});
	function goScroll(self){
		m = self.scrollTop();
		if(m >= navOffset){
			nav.css({
				'position':'fixed',
				'top':'0px',
				'left' : bannerBar.offset().left - self.scrollLeft()
			})
		}else{
			nav.css({
				'position':'absolute',
				'top':'328px',
				'left' : '0px'
			})
		}
	}
}
//獲取二手類名
function reqClassName(){
//	var dataUrl = 'http://shopping.macaoeasybuy.com/secondHandController/QueryUsedName.easy?usedclassid='+postType+'&easybuyCallback=?';
	var dataUrl = 'http://192.168.3.29:8083/yez_easyBuyMall/secondHandController/QueryUsedName.easy?usedclassid='+postType+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		console.log(data);
		$('#second-nav-bar .navbtn span').html(data.UsedName);
		classTypeName = data.UsedName;
		requestSecondSearch(); //二手搜索
	});
}
//請求分類信息
function reqClass(self,slider){
//	var dataUrl = 'http://shopping.macaoeasybuy.com/secondHandController/queryUsedClass.easy?easybuyCallback=?';
	var dataUrl = 'http://192.168.3.29:8083/yez_easyBuyMall/secondHandController/queryUsedClass.easy?easybuyCallback=?';
	var classTemplate = easyBuy.global.template['class-template'];
	$.getJSON(dataUrl,function(data){
		var html = template.render(classTemplate,data);
		$('#second-slider-nav').html(html);
		$('#'+postType+'-second-class').addClass('select');
		if(self.hasClass('select')){
			self.removeClass('select');
			slider.stop().slideUp(150);
		}else{
			self.addClass('select');
			slider.stop().slideDown(150);
		}
	});
}
//二手搜索
function requestSecondSearch(state){
//	var state = state ? state : false;
	var Query = encodeURI(encodeURI(requestData.Query));
	var size = 10;
	var BeginPrice = requestData.BeginPrice;
	var EndPrice = requestData.EndPrice;
	var Orders = requestData.Orders;
	var Page = requestData.Page;
	var isComplete = requestData.isComplete;
	//搜索的總體字段開始
	var showBarArr = [classTypeName];
	var showPriceBar = '';
	if(BeginPrice == '-1' && EndPrice != '-1'){
		showPriceBar = 'MOP'+EndPrice;
	}else if(BeginPrice != '-1' && EndPrice == '-1'){
		showPriceBar = 'MOP'+BeginPrice;
	}else if(BeginPrice != '-1' && EndPrice != '-1'){
		showPriceBar = 'MOP'+BeginPrice+' ~ MOP'+EndPrice;
	}
	if(showPriceBar != '') showBarArr.push(showPriceBar);
	if(requestData.Query != '') showBarArr.push(requestData.Query);
	var showSearchBar = showBarArr.join(' , ');
	var searchResultTemplate = easyBuy.global.template['search-result-template'];
	//搜索的總體字段結束
	reqFunc();
	function reqFunc(){
		var dataUrl = 'http://192.168.3.29:8080/SolrPostsController/QueryUsedPosts.easy?DescOrAsc=desc&Query='+Query+'&Rows='+size+'&BeginPrice='+BeginPrice+'&EndPrice='+EndPrice+'&Orders='+Orders+'&Page='+Page+'&usedclassid='+postType+'&easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				scrollListen('off');
				if(isComplete) return false;
			},
			success:function(data){
				var newData = data.list;
				console.log(newData);
				//顯示搜索結果
				if(Page == 0){
					if(newData.numFound == 0){
						$('#search-result .search-result-inner').html('');
						$('#search-result .search-result-inner').css('height','0px');
						$('#show-result-tips .no-result .result-title').html(showSearchBar);
						$('#show-result-tips .has-result').css('display','none');
						$('#show-result-tips,#show-result-tips .no-result').css('display','block');
						searchBtnClick(); //辦定搜索點擊按鈕事件
						return false;
					}else{
						$('#show-result-tips .has-result .result-title').html(showSearchBar);
						$('#show-result-tips .has-result .result-number').html(newData.numFound);
						$('#show-result-tips .no-result').css('display','none');
						$('#show-result-tips,#show-result-tips .has-result').css('display','block');
					}
				}
				$.each(newData.classList, function(k,y) {
					y.postSeeNumber = formatNum(y.postSeeNumber);
					y.postLoveNumber = formatNum(y.postLoveNumber);
					y.replyCount = formatNum(y.replyCount);
					y.price = formatNum(y.price);
					y.postContent = y.postContent.replace(/src="/g,'src="'+easyBuy.global.osURL+'"');
				});
				var html = template.render(searchResultTemplate,newData);
				if(Page == 0){
					$('#search-result .search-result-inner').html(html);
				}else{
					$('#search-result .search-result-inner').append(html);
				}
				requestData.Page++;
				waterfall($('#search-result'),$('#search-result .pillar-all'),4,20,0,true);
				if(newData.classList.length == size){
					scrollListen('on');
				}else{
					scrollListen('off');
					requestData.isComplete = true;
					$('.no-more').css('display','block');
				}
				searchBtnClick(); //辦定搜索點擊按鈕事件
			}
		});
	}
}
//監聽全局滾動條
function scrollListen(state){
	if(state == 'on'){
		$(window).off('scroll.req');
		$(window).on('scroll.req',function(){
			var scrollTop = $(this).scrollTop();//滾動條高度
		　	var scrollHeight = $(document).height();
		　	var windowHeight = $(this).height();
		　	if(scrollTop + windowHeight >= scrollHeight * 0.6){
				requestSecondSearch();
		　	}
		});
	}else{
		$(window).off('scroll.req');
	}
}

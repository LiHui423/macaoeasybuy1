function searchSlide(){
	$('#search_btn').data('data',0);
	$('.shopDetails_searchBoxLeft').on('click',function(){
		if($(this).find('.shopDetails_searchBoxLeft_slideBox').css('display') == 'none'){
			$(this).find('.shopDetails_searchBoxLeft_slideBox').slideDown('fast')
		}else{
			$(this).find('.shopDetails_searchBoxLeft_slideBox').slideUp('fast')
		}
	})
	$('.shopDetails_searchBoxLeft_slideBox ul li').on('click',function(event){
		$(this).parents('.shopDetails_searchBoxLeft_slideBox').slideUp('fast');
		event.stopPropagation();
		$('.shopDetails_searchBoxLeft span:nth-child(1)').text($(this).text())
		$('#search_btn').data('data',$(this).index());
	});
	// maskClick('.shopDetails_searchBoxLeft',function(){
	// 	$('.shopDetails_searchBoxLeft').find('.shopDetails_searchBoxLeft_slideBox').slideUp('fast')
	// },'search');
	//點擊搜索
	$('#search_btn').on('click',function(){
		var str = $('#search-input').val();
		var opt = $(this).data('data');
		if(str == ''){
			alert('搜索內容不能為空');
		}else{
			switch(opt){
				case 0:
					//alert('跳去搜索結果頁');
					str = encodeURI(str);
					console.log(str);

					//window.location.href = 'http://192.168.3.38:8080/shopping/moreshops/shopDetails/shopDetails_search.html?shopId='+shopId+'&queryStr='+str;
				break;
				case 1:
					alert('跳去商場搜索結果頁');
				break;
			}
		}
	});
}

/*選擇排序方式*/
function choostypeBar(){
	$('.shopDetails_main_sorting_chooseLeft ul li').on('click',function(){
		var idx = $(this).index();
		if(idx < 2 && $(this).hasClass('sorting_curr')) return false;
		if($(this).hasClass('sorting_more') && $(this).hasClass('sorting_curr')){
			if(!$(this).hasClass('top') && !$(this).hasClass('bottom')){
				$(this).addClass('top');
			}else if($(this).hasClass('top')){
				$(this).removeClass('top').addClass('bottom');
			}else if($(this).hasClass('bottom')){
				$(this).removeClass('bottom').addClass('top');
			}
		}
		$(this).siblings('li').removeClass('sorting_curr').end().addClass('sorting_curr');
		//設置請求參數，並且調用請求
		window.searchOpt.isComplete = false;
		window.searchOpt.page = 0;
		window.searchOpt.order = idx;
		if(!$(this).hasClass('sorting_more')){
			window.searchOpt.descOrAsc = 0;
		}else{
			if($(this).hasClass('bottom')){
				window.searchOpt.descOrAsc = 0;
			}else{
				window.searchOpt.descOrAsc = 1;
			}
		}
		searchData();
	});
}

/*勾選券*/
function chooseVoucher(){
	$('.shopDetails_main_sorting_chooseRight ul li').each(function(k,y){
		$(this).on('click',function(){
			var idx = $(this).index();
			if($(this).hasClass('select')){
				//取消
				deleteArr(window.searchOpt.labelidinfoStr,idx+1);
			}else{
				//選上
				window.searchOpt.labelidinfoStr.push(idx+1);
			}
			$(this).toggleClass('select');
			window.searchOpt.isComplete = false;
			window.searchOpt.page = 0;
			searchData();
		});
	});
}

//獲取商店信息
function getShopInfo(state){
	var dataUrl = 'http://shopping1.macaoeasybuy.com/shopInfoController/queryShopInfo.easy?Shopid='+shopId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var newData = data.list[0];
		var topBox = $('#shopDetails_searchBar');
		var bottomBox = $('#containerBox');
		//商店logo
		topBox.find('.searchBarLeft_topLogo img').attr({
			'src' : '//wap.macaoeasybuy.com/'+newData.logo,
			'onerror' :'this.onerror = null;this.src="/img/common/loading_pc_shop.png"'
		}).css('visibility','visible');
		//商店描述
		topBox.find('.searchBarLeft_topData li').eq(0).find('div').html(newData.miao);
		topBox.find('.searchBarLeft_topData li').eq(1).find('div').html(newData.jia);
		topBox.find('.searchBarLeft_topData li').eq(2).find('div').html(newData.shang);
		//近期好評率
		topBox.find('.searchBarLeft_allData p').eq(0).html(newData.shopBestPercent);
		//商品數量
		topBox.find('.searchBarLeft_bottom .shop-number span').html(newData.shangpinCount);
		//商品類別
		topBox.find('.searchBarLeft_bottom .shop-type span').html(newData.goodsName);
		//商家評級
		var showHtml = '';
		if(newData.gouyongxin == 1){
			showHtml+='<img src="/src/img/easybuy/moreshops/icon/icon1.png" alt="" title="夠用心">';
		}
		if(newData.xinyuhao == 1){
			showHtml+='<img src="/src/img/easybuy/moreshops/icon/icon2.png" alt="" title="信譽好">';
		}
		if(newData.baozhengjin == 1){
			showHtml+='<img src="/src/img/easybuy/moreshops/icon/icon3.png" alt="" title="保證金">';
		}
		if(newData.fuwuyou == 1){
			showHtml+='<img src="/src/img/easybuy/moreshops/icon/icon4.png" alt="" title="服務優">';
		}
		if(newData.shitidian == 1){
			showHtml+='<img src="/src/img/easybuy/moreshops/icon/icon5.png" alt="" title="實體店">';
		}
		topBox.find('.searchBarLeft_bottom .shop-level span').html(showHtml);
		//舉報投訴
		topBox.find('.searchBarLeft_bottom .shop-report span').html(newData.reportCount);
		//創店時間
		topBox.find('.searchBarLeft_bottom .shop-starts span').html(newData.addtime);
		$('.searchBarLeft_bottom ul').css('visibility','visible');
		if(!state) return false;
		//店主頭像
		bottomBox.find('.shopDetails_shoper_head').html(`<img data-type="userAvatar" src="http://mbuy.oss-cn-hongkong.aliyuncs.com/${newData.shoppic}"`);
		//店主名字
		bottomBox.find('.shopDetails_shoper_name').html('店主'+newData.shopMan+'：');
		//商店描述
		bottomBox.find('.shopDetails_shoper_intro').html(newData.shopms);
		//輪播圖
		$.each(newData.shopadvertisements, function(k,y) {
			$('#foodBannerul').append('<li><a><img src="//wap.macaoeasybuy.com/'+y.pic+'"></a></li>');
			var spanHtml = k == 0 ? '<span class="select"></span>' : '<span></span>';
			$('#foodBannerul-dotted').append(spanHtml);
		});
		$('#containerBox .shopDetails_operating_left p').eq(0).html(newData.shopadvertisements[0].titlename);
		$('#containerBox .shopDetails_operating_left p').eq(1).html(newData.shopadvertisements[0].introduce);
		//調用輪播圖
		easyBuy.global.dep.mygoodbanner({
			box: $('#containerBox .shopDetails_banner'),
			banner: $('#foodBannerul'),
			dotted : $('#foodBannerul-dotted span'),
			afterFunc : function(index){
				$('#containerBox .shopDetails_operating_left p').eq(0).html(newData.shopadvertisements[index-1].titlename);
				$('#containerBox .shopDetails_operating_left p').eq(1).html(newData.shopadvertisements[index-1].introduce);
			}
		});
		//到訪人數
		bottomBox.find('.shopDetails_visitor .shopDetails_visitor_left p').html(easyBuy.global.dep.formatNum(newData.shopvisitors));
		//到訪人頭
		$.each(newData.userPicInfolist, function(k,y) {
			var html = `<li><img data-type="userAvatar" src="//wap.macaoeasybuy.com/${y}"></li>`;
			bottomBox.find('.shopDetails_visitor .shopDetails_visitor_right ul').append(html);
			html = null;
		});
	});
}

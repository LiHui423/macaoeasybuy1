$(function(){
	returnResult()
})
/*全局定義順序分別是(關鍵字/二級分類/規格/參數)*/
var keyword,secondclass='',spStandard='',spStandardcode = '',Parameter='',Parametercode ='',Order='',AscOrDesc='',PriceStart=0,PriceEnd = '',labelinfo = '';

/*關鍵字之後頁面跳轉*/
function returnResult(){
	/*獲取keyword*/
	var url = window.location.search;
	var str = url.split("?");
	var strs = str[1].split("=");
	keyword = strs[1];

	/*把搜索的結果填到搜索框里 這裡需要暫緩執行才能把值寫上去很奇怪*/
	setTimeout(function(){
		$('#searchInput').val(decodeURI(decodeURI(keyword)))
	},100)

	if(keyword == ''){
		/*輸入內容為空*/
		console.log('null')
	}else{
		loadResult()
		seeOther()
	}
}

/*數據加載函數*/
function loadResult(){
	console.log(keyword);
	console.log(secondclass);
	console.log(spStandardcode);
	console.log(Parametercode);
	console.log(Order);
	console.log(AscOrDesc);
	console.log(AscOrDesc);
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrGoodsController/QueryGoodsSolr.easy?Query="+ keyword +"&Page=0&Rows=72&AreaClassName="+ secondclass +"&spStandard="+ spStandardcode +"&Parameter="+ Parametercode +"&Order="+Order+"&AscOrDesc="+AscOrDesc+"&PriceStart="+PriceStart+"&PriceEnd="+PriceEnd+"&labelinfo="+labelinfo+"&easybuyCallback=?",function(data){
		console.log(data)
		/*取到二次分類*/
		var htmlsecondClass = template("secondClass", data);
		$('.searchGood_middle ul').html(htmlsecondClass);

		/*取到規格分類*/
		var htmlchooseSize = template("chooseSize", data);
		$('.searchGood_sizeBox').html(htmlchooseSize);

		/*取到參數分類*/
		var htmlchooseSize = template("arguments", data);
		$('.searchGood_chooseOther_middle ul').html(htmlchooseSize);

		/*結果商品數量*/
		var searchGoodNumhtml= template("searchGoodNum", data);
		$('.search_result_title').html(searchGoodNumhtml);


		/*結果的商品*/
		var htmlsearchGood = template("searchGood", data);
		$('.search_result_goodList').html(htmlsearchGood);

		checkClass()
		checkChooseEach()
		Argument()
		resultNum()
		uploadType()
	})
}

/*選擇頁數數據加載函數*/
function choosePage(page){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrGoodsController/QueryGoodsSolr.easy?Query="+ keyword +"&Page="+ page +"&Rows=72&AreaClassName="+ secondclass +"&spStandard="+ spStandardcode +"&Parameter="+ Parametercode +"&Order="+Order+"&AscOrDesc="+AscOrDesc+"&PriceStart="+PriceStart+"&PriceEnd="+PriceEnd+"&labelinfo="+labelinfo+"&easybuyCallback=?",function(data){
		/*結果的商品*/
		var htmlsearchGood = template("searchGood", data);
		$('.search_result_goodList').html(htmlsearchGood);
		uploadType()
	})
}

/*隨便看看*/
function seeOther(){
	$.getJSON("http://shopping1.macaoeasybuy.com/ShangpinBottomController/queryShopRandomSp/0/12.easy?easybuyCallback=?",function(data){
		console.log(data);
		var seeOtherGood = template("seeGood", data);
		$('.search_result_seeOther_main').html(seeOtherGood);
		uploadType()
	})
}

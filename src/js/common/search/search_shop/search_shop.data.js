$(function(){
	returnResult()
})
var DescOrAsc='',Order='',NewOrNot = 0;
/*關鍵字之後頁面跳轉*/
function returnResult(){
	/*獲取keyword*/
	var url = window.location.search;
	var str = url.split("?");
	var strs = str[1].split("=");
	var keyword = strs[1];

	/*把搜索的結果填到搜索框里 這裡需要暫緩執行才能把值寫上去很奇怪*/
	setTimeout(function(){
		$('#searchInput').val(decodeURI(decodeURI(keyword)))
	},100)

	if(keyword == ''){
		/*輸入內容為空*/
		console.log('null')
	}else{
		loadResult(keyword);
		seeOther()
	}
}

function loadResult(keyword){
	$.getJSON("http://social1.macaoeasybuy.com/SolrShopsController/QuerySolrShop.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Order="+Order+"&Page=0&Rows=6&easybuyCallback=?",function(data){
		console.log(data)
		var searchShopNum = template("searchShopNum", data);
		$('.search_result_title').html(searchShopNum);

		var htmlsearchShop = template("shopList", data);
		$('.search_resultBox_list').html(htmlsearchShop);

		resultNum(keyword);
		shopScrollFunc();
		enterShop();//進店看看
	})
}

/*選擇頁數*/
function choosePage(page){
	$.getJSON("http://social1.macaoeasybuy.com/SolrShopsController/QuerySolrShop.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Order="+Order+"&Page="+page+"&Rows=6&easybuyCallback=?",function(data){

		var htmlsearchShop = template("shopList", data);
		$('.search_resultBox_list').html(htmlsearchShop);

		shopScrollFunc()
	})
}


function seeOther(){
	$.getJSON("http://social1.macaoeasybuy.com/SolrShopsController/QueryBottomRandomShops.easy?easybuyCallback=?",function(data){
		var seeOtherShop = template("seeOther", data);
		$('.seeOtherShop_mian').html(seeOtherShop);
		shopScrollFunc();
		enterShop();//進店看看
	})
}

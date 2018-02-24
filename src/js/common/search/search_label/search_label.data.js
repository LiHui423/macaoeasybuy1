$(function(){
	returnResult();
	var url = window.location.search;
	var str = url.split("?");
	var strs = str[1].split("=");
	var keyword = strs[1];
})
/*全局定義*/
var DescOrAsc='',Order='',Page = 0,fq = -1;

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
		loadResult(keyword)
		loadRightPart(0,$("[data-boxid = '0']"))
	}
}

function loadResult(keyword){
	$.getJSON("http://social1.macaoeasybuy.com/SolrLabelsController/QueryLabels.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Order="+Order+"&Page=0&fq="+fq+"&Rows=10&easybuyCallback=?",function(data){
		console.log(data);
		var searchLabelNum = template("searchLabelNum", data);
		$('.search_result_title').html(searchLabelNum);

		var htmlsearchShop = template("labelList", data);
		$('.search_label_resultEachBox').html(htmlsearchShop);

		/*搜索結果分類數量*/
		var htmllabelClassNum = template("labelClassNum", data);
		$('.search_sortBox_left ul').html(htmllabelClassNum);

		if(data.list.numFound == 0){
			$('.search_label_noResult').show();
			$('.search_label_noResult>span').html(decodeURI(decodeURI(keyword)));
		}else if(data.list.classList.length < 10){
			$('.search_label_noResult').hide()
			$('.noMore').show()
		}else{
			$('.search_label_noResult').hide()
			searchTopicScroll();
			over = false
		}
		chooseTab(keyword)
		resultNum(keyword);
	})
}

function chooseTypeGood(keyword){
	$.getJSON("http://social1.macaoeasybuy.com/SolrLabelsController/QueryLabels.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Order="+Order+"&Page=0&fq="+fq+"&Rows=10&easybuyCallback=?",function(data){

		var htmlsearchShop = template("labelList", data);
		$('.search_label_resultEachBox').html(htmlsearchShop);

		if(data.list.numFound == 0){
			$('.search_label_noResult').show();
			$('.search_label_noResult p span').html(decodeURI(decodeURI(keyword)));
		}else if(data.list.classList.length < 10){
			$('.search_label_noResult').hide()
			$('.noMore').show();
		}else{
			$('.search_label_noResult').hide()
			searchTopicScroll()
			over = false
		}
	})
}

function loadResultTabAppend(){
	$.getJSON("http://social1.macaoeasybuy.com/SolrLabelsController/QueryLabels.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Order="+Order+"&Page="+Page+"&fq="+fq+"&Rows=10&easybuyCallback=?",function(data){
		/*搜索結果*/
		$('.loadNow').hide()
		if(data.list.classList.length < 10){
			over = true;
			$('.noMore').show()
		}else{

		}
		var htmlsearchShop = template("labelList", data);
		$('.search_label_resultEachBox').append(htmlsearchShop);

	})
}

function loadRightPart(labelType,containerBox){
	$.getJSON("http://social1.macaoeasybuy.com/SolrLabelsController/QueryRandomLabels.easy?labelType="+ labelType +"",function(data){
		console.log(data);
		var html = template("rightLabelList", data);
		containerBox.html(html);
	})
}

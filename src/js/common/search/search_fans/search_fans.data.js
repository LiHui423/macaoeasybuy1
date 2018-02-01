$(function(){
	returnResult()
})

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


	loadResult();
}

var Page;

function loadResult(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrUsersController/QueryUsers.easy?&Query="+keyword+"&Page=0&Rows=16&easybuyCallback=?",function(data){

		console.log(data);

		var searchFansNum = template("searchFansNum", data);
		$('.search_result_title').html(searchFansNum);

		var htmlsearchFans = template("fansList", data);
		$('.search_fansList #search_fansList_ul').html(htmlsearchFans);

		if(data.list.numFound == 0){
			$('.search_result_null').show()
		}else if(data.list.classList.length < 16){
			$('.search_result_null').hide()
			$('.noMore').show()
		}else{
			$('.search_result_null').hide()
			searchFanScroll()
			over = false
		}
		resultNum()
	})
}

function appendLoading(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrUsersController/QueryUsers.easy?&Query="+keyword+"&Page="+Page+"&Rows=16&easybuyCallback=?",function(data){
		var htmlsearchFans = template("fansList", data);
		$('.search_fansList #search_fansList_ul').append(htmlsearchFans);
	})
}

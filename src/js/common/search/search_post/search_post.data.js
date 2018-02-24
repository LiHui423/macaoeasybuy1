$(function(){
	returnResult()
})

var DescOrAsc='',Orders='',Page = 0,fq = 0,fqTime = 0;

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
	}
}

function loadResult(keyword){
	$.getJSON("http://social1.macaoeasybuy.com/SolrPostsController/QueryPosts.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Orders="+Orders+"&Page=0&fq="+fq+"&fqtime="+fqTime+"&Rows=10&easybuyCallback=?",function(data){
		console.log(data)
		/*搜索結果總數*/
		var searchPostNum = template("searchPostNum", data);
		$('.search_result_title').html(searchPostNum);

		/*搜索結果分類數量*/
		var html = template("postClassNum", data);
		$('.search_sortBox_left ul').html(html);

		/*搜索結果*/
		var htmlsearchPost = template("postList", data);
		$('.search_result_postList').html(htmlsearchPost);

		if(data.list.numFound == 0){
			$('.search_label_noResult').show()
		}else if(data.list.classList.length < 10){
			$('.search_label_noResult').hide()
			$('.noMore').show()
		}else{
			$('.search_label_noResult').hide()
			searchPostScroll()
			var over = false
		}
		chooseTab()
		resultNum(keyword);
	})
}

function chooseTypeGood(keyword){
	$.getJSON("http://social1.macaoeasybuy.com/SolrPostsController/QueryPosts.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Orders="+Orders+"&Page=0&fq="+fq+"&fqtime="+fqTime+"&Rows=10&easybuyCallback=?",function(data){
		console.log(data);
		if(data.list.numFound == 0){
			$('.search_label_noResult').show()
			$('.noMore').hide()
		}else if(data.list.classList.length < 10){
			$('.search_label_noResult').hide()
			$('.noMore').show();
		}else{
			$('.search_label_noResult').hide()
			searchPostScroll()
		}
		/*搜索結果*/
		var htmlsearchPost = template("postList", data);
		$('.search_result_postList').html(htmlsearchPost);

	})
}

function loadResultTabAppend(keyword){
	$.getJSON("http://social1.macaoeasybuy.com/SolrPostsController/QueryPosts.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Orders="+Orders+"&Page="+Page+"&fq="+fq+"&fqtime="+fqTime+"&Rows=10&easybuyCallback=?",function(data){
		/*搜索結果*/
		$('.loadNow').hide()
		if(data.list.classList.length < 10){
			var over = true;
			$('.noMore').show()
		}else{

		}
		var htmlsearchPost = template("postList", data);
		$('.search_result_postList').append(htmlsearchPost);

	})
}

function loadRightCommon(){
	$.getJSON("http://social1.macaoeasybuy.com/SolrPostsController/QueryPostForType.easy?Type="+fq+"",function(data){
		var htmlPostRight = template("postListRightCommon", data);
		$('.search_result_right_tab_common').html(htmlPostRight);
	})
}

function loadRightAlbum(){
	$.getJSON("http://social1.macaoeasybuy.com/SolrPostsController/QueryPostForType.easy?Type=5",function(data){
		var htmlsearchPost = template("postListRightAlbum", data);
		$('.search_result_right_tab_album').html(htmlsearchPost);
	})
}

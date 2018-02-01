$(function(){
	returnResult()
})

var DescOrAsc='',Orders='',Page = 0,fq = 0,fqTime = 0;//fq(1是福利社2是宜買話題3是全球筍貨)fqTime(0是不限時間1是一個月內2是三個月內)

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
		rightLoadPart()
	}
}

function loadResult(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrTopicsController/QueryTopics.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Orders="+Orders+"&Page=0&fq="+fq+"&fqTime="+fqTime+"&Rows=10&easybuyCallback=?",function(data){

		/*搜索結果總數*/
		var searchTopicNum = template("searchTopicNum", data);
		$('.search_result_title').html(searchTopicNum);

		/*搜索結果分類數量*/
		var htmltopicClassNum = template("topicClassNum", data);
		$('.search_sortBox_left ul').html(htmltopicClassNum);

		/*搜索結果*/
		var htmlsearchTopic = template("topicList", data);
		$('.search_topic_resultListBox').html(htmlsearchTopic);

		if(data.list.numFound == 0){
			$('.search_label_noResult').show()
		}else if(data.list.classList.length < 10){
			$('.search_label_noResult').hide()
			$('.noMore').show()
		}else{
			$('.search_label_noResult').hide()
			searchTopicScroll()
			over = false
		}
		chooseTab()
		resultNum()
	})
}

function chooseTypeGood(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrTopicsController/QueryTopics.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Orders="+Orders+"&Page=0&fq="+fq+"&fqTime="+fqTime+"&Rows=10&easybuyCallback=?",function(data){
		if(data.list.numFound == 0){
			$('.search_label_noResult').show()
			$('.noMore').hide()
		}else if(data.list.classList.length < 10){
			$('.search_label_noResult').hide()
			$('.noMore').show()
		}else{
			$('.search_label_noResult').hide()
			searchTopicScroll()
		}
		/*搜索結果*/
		var htmlsearchTopic = template("topicList", data);
		$('.search_topic_resultListBox').html(htmlsearchTopic);

	})
}

function loadResultTabAppend(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrTopicsController/QueryTopics.easy?&Query="+keyword+"&DescOrAsc="+DescOrAsc+"&Orders="+Orders+"&Page="+Page+"&fq="+fq+"&fqTime="+fqTime+"&Rows=10&easybuyCallback=?",function(data){
		/*搜索結果*/
		$('.loadNow').hide()
		if(data.list.classList.length < 10){
			over = true;
			$('.noMore').show()
		}else{

		}
		var htmlsearchTopic = template("topicList", data);
		$('.search_topic_resultListBox').append(htmlsearchTopic);

	})
}

//請求右側數據
function rightLoadPart(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrTopicsController/QueryOtherTopics.easy?easybuyCallback=?",function(data){
		console.log(data)
		var html = template("topicRightPart", data);
		$('.search_result_mainRight').append(html);
	})
}

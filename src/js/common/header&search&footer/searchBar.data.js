// $(function(){
// 	goodKey();
// 	shopKey();
// 	labelKey();
// 	topicKey();
// 	postKey();
// 	fansKey();
// })

function goodKey(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrGoodsController/QueryHotSearchGoods.easy?easybuyCallback=?",function(data){
		var html = template("goodKeyword", data);
		$(".searchBar_recommendEach_good .searchBar_recommendEach_main ul").html(html);
		clickSecondClass();
	});
}

function shopKey(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrShopsController/QuerySolrRandomShops.easy?easybuyCallback=?",function(data){
		var html = template("shopKeyword", data);
		$(".searchBar_recommendEach_shop .searchBar_recommendEach_main ul").html(html);
	});
}

function labelKey(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrLabelsController/QueryHotSearchLabels.easy?easybuyCallback=?",function(data){
		var html = template("labelKeyword", data);
		$(".searchBar_recommendEach_label .searchBar_recommendEach_main ul").html(html);
	});
}

function topicKey(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrTopicsController/queryHotSearchTopic.easy?easybuyCallback=?",function(data){
		var html = template("topicKeyword", data);
		$(".searchBar_recommendEach_topic .searchBar_recommendEach_main ul").html(html);
	});
}

function postKey(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrPostsController/QuerySearchPostsInfo.easy?easybuyCallback=?",function(data){
		var html = template("postKeyword", data);
		$(".searchBar_recommendEach_post .searchBar_recommendEach_main ul").html(html);
	});
}

function fansKey(){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrUsersController/QueryCommandSearchUser.easy?easybuyCallback=?",function(data){
		var html = template("fansKeyword", data);
		$(".searchBar_recommendEach_fans .searchBar_recommendEach_main ul").html(html);
	});
}

function goodLoad(keyword){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrGoodsController/QueryGoodsForTitle.easy?Query="+ keyword +"&easybuyCallback=?",function(data){
		var html = '';
		if(data.list.length == 0||data.list == null){
			html = '<li class="typeNormal"><p>暫無推薦選項</p></li>';
		}else{
			for(var i = 0;i < data.list.length;i++){
				html = html + '<li class="typeNormal"><p>'+ data.list[i] +'</p></li>'
			}
		}
		$('.searchBar_recommendEach_searching.searching_good .searchBar_recommendEach_main ul').html(html)
		keyWord()
	});
}

function shopLoad(keyword){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrShopsController/QueryShopsForTitle.easy?Query="+ keyword +"&easybuyCallback=?",function(data){
		var html = '';
		if(data.list.length == 0||data.list == null){
			html = '<li class="typeNormal"><p>暫無推薦選項</p></li>';
		}else{
			for(var i = 0;i < data.list.length;i++){
				if(data.list[i].shopLogo == ''){
					data.list[i].shopLogo = '/img/common/loading_pc_shop.png'
				}else{
					data.list[i].shopLogo = 'http://mbuy.oss-cn-hongkong.aliyuncs.com/'+ data.list[i].shopLogo
				}
				html = html + '<li class="clearfloat searchShop" data-id = "'+ data.list[i].shopid +'">'+
									'<div class="searchBar_recommendEach_shop_left"><img src="'+ data.list[i].shopLogo +'"></div>'+
									'<div class="searchBar_recommendEach_shop_right">'+
										'<p>'+ data.list[i].shopname +'</p>'+
										'<div class = "shopdata"><p>'+ data.list[i].shopAreaClassName +'</p><span>'+ data.list[i].shopGoodsCount +'款商品</span><span>'+ data.list[i].attentionCount +'位粉絲</span></div>'+
									'</div>'+
								'</li>'
			}
		}
		$('.searchBar_recommendEach_searching.searching_shop .searchBar_recommendEach_main ul').html(html)
	});
}

function labelLoad(keyword){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrLabelsController/QueryLabelsForTitle.easy?Query="+ keyword +"&easybuyCallback=?",function(data){
		var html = '';
		if(data.list.length == 0||data.list == null){
			html = '<li class="typeNormal"><p>暫無推薦選項</p></li>';
		}else{
			for(var i = 0;i < data.list.length;i++){
				html = html + '<li class="typeNormal"><p>'+ data.list[i] +'</p></li>'
			}
		}
		$('.searchBar_recommendEach_searching.searching_label .searchBar_recommendEach_main ul').html(html)
	});
}

function topicLoad(keyword){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrTopicsController/queryTopicsForTitle.easy?Query="+ keyword +"&easybuyCallback=?",function(data){
		var html = '';
		if(data.list.length == 0||data.list == null){
			html = '<li class="typeNormal"><p>暫無推薦選項</p></li>';
		}else{
			for(var i = 0;i < data.list.length;i++){
				html = html + '<li class="typeTopic" data-classid = "'+ data.list[i].classid +'" data-id = "'+ data.list[i].topicid +'"><p>'+ data.list[i].topicName +'</p><p>'+ data.list[i].topicContent +'</p></li>'
			}
		}
		$('.searchBar_recommendEach_searching.searching_topic .searchBar_recommendEach_main ul').html(html)
	});
}

function postLoad(keyword){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrPostsController/QueryPostsForTitle.easy?Query="+ keyword +"&easybuyCallback=?",function(data){
		var html = '';
		if(data.list.length == 0||data == null){
			html = '<li class="typeNormal"><p>暫無推薦選項</p></li>';
		}else{
			for(var i = 0;i < data.list.length;i++){
				if(data.list[i].postState == '1'){
					data.list[i].postState = '日誌'
				}else if(data.list[i].postState == '2'){
					data.list[i].postState = '敗家誌'
				}else if(data.list[i].postState == '3'){
					data.list[i].postState = '市集'
				}else if(data.list[i].postState == '4'){
					data.list[i].postState = '二手'
				}else if(data.list[i].postState == '5'){
					data.list[i].postState = '宜生活'
				}else if(data.list[i].postState == '6'){
					data.list[i].postState = '專輯'
				}
				html = html + '<li class="typePost" data-id = "'+ data.list[i].postid +'" data-type = "'+ data.list[i].postState +'"><p class="hiddenText">'+ data.list[i].postName +'</p>&nbsp;&nbsp;<p>/'+ data.list[i].postState +'/</p><p>'+ data.list[i].postContent +'</p></li>'
			}
		}
		$('.searchBar_recommendEach_searching.searching_post .searchBar_recommendEach_main ul').html(html)
	});
}

function fansLoad(keyword){
	$.getJSON("http://shopping1.macaoeasybuy.com/SolrUsersController/QueryUsersForTitle.easy?Query="+ keyword +"&easybuyCallback=?",function(data){
		var html = '';
		if(data.list.length == 0||data == null){
			html = '<li class="typeNormal"><p>暫無推薦選項</p></li>';
		}else{
			for(var i = 0;i < data.list.length;i++){
				if(data.list[i].expertlable == ''){
					data.list[i].expertlable = '普通百姓'
				}else{
					data.list[i].expertlable = data.list[i].shopLogo
				}
				html = html + '<li class="typeFans clearfloat" data-id = "'+ data.list[i].id +'">'+
									'<div class="searchBar_recommendEach_headpic myborder-radius"><img src="http://wap.macaoeasybuy.com/'+ data.list[i].pic +'"></div>'+
									'<div class="searchBar_recommendEach_mess">'+
										'<div class="searchBar_recommendEach_mess_top"><p>'+ data.list[i].name +'</p><span class = "SearchfanSex"><img src="/img/common/boy.png"></span></div>'+
										'<div class="searchBar_recommendEach_mess_bottom clearfloat">'+
											'<ul><li>'+ data.list[i].expertlable +'</li><li>'+ data.list[i].attentionCount +'粉絲</li><li>'+ data.list[i].postsCount +'帖子</li></ul>'+
										'</div>'+
									'</div>'+
								'</li>'
			}
		}
		$('.searchBar_recommendEach_searching.searching_fans .searchBar_recommendEach_main ul').html(html)
	});
}

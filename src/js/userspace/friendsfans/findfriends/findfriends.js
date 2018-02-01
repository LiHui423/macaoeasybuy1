easyBuy.global.startJs = function(){
	selectOption();//點擊下拉框
	searchSend(); //第一次請求數據;
	searchGo();
}
var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
var getRequestURL = easyBuy.global.dep.getRequestURL;
var formatNum = easyBuy.global.dep.formatNum;
var searchObj = {
	page : 0,
	query : '',
	rows : 9,
	expertlable : -1,
	isrecommend : -1,
	sex : '',
	isComplete : false
}
var cancelSearchObj = {
	query : '',
	expertlable : -1,
	isrecommend : -1,
	sex : '',
}
function bindCancelBtn(){
	$('.conditions .conditions-label div .cancel-btn').on('click',function(){
		var idx = parseInt($(this).parent().attr('data-index'));
		if($(this).parent().siblings('div').length == 0){
			$('.conditions').css('display','none');
		}
		$(this).parent().remove();
		switch(idx){
			case 0:
				cancelSearchObj.query = '';
			break;
			case 1:
				cancelSearchObj.sex = '';
			break;
			case 2:
				cancelSearchObj.expertlable = -1;
			break;
			case 3:
				cancelSearchObj.isrecommend = -1;
			break;
		}
		resetSearchSend('cancel');
	});
}
//發送搜索請求
function searchSend(state){
	var golbal = state == undefined ? searchObj : cancelSearchObj;
	var query = encodeURI(encodeURI(golbal.query)); //搜索關鍵字
	var expertlable = golbal.expertlable; //類型的Id，用戶身份  -1代表不查
	var isrecommend = golbal.isrecommend; //是否推薦  -1 不查 0 代表不推荐 1 代表推荐
	var sex = golbal.sex; //性別 'Girl' or 'Boy' 传' ' 值不查
	var page = searchObj.page; //頁數
	var rows = searchObj.rows; //搜索size
	var isComplete = searchObj.isComplete; //是否請求完成
	var easyTemplate = easyBuy.global.template['easy_template'];
//	var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrUsersController/QueryUsers.easy?Page='+page+'&Query='+query+'&Rows='+rows+'&expertlable='+expertlable+'&isrecommend='+isrecommend+'&sex='+sex+'&easybuyCallback=?';
	var dataUrl = 'http://social1.macaoeasybuy.com/SolrUsersController/QueryUsers.easy';
	dataUrl = getRequestURL({
		targetURL : dataUrl,
		requestData : {
			Page : page,
			Query : query,
			Rows : rows,
			expertlable : expertlable,
			isrecommend : isrecommend,
			sex : sex
		},
		encryptData : true,
	});
	$.ajax({
		url:dataUrl,
		type:"get",
		async:true,
		dataType:'jsonp',
		beforeSend:function(){
			easyScrollRequest('off','lister',$(window));
			if(isComplete) return false;
		},
		success:function(data){
			if(data.list == null){
				data.list = {
					classList : [],
					facetMap : [],
					numFound : 0
				}
			}
			data.list.page = page;
			var html = template.render(easyTemplate,data.list);
			page != 0 ? $('#easy_box').append(html) : $('#easy_box').html(html);
			if(page == 0){
				$('.search-result span').html(formatNum(data.list.numFound));
				$('.search-result').css('display','block');
			}
			searchObj.page++;
			if(data.list.classList.length == rows){
				easyScrollRequest('on','lister',$(window),$(document),function(){
					searchSend();
				});
			}else{
				easyScrollRequest('off','lister',$(window));
				searchObj.isComplete = true;
				if(page != 0 || data.list.classList.length != 0) $('.no-more').css('display','block');
			}
		}
	});
}
//重置請求
function resetSearchSend(state){
	searchObj.page = 0;
	searchObj.isComplete = false;
	if(state == undefined){
		searchObj.query = $('#input-box input').val();
		cancelSearchObj.query = searchObj.query;
		cancelSearchObj.expertlable = searchObj.expertlable;
		cancelSearchObj.isrecommend = searchObj.isrecommend;
		cancelSearchObj.sex = searchObj.sex;
		searchSend();
	}else{
		searchSend('cancel');
	}
}

//點擊下拉框
function selectOption(){
	//辦定事件
	var flag = true;
	$('.selecter-title').on('click',function(){
		if($(this).parent().index() == 1 && flag == true){
			flag = false;
			reqListFunc($(this));
		}else{
			$('.selecter-options').stop().slideUp('fast');
			$(this).siblings('.selecter-options').stop().slideDown('fast');
		}
	});
	easyBuy.global.dep.maskClick('.selecter-options',function(){
		$('.selecter-options').stop().slideUp('fast');
	});
	//性別，是否推薦選擇
	$('#sex-box,#recommend-box').find('.selecter-options div').on('click',function(){
		var parentInx = $(this).parents('.selecter').index();
		switch(parentInx){
			case 0:
				if($(this).index() == 0){
					searchObj.sex = 'Boy';
				}else if($(this).index() == 1){
					searchObj.sex = 'Girl';
				}else{
					searchObj.sex = '';
				}
			break;
			case 2:
				if($(this).index() == 0){
					searchObj.isrecommend = 1;
				}else if($(this).index() == 1){
					searchObj.isrecommend = 0;
				}else{
					searchObj.isrecommend = -1;
				}
			break;
		}
		$(this).parent().siblings('.selecter-title').html($(this).html());
		$('.selecter-options').stop().slideUp('fast');
		$(this).parent().siblings('.selecter-title')[0].isSelect = true;
	});
	//請求用戶身份列表
	function reqListFunc(self){
//		var dataUrl = 'http://shopping1.macaoeasybuy.com/SolrUsersController/QueryExpertLabel.easy?easybuyCallback=?';
		var dataUrl = 'http://social1.macaoeasybuy.com/SolrUsersController/QueryExpertLabel.easy?easybuyCallback=?';
		$.getJSON(dataUrl,function(data){
			data.userList.push({
				id : -1,
				expertname : '不限身份'
			});
			var listhtml = '';
			$.each(data.userList,function(k,y){
				listhtml += '<div id="'+y.id+'identity">'+y.expertname+'</div>';
			});
			$('#identity-box .selecter-options').html(listhtml);
			$.each(data.userList,function(k,y){
				$('#'+y.id+'identity').data('data',y).on('click',function(){
					$(this).parent().siblings('.selecter-title').html($(this).data('data').expertname);
					searchObj.expertlable = $(this).data('data').id;
					$('.selecter-options').stop().slideUp('fast');
					$(this).parent().siblings('.selecter-title')[0].isSelect = true;
				}).removeAttr('id');
			});
			$('.selecter-options').stop().slideUp('fast');
			self.siblings('.selecter-options').stop().slideDown('fast');
		});
	}
}
//點擊搜索按鈕
function searchGo(){
	$('#search-btn').on('click',function(){
		var arr = [];
		var inputHtml = $('#input-box input').val();
		$('#find-nav .selecter-title').each(function(){
			if($(this)[0].isSelect){
				arr.push({
					text : $(this).text(),
					idx : $(this).parent().index()
				});
			}
		});
		if(arr.length == 0 && inputHtml.length == 0){
			return false;
		}
		$('.conditions .conditions-label').html(appendHtml(inputHtml,arr));
		$('.conditions').css('display','block');
		bindCancelBtn();
		arr.splice(0,arr.length);
		resetSearchSend(); //重置並且發出搜索
	});
}
//添加HTML元素
function appendHtml(val,arr){
	if(val.length == 0){
		var html = '';
	}else{
		var html = '<div data-index="0"><img src="/img/userspace/label/label-arrow.png" alt="" class="arrow">'+val+'<img src="/img/userspace/secondhand/cancel.png" class="cancel-btn"></div>';
	}
	if(arr.length>0){
		for(var i=0;i<arr.length;i++){
			html += '<div data-index="'+(arr[i].idx+1)+'"><img src="/img/userspace/label/label-arrow.png" alt="" class="arrow">'+arr[i].text+'<img src="/img/userspace/secondhand/cancel.png" class="cancel-btn"></div>';
		}
	}
	return html;
}

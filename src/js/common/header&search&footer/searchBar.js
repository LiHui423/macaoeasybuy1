(function(){
	var flag = easyBuy.social.isEasyLife;
	var requestHtml = ! flag ? '/common/searchBar.html' : '/common/searchBar_easyLife.html';
	$("#searchBox_rightBox").load(requestHtml,function(){
		requestHtml = null;
		searchBar();
		keyWord();
		//選擇國家
		if(!flag){
			chooseCountry();
			chooseCountryBar();
			flag = null;
		}
	});
})();

function chooseCountry(){
	$(".searchBox_right_topRight").click(function(){
		if($(".chooseCountry").is(':hidden')){
			$(".chooseCountry").show().animate({
				top:'200',
				opacity:'1'
			},800);
			$(".headPop_BG").show();
			$("body").css("position","fixed").css("height","100%");
			$("html").css("overflow-y","scroll");
			$(".headPop_BG").css('z-index','998');
			$(".chooseCountry").css('z-index','999');
		}
	})
	$(".headPop_BG").click(function(){
		$(".chooseCountry").animate({
			top:'-330',
			opacity:'0'
		},800).hide("slow");
		$(this).hide();
		$(".headPop_main_chooseBar").removeClass("headPop_main_chooseBar_curr");
		$("body").css("position","relative").css("height","auto");
	})
}

function chooseCountryBar(){
	$(".headPop_main_chooseBar").click(function(){
		if($(this).hasClass("headPop_main_chooseBar_curr")){
			$(this).removeClass("headPop_main_chooseBar_curr");
		}else{
			$(this).addClass("headPop_main_chooseBar_curr");
		}
	})
	$(".chooseBar_slideBox li").hover(function(){
		$(this).css("background-color","#FFD0D1");
		$(this).find("a").css("color","#FFFFFF");
	},function(){
		$(this).css("background-color","#FFFFFF");
		$(this).find("a").css("color","#333333");
	})
	$(".chooseBar_slideBox li").click(function(){
		$(".focusCountry").html($(this).find("a").text());
	})
	$(".chooseCountry_btn").click(function(){
		$(".distribution_way").html($(".focusCountry").text());
		$(this).parents(".headPop").hide();
		$(".headPop_BG").hide();
		$("body").css("position","relative").css("height","auto");
	})
	$(".closeBtnBox").click(function(){
		$(this).parents(".chooseCountry").animate({
			top:'-330',
			opacity:'0'
		},800).hide("slow");
		$(".headPop_BG").hide();
		$(".headPop_main_chooseBar").removeClass("headPop_main_chooseBar_curr");
		$("body").css("position","relative").css("height","auto");
	})
}

/*搜索框點擊事件*/
function searchBar(){
	/*搜索框的隱藏出現*/
	$('#searchInput').focus(function(){
		$('.searchBox_right_bottomLeft_slide').slideDown('fast');
		$('#search_slide_bg').show();
	})
	$('#search_slide_bg').on('click',function(){
		$('.searchBox_right_bottomLeft_slide').slideUp('fast');
		$('#search_slide_bg').hide();
	});
	$(document).on('scroll',function(){
		$('.searchBox_right_bottomLeft_slide').slideUp('fast');
		$('#search_slide_bg').hide();
		$('#searchInput').blur()
	})
	$('.searchBar_typeBox ul li').on('click',function(){
		$(this).addClass('searchBar_typeBox_curr').siblings().removeClass('searchBar_typeBox_curr');
		detectionStatus()
	})

	/*節流消抖動的綁定調用*/
	$('#searchInput').on('keypress keyup',debounce(nextFun, 500))

	function nextFun(){
		detectionStatus()
		changeReg()
	}

	/*debounce 防抖*/
	function debounce(fn, delay) {
		var ctx;
		var args;
		var timer = null;

		var later = function () {
		   fn.apply(ctx, args);
		   // 当事件真正执行后，清空定时器
		   timer = null;
		};

		  return function () {
		    ctx = this;
		    args = arguments;
		    // 当持续触发事件时，若发现事件触发的定时器已设置时，则清除之前的定时器
		    if (timer) {
		      clearTimeout(timer);
		      timer = null;
		    }

		    // 重新设置事件触发的定时器
		    timer = setTimeout(later, delay);
		  };
		}


	function detectionStatus(){
		var inputVal = $('#searchInput').val();
		var keyword = encodeURI(encodeURI(inputVal))
		var id = $('.searchBar_typeBox_curr').data('id');
		var name = $('.searchBar_typeBox_curr').data('name');
		$('#showchooseType').text('搜' + name)
		if($('#searchInput').val().length == 0){
			$('.searchBar_recommendBox').find("[data-id =" + id +"]").addClass('searchBar_recommendEach_curr').siblings().removeClass('searchBar_recommendEach_curr')
		}else{
			$('.searchBar_recommendBox').find("[data-main = " + id +"]").addClass('searchBar_recommendEach_curr').siblings().removeClass('searchBar_recommendEach_curr')
			if(keyword.length == 0){

				}else{
					if($('.searchBar_recommendEach_curr .searchBar_recommendEach_main ul').html() == ''){
						if(id == '1'){
							goodLoad(keyword)
						}else if(id == '2'){
							shopLoad(keyword)
						}else if(id == '3'){
							labelLoad(keyword)
						}else if(id == '4'){
							topicLoad(keyword)
						}else if(id == '5'){
							postLoad(keyword)
						}else if(id == '6'){
							fansLoad(keyword)
						}
					}else{
						if(inputVal == $('.searchBar_recommendEach_curr').find('.inputValWord').text()){
							return false;
						}else{
							if(id == '1'){
								goodLoad(keyword)
							}else if(id == '2'){
								shopLoad(keyword)
							}else if(id == '3'){
								labelLoad(keyword)
							}else if(id == '4'){
								topicLoad(keyword)
							}else if(id == '5'){
								postLoad(keyword)
							}else if(id == '6'){
								fansLoad(keyword)
							}
						}
					}
				}
			$('.searchBar_recommendBox').find("[data-main = " + id +"]").find('.searchBar_recommendEach_title').html('搜 “<span class="inputValWord">'+ inputVal +'</span> ” 相關'+ name + '<span><img src="/src/img/common/icon/nextIcon_black.png"></span>')
		}
	}
	/*對搜索回來的信息做關鍵字匹配*/
	function changeReg(){
		/*獲取到字符串*/
		var inputVal = $('#searchInput').val();
		var t = inputVal;
		var pList = $('.searchBar_recommendEach_searching .searchBar_recommendEach_main ul li').find('p');
		$.each(pList, function(){
			var nt = '<span class = "red_curr">'+ t +"</span>";
			var reg = RegExp(t,"g");
			$(this).html($(this).text().replace(reg,nt))
		});
	}
}



function keyWord(){
	$('.searchBox_right_bottomRight').off('click').on('click',function(){
		gotosearch();
	});
	$('.typeNormal').off('click').on('click',function(){
		$('#searchInput').val($(this).text())
		gotosearch();
	});
	// 搜索商店
	$('.searchShop').off('click').on('click',function(){
		let title=$(this).children('.searchBar_recommendEach_shop_right').find('p');
		$('#searchInput').val($(title[0]).text());
		gotosearch();
	});
	// 搜話題
	$('.typeTopic').off('click').on('click',function(){
		let title=$(this).find('p');
		$('#searchInput').val($(title[0]).text());
		gotosearch();
	});
	// 搜帖子
	$('.typePost').off('click').on('click',function(){
		let title=$(this).find('p');
		$('#searchInput').val($(title[0]).text());
		gotosearch();
	});
	// 搜宜粉
	$('.typeFans').off('click').on('click',function(){
		let title=$(this).find('p');
		$('#searchInput').val($(title[0]).text());
		gotosearch();
	});
}

/*下拉框點擊事件*/
function clickSecondClass(){
	// 熱搜商品點擊
	$('.searchBar_recommendEach_good .searchBar_recommendEach_main ul li').on('click',function(){
		$('#searchInput').val($(this).text());
		gotosearch();
	});
	// 熱搜商店點擊
	$('.searchBar_recommendEach_shop .searchBar_recommendEach_main ul li').on('click',function(){
		var children=$(this).children('.searchBar_recommendEach_shop_right').children()[0];
		$('#searchInput').val($(children).text());
		gotosearch();
	});
	// 熱搜標籤點擊
	$('.searchBar_recommendEach_label .searchBar_recommendEach_main ul li').on('click',function(){
		var labelName=$(this).children();
		$('#searchInput').val($(labelName[0]).text().split('#')[1]);
		gotosearch();
	});
	// 熱搜話題點擊
	$('.searchBar_recommendEach_topic .searchBar_recommendEach_main ul li').on('click',function(){
		var topicName=$(this).children();
		$('#searchInput').val($(topicName[0]).text());
		gotosearch();
	});
	// 熱搜帖子點擊
	$('.searchBar_recommendEach_post .searchBar_recommendEach_main ul li').on('click',function(){
		var postName=$(this).children();
		$('#searchInput').val($(postName[0]).text());
		gotosearch();
	});
	// 熱搜宜粉點擊
	$('.searchBar_recommendEach_fans .searchBar_recommendEach_main ul li').on('click',function(){
		var fansName=$(this).children();
		var span=$(fansName).find('span')[0];
		$('#searchInput').val($(span).text());
		gotosearch();
	});
}


/*執行搜索*/
function gotosearch(){
	/*獲取輸入框裡面的文字，假如沒有輸入關鍵字*/
	//var keyword = encodeURI(encodeURI($('#searchInput').val().split('#')[1]));
	var keyword = $('#searchInput').val().indexOf('#')===-1?encodeURI(encodeURI($('#searchInput').val())):encodeURI(encodeURI($('#searchInput').val().split('#')[1]));
	var type = $('.searchBar_typeBox_curr').data('id')
	/*通過選擇的分類來選擇跳轉的結果頁面*/
	if(type == '1'){
		if(keyword == ''){
			keyword = encodeURI(encodeURI($('.searchBar_recommendBox').find("[data-id = '1']").find('.searchBar_recommendEach_main ul li:nth-of-type(1)').text()))
			window.location.href = 'http://social.macaoeasybuy.com/common/search/search_good.html?keyword='+ keyword +''
		}else{
			window.location.href = 'http://social.macaoeasybuy.com/common/search/search_good.html?keyword='+ keyword +''
		}
	}else if(type == '2'){
		window.location.href = 'http://social.macaoeasybuy.com/common/search/search_shop.html?keyword='+ keyword +''
	}else if(type == '3'){
		window.location.href = 'http://social.macaoeasybuy.com/common/search/search_label.html?keyword='+ keyword +''
	}else if(type == '4'){
		window.location.href = 'http://social.macaoeasybuy.com/common/search/search_topic.html?keyword='+ keyword +''
	}else if(type == '5'){
		window.location.href = 'http://social.macaoeasybuy.com/common/search/search_post.html?keyword='+ keyword +''
	}else{
		window.location.href = 'http://social.macaoeasybuy.com/common/search/search_fans.html?keyword='+ keyword +''
	}
}

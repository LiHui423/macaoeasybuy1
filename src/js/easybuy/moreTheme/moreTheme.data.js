//主題館
function getThemeMuseum(){
	var page = 0;
	var size = 3;
	var isComplete = false;
	reqFunc(page);
	function reqFunc(page){
		var dataUrl = 'http://shopping1.macaoeasybuy.com/ThemePavilionController/queryThemeMess.easy?page='+page+'&size='+size+'&easybuyCallback=?'
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				getScrollFunc('off');
				if(isComplete) return false;
			},
			success:function(data){
				console.log(data);
				var html = template('theme_museum_template',data);
				$('#theme_museum_box').append(html);
				$.each(data.list, function(k,y) {
					moreThemeHover($('#'+y.id+'theme_museum'));
				});
				page++;
				if(data.list.length == size){
					getScrollFunc('on',page);
				}else{
					getScrollFunc('off');
					isComplete = true;
				}
			}
		});
	}
	//監聽滾動條
	function getScrollFunc(state,page){
		if(state == 'on'){
			$(window).on('scroll.museum',function(){
				var scrollTop = $(this).scrollTop();
				var windowHeight= $(this).height();
				var scrollHeight = $(document).height();
				if(scrollTop + windowHeight >= scrollHeight*0.6){
					reqFunc(page);
				}
			});
		}else{
			$(window).off('scroll.museum');
		}
	}
}


//主題商品
function getThemeShop(){
	var page = 0;
	var size = 5;
	var isComplete = false;
	reqFunc(page);
	function reqFunc(page){
		var dataUrl = 'http://shopping1.macaoeasybuy.com/ThemePavilionController/queryThemeMessForGoods.easy?page='+page+'&size='+size+'&easybuyCallback=?'
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				getScrollFunc('off');
				if(isComplete) return false;
			},
			success:function(data){
				console.log(data);
				var html = template('theme_shop_template',data);
				$('#theme_shop_box').append(html);
				page++;
				if(data.list.length == size){
					getScrollFunc('on',page);
				}else{
					getScrollFunc('off');
					isComplete = true;
				}
			}
		});
	}
	//監聽滾動條
	function getScrollFunc(state,page){
		if(state == 'on'){
			$(window).on('scroll.shop',function(){
				var scrollTop = $(this).scrollTop();
				var windowHeight= $(this).height();
				var scrollHeight = $(document).height();
				if(scrollTop + windowHeight >= scrollHeight*0.6){
					reqFunc(page);
				}
			});
		}else{
			$(window).off('scroll.shop');
		}
	}
}



function lookList(num){
	$.getJSON("http://shopping.macaoeasybuy.com/goodsYiPingController/queryUserSeeShangpinInfo/13/0/"+ num +".easy",function(data){
		var html = template('recentlyLook', data);
		$('#shop-main-interest').html(html);
	});
}
//商品
function queryList(num){
	$.getJSON("http://shopping.macaoeasybuy.com/goodsYiPingController/queryYiShangpinAreaClass/20/0/"+ num +".easy",function(data){
		var html = template('shopData', data);
		$('#my-shopping').html(html);
		museumListOnload()
	});
}

function museumListScroll(num){
	var page = 1;
	$(window).scroll(function(){
	　　var scrollTop = $(this).scrollTop();
	　　var scrollHeight = $(document).height();
	　　var windowHeight = $(this).height();
	　　if(scrollTop + windowHeight == scrollHeight){
		$.getJSON("http://shopping.macaoeasybuy.com/goodsYiPingController/queryYiShangpinAreaClass/20/"+ page+"/"+ num +".easy",function(data){
			if(data.list.length < 20){
				$(".noMore").show();
				var html = template('shopData', data);
				$('#my-shopping').append(html);
				return false;
			}else{
				var html = template('shopData', data);
				$('#my-shopping').append(html);
			}
			museumListOnload()
		});
		page++;
	　　}
	});	
}

//加載banner
function bannerPicBox(){
	var url="http://shopping1.macaoeasybuy.com/MallshopingMessController//queryMessAdvertisement/10111/10107/false/false.easy?easybuyCallback";
	$.ajax({
		url:url,
		type:"get",
		success:function(data){
			var result=JSON.parse(data);
			var html=``;
			for(var i=0;i<result.list.length;i++){
				if(result.list[i].bannerPic==""){
					html+=`<a href=${result.list[i].tourl}><img src="//img.macaoeasybuy.com/img/common/loadnow.jpg"></a>`;
				}else{
					html+=`<a href=${result.list[i].tourl}><img src=${result.list[i].bannerPic}></a>`;
				}
			}
			$(".scroll").html(html);
			mygoodbanner({
				box: $('#groupBuy_banner'),
				banner: $('#groupBuy_banner .scroll'),
				goLeft: $('#groupBuy_banner .before'),
				goRight: $('#groupBuy_banner .after'),
				childMargin: parseInt($('#groupBuy_banner .scroll').children().eq(0).css('margin-left'))
			});
		}
	});
}

/*加載最搶手模塊*/
function hottestBox(){
	var showHottestTemplate = easyBuy.global.template['showHottest'];
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsLimitController/querylimiteHotSp/6.easy?easybuyCallback=?",function(json){
		var hottestList = json;
		var html = template("showHottest", hottestList);
		$(".hottestBox_main").html(html);
		calcProgressBar();
	});
};

/*加載最近查看的粉絲*/
function recentlyLookBox(){
	var recentlyLookTemplate = easyBuy.global.template['recentlyLook'];
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsLimitController/queryXianUserSeeInfo.easy?easybuyCallback=?",function(json){
		var recentlyLook = json;
		var html = template("recentlyLook", recentlyLook);
		$("#shop-main-interest").html(html);
	});
}


//限量清單模板 第一頁
function hotListBoxHtml(){
	var showHotList = easyBuy.global.template['showHotList'];
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsLimitController/querylimiteSp/0/20.easy?easybuyCallback=?",function(json){
		var HotListList = json;
		var html = template("showHotList", HotListList);
		$(".limited_ListBox_goods").html('<div class="listBoxEach clearfloat" data-page ="1" >'+ html +'</div>');
		$.each(json.list, function(k,y) {
			calcHotListBar($('.ListBox_goodsEach[data-id='+y.id+']'));
		});
	});
}
//限量清單模板 第N頁
function hotListBoxAppend(page){
	var showHotListTemplate = easyBuy.global.template['showHotList'];
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsLimitController/querylimiteSp/"+ page +"/20.easy?easybuyCallback=?",function(json){
		$('.loadingnow').hide()
		if(json.list.length < 20){
			var over = true;
			var HotListList = json;
			var html = template("showHotList", HotListList);
			$(".limited_ListBox_goods").append('<div class="listBoxEach clearfloat"  data-page ="'+ page +'">'+ html +'</div>');
			$.each(json.list, function(k,y) {
				calcHotListBar($('.ListBox_goodsEach[data-id='+y.id+']'));
			});
			$(".noMore").show();
			return false;
		}else{
			var HotListList = json;
			var html = template("showHotList", HotListList);
			$(".limited_ListBox_goods").append('<div class="listBoxEach clearfloat" data-page ="'+ page +'">'+ html +'</div>');
			$.each(json.list, function(k,y) {
				calcHotListBar($('.ListBox_goodsEach[data-id='+y.id+']'));
			});
		}
	});
}

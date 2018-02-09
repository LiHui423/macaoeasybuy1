$(function(){
	bannerPicBox()
	findNewListBoxHtml(1,0,5)
	FindNewVisit()
})

/*banner圖數據加載*/
function bannerPicBox(){
	$.getJSON("http://shopping1.macaoeasybuy.com/MallshopingMessController/queryMessAdvertisement/10112/10107/false/false.easy?easybuyCallback=?",function(json){
		var bannerPicList = json;
		//var html = template("showBannerPic", bannerPicList);
		var html=``;
		var data=bannerPicList.list;
		for(var i=0;i<data.length;i++){
			if(data[i].bannerPic==""){
				html+=`<a href="${data[i].tourl}"><img src="//img.macaoeasybuy.com/img/common/loadnow.jpg"></a>`;
			}else{
				html+=`
					<a href="${data[i].tourl}"><img src="http://wap.macaoeasybuy.com/${data[i].bannerPic}"></a>
				`;
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
	});
};

/*發現新品最近查看模板*/
function FindNewVisit(){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsXinController/queryXinUserSeeInfo.easy?easybuyCallback=?",function(json){
		var findNewVisitList = json;
		var html = template("showFindNewVisit", findNewVisitList);
		$(".findNew_main_visitBox").html(html);
	});
}

// /*發現新品最近查看模板*/
// function FindNewVisit(){	
// 	var url="http://shopping1.macaoeasybuy.com/goodsXinController/queryXinUserSeeInfo.easy?easybuyCallback";
// 	$.ajax({
// 		url:url,
// 		type:"get",
// 		success:function(result){
// 			var data=(JSON.parse(result)).list;
// 			var html=`
// 				<div class="findNew_main_visitBoxLeft">
// 					<p>${data.SumSeeNumber}</p>
// 					<p>宜粉到訪</p>
// 				</div>
// 				<div class="findNew_main_visitBoxRight">
// 					<ul>
// 						${avatorList(data.userinfolist)}
// 					</ul>
// 				</div>
// 			`;
// 			function avatorList(arr){
// 				var htmlChild=``;
// 				for(var j=0;j<arr.length;j++){
// 					htmlChild+=`
// 						<li data-id=${arr[j].UserId}><img src='http://wap.macaoeasybuy.com${arr[j].pic}'></li>
// 					`;
// 				}
// 				return htmlChild;
// 			}
// 			$(".findNew_main_visitBox").html(html);
// 		}	
// 	});
// }

/*主題館廣告圖模板*/
function showFindNewBox(Areaid){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsXinController/queryXinSpTheme/"+ Areaid +".easy?easybuyCallback=?",function(json){
		var FindNewBannerList = json;
		console.log(FindNewBannerList);
		var html = template("showFindNewBanner", FindNewBannerList);
		$(".goodBox_themeBox_main").html(html);
	});
}


/*發現新品商品數據加載（替換）*/
function findNewListBoxHtml(order,Hbstate,Areaid){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsXinController/queryXinSpInfo/0/15/"+ order +"/0/"+ Hbstate +"/"+ Areaid +".easy?easybuyCallback=?",function(json){
		var findNewGoodList = json;
		var html = template("showFindNewGood", findNewGoodList);
		$(".findNew_main_goodBox_goodList").html(html);
		$(".noMore").hide();
		findNewOnload()
	});
}
/*發現新品商品數據加載（補充）*/
function findNewListBoxAppend(page,order,Hbstate,Areaid){
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsXinController/queryXinSpInfo/"+ page +"/15/"+ order +"/0/"+ Hbstate +"/"+ Areaid +".easy?easybuyCallback=?",function(json){
		$('.loadingnow').hide()
		if(json.list.length < 15){
			var over = true;
			//$(".noMore").show();
			$('.noMore').css('display','block');
			var findNewGoodList = json;
			var html = template("showFindNewGood", findNewGoodList);
			$(".findNew_main_goodBox_goodList").append(html);
			return false;
		}else{
			var findNewGoodList = json;
			var html = template("showFindNewGood", findNewGoodList);
			$(".findNew_main_goodBox_goodList").append(html);
		}
		findNewOnload()
	});
}

/*發送頁面點擊次數*/
function clickNum(id,userId){
	$.getJSON("http://userspace1.macaoeasybuy.com/shangPinSeeLogController/updateShangPinSeeLog.easy?id="+ id +"&userId=" + userId +"",function(json){
	})
}

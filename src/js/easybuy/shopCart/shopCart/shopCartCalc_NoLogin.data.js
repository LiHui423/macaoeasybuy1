function beforeDataJs(){
	otherGoodShow();
}
function afterDataJs(){
	shopcartTab();
	goodDetails();
	confirmDel();
	JiangTime();
	countOtderTopicInfoNoLogin();
	shopCartSecondNav();
}

function shopCartSecondNav(){
	var dataUrl = 'http://shopping.macaoeasybuy.com/shopCartController/QueryNoLoginShopCartCount.easy';
	var box = $('#shopCart_tabBox_box li');
	$.getJSON(dataUrl,function(data){
		var data = data.list[0];		
		box.eq(0).find('span:last-of-type').html(data.AllCount);
		box.eq(1).find('span:last-of-type').html(data.JiangCount);
		box.eq(2).find('span:last-of-type').html(data.SoldOut);
		box.eq(3).find('span:last-of-type').html(data.UnderCarrige);
	});
}

//頂部
function countOtderTopicInfoNoLogin(){
	$('#shopCart_searchBoxLeft_box li').eq(0).find('p span').html(window.shopCartNum); //購物籃
	$('#shopCart_searchBoxLeft_box').css('visibility','visible');
}

/*全部商品*/
function goodDetails(){
	$.get("http://shopping.macaoeasybuy.com/shopCartController/queryNoLoginShopCartInfo/0.easy",function(json){
        var jsonData={
        		list:json
        }
		var shopCarttabMainallhtml = template("shopCarttabMainall", jsonData);
		$(".shopCart_tabMain_all").html(shopCarttabMainallhtml);
		
		allEvent();
	});
}

/*降價商品*/
function goodDiscountDetails(){
	$.get("http://shopping.macaoeasybuy.com/shopCartController/queryNoLoginShopCartInfo/1.easy",function(json){
        var jsonData={
        	list:json
        }
		var shopCarttabMainallhtml = template("shopCarttabMainall", jsonData);
		$(".shopCart_tabMain_discount").html(shopCarttabMainallhtml);
		
		allEvent();
	});
}

/*即將售罄*/
function goodSellOutDetails(){
	$.get("http://shopping.macaoeasybuy.com/shopCartController/queryNoLoginShopCartInfo/2.easy",function(json){
        var jsonData={
        		list:json
        }
		var shopCarttabMainallhtml = template("shopCarttabMainall", jsonData);
		$(".shopCart_tabMain_sellOut").html(shopCarttabMainallhtml);
		
		allEvent();
	});
}
 

/*下架商品*/
function goodOffSellDetails(){
	$.get("http://shopping.macaoeasybuy.com/shopCartController/queryNoLoginShopCartInfo/3.easy",function(json){
        var jsonData={
        		list:json
        }
		var shopCarttabMainallhtml = template("shopCarttabMainoffSell", jsonData);
		$(".shopCart_tabMain_offSell").html(shopCarttabMainallhtml);
		
		allEvent();
	});
}


/*刪除購物籃商品*/
function DeleteShopCartGoods(idlist){
	
	var idInfoArr=idlist.split(",");
	
	var ShopCartCookie=getCookie("ShopCartCookie");
	var ShopCartCookieJSON=new Function('return ('+ShopCartCookie+')')();
	var ShopCartCookieJSONData=JSON.parse(ShopCartCookieJSON);
	
	for(var j=0;j<idInfoArr.length;j++){
		var idInfo=idInfoArr[j].split(":");
		var idInfoId=idInfo[0];
		var idInfosStan=idInfo[1];
		
		for(var i=0;i<ShopCartCookieJSONData.length;i++){
			var iGoodsId=ShopCartCookieJSONData[i].iGoodsId;
			var sStandard=ShopCartCookieJSONData[i].sStandard;

			if(idInfoId==iGoodsId&&idInfosStan==sStandard){
				ShopCartCookieJSONData.splice(i,1);
			}
		}
	}
	
	clearCookie("ShopCartCookie");
	
	if(ShopCartCookieJSONData.length>0){
		var ShopCartCookieJSONDataJson=JSON.stringify(JSON.stringify(ShopCartCookieJSONData));
		setCookie("ShopCartCookie", ShopCartCookieJSONDataJson, 5);
	}
	
	
}

/*更新购物车商品数量*/
function UpdateShopCartGoodsiCount(iCount,idlist){
	
	var idInfo=idlist.split(":");
	var idInfoId=idInfo[0];
	var idInfosStan=idInfo[1];
	
	var ShopCartCookie=getCookie("ShopCartCookie");
	var ShopCartCookieJSON=new Function('return ('+ShopCartCookie+')')();
	var ShopCartCookieJSONData=JSON.parse(ShopCartCookieJSON);
	
	for(var i=0;i<ShopCartCookieJSONData.length;i++){
		var iGoodsId=ShopCartCookieJSONData[i].iGoodsId;
		var sStandard=ShopCartCookieJSONData[i].sStandard;
		
		if(idInfoId==iGoodsId&&idInfosStan==sStandard){
			ShopCartCookieJSONData[i].iCount=iCount;
			clearCookie("ShopCartCookie");
			if(ShopCartCookieJSONData.length>0){
				var ShopCartCookieJSONDataJson=JSON.stringify(JSON.stringify(ShopCartCookieJSONData));
				setCookie("ShopCartCookie", ShopCartCookieJSONDataJson, 5);
			}
		}
	}
}


/*更新購物車的規格*/
function updateSpecifications(Specifications,idlist){
	var idInfo=idlist.split(":");
	var idInfoId=idInfo[0];
	var idInfosStan=idInfo[1];
	
	var ShopCartCookie=getCookie("ShopCartCookie");
	var ShopCartCookieJSON=new Function('return ('+ShopCartCookie+')')();
	var ShopCartCookieJSONData=JSON.parse(ShopCartCookieJSON);
	
	var flag=true;
	
	for(var i=0;i<ShopCartCookieJSONData.length;i++){
		var iGoodsId=ShopCartCookieJSONData[i].iGoodsId;
		var sStandard=ShopCartCookieJSONData[i].sStandard;
		var iCount=ShopCartCookieJSONData[i].iCount;
		
		if(idInfoId==iGoodsId&&idInfosStan==sStandard){
			ShopCartCookieJSONData[i].sStandard=Specifications;
		}
	}

	
	
	for(var i=0;i<ShopCartCookieJSONData.length;i++){
		var iGoodsId=ShopCartCookieJSONData[i].iGoodsId;
		var sStandard=ShopCartCookieJSONData[i].sStandard;
		var iCount=ShopCartCookieJSONData[i].iCount;
		
		for(j=i+1;j<ShopCartCookieJSONData.length;j++){
			var jiGoodsId=ShopCartCookieJSONData[j].iGoodsId;
			var jsStandard=ShopCartCookieJSONData[j].sStandard;
			var jiCount=ShopCartCookieJSONData[j].iCount;
			
			if(iGoodsId==jiGoodsId&&sStandard==jsStandard){
				ShopCartCookieJSONData[i].iCount=iCount+jiCount;
				ShopCartCookieJSONData.splice(j,1);
			}
		}
		
	}
	
	clearCookie("ShopCartCookie");
	if(ShopCartCookieJSONData.length>0){
		var ShopCartCookieJSONDataJson=JSON.stringify(JSON.stringify(ShopCartCookieJSONData));
		setCookie("ShopCartCookie", ShopCartCookieJSONDataJson, 5);
	}
	
	
}











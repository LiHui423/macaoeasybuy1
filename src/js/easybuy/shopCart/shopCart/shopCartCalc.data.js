$(function(){
	beforeDataJs();
})
function beforeDataJs(){
	otherGoodShow();
	startJs();

}
function startJs(){
	shopcartTab();
	countOtderTopicInfo();
	QueryUserBonusPoints();
	goodDetails();
	confirmDel();
	JiangTime();
	shopCartSettlement();
	shopCartSecondNav();
}

function shopCartSecondNav(){
	var userId = easyBuy.easyUser.id;
	var dataUrl = '//shopping1.macaoeasybuy.com/shopCartController/QueryShopCartCount.easy?iuserid='+userId+'&easybuyCallback=?';
	var box = $('#shopCart_tabBox_box li');
	$.getJSON(dataUrl,function(data){
		var data = data.list[0];
		box.eq(0).find('span:last-of-type').html(data.AllCount);
		box.eq(1).find('span:last-of-type').html(data.JiangCount);
		box.eq(2).find('span:last-of-type').html(data.SoldOut);
		box.eq(3).find('span:last-of-type').html(data.UnderCarrige);
	});
}

/*全部商品*/
function goodDetails(){
	$.getJSON("//shopping1.macaoeasybuy.com/shopCartController/queryShopCartInfo/100/0/0.easy?easybuyCallback=?",function(json){
		console.log(json);
		console.log(json.list);




		var jsonData={
        		list:json
		}
		console.log(jsonData);
		var shopCarttabMainallhtml = template("shopCarttabMainall", json);
		$(".shopCart_tabMain_all").html(shopCarttabMainallhtml);
		allEvent();
	});
}

/*降價商品*/
function goodDiscountDetails(){
	$.getJSON("//shopping1.macaoeasybuy.com/shopCartController/queryShopCartInfo/100/0/1.easy",function(json){
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
	$.getJSON("//shopping1.macaoeasybuy.com/shopCartController/queryShopCartInfo/100/0/2.easy",function(json){
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
	$.getJSON("//shopping1.macaoeasybuy.com/shopCartController/queryShopCartInfo/100/0/3.easy",function(json){
        var jsonData={
        		list:json
		}
		var shopCarttabMainallhtml = template("shopCarttabMainoffSell", jsonData);
		$(".shopCart_tabMain_offSell").html(shopCarttabMainallhtml);
		
		allEvent();
	});
}

/*用戶紅包積分*/
function QueryUserBonusPoints(){
	$.getJSON("//shopping1.macaoeasybuy.com/bonusPointsController/queryUserBonusPoints.easy?easybuyCallback=?",function(json){
		$(".UserPoint").html(json.list[0].point);
		$(".UserMop").html(json.list[0].mop);
		Redeem(json.list[0].moneyintegral);
		RedeemmainsureBtn();
	});
}

/*用户兑换红包*/
function ExchangeBonusPoints(ExchangPoint){
	$.getJSON("//shopping1.macaoeasybuy.com/bonusPointsController/ExchangeBonusPoints/"+ExchangPoint+".easy?easybuyCallback=?",function(json){
		if(json.messageState>-1){
			$(".shopCart_Redeem").fadeOut("fast");
			QueryUserBonusPoints();
			$(".transparent_bg").css("display","none");
		}
	});
}

/*刪除購物籃商品*/
function DeleteShopCartGoods(idlist){
	$.get("//shopping1.macaoeasybuy.com/shopCartController/deleteShopCart/"+idlist+".easy",function(json){
	});
}

/*更新购物车商品数量*/
function UpdateShopCartGoodsiCount(iCount,id){
	$.get("//shopping1.macaoeasybuy.com/shopCartController/updateShopCart/"+iCount+"/"+id+".easy",function(json){
	});
}

/*更新購物籃商品規格*/
function updateShopCartsStandard(sStandard,id,iGoodsid,iCount,Specifications){
	sStandard = encodeURI(encodeURI(sStandard));
	Specifications = encodeURI(encodeURI(Specifications));
	$.get("//shopping1.macaoeasybuy.com/shopCartController/updateShopCartsStandard/"+sStandard+"/"+id+"/"+iGoodsid+"/"+iCount+"/"+Specifications+".easy",function(json){
	});
}






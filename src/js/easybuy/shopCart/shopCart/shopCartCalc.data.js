function beforeDataJs(){
	otherGoodShow();
}
function startJs(data){
	shopcartTab();
	countOtderTopicInfo();
	goodDetails();
	QueryUserBonusPoints();
	confirmDel();
	JiangTime();
	shopCartSettlement();
	shopCartSecondNav(data.id);
}

function shopCartSecondNav(userId){
	var dataUrl = 'http://shopping.macaoeasybuy.com/shopCartController/QueryShopCartCount.easy?iuserid='+userId+'&easybuyCallback=?';
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
	$.get("http://shopping.macaoeasybuy.com/shopCartController/queryShopCartInfo/100/0/0.easy",function(json){
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
	$.get("http://shopping.macaoeasybuy.com/shopCartController/queryShopCartInfo/100/0/1.easy",function(json){
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
	$.get("http://shopping.macaoeasybuy.com/shopCartController/queryShopCartInfo/100/0/2.easy",function(json){
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
	$.get("http://shopping.macaoeasybuy.com/shopCartController/queryShopCartInfo/100/0/3.easy",function(json){
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
	$.getJSON("http://shopping.macaoeasybuy.com/bonusPointsController/queryUserBonusPoints.easy?easybuyCallback=?",function(json){
		$(".UserPoint").html(json.list[0].point);
		$(".UserMop").html(json.list[0].mop);
		Redeem(json.list[0].moneyintegral);
		RedeemmainsureBtn();
	});
}

/*用户兑换红包*/
function ExchangeBonusPoints(ExchangPoint){
	$.getJSON("http://shopping.macaoeasybuy.com/bonusPointsController/ExchangeBonusPoints/"+ExchangPoint+".easy?easybuyCallback=?",function(json){
		if(json.messageState>-1){
			$(".shopCart_Redeem").fadeOut("fast");
			QueryUserBonusPoints();
			$(".transparent_bg").css("display","none");
		}
	});
}

/*刪除購物籃商品*/
function DeleteShopCartGoods(idlist){
	$.get("http://shopping.macaoeasybuy.com/shopCartController/deleteShopCart/"+idlist+".easy",function(json){
	});
}

/*更新购物车商品数量*/
function UpdateShopCartGoodsiCount(iCount,id){
	$.get("http://shopping.macaoeasybuy.com/shopCartController/updateShopCart/"+iCount+"/"+id+".easy",function(json){
	});
}

/*更新購物籃商品規格*/
function updateShopCartsStandard(sStandard,id,iGoodsid,iCount,Specifications){
	sStandard = encodeURI(encodeURI(sStandard));
	Specifications = encodeURI(encodeURI(Specifications));
	$.get("http://shopping.macaoeasybuy.com/shopCartController/updateShopCartsStandard/"+sStandard+"/"+id+"/"+iGoodsid+"/"+iCount+"/"+Specifications+".easy",function(json){
	});
}






/*事件*/
function allEvent(){
	shopCartTicket();
	changeSize();
	shopCartCheckBox();
	deleteGood();
	ChooseSizeClick();
	Ceiling();
	ChangegoodChooseNumber();
	SumPrice();
	shopCartEachGoodChangeSizeSure();
	kucunController();
}


/**
 * 商品规格改变
 */
function shopCartEachGoodChangeSizeSure(){
	$(".shopCart_eachGood_changeSize_sure").off("click").on("click",function(){
		if($(this).hasClass("shopCart_eachGood_changeSize_sure_curr")){
			var bgall=$(this).closest(".shopCart_eachGood_changeSize").find(".bgall");
			var selected=$(this).closest(".shopCart_eachGood_changeSize").find(".selected");
			
			if(bgall.length==selected.length){
				
				var iGoodsid=$(this).closest(".shopCart_tabMain_eachGood").find(".shopCart_eachGood_pic").attr("data");
				var sStandard=$(this).closest(".shopCart_tabMain_eachGood").find(".shopCart_eachGood_size").attr("data");
				
				var iCount=$(this).closest(".shopCart_tabMain_goodBox").find(".goodChooseNumber").val();
				
				var id=$(this).closest(".shopCart_tabMain_eachGood").find(".shopCart_eachGood_operating").children("img").attr("data");
				
				var selected=$(this).closest(".shopCart_tabMain_eachGood").find(".selected");
				var Specifications="";
				if(!(Specifications==sStandard)){
					for(var i=0;i<3;i++){
						if(i<selected.length){
							var title=selected[i].title;
							Specifications+=title;
						}
						if(i<2){
							Specifications+="|";
						}
					}
					
					updateShopCartsStandard(sStandard,id,iGoodsid,iCount,Specifications);
					
					$(".shopCart_Settlement").removeClass('shopCart_Settlement_fixed');
					$(".transparent_bg").css("display","none");
					GoodsChangePageInfo();
				}
			}
		}
	});
}

/*欄目切換*/
function shopcartTab(){
	$('.shopCart_tabBox ul li').on('click',function(){
		$(this).addClass('shopCart_tabBox_curr').siblings().removeClass('shopCart_tabBox_curr');
		var index = $('.shopCart_tabBox ul li').index(this);
		$('.shopCart_tabMain_each').eq(index).removeClass('hide').siblings('.shopCart_tabMain_each').addClass('hide');
		
		$(".shopCart_Settlement").removeClass('shopCart_Settlement_fixed');
		
		if(!$('.shopCart_checkBox_all').hasClass("shopCart_checkBox_all_hide")){
			$('.shopCart_checkBox_all').click();
		}
		
		if(index==0){
			goodDetails();
		}else if(index==1){
			goodDiscountDetails();
		}else if(index==2){
			goodSellOutDetails();
		}else if(index==3){
			goodOffSellDetails();
		}
		
	})
}
/*優惠券詳情*/
function shopCartTicket(){
	$('.seeMore_btn').on('click',function(){
		$(this).siblings('.goodMessBox_messBox_ticketPopBox').fadeIn('fast')
		$('.transparent_bg').show()
	})
	$('.transparent_bg').on('click',function(){
		$('.transparent_bg').hide()
		$('.goodMessBox_messBox_ticketPopBox').fadeOut('fast')
	})
}

/*選擇規格*/
function changeSize(){
	$('.changeSize').on('click',function(){
		$(this).siblings('.shopCart_eachGood_changeSize').fadeIn('fast');
		$('.transparent_bg').show();
		$(this).parents('.shopCart_tabMain_eachGood').addClass('chooseNow');
	})
	$('.transparent_bg').on('click',function(){
		$('.transparent_bg').hide();
		$('.shopCart_eachGood_changeSize').fadeOut('fast');
		$('.shopCart_tabMain_eachGood').removeClass('chooseNow');
	})
	$('.shopCart_eachGood_changeSize_canel').on('click',function(){
		$('.transparent_bg').hide()
		$('.shopCart_eachGood_changeSize').fadeOut('fast')
		$('.shopCart_tabMain_eachGood').removeClass('chooseNow')
	});
	
	
	
}

/*吸頂吸底*/
function Ceiling(){
	$(".shopCart_Settlement").removeClass('shopCart_Settlement_fixed');
	var ssTop=$(".shopCart_Settlement ")[0].offsetTop;
	var ssHeight=$(".shopCart_Settlement ")[0].offsetHeight;
	
	var windowTop=$(window).scrollTop();
	var windowheight=$(window).height();
	if(windowheight+windowTop<ssTop+ssHeight){
		$(".shopCart_Settlement").addClass('shopCart_Settlement_fixed');
	}else{
		$(".shopCart_Settlement").removeClass('shopCart_Settlement_fixed');
	}
	
	$(window).off("scroll").on("scroll",function() {
		var windowTop=$(window).scrollTop();
		var windowheight=$(window).height();
		if(windowheight+windowTop<ssTop+ssHeight){
			$(".shopCart_Settlement").addClass('shopCart_Settlement_fixed');
		}else{
			$(".shopCart_Settlement").removeClass('shopCart_Settlement_fixed');
		}
	});
}

/*積分兌換*/
function Redeem(changeNum){
	var integral = parseInt($('.shopCart_Settlement_redBagDetails_integral').text());
	if(integral<changeNum){
		$('#shopCart_Redeem_input').attr('readonly','readonly')
		$('#shopCart_Redeem_input').css('color','#A8A8A8')
		$('.shopCart_Redeem_main_warming').text('* 積分少於'+ changeNum +'無法兌換紅包哦！').css('opacity','1');
	}else{
		$('#shopCart_Redeem_input').on("keyup", function () {
			$(this).val($(this).val().replace(/[\D]/g, ""));
			var inputNum = parseInt($(this).val())
			if(inputNum <= integral){
				if($(this).val()%changeNum == '0'&& $(this).val()/changeNum != 0){
					$('.shopCart_Redeem_main_redBag span').text('MOP'+ $(this).val()/changeNum);
					$('.shopCart_Redeem_main_warming').css('opacity','0')
					$('.Redeem_main_sureBtn').addClass('Redeem_main_sureBtn_curr')
				}else{
					$('.shopCart_Redeem_main_warming').css('opacity','1')
					$('.shopCart_Redeem_main_redBag span').text(0);
					$('.Redeem_main_sureBtn').removeClass('Redeem_main_sureBtn_curr')
				}	
			}else{
				if($(this).val() == ''){
					$('.Redeem_main_sureBtn').removeClass('Redeem_main_sureBtn_curr')
				}else{
					var max = Math.floor(integral/changeNum)*changeNum; 
					$(this).val(max)
					$('.shopCart_Redeem_main_redBag span').text('MOP'+ $(this).val()/changeNum);
					$('.shopCart_Redeem_main_warming').css('opacity','0')
					$('.Redeem_main_sureBtn').addClass('Redeem_main_sureBtn_curr')
				}
			}
		})
	}
	$('.shopCart_Settlement_redBag_opera').on('click',function(){
		$('.transparent_bg').show()
		$('.shopCart_Redeem').fadeIn('fast');
	})
	
	$('.transparent_bg').on('click',function(){
		$('.transparent_bg').hide()
		$('.shopCart_Redeem').fadeOut('fast')
		$('#shopCart_Redeem_input').val(0)
	})
	
	$('.Redeem_main_cancelBtn').on('click',function(){
		$('.transparent_bg').hide()
		$('.shopCart_Redeem').fadeOut('fast')
		$('#shopCart_Redeem_input').val(0)
	})
}

/*商品勾選*/
function shopCartCheckBox(){
	/*商品勾選*/
	$('.shopCart_checkBox_good').off("click").on('click',function(){
		if($(this).hasClass('shopCart_checkBox_good_hide')){
			$(this).removeClass('shopCart_checkBox_good_hide')
			if($(this).parents('.shopCart_tabMain_goodList').find('.shopCart_checkBox_good_hide').length == '0'){
				$(this).parents('.shopCart_tabMain_goodList').find('.shopCart_checkBox_shop').removeClass('shopCart_checkBox_shop_hide');
			}
			if($('.shopCart_checkBox_shop_hide').length == '0'){
				$('.shopCart_checkBox_all').removeClass('shopCart_checkBox_all_hide');
			}
		}else{
			$(this).addClass('shopCart_checkBox_good_hide')
			$(this).parents('.shopCart_tabMain_goodList').find('.shopCart_checkBox_shop').addClass('shopCart_checkBox_shop_hide');
			$('.shopCart_checkBox_all').addClass('shopCart_checkBox_all_hide')
		}
		SumPrice();
	})
	/*商店勾選*/
	$('.shopCart_checkBox_shop').off("click").on('click',function(){
		if($(this).hasClass('shopCart_checkBox_shop_hide')){
			$(this).removeClass('shopCart_checkBox_shop_hide')
			$(this).parents('.shopCart_tabMain_goodList').find('.shopCart_checkBox_good').removeClass('shopCart_checkBox_good_hide')
			if($('.shopCart_checkBox_shop_hide').length == '0'){
				$('.shopCart_checkBox_all').removeClass('shopCart_checkBox_all_hide');
			}
		}else{
			$(this).addClass('shopCart_checkBox_shop_hide')
			$(this).parents('.shopCart_tabMain_goodList').find('.shopCart_checkBox_good').addClass('shopCart_checkBox_good_hide')
			$('.shopCart_checkBox_all').addClass('shopCart_checkBox_all_hide')
		}
		SumPrice();
	})
	/*全選*/
	$('.shopCart_checkBox_all').off("click").on('click',function(){
		if($(this).hasClass('shopCart_checkBox_all_hide')){
			$(this).removeClass('shopCart_checkBox_all_hide')
			$('.shopCart_checkBox_shop').removeClass('shopCart_checkBox_shop_hide');
			$('.shopCart_checkBox_good').removeClass('shopCart_checkBox_good_hide');
		}else{
			$(this).addClass('shopCart_checkBox_all_hide')
			$('.shopCart_checkBox_shop').addClass('shopCart_checkBox_shop_hide');
			$('.shopCart_checkBox_good').addClass('shopCart_checkBox_good_hide');
		}
		SumPrice();
	})
}

/*刪除商品*/
function deleteGood(){
	/*單個刪除*/
	$('.shopCart_eachGood_operating img').off("click").on('click',function(){
		var id=$(this).attr("data");
		DeleteShopCartGoods(id);
		GoodsChangePageInfo();
	})
	/*批量刪除*/
	$('.shopCart_Settlement_delete').off("click").on('click',function(){
		$(".cancelLikePop").fadeIn("fast");
	})
	
}

/*刪除購物車商品(1)*/
function DelAllGoods(){
	$(".shopCart_tabMain_each").each(function(){
		if(!$(this).hasClass("hide")){
			var obj=$(this).attr("class").replace("shopCart_tabMain_each","").replace(/\s+/g, "");
			delGoods($("."+obj));
		}
	});
}

/*刪除購物車商品(2)*/
function delGoods(obj){
	var idlist="0";
	obj.find(".shopCart_checkBox_good").each(function(){
		var Gu=$(this);
		if(!Gu.hasClass("shopCart_checkBox_good_hide")){
			var shopcartid=Gu.attr("data");
			idlist+=",";
			idlist+=shopcartid;
		}
	});
	DeleteShopCartGoods(idlist);
}



/*删除商品后购物栏商品刷新*/
function GoodsChangePageInfo(){
	var index=$(".shopCart_tabBox_curr").index();
	if(index==0){
		goodDetails();
	}else if(index==1){
		goodDiscountDetails();
	}else if(index==2){
		goodSellOutDetails();
	}else if(index==3){
		goodOffSellDetails();
	}
}

/*确认删除*/
function confirmDel(){
	$(".cancelLikePop").find(".sureCancel").off('click').on('click',function(){
		DelAllGoods();
		GoodsChangePageInfo();
		$(".cancelLikePop").fadeOut("fast");
	});
	
	$(".cancelLikePop").find(".notSureCancel").off('click').on('click',function(){
		$(".cancelLikePop").fadeOut("fast");
	});
}


/*商品数量改变*/
function ChangegoodChooseNumber(){
	
	$(".messBox_calcBox_btnAdd").off("click").on('click',function(){
		var goodChoosNumber=$(this).siblings(".messBox_calcBox_inputBox").children(".goodChooseNumber");
		var value=parseInt(goodChoosNumber.val());
		var data=$(this).closest(".goodMessBox_messBox_calcBox").attr("data");
		
		var Dataarr=data.split(":");
		var kc=parseInt(Dataarr[0]);
		var sStandJiage=parseInt(Dataarr[1]);
		var preferentialPrice=parseInt(Dataarr[2]);
		var OldPrice=parseInt(Dataarr[3]);
		
		if(value<kc){
			value++;
		}else if(value>kc){
			value=kc;
		}
		goodChoosNumber.val(value);
		
		var CostPrice=$(this).closest(".shopCart_tabMain_eachGood").find(".eachCostPrice");
		CostPrice.html(value*(sStandJiage-preferentialPrice));
		var SavePrice=$(this).closest(".shopCart_tabMain_eachGood").find(".SavePrice");
		SavePrice.html("共省MOP"+value*(OldPrice-(sStandJiage-preferentialPrice)));
		
		var iCount=value;
		var id=$(this).closest(".shopCart_tabMain_eachGood").find(".shopCart_eachGood_operating").children("img").attr("data");
		UpdateShopCartGoodsiCount(iCount,id);
		
		SumPrice();
	});
	
	$(".messBox_calcBox_btnLess").off("click").on('click',function(){
		var goodChoosNumber=$(this).siblings(".messBox_calcBox_inputBox").children(".goodChooseNumber");
		var value=parseInt(goodChoosNumber.val());
		var data=$(this).closest(".goodMessBox_messBox_calcBox").attr("data");
		var Dataarr=data.split(":");
		var kc=parseInt(Dataarr[0]);
		var sStandJiage=parseInt(Dataarr[1]);
		var preferentialPrice=parseInt(Dataarr[2]);
		var OldPrice=parseInt(Dataarr[3]);
		
		if(value>kc){
			value=kc
		}else if(value<=kc&&value>1){
			value--;
		}
		
		var CostPrice=$(this).closest(".shopCart_tabMain_eachGood").find(".eachCostPrice");
		CostPrice.html(value*(sStandJiage-preferentialPrice));
		var SavePrice=$(this).closest(".shopCart_tabMain_eachGood").find(".SavePrice");
		SavePrice.html("共省MOP"+value*(OldPrice-(sStandJiage-preferentialPrice)));
		
		goodChoosNumber.val(value);
		var iCount=value;
		var id=$(this).closest(".shopCart_tabMain_eachGood").find(".shopCart_eachGood_operating").children("img").attr("data");
		UpdateShopCartGoodsiCount(iCount,id);
		
		SumPrice();
	});
	
	$(".goodChooseNumber").off("blur").on("blur",function(){
		
		var value=parseInt($(this).val());
		var data=$(this).closest(".goodMessBox_messBox_calcBox").attr("data");
		var Dataarr=data.split(":");
		var kc=parseInt(Dataarr[0]);
		var sStandJiage=parseInt(Dataarr[1]);
		var preferentialPrice=parseInt(Dataarr[2]);
		var OldPrice=parseInt(Dataarr[3]);
		
		if(value>kc){
			value=kc;
		}
		
		$(this).val(value);
		
		
		var CostPrice=$(this).closest(".shopCart_tabMain_eachGood").find(".eachCostPrice");
		CostPrice.html(value*(sStandJiage-preferentialPrice));
		var SavePrice=$(this).closest(".shopCart_tabMain_eachGood").find(".SavePrice");
		SavePrice.html("共省MOP"+value*(OldPrice-(sStandJiage-preferentialPrice)));
		
		var iCount=value;
		var id=$(this).closest(".shopCart_tabMain_eachGood").find(".shopCart_eachGood_operating").children("img").attr("data");
		UpdateShopCartGoodsiCount(iCount,id);
		
		SumPrice();
	});
}

/*底部商品换一换*/
function Spbottomchange(){
	$(".shopCart_recommendBox_title_change").off("click").on('click',function(){
		otherGoodShow();
	});
}

/*全部价格*/
function SumPrice(){
	
	var SumPrice=0;
	var SavePrice=0;
	
	var index=$(".shopCart_tabBox_curr").index();
	if(index==0){
		var obj=$(".shopCart_tabMain_all");
		SumAllPrice(obj);
	}else if(index==1){
		var obj=$(".shopCart_tabMain_discount");
		SumAllPrice(obj);
	}else if(index==2){
		var obj=$(".shopCart_tabMain_sellOut");
		SumAllPrice(obj);
	}else if(index==3){
		var obj=$(".shopCart_tabMain_offSell");
		SumAllPrice(obj);
	}
	
	function SumAllPrice(obj){
		obj.find(".shopCart_checkBox_good").each(function(){
			if(!$(this).hasClass("shopCart_checkBox_good_hide")){
				var ecprice=$(this).closest(".shopCart_tabMain_eachGood").find(".ecprice").attr("data");
				var seprice=$(this).closest(".shopCart_tabMain_eachGood").find(".oldprice").attr("data");
				SumPrice+=parseInt(ecprice);
				SavePrice+=parseInt(seprice);
			}
		})
	}
	
	$(".costSumPrice").html(SumPrice+"元");
	$(".SaveSumPrice").html(SavePrice+"元");
	
	
}

//降价时间
function JiangTime(){
	var timer=null;
	
	TimeProcess();
	
    function TimeProcess(){
    	
    	timer=setTimeout(function(){TimeProcess();},1000);
    	
    	$(".JiangTime").each(function(){
    		
    		var data=$(this).attr("data");
    		var jiangEndSecond=parseInt(data);
    		
    		if(jiangEndSecond>0){
    			var day=Math.floor(jiangEndSecond/(24*60*60)); //天
    			var hour=Math.floor((jiangEndSecond%(24*60*60))/(60*60)); //时
    			var minute=Math.floor(((jiangEndSecond%(24*60*60))%(60*60))/60); //分
    			var second=Math.floor(((jiangEndSecond%(24*60*60))%(60*60))%60); //秒
    			
    			$(this).children(".Jianghour").html(hour);
    			$(this).children(".Jiangminute").html(minute);
    			$(this).children(".Jiangsecond").html(second);
    			
    			jiangEndSecond--;
    			$(this).attr("data",jiangEndSecond);
    		}else{
    			clearTimeout(timer);
    		}
    	});
    }
}


/*用户红包兑换*/
function RedeemmainsureBtn(){
	$(".Redeem_main_sureBtn ").off("click").on("click",function(){
		if($(this).hasClass("Redeem_main_sureBtn_curr")){
			
			var ExchangPoint=$("#shopCart_Redeem_input").val();
			ExchangeBonusPoints(ExchangPoint);
		}
	});
} 

/*商品結算*/
function shopCartSettlement(){
	$(".shopCart_Settlement_btn").on('click',function(){
		
		var idlist=new Array();
		
		$(".shopCart_tabMain_each").each(function(){
			if(!$(this).hasClass("hide")){
				var obj=$(this).attr("class").replace("shopCart_tabMain_each","").replace(/\s+/g, "");
				
				$("."+obj).find(".shopCart_checkBox_good").each(function(){
					var Gu=$(this);
					if(!Gu.hasClass("shopCart_checkBox_good_hide")){
						var shopcartid=Gu.attr("data");
						idlist.push(shopcartid);
					}
				});
			}
		});
		
		var scidlist=encodeURI(idlist);
		
		SumbitOrNot(scidlist);
	});
}


/**
 * 可否提交订单
 * @param scidlist
 */
function SumbitOrNot(idlist){
	if(idlist!=''){
		formSubmit(idlist);
	}else{
		alert("请选择商品");
	}
	
	console.log("ceshi");
	
	
}


/**
 * 提交订单
 * @param elementValue
 */
function formSubmit(elementValue) {
	var turnForm = document.createElement("form");   
	//一定要加入到body中！！   
	document.body.appendChild(turnForm);
	turnForm.method = 'post';
	turnForm.enctype="multipart/form-data";
	turnForm.action = '//www.macaoeasybuy.com/ShopCartConfirmController/queryShopCartConfirmInfo.easy';
	turnForm.target = '_self';
	//创建隐藏表单
	var newElement = document.createElement("input");
	newElement.setAttribute("name","idlist");
	newElement.setAttribute("type","hidden");
	newElement.setAttribute("value",elementValue);
	turnForm.appendChild(newElement);

	turnForm.submit();
}

/**
 * 库存数量控制
 */
function kucunController(){
	$(".goodChooseNumber").focus().blur();
}

$(function(){
	startJs();
})
function startJs(){
	window.history.forward(1);
	clacHeight();
	chooseAddress();
	AddAddress();
	AddressUpdate();
	ComfirmOrder();
	ShopCartConfirmOldSiteBox();
	QueryUserUsedAddress();
}

function clacHeight(){
	var textareas = $('.shopCart_order_leaveMess textarea');
	$.each(textareas, function() {
		var length = $(this).parents('.shopCart_order_leaveMess').siblings('.shopCart_order_goodMess').find('.shopCart_order_goodMess_each').length;
		$(this).height(length*120 - 70)
	});
}
/*選擇配送時間*/
function chooseTime(){
	$('.shopAddress_main_chooseTime_common').off('click').on('click',function(){
		if($(this).hasClass('shopAddress_main_chooseTime_common_slide')){
			$(this).find('.chooseTime_slideBox').slideUp(function(){
				$(this).parents('.shopAddress_main_chooseTime_common').removeClass('shopAddress_main_chooseTime_common_slide');
			})
		}else{
			$(this).siblings('.shopAddress_main_chooseTime_common').find('.chooseTime_slideBox').slideUp(function(){
				$(this).parents('.shopAddress_main_chooseTime_common').removeClass('shopAddress_main_chooseTime_common_slide');
			})
			$(this).find('.chooseTime_slideBox').slideDown('fast');
			$(this).addClass('shopAddress_main_chooseTime_common_slide');
		}
	})
	
	/*選擇時間*/
	$('.chooseTime_slideBox ul li').on('click',function(){
		$(this).parents('.shopAddress_main_chooseTime_common').find('span:nth-child(1)').text($(this).text());
		$(this).find('.chooseTime_slideBox').slideUp(function(){
			$(this).parents('.shopAddress_main_chooseTime_common').removeClass('shopAddress_main_chooseTime_common_slide');
		})
	});
	
	//點擊其他地方，彈框消失，不依賴遮罩層
	maskClick('.chooseTime_slideBox',function(){
		$('.chooseTime_slideBox').stop().slideUp();
	});
	function maskClick(el,func,str){
		str = str == undefined ? 'maskClick' : str;
        $(document).off('mouseup.'+str);
        $(document).on('mouseup.'+str,function(e){
            if(!$(el).is(e.target) && $(el).has(e.target).length === 0){
                if(func) func();
            }
        });
	}
}
/*選擇地址*/
function chooseAddress(){
	
	/*彈出地址選擇框*/
	$('.shopAddress_title_btn').off('click').on('click',function(){
		$('.transparent_bg').show();
		$('.addressPop').slideDown();
	})
	/*切換欄目*/
	$('.addressPop_tab ul li:nth-child(1)').off('click').on('click',function(){
		$(this).addClass('addressPop_tab_curr');
		$('.addressPop_tab ul li:nth-child(2)').removeClass('addressPop_tab_curr');
		$('.addressPop_main_old').show();
		$('.addressPop_main_new').hide();
	})
	$('.addressPop_tab ul li:nth-child(2)').off('click').on('click',function(){
		$(this).addClass('addressPop_tab_curr');
		$('.addressPop_tab ul li:nth-child(1)').removeClass('addressPop_tab_curr');
		$('.addressPop_main_old').hide();
		$('.addressPop_main_new').show();
	})
	
	
	/*選擇已有的地址*/
	$('.addressPop_main_oldEach').off('click').on('click',function(){
		$(this).addClass('addressPop_main_oldEach_curr').siblings().removeClass('addressPop_main_oldEach_curr');
	})
	$('.addressPop_main_old_sure').off('click').on('click',function(){
		$('.shopAddress_main_mess_phone').text($('.addressPop_main_oldEach_curr').find('.addressPop_main_oldEachphonenNum').text());
		$('.shopAddress_main_mess_name').text($('.addressPop_main_oldEach_curr').find('.addressPop_main_oldEach_name').text());
		$('.shopAddress_main_mess_local').text($('.addressPop_main_oldEach_curr').find('.addressPop_main_oldEach_local').text());
		$('.shopAddress_main_mess_address').text($('.addressPop_main_oldEach_curr').find('.addressPop_main_oldEach_localdetails').text());
		$('.transparent_bg').hide();
		$('.addressPop').slideUp('fast');
	})
	
	/*返回已有地址列表*/
	$('.addressPop_main_old_back').off('click').on('click',function(){
		$('.addressPop_main_old_choose').show();
		$('.addressPop_main_old_change').hide();
	})
	
	/*改變修改號碼欄目的狀態*/
	$('.addressPop_main_old_changeBtn').off('click').on('click',function(){
		var phoneNum = $('#old_change_num').val();
		
		$(this).addClass('change_sendCode').addClass('change_sendCode_curr').text('獲取驗證碼')
		$('#old_change_num').removeAttr("readonly").addClass('can_input');
		$('#old_change_code').removeAttr("readonly");
		$('.addressPop_main_old_changeEach:nth-child(2)').addClass('can_input_code');
		$('.change_sendCode_curr').on("click",getVerifyCode({
			callBack: function (){
				//按钮点击后的回调函数
				SendPhoneAuthCode(phoneNum,1);
			},
			unabledClass: "unlabed"//按钮不能用的样式，即点击按钮后的样式
		}));
	})
	/*監測手機號碼時候正確*/
	$('#old_change_num').off('click').on('keypress keyup',function(){
		var phoneNum = $('#old_change_num').val();
		var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
		/*var reg = /^6[6|8][0-9]\d{5}$/*/
		if(reg.test(phoneNum)){
			$('.addressPop_main_old_changeBtn').off('click').off('click').removeClass('change_sendCode').addClass('change_sendCode_curr')
			$('.change_sendCode_curr').on("click",getVerifyCode({
				callBack: function (){
					//按钮点击后的回调函数
				},
				unabledClass: "unlabed"//按钮不能用的样式，即点击按钮后的样式
			}));
		}else{
			$('.addressPop_main_old_changeBtn').off('click').off('click').addClass('change_sendCode').removeClass('change_sendCode_curr')
		}
	})
	
	$('.addressPop_main_old_changeEach ul li').off('click').on('click',function(){
		$(this).addClass('change_local_curr').siblings().removeClass('change_local_curr');
	});
	
	$('.addressPop_close').off('click').on('click',function(){
		$('.transparent_bg').hide();
		$('.addressPop').fadeOut('fast');
	});
	
	/*創建新的地址*/
	$('#new_change_num').off('keypress keyup').on('keypress keyup',function(){
		var phoneNum = $('#new_change_num').val();
		var reg = /^1[3|4|5|7|8][0-9]\d{8}$/;//大陸手機號碼驗證
		/*var reg = /^6[6|8][0-9]\d{5}$/*/
		if(reg.test(phoneNum)){
			$('.addressPop_main_new_changeBtn').off('click').addClass('change_sendCode_curr');
			$('.change_sendCode_curr').on("click",getVerifyCode({
				callBack: function (){
					 //按钮点击后的回调函数
					 SendPhoneAuthCode(phoneNum,0);
				},
				unabledClass: "unlabed"//按钮不能用的样式，即点击按钮后的样式
			}));
		}else{
			$('.addressPop_main_new_changeBtn').off('click').removeClass('change_sendCode_curr');
		}
	});
	
}



/*添加地址*/
function AddAddress(){
	$(".addressPop_main_old_change_btn").off('click').on('click',function(){
		var Phone = $("#new_change_num").val();
		// var receiptName=$("#receiptName").val();
		// var receiptAddress=$("#receiptAddress").val();
		// var receiptArea=$(".addressPop_main_new").find(".change_local_curr").html();
		var PhoneAuthCode = $("#PhoneAuthCode").val();

		var receiptName = encodeURIComponent($("#receiptName").val());
		var receiptAddress = encodeURIComponent($("#receiptAddress").val());
		var receiptArea = encodeURIComponent($(".addressPop_main_new").find(".change_local_curr").html());
		var data={"phone":Phone,"receiptName":receiptName,"receiptAddress":receiptAddress,"receiptArea":receiptArea}
		SaveUserAddress(data,PhoneAuthCode);
	});
}

/*地址更新*/
function AddressUpdate(){
	$('.addressPop_main_old_cancel').off('click').on('click',function(){
		var id=$(".addressPop_main_oldEach_curr").find(".receiptId").attr("data");
		var addressid=(id=='undefined')?0:id;
		QueryUserAddressById(addressid);
		$('.addressPop_main_old_choose').hide();
		$('.addressPop_main_old_change').show();
	})
	
	$(".addressPop_main_old_sureSave").off('click').on('click',function(){
		var id=$(".addressPop_main_old_change").data("id");
		var Phone=$("#old_change_num").val();
		var receiptName=$("#old_Change_Name").val();
		var receiptAddress=$("#old_Change_Address").val();
		var receiptArea=$(".addressPop_main_old").find(".change_local_curr").html();
		var PhoneAuthCode=$("#old_change_code").val();
		
		var data={"id":id,"phone":Phone,"receiptName":receiptName,"receiptAddress":receiptAddress,"receiptArea":receiptArea}
		
		UpdateUserAddress(data,PhoneAuthCode);
		
	})
}


/*下訂單*/
function ComfirmOrder(){
	$(".shopCart_order_settlementRight").on('click',function(){
		var idlist=new Array();
		
		$(".spcartId").each(function(){
			var shopcartid=$(this).val();
			idlist.push(shopcartid);
		});
		
		var token=$(".token").val();
		var sPhone=$(".shopAddress_main_mess_phone").html();
		var sProple=$(".shopAddress_main_mess_name").html();
		var sAddressArea=$(".shopAddress_main_mess_local").html();
		var sAddress=$(".shopAddress_main_mess_address").html();
		var sReceiveDay=$(".shopAddress_main_mess_weekday").html();
		var sReceiveTime=$(".shopAddress_main_mess_Time").html();
		
		
		var Ordermessage={};
		$(".shopCart_order_leaveMess textarea").each(function(){
			var shopid=$(this).closest(".shopCart_order_goodBox").find(".iShopId").val();
			var value=$(this).val();
			Ordermessage[shopid]=value;
		});
		
		var data={
				"token":token,
				"Ordermessage":JSON.stringify(Ordermessage),
				"idlist":idlist.join(","),
				"sPhone":sPhone.trim(),
				"sProple":sProple.trim(),
				"sAddressArea":sAddressArea.trim(),
				"sAddress":sAddress.trim(),
				"sReceiveDay":sReceiveDay.trim(),
				"sReceiveTime":sReceiveTime.trim()
		}
		
		formSubmit(data);
	});
}

function formSubmit(data) {
	var turnForm = document.createElement("form");   
	//一定要加入到body中！！   
	document.body.appendChild(turnForm);
	turnForm.method = 'post';
	turnForm.enctype="multipart/form-data";
	turnForm.action = '//shopping1.macaoeasybuy.com/ShopCartConfirmController/saveShopCartOrders.easy';
	turnForm.target = '_self';
	//创建隐藏表单
	for(var key in data){
		var newElement = document.createElement("input");
		newElement.setAttribute("name",key);
		newElement.setAttribute("type","hidden");
		newElement.setAttribute("value",data[key]);
		turnForm.appendChild(newElement);
	}

	turnForm.submit();
}

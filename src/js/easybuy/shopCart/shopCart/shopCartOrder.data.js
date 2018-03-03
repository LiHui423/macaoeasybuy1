/**
 * 獲取用戶最近使用的一個地址
 */
function QueryUserUsedAddress(){
	$.get("http://shopping.macaoeasybuy.com/ShopCartConfirmController/queryUserUsedAddress.easy",function(json){
		var jsonData={
				list:json
		}

		if(json.length>0){
			$(".shopAddress_noAddress").css("display","none");
		}else{
			$(".shopAddress_noAddress").css("display","block");
		}
		var html = template("UserUsedAddress", jsonData);
		$(".shopAddress_main_mess").html(html);
		
		chooseTime();
		
	});
}

/**
 * 獲取用戶地址
 */
function ShopCartConfirmOldSiteBox(){
	$.get("http://shopping.macaoeasybuy.com/ShopCartConfirmController/queryUserAddress.easy",function(json){
		var jsonData={
				list:json
		}
		
		var html = template("ShopCartConfirmoldEachBox", jsonData);
		$(".addressPop_main_oldEachBox").html(html);
		chooseAddress();
		GetTakeDate();
		GetTakeTime();
	});
}

/**
 * 發送驗證碼短信z`
 * @param Phone
 * @param state
 */
function SendPhoneAuthCode(Phone,state){
	var dataUrl = "http://118.190.114.118:8081/messagesConterllor/sendMesgs.easy?phone="+Phone+"&type=goodsReceipt";
	dataUrl = fr.addHref(dataUrl);
	$.getJSON(dataUrl,function(json){
		console.log(json);
	});
	
}

/**
 * 保存用戶地址
 * @param data
 * @param authCode
 */
function SaveUserAddress(data,authCode){
	var dataUrl="http://118.190.114.118:8081/messagesConterllor/verifyMess.easy?phone="+data.phone+"&str="+authCode;
	dataUrl = fr.addHref(dataUrl);
	$.getJSON(dataUrl,function(json){
		if(json.info=="2"){
			$.ajax({
		         type: 'post',
		         url:'http://shopping.macaoeasybuy.com/ShopCartConfirmController/SaveUserAddress.easy',
		         cache:false,
		         data:JSON.stringify(data),
		         contentType: 'application/json',
		         dataType: 'json',
		         success:function(result){
		    	 	 if(result!=-1){
		    	 		ShopCartConfirmOldSiteBox();
	        		    $('.transparent_bg').hide();
	        		    $('.addressPop').slideUp('fast');
	        		    QueryUserUsedAddress(); 
		        	 }else{
		        		 alert("请填写完整信息");
		        	 }
		        	 
		         },
		         
		     });
		}else{
			$(".NewauthSuccessOrBNot").css("display","inline-block");
		}
	});
	
	
}


/**
 * 更新用戶地址
 * @param data
 * @param authCode
 */
function UpdateUserAddress(data,authCode){
	var dataUrl="http://118.190.114.118:8081/messagesConterllor/verifyMess.easy?phone="+data.phone+"&str="+authCode;
	dataUrl = fr.addHref(dataUrl);
	$.getJSON(dataUrl,function(json){
		if(json.info=="2"){
			$.ajax({
		         type: 'post',
		         url:'http://shopping.macaoeasybuy.com/ShopCartConfirmController/UpdateUserAddress.easy',
		         cache:false,
		         data:JSON.stringify(data),
		         contentType: 'application/json',
		         dataType: 'json',
		         success:function(result){
		            if(result!=-1){
		            	 ShopCartConfirmOldSiteBox();
		        		 $('.transparent_bg').hide();
		        		 $('.addressPop').slideUp('fast');
		        		 QueryUserUsedAddress();
		        		 $(".addressPop_main_old_choose").css("display","block");
		        		 $(".addressPop_main_old_change").css("display","none");
		        		 $('.shopAddress_main_mess_phone').text($('.addressPop_main_oldEach_curr').find('.addressPop_main_oldEachphonenNum').text());
		        		 $('.shopAddress_main_mess_name').text($('.addressPop_main_oldEach_curr').find('.addressPop_main_oldEach_name').text());
		        		 $('.shopAddress_main_mess_local').text($('.addressPop_main_oldEach_curr').find('.addressPop_main_oldEach_local').text());
		        		 $('.shopAddress_main_mess_address').text($('.addressPop_main_oldEach_curr').find('.addressPop_main_oldEach_localdetails').text()); 
		        	 }else{
		        		 alert("请填写完整信息");
		        	 }
		         },
		         
		     });
		}else{
			$(".addressPop_main_old").find(".verifyAlert").css("display","inline-block");
		}
	});
	
}

/**
 * 獲取用戶地址
 * @param id
 */
function QueryUserAddressById(id){
	$.get("http://shopping.macaoeasybuy.com/ShopCartConfirmController/queryUserByIdAddress/"+id+".easy",function(json){
		if(json.length==1){
			$(".addressPop_main_old_change").data("id",json[0].id);
			$("#old_change_num").val(json[0].phone);
			$("#old_Change_Name").val(json[0].receiptName);
			var receiptArea=json[0].receiptArea;
			$(".Old_AreaAll").find("li").each(function(){
				var AreaName=$(this).html();
				if(AreaName==receiptArea){
					$(this).siblings().removeClass("change_local_curr");
					$(this).addClass("change_local_curr");
				}
			});
			
			$("#old_Change_Address").val(json[0].receiptAddress);
		}
		
	});
}



/**
 * 获取收货时间日期
 */
function GetTakeDate(){
	$.getJSON("http://shopping.macaoeasybuy.com/ShopCartConfirmController/QueryTakeDate.easy?easybuyCallback=?",function(json){
		var appendhtml="<ul>";
		for(var i=0;i<json.list.length;i++){
			appendhtml+="<li id='"+json.list[i].id+"'><a>"+json.list[i].date+"</a></li>";
		}
		appendhtml+="</ul>";
		$(".chooseTime_weekday_slideBox").html(appendhtml);
		
		chooseTime();
	});
}

/**
 * 获取收货时间段
 */
function GetTakeTime(){
	$.getJSON("http://shopping.macaoeasybuy.com/ShopCartConfirmController/QueryTakeTime.easy?easybuyCallback=?",function(json){
		var appendhtml="<ul>";
		for(var i=0;i<json.list.length;i++){
			appendhtml+="<li id='"+json.list[i].id+"'><a>"+json.list[i].time+"</a></li>";
		}
		appendhtml+="</ul>";
		$(".chooseTime_daytime_slideBox").html(appendhtml);
		
		chooseTime();
	});
}

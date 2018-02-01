$(function(){
	newReminder()
	loadMessList()
})

var userId=1445,
	type=0,
	receiveType=0,
	ifLook=3;

/*添加小紅點*/
function newReminder(){
	$.getJSON("http://192.168.3.123:8092/yez_easyBuyMall_userSpace//userNoticleController/queryUserNotLookInfo.easy?userId="+userId+"&easybuyCallback=?",function(data){
		if(data.noticNum.numNotEasy != '0'){
			$('.noslideLi_easy').find('.newMessIcon').show();
		}else if(data.noticNum.numNotShop != '0'){
			$('.noslideLi_shop').find('.newMessIcon').show();
		}else if(data.noticNum.numNotLove != '0'){
			$('.noslideLi_love').find('.newMessIcon').show();
		}else if(data.noticNum.numNotReply != '0'){
			$('.noslideLi_reply').find('.newMessIcon').show();
		}else if(data.noticNum.numNotContact != '0'){
			$('.noslideLi_contact').find('.newMessIcon').show();
		}else if(data.noticNum.numNotGood != '0'){
			$('.noslideLi_good').find('.newMessIcon').show();
		}
	})
}


function loadMessList(){
	var templateList = easyBuy.global.template;
	var easybuymessTemplate = templateList['easybuymess'];
	var listSendshoperTemplate = templateList['listSendshoper'];
	var movemessTemplate = templateList['movemess'];
	var listMetionTemplate = templateList['listMetion'];
	var listGreatTemplate = templateList['listGreat'];
	var listrespondTemplate = templateList['templateList'];
	$.getJSON("http://192.168.3.123:8092/yez_easyBuyMall_userSpace/userNoticleController/queryUserSyatemInfo.easy?userId="+userId+"&page=0&size=20&order=time&ascOrdesc=desc&type="+type+"&receiveType="+receiveType+"&ifLook="+ifLook+"&easybuyCallback=?",function(data){
		if(type == 0){
			if(receiveType == 0){
				/*宜買系統消息*/
				var easybuymessHtml = template.render(easybuymessTemplate, data);
				$('.usermess_main_list').html(easybuymessHtml);
			}else if(receiveType == 3){
				/*加載店主推送*/
				var listSendshoperHtml = template.render(listSendshoperTemplate, data);
				$('.usermess_main_list').html(listSendshoperHtml);
			}else if(receiveType == 4){
				/*心動*/
				var movemessHtml = template.render(movemessTemplate, data);
				$('.usermess_main_list').html(movemessHtml);
			}
		}else{
			if(receiveType == 1){
				/*加載別人@我*/
				var listMetionHtml = template.render(listMetionTemplate, data);
				$('.usermess_main_list').html(listMetionHtml);
			}else if(receiveType == 3){
				/*加載別人讚我*/
				var listGreatHtml = template.render(listGreatTemplate, data);
				$('.usermess_main_list').html(listGreatHtml);
			}else if(receiveType == 4){
				/*加載別人回復我*/
				var listrespondHtml = template.render(listrespondTemplate, data);
				$('.usermess_main_list').html(listrespondHtml);
			}else if(receiveType == 5){
				
			}
		}
		if(data.list.length==0){
			$('.usermess_main_list').hide();
			$('.nomess').show();
		}else{
			$('.usermess_main_list').show();
			$('.nomess').hide();
		}
		userMessMove();
	})
}


/*查閱通知*/
function hadsee(ids){
	$.getJSON("http://192.168.3.123:8092/yez_easyBuyMall_userSpace/userNoticleController/updateUserSystemInfo.easy?systemSeeId="+ids+"&easybuyCallback=?",function(data){
		
	});
}
/*刪除通知*/
function deletemess(ids){
	$.getJSON("http://192.168.3.123:8092/yez_easyBuyMall_userSpace/userNoticleController/deleteSystemInfo.easy?systemSeeId="+ids+"&easybuyCallback=?",function(data){
		
	});
}

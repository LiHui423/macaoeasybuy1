$(function(){
	ProdigalFunc();
	talentFunc();
	topicFunc();
	postFunc()
});

/*加載敗家點讚*/
function ProdigalFunc(){
	$.getJSON("http://social1.macaoeasybuy.com/sentVolunteersSocialConntroller/querySentVoulunteersLove.easy?easybuyCallback=?",function(data){
		//console.log(data);
		var ProdigalHtml=template("Prodigal",data);
		$(".liveshotBox_thumb_main ul").html(ProdigalHtml);
		clickTabFunction($(".liveshotBox_thumb_main"),4,$(".liveshotBox_thumb_leftBtn"),$(".liveshotBox_thumb_rightBtn"),344,4,21)
	});
};

/*加載敗家達人*/
function talentFunc(){
	$.getJSON("http://social1.macaoeasybuy.com/sentVolunteersSocialConntroller/querySentVolunteersUser.easy?easybuyCallback=?",function(data){
		//console.log(data);
		var talentHtml=template("talent",data);
		$(".liveshotBox_talent_main").html(talentHtml);
		showHover()
	});
};

/*加載敗家話題*/
function topicFunc(){
	let page = 0;
	let size = 10;
	$.getJSON("http://social1.macaoeasybuy.com/sentVolunteersSocialConntroller/querySentVoulunteersTopic.easy?page="+page+"&size="+size+"&easybuyCallback=?",function(data){
		console.log(data);
		var topicHtml=template("topic",data);
		$(".liveshotBox_topic_mainUl").html(topicHtml);
		clickTabFunction($(".liveshotBox_topic_main"),3,$(".liveshotBox_topic_leftBtn"),$(".liveshotBox_topic_rightBtn"),440,3,90)
	});
};

/*加載敗家帖子*/
function postFunc(){
	$.getJSON("http://social1.macaoeasybuy.com/sentVolunteersSocialConntroller/querySentVolunteers.easy?page=0&size=10",function(data){
		var postnum = template("postNum",data);
		$(".liveshotBox_posttitle").html(postnum);
		var postHtml=template("post",data);
		$(".liveshotBox_postList_main").html(postHtml);
		imagesLoaded($('.liveshotBox_postList_main .page-main-head-img'),function(){
			var a = easyBuy.global.dep.waterfall($(".liveshotBox_postList_main"),$(".liveshotBox_postList_main .pillar-all"),6,5,16);
			var sum = easyBuy.global.dep.arrayGetMax(a);
			$('.liveshotBox_postList_main').css('height',sum+'px');
		});

		postScroll()
	});
}

function postFuncAppend(page){
	$.getJSON("http://social1.macaoeasybuy.com/sentVolunteersSocialConntroller/querySentVolunteers.easy?page="+page+"&size=10",function(data){
		$('.loadNow').hide();
		if(data.result.returnList.length < 10){
			var over = true;
			$('.noMore').show()
		}else{

		}
		var postHtml=template("post",data);
		$(".liveshotBox_postList_main").append(postHtml);
		imagesLoaded($('.liveshotBox_postList_main .page-main-head-img'),function(){
			var a = easyBuy.global.dep.waterfall($(".liveshotBox_postList_main"),$(".liveshotBox_postList_main .pillar-all"),6,5,16);
			var sum = easyBuy.global.dep.arrayGetMax(a);
			$('.liveshotBox_postList_main').css('height',sum+'px');
		});
	});
}

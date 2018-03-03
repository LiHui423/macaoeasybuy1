$(function(){
	beforeDataJs();
})
function beforeDataJs(){
	SubclassesSlide();
	setNavOnLoad(); //設置導航
	getFirstNav(); //一級
	getSecondNav(); // 二級
	getContentFunc(); //獲取子分類內容
	getBottomFunc();//獲取內容(底部)
}
//設置導航並且請求導航
function setNavOnLoad(){
	$('.Subclasses_title_btn span').eq(0).html(className);
}
/*選擇分類的下拉*/
function SubclassesSlide(){
	$(".Subclasses_title_btn").click(function(){
		if($(this).parent().find(".Subclasses_title_slideBox").hasClass("hideSlide")){
			$(this).parent().find(".Subclasses_title_slideBox").stop(true,true).slideDown('fast').removeClass("hideSlide");
		}else{
			$(this).parent().find(".Subclasses_title_slideBox").stop(true,true).slideUp("fast").addClass("hideSlide");
		}
	});
	$(".Subclasses_title_slideBox ul li").click(function(){
		$(this).addClass("select").siblings("li").removeClass("select");
		$(".Subclasses_title span:nth-child(1)").text($(this).find("a").text());
		$(".Subclasses_title_slideBox").slideUp('fast').addClass("hideSlide");
	});
	maskClick('.Subclasses_title_slideBox',function(){
		$(".Subclasses_title_slideBox").slideUp('fast').addClass("hideSlide");
	},'slideNav');
}

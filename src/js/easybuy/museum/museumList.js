$(function(){
	museumHeadSlide();
})

function museumHeadSlide(){
	$(".museum_navSlide_btn").click(function(){
		if($(".museumHome_head").hasClass("museumHome_head_slideUp")){
			$(".museumHome_head").removeClass("museumHome_head_slideUp").animate({height:"280px"});
			$(".museum_navSlide_btn").find("img").attr("src","/img/easybuy/museum/icon/museum_top_up.png");
		}else{
			$(".museumHome_head").addClass("museumHome_head_slideUp").animate({height:"225px"});
			$(".museum_navSlide_btn").find("img").attr("src","/img/easybuy/museum/icon/museum_top_down.png")
		}
	})
}

// function museumListOnload(){
// 	$('.item').on('click',function(){
// 		var id = $(this).data('id');
// 		window.open('/page/easybuy/goodDetails/museumDetails.html?id=' + id +'');
// 	})
// }

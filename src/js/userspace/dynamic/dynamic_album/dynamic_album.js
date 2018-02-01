$(function(){
	jumpLoad()
	sortSelect()
})

function jumpLoad(){
	$('.dynamic_mainList ul li').on('click',function(){
		window.open('dynamic_album_specify.html');
	})
}
function sortSelect(){
	$('.dynamic_sortBox ul li').on('click',function(){
		$(this).addClass('userlove_chooseSort_left_curr').siblings().removeClass('userlove_chooseSort_left_curr')
	})
}

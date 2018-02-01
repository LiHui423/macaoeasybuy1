$(function(){
	sortSelect()
})

function sortSelect(){
	$('.dynamic_sortBox ul li').on('click',function(){
		$(this).addClass('userlove_chooseSort_left_curr').siblings().removeClass('userlove_chooseSort_left_curr')
	})
}

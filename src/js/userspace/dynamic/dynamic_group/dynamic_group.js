easyBuy.global.startJs = function(){
	sortSelect();
	getListdata();
}
var waterfall = easyBuy.global.dep.waterfall;
function sortSelect(){
	$('.dynamic_sortBox ul li').on('click',function(){
		$(this).addClass('userlove_chooseSort_left_curr').siblings().removeClass('userlove_chooseSort_left_curr')
	})
}
function getListdata(){
	var data = {
		num : [0,1,2]
	}
	var dataListTemplate = easyBuy.global.template['data-list'];
	var html = template.render(dataListTemplate,data);
	$('.dynamic_mainList').html(html);
	waterfall($(".dynamic_mainList"),$(".dynamic_mainList .pillar-all"),4,0,0,true);
}

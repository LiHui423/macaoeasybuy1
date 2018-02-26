$(function(){
	marketGoodsHover();
	marketThemeHover();
	hitScroll();
})

function marketGoodsHover(){
	$(".marketBlock_main_each").hover(function(){
		$(this).find(".marketBlock_main_eachCover").stop(true).animate({
			opacity:"1",
			bottom:"0"
		},100)
	},function(){
		$(this).find(".marketBlock_main_eachCover").animate({
			opacity:"0",
			bottom:"-30px"
		},200)
	})
}

function marketThemeHover(){
	$(".marketBlock_main_theme").hover(function(){
		$(this).find(".marketBlock_main_themeCover").stop(true).animate({
			opacity:"1",
		},100);
	},function(){
		$(this).find(".marketBlock_main_themeCover").animate({
			opacity:"0"
		},100);
	})
}

// 點擊帖子跳轉到市集帖子詳情頁
function goFpDetail(a,b){
	var dataId=$(a).attr('data-id');
	window.open("http://social.macaoeasybuy.com/market/treasureclassifydetail/fairpostdetail/fairpostdetail.html?id="+dataId);
	
}
function hitScroll(){
	
}
//檢測是否到達視區
function lazyLoad(){
	//存儲偏移量
	let slidemap = {};
	//每一個分類框
	let aLi = document.getElementsByClassName('marketBlock_main_each');
	console.log(aLi);
	let t = document.documentElement.clientHeight + (document.documentElement.scrollTop || document.body.scrollTop)-300;
	console.log(t);
	for(let i = 0; i<aLi.length; i++){
		let oLi = aLi[i];
		let h = getH(oLi);
		if (h < t) {
			setImg(i);
		}
	}
}
function setImg(index){
	let aLiImg = $('.market_main .marketBlock_main_each.noPic').children('img');
	let src = $(aLiImg[index]).attr('src');
	$(aLiImg[index]).attr('src',src);
	$(aLiImg[index]).css('opacity','1');
	$(aLiImg[index]).parents('.marketBlock_main_each').removeClass('noPic');
}
function getH(obj){
	let id=$(obj).data('id');
	let h=0;
	if(slidemap[id]){
		h = slidemap[id].height;
	}else{
		while(obj){
			h += obj.offsetTop;
			obj = obj.offsetParent;
		}
		slidemap[id] = {
			height:h
		}
	}
	return h;
}

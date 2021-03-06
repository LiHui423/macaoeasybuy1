
/*商品參數*/
function goodParameter(){
	var number = getNumber();
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsdetailController/querySpProductFigure/"+ number +".easy?easybuyCallback=?",function(json){
		var goodParameterData = json;
		var htmlParameter = template("goodParameter", goodParameterData);
		$(".introductionBox_intro ul").html(htmlParameter);
	});
}

/*評論區頂部數據*/
function getCommentTop(){
	var id = getId()
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsdetailController/querySpCommentTopicInfo/"+ id +".easy?easybuyCallback=?",function(json){
		var commentTopData = json;
		var htmlCommentTop = template("commentDataShow", commentTopData);
		$(".introductionBox_evaluation_dataBox").html(htmlCommentTop);
		chooseEvaType()
		choosePage()
	});
}


/*評論區底部評論*/
function getCommentBottom(page,BestOrNotState){
	var id = getId()
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsdetailController/querySpComment/"+ page +"/10/"+ id +"/"+ BestOrNotState +".easy?easybuyCallback=?",function(json){
		var commentMainData = json;
		console.log(commentMainData);
		var htmlCommentMain = template("commentMainShow", commentMainData);
		$(".evaluation_DetailsBox").html(htmlCommentMain);
		showStarLevel()
		if($(".evaluation_DetailsBox").find('.evaluation_DetailsEach').length == 0){
			$(".evaluation_noEvaluation").show();
			$(".tcdPageCode").hide()
		}else{
			$(".evaluation_noEvaluation").hide();
			$(".tcdPageCode").show()
		}
	});
}

/*心動商品請求*/
function sentLoveStatus(){
	var id = getId()
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsLoveController/loveOrNot/"+ id +"/0.easy?easybuyCallback=?",function(json){
		
	});
}

/*加入購物籃的請求*/
function sentAddCartStatus(){
	var id = getId();//商品id
	var iCount = $('#goodChooseNumber').val();//數量
	var $sizeEach = $('.selected')//規格
	var Standard = '';
	if($sizeEach.length == "3"){
		$.each($sizeEach,function(k){
			if(k<2){
				Standard = Standard + $(this).text() + "|";
			}else{
				Standard = Standard + $(this).text();
			}
		})
	}else if($sizeEach.length == "2"){
		$.each($sizeEach,function(){
			Standard = Standard + $(this).text() + "|";
		})
	}else if($sizeEach.length == "1"){
		Standard = $sizeEach.text() + "||"
	}
	console.log(Standard);
	Standard = encodeURIComponent(encodeURIComponent(Standard));
	var url = 'http://shopping1.macaoeasybuy.com/goodsdetailController/insertIntoShoppingCart/'+id+'/'+Standard+'/'+iCount+'.easy?easybuyCallback=?'
	$.getJSON(url,function(json){
		if(json.state >= 1){
			setTimeout(function(){
				$('.addShopCart_success').fadeIn('fast');
				var a = $('.right').find('[data-count]');
				console.log(a);
				if($(a).length === 2){
					var count = parseInt($($(a)[1]).attr('data-count'));
					count += parseInt(iCount);
					$($(a)[1]).attr('data-count',count);
				}else if($(a).length === 1){
					var count = parseInt($($(a)[0]).attr('data-count'));
					count += parseInt(iCount);
					$($(a)[0]).attr('data-count',count);
				}
			},500)
		}else{
			var p = $('.cancelPop .cancelThumbsPop_right').find('p');
			console.log($(p));
			$($(p)[0]).html('加入購物車失敗');
			$($(p)[1]).html('請再次嘗試');
			$('.noChooseSize').fadeIn('fast')
		}
	});
}

/*商品詳情敗家誌曬圖*/
function defenderHtml(){
	var id = getId()
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsdetailController/querySpSentVolunteer/0/10/"+ id +".easy?easybuyCallback=?",function(json){
		if(json.sentVolunteers.length == '0'){
			$('.all-main').hide()
			$('.introductionBox_showPic_showNothing').show();
		}else{
			var blueprintMainData = json;
			var html = template("blueprintMainShow", blueprintMainData);
			$(".all-main-container").html(html);
			imagesLoaded($('.all-look .all-main .all-main-container .page-main-head-img'),function(){
				var s = waterfall($('.all-main .all-main-container'),$('.all-main .all-main-container .pillar-all'),5,30,40);
				var sum = arrayGetMax(s);
				sum = Math.floor(sum);
				$('.all-main-container').css('height',sum+'px');
				myscroll(sum);
			});	
		}
	});
}

function defenderAppend(page){
	var id = getId()
	$.getJSON("http://shopping1.macaoeasybuy.com/goodsdetailController/querySpSentVolunteer/"+ page +"/10/"+ id +".easy?easybuyCallback=?",function(json){
		var blueprintMainData = json;
		var html = template("blueprintMainShow", blueprintMainData);
		$(".all-main-container").append(html);
		imagesLoaded($('.all-look .all-main .all-main-container .page-main-head-img'),function(){
			var s = waterfall($('.all-main .all-main-container'),$('.all-main .all-main-container .pillar-all'),5,30,40);
			var sum = arrayGetMax(s);
			sum = Math.floor(sum);
			$('.all-main-container').css('height',sum+'px');
			myscroll(sum);
		});
	});
}

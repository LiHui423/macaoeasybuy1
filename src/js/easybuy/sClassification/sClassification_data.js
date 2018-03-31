//一級導航
function getFirstNav(){
	var dataUrl='http://shopping1.macaoeasybuy.com/ClassifiGoodsController/QueryArea.easy?easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		console.log(data);
		var listHtml='';
		$.each(data.list, function(k,y) {
			var str=y.Name;
			y.Name=encodeURIComponent(encodeURIComponent(y.Name));
			listHtml += '<li><a href="http://shopping.macaoeasybuy.com/sClassification/sClassification.html?classId='+y.id+'&className='+y.Name+'&listId='+y.DefaultAreaClassid+'" data-id="'+y.DefaultAreaClassid+'">'+str+'</a></li>';
		});
		$('.Subclasses_title_slideBox ul').html(listHtml);
	})
}
//二級導航
function getSecondNav(){
	var dataUrl='http://shopping1.macaoeasybuy.com/ClassifiGoodsController/QueryAreaClass.easy?Areaid='+classId+'&easybuyCallback=?';
	$.getJSON(dataUrl,function(data){
		var listHtml='';
		$.each(data.list,function(k,y){
			if(y.id == listId){
				$('.Subclasses_titleName').html(y.Name);
				$('.Subclasses_titleIntro').html(y.content);
			}
			var classNames=encodeURIComponent(encodeURIComponent(className));
			listHtml += '<li><a href="http://shopping.macaoeasybuy.com/sClassification/sClassification.html?classId='+classId+'&className='+classNames+'&listId='+y.id+'" data-id="'+y.id+'">'+y.Name+'</a></li>';
		});
		$('.Subclasses_menuUl').html(listHtml);
		$('.Subclasses_menuUl li a[data-id='+listId+']').parent().addClass('select');
	});
}
//獲取內容
function getContentFunc(){
	var dataUrl='http://shopping1.macaoeasybuy.com/ClassifiGoodsController/QueryAreaClassGoods.easy?AreaClassid='+listId+'&easybuyCallback=?';
	var timer=4000; //4s跳一次評論
	$.getJSON(dataUrl,function(data){
		$.each(data.list,function(k,y){
			y.seeNumbers=easyBuy.global.dep.formatNum(y.seeNumbers);
			y.loveNumbers=easyBuy.global.dep.formatNum(y.loveNumbers);
			y.buyNumbers=easyBuy.global.dep.formatNum(y.buyNumbers);
			y.costPrice=easyBuy.global.dep.formatNum(y.costPrice);
			y.price=easyBuy.global.dep.formatNum(y.price);
		});
		//插入數據
		var box=$('#hot-comment-box');
		var leftHtml='';
		if(data.list[0]){
			leftHtml=template('hot-comment-template',data.list[0]);
		}
		if(data.list[1]){
			leftHtml += template('hot-comment-template',data.list[1]);
		}
		box.find('.Subclasses_showBox_left').html(leftHtml);
		if(data.list[2]){
			box.find('.Subclasses_showBox_right').html(template('hot-comment-template',data.list[2]));
		}
		//把評論數組前面兩個放到後面，並且開始輪播評論
		$.each(data.list,function(k,y){
			if(y.shangpinComments.length > 2){
				var beforeArr=y.shangpinComments.splice(0,2);
				var newArr=y.shangpinComments.concat(beforeArr);
				setIntervalFunc(y.id,newArr); //定時器函數
			}
		});
	});
	//定時器函數
	function setIntervalFunc(id,arr){
		var box=$('#hot-comments-shop'+id);
		box[0].timer=setTimeout(function(){
			clearTimeout(box[0].timer);
			var newArrData=arr.splice(0,2);
			var html=template('hot-commentList-template',{list:newArrData});
			box.find('.showBox_leftEach_commentBox').fadeOut('fast',function(){
				box.find('.showBox_leftEach_commentBox').html(html);
				$(this).fadeIn('fast');
			});
			var newArr=arr.concat(newArrData);
			setIntervalFunc(id,newArr);
		},timer);
	}
}
//獲取內容(底部)
function getBottomFunc(){
	var page=0;
	var size=20;
	var isComplete=false;
	reqFunc(page);
	function reqFunc(page){
		var dataUrl='http://shopping1.macaoeasybuy.com/ClassifiGoodsController/QueryAreaClassBottomGoods.easy?AreaClassid='+listId+'&page='+page+'&size='+size+'&easybuyCallback=?';
		$.ajax({
			url:dataUrl,
			type:"get",
			async:true,
			dataType:'jsonp',
			beforeSend:function(){
				scrollFunc('off');
				if(isComplete) return false;
			},
			success:function(data){
				console.log(data);
				var html=template('subclasses_listBox_template',data);
				$('#subclasses_listBox_box').append(html);
				page++;
				if(data.list.length == size){
					scrollFunc('on',page);
				}else{
					scrollFunc('off');
					isComplete=true;
					$('.noMore').css('display','block');
				}
			}
		});
	}
	function scrollFunc(state,page){
		if(state == 'on'){
			$(window).on('scroll.req',function(){
				var scrollTop=$(this).scrollTop();
				var scrollHeight=$(document).height();
				var windowHeight=$(this).height();
				if(scrollTop + windowHeight >= scrollHeight * 0.6){
					reqFunc(page);
				}
			});
		}else{
			$(window).off('scroll.req');
		}
	}
}

var postId = easyBuy.global.pageParameter.postid || 7372;
var albumId = easyBuy.global.pageParameter.albumid || 3; //专辑id
var picId = easyBuy.global.pageParameter.picId || 3;
var userId=easyBuy.global.pageParameter.userId || 29;
var seeUserIdd=easyBuy.global.pageParameter.seeUserId || 1445;

easyBuy.global.startJs = function(){
	easyBuy.userSpaceGlobal.replyPostType = '6';
	easyBuy.userSpaceGlobal.replyVolunteersType = 'replyTheAlbum'; //专辑回復貼子分類
	userStatus(); //帖子狀態

}
var imgOnMiddle = easyBuy.global.dep.imgOnMiddle;
var mathValueLength = easyBuy.global.dep.mathValueLength;
var getRequestURL = easyBuy.global.dep.getRequestURL;

//判斷是自己看還是他人看
function userStatus(){
	updateSeeLog(8);//所有帖子(点击量/查看量)
	if(easyBuy.global.isSelf){
		$('#other-mess-name').remove();
		$('.messBox_pic').remove();
		$('.messBox_logo').remove();
		$('.atricle_title-right').remove();
		$('#violation').remove();
		$('.nohas-album .title').eq(1).remove();
		$('.nohas-album .no-btn').remove();
		$('.other-post-title').html('<span>我</span>的其他專輯');
		$('#album-collect').remove();
		//刪除帖子
		myDeletePost({
			type : 'releaseTheAlbum',
			delUrl : 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/deleteBatchUserAlbum.easy'
		});
		operationAlbum(); //專輯操作
		albumMove();//专辑移动
	}else{
		$('#mine-mess-name').remove();
		$('#second-state').remove();
		$('#delete-post').remove();
		$('#album-move').remove();
		$('#set-cover').remove();
		$('.other-post-title').html('其他<span>Ada</span>的專輯');
		reportPost(); //舉報帖子
		// 还差一个采集功能
	}
	//編輯器
	$('#editor-box').load('/page/userspace/common/postDetailEditor.html',function(){
		editorFunc();
	});
	postImage();//图片描述
	otherImage();//专辑其他图片
	manyImage();//专辑其他图片多图片
	collectFuns();//宜粉採集到
	otherAlbum();//上下篇

	queryTopicCount(6,'[Group]');//评论查看赞好数统计
	isClickLove(8,8); //點讚

	responseCard(6);//回復查看讃好，數據

}
// easyframe('getRequestURL')(
//图片描述-第一個接口
function postImage(){
	var url = 'http://192.168.3.127:8089/yez_easyBuyMall_userSpace/UserThealbumConntroller/queryAlbumPicDetail.easy?picId=8'
	$.ajax({
		url: url,
		type: "get",
		async: true,
		dataType: 'jsonp',
		success: function(data){
			var needData=data.result;
			albumBanner(needData.pic);

			if(easyBuy.global.isSelf){
				albumCover(needData.isCover==0? false : true); //专辑封面
			}
			$('.articleMain>p').html(needData.picDesc);
			if(needData.isCollect==0){
				$('.articleBox .atricle_title').css('display','none');
			}else{
				$('.articleBox .atricle_title').css('display','block');
				$('.articleBox .atricle_title .atricle_title-left .atricle-from span:first-child').html(needData.collectUserName);
				var imgObj=document.createElement('img');
				$(imgObj).attr('src',needData.collectUserSex=='Girl'?'/img/common/girl.png':'/img/common/boy.png');
				$('.articleBox .atricle_title .atricle_title-left .atricle-from span:first-child').append(imgObj);
				$('.articleBox .atricle_title .atricle_title-left .atricle-from span:last-child').html('《'+needData.collectAlbumName+'》'
			);
				var year=needData.uptime.substring(0,10);
				var second=needData.uptime.substring(11);
				$('.articleBox .atricle_title .atricle_title-left .atricle-time span:first-child').html(year);
				$('.articleBox .atricle_title .atricle_title-left .atricle-time span:last-child').html(second);
				$('.messBox_mess_time p:last-child span').html(needData.uptime);
			}
		}
	});
	//专辑图组放大
	function albumBanner(url){
		var imgObj=document.createElement('img');
		// var divObj=document.createElement('div');
		$(imgObj).attr({
			src :easyBuy.global.osURL+url,
			middle : true
		});
		$('#foodBannerul li').append(imgObj);
		easyBuy.global.dep.mygoodbanner({
			box: $('.showPicBox'),
			banner: $('#foodBannerul'),
			now: $('.showPicBox').find('.now'),
			goLeft: $('#goLeft'),
			goRight: $('#goRight'),
		},{
			grassBox:$('#big-grass-page'),
			grassUl:$('#big-grass-page .big-grass-ul'),
			grassclose:$('#big-grass-page .close-grass'),
			grassL:$('#big-grass-page .prev'),
			grassR:$('#big-grass-page .next'),
			grassNow:$('#big-grass-page .BannerCountBox .now')
		},function(){
			$('#foodBannerul li').each(function(){
				easyBuy.global.dep.imgOnMiddle($(this));
			});
		});
	}
}

//专辑其他图片-第二個接口
function otherImage(){
	var url = easyframe('getRequestURL')('http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryTheAlbumInfo.easy', {id: albumId});
	$.ajax({
		url: url,
		type: 'get',
		async: true,
		dataType: 'jsonp',
		success: function(data){
			var needData=data.albumInfo;
			var imgObj=document.createElement('img');
			$(imgObj).attr('src',easyBuy.global.osURL+needData.thecoverpictureurl);
			$(imgObj).css({'width':'170px','height':'166px'});
			$('.album-cover').append(imgObj);
			$('.album-detail-info .album-detail-info-title span').html('《'+needData.thealbumName+'》');
			$('.album-detail-info .album-detail-info-come div:first-child span').html(needData.groupIMgSum);
			$('.album-detail-info .album-detail-info-come div:last-child span').html(needData.className);
			$('.album-info .album-detail-info ul li:nth-child(2) div:first-child').html(needData.topicSum);
			$('.album-info .album-detail-info ul li:first-child div:first-child').html(needData.sSeeNum+needData.seeNum);
			$('.album-info .album-detail-info ul li:nth-child(3) div:first-child').html(needData.loveNum+needData.sLoveNum);
			$('.album-info .album-detail-info ul li:last-child div:first-child').html(needData.collectionNum);
			$('.messBox_mess_time p:first-child span').html(needData.className);
			var pic=document.createElement('img');
			$(pic).attr('src',easyBuy.global.osURL+needData.userPic);
			$('.messBox_pic').append(pic);
		}
	});
}

//专辑其他图片多图片-第三個接口
function manyImage(){
	var page=0;
	var size=4;
	var isComplate=false;
	var box=$("#scrollDiv .album-photo-inner");
	reqFunc();
	function reqFunc(){
		var url = easyframe('getRequestURL')('http://userspace1.macaoeasybuy.com/UserThealbumConntroller/getAlbumPics.easy', {id: albumId,size:size,page:page,order:'id',descOrAsc:'desc'});
		$.ajax({
			url:url,
			type:'get',
			async: true,
			dataType: 'jsonp',
			beforeSend:function(){
				easyScrollRequest('off','otherImage',$('#scrollDiv'));//外面的容器
				if(isComplate) return false;
			},
			success:function(data){
				console.log(data);
				data.type='other';
				data.page=page;
				var html=template('imgDetails',data);
				box.append(html);
				waterfall($('.album-photo-inner'),$('.album-photo-inner .photo-items'),4,4,0,true);
				page++;
				if(data.albumPics.length==size){
					easyScrollRequest('off','otherImage',$('#scrollDiv'),box,function(){
						reqFunc();
					})
				}else{
					easyScrollRequest('off','otherImage',$('#scrollDiv'));
					isComplate=true;
				}
			},
			error: function(){
				console.log('發生未知错误');
			}
		})
	}
}
//宜粉採集到-第四個接口
function collectFuns(){
	var url=easyframe('getRequestURL')('http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryUseralbumCollectInfo.easy', {picId: picId, page: 0, size: 10});
	$.ajax({
		url:url,
		type:'get',
		async: true,
		dataType: 'jsonp',
		success:function(data){
			var templateHtml=template.render(easyBuy.global.template['collect-photo'],data);
			$('.suggestCollect .CollectedBox .CollectedBox-inner').html(templateHtml);
		},
		error:function(){
			console.log('發生未知錯誤');
		}
	});
}
//上下篇
function otherAlbum(){
	var url= easyframe('getRequestURL')('http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryUserElseTheAlbum.easy', {id:albumId, page:0, size:10, order:'uptime', descOrasc:'desc',userId:userId, seeUserId:seeUserIdd});
	$.ajax({
		url:url,
		type:'get',
		async:true,
		dataType:'jsonp',
		success:function(data){
			var templateHtml=template.render(easyBuy.global.template['albumOther'],data.albumList);
			$('#upDown').html(templateHtml);
			var moved=0;
			var LIWIDTH=220;
			// 為前後箭頭按鈕綁定單機事件
			$(".arrow-select-right a").on("click",function(e){
				e.preventDefault();
				if(this.className.indexOf("disabled")==-1){
					moved++; move();
				}
			});
			$(".arrow-select-left a").on("click",function(e){
				e.preventDefault();
				if(this.className.indexOf("disabled") == -1){
					moved--; move();
				}
			});
			//移動函數
			function move(){
				var albumList=$("#upDown");
				$(albumList).css("left",-moved*LIWIDTH+20+"px");
				checkList();
			}
			//檢查是否已經是最後一張專輯函數
			function checkList(){
				var item = data.albumList.albumList;
				if(item.length-moved === 3){
					$(".arrow-select-right a").addClass("disabled");
				}else if(moved === 0){
					$(".arrow-select-left a").addClass("disabled");
				}else{
					$(".arrow-select-right a").removeClass("disabled");
					$(".arrow-select-left a").removeClass("disabled");
				}
			}
		}
	});
}
//帖子內容
function postContent(){
	$.ajax({
		url:'',
		type:"get",
		async:true,
		dataType:'jsonp',
		success:function(data){
			console.log(data);
			var newData = data.suitableLifeInfo;
			$('#messBox_mess_time span').html(newData.addtime); //發佈時間
			$('#atricle_title').html(newData.titlename); //標題
			myContent(newData.purchasedfrom);//內容
			labelClass([newData.placeLabel,newData.brandLabel,newData.hotLabel]);//表情分類
			commodity(newData);//相關商品
			if(newData.shopList != undefined){
				otherMessShop(newData.shopList);//相關商店
			}else{
				$('#otherMess_shop').parent().remove();
			}
			if(newData.isSelf == 0){ //看他人
				userInfo(newData.username,newData.headPic,newData.sex); //用戶性別，頭像，姓名
			}
			//調用吸頂評論框
			boxTop({
				box:$('#editor-box'),
				boxOuter:$('.userspace-content-inner'),
				referBox:$('.statistics'),
				fadeTime:150,
			});
		}
	});
}



//選項卡(待評論列表加載完之後調用)
function selectPage(){
	var btn = $('.statistics-title li');
	var page = $('.statistics-page .statistics-page-item');
	btn.each(function(k){
		if(k!=0) $(this)[0].flag = true;
		$(this).on('click',function(){
			if($(this).hasClass('select')){
				return false;
			}
			$(this).siblings('li').removeClass('select').end().addClass('select');
			page.eq(k).siblings('.statistics-page-item').removeClass('select').end().addClass('select');
			if(k==0){
				boxTop({
					box:$('#editor-box'),
					boxOuter:$('.userspace-content-inner'),
					referBox:$('.statistics'),
					fadeTime:150,
				});
			}else{
				restoreEditorBox($('#editor-box'));
			}
			if($(this)[0].flag){
				switch(k){
					case 1:
						//初次請求查看
						checkCard($(this),8);
					break;
					case 2:
						//初次請求讃好
						mygoodCard($(this),8);
					break;
				}
			}
		});
	});
}








//專輯操作
function operationAlbum() {
	var fadeTime = 150;
	$('#second-state .select-btn').on('click',function(){
		if($('#second-state ul').css('display') == 'none'){
			$('#second-state ul').stop().fadeIn(fadeTime);
			$('#second-state .state-bg').css('display','block');
		}else{
			$('#second-state ul').stop().fadeOut(fadeTime);
			$('#second-state .state-bg').css('display','none');
		}
	});
	$('#second-state .state-bg').on('click',function(){
		$('#second-state ul').stop().fadeOut(fadeTime);
		$('#second-state .state-bg').css('display','none');
	});
	$('#second-state ul li').each(function(){
		$(this).on('click',function(){
			$('#second-state ul').stop().fadeOut(fadeTime);
			$('#second-state .state-bg').css('display','none');
		});
	});
}

//专辑封面
function albumCover(isCover){
	var isCover = isCover;//判斷此頁面的圖片是否為專輯
	coverState();
	function coverState(){
		if(isCover){
			$('#foodBannerul li').eq(1).append('<div class="cover-btn"><div>cover</div></div>');
		}else{
			$('#album-move-btn').before('<li id="set-cover-btn">設為封面</li>');
			$('#set-cover-btn').one('click',function(){
				$('#set-cover').fadeIn(500,function(){
					$(this).delay(1000).fadeOut(500);
				});
				$('#second-state ul').stop().fadeOut(150,function(){
					$('#set-cover-btn').remove();
				});
				$('#second-state .state-bg').css('display','none');

				isCover = true;//傳送請求過去，成功了就刪除
				coverState();
			});
		}
	}
	//发送请求设置为封面
	function setCover(){

	}
}

//專輯移動
function albumMove(){
	albumImgMiddle();
	var hasAddAlbum = false;//是否重新創建
	albumSelectBind();
	openBox();
	closeBox();
	setWidth();
	mathValueLength($('#album-move .album-move-box .album-create input'),$('#album-move .album-move-box .album-create .input-count span'),10)
	//監聽有輸入時按鈕變顏色
	$('#album-move .album-move-box .album-create input').on('keyup',function(){
		if($(this).val().length >= 1){
			$('#album-move .album-move-box .album-create div').removeClass('no-select');
		}else{
			$('#album-move .album-move-box .album-create div').addClass('no-select');
		}
	});
	//創建專輯
	$('#album-move .album-move-box .album-create div').on('click',function(){
		var a = $('#album-move .album-move-box .album-create input').val().substring(0,10);
		if(a.length == 0)return false;
		var html = '<li class="select"><div class="collect-list-div"><img class="collect-list-div-img" src="/src/img/social/easylive/no-collect.png" alt=""><div class="img-number">0</div><div class="collect-select"><img src="/src/img/social/easylive/collect-select.png" alt=""></div></div><div class="collect-list-div">'+a+'</div></li>';
		$('#album-move .album-move-box .album-select ul li').each(function(){
			$(this).removeClass('select');
		});
		if(hasAddAlbum == false){
			$('#album-move .album-move-box .album-select ul').prepend(html);
		}else{
			$('#album-move .album-move-box .album-select ul li').eq(0).replaceWith(html);
		}
		albumSelectBind();
		hasAddAlbum = true;
		a = null;
	});
	//選擇專輯
	function albumSelectBind(){
		$('#album-move .album-move-box .album-select ul li').each(function(){
			$(this).off('click');
			$(this).on('click',function(){
				if($(this).hasClass('select')){
					$(this).removeClass('select');
				}else{
					$(this).siblings('li').removeClass('select').end().addClass('select');
				}
			});
		});
	}
	//關閉串口
	function closeBox(){
		$('#album-move .album-move-box .close-btn').on('click',function(){
			$('#album-move .album-move-box .album-create input').val('');
			$('#album-move').css('display','none');
			if(hasAddAlbum){
				$('#album-move .album-move-box .album-select ul li').eq(0).remove();
			}
			hasAddAlbum = false;
		})
	}
	//打開窗口
	function openBox(){
		$('#album-move-btn').on('click',function(){
			$('#album-move').css('display','block');
		});
	}
	//圖片居中
	function albumImgMiddle(){
		$('#album-move .album-move-box .move-list li').each(function(){
			imgOnMiddle($(this));
		});
	}
	//橫向滾動條
	function setWidth(){
		var len = $('#album-move .album-move-box .move-list li').length;
		if(len ==1){
			$('#album-move .album-move-box .move-list').css('margin','0 auto');
		}
		var width = $('#album-move .album-move-box .move-list li').outerWidth(true);
		var itemMargin = parseInt($('#album-move .album-move-box .move-list li').eq(0).css('margin-right'));
		$('#album-move .album-move-box .move-list').css('width',(len * width) - itemMargin);
		len = null;
		width = null;
		itemMargin = null;
	}
}

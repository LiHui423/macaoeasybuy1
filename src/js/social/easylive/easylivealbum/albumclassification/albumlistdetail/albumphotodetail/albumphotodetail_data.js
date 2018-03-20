// $(function() {
// 	allOther();
// 	response();
// 	check();
// 	mygood();
// 	albumPhoto();
// 	albumCollect();
// 	personLeft();//左側專輯放大
// 	var picId=location.href.split('=')[1];
// 	console.log(picId);
// 	personLeft(picId);
// });
// // person-left信息
// function personLeft(){
// 	var url="http://192.168.3.127:8089/yez_easyBuyMall_userSpace/UserThealbumConntroller/queryAlbumPicDetail.easy";
// 	$.ajax({
// 		url:url,
// 		data:{
// 			picId:picId
// 		},
// 		dataType: "json", //返回格式为json
// 		async: true,
// 		type:"GET",
// 		success:function(data){
// 			console.log(data);
// 		},
// 		error:function(){
// 			console.log("發生未知錯誤");
// 		}
// 	})
// }
// // 宜粉回應
// function response() {
// 	myresponseScroll('html');

// 	function myresponseScroll(a) {
// 		if(a == 'html') {
// 			Mock.mock(
// 				'http://mockjs', {
// 					'allNum': [{
// 							'Num|0-200': 0
// 						},
// 						{
// 							'Num|0-200': 0
// 						},
// 						{
// 							'Num|0-200': 0
// 						}
// 					],
// 					'response|0': [{
// 						'id|+1': 0,
// 						'name': '@name',
// 						'headImg': '@image',
// 						'sex|1': ['boy', 'girl'],
// 						'article': '@cparagraph(2)',
// 						'time|1-60': 1,
// 						'otherResponse|0-1': [{
// 							'id|+1': 0,
// 							'name': '@name',
// 							'headImg': '@image',
// 							'sex|1': ['boy', 'girl'],
// 							'article': '@cparagraph(1)',
// 							'time|1-60': 1,
// 						}]
// 					}]
// 				}
// 			);
// 			$.ajax({
// 				url: "http://mockjs", //请求的url地址
// 				dataType: "json", //返回格式为json
// 				async: true, //请求是否异步，默认为异步，这也是ajax重要特性
// 				data: {}, //参数值
// 				type: "GET", //请求方式
// 				success: function(data) {
// 					$('.statistics .statistics-title li .statistics-bubble div:first-of-type').each(function(k) {
// 						$(this).html(data.allNum[k].Num);
// 					});
// 					var html = template('response', data);
// 					$('.person-messaage .innerDiv').html(html);
// 					//					stopScroll($('.person-messaage'));
// 				}
// 			});
// 		} else if(a == 'add') {
// 			Mock.mock(
// 				'http://mockjs', {
// 					'response|5': [{
// 						'id|+1': 0,
// 						'name': '@name',
// 						'headImg': '@image',
// 						'sex|1': ['boy', 'girl'],
// 						'article': '@cparagraph(2)',
// 						'time|1-60': 1,
// 						'otherResponse|0-1': [{
// 							'id|+1': 0,
// 							'name': '@name',
// 							'headImg': '@image',
// 							'sex|1': ['boy', 'girl'],
// 							'article': '@cparagraph(1)',
// 							'time|1-60': 1,
// 						}]
// 					}]
// 				}
// 			);
// 			$.ajax({
// 				url: "http://mockjs", //请求的url地址
// 				dataType: "json", //返回格式为json
// 				async: true, //请求是否异步，默认为异步，这也是ajax重要特性
// 				data: {}, //参数值
// 				type: "GET", //请求方式
// 				success: function(data) {
// 					var html = template('response', data);
// 					$('.person-messaage .innerDiv').append(html);
// 				}
// 			});
// 		}
// 	}
// 	$('.person-messaage').scroll(function() {　　
// 		var scrollTop = $(this).scrollTop();　　
// 		var scrollHeight = $('.person-messaage .innerDiv').height();　　
// 		var windowHeight = $(this).height();
// 		if(scrollTop + windowHeight > scrollHeight) {
// 			myresponseScroll('add');
// 		}
// 	});
// }
// // 宜粉查看
// function check() {
// 	var touristsLi = '<li class="tourists"><div class="respondBox_fandPic"><div>58</div><div>遊客</div></div><div class="respondBox_fansMess clearfloat"><div></div><div></div></div></li>';
// 	var o = $('.statistics .statistics-title li').eq(1);
// 	var f = true;
// 	o.on('click', function() {
// 		if(f) {
// 			Mock.mock(
// 				'http://mockjs', {
// 					'check|30': [{
// 						'id|+1': 0,
// 						'name': '@name',
// 						'headImg': '@image',
// 						'sex|1': ['boy', 'girl']
// 					}]
// 				}
// 			);
// 			$.ajax({
// 				url: "http://mockjs", //请求的url地址
// 				dataType: "json", //返回格式为json
// 				async: true, //请求是否异步，默认为异步，这也是ajax重要特性
// 				data: {}, //参数值
// 				type: "GET", //请求方式
// 				success: function(data) {
// 					f = false;
// 					var html = template('check', data);
// 					$('.person-check .innerDiv').append(html);
// 					$('.person-check .innerDiv').append(touristsLi);
// 					//					stopScroll($('.person-check'));
// 				}
// 			})
// 		} else {
// 			return false;
// 		}
// 	});
// }
// // 宜粉贊好
// function mygood() {
// 	var a = $('.statistics .statistics-title li').eq(2);
// 	var f = true;
// 	a.on('click', function() {
// 		if(f) {
// 			Mock.mock(
// 				'http://mockjs', {
// 					'good|0': [{
// 						'id|+1': 0,
// 						'name': '@name',
// 						'headImg': '@image',
// 						'sex|1': ['boy', 'girl']
// 					}]
// 				}
// 			);
// 			$.ajax({
// 				url: "http://mockjs", //请求的url地址
// 				dataType: "json", //返回格式为json
// 				async: true, //请求是否异步，默认为异步，这也是ajax重要特性
// 				data: {}, //参数值
// 				type: "GET", //请求方式
// 				success: function(data) {
// 					f = false;
// 					var html = template('good', data);
// 					$('.person-good .innerDiv').append(html);
// 					//					stopScroll($('.person-good'));
// 				}
// 			});
// 		} else {
// 			return false;
// 		}
// 	});
// }
// // 宜粉們都在看
// function allOther() {
// 	allOtherAdd();

// 	function allOtherAdd() {
// 		Mock.mock(
// 			'http://mockjs', {
// 				'searchResult|10': [{
// 					'id|+1': 0,
// 					'new|1-10': 1,
// 					'price|1-9999': 1,
// 					'img|0-1': '@image',
// 					'name': '@name',
// 					'headImg': '@image',
// 					'putTime|1-60': 1,
// 					'sex|1': ['boy', 'girl'],
// 					'subtitle': '@cparagraph(1)',
// 					'title': '@cparagraph(1)',
// 					'article': '@cparagraph(3)',
// 					'function': '@cparagraph(1)',
// 					'surface': '@cparagraph(1)',
// 					'use|1-30': 1,
// 					'period|1': ['保養期內', '過期了'],
// 					'area|0-1': '@cparagraph(1)',
// 					'num': [{
// 							'eye|0-1000': 0
// 						},
// 						{
// 							'goods|0-1000': 0
// 						},
// 						{
// 							'message|0-1000': 0
// 						}
// 					]
// 				}]
// 			}
// 		);
// 		$.ajax({
// 			url: "http://mockjs", //请求的url地址
// 			dataType: "json", //返回格式为json
// 			async: true, //请求是否异步，默认为异步，这也是ajax重要特性
// 			data: {}, //参数值
// 			type: "GET", //请求方式
// 			success: function(data) {
// 				var html = template('all-look', data);
// 				$('.all-main-container').append(html);
// 				imagesLoaded($('.all-look .all-main .pillar-all.boxTwo .page-main-head-img'), function() {
// 					var s = waterfall($('.all-main .all-main-container'),$('.all-look .all-main .pillar-all'),4,10,74);
// 					var sum = arrayGetMax(s);
// 					sum = Math.floor(sum);
// 					$('.all-main-container').css('height',sum+'px');
// 					myscroll(sum);
// 					stopScroll($('.all-main'));
// 				});
// 			}
// 		});
// 	}

// 	function myscroll(height) {
// 		$('.all-main').off('scroll');
// 		$('.all-main').on('scroll', function() {
// 			var scrollTop = $(this).scrollTop();
// 			var scrollHeight = height;
// 			var windowHeight = $(this).height();
// 			if(scrollTop + windowHeight >= scrollHeight) {
// 				allOtherAdd();
// 			}
// 		});
// 	}
// }
// // 右側專輯其他圖片
// function albumPhoto() {
// 	getPhoto();

// 	function getPhoto() {
// 		Mock.mock(
// 			'http://mockjs', {
// 				'searchResult|20': [{
// 					'img': '@image'
// 				}]
// 			}
// 		);
// 		$.ajax({
// 			url: "http://mockjs", //请求的url地址
// 			dataType: "json", //返回格式为json
// 			async: true, //请求是否异步，默认为异步，这也是ajax重要特性
// 			data: {}, //参数值
// 			type: "GET", //请求方式
// 			success: function(data) {
// 				var html = template('album-photo', data);
// 				$('.album-photo-inner').append(html);
// 				imagesLoaded($('.album-photo-inner img'), function() {
// 					var s = waterfall($('.album-photo'), $('.album-photo .photo-items'), 2, 10, 10);
// 					var sum = arrayGetMax(s);
// 					sum = Math.floor(sum);
// 					$('.album-photo-inner').css('height', sum + 'px');
// 					myscroll(sum);
// 				});
// 			}
// 		});
// 	}

// 	function myscroll(height) {
// 		$('.album-photo').off('scroll');
// 		$('.album-photo').on('scroll', function() {
// 			var scrollTop = $(this).scrollTop();
// 			var scrollHeight = height;
// 			var windowHeight = $(this).height();
// 			if(scrollTop + windowHeight >= scrollHeight) {
// 				getPhoto();
// 			}
// 		});
// 	}
// }
// // 宜粉採集到
// function albumCollect() {
// 	getCollect()

// 	function getCollect() {
// 		Mock.mock(
// 			'http://mockjs', {
// 				'searchResult|4': [{
// 					'img': '@image'
// 				}]
// 			}
// 		);
// 		$.ajax({
// 			url: "http://mockjs", //请求的url地址
// 			dataType: "json", //返回格式为json
// 			async: true, //请求是否异步，默认为异步，这也是ajax重要特性
// 			data: {}, //参数值
// 			type: "GET", //请求方式
// 			success: function(data) {
// 				var html = template('collect-photo', data);
// 				$('.collect-box-inner').append(html);
// 				myscroll();
// 			}
// 		});
// 	}

// 	function myscroll() {
// 		$('.collect-box').off('scroll');
// 		$('.collect-box').on('scroll', function() {
// 			var scrollTop = $(this).scrollTop();
// 			var scrollHeight = $('.collect-box-inner').height();
// 			var windowHeight = $(this).height();
// 			if(scrollTop + windowHeight >= scrollHeight) {
// 				getCollect();
// 			}
// 		});
// 	}
// }
$(function() {
	var picId=location.href.split('=')[1];
	console.log(picId);
	personLeft(picId);//左側專輯放大
});
// 專輯圖片放大
function personLeft(picId){
	var url="http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryAlbumPicDetail.easy?picId="+picId;
	$.ajax({
		url:url,
		type:"GET",
		async:true,
		success:function(data){
			var data1=JSON.parse(data);
			console.log(data1);
			var newData=data1.result;
			console.log(newData);
			$('.person-left .messBox_mess_name span').html(newData.collectUserName);
			$('.person-left .messBox_mess_name img').attr('src', '/src/img/common/'+newData.collectUserSex+'.png');
			$('.person-left .messBox_mess_time .articleType span').html(newData.collectAlbumName);
			$('.person-left .messBox_mess_time>p:last-of-type span').html(newData.uptime);
			var html=template('bannerPic',data1);
			$('#foodBannerul').html(html);
		}
	});
}
// 專輯個人信息
function personInfo(userId){

}

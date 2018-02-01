
document.body.onload = function () {
	store().init();
};

var store = (function () {
	function store() {
		var templateObjects = {
			// 全球荀货分类
			queryShouldbuyClass: new Ebtemplate({
				targetURL: 'http://social1.macaoeasybuy.com/easyBuyTopicController/queryShouldbuyClass/17/10.easy',
				templateID: 'queryShouldbuyClass',
				container: '.global-list',
				afterInsert: function (data) {
					console.log(data);
					$.each($('.global-list li'), function (index) {
							index === 0 && $(this).attr('data-eb-active', '') && (templateObjects.queryEasyBuyWorldClassList.requestOptions.parameters.classId = $(this).attr('id'));
							$(this).on('click', function () {
								$(this).siblings('[data-eb-active]').removeAttr('data-eb-active').end().attr('data-eb-active', '');
								templateObjects.queryEasyBuyWorldClassList.requestOptions.parameters.classId = $(this).attr('id');
								Ebtemplate.processor([templateObjects.queryEasyBuyWorldClassList]);
							})
						}
                    );
                    Ebtemplate.processor([templateObjects.queryEasyBuyWorldClassList]);
				}
			}),
			// 全球荀货列表
			queryEasyBuyWorldClassList: new Ebtemplate({
				targetURL: 'http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryEasyBuyWorldClassList.easy',
				parameters: {
					classId: 10
				},
				templateID: 'queryEasyBuyWorldClassList',
				container: '.slider-item-container',
				afterInsert: function () {
					easyBuy.global.dep.slider({
						slider: $('.slider-item-container'),
						item: $('.slider-item-container li'),
						len: 4,
						next: $('#goRight'),
						prev: $('#goLeft'),
					});
				}
			}),
			// 福利社
			queryEasyBuyWelfareList: new Ebtemplate({
				targetURL: 'http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryEasyBuyWelfareList.easy',
				templateID: 'queryEasyBuyWelfareList',
				container: '.welfare-main',
				afterInsert:function(data){
					console.log(data);
				}
			}),
			// 宜買話題分類
			queryEasyBuyTopicList: new Ebtemplate({
				targetURL: 'http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryEasyBuyTopicList.easy',
				templateID: 'queryEasyBuyTopicList',
				container: '.easylive-topic-nav-inner',
				afterInsert: function () {
					$.each($('.easylive-topic-nav li'), function (index) {
						index === 0 && $(this).attr('data-eb-active', '');
						$(this).children('div').on('click', function () {
							$(this).siblings('[data-eb-active]').removeAttr('data-eb-active').end().attr('data-eb-active', '');
							queryEasyBuyTopicDetailList.requestOptions.parameters.classId = $(this).attr('id');
							templateProcessor([queryEasyBuyTopicDetailList]);
						})
					});
					easyBuy.global.dep.ebSlide({
						mode: 1,
						wrapper: $('.easylive-topic-nav-inner'),
						item: $('.easylive-topic-nav-inner li'),
						len: 7,
						next: $('.easylive-topic-nav-bottom'),
						prev: $('.easylive-topic-nav-top'),
					});
				}
			}),
			// 宜買話題精選
			queryEasyBuyTopicDetailList: new Ebtemplate({
				targetURL: 'http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryEasyBuyTopicDetailList.easy',
				parameters: {
					classId: 5
				},
				templateID: 'queryEasyBuyTopicDetailList',
				container: '.easylive-topic-list ul',
				afterInsert:function(data){
					console.log(data);
				}
			}),
			//生活圈
			queryEasyBuySuitableLifeList: new Ebtemplate({
				targetURL: 'http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryEasyBuySuitableLifeList.easy',
				templateID: 'queryEasyBuySuitableLifeList',
				container: '.living-circle .slide-wrapper',
				afterInsert: function () {
					easyBuy.global.dep.ebSlide({
						mode: 2,
						autoPlay: true,
						loop: true,
						wrapper: $('.living-circle .slide-wrapper'),
						item: $('.living-circle .slide-wrapper .slide-item'),
					})
				}
			}),
			// 宜粉日志
			queryEasyBuyReleaseList: new Ebtemplate({
				targetURL: 'http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryEasyBuyReleaseList.easy',
				templateID: 'queryEasyBuyReleaseList',
				container: '.follower-log .slide-wrapper',
				afterInsert: function () {
					easyBuy.global.dep.ebSlide({
						mode: 2,
						autoPlay: true,
						loop: true,
						wrapper: $('.follower-log .slide-wrapper'),
						item: $('.follower-log .slide-wrapper .slide-item'),
					})
				}
			}),
			// 宜粉專輯
			queryEasyBuyAlbumList: new Ebtemplate({
				targetURL: 'http://social1.macaoeasybuy.com/shouldBuySocialConntroller/queryEasyBuyAlbumList.easy',
				templateID: 'queryEasyBuyAlbumList',
				container: '.easylive-album .slide-wrapper',
				afterInsert: function () {
					easyBuy.global.dep.ebSlide({
						mode: 2,
						autoPlay: true,
						loop: true,
						wrapper: $('.easylive-album .slide-wrapper'),
						item: $('.easylive-album .slide-wrapper .slide-item'),
					})
				}
			}),
		};
		function init() {
			Ebtemplate.processor([
				templateObjects.queryShouldbuyClass,
				templateObjects.queryEasyBuyWelfareList,
				templateObjects.queryEasyBuyTopicList,
				templateObjects.queryEasyBuyTopicDetailList,
				templateObjects.queryEasyBuySuitableLifeList,
				templateObjects.queryEasyBuyReleaseList,
				templateObjects.queryEasyBuyAlbumList
			]);
		}
		return {init: init};
	}
	return store;
}());


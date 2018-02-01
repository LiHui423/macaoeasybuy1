const d = new parent.window.Effect({
    el: '.dynamic-type-tabs',
});
// (function () {
//     const Effect = parent.window.Effect.call(window);
//     const page = new Effect();
//     const Template = page.Template;
//     page.initTemplate(window);
//     const userId = Effect.data('userInfo')['id'];
//     const descOrAsc = 'desc';
//     const size = 8;
//     let activeTos = null;
//     let type = 0;
//     const doms = {
//         $newCount: $('.info-news'),
//         $dynamicTabs: $('.dynamic-type-tabs'),
//         $sortOrderTabs: $('.sort-order-tabs'),
//         $container: $('.dynamic-content'),
//     };
//     const tos = {
//         // 好友日志
//         queryDynamicRelease: new Template({
//             api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicRelease.easy',
//             params: {
//                 page: 0,
//                 order: 'uptime',
//                 size,
//                 descOrAsc,
//                 userId,
//             },
//             templateID: 'queryDynamicRelease',
//             container: $('.dynamic-content .sort-box:first'),
//             afterInsert() {
//                 const container = doms.$container.children().eq(doms.$container.attr('data-active'));
//                 Effect.waterfall({container, column: 4,}, window);
//             }
//         }),
//         queryDynamicAlbum: new Template({
//             api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicAlbum.easy',
//             params: {
//                 page: 0,
//                 order: 'uptime',
//                 size,
//                 descOrAsc,
//                 userId,
//             },
//             templateID: 'queryDynamicRelease',
//         }),
//         queryDynamicSuitableLife: new Template({
//             api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicSuitableLife.easy',
//             params: {
//                 page: 0,
//                 order: 'uptime',
//                 size,
//                 descOrAsc,
//                 userId,
//             },
//             templateID: 'queryDynamicRelease',
//         }),
//         queryDynamicSentVolunteers: new Template({
//             api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicSentVolunteers.easy',
//             params: {
//                 page: 0,
//                 order: 'uptime',
//                 size,
//                 descOrAsc,
//                 userId,
//             },
//             templateID: 'queryDynamicRelease',
//         }),
//         queryDynamicUsed: new Template({
//             api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicUsed.easy',
//             params: {
//                 page: 0,
//                 order: 'uptime',
//                 size,
//                 descOrAsc,
//                 userId,
//             },
//             templateID: 'queryDynamicRelease',
//         }),
//         queryDynamicFair: new Template({
//             api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicFair.easy',
//             params: {
//                 page: 0,
//                 order: 'uptime',
//                 size,
//                 descOrAsc,
//                 userId,
//             },
//             templateID: 'queryDynamicRelease',
//         }),
//     };
//     /**
//      *
//      */
//     const methods = {
//         // 更新最后点击时间
//         updateClickTime(type) {
//             let lastClickTime = null;
//             const url = Effect.getRequestURL({
//                 api: 'http://userspace1.macaoeasybuy.com/userDynamicController/updateClickTime.easy',
//                 params: {
//                     type: type,
//                     userId
//                 }
//             });
//             $.ajax({
//                 url,
//                 method: 'GET',
//                 dataType: 'JSONP',
//                 async: false,
//                 success(responseJSON) {
//                     lastClickTime = responseJSON['result'];
//                     activeTos.requestOptions.params['lastClickTime'] = lastClickTime;
//                     Template.execute(activeTos, page.data.template);
//                 },
//             });
//         },
//         // 查询新发布
//         queryDynamicCount() {
//             const url = Effect.getRequestURL({
//                 api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicCount.easy',
//                 params: { userId },
//             });
//             $.ajax({
//                 url,
//                 method: 'GET',
//                 dataType: 'JSONP',
//                 success(responseJSON) {
//                     const newCountKey = ["releaseCount", "albumCount", "suitableLifeCount", "sentVolunteersCount", "usedCount", "fairCount"];
//                     newCountKey.forEach((v, i) => {
//                         const COUNT = responseJSON['result'][v];
//                         const html = COUNT === 0 ? '暫無新發佈' : `有<span>${COUNT}</span>新發佈`;
//                         doms.$newCount.eq(i).html(html);
//                     });
//                 },
//             });
//         },
//         bindClickEvnet() {
//             doms.$dynamicTabs.on('click', '.tab' , e => {
//                 const $e = $(e.target).hasClass('.tab') ? $(e.target) : $(e.target).parents('.tab');
//                 const nowActiveIndex = doms.$dynamicTabs.attr('data-active');
//                 $e.index() !== nowActiveIndex && doms.$dynamicTabs.attr('data-active', $e.index());
//             });
//             doms.$sortOrderTabs.on('click', '.tab', e => {
//                 const $e = $(e.target);
//                 const nowActiveIndex = doms.$sortOrderTabs.attr('data-active');
//                 $e.index() !== nowActiveIndex && doms.$sortOrderTabs.attr('data-active', $e.index());
//             });
//         },
//         // 初始化
//         init() {
//             this.queryDynamicCount();
//             activeTos = tos.queryDynamicRelease;
//             this.updateClickTime(type);
//             this.bindClickEvnet();
//         }
//     };
//     methods.init();
// }());

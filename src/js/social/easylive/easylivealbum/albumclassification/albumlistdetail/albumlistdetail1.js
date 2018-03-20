$(function(){
    const albumID = easyBuy.global.pageParameter.albumId;
    const m = easyBuy.global.dep;
    const $btn = $('.album-btn');//批量採集按鈕
    // 專輯標題圖片和描述
    $.ajax({
        url:'http://social1.macaoeasybuy.com/thealbumSocialConntroller/queryThealBumData.easy',
        type:'GET',
        data:{
            id:albumID

        },
        success:function(result){
            let data = JSON.parse(result);
            let html = template('albumInfo',data);
            $('#swapper > #container .detail-title').html(html);
            let visitorHtml = template('visitor',data);
            $('#swapper > #container .container-swapper .mdcategory_title').html(visitorHtml);
        },
        error:function(){
            console.log('發生未知錯誤');
        }
    });
    // 專輯圖組
    $.ajax({
        url:'http://social1.macaoeasybuy.com/thealbumSocialConntroller/queryThealBumGroupData.easy',
        data:{
            id:albumID,
            page:0,
            size:20
        },
        type:'GET',
        success:function(result){
            let data = JSON.parse(result);
            let albumList = template('albumPicList',data);
            $('#swapper > #container .album-lister').html(albumList);
            let _data = result.list;
            pictureSelector();
            pictureClick();
        }
    });
    function pictureSelector(){
        let itemArr = $('.album-lister').children();
        let selectPic = [];
        itemArr.each(function(){
            let _this = $(this);
            let checkbox = _this.find('.hover-check-box');
            _this.data('PictureID',_this.attr('id'));
            checkbox.on('click',function(){
                if(Object.keys(selectPic).length <= 5 || selectPic[_this.data('PictureID')] !== undefined){
                    _this.toggleClass('yez-selected');
                    if(selectPic[_this.data('PictureID')] !== undefined){
                        delete selectPic[_this.data('PictureID')];
                    } else {
                        selectPic[_this.data('PictureID')] = {
                            desc: _this.find('.shadow-box p').html(),
                            pic: _this.find('.img-container img').attr('src').replace('//wap.macaoeasybuy.com',''),
                            id:_this.attr('id')
                        };
                    }
                    changeSelectedCount(Object.keys(selectPic).length)
                }
            })
        })
        collectionBtn(selectPic);
    }
    // 勾選數量
    function changeSelectedCount(count) {
        let $btn = $('.take-album-btn .album-btn');
        $('.take-album-btn .album-btn').children('span').html(count);
        count === 0 ? $btn.addClass('cannot-select') : $btn.removeClass('cannot-select');
    }
    // 批量採集
    function collectionBtn(selectPic) {
        var btn = $('.album-btn');  // 獲取採集按鈕
        btn.on('click', function () {
          if(Object.keys(selectPic).length > 0) {
            new PCollector(selectPic);
          }
        });
    }
    // 点击图片
    function pictureClick() {
        let $c = $('.album-list');
        $c.on('click', (e) => {
          let target = e.target;
          if($(target).hasClass('shadow-box') || $(target).is('p')){
            let id = $(target).parents('.picture-item').attr('id');
            window.open('http://social.macaoeasybuy.com/easylive/easylivealbum/albumclassification/albumlistdetail/albumphotodetail/albumphotodetail.html?albumPhotoId=' + id);
          }
        });
    }
})

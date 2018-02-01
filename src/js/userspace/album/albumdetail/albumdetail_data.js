//獲取專輯信息
function albumDetailInfo() {
    var formatNum = easyBuy.global.dep.formatNum;
    var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryTheAlbumInfo.easy?id=' + postId + '&easybuyCallback=?';
    $.getJSON(dataUrl, function (data) {
        var newData = data.albumInfo;
        $('#album-title-name-show').html(newData.thealbumname); //專輯名字
        //專輯名字
        if (easyBuy.global.isSelf) {
            $('#album-title-name').val(newData.thealbumname);
        }
        $('#album-all-num').html('專輯數：' + newData.albumGroupNums + '張'); //專輯數目
        $('#selecter span').html(newData.classname); //專輯類別
        $('#album-cover').html('<img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/' + newData.thecoverpictureurl + '" onerror="this.src=\'/img/userspace/album/album-no-img.png\'">'); //專輯圖片
        var $li = $('#album-info-num li');
        $li.eq(0).find('div').eq(0).html(formatNum(newData.seeNums)); //宜粉查看
        $li.eq(1).find('div').eq(0).html(formatNum(newData.commentNums)); //宜粉回應
        $li.eq(2).find('div').eq(0).html(formatNum(newData.loveNums)); //宜粉讃好
//		$li.eq(3).find('div').eq(0).html(formatNum(newData.seeNums)); //宜粉採集
        window.albumData.editorAlbum.albumInfo = {
            albumTitle: newData.thealbumname,
            albumCover: newData.thecoverpictureurl ? newData.thecoverpictureurl : 'null',
            albumClass: newData.classname ? newData.classname : '未選擇',
            classId: 0,
        };
        window.albumData.albumPhotoNum = newData.albumGroupNums;
        easyBuy.global.isSelf && window.albumData.mineFunc.chagneAlbum();
    });
}

//獲取專輯列表信息
function getListData(listData) {
    var box = $('#' + listData.order + '-box'); //顯示的盒子
    var idx = box.index() - 1;
    var size = window.albumData.listRequestSize;
    var page = listData.page;
    var order = listData.order;
    var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryTheAlbumGroup.easy?id=' + postId + '&userId=' + userId + '&seeUserId=' + seeUserId + '&size=' + size + '&order=' + order + '&page=' + page + '&descOrAsc=desc&easybuyCallback=?';
    var formatNum = easyBuy.global.dep.formatNum;
    $.ajax({
        url: dataUrl,
        type: "get",
        async: true,
        dataType: 'jsonp',
        beforeSend: function () {
            listData.isFirst = false;
            bindScroll('off');
            if (listData.isComplate) return false;
        },
        success: function (data) {
            //整理數據內容
            var newData = data.theAlbumInfoGroup;
            newData.page = page;
            newData.order = order;
            for (var i = 0; i < newData.albumList.length; i++) {
                newData.albumList[i].seeNums = formatNum(newData.albumList[i].seeNums);
                newData.albumList[i].loveNums = formatNum(newData.albumList[i].loveNums);
                newData.albumList[i].commentNums = formatNum(newData.albumList[i].commentNums);
                //newData.albumList[i].commentNums = formatNum(newData.albumList[i].commentNums);
            }
            //創建目標，插入目標
            var htmlString = easyBuy.global.template['album-template'];
            var html = template.render(htmlString, newData);
            if (page === 0) {
                box.find('.album-lister-inner').html(html);
            } else {
                box.find('.album-lister-inner').append(html);
            }
            //頁數加一
            listData.page += 1;
            //判斷加載是否完成
            if (newData.albumList.length === size) {
                //存儲最後一個的Id
                bindScroll('on', idx);
            } else {
                listData.isComplate = true;
                bindScroll('off');
                box.find('.no-more').css('display', 'block');
            }
            //如果什麼數據都沒有，則隱藏沒有更多了哦，顯示沒有內容
            if (listData.page === 1 && newData.albumList.length === 0) box.find('.no-more').css('display', 'none');
            //存儲節點信息
            for (var j = 0; j < newData.albumList.length; j++) {
                var $item = $('#' + newData.albumList[j].id + '-albumlist-' + newData.order);
                $item.data('data', {
                    groupurl: newData.albumList[j].groupurl,
                    id: newData.albumList[j].id,
                    groupdetailed: newData.albumList[j].groupdetailed
                });
                albumSelectId($item, newData.isSelf); //辦定勾選事件
            }
            if (newData.isSelf === 0) {
                collectOnClick();
                closeCollect();
            }
        }
    });
}

//滾動
function bindScroll(state, idx) {
    if (state == 'on') {
        var wheight = $(window).height();
        var bheight = $(document).outerHeight(true);
        $(window).off('scroll');
        $(window).on('scroll', function () {
            var wheight = $(window).height();
            var bheight = $(document).outerHeight(true);
            var wT = $(this).scrollTop();
            if (wT + wheight >= bheight * 0.4) {
                getListData(window.albumData.listdata[idx]);
            }
        });
    } else {
        $(window).off('scroll');
    }
}

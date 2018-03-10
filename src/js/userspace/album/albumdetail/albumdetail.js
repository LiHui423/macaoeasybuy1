void function () {
  const data = {
    userId: null,
    spaceId: easyBuy.global.pageParameter.spaceid,
    albumId: easyBuy.global.pageParameter.albumId,
    isSelf: easyBuy.global.isSelf,
    listdata: [
      { order: 'uptime', page: 0, isFirst: true, isComplate: false },
      { order: 'commentNums', page: 0, isFirst: true, isComplate: false },
      { order: 'loveNums', page: 0, isFirst: true, isComplate: false },
    ],
    collect: [], //用戶採集
    selectIdx: 0, //目前顯示的排序盒子
    listRequestSize: 12, //一次請求6個數據
    selectId: [], //存儲Id的數組
    selectMaxSize: 6, //最多選擇6個專輯進行操作
    otherAlbum: { //移動專輯那裡是否已經請求過專輯列表了
      isFirst: true,
      isComplate: false,
      page: 0,
      size: 6,
      selectAlbum: null,
      newAlbum: null,
      hasAddAlbum: false
    },
    editorAlbum: {
      isClass: false, //是否已經請求過分類列表了
      isCover: false, //是否已經請求過封面列表了
      cover: {
        page: 0,
        isFirst: true,
        isComplate: false,
        size: 9
      },
      albumInfo: {} //專輯詳細信息
    },
    otherFunc: {}, //看他人的方法
    mineFunc: {}, //看自己的方法
    albumPhotoNum: 0, //專輯的總數目
    isCanSubmit: true //是否可以發送修改專輯請求
  };
  const methods = {
    formatNum: easyBuy.global.dep.formatNum,
    deleteArrObj: easyBuy.global.dep.deleteArrObj,
    init() {
      if (!data.isSelf) {
        $('.editor-top.mine').remove();
        $('#album-collect').remove();
        $('.album-poster .laster-text-head').remove();
        $('.album-poster .laster-text-num .laster-text-num-first').remove();
        sortSelect(); //看自己的選項排序
      } else {
        $('#contenteditable-btn').remove();
        $('#selecter img').remove();
        $('.classification-top ul').remove();
        $('.editor-top.other').remove();
        $('#change-cover-box').remove();
        $('#chagne-success-tips').remove();
        $('#move-success-tips').remove();
        $('#change-post').remove();
        $('#album-change-shadow').remove();
        $('#delete-post').remove();
        $('#album-move').remove();
        $('#album-title-name').remove();
        $('#collect-btn').click(function() {
            Object.keys(albumData.collect).length > 0 && pcollector.open(albumData.collect);
        });
        sortSelectOther(); //看別人的選項排序
      }
      //albumDetailInfo(); //獲取專輯信息
      this.getAlbumDetail();
      this.getListData(data.listdata[0]);
    },
    getAlbumDetail() {
      const url = `http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryTheAlbumInfo.easy?id=${data.albumId}&easybuyCallback=?`;
      $.getJSON(url, (res) => {
        console.log(res);
        const _data = res.albumInfo;
        $('#album-title-name-show').html(_data.thealbumName);
        data.isSelf && $('#album-title-name').val(_data.thealbumName);
        $('#album-all-num').html(`專輯數：${_data.collectionNum}張`); //專輯數目
        $('#selecter span').html(_data.className); //專輯類別
        if(_data.thecoverpictureurl !== ''){
            $('#album-cover').html(`<img src="http://wap.macaoeasybuy.com/${_data.thecoverpictureurl}" onerror="this.src='/src/img/userspace/album/album-no-img.png'>`); //專輯圖片
        }else{
            $('#album-cover').html(`<img src="/src/img/userspace/album/album-no-img.png">`); //專輯圖片
        }
        const $li = $('#album-info-num li');
        $li.eq(0).find('div').eq(0).html(this.formatNum(_data.seeNum + _data.sSeeNum)); //宜粉查看
        $li.eq(1).find('div').eq(0).html(this.formatNum(_data.topicSum)); //宜粉回應
        $li.eq(2).find('div').eq(0).html(this.formatNum(_data.loveNum + _data.sLoveNum)); //宜粉讃好
        // $li.eq(3).find('div').eq(0).html(formatNum(_data.seeNums)); //宜粉採集
        data.editorAlbum.albumInfo = {
          albumTitle: _data.thealbumName,
          albumCover: _data.thecoverpictureurl ? _data.thecoverpictureurl : null,
          albumClass: _data.className ? _data.className : '未選擇',
          classId: 0,
        }
        data.albumPhotoNum = _data.collectionNum;
        data.isSelf && data.mineFunc.chagneAlbum();
      });
    },
    getListData(listData) {
      const box = $(`#${listData.order}-box`); //顯示的盒子
      const idx = box.index() - 1;
      const size = data.listRequestSize;
      const page = listData.page;
      const order = listData.order;
      const url = `http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryTheAlbumGroup.easy?id=${data.albumId}&userId=${data.userId}&seeUserId=${data.spaceId}&size=${size}&order=${order}&page=${page}&descOrAsc=desc&easybuyCallback=?`;
      $.ajax({
        url: url,
        type: 'get',
        dataType: 'jsonp',
        beforeSend() {
          listData.isFirst = false;
          bindScroll('off');
          if (listData.isComplate) {
            return;
          }
        },
        success(res) {
            console.log(res);
          if (res.theAlbumInfoGroup === null) {
              return false;
          }
          const _data = res.theAlbumInfoGroup;
          for (let i = 0; i < _data.albumList.length; i++) {
            _data.albumList[i].seeNums = methods.formatNum(_data.albumList[i].seeNums);
            _data.albumList[i].loveNums = methods.formatNum(_data.albumList[i].loveNums);
            _data.albumList[i].commentNums = methods.formatNum(_data.albumList[i].commentNums);
            _data.albumList[i].commentNums = methods.formatNum(_data.albumList[i].commentNums);
          }
        //   專輯詳細頁專輯列表
          const htmlString = easyBuy.global.template['album-template'];
          const html = template.render(htmlString, _data);
          if (page === 0) {
            box.find('.album-lister-inner').html(html);
          } else {
            box.find('.album-lister-inner').append(html);
          }
          listData.page += 1; //頁數加一
          //判斷加載是否完成
          if (_data.albumList.length === size) {
            //存儲最後一個的Id
            bindScroll('on', idx);
          } else {
            listData.isComplate = true;
            bindScroll('off');
            box.find('.no-more').css('display', 'block');
          }
          //如果什麼數據都沒有，則隱藏沒有更多了哦，顯示沒有內容
          if (listData.page === 1 && _data.albumList.length === 0) {
            box.find('.no-more').css('display', 'none');
          }
          //存儲節點信息
          for (let i = 0; i < _data.albumList.length; i++) {
            const $item = $('.' + _data.albumList[i].id + '-albumlist');
            //console.log($item);
            $item.data('data', {
              groupurl: _data.albumList[i].groupurl,
              id: _data.albumList[i].id,
              groupdetailed: _data.albumList[i].groupdetailed
            });
            methods.bindSelectEvent($item, _data.isSelf); //辦定勾選事件
          }
        },
        error(){
            console.log('發生未知錯誤');
        }
      });
    },
    bindSelectEvent($el, state) {
      const el = $el[0];
      el.isSelect = false;  // 自定义属性
      $el.hover(function () {
        $el.find('.hover-check-box-outer').css('display', 'block');
      }, 
        function () {
            if (el.isSelect) {
            return false;
            } else {
            $el.find('.hover-check-box-outer').css('display', 'block');
            }
            $el.find('.hover-check-box-outer').css('display', 'none');
        }
        );
      $el.find('.hover-check-box-outer').on('click', function () {
        const _data = $el.data('data');
        const listData = data.collect;
        const listMax = data.selectMaxSize;
        if (el.isSelect) {
          $el.removeClass('select');
          el.isSelect = false;
          methods.deleteArrObj(listData, 'id', _data.id);
        } else {
          if (listData.length === listMax) {
            const $item = $('#select-max-tips');
            console.log($item.css('display'));
            $item.css('display') === 'none' && $item.fadeIn(500).delay(1000).fadeOut(500);
            return false; //限制數量
          }
          $el.addClass('select');
          el.isSelect = true;
          listData[listData.length] = {
            pic: _data.groupurl
          };
        }
        switch (state) {
          case 0:
            data.otherFunc.albumCollect();
            break;
          case 1:
            data.mineFunc.bindNum(listData.length);
            data.mineFunc.deletePhotos(listData);
            data.mineFunc.albumMove(listData);
            data.mineFunc.goEditor(listData);
            break;
        }
      });
    }
  };
  const start = setInterval(() => {
    if (easyBuy.easyUser.id !== undefined) {
      clearInterval(start);
      data.userId = easyBuy.easyUser.id;
      methods.init();
    }
  }, 100);

    //獲取專輯列表信息
    function getListData(listData) {
        var box = $('#' + listData.order + '-box'); //顯示的盒子
        var idx = box.index() - 1;
        var size = data.listRequestSize;
        var page = listData.page;
        var order = listData.order;
        var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryTheAlbumGroup.easy?id=' + data.albumId + '&userId=' + data.userId + '&seeUserId=' + data.spaceId + '&size=' + size + '&order=' + order + '&page=' + page + '&descOrAsc=desc&easybuyCallback=?';
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
                if (data.theAlbumInfoGroup === null) {
                    return false;
                }

                //整理數據內容
                var newData = data.theAlbumInfoGroup;
                newData.page = page;
                newData.order = order;
                for (var i = 0; i < newData.albumList.length; i++) {
                    newData.albumList[i].seeNums = formatNum(newData.albumList[i].seeNums);
                    newData.albumList[i].loveNums = formatNum(newData.albumList[i].loveNums);
                    newData.albumList[i].commentNums = formatNum(newData.albumList[i].commentNums);
                    // newData.albumList[i].commentNums = formatNum(newData.albumList[i].commentNums);
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
                    //albumSelectId($item, newData.isSelf); //辦定勾選事件
                    methods.bindSelectEvent($item, newData.isSelf); //辦定勾選事件
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
                    getListData(data.listdata[idx]);
                }
            });
        } else {
            $(window).off('scroll');
        }
    }

    //看自己的選項排序
    function sortSelect() {
        var listdata = data.listdata;
        var clock = setInterval(function () {
            if (easyBuy.easyUser.id !== undefined) {
                clearInterval(clock);
                getListData(listdata[0]);
            }
        }, 100);
        $('.sort-menu-select-top').on('click', function () {
            chagne();
        });
        $('.sort-menu-select-bottom-shadow').on('click', function () {
            chagne();
        });
        $('.sort-menu-select-bottom ul li').on('click', function () {
            chagne();
            if ($(this).text() === $('.sort-menu-text').text()) {
                return false
            };
            var idx = $(this).index();
            data.selectIdx = idx;
            if (listdata[idx].isFirst) getListData(listdata[idx]); //發出請求
            $('.album-lister').eq(idx).siblings('.album-lister').removeClass('select').end().addClass('select');
            $('.sort-menu-text').html($(this).text());
            $('.sort-menu-icon img').attr('src', $(this).find('img').attr('src'));
            //換頁就清空掉原來選擇的
            $('.album-list.select').each(function () {
                $(this).removeClass('select');
                $(this)[0].isSelect = false;
            });
            var arr = window.albumData.selectId;
            arr.splice(0, arr.length);
            data.mineFunc.bindNum(arr.length);
        });

        function chagne() {
            $('.sort-menu-select-bottom').fadeToggle(10);
            $('.sort-menu-select-bottom-shadow').fadeToggle(1);
            if ($('.sort-menu-select-top').css('z-index') === '502') {
                $('.sort-menu-select-top').css('z-index', '499');
            } else {
                $('.sort-menu-select-top').css('z-index', '502');
            }
        }
    }
    //看自己的 專輯操作
    //跳轉編輯頁
    data.mineFunc.goEditor = function (selectId) {
        if (selectId.length === 0) {
            $('#editor-btn a').removeAttr('href');
        } else {
            $('#editor-btn a').attr('href', '/page/userspace/album/albumeditor/albumeditor.html');
        }
    };
    //刪除圖片
    data.mineFunc.deletePhotos = function (selectId) {
        if (selectId.length === 0) {
            $('#remove-btn').off('click');
            $('#delete-post .cancel-sure').off('click');
            $('#delete-post .sure-cancel').off('click');
            return false;
        } else {
            $('#remove-btn').off('click');
            $('#delete-post .cancel-sure').off('click');
            $('#delete-post .sure-cancel').off('click');
            $('#remove-btn').on('click', function () {
                $('#delete-post').css('display', 'block');
            });
            $('#delete-post .cancel-sure').on('click', function () {
                $('#delete-post').css('display', 'none');
            });
            $('#delete-post .sure-cancel').on('click', function () {
                //確認刪除圖片
                var arr = [];
                for (var i = 0; i < selectId.length; i++) {
                    arr.push(selectId[i].id);
                }
                requestFunc(arr.join(','));
            });
        }

        function requestFunc(res) {
            var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/deleteBatchAlbumGroup.easy?id=' + postId + '&idStr=' + res + '&easybuyCallback=?';
            $.getJSON(dataUrl, function (data) {
                if (data.albumPic.groupurl === undefined) return false;
                $('#album-cover img').attr('src', 'http://wap.macaoeasybuy.com/' + data.albumPic.groupurl);
                data.editorAlbum.albumInfo.albumCover = data.albumPic.groupurl ? data.albumPic.groupurl : 'null';
                $('#album-all-num').html('專輯數：' + (window.albumData.albumPhotoNum -= selectId.length) + '張');
                if ($('#move-success-tips').css('display') === 'none') $('#move-success-tips').fadeIn(500).delay(1000).fadeOut(500);
                for (var i = 0; i < selectId.length; i++) {
                    $('.' + selectId[i].id + '-albumlist').each(function () {
                        $(this).remove();
                    });
                }
                data.mineFunc.resetData(selectId);
                $('#delete-post').css('display', 'none');
            });
        }
    };
    //辦定數字
    data.mineFunc.bindNum = function (count) {
        if (count == 0) {
            $('#editor-btn img').attr('src', '/src/img/userspace/album/operation-icon.png');
            $('#move-btn img').attr('src', '/src/img/userspace/album/move-icon.png');
            $('#remove-btn img').attr('src', '/src/img/userspace/common/deletebtn.png');
            $('.edtor-btns-items').css({
                'background-color': '#fff',
                'color': '#aaa',
                'border-color': '#aaa',
                'cursor': 'default'
            });
            $('#editor-btn a').css({
                'color': '#aaa',
                'cursor': 'default'
            });
        } else {
            $('#editor-btn img').attr('src', '/src/img/userspace/album/operation-icon-s.png');
            $('#move-btn img').attr('src', '/src/img/userspace/album/move-icon-s.png');
            $('#remove-btn img').attr('src', '/src/img/userspace/common/deletebtn-s.png');
            $('.edtor-btns-items').css({
                'background-color': '#E98900',
                'color': '#fff',
                'border-color': '#E98900',
                'cursor': 'pointer'
            });
            $('#editor-btn a').css({
                'color': '#fff',
                'cursor': 'pointer'
            });
        }
        $('.edtor-btns-items span').html(count);
    };
    //專輯移動
    data.mineFunc.albumMove = function (selectId) {
        if (selectId.length === 0) {
            $('#move-btn').off('click');
            $('#album-move .album-move-box .album-create input').off('keyup');
            return false;
        } else {
            openBox();
        }

        //發送移動專輯
        function sendMoveAlbum() {
            var arr = [];
            for (var i = 0; i < selectId.length; i++) {
                arr.push(selectId[i].id);
            }
            var groupId = arr.join(',');
            var moveId = window.albumData.otherAlbum.selectAlbum;
            var name = encodeURIComponent(window.albumData.otherAlbum.newAlbum);
            var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/moveAlbumGroup.easy?id=' + postId + '&groupId=' + groupId + '&userId=' + userId + '&moveId=' + moveId + '&name=' + name + '&easybuyCallback=?';
            $.ajax({
                url: dataUrl,
                type: "get",
                async: true,
                dataType: 'jsonp',
                beforeSend: function () {
                    $('#album-move .move-btn').off('click');
                },
                success: function (data) {
                    $('#album-cover img').attr('src', 'http://wap.macaoeasybuy.com/' + data.albumPic.groupurl);
                    data.editorAlbum.albumInfo.albumCover = data.albumPic.groupurl ? data.albumPic.groupurl : 'null';
                    $('#album-all-num').html('專輯數：' + (window.albumData.albumPhotoNum -= selectId.length) + '張');
                    $('#album-move').css('display', 'none');
                    if ($('#move-success-tips').css('display') == 'none') $('#move-success-tips').fadeIn(500).delay(1000).fadeOut(500);
                    // 刪除節點
                    for (var i = 0; i < selectId.length; i++) {
                        $('.' + selectId[i].id + '-albumlist').each(function () {
                            $(this).remove();
                        });
                    }
                    //清空數據
                    data.mineFunc.resetData(selectId, true);
                    //重新辦定事件
                    $('#album-move .move-btn').on('click', function () {
                        sendMoveAlbum();
                    });
                }
            });
        }

        //打開窗口
        function openBox() {
            $('#move-btn').off('click');
            $('#move-btn').on('click', function () {
                $('#album-move').css('display', 'block');
                appendNode();
                if (window.albumData.otherAlbum.isFirst) getAlbumList();
                createNewAlbum();
                // mathValueLength($('#album-move .album-move-box .album-create input'), $('#album-move .album-move-box .album-create .input-count span'), 10);
                listenInputVal(); //監聽有輸入時按鈕變顏色
            });
        }

        //添加節點
        function appendNode() {
            $('#album-move .move-list').html('');
            for (var i = 0; i < selectId.length; i++) {
                var imgHtml = '<li id="' + selectId[i].id + '-move" data-id="' + selectId[i].id + '"><img src="http://mbuy.oss-cn-hongkong.aliyuncs.com/' + selectId[i].groupurl + '" alt="" class="move-list-img" middle="true"><img src="/src/img/userspace/album/close-btn.png" alt="" class="album-close-btn"></li>';
                $('#album-move .move-list').append(imgHtml);
                $('#' + selectId[i].id + '-move')[0].dataId = selectId[i].id;
                setWidth();
                albumImgMiddle();
                closeBox();
                moveBtn(selectId); //移動按鈕
                closeBtnFunc(); //刪除選中圖片
            }
            $('#album-move .album-move-box .album-move-text-title span').html(selectId.length);
        }

        //刪除選中圖片
        function closeBtnFunc() {
            $('#album-move .album-close-btn').each(function () {
                $(this).off('click');
                $(this).on('click', function () {
                    var a = $(this).parent();
                    a.remove();
                    methods.deleteArrObj(selectId, 'id', a[0].dataId);
                    $('.' + a[0].dataId + '-albumlist').each(function () {
                        $(this).removeClass('select');
                        if ($(this)[0].isSelect) $(this)[0].isSelect = false;
                        $(this).find('.hover-check-box-outer').css('display', 'none');
                    });
                    data.mineFunc.bindNum(selectId.length);
                    $('#album-move .album-move-box .album-move-text-title span').html(selectId.length);
                    a = null;
                    moveBtn(selectId);
                    setWidth();
                });
            });
        }

        //監聽有輸入時按鈕變顏色
        function listenInputVal() {
            $('#album-move .album-move-box .album-create input').off('keyup.color');
            $('#album-move .album-move-box .album-create input').on('keyup.color', function () {
                $('#album-move .album-move-box .album-create .input-count span').html($(this).val().length);
                if ($(this).val().length >= 1) {
                    $('#album-move .album-move-box .album-create div').removeClass('no-select');
                } else {
                    $('#album-move .album-move-box .album-create div').addClass('no-select');
                }
            });
        }

        //獲取專輯列表
        function getAlbumList() {
            otherAlbumListReq();

            function otherAlbumListReq() {
                var size = window.albumData.otherAlbum.size;
                var page = window.albumData.otherAlbum.page;
                var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryUserAlbum.easy?userId=' + userId + '&id=' + postId + '&size=' + size + '&page=' + page + '&order=uptime&descOrAsc=desc&easybuyCallback=?';
                $.ajax({
                    url: dataUrl,
                    type: "get",
                    async: true,
                    dataType: 'jsonp',
                    beforeSend: function () {
                        otherAlbumListScroll('off');
                        window.albumData.otherAlbum.isFirst = false;
                        if (window.albumData.otherAlbum.isComplate) return false;
                    },
                    success: function (data) {
                        var newData = data.albumList;
                        data.page = page;
                        var html = template('other-album-list-template', data);
                        $('#other-album-inner').append(html);
                        window.albumData.otherAlbum.page += 1;
                        for (var i = 0; i < newData.length; i++) {
                            $('#' + newData[i].id + 'otheralbum').data('data', newData[i]);
                            albumSelectBind($('#' + newData[i].id + 'otheralbum'));
                        }
                        if (newData.length == size) {
                            otherAlbumListScroll('on');
                        } else {
                            otherAlbumListScroll('off');
                            window.albumData.otherAlbum.isComplate = true;
                        }
                    }
                });
            }

            function otherAlbumListScroll(state) {
                if (state == 'on') {
                    var wheight = $('#other-album-list').height();
                    var bheight = $('#other-album-inner').outerHeight(true);
                    $('#other-album-list').off('scroll');
                    $('#other-album-list').on('scroll', function () {
                        var wheight = $('#other-album-list').height();
                        var bheight = $('#other-album-inner').outerHeight(true);
                        var wT = $('#other-album-list').scrollTop();
                        if (wT + wheight >= bheight * 0.9) {
                            otherAlbumListReq();
                        }
                    });
                } else {
                    $('#other-album-list').off('scroll');
                }
            }
        }

        //選擇專輯
        function albumSelectBind(obj) {
            obj.on('click', function () {
                var data = $(this).data('data');
                if ($(this).hasClass('select')) {
                    $(this).removeClass('select');
                    window.albumData.otherAlbum.selectAlbum = null;
                    window.albumData.otherAlbum.newAlbum = null;
                } else {
                    $(this).siblings('li').removeClass('select').end().addClass('select');
                    window.albumData.otherAlbum.selectAlbum = data.id;
                    window.albumData.otherAlbum.newAlbum = data.name;
                }
                moveBtn(selectId);
            });
        }

        //創建專輯
        function createNewAlbum() {
            $('#album-move .album-move-box .album-create div').off('click');
            $('#album-move .album-move-box .album-create div').on('click', function () {
                var a = $('#album-move .album-move-box .album-create input').val().substring(0, 10);
                if (a.length == 0) return false;
                var html = '<li class="select" id="newCreateAlbum"><div class="collect-list-div"><img class="collect-list-div-img" src="/src/img/social/easylive/no-collect.png" alt=""><div class="img-number">0</div><div class="collect-select"><img src="/src/img/social/easylive/collect-select.png" alt=""></div></div><div class="collect-list-div">' + a + '</div></li>';
                $('#album-move .album-move-box .album-select ul li').each(function () {
                    $(this).removeClass('select');
                });
                if (window.albumData.otherAlbum.hasAddAlbum == false) {
                    $('#album-move .album-move-box .album-select ul').prepend(html);
                } else {
                    $('#newCreateAlbum .collect-list-div').eq(1).html(a);
                }
                $('#newCreateAlbum').data('data', {
                    id: 0,
                    name: a
                })
                albumSelectBind($('#newCreateAlbum'));
                window.albumData.otherAlbum.hasAddAlbum = true;
                window.albumData.otherAlbum.newAlbum = a;
                window.albumData.otherAlbum.selectAlbum = 0;
                moveBtn(selectId);
            });
        }

        //移動按鈕
        function moveBtn(selectId) {
            if (selectId.length == 0) {
                $('#album-move .move-btn')[0].flag = false;
            } else {
                $('#album-move .move-btn')[0].flag = true;
            }
            if ($('#album-move .move-btn')[0].flag && window.albumData.otherAlbum.selectAlbum != null) {
                $('#album-move .move-btn').css({
                    'background-color': '#E98900',
                    'cursor': 'pointer'
                });
                $('#album-move .move-btn').off('click');
                $('#album-move .move-btn').on('click', function () {
                    sendMoveAlbum();
                });
            } else {
                $('#album-move .move-btn').css({
                    'background-color': '#ccc',
                    'cursor': 'default'
                });
                $('#album-move .move-btn').off('click');
            }
        }

        //關閉窗口
        function closeBox() {
            $('#album-move .album-move-box .close-btn').off('click');
            $('#album-move .album-move-box .close-btn').on('click', function () {
                $('#album-move').css('display', 'none');
            });
        }

        //圖片居中
        function albumImgMiddle() {
            $('#album-move .album-move-box .move-list li').each(function () {
                imgOnMiddle($(this));
            });
        }

        //橫向滾動條
        function setWidth() {
            var len = $('#album-move .album-move-box .move-list li').length;
            var width = $('#album-move .album-move-box .move-list li').outerWidth(true);
            var itemMargin = parseInt($('#album-move .album-move-box .move-list li').eq(0).css('margin-right'));
            $('#album-move .album-move-box .move-list').css('width', (len * width) - itemMargin);
            len = null;
            width = null;
            itemMargin = null;
        }
    };
    //重置清空數據
    data.mineFunc.resetData = function (selectId, flag) {
        selectId.splice(0, selectId.length);
        data.mineFunc.bindNum(selectId.length);
        data.mineFunc.deletePhotos(selectId);
        data.mineFunc.albumMove(selectId);
        if (flag == true) {
            window.albumData.otherAlbum = {
                isFirst: true,
                isComplate: false,
                page: 0,
                size: 12,
                selectAlbum: null,
                newAlbum: null,
                hasAddAlbum: false
            }
            $('#other-album-inner').html('');
            $('#album-move .move-list').html('');
            $('#album-move .album-move-box .album-move-text-title span').html(selectId.length);
        }
        $.each(data.listdata, function (k, y) {
            y.page = 0;
            y.isFirst = true;
            y.isComplate = false;
        });
        getListData(data.listdata[data.selectIdx]); //重新請數據
    };
    //編輯專輯
    data.mineFunc.chagneAlbum = function () {
        var saveBtn = '<div id="contenteditable-save"><img src="/src/img/userspace/album/save-btn-con.png" alt="">保存</div>';
        var setBtn = '<div id="contenteditable-btn"><img src="/src/img/userspace/album/opeartion.png" alt="">設置</div>';
        set();
        var golbal = data.editorAlbum;

        //點擊設置
        function set() {
            $('#contenteditable-btn').off('click');
            $('#contenteditable-btn').on('click', function () {
                var userContent = golbal.albumInfo;
                golbal.newContent = cloneObject(golbal.albumInfo);
                var newContent = golbal.newContent;
                $(this).remove();
                $('.album-info .album-title').after(saveBtn);
                $('.album-title').css('border', '1px solid #ccc');
                $('.album-title-input').removeAttr('disabled');
                $('.album-title').append('<p class="count-num"><span>0</span>/<span>10</span></p>');
                $('.album-cover').append('<div class="change-album-cover"><div>更換封面</div></div>');
                $('.editor-bottom .album-info .album-classification').css('color', '#000');
                $('#selecter').css('border-color', '#ccc');
                $('#selecter img').css('display', 'inline-block');
                $('#album-change-shadow').css('display', 'block');
                $('#album-title-name').addClass('select');
                $('#album-title-name-show').removeClass('select');
                $('.editor-bottom .album-info .album-title p span:first-of-type').html($('#album-title-name').val().length);
                classSelect('on', newContent); //下拉選項卡
                textareaChange('on', newContent); //標題
                changeCover('on', newContent); //封面
                clickShadow(userContent, newContent);
                saveChange(userContent, newContent);
            });
        }

        //點擊保存
        function saveChange(userContent, newContent) {
            $('#contenteditable-save').off('click')
            $('#contenteditable-save').on('click', function () {
                var a = compareObj(userContent, newContent);
                if (a) {
                    changeAlbumInfo('save', newContent);
                    //保存并且取消
                } else {
                    //沒變，直接取消
                    restoreShadow();
                    $('#chagne-success-tips').fadeIn(500).delay(1000).fadeOut(500);
                }
                a = null;
            });
        }

        //點擊陰影
        function clickShadow(userContent, newContent) {
            $('#album-change-shadow').off('click');
            $('#change-post .cancel-sure').off('click');
            $('#change-post .sure-cancel').off('click');

            $('#album-change-shadow').on('click', function () {
                var a = compareObj(userContent, newContent);
                if (a) {
                    //保存并且取消
                    $('#change-post').css('display', 'block');
                    //不保存
                    $('#change-post .cancel-sure').on('click', function () {
                        cancelSave(userContent, newContent);
                        restoreShadow();
                        $('#change-post').css('display', 'none');
                        golbal.newContent = cloneObject(golbal.albumInfo);
                        newContent = cloneObject(userContent);
                    });
                    //保存
                    $('#change-post .sure-cancel').on('click', function () {
                        changeAlbumInfo('shadow', newContent);
                    });
                } else {
                    //沒變，直接取消
                    restoreShadow();
                }
                a = null;
            });
        }

        //發送請求更改專輯資料
        function changeAlbumInfo(state, newContent) {
            if (!window.albumData.isCanSubmit) return false;
            var newData = data.editorAlbum.newContent;
            var coverpictureurl = newData.albumCover;
            var thealbumname = encodeURIComponent(newData.albumTitle);
            var classId = newData.classId;
            var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/updateAlbumInfo.easy?coverpictureurl=' + coverpictureurl + '&thealbumname=' + thealbumname + '&classId=' + classId + '&id=' + postId + '&easybuyCallback=?';
            $.ajax({
                url: dataUrl,
                type: "get",
                async: true,
                dataType: 'jsonp',
                beforeSend: function () {
                    window.albumData.isCanSubmit = false;
                },
                success: function (data) {
                    window.albumData.isCanSubmit = true;
                    if (state == 'shadow') {
                        successTips();
                        restoreShadow();
                        $('#change-post').css('display', 'none');
                        userContent = cloneObject(newContent);
                    } else {
                        successTips();
                        restoreShadow();
                        userContent = cloneObject(newContent);
                    }
                }
            });
        }

        //回復原狀
        function restoreShadow() {
            $('#contenteditable-save').remove();
            $('.album-info .album-title').after(setBtn);
            $('.album-title').css('border', '1px solid #fff');
            $('#album-title-name').removeClass('select');
            $('#album-title-name-show').addClass('select');
            $('.editor-bottom .album-info .album-title p').remove();
            $('.editor-bottom .album-cover .change-album-cover').remove();
            $('.editor-bottom .album-info .album-classification').css('color', '#aaa');
            $('#selecter').css('border-color', 'transparent');
            $('#selecter img').css('display', 'none');
            $('#album-change-shadow').css('display', 'none');
            classSelect('off');
            textareaChange('off');
            changeCover('off');
            set();
        }

        //不保存
        function cancelSave(oldContent, newContent) {
            $('.editor-bottom .album-cover img').attr('src', 'http://wap.macaoeasybuy.com/' + oldContent.albumCover);
            $('#album-title-name').val(oldContent.albumTitle);
            $('#album-title-name-show').html(oldContent.albumTitle);
            $('#selecter span').html(oldContent.albumClass);
        }

        //下拉選項卡;
        function classSelect(state, newContent) {
            if (state == 'on') {
                golbal.isClass ? classChange() : requestClassList();
                return false;
            } else {
                offClassChange();
                return false;
            }

            function requestClassList() {
                var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/getAlbumClass.easy?easybuyCallback=?';
                $.ajax({
                    url: dataUrl,
                    type: "get",
                    async: true,
                    dataType: 'jsonp',
                    beforeSend: function () {
                        golbal.isClass = true;
                    },
                    success: function (data) {
                        var newData = data.albumClass;
                        $.each(newData, function (k, y) {
                            $('#class-select').append('<li>' + y.type + '</li>');
                        });
                        $('#class-select li').each(function (k) {
                            $(this).data('data', newData[k]);
                        });
                        classChange();
                    }
                });
            }

            function classChange() {
                offClassChange();
                $('#selecter').on('click', function () {
                    $('.classification-top ul').fadeToggle(150);
                    $('.classification-top .select-shadow').fadeToggle(1);
                });
                $('.classification-top .select-shadow').on('click', function () {
                    $(this).fadeToggle(1);
                    $('.classification-top ul').fadeToggle(150);
                });
                $('.classification-top ul li').on('click', function () {
                    var data = $(this).data('data');
                    newContent.classId = data.id;
                    newContent.albumClass = data.type;
                    var a = data.type;
                    $('#selecter span').html(a);
                    newContent.albumClass = a; //這裡修改了分類
                    a = null;
                    $('.classification-top ul').fadeToggle(150);
                    $('.classification-top .select-shadow').fadeToggle(1);
                });
                $('.editor-bottom .album-info .album-classification .classification-top div').css('cursor', 'pointer');
            }

            function offClassChange() {
                $('#selecter').off('click');
                $('.classification-top .select-shadow').off('click');
                $('.classification-top ul li').off('click');
                $('.editor-bottom .album-info .album-classification .classification-top div').css('cursor', 'default');
            }
        }

        //監聽標題的改變
        function textareaChange(state, newContent) {
            if (state == 'on') {
                $('#album-title-name').on('keyup', function () {
                    var res = $(this).val().substring(0, 10);
                    $('.editor-bottom .album-info .album-title p span:first-of-type').html(res.length);
                    newContent.albumTitle = res; //修改了標題
                    $('#album-title-name-show').html(res); //修改了標題
                });
            } else {
                $('#album-title-name').off('keyup');
            }
        }

        //更改封面
        function changeCover(state, newContent) {
            var golbal = window.albumData;
            if (state == 'on') {
                golbal.editorAlbum.isCover ? offEvent() : requestCover();
                bindCoverClick();
            } else {
                offEvent();
            }

            function requestCover() {
                var size = golbal.editorAlbum.cover.size;
                var page = golbal.editorAlbum.cover.page;
                var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/getAlbumPics.easy?id=' + postId + '&size=' + size + '&page=' + page + '&order=iscover&descOrAsc=desc&easybuyCallback=?';
                $.ajax({
                    url: dataUrl,
                    type: "get",
                    async: true,
                    dataType: 'jsonp',
                    beforeSend: function () {
                        coverScroll('off');
                        golbal.editorAlbum.isCover = true;
                        golbal.editorAlbum.cover.isFirst = false;
                        if (golbal.editorAlbum.cover.isComplate) return false;
                    },
                    success: function (data) {
                        data.page = golbal.editorAlbum.cover.page;
                        var html = template('cover-template', data);
                        $('#change-cover-innerbox .ul-inner').append(html);
                        $.each(data.albumPics, function (k, y) {
                            $('#' + y.id + 'coverId').data('data', y);
                        });
                        if (data.albumPics.length == golbal.editorAlbum.cover.size) {
                            coverScroll('on');
                        } else {
                            golbal.editorAlbum.cover.isComplate = true;
                            coverScroll('off');
                        }
                        golbal.editorAlbum.cover.page += 1;
                        offEvent();
                        bindCoverClick();
                    }
                });
            }

            function coverScroll(state) {
                if (state == 'on') {
                    var wheight = $('#change-cover-innerbox ul').height();
                    var bheight = $('#change-cover-innerbox .ul-inner').outerHeight(true);
                    $('#change-cover-innerbox ul').off('scroll');
                    $('#change-cover-innerbox ul').on('scroll', function () {
                        var wheight = $('#change-cover-innerbox ul').height();
                        var bheight = $('#change-cover-innerbox .ul-inner').outerHeight(true);
                        var wT = $(this).scrollTop();
                        if (wT + wheight >= bheight * 0.8) {
                            requestCover();
                        }
                    });
                } else {
                    $('#change-cover-innerbox ul').off('scroll');
                }
            }

            function bindCoverClick() {
                $('.editor-bottom .album-cover .change-album-cover').on('click', function () {
                    $('#change-cover-box').css('display', 'block');
                });
                $('#change-cover-box .cover-box-select .close-btn').on('click', function () {
                    $('#change-cover-box').css('display', 'none');
                });
                $('#change-cover-box .cover-box-select ul li').on('click', function () {
                    var data = $(this).data('data');
                    golbal.editorAlbum.newContent.albumCover = data.pic;
                    newContent.albumCover = data.pic;
                    var src = 'http://wap.macaoeasybuy.com/' + data.pic;
                    $('.editor-bottom .album-cover img').attr('src', src);
                    $('#change-cover-box').css('display', 'none');
                });
            }

            function offEvent() {
                $('.editor-bottom .album-cover .change-album-cover').off('click');
                $('#change-cover-box .cover-box-select .close-btn').off('click');
                $('#change-cover-box .cover-box-select ul li').off('click');
            }
        }

        //保存成功提示
        function successTips() {
            $('#chagne-success-tips').fadeIn(500).delay(1000).fadeOut(500);
            golbal.albumInfo = cloneObject(golbal.newContent);
        }

        //對比兩個對象的值
        function compareObj(a, b) {
            var as = '';
            var bs = '';
            for (var i in a) {
                as += a[i];
            }
            for (var j in b) {
                bs += b[j];
            }
            i = null;
            j = null;
            if (as === bs) {
                return false;
            } else {
                return true;
            }
        }
    };

    //看別人的選項排序
    function sortSelectOther() {
        var listdata = data.listdata;
        getListData(listdata[0])
        $('.describe-title-mine div').on('click', function () {
            if ($(this).hasClass('select')) return false;
            var idx = $(this).index();
            data.selectIdx = idx;
            if (listdata[idx].isFirst) getListData(listdata[idx]); //發出請求
            $('.album-lister').eq(idx).siblings('.album-lister').removeClass('select').end().addClass('select');
            $(this).siblings('div').removeClass('select').end().addClass('select');
        });
    }
    //看別人的採集
    data.otherFunc.albumCollect = function () {
        var collectList = Object.keys(data.collect); //回去全局變量
        if (collectList.length === 0) {
            $('#collect-btn').css({
                'background': '#aaa',
                'border-color': '#aaa',
                'cursor': 'normal'
            })
        } else {
            $('#collect-btn').css({
                'background': '#e98900',
                'border-color': '#e98900',
                'cursor': 'pointer'
            })
        }
    }
}()

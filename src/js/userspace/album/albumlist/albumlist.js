void function () {
  var getRequestURL = easyBuy.global.dep.getRequestURL;
  var easyScrollRequest = easyBuy.global.dep.easyScrollRequest;
  var maskClick = easyBuy.global.dep.maskClick;
  var deleteIntegral = 0;
  var requestObj = {
    selectArr: [],
    selectKey: 'uptime',
    size: 20,
    uptime: {
      page: 0,
      isComplete: false,
      isFirst: false,
      showBoxId: 'uptime'
    },
    backNums: {
      page: 0,
      isComplete: false,
      isFirst: false,
      showBoxId: 'backNums'
    },
    loveNums: {
      page: 0,
      isComplete: false,
      isFirst: false,
      showBoxId: 'loveNums'
    }
  };
  let userID = null;
  const SID = easyBuy.global.pageParameter.spaceid;
  const clock = setInterval(() => {
    if (easyBuy.easyUser.id !== undefined) {
      userID = easyBuy.easyUser.id;
      clearInterval(clock);
      userStatus();
    }
  }, 100);

  // function clickEvent() {
  //   const $c = $('.sort-box');
  //   $c.on('click', '.album-list', function () {
  //     const $e = $(this);
  //     const albumID = $e.attr('id').replace(/\D/gim, '');
  //     window.location.href = `http://userspace.macaoeasybuy.com/album/detail.html?spaceId=${SID}&albumId=${albumID}`;
  //   });
  // }
  // clickEvent();

  //判斷是自己看還是他人看
  function userStatus() {
    if (easyBuy.global.isSelf) {
      $('.mine-sort-menu').remove();
      deleteIntegraFunc(); //刪除帖子積分查詢（之後再執行其他函數)
      deletePostTips();
    } else {
      $('#album-delete').remove();
      $('#delete-post').remove();
      $('.sort-menu').remove();
      sortSelectOther();
    }
  }
  //刪除帖子積分查詢
  function deleteIntegraFunc() {
    $.getJSON('http://userspace1.macaoeasybuy.com/integralController/queryTopicIntegral.easy?type=releaseTheAlbum&easybuyCallback=?', function (data) {
      deleteIntegral = data.Integral;
      sortSelect();
    });
  }

  //看別人排序選擇
  function sortSelectOther() {
    getListdata();
    $('.mine-sort-menu>div').each(function (k) {
      $(this).on('click', function () {
        if ($(this).hasClass('select')) return false;
        //把上一個頁面勾選的去掉
        var type = requestObj.selectKey;
        var arr = requestObj.selectArr;
        $.each(arr, function (k, y) {
          $('#' + y + type).data('isSelect', false).removeClass('select');
        });

        var idx = $(this).index();
        $(this).siblings('div').removeClass('select').end().addClass('select');
        $('.sort-box').eq(k).siblings('.sort-box').removeClass('select').end().addClass('select');
        switch (idx) {
          case 0:
            requestObj.selectKey = 'uptime';
            break;
          case 1:
            requestObj.selectKey = 'backNums';
            break;
          case 2:
            requestObj.selectKey = 'loveNums';
            break;
        }
        type = requestObj.selectKey;
        if (requestObj[type].isFirst) {
          resetRequestFunc();
        } else if (!requestObj[type].isFirst && !requestObj[type].isComplete) {
          getListdata();
        }
        //刪除所有選中的帖子
        requestObj.selectArr.splice(0, requestObj.selectArr.length);
        getSelect([]);
      });
    });
  }

  //看自己選項卡切換
  function sortSelect() {
    var flag = true;
    var slideTime = 150;
    var page = 0;
    getListdata();
    $('.sort-menu-select-bottom div').each(function (k) {
      $(this).on('click', function () {
        //樣式切換
        var text = $(this).text();
        var src = $(this).find('img').attr('src');
        $('.sort-menu-select-top .sort-menu-text').html(text);
        $('.sort-menu-select-top .sort-menu-icon img').attr('src', src);
        hiddenMenu();
        if (page == k) {
          return false;
        } else {
          page = k;
          showPage(page);
          //切換
          switch (page) {
            case 0:
              requestObj.selectKey = 'uptime';
              break;
            case 1:
              requestObj.selectKey = 'backNums';
              break;
            case 2:
              requestObj.selectKey = 'loveNums';
              break;
          }
          type = requestObj.selectKey;
          if (requestObj[type].isFirst) {
            resetRequestFunc();
          } else if (!requestObj[type].isFirst && !requestObj[type].isComplete) {
            getListdata();
          }
          //刪除所有選中的帖子
          requestObj.selectArr.splice(0, requestObj.selectArr.length);
          getSelect([]);
        }
      });
    });
    $('.sort-menu-select-top').on('click', function () {
      $('.sort-menu-select-bottom').stop().slideToggle(slideTime);
      flag = !flag;
    });
    maskClick($('.sort-menu-select-bottom'), function () {
      hiddenMenu();
    }, 'sortMenu');

    function hiddenMenu() {
      $('.sort-menu-select-bottom').stop().slideUp(slideTime);
      flag = true;
    }

    function showPage(page) {
      $('.sort-box .sort-box-items').eq(page).siblings('.sort-box-items').removeClass('select');
      $('.sort-box .sort-box-items').eq(page).addClass('select');
    }
  }


  //獲取數據
  function getListdata() {
    var type = requestObj.selectKey;
    var size = requestObj.size;
    var page = requestObj[type].page;
    var isComplete = requestObj[type].isComplete;
    var boxId = '#' + requestObj[type].showBoxId;
    var order = type;
    var dataUrl = 'http://userspace1.macaoeasybuy.com/UserThealbumConntroller/queryUserTheAlbum.easy';
    dataUrl = getRequestURL({
      targetURL: dataUrl,
      requestData: {
        userId: userID,
        seeUserId: SID,
        size: size,
        page: page,
        order: order,
        descOrasc: 'desc'
      },
      encryptData: false
    });
    var postTemplate = easyBuy.global.template['post-template'];
    $.ajax({
      url: dataUrl,
      type: "get",
      async: true,
      dataType: 'jsonp',
      cache: !easyBuy.global.isSelf,
      beforeSend: function () {
        easyScrollRequest('off', 'listRequest', $(window));
        if (isComplete) return false;
        requestObj[type].isFirst = false;
      },
      success: function (data) {
        data.order = order;
        data.page = page;
        var newData = data.albumList.albumList;
        var len = newData.length;
        var html = template.render(postTemplate, data);
        page != 0 ? $(boxId + ' .content-box-class').append(html) : $(boxId + ' .content-box-class').html(html);
        requestObj[type].page++;
        if (len == size) {
          easyScrollRequest('on', 'listRequest', $(window), $(document), function () {
            getListdata();
          });
        } else {
          requestObj[type].isComplete = true;
          easyScrollRequest('off', 'listRequest', $(window));
        }
        if (len != size && (page != 0 || len != 0)) {
          $(boxId).find('.no-more').css('display', 'block');
        }
        if (data.albumList.isSelf == 1) {
          removeSelect(data); //如果是自己的帖子調用刪除帖子
        }
      }
    });
  }
  //選擇刪除辦定事件
  function removeSelect(data) {
    var dataList = data.albumList.albumList;
    $.each(dataList, function (k, y) {
      $('#' + y.id + data.order).data('data', y).data('isSelect', false).hover(function () {
        if (!$(this).data('isSelect')) {
          $(this).find('.hover-check-box-outer').css('display', 'block');
        }
      }, function () {
        if (!$(this).data('isSelect')) {
          $(this).find('.hover-check-box-outer').css('display', 'none');
        }
      }).find('.hover-check-box-outer').on('click', function () {
        var father = $(this).parents('.album-list');
        var id = father.data('data').id;
        if (!father.data('isSelect')) {
          //選擇
          father.data('isSelect', true);
          father.addClass('select');
          requestObj.selectArr.push(id);
        } else {
          //取消
          father.data('isSelect', false);
          father.removeClass('select');
          requestObj.selectArr.splice(requestObj.selectArr.indexOf(id), 1);
        }
        getSelect(requestObj.selectArr);
      });
    });
  }
  //顯示刪除的數目
  function getSelect(arr) {
    $('#album-delete span').html(arr.length);
    $('.cancel-tips-text span').html(arr.length);
    $('.cancel-tips-text-tips span.remove-num').html(arr.length);
    $('.cancel-tips-text-tips span.remove-num-math').html(arr.length * deleteIntegral);
    if (arr.length == 0) {
      $('#album-delete').css({
        'color': '#aaa',
        'cursor': 'default',
        'background-color': '#fff',
        'border-color': '#aaa'
      });
      $('#album-delete').find('img').attr('src', '/src/img/userspace/common/deletebtn.png');
      return false;
    } else {
      $('#album-delete').css({
        'color': '#fff',
        'cursor': 'pointer',
        'background-color': '#e98900',
        'border-color': '#e98900'
      });
      $('#album-delete').find('img').attr('src', '/src/img/userspace/common/deletebtn-s.png');
    }
  }
  //刪除帖子彈框辦定事件
  function deletePostTips() {
    $('#album-delete').on('click', function () {
      if (requestObj.selectArr.length == 0) return false;
      $('#delete-post').css('display', 'block');
    });

    $('#delete-post .cancel-sure').on('click', function () {
      $('#delete-post').css('display', 'none');
    });

    $('#delete-post .sure-cancel').on('click', function () {
      var arr = requestObj.selectArr;
      if (arr.length == 0) return false;
      var idStr = '';
      for (var i = 0; i < arr.length; i++) {
        if (i == arr.length - 1) {
          idStr += parseInt(arr[i]);
        } else {
          idStr += parseInt(arr[i]) + ',';
        }
      }
      $.getJSON('http://userspace1.macaoeasybuy.com/UserThealbumConntroller/deleteBatchUserAlbum.easy?idStr=' + idStr + '&userId=' + userId + '&integral=' + arr.length * window.deleteIntegral + '&easybuyCallback=?', function (data) {
        if (data.status == 'success') {
          $('#delete-post').css('display', 'none');
          //只要刪除數據的，其他盒子點過去的時候都要重新刷過
          requestObj.uptime.isFirst = true;
          requestObj.backNums.isFirst = true;
          requestObj.loveNums.isFirst = true;
          resetRequestFunc();
        }
      });
    });
  }
  //重置請求函數
  function resetRequestFunc() {
    var type = requestObj.selectKey;
    requestObj[type].page = 0;
    requestObj[type].isComplete = 0;
    requestObj[type].isFirst = true;
    getListdata();
  }
}()

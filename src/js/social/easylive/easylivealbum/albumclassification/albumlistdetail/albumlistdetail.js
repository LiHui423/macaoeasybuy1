void function () {
  const albumID = easyBuy.global.pageParameter.albumId;
  const m = easyBuy.global.dep;
  const $btn = $('.album-btn');
  const queryThealBumData = new YEZTemplateObj({
    targetURL: 'http://social1.macaoeasybuy.com/thealbumSocialConntroller/queryThealBumData.easy',
    parameters: {
      id: albumID,
    },
    templateID: 'albumInfo',
    container: '#swapper > #container',
    afterInsert: function (data) {
      templateProcessor([queryThealBumGroupData]);
      collectionBtn(queryThealBumGroupData.data.selectPic);
    }
  });
  const queryThealBumGroupData = new YEZTemplateObj({
    targetURL: 'http://social1.macaoeasybuy.com/thealbumSocialConntroller/queryThealBumGroupData.easy',
    parameters: {
      id: albumID,
      page: 0,
      size: 20
    },
    templateID: 'albumPicList',
    container: '.album-lister',
    data: {
      selectPic: {}
    },
    beforeGetData: function () {
      this.methods.lazyload && this.methods.lazyload(false);
    },
    afterInsert: function (data) {
      pictureSelector();
      if(data.data.length < this.requestData.parameters.size) {
        this.methods.lazyload = null
      } else {
        this.methods.lazyload(true);
        this.requestData.parameters.page++;
      }
    },
    methods: {
      lazyload: function (state) {
        state ?
          m.easyScrollRequest("on", "list", $(window), $(document), function () {
              templateProcessor([queryThealBumGroupData]);
          }) :
          m.easyScrollRequest("off", "list", $(window));
      }
    }
  });
  const pictureColloect = null;
  function pictureClick() {
    const $c = $('.picture-list');
    $c.on('click', '.picture-item', (e) => {
      const $e = m.getTarget(e.target, '.picture-item');
      const id = $e.attr('id');
      window.open('http://social.macaoeasybuy.com/easylive/easylivealbum/albumclassification/albumlistdetail/albumphotodetail/albumphotodetail.html?albumPhotoId=' + albumPhotoId);
    });
  }
  function changeSelectedCount(count) {
    $btn.children('span').html(count);
    count === 0 ? btn.addClass('cannot-select') : btn.removeClass('cannot-select');
  }


}()
easyBuy.global.beforeDataJs = function () {
  templateProcessor([queryThealBumData]);
};
function pictureSelector() {
    var itemArr = $('.page' + queryThealBumGroupData.requestData.parameters.page).children();
    var selectPic = queryThealBumGroupData.data.selectPic;
    itemArr.each(function () {
        var _this = $(this);
        var checkbox = _this.find('.hover-check-box');
        _this.data('PictureID', _this.attr('id'));
        checkbox.on('click' ,function () {
            if(Object.keys(selectPic).length <= 5 || selectPic[_this.data('PictureID')] !== undefined) {
                _this.toggleClass('yez-selected');
                if(selectPic[_this.data('PictureID')] !== undefined) {
                    delete selectPic[_this.data('PictureID')];
                } else {
                    selectPic[_this.data('PictureID')] = {
                        desc: _this.find('.shadow-box p').html(),
                        pic: _this.find('.img-container img').attr('src'),
                    };
                }
                changeSelectedCount(Object.keys(selectPic).length);
            }
        });
    });
}
function collectionBtn(selectPic) {
  var btn = $('.album-btn');  // 獲取採集按鈕
  btn.on('click', function () {
    if(Object.keys(selectPic).length > 0) {
      pcollector.open(selectPic);
    }
  });
}

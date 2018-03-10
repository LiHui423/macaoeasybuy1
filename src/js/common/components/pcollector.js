class PCollector {
  constructor({
    container = '.pcollector-container',
    btn = '#collect-btn',
    userId = null,
  }) {
    this.els = {
      $container: container instanceof jQuery ? container : $(container),
      $pictureList: null,
      $albumList: null,
      $closeBtn: null,
      $createBtn: null,
      $newAlbumNameInput: null,
      $collectBtn: null,
    };
    this.albumList = {
      targetURL: 'http://social1.macaoeasybuy.com/thealbumSocialConntroller/queryUserAlbums.easy',
      parameters: {
        page: 0,
        size: 8,
        order: 'uptime',
        descOrasc: 'desc',
        userId: easyBuy.easyUser.id
      },
      encryptData: true
    };
    this.uploadData = {
      userId: easyBuy.easyUser.id,
      userName: null,
      collects: [],
      ids: '',
      albumName: null,
      albumId: null,
    };
    this.init();
  }

  init() {
    this.insertPanel();
    this.setElements();
  }

  insertPanel() {
    $('head > link[rel="stylesheet"]:last').after('<link rel="stylesheet" href="/src/css/common/components/pcollector.css">');
    $(this.els.$container).load('/common/components/pcollector.html .pcollector-panel', () => {
      this.getAlbumList();
      this.bindEvent();
    });
  }

  setElements() {
    const $c = this.els.$container;
    this.els.$pictureList = $c.find('.picture-list');
    this.els.$albumList = $c.find('.album-list');
    this.els.$closeBtn = $c.find('.panel-close-btn');
    this.els.$createBtn = $c.find('.create-album button');
    this.els.$newAlbumNameInput = $c.find('.create-album input');
    this.els.$collectBtn = $c.find('.panel-footer button');
  }

  bindEvent() {
    console.log(this.els.$closeBtn);
    this.els.$closeBtn.on('click', () => {
      this.displayPanel(false);
    });
    this.els.$createBtn.on('click', () => {
      this.createNewAlbum();
    });
    this.els.$collectBtn.on('click', () => {
      this.collect();
    });
  }

  displayPanel(open) {
    if (open) {
      $($settings.panelContainer).css('display', 'block');
      $(document.body).css('overflow', 'hidden');
    } else {
      $($settings.panelContainer).css('display', 'none');
      $(document.body).css('overflow', 'auto');
    }
  }

  /**
   * @desc 獲取用戶已有專輯的數據
   * @param {function} callback 獲取數據成功後的回調函數
   */
  getAlbumList(callback) {
    $.ajax({
      method: 'GET',
      dataType: 'JSON',
      url: this.getRequestURL(this.albumList),
      // beforeSend: () => {
      //   this.lazyload && $methods.lazyload(false);
      // },
      success: ({result}) => {
        const page = this.albumList.parameters.page;
        const content = result;
        callback && callback({ page, content });
      }
    });
  }

  /**
   * @desc 插入用戶專輯列表
   */
  insertAlbumList() {
    const $c = this.els.$albumList;
    this.getAlbumList(({ page, content }) => {
      const html = this.generateAlbumItem(param);
      page === 0 ? $c.html(html) : $c.append(html);
      content.forEach(({ albumId, albumTitle }) => {
        const album = $c.children(`#${albumId}`);
        album.data('albumId', albumId);
        album.data('albumName', albumTitle);
        album.on('click', () => {
          this.albumSelected(album);
        });
      });
      this.changeSizeAlbum();
      if (content.length < this.albumList.parameters.size) {
          this.lazyload = null;
      } else {
        this.lazyload(true);
        this.albumList.parameters.page++;
      }
    })
  }

  /**
   * @desc 採集圖片
   */
  collect() {
    const collects = [];
    const ids = '';
    const userId = easyBuy.easyUser.id;
    const userName = easyBuy.easyUser.name;
    const $is = this.els.$pictureList.children();
    $is.each((i, el) => {
      const $el = $(el);
      const desc = $el.find('textarea').val() === '' ? $el.find('textarea').attr('placeholder') : $el.find('textarea').val();
      collects.push({ desc: desc, pic: '', id: $el.data('id') });
      (i !== $is.length - 1) ? (ud.ids += $(this).data('id') + ',') : (ud.ids += $(this).data('id'));
    });
    this.uploadData.collects
    const pass = !!uploadData.albumId && !!uploadData.albumName && !!uploadData.userId && !!uploadData.userName && uploadData.collects.length !== 0;
    pass ? this.requestData() : (!this.uploadData.albumId && alert('未選擇專輯'));
  }
  /**
   * @desc 插入圖片列表
   * @param {array} param 圖片數組
   */
  insertPictureList(param) {
    const $c = this.els.$pictureList;
    const htmlString = this.generatePictureListHTML(param);
    this.textAreaChange(false);
    $c.html(htmlString);
    $c.children().each((i, el) => {
      $(el).data('id', $(this).attr('id'));
      this.textAreaChange($(el).find('textarea'));
    });
  }

  /**
   * @desc 生成圖片列表的html代碼
   * @param {Array} list 圖片數組
   */
  generatePictureListHTML(list) {
    return Object.keys(list).reduce((string, pid) => {
      const desc = list[pid].desc !== undefined ? list[pid].desc : '';
      return htmlString +
        `<li class="picture-item" id="${pid}">
          <div class="item-img">
            <div class="img-container">
              <img class="e" src="//mbuy.oss-cn-hongkong.aliyuncs.com/${list[pid].pic}">
            </div>
          </div>
          <div class="item-content"><textarea class="scrollIe scrollOther" placeholder="${desc}"></textarea></div>
        </li>`;
    }, '');
  }

  /**
   * @desc 圖片描述修改
   * @param {jQuery|boolean} param JQ對象或者布爾值
   */
  textAreaChange(param) {
    if (param instanceof jQuery) {
      param.on('focus', () => {
        !param.val() && param.val(param.attr('placeholder'));
      });
      param.on('blur', () => {
        if (param.val() === param.attr('placeholder')) {
          param.val('');
        } else if (param.val() === '') {
          param.attr('placeholder', '');
        }
      })
    } else {
      const $tas = this.els.$pictureList.find('textarea');
      $tas.length !== 0 && $tas.each((i, el) => {
        $(el).off('focus');
        $(el).off('blur');
      })
    }
  }

  /**
   * @desc 創建新專輯
   * @param {string} newAlbumName 新專輯的名稱
   */
  createNewAlbum(newAlbumName) {
    const $c = this.els.$newAlbumNameInput;
    const $ac = this.els.$albumList;
    if (newAlbumName !== '') {
      $c.removeAttr('placeholder').val('');
      $ac.prepend(`<li class="album-item" data-total="0"><div class="img-container"></div><span>${newAlbumName}</span></li>`);
      const $newAlbum = $ac.children().eq(0);
      $newAlbum.data('albumName', newAlbumName);
      $newAlbum.data('albumId', -1);
      $newAlbum.on('click', () => {
        this.albumSelected($newAlbum);
      });
      this.albumSelected($newAlbum);
    } else {
      $c.attr('placeholder', '請輸入新專輯的名稱');
    }
  }

  /**
   * @desc 生成專輯列表的html代碼
   * @param {object} param 請求回的專輯數據
   */
  generateAlbumItem(param) {
    return param.data.reduce((itemString, {albumId, picCount, coverPic, albumTitle}) => {
      return itemString +
        `<li id="${albumId}" class="album-item" data-total="${picCount}">
          <div class="img-container">
            <img class="e" src="//mbuy.oss-cn-hongkong.aliyuncs.com/${coverPic}">
          </div>
          <span>${albumTitle}</span>
        </li>`;
    }, '');
  }

  /**
   * @desc 選中專輯
   * @param {object} album 專輯對象
   */
  albumSelected(album) {
    if (album.hasClass('yez-active')) {
        this.uploadData.albumId = undefined;
        this.uploadData.albumName = '';
    } else {
      this.uploadData.albumId = album.data('albumId');
      this.uploadData.albumName = album.data('albumName');
    }
    album.toggleClass('yez-active');
    album.siblings('.yez-active').toggleClass('yez-active');
    $('.active-album-name').html(`當前選中的專輯為：${this.uploadData.albumName}`);
  }

  /**
   * @desc 提交采集數據
   * @param {object} uploadData 數據對象
   */
  requestData(uploadData) {
    uploadData = JSON.stringify(uploadData);
    $.ajax({
      url: 'http://social1.macaoeasybuy.com/thealbumSocialConntroller/collectAlbum.easy?collects=' + uploadData + '&easybuyCallback=?',
      dataType: 'JSON',
      methods: 'GET',
      success: function (res) {
          console.log(res);
      },
      error: function (res) {
          console.log(res);
      },
    });
  }


  // 辅助函数

  changeSize() {
    $('.pcollector-container .picture-list img').each(function () {
      this.height > this.width && $(this).addClass('h');
      const img = $(this).attr('src');
      $(this).css('background-image', `url(${img})`).attr('src', '/src/img/common/pixel.png');
    })
  }

  changeSizeAlbum() {
    $('.pcollector-container .album-list img').each(function () {
      this.height > this.width && $(this).addClass('h');
      const img = $(this).attr('src');
      $(this).css('background-image', `url(${img})`).attr('src', '/src/img/common/pixel.png');
    })
  }

  lazyload(state) {
    const m = easyBuy.global.dep.easyScrollRequest;
    state
    ? m('on', 'al', $('.list-container'), $('.list-container > ul.album-list'), this.insertAlbumList)
    : m('off', 'al', $('.list-container'));
  }
  getRequestURL(paramObj) {
    const dataPass = paramObj.targetURL !== undefined && paramObj.targetURL !== '';
    if (dataPass) {
      const targetURL = paramObj.targetURL;
      const parameters = paramObj.parameters;
      const encryptData = paramObj.encryptData;
      let requestURL;
      let paramString = Object.keys(parameters).reduce(function (pre, paramName) {
        return `${pre + paramName}=${parameters[paramName]}&`;
      }, '');
      requestURL = targetURL + '?' + paramString + 'easybuyCallback=?';
      return requestURL;
    } else {
      return false;
    }
  }
}

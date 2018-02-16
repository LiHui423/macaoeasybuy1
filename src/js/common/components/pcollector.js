const pcollector = {
  initialized: false,
  data: {
      albumList: {
          targetURL: 'http://social1.macaoeasybuy.com/thealbumSocialConntroller/queryUserAlbums.easy',
          parameters: {
              page: 0,
              size: 8,
              order: 'uptime',
              descOrasc: 'desc',
              userId: undefined
          },
          encryptData: true
      },
      uploadData: {},
  },
  settings: {
      panelContainer: '.pcollector-container', //面板容器
      pictureListContainer: '.pcollector-container .picture-list', //圖片列表容器
      albumListContainer: '.pcollector-container .album-list', //專輯列表容器
      closeButton: '.panel-close-btn', //關閉按鈕
      createButton: '.create-album button', //創建新專輯按鈕
      newAlbumNameInput: '.create-album input', //新專輯名稱輸入框
      collectButton: '.panel-footer button', //採集按鈕
  },
  methods: {
      $el: undefined,
      $data: undefined,
      $settings: undefined,
      $methods: undefined,

      /**
       * @desc 插入面板HTML和CSS
       */
      insertHTML() {
          const $methods = this.$methods;
          $('head > link[rel="stylesheet"]:last').after('<link rel="stylesheet" href="/src/css/common/components/pcollector.min.css">');
          $('#pcollector').load('/page/common/components/pcollector.html .pcollector-panel');
          $methods.bindEvent();
      },

      bindEvent() {
          const $settings = this.$settings;
          const $methods = this.$methods;
          $($settings.closeButton).on('click', function () {
              $methods.displayPanel(false);
          });
          $($settings.createButton).on('click', function () {
              $methods.createNewAlbum($($settings.newAlbumNameInput).val());
          });
          $($settings.collectButton).on('click', function () {
              $methods.collect();
          })
      },

      /**
       * @desc 面板显示状态
       * @param {boolean} param 是否顯示面板
       */
      displayPanel(param) {
          const $settings = this.$settings;
          param ? $($settings.panelContainer).css('display', 'block') : $($settings.panelContainer).css('display', 'none');
      },

      /**
       * @desc 內部初始化
       */
      init() {
          this.insertHTML(); // 插入面板
          this.insertAlbumList(); // 插入用戶專輯列表
      },

      /**
       * @desc 打開面板
       * @param {array} param 圖片數組
       */
      open(param) {
          const $methods = this.methods;
          $methods.insertPictureList(param); // 插入圖片HTML
          $methods.changeSize();
          $methods.displayPanel(true); //顯示面板
      },

      changeSize() {
         $('.picture-list img').each(function() {
              this.height > this.width && $(this).addClass('h');
              const img = $(this).attr('src');
              $(this).css('background-image', `url(${img})`).attr('src', '/src/img/common/pixel.png');
         })
      },

      changeSizeAlbum() {
          $('.album-list img').each(function() {
              this.height > this.width && $(this).addClass('h');
              const img = $(this).attr('src');
              $(this).css('background-image', `url(${img})`).attr('src', '/src/img/common/pixel.png');
         })
      },

      /**
       * @desc 採集圖片
       */
      collect() {
          const $settings = this.$settings;
          let uploadData = this.$data.uploadData;
          const $methods = this.$methods;
          uploadData.collects = [];
          uploadData.ids = '';
          const pl = $($settings.pictureListContainer).children();
          pl.each(function (index) {
              const desc = $(this).find('textarea').val() === '' ? $(this).find('textarea').attr('placeholder') : $(this).find('textarea').val();
              uploadData.collects.push({
                  desc: desc,
                  pic: '',
                  id: $(this).data('id'),
              });
              (index !== pl.length - 1) ? (uploadData.ids += $(this).data('id') + ',') : (uploadData.ids += $(this).data('id'));
          });
          uploadData.userId = easyBuy.easyUser.id;
          uploadData.userName = easyBuy.easyUser.name;
          const pass = !!uploadData.albumId && !!uploadData.albumName && !!uploadData.userId && !!uploadData.userName && uploadData.collects.length !== 0;
          if (pass) {
              $methods.requestData(uploadData);
          } else {
              !uploadData.albumId && alert('未選擇專輯');
              // !uploadData.userId && window.open(''); 跳轉到登錄頁
          }
      },

      /**
       * @desc 提交數據
       * @param {object} param 數據對象
       */
      requestData(param) {
          const $methods = this.$methods;
          $.ajax({
              url: 'http://social1.macaoeasybuy.com/thealbumSocialConntroller/collectAlbum.easy?collects=' + JSON.stringify(param) + '&easybuyCallback=?',
              dataType: 'JSON',
              methods: 'GET',
              success: function (res) {
                  console.log(res);
              },
              error: function (res) {
                  console.log(res);
              },
          });
      },

      /**
       * @desc 創建新專輯
       * @param {string} newAlbumName 新專輯的名稱
       */
      createNewAlbum(newAlbumName) {
          const $settings = this.$settings,
              $methods = this.$methods;
          const input = $($settings.newAlbumNameInput);
          if (!!newAlbumName) {
              input.removeAttr('placeholder').val('');
              $($settings.albumListContainer).prepend(`<li class="album-item" data-total="0"><div class="img-container"></div><span>${newAlbumName}</span></li>`);
              const newAlbum = $($settings.albumListContainer).children().eq(0);
              newAlbum.data('albumName', newAlbumName);
              newAlbum.data('albumId', -1);
              newAlbum.on('click', function () {
                  $methods.albumSelected($(this));
              });
              $methods.albumSelected(newAlbum);
          } else {
              input.attr('placeholder', '請輸入新專輯的名稱');
          }
      },

      /**
       * @desc 選中專輯
       * @param {object} album 專輯對象
       */
      albumSelected(album) {
          const uploadData = this.$data.uploadData;
          if (album.hasClass('yez-active')) {
              uploadData.albumId = undefined;
              uploadData.albumName = '';
          } else {
              uploadData.albumId = album.data('albumId');
              uploadData.albumName = album.data('albumName');
          }
          album.toggleClass('yez-active');
          album.siblings('.yez-active').toggleClass('yez-active');
          $('.active-album-name').html(`當前選中的專輯為：${uploadData.albumName}`);
      },

      /**
       * @desc 插入圖片列表
       * @param {array} param 圖片數組
       */
      insertPictureList(param) {
          const $settings = this.$settings,
              $methods = this.$methods;
          const container = $($settings.pictureListContainer);
          $methods.textAreaChange(false);
          const htmlString = $methods.generatePictureListHTML(param);
          container.html(htmlString);
          container.children().each(function () {
              $(this).data('id', $(this).attr('id'));
              $methods.textAreaChange($(this).find('textarea'));
          });
      },

      /**
       * @desc 圖片描述修改
       * @param {object|boolean} param JQ對象或者布爾值
       */
      textAreaChange(param) {
          const $settings = this.$settings;
          if (typeof param === 'object') {
              param.on('focus', function () {
                  !$(this).val() && $(this).val(param.attr('placeholder'));
              });
              param.on('blur', function () {
                  if ($(this).val() === param.attr('placeholder')) {
                      $(this).val('');
                  } else if ($(this).val() === '') {
                      $(this).attr('placeholder', '');
                  }
              })
          } else {
              const item = $($settings.pictureListContainer).find('textarea');
              item.length !== 0 && item.each(function () {
                  $(this).off('focus');
                  $(this).off('blur');
              })
          }
      },

      /**
       * @desc 生成圖片列表的html代碼
       * @param {array} param 圖片數組
       */
      generatePictureListHTML(param) {
          const idArr = Object.keys(param);
          return idArr.reduce(function (htmlString, pictureID) {
              const p = param[pictureID].desc !== undefined ? param[pictureID].desc : ''
              return htmlString + `<li class="picture-item" id="${pictureID}"><div class="item-img"><div class="img-container"><img class="e" src="//mbuy.oss-cn-hongkong.aliyuncs.com/${param[pictureID].pic}"></div></div><div class="item-content"><textarea class="scrollIe scrollOther" placeholder="${p}"></textarea></div></li>`
          }, '');
      },

      /**
       * @desc 生成專輯列表的html代碼
       * @param {object} param 請求回的專輯數據
       */
      generateAlbumItem(param) {
          return param.data.reduce(function (itemString, item) {
              return itemString + `<li id="${item['albumId']}" class="album-item" data-total="${item['picCount']}"><div class="img-container"><img class="e" src="//mbuy.oss-cn-hongkong.aliyuncs.com/${item['coverPic']}"></div><span>${item['albumTitle']}</span></li>`;
          }, '');
      },

      /**
       * @desc 獲取用戶已有專輯的數據
       * @param {function} callback 獲取數據成功後的回調函數
       */
      getAlbumList(callback) {
          const $methods = this.$methods,
              $data = this.$data;
          $.ajax({
              method: 'GET',
              dataType: 'JSON',
              url: $methods.getRequestURL($data.albumList),
              beforeSend() {
                  $methods.lazyload && $methods.lazyload(false);
              },
              success(res) {
                  const data = {
                      page: $data.albumList.parameters.page,
                      data: res['result']
                  };
                  callback && callback(data);
              }
          });
      },

      /**
       * @desc 插入用戶專輯列表
       */
      insertAlbumList() {
          const $methods = this.$methods,
              $settings = this.$settings,
              $data = this.$data;
          const container = $($settings.albumListContainer);
          $methods.getAlbumList(function (param) {
              param.page === 0 ?
                  (container.html($methods.generateAlbumItem(param))) :
                  (container.append($methods.generateAlbumItem(param)));
              $.each(param.data, function () {
                  const album = container.children(`#${this.albumId}`);
                  album.data('albumId', this.albumId);
                  album.data('albumName', this.albumTitle);
                  album.on('click', function () {
                      $methods.albumSelected(album);
                  })
              });
              $methods.changeSizeAlbum();
              if (param.data.length < $data.albumList.parameters.size) {
                  $methods.lazyload = null;
              } else {
                  $methods.lazyload(true);
                  $data.albumList.parameters.page++;
              }
          })
      },
      lazyload(state) {
          const $methods = this.$methods;
          state ?
              easyBuy.global.dep.easyScrollRequest('on', 'al', $('.list-container'), $('.list-container > ul.album-list'), function () {
                  $methods.insertAlbumList();
              }) :
              easyBuy.global.dep.easyScrollRequest('off', 'al', $('.list-container'));

      },
      getRequestURL(paramObj) {
          const dataPass = paramObj.targetURL !== undefined && paramObj.targetURL !== '';
          if (dataPass) {
              const targetURL = paramObj.targetURL,
                  parameters = paramObj.parameters,
                  encryptData = paramObj.encryptData;
              let requestURL;
              const paramNameArr = Object.keys(parameters),
                  paramString = paramNameArr.reduce(function (pre, paramName) {
                      return pre + paramName + '=' + parameters[paramName] + '&';
                  }, '');
              requestURL = targetURL + '?' + paramString + 'easybuyCallback=?';
              return requestURL;
          } else {
              return false;
          }
      },
  },

  /**
   * @desc 初始化
   */
  initialize() {
      const setEl = () => this,
          setData = () => this.data,
          setSettings = () => this.settings,
          setMethods = () => this.methods;
      this.methods.$el = setEl();
      this.methods.$data = setData();
      this.methods.$settings = setSettings();
      this.methods.$methods = setMethods();
      this.data.albumList.parameters.userId = easyBuy.easyUser.id;
      this.methods.init();
  },

  /**
   * @desc 打開面板
   * @param {array} param 圖片數組
   */
  open(param) {
      !this.initialized && this.initialize() && (this.initialized = !this.initialized);
      this.open = this.methods.open;
      this.open(param);
  }
};

const e = new Easybuy({
  data: {
    isSelf: null,
    elements: {
      spaceNav: document.querySelector('#space-nav'),
      control: document.querySelector('#left-menu'),
      userInfo: document.querySelector('#user-info'),
      newsPush: document.querySelector('#news-push'),
      content: document.querySelector('.userspace-content'),
    },
    spaceNavIndex: 0,
  },
  methods: {
    initUserSpace() {
      const seeUserId = this.data.search.spaceId;
      const userId = this.data.userInfo.id;
      this.data.isSelf = seeUserId === this.data.userInfo.id;
    },
    insertSpaceInfo() {
      const userId = this.data.userInfo.id;
      const seeUserId = this.data.search.spaceId;
      this.ajax({
        api: 'http://userspace1.macaoeasybuy.com/userSpaceIndexController/queryUserSpaceInfo.easy',
        params: {
          userId,
          seeUserId,
        },
        after: ({ data }) => {
          this.data.spaceInfo = data['userInfo'];
          const ts = this.data.template['userInfo'];
          this.data.elements.userInfo.innerHTML = template.render(ts, this.data.spaceInfo);
          const style = `body{background-image: url("//wallpapers.wallhaven.cc/wallpapers/full/wallhaven-611538.jpg");}.userinfo-panel{background-image: url(//img.macaoeasybuy.com/img/userspace/common/userin_1.png);}`;
          $('head > link[rel="stylesheet"]:last').after(
            `<style>${style}</style>`
          );
        }
      });
    },
    insertControl() {
      const ts = this.data.template['leftmenu'];
      this.data.elements.control.innerHTML = template.render(ts);
    },
    insertSpaceNav() {
      const container = this.data.elements.spaceNav;
      const ts = this.data.template['whitemenu'];
      const userId = this.data.userInfo.id;
      const seeUserId = this.data.search.spaceId;
      this.ajax({
        api: 'http://userspace1.macaoeasybuy.com/userSpaceIndexController/userSpaceInfoCount.easy',
        params: {
          userId,
          seeUserId,
        },
        after: ({ data }) => {
          data['userSpaceCount'].self = this.data.isSelf;
          container.innerHTML = template.render(ts, data['userSpaceCount']);
          const type = container.children[0].getAttribute('data-space-type');
          container.setAttribute('data-active', 0);
          $(this.data.elements.content).attr('data-type', type);
          this.bindSpaceNavClick(container);
        }
      });
    },
    insertNewPush() {
      const ts = this.data.template['newspush'];
      this.data.elements.newsPush.innerHTML = template.render(ts);
    },
    resetData() {
      $(this.data.elements.content).empty();
      this.data.dynamic = null;
    },
    bindSpaceNavClick(elements) {
      const $el = $(elements);
      $el.on('click', 'li', (e) => {
        this.resetData();
        const $e = e.target.tagName === 'LI' ? $(e.target) : $(e.target).parent();
        const index = $e.index();
        const type = $e.attr('data-space-type');
        $el.attr('data-active', index);
        $(this.data.elements.content).attr('data-type', type);
        window.location.href = `http://userspace.macaoeasybuy.com/${type}/index.html`;
      });
    },
    userInfoBindClickPoint(followed, isSelf) {
      const $followsShow = $('#follows-show');
      if (followed) {
        $('#follows-btn').append('<div id="cancel-follows-btn">取消關注</div>');
        const $cancelFollowsBtn = $('#cancel-follows-btn');
        $cancelFollowsBtn[0].isClick = false;
        Effect.maskClick($followsShow, function() {
          $cancelFollowsBtn.slideUp(200);
        });
        $followsShow.off('click');
        $followsShow.on('click', function() {
          $(this)
            .siblings('div')
            .stop()
            .slideToggle(200);
        });
        $cancelFollowsBtn.off('click');
        $cancelFollowsBtn.on('click', function() {
          $('#user-info-focus-box').css('display', 'block');
        });
        $('#user-info-focus-box .cancel-sure').on('click', function() {
          $('#user-info-focus-box').css('display', 'none');
        });
        $('#user-info-focus-box .sure-cancel').on('click', function() {
          if ($cancelFollowsBtn[0].isClick) return false;
          $cancelFollowsBtn[0].isClick = true;
          userInfoBindoffClickPoint($cancelFollowsBtn, isSelf);
        });
      } else {
        $followsShow.off('click');
        $followsShow.on('click', function() {
          const $this = $(this);
          if ($this[0].isClick) {
            return false;
          }
          $this[0].isClick = true;
          userInfoBindonClickPoint($this, isSelf);
        });
      }
    },
    userInfoBindonClickPoint(self, isSelf) {
      var ipurl = 'http://userspace1.macaoeasybuy.com/';
      var easyUrl = 'http://userspace1.macaoeasybuy.com/';
      var dataUrl =
        easyUrl +
        'userFriendsConntroller/addFriend.easy?userId=' +
        userId +
        '&attentionId=' +
        seeUserId +
        '&easybuyCallback=?';
      $.getJSON(dataUrl, function(data) {
        if (data.result != 'success') return false;
        self.html('已關注對方');
        userInfoBindClickPoint('off', isSelf);
        self[0].isClick = false;
        if ($('#user-info-success').css('display') == 'none')
          $('#user-info-success')
            .fadeIn(500)
            .delay(1000)
            .fadeOut(500);
        if (isSelf == 0) {
          if (fn) fn('point');
        }
      });
    },
    userInfoBindoffClickPoint(self, isSelf) {
      var ipurl = 'http://userspace1.macaoeasybuy.com/';
      var easyUrl = 'http://userspace1.macaoeasybuy.com/';
      var dataUrl =
        easyUrl +
        'userFriendsConntroller/removeFriend.easy?userId=' +
        userId +
        '&attentionId=' +
        seeUserId +
        '&easybuyCallback=?';
      $.getJSON(dataUrl, function(data) {
        if (data.fan != 'success') return false;
        $('#follows-btn span').html('關注');
        setTimeout(function() {
          self.remove();
        }, 200);
        userInfoBindClickPoint('on', isSelf);
        self[0].isClick = false;
        $('#user-info-focus-box').css('display', 'none');
        if (isSelf == 0) {
          if (fn) fn('cancel');
        }
      });
    },
    getTarget(event, selector) {
      const $e = $(event.target);
      return $e.hasClass(selector.substring(1)) ? $e : $e.parents(selector);
    },
    // 动态
    dynamic() {
      const easybuy = this;
      const userId = this.data.userInfo.id;
      const seeUserId = this.data.search.spaceId;
      let dynamicData = null;  // this.data.dynamic
      const methods = {
        initData() {
          dynamicData = {
            api: [
              'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicRelease.easy',
              'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicAlbum.easy',
              'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicSuitableLife.easy',
              'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicSentVolunteers.easy',
              'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicUsed.easy',
              'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicFair.easy',
            ],
            active: {
              api: '',
              params: {
                page: 0,
                size: 8,
                descOrAsc: 'desc',
                order: 'uptime',
                userId: easybuy.data.userInfo.id,
              },
            },
            status: [],
            dynamicType: 0,
            sortOrder: 0,
            container: easybuy.data.elements.content,
            list: null,
          };
          easybuy.data.dynamic = dynamicData;
        },
        htmlInsert() {
          dynamicData.container.innerHTML = easybuy.data.template['dynamic'];
          dynamicData.news = [].slice.call(dynamicData.container.querySelectorAll('.tab-info .info-news'));
          this.getNewsCount();
        },
        getNewsCount() {
          easybuy.ajax({
            api: 'http://userspace1.macaoeasybuy.com/userDynamicController/queryDynamicCount.easy',
            params: {
              userId,
            },
            after: ({ data }) => {
              function tips(key) {
                const count = data['result'][key];
                return count === 0 ? '暫無新發佈' : `有${count}篇新發佈`;
              }
              dynamicData.news[0].innerHTML = tips('releaseCount');
              dynamicData.news[1].innerHTML = tips('albumCount');
              dynamicData.news[2].innerHTML = tips('suitableLifeCount');
              dynamicData.news[3].innerHTML = tips('sentVolunteersCount');
              dynamicData.news[4].innerHTML = tips('usedCount');
              dynamicData.news[5].innerHTML = tips('fairCount');
            },
          })
        },
        updateClickTime(type) {
          easybuy.ajax({
            api: 'http://userspace1.macaoeasybuy.com/userDynamicController/updateClickTime.easy',
            params: {
              type,
              userId,
            },
            after: ({ data }) => {
              dynamicData.lastClickTime = data.result;
              dynamicData.active.params.lastClickTime = data.result;
              this.requestData({index:type});
            },
          })
        },
        typeTabsClickEvent(index) {
          dynamicData.active.api = dynamicData.api[index];
          this.dynamicReset();
          this.changeSortTab(0, false); // 會跳到第一個排序選項卡
          this.updateClickTime(index);
        },
        changeSortTab(index, click = true) {
          const order = ['uptime', 'commentNums', 'loveNums'];
          const activeIndex = dynamicData.sortOrder;
          click && this.statusBackup(activeIndex);
          $('.sort-order-tabs').attr('data-active', index);
          dynamicData.sortOrder = index;
          this.setContainer(index);
          if (dynamicData.status[index] !== undefined) {
            this.statusRecover(index);
            return;
          }
          dynamicData.active.params.page = 0;
          dynamicData.active.params.order = order[index];
          click && this.requestData({index:dynamicData.dynamicType});
        },
        setContainer(index) {
          const $c = $('.dynamic-content');
          dynamicData.list = $c.children().eq(index);
          $c.attr('data-active', index);
        },
        bindTabsClick() {
          const $typeTabs = $('.dynamic-type-tabs');
          const $sortTabs = $('.sort-order-tabs');
          $typeTabs.on('click', '.tab' , (event) => {
            const $e = easybuy.getTarget(event, '.tab');
            const activeIndex = dynamicData.dynamicType;
            const targetIndex = $e.index();
            if (targetIndex !== activeIndex) {
              $typeTabs.attr('data-active', targetIndex);
              dynamicData.dynamicType = targetIndex;
              this.typeTabsClickEvent(targetIndex);
            }
          });
          $sortTabs.on('click', '.tab', (event) => {
            const $e = $(event.target);
            const activeIndex = dynamicData.sortOrder;
            const targetIndex = $e.index();
            if (activeIndex !== targetIndex) {
              this.changeSortTab(targetIndex);
            }
          });
        },
        statusBackup(index) {
          dynamicData.status[index] = JSON.stringify(dynamicData.active.params);
        },
        statusRecover(index) {
          const backup = dynamicData.status[index];
          dynamicData.active.params = JSON.parse(backup);
        },
        dynamicReset() {
          dynamicData.active.params.page = 0;
          dynamicData.active.params.order = 'uptime';
          dynamicData.status = [];
          $('.sort-box').each(() => {
            $(this).empty();
          });
        },
        requestData({ index }) {
          const tid = ['dynamic-daily', 'dynamic-album', 'dynamic-life', 'dynamic-buy', 'dynamic-used', 'dynamic-fair'];
          const options = {
            api: dynamicData.active.api,
            params: dynamicData.active.params,
            container: dynamicData.list,
            templateString: easybuy.data.template[tid[index]],
            waterfall: {
              column: 4,
            },
            scrolloading: {
              callbackfn:() => {
                this.requestData({ index });
              },
            },
          };
          easybuy.templateRender(options);
        },
      };
      methods.initData();
      methods.htmlInsert();
      methods.bindTabsClick();
      dynamicData.active.api = dynamicData.api[0];
      methods.setContainer(0);
      methods.updateClickTime(0);
    },
  },
  uiBack() {
    this.initUserSpace();
    this.insertSpaceInfo();
    this.insertSpaceNav();
    this.data.isSelf && this.dynamic();
  },
  after() {
    this.insertControl();
    this.insertNewPush();
  }
});

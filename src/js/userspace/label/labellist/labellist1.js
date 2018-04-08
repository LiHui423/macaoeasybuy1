new Vue({
  el: '#userspace-content',
  components: {
    'CreatedLabel': {
      props: ['data'],
      computed: {
        hasTopic() {
          return this.topic.length === 0 || this.topic[0] == null;
        },
        topic() {
          return this.data.postList;
        },
        style() {
          return `top: ${this.data.top}px; left: ${this.data.left}px; position: absolute; visibility: visible;`;
        }
      },
      methods: {
        topicClass(type) {
          return type ? 'label-none' : 'label-master';
        },
        topicIMG(type) {
          return type ? '/src/img/userspace/label/post-num.png' : '/src/img/userspace/label/label-master.png';
        },
      },
      template: [
        '<div class="label-item" :data-id="data.labelId" :style="style">',
          `<div class="label-picture" v-if="data.labelPic"><img :src="'//wap.macaoeasybuy.com' + data.labelPic"></div>`,
          '<div class="label-describe">',
            '<div class="label-name"><a><span id="underline" style="color:#e98900">{{ data.labelName }}</span></a></div>',
            '<div class="label-create-time"><img src="/src/img/social/label/labelranklist/clock.png">{{ data.uptime }}前創建於<span>{{ data.labelType }}</span></div>',
            '<div class="label-article"><div>關於<span>{{ data.labelName }}</span></div><p>{{ data.labelDesc }}</p></div>',
            '<div class="label-num clearfloat">',
              '<div><img src="/src/img/common/eye.png">{{ data.seeCount }}宜粉查看過</div>',
              '<div><img src="/src/img/common/good.png">{{ data.loveCount }}宜粉讃好</div>',
            '</div>',
            '<div class="label-post"><div>該標籤精彩帖子</div>',
              '<ul>',
                '<li v-if="hasTopic" class="label-none"><img src="/src/img/userspace/label/post-num.png">沒有帖子使用該標籤哦，您要搶先？</li>',
                `<li v-else v-for="li in data.postList" :class="topicClass(li.type)">
                  <img :src="topicIMG(li.type)">{{ li.postContent }}
                </li>`,
              '</ul></div></div></div>',
      ].join(''),
    },
    'UsedLabel': {
      props: ['data'],
      computed: {
        style() {
          return `top: ${this.data.top}px; left: ${this.data.left}px; position: absolute; visibility: visible;`;
        },
      },
      methods: {
        gender(sex) {
          let setClass = '';
          if (sex === 'Girl') {
              setClass = 'sex-female';
          } else if (sex === 'Boy') {
              setClass = 'sex-male'
          }
          return '<i class="e-icon ' + setClass + '"></i>';
        },
      },
      template: [
        '<div class="post-item" :style="style">',
        `<div class="post-picture"><img :src="'//wap.macaoeasybuy.com' + data.postPics[0]"></div>`,
        '<div class="post-content"><div class="title clearfloat">',
        `<div class="head"><img :src="'//wap.macaoeasybuy.com' + data.postuserpic"></div>`,
        '<div class="post-state"><div class="post-title">{{ data.postName }}</div>',
        '<div class="post-time-state"><img src="/src/img/social/label/labelranklist/clock.png">',
        '<span class="time">{{ data.uptime }}</span>前發佈於<span class="state">{{ data.postState }}</span>',
        '</div></div></div><div class="article">{{ data.postContent }}</div>',
        '<ul class="post-num clearfloat">',
          '<li><img src="/src/img/common/eye.png">{{ data.postSeeNumber }}</li>',
          '<li><img src="/src/img/common/message.png" alt="">{{ data.replyCount }}</li>',
          '<li><img src="/src/img/common/good.png">{{ data.postLoveNumber }}</li></ul>',
        '<div class="post-label"><img src="/src/img/userspace/label/arrow-g.png" class="arrow">',
        '<ul><li v-for="label in data.labels"><div class="post-use-label">{{ label.labelName }}</div><div class="clearfloat">',
        `<div class="post-use-head"><img :src="'//wap.macaoeasybuy.com' + label.labeluserpic"></div>`,
        '<div class="post-use-name-from"><div class="post-use-name" v-html="label.labeluserName + gender(label.labelusersex)"></div>',
        '<div class="post-use-from">創建該標籤於<span>#熱點#</span></div></div></div></li></ul></div></div></div>',
      ].join(''),
    },
  },
  data() {
    return {
      isSelf: null,
      userInfo: null,
      spaceID: null,
      labelPrevCount: {},
      userUsedLabelCount: {},
      userSpaceLabel: null,
      orderNumber: 0,
      type: 0,
      can: {},  // 能加载为1, 不能为0
      search: {
        match: 1,
        name: '',
        type: 0,
        size: 10,
        order: 'addtime',
        descOrAsc: 'desc',
      },
      searchRsult: [],
      cache: {
        '00': [],
        '01': [],
        '10': [],
        '11': [],
        '20': [],
        '21': [],
        '30': [],
        '31': [],
        '40': [],
        '41': [],
        '50': [],
        '51': [],
      },
      heightStatus: {
        '00': [0, 0],
        '01': [0, 0],
        '10': [0, 0],
        '11': [0, 0],
        '20': [0, 0],
        '21': [0, 0],
        '30': [0, 0],
        '31': [0, 0],
        '40': [0, 0],
        '41': [0, 0],
        '50': [0, 0],
        '51': [0, 0],
      },
      activeList: [],
      itemStyle: 'CreatedLabel',
      panelShow: false,
    };
  },
  computed: {
    order() {
      if (this.orderNumber === 0) {
        return 'uptime';
      }
      if (this.orderNumber === 1) {
        return this.type ? 'postLoveNumber' : 'loveCount';
      }
    },
    createdTagText() {
      const call = this.isSelf ? '我' : '佢';
      return `${call}の標籤(${this.labelPrevCount.labelCount})`;
    },
    usedTagText() {
      if (this.type === 2) {
        return this.dailyCount;
      }
      if (this.type === 3) {
        return this.lifeCount;
      }
      if (this.type === 4) {
        return this.buyCount;
      }
      if (this.type === 5) {
        return this.usedCount;
      }
      return this.usedAllCount;
    },
    usedAllCount() {
      const call = this.isSelf ? '我' : '佢';
      return `${call}用過の標籤(${this.labelPrevCount.usedLabelCount})`;
    },
    dailyCount() {
      return `日誌(${this.userUsedLabelCount.diaryCount})`;
    },
    lifeCount() {
      return `生活圈(${this.userUsedLabelCount.lifeCount})`;
    },
    buyCount() {
      return `败家誌(${this.userUsedLabelCount.sentVolunteerCount})`;
    },
    usedCount() {
      return `二手(${this.userUsedLabelCount.usedCount})`;
    },
    page() {
      return this.activeList.length ? this.activeList.length / 10 + 1 : 0;
    },
    activeIndex() {
      return this.type + '' + this.orderNumber;
    },
  },
  methods: {
    showPanel() {
      this.panelShow = !this.panelShow;
    },
    queryLabelPrevCount() {
      const api = 'http://userspace1.macaoeasybuy.com/UserLabelConntroller/queryLabelPrevCount.easy';
      const url = `${api}?userId=${this.spaceID}&easybuyCallback=?`;
      $.ajax({
        url,
        dataType: 'JSONP',
        success: (res) => {
          this.labelPrevCount = res.result;
        },
      });
    },
    queryUserUsedLabelCount() {
      const api = 'http://social1.macaoeasybuy.com/SolrLabelsController/QueryUserUsedLabelCount.easy';
      const url = `${api}?userId=${this.spaceID}&easybuyCallback=?`;
      $.ajax({
        url,
        dataType: 'JSONP',
        success: (res) => {
          this.userUsedLabelCount = res.result;
        },
      })
    },
    queryUserSpaceLabel() {
      const api = 'http://social1.macaoeasybuy.com/SolrLabelsController/queryUserSpaceLabel.easy';
      const url = `${api}?userId=${this.spaceID}&page=${this.page}&size=10&order=${this.order}&easybuyCallback=?`;
      this.requestData({
        url,
        after: (res, activeIndex) => {
          this.cache[activeIndex].push(...res.result);
        }
      });
    },
    queryUserSpaceUsedLabel() {
      const api = 'http://social1.macaoeasybuy.com/SolrLabelsController/queryUserSpaceUsedLabel.easy';
      const url = `${api}?userId=${this.spaceID}&size=10&type=${this.type - 1}&page=${this.page}&order=${this.order}&easybuyCallback=?`;
      this.requestData({
        url,
        after: (res, activeIndex) => {
          this.cache[activeIndex].push(...res.result);
        },
      });
    },
    queryLabelForUserSpace() {
      const api ='http://social1.macaoeasybuy.com/SolrLabelsController/QueryLabelForUserSpace.easy';
      // const url
    },
    init() {
      const clock = setInterval(() => {
        if (easyBuy.easyUser.id) {
          clearInterval(clock);
          this.userInfo = easyBuy.easyUser;
          this.spaceID = easyBuy.global.pageParameter.spaceid;
          this.isSelf = this.userInfo.id === this.spaceID;
        }
      }, 100);
    },
    typeClick(event) {
      const $el = $(event.target)
      const index = $el.index();
      if (!$el.hasClass('tab-show')) {
        this.type = index;
      }
    },
    orderClick(event) {
      const $el = $(event.target);
      this.orderNumber = $el.index();
    },
    waterfall(column = 2) {
      const data = this.activeList.slice(-10).filter(i => i.top == null);
      const wrapper = document.querySelector('.item-container');
      const index = this.type + '' + this.orderNumber;
      const heightStatus = this.heightStatus[index];

      if (data.length === 0) {
        wrapper.style.height = Math.max(...heightStatus) + 10 + 'px';
        return;
      };

      const vGap = 10;
      window.getComputedStyle(wrapper).position !== 'relative' && (wrapper.style.position = 'relative');
      const wrapperWidth = +window.getComputedStyle(wrapper).width.match(/\d*.?\d{2}/gim)[0];
      const columnWidth = wrapperWidth / column;
      const items = [].slice.call(wrapper.children, -10).filter(i => i.style.top === '');
      const img = imagesLoaded(items);
      img.once('done', () => {
        items.forEach((el, i) => {
          const height = el.offsetHeight;
          const width = el.offsetWidth;
          const top = Math.min(...heightStatus);
          const columns = heightStatus.indexOf(top);
          const left = columns * columnWidth + (columnWidth - width) / 2;
          this.$set(data[i], 'top', top + 10);
          this.$set(data[i], 'left', left);
          heightStatus[columns] = top + height + 10;
        });
        this.heightStatus[index] = heightStatus;
        wrapper.style.height = `${Math.max(...heightStatus) + 10}px`;
      });
    },
    loading() {
      window.oplo = true;
      window.addEventListener('scroll', () => {
        const vHeight = window.innerHeight;
        const cHeight = document.body.scrollHeight;
        const scrollTop = window.scrollY;
        const lo = vHeight + scrollTop >= cHeight * 0.8;
        // 判断是否还有数据，10是每一页的数目
        const can = this.can[this.activeIndex] === undefined;
        if (window.oplo && lo && can) {
          window.oplo = false;
          this.type === 0 ? this.queryUserSpaceLabel() : this.queryUserSpaceUsedLabel();
        }
      });
    },
    requestData({url, before, after}) {
      const activeIndex = this.activeIndex;
      $.ajax({
        url,
        dataType: 'JSONP',
        before: () => {
          before && before();
        },
        success: (res) => {
          if (res.result.length < 10) {
            this.can[activeIndex] = 0;
          }
          after && after(res, activeIndex);
          window.oplo = true;
        },
      });
    },
    searchTag: _.debounce(function () {
      if (this.search.name === '') {
        return;
      }
      const API = 'http://social1.macaoeasybuy.com/SolrLabelsController/QueryLabelForUserSpace.easy';
      const url = `${API}?${this.objectToString(this.search)}&easybuyCallback=?`;
      this.requestData({
        url,
        after: (res) => {
          console.log(res);
        },
      })
    }, 1300),
    objectToString(args) {
      return Object.keys(args).reduce((string, key) => {
        return `${string}&${key}=${args[key]}`;
      }, '').substring(1);
    },
  },
  watch: {
    'search.name'(value) {
      this.searchTag();
    },
    spaceID() {
      this.queryLabelPrevCount();
      this.queryUserUsedLabelCount();
      this.queryUserSpaceLabel();
      this.activeList = this.cache['00'];
    },
    type() {
      this.activeList = this.cache[this.activeIndex];
      if (this.type) {
        this.itemStyle = 'UsedLabel';
        this.activeList.length === 0 && this.queryUserSpaceUsedLabel();
      } else {
        this.itemStyle = 'CreatedLabel';
      }
    },
    orderNumber() {
      this.activeList = this.cache[this.activeIndex];
      const can = this.can[this.activeIndex] === undefined;
      if (this.activeList.length === 0 && can) {
        this.type ? this.queryUserSpaceUsedLabel() : this.queryUserSpaceLabel();
      }
    },
    activeList() {
      this.$nextTick(this.waterfall);
    },
  },
  mounted() {
    this.init();
    this.loading();
  },
});

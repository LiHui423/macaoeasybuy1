(function () {
  function mainFunc() {
    const _DOM = {
      labelTab: {
        show: '.labelTabs',
        created: '.tab.tab-created',
        used: '.tab.tab-used .tab-show',
        usedAll: '.tab.tab-used .all',
        usedDaily: '.tab.tab-used .daily',
        usedLiving: '.tab.tab-used .living',
        usedBuy: '.tab.tab-used .buy',
        usedUsed: '.tab.tab-used .used',
      },
      sortOrderTab: {
          show: '.sortOrderTabs',
          time: '.sortOrderTabs .tab:eq(0)',
          love: '.sortOrderTabs .tab:eq(1)',
          used: '.sortOrderTabs .tab:eq(2)',
      },
      labelAdd: {
          show: '.label-add',
          btn: '.label-add .add-btn',
          panel: '.label-add .add-panel',
          panelSelect: '.add-panel .select',
          panelConfirm: '.add-panel .confirm',
          tabs: '.select .header ul',
          input: '.select .header input',
          list: '.select > ul',
      },
      container: '.item-container',
    };
    const _data = {
      isSelf: easyBuy.global.isSelf,
      spaceID: easyBuy.global.pageParameter.spaceid,
      ApiO: {
        active: {},
      },
    };
    const _methods = {
      /**
         * @desc 是否显示添加标签按钮
         */
        hasShowAddLabelButton() {
          if (_data.isSelf) {
              this.bindAddLabelButtonEvent();
              this.bindAddLabelPanelTypeTabsEvents();
              this.bindSearchInputEvent();
          } else {
              $(_data.doms.labelAdd.show).remove();
          }
      },
      /**
         * @desc 添加标签按钮事件
         */
        bindAddLabelButtonEvent() {
          $(document.body).on('click.addLabelBtn', event => {
              const target = $(event.target);
              const btn = $(_data.doms.labelAdd.btn);
              const panel = $(_data.doms.labelAdd.panel);
              if (target[0] === btn[0]) {
                  panel.toggle();
              } else {
                  panel.css('display') !== 'none' && target.parents('.add-panel').length === 0 && panel.css('display', 'none');
              }
          });
      },
/**
         * @desc 获取当前活动的索引组合
         * @returns {string}
         */
        getIndexGroup() {
          const labelTabIndex = +$(_data.doms.labelTab.show).attr('data-eb-active');
          const sortOrderIndex = +$(_data.doms.sortOrderTab.show).attr('data-eb-active');
          return labelTabIndex + '' + sortOrderIndex;
      },
      template(obj) {
        $.ajax({
            url:obj.api,
            data:obj.params,
            type:'GET',
            success:function(data){
                console.log(data);
                const html = template.render(obj.templateID,data);
            },
            erroe:function(){
                console.log('發生未知錯誤')
            }
        });
    },
      // 初始化ApiO
      initApiO() {
        // const effect = this;
        _data.ApiO = {
            // 创建的标签数量
            queryLabelPrevCount: this.template({
                api: 'http://userspace1.macaoeasybuy.com/UserLabelConntroller/queryLabelPrevCount.easy',
                params: {
                    userId: _data.spaceID,
                },
            }),
            // 用过的标签数量
            queryUserUsedLabelCount: this.template({
                api: 'http://social1.macaoeasybuy.com/SolrLabelsController/QueryUserUsedLabelCount.easy',
                params: {
                    userId: _data.spaceID,
                }
            }),
            // 创建的标签列表
            queryUserSpaceLabel: this.template({
                api: 'http://social1.macaoeasybuy.com/SolrLabelsController/queryUserSpaceLabel.easy',
                params: {
                    userId: _data.spaceID,
                    page: 0,
                    size: 10,
                    order: 'uptime',
                },
                templateID: 'queryUserSpaceLabel',
                data: {
                    '00': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '01': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '02': {
                        responseJSON: [],
                        requestParams: ''
                    }
                },
                afterRes(dataPackage) {
                    const indexGroup = effect.getIndexGroup();
                    _data[indexGroup].responseJSON.push(dataPackage);
                },
            }),
            queryUserSpaceUsedLabel: this.template({
                api: 'http://social1.macaoeasybuy.com/SolrLabelsController/queryUserSpaceUsedLabel.easy',
                params: {
                    userId: _data.spaceID,
                    type: 0,
                    page: 0,
                    size: 10,
                    order: 'uptime'
                },
                templateID: 'queryUserSpaceUsedLabel',
                data: {
                    '10': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '11': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '12': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '20': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '21': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '22': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '30': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '31': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '32': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '40': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '41': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '42': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '50': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '51': {
                        responseJSON: [],
                        requestParams: ''
                    },
                    '52': {
                        responseJSON: [],
                        requestParams: ''
                    },
                }
            }),
            queryLabelForUserSpace: this.template({
                api: 'http://social1.macaoeasybuy.com/SolrLabelsController/QueryLabelForUserSpace.easy',
                params: {
                    match: 1,
                    name: '',
                    type: 0,
                    size: 10,
                    page: 0,
                    order: 'addtime',
                    descOrAsc: 'desc',
                },
                container: $('.add-panel .select > ul'),
                templateID: 'queryLabelForUserSpace',
                beforeInsert(dataPackage) {
                    if (dataPackage['match'] === false) {
                        this.requestOptions.parameters.page = 1;
                        dataPackage['page'] = 1;
                    }
                    var REGEXP = RegExp(this.requestOptions.parameters.name, 'gim');
                    for (var i = 0, item;
                        (item = dataPackage['content'][i++]);) {
                        var name = item.labelName.match(REGEXP)[0];
                        item.labelName = item.labelName.replace(REGEXP, '<span style="color:#ff567c">' + name + '</span>');
                    }
                },
            })
        }
      },

    };
  }

  const clock = setInterval(() => {
    if (easyBuy.easyUser.id) {
      clearInterval(clock);
    }
  }, 100);
})();

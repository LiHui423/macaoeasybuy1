function YEZTemplateObj(paramObj) {
	this.requestData = {
		targetURL: paramObj.targetURL || undefined,
		parameters: paramObj.parameters || {},
		encryptData: paramObj.encryptData || false,
	};
    this.templateID = paramObj.templateID || undefined;
	this.container = paramObj.container || undefined;
	this.data = paramObj.data || {};
    this.methods = paramObj.methods || {};
	paramObj.beforeGetData !== undefined && (this.beforeGetData = paramObj.beforeGetData);
	paramObj.afterGetData !== undefined && (this.afterGetData = paramObj.afterGetData);
	paramObj.beforeInsert !== undefined && (this.beforeInsert = paramObj.beforeInsert);
	paramObj.afterInsert !== undefined && (this.afterInsert = paramObj.afterInsert);
}
YEZTemplateObj.prototype = {
	constructor: YEZTemplateObj,
	getRequestURL: function(paramObj) {
		var dataPass = paramObj.targetURL !== undefined && paramObj.targetURL !== '';
		if(dataPass) {
			var targetURL = paramObj.targetURL,
				parameters = paramObj.parameters,
				encryptData = paramObj.encryptData,
				requestURL;
			var paramNameArr = Object.keys(parameters),
				paramString = paramNameArr.reduce(function(pre, paramName) {
					return pre + paramName + '=' + parameters[paramName] + '&';
				}, '');
			requestURL = targetURL + '?' + paramString + 'easybuyCallback=?';
			return requestURL;
		} else {
			return false;
		}
	},
    insertTemplate: function(templateObj, data, isCache) {
        var isPaging = data.page !== undefined;         // 判断是否是分页
        var isFirst = isPaging && data.page === 0;      // 判断是否是第一页
		var templateStrArr = easyBuy.global.template;   // 页面内模板字符串所在全局里的数组
        var container = $(templateObj.container);          // 容器
		var templateString = templateStrArr[templateObj.templateID];        // 模板字符串

        // html: 第一页，不分页，缓存     after: 懒加载
        if(isCache || !isPaging || isFirst) {
            container.html(template.render(templateString, data));
        } else {
            container.children().last().after(template.render(templateString, data));
        }
    }
};
function templateProcessor(templateObjArr) {
	console.log(templateObjArr);
	var templateStrArr = easyBuy.global.template;
	if(!!jQuery) {
		$.each(templateObjArr, function(index) {
			var _this = this;
			var requestURL = _this.getRequestURL(_this.requestData);
			if(requestURL !== false) {
				$.ajax({
					method: 'GET',
					dataType: 'JSON',
					async: true,
					cache: true,
					url: requestURL,
					beforeSend: function() {
						_this.beforeGetData&&_this.beforeGetData();
					},
					success: function(res) {
						var data = {
							page: _this.requestData.parameters.page,
							data: res['list'] || res['result'] || res['replyList']
						};
						_this.afterGetData&&_this.afterGetData(data);
						// 判断是否有数据
                        _this.beforeInsert&&_this.beforeInsert(data);
						if(data.data.length !== 0) {
                            _this.insertTemplate(_this, data, false);
                        }
						_this.afterInsert&&_this.afterInsert(data);
					}
				})
			}
		})
	} else {
		console.log('请将 jQuery 在此之前引入');
	}
}

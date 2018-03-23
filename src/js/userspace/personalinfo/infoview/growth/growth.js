
easyBuy.global.afterDataJs = function () {
    var domain = 'http://userspace1.macaoeasybuy.com/';
var queryUserGrowUpBasic = new Ebtemplate({
    targetURL: domain + 'UserGrowUpController/queryUserGrowUpBasic.easy',
    parameters: {
        userId: easyBuy.easyUser.id
    },
    container: '#userspace-content',
    templateID: 'queryUserGrowUpBasic',
    afterGetRes: function(dataPackage) {
        petProcessor(dataPackage);
    },
    afterInsert: function (dataPackage) {
        experienceControl(dataPackage);
        Ebtemplate.processor([queryUserGrowUpDetail]);
    }
});
var queryUserGrowUpDetail = new Ebtemplate({
    targetURL: domain + 'UserGrowUpController/queryUserGrowUpDetail.easy',
    parameters: {
        userId: easyBuy.easyUser.id
    },
    container: '#userspace-content',
    templateID: 'queryUserGrowUpDetail',
    data: {
        year: undefined
    },
    afterGetRes: function (dataPackage) {
        dataPackage.page = 1;
        this.data.year = dataPackage.content.year;
    },
    afterInsert: function () {
        $('.data-num.shop').children('div:last-child').on('mouseenter', function() {
            if($(this).children('.detail-box').children().length === 0) {
                insertDetail(queryUserGrowUpMoneyDetail);
            }
        });
        $('.data-num.good').children('div:last-child').on('mouseenter', function () {
            if($(this).children('.detail-box').children().length === 0) {
                insertDetail(queryUserGrowUpLoveDetail);
            }
        });
    }
});
var queryUserGrowUpMoneyDetail = new Ebtemplate({
   targetURL: domain + 'UserGrowUpController/queryUserGrowUpMoneyDetail.easy',
   parameters: {
       userId: easyBuy.easyUser.id,
       year: undefined,
   },
    container: '.data-num.shop .detail-box',
    templateID: 'queryUserGrowUpMoneyDetail',
    afterInsert: function () {
        $('.data-num.shop').children('div:last-child').off('mouseenter');
    },
});
var queryUserGrowUpLoveDetail = new Ebtemplate({
    targetURL: domain + 'UserGrowUpController/queryUserGrowUpLoveDetail.easy',
    parameters: {
        userId: easyBuy.easyUser.id,
        year: undefined,
    },
    container: '.data-num.good .detail-box',
    templateID: 'queryUserGrowUpLoveDetail',
    afterInsert: function () {
        $('.data-num.good').children('div:last-child').off('mouseenter');
    },
});
var queryEasyBuyAlbumList = new Ebtemplate({
    targetURL: domain + 'shouldBuySocialConntroller/queryEasyBuyAlbumList.easy',
    container: '',
    templateID: 'queryEasyBuyAlbumList',
});
    function petProcessor(data) {
        var exp = data.experCount,
            pets = data.content,
            temp = getPetLevel(exp, getLevelExp(pets), pets);
        data.nowLevel = temp.nowLevel;
        data.nextLevel = temp.nextLevel;
        data.nextName = temp.nextName;
        data.nextExp = temp.nextExp;
        data.content = temp.data;
        experienceControl(data);
        function getPetLevel(nowExp, levelExp, pets) {
            switch (true) {
                case (nowExp < levelExp[1]):
                    return {nowLevel: 0, data: pets.slice(0, 3), nextLevel: 1, nextName: pets[1].petName, nextExp: pets[1].levelNum-nowExp};
                case (nowExp < levelExp[2]):
                    return {nowLevel: 1, data: pets.slice(1, 4), nextLevel: 2, nextName: pets[2].petName, nextExp: pets[2].levelNum-nowExp};
                case (nowExp < levelExp[3]):
                    return {nowLevel: 2, data: pets.slice(2, 5), nextLevel: 3, nextName: pets[3].petName, nextExp: pets[3].levelNum-nowExp};
                case (nowExp < levelExp[4]):
                    return {nowLevel: 3, data: pets.slice(3), nextLevel: 4, nextName: pets[4].petName, nextExp: pets[4].levelNum-nowExp};
                case (nowExp < levelExp[5]):
                    return {nowLevel: 4, data: pets.slice(3), nextLevel: 5, nextName: pets[5].petName, nextExp: pets[5].levelNum-nowExp};
                default:
                    return {nowLevel: 5, data: pets.slice(3)};
            }
        }
        function getLevelExp(data) {
            var result = [];
            for(var i=0, item; item = data[i++];) {
                result.push(item.levelNum);
            }
            return result;
        }
    }
    function experienceControl(data) {
        var p = (data.experCount/data.content[2].levelNum/0.9).toFixed(4) * 100;
        p = p < 100 ? (p + '%') : '100%';
        $('.experience div').css('width', p);
        $('.top-arrow div').css('left', p);
    }
    function insertDetail(ebtO) {
        ebtO.requestOptions.parameters.year = queryUserGrowUpDetail.data.year;
        templateProcessor([ebtO]);
    }

    Ebtemplate.processor([queryUserGrowUpBasic]);
};


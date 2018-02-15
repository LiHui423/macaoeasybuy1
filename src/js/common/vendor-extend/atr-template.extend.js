// template.helper('formatNum', easyBuy.global.dep.formatNum);
template.helper('format', function(num) {
    var str = num + '';//转换成字符串
    var str_num = str.split('.')[0];
    var str_last = str.split('.')[1] == undefined ? '' : '.'+str.split('.')[1];
    var ret_num = '';
    var counter = 0;
    for(var i=str_num.length-1;i>=0;i--){
        ret_num = str_num.charAt(i) + ret_num;
        counter++;
        if(counter==3){
            counter = 0;
            if(i!=0){
                ret_num = ',' + ret_num;
            }
        }}
    return ret_num + str_last;
});
// template.helper('osURL', easyBuy.global.osURL);
template.helper('image', function (link) {
    const dev = false;
    const server = dev ? 'https:' : 'http://mbuy.oss-cn-hongkong.aliyuncs.com';
    const image = link.replace(/\\/gim, '/');
    return server + image;
});
template.helper('cutContent', function (str, num) {
    num === undefined && (num = 5);
    return str.substring(0, num);
});
template.helper('cutModify', function (str) {
    return str.replace(/<.*?>/ig, '');
});
template.helper('easySex', function (sex) {
    var url;
    url = sex === "Girl" ? "/src/img/common/girl.png" : "/src/img/common/boy.png";
    return url;
});
template.helper('sexIcon', function (sex) {
    var setClass = '';
    if (sex === 'Girl') {
        setClass = 'sex-female';
    } else if (sex === 'Boy') {
        setClass = 'sex-male'
    }
    return '<i class="eb-icon ' + setClass + '"></i>';
});
template.helper('isActive', function (i, j) {
    j = j === undefined ? false : j;
    if ((i === 0 && !j) || (j && i === j)) {
        return "data-eb-active";
    }
});

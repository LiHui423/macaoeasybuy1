var spaceid = easyBuy.global.pageParameter.spaceid;
var userId = easyBuy.easyUser.id;
var state = easyBuy.global.isSelf;
$(function(){
    createlList();
    // 標籤數量
    getLabelCount();
    
})
// 標籤列表
function createlList(){
    var url = 'http://social1.macaoeasybuy.com/SolrLabelsController/queryUserSpaceLabel.easy';
    var data = {
        userId: spaceid,
        page: 0,
        size: 10,
        order: 'uptime',
    }
    $.getJSON(url,data,function(data){
        console.log(data);
        var html = template('queryUserSpaceLabel',data);
        $('#label-list').html(html);
    })
}
// 標籤數量
function getLabelCount(){
    var pageUser = easyBuy.pageUser.name;
    $.getJSON('http://userspace1.macaoeasybuy.com/UserLabelConntroller/queryLabelPrevCount.easy?userId='+spaceid+'&easybuyCallback=?',function(data){
        let label = state ? '我の標籤(<span>'+data.result.labelCount+'</span>)' : easyBuy.pageUser.name+'の標籤(<span>'+data.result.labelCount+'</span>)';
        let usedLabel = state ? '我用過の標籤(<span>'+data.result.usedLabelCount+'</span>)' : easyBuy.pageUser.name+'用過の標籤(<span>'+data.result.usedLabelCount+'</span>)';
        $('#userspace-content .tab-created').html(label);
        $('#userspace-content .tab-used').prepend(usedLabel);
    })
}

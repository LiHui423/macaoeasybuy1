void function() {
  $('#left-menu').load('/public/leftmenu.html', function () {
    $('#sendpost-leftmenu')[0].flag = true;
    $('#sendpost-leftmenu').on('click.post', function () {
        if ($(this)[0].flag) {
            $(this)[0].flag = false;
            var dataUrl = 'http://userspace1.macaoeasybuy.com/UserPublishController/queryUserPublishCount.easy?userId=' + userId + '&easybuyCallback=?';
            $.getJSON(dataUrl, function (data) {
                var newData = data.publishCount;
                $.each(newData, function (k, y) {
                    $('#' + k + '-postclick p span').html(y);
                });
            });
        }
        $('#sendpost-leftmenu-box').css('display', 'block');
    });
    $('#sendpost-leftmenu-box img.cancel-btn').on('click', function () {
        $('#sendpost-leftmenu-box').css('display', 'none');
    });
});
}();

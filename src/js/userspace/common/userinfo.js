(function () {
    var clock = setInterval(function () {
        var UID = null;
        var OID = +easyFrame.getUrlParam('id');
        if (easyBuy.easyUser.id !== undefined) {
            UID = easyBuy.easyUser.id;
            clearInterval(clock);
            insertCSS(UID === OID);
            userInfoHead(function(){
                if(easyBuy.userSpaceGolbal.isFansFriends) window.location.reload();
            }, UID, OID);
        }
    }, 100);
    function userInfoHead(fn, UID, OID){
        (function InsertPageInfo() {
            $('#user-info').load('/common/userinfo.html',function(){
                $.getJSON('http://userspace1.macaoeasybuy.com/userSpaceIndexController/queryUserSpaceInfo.easy?userId=' + UID + '&seeUserId=' + OID + '&easybuyCallback=?',function(data){
                    var newData = data.userInfo;
                    //存儲用戶信息
                    easyBuy.pageUser.name = newData.userName;
                    easyBuy.pageUser.pic = newData.userPic;
                    easyBuy.pageUser.sex = newData.sex;

                    var dep = window.easyBuy.global.dep;
                    var formatNum = dep.formatNum;
                    //姓名
                    $('#user-info .user-name-top').html(newData.userName);
                    //性別
                    newData.sex == 'Girl' ? $('#user-info img.sex').attr('src','/src/img/common/girl.png') : $('#user-info img.sex').attr('src','/src/img/common/boy.png');
                    //頭像
                    $('#user-info .head-pic').attr('src','http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData.userPic);
                    //寵物
                    $('#user-info img.pet').attr('src','http://mbuy.oss-cn-hongkong.aliyuncs.com/'+newData.petGradePic);
                    $('#user-info .pet-level').html(newData.petGradeName);
                    //身份
                    $('#user-info .identity').html(newData.userIdentity ? newData.userIdentity : '普通用戶');
                    $('#user-info .user-head').css('visibility','visible');
                    //關注
                    $('#point-select-different span')[0].isClick = false;
                    if(newData.isSelf === 1){
                        $('#user-info .user-looking-set-point-user-box .set-point-user-box').remove();
                        $('#user-info-success,#user-info-focus-box').remove();
                        $('#user-info .point-select-different span').html(newData.seeNum);
                    }else{
                        $('#user-info .user-looking-set-point-user-box .user-looking').remove();
                        if(newData.isAttented === 0){
                            $('#point-select-different span').html('關注');
                            userInfoBindClickPoint('on',newData.isSelf);
                        }else{
                            $('#point-select-different span').html('已關注對方'+newData.attentionTime);
                            userInfoBindClickPoint('off',newData.isSelf);
                        }
                    }
                    $('#user-info .user-looking-set-point-user-box').css('visibility','visible');
                    //統計
                    $('#user-info .user-info-text .user-info-text-pack ul li').eq(1).find('div:first-of-type').html(formatNum(newData.publishCount));
                    $('#user-info .user-info-text .user-info-text-pack ul li').eq(2).find('div:first-of-type').html(formatNum(newData.attentionCount));
                    $('#user-info .user-info-text .user-info-text-pack ul li').eq(3).find('div:first-of-type').html(formatNum(newData.fansCount));
                    $('#user-info .user-info-text .user-info-text-pack ul').css('visibility','visible');
                });
            });
        }());
        function userInfoBindClickPoint(state,isSelf){
            if(state == 'off'){
                $('#point-select-different').append('<div>取消關注</div>');
                $('#point-select-different div')[0].isClick = false;
                easyBuy.global.dep.maskClick($('#point-select-different span'),function(){
                    $('#point-select-different div').slideUp(200);
                })
                $('#point-select-different span').off('click');
                $('#point-select-different span').on('click',function(){
                    $(this).siblings('div').stop().slideToggle(200);
                });
                $('#point-select-different div').off('click');
                $('#point-select-different div').on('click',function(){
                    $('#user-info-focus-box').css('display','block');
                });
                $('#user-info-focus-box .cancel-sure').on('click',function(){
                    $('#user-info-focus-box').css('display','none');
                });
                $('#user-info-focus-box .sure-cancel').on('click',function(){
                    var self = $('#point-select-different div');
                    if(self[0].isClick) return false;
                    self[0].isClick = true;
                    userInfoBindoffClickPoint(self,isSelf);
                });
            }else{
                $('#point-select-different span').off('click');
                $('#point-select-different span').on('click',function(){
                    var self = $(this);
                    if(self[0].isClick) return false;
                    self[0].isClick = true;
                    userInfoBindonClickPoint(self,isSelf);
                });
            }
        }
        //關注
        function userInfoBindonClickPoint(self,isSelf){
            var ipurl = 'http://userspace1.macaoeasybuy.com/';
            var easyUrl = 'http://userspace1.macaoeasybuy.com/';
            var dataUrl = easyUrl+'userFriendsConntroller/addFriend.easy?userId='+userId+'&attentionId='+seeUserId+'&easybuyCallback=?';
            $.getJSON(dataUrl,function(data){
                if(data.result != 'success') return false;
                self.html('已關注對方');
                userInfoBindClickPoint('off',isSelf);
                self[0].isClick = false;
                if($('#user-info-success').css('display') == 'none') $('#user-info-success').fadeIn(500).delay(1000).fadeOut(500);
                if(isSelf == 0){
                    if(fn) fn('point');
                }
            });
        }
        //取消關注
        function userInfoBindoffClickPoint(self,isSelf){
            var ipurl = 'http://userspace1.macaoeasybuy.com/';
            var easyUrl = 'http://userspace1.macaoeasybuy.com/';
            var dataUrl = easyUrl + 'userFriendsConntroller/removeFriend.easy?userId='+userId+'&attentionId='+seeUserId+'&easybuyCallback=?';
            $.getJSON(dataUrl,function(data){
                if(data.fan != 'success') return false;
                $('#point-select-different span').html('關注');
                setTimeout(function(){
                    self.remove();
                },200);
                userInfoBindClickPoint('on',isSelf);
                self[0].isClick = false;
                $('#user-info-focus-box').css('display','none');
                if(isSelf == 0){
                    if(fn) fn('cancel');
                }
            });
        }
    };
    function insertCSS(isSelf) {
        var css = isSelf ? 'my-space' : 'other-space';
        $('#userspace-content').addClass(css);
    }
}());

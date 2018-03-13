( () => {
    $("body").on('click',function(e){
        const $e = $(e.target);
        console.log($e);
        // 判断是否是用户头像被点击
        if($e.attr('data-type') === 'userAvatar'){

            const spaceId = $e.parents('[data-id]').attr('data-id');
            console.log('被点击的用户头像的id为：'+spaceId);
            window.open("http://userspace.macaoeasybuy.com/?spaceid="+spaceId);
            // 判斷是否立即購買
        }else if($e.attr('data-type') === 'buyNow'){
            const goodId = $e.parents('[data-id]').attr('data-id');
            console.log('被点击的商品的id为：'+goodId);
            window.open('http://shopping.macaoeasybuy.com/goodDetails/limitedDetail.html?id=' + goodId);
        }// 判斷是否為進店逛逛
        else if($e.html() === '進店逛逛'){
            let shopId = $e.attr('data-id');
            jump('http://shopping.macaoeasybuy.com/moreshops/shopDetails/shopDetails_index.html?shopId=',shopId);
        }
        // 判斷是否為換一換按鈕
        else if($e.parents().hasClass('begin_hover_seeGoodDetails') || $e.parents().hasClass('begin_status_btn')){
            if($e.html().indexOf('換一換') === -1){
                const id = $e.parents('.groupBuy_goodsEach_begin').data('id');
                window.open('http://shopping.macaoeasybuy.com/goodDetails/groupDetail.html?id=' + id +'');
            }
        }else if($e.hasClass('museum_goods_radius')){
            const productId = $e.parents('[data-id]').attr('data-id');
            window.open('http://shopping.macaoeasybuy.com/goodDetails/museumDetails.html?id='+productId);
        }else if($e.hasClass('yez-mask')){
            const albumId = $e.parents('[data-id]').attr('data-id');
            window.open('http://social.macaoeasybuy.com/easylive/easylivealbum/albumclassification/albumlistdetail/albumlistdetail.html?albumId=' + albumId);
        }//本週熱賣跳轉到普通商品詳細頁
        else if(location.href.indexOf('hit.html') !== -1 ){
            if($e.attr('id') === "underline" || $e.html() === "打開看看"){
                const productId = $e.parents('[data-id]').attr('data-id');
                jump('http://shopping.macaoeasybuy.com/goodDetails/ordinaryGoodDetais.html?id=',productId);
            }
        }
        //發現新品跳轉到普通商品詳情頁
        else if(location.href.indexOf('new.html') !== -1 && $e.attr('id') === "underline"){
            const newId = $e.parents('[data-id]').attr('data-id');
            console.log(newId);
            jump('http://shopping.macaoeasybuy.com/goodDetails/ordinaryGoodDetais.html?id=',newId);
        }//宜買話題詳細頁跳轉到宜買話題詳細頁
        else if(location.href.indexOf('buytopicpostdetail.html') !== -1 && $e.attr('id') === 'underline'){
            const postId = $e.parents('[data-id]').attr('data-id');
            location.href = 'http://social.macaoeasybuy.com/easylive/easylivebuytopic/buytopicpostdetail/buytopicpostdetail.html?id='+postId;
        }//敗家志話題列表頁跳轉到敗家志話題帖子詳細頁
        else if(location.href.indexOf('ProdigalTopicList.html') !== -1 && $e.attr('id') === 'underline'){
            const topicId = $e.parents('[data-id]').attr('data-id');
            jump('http://social.macaoeasybuy.com/liveshot/ProdigalTopicList/ProdigalOfficialPost/ProdigalOfficialPost.html?id=',topicId);
        }
        //跳轉到宜品館商品詳細頁
        else if(location.href.indexOf('museumList_beautiful.html') !== -1 || location.href.indexOf('museumList_practical.html') !== -1 || location.href.indexOf('museumList_magical.html') !== -1){
            if($e.attr('id') === "underline"){
                const id = $e.parents('[data-id]').attr('data-id');
                jump('http://shopping.macaoeasybuy.com/goodDetails/museumDetails.html?id=',id);
            }
        }//跳轉到宜粉日誌帖子詳細頁
        else if(location.href.indexOf('logpostdetail.html') !== -1 && $e.hasClass('shadow-box')){
            console.log('true');
            const postid=$e.parents('.pillar-all').attr('id').split('-')[0];
            console.log(postid);
            jump('http://social.macaoeasybuy.com/easylive/easylivelog/logpostdetail/logpostdetail.html?id=',postid);
        }//跳轉到福利社話題帖子詳細頁
        else if(location.href.indexOf('welfarepostdetail.html') !== -1 && $e.hasClass('shadow')){
            const postId=$e.parents('.list-num').attr('data-id');
            console.log(postId);
            jump('http://social.macaoeasybuy.com/easylive/easylivewelfare/welfarepostdetail/welfarepostdetail.html?id=',postId);
        }//跳轉到尋寶市集話題帖子詳細頁
        else if(location.href.indexOf('fairofficialpost.html') !==-1 && $e.attr('id') === "underline"){
            console.log('true');
            const postId=$e.parents('[data-id]').attr('data-id');
            jump('http://social.macaoeasybuy.com/market/treasureclassifydetail/fairofficialpost/fairofficialpost.html?id=',postId);
        }//更多主題頁面商品跳轉到普通商品詳情頁
        else if(location.href.indexOf('moreTheme.html') !==-1 && $e.parents('.moreThemeMain_left_goodBox')){
            const productId=$e.parents('[data-id]').attr('data-id');
            console.log(productId);
            jump('http://shopping.macaoeasybuy.com/goodDetails/ordinaryGoodDetais.html?id=',productId);
        }//搜索結果（標籤）頁跳轉到標籤詳細頁
        else if(location.href.indexOf('search_label.html') !== -1){
            if($e.attr('id') === 'underline' || $e.hasClass('look-btn')){
                const labelId=$e.parents('[data-id]').attr('data-id');
                jump('http://social.macaoeasybuy.com/label/labeldetail/labeldetail.html?id=',labelId);
            }
        }//搜索結果（話題）頁跳轉到話題詳細頁
        else if(location.href.indexOf('search_topic.html') !== -1 && (($e.attr('id') === 'underline') || ($e.hasClass('red_curr')) ) ){
            var topicId=$e.parents('[data-id]').attr('data-id');
            jump('http://social.macaoeasybuy.com/easylive/easylivebuytopic/buytopicpostdetail/buytopicpostdetail.html?id=',topicId);
        }//搜索結果（帖子）頁跳轉到相關帖子詳細頁
        else if(location.href.indexOf('search_post.html') !== -1 && (($e.attr('id') === 'underline') || ($e.hasClass('red_curr')) )){
            var cla=$('.search_sortBox_left ul li');
            for(var i=0;i<cla.length;i++){
                if($(cla[i]).hasClass('search_sortBox_left_curr')){
                    var classNumber=$(cla[i]).attr('data-icon');
                    console.log(classNumber);
                    var pId=$e.parents('[data-id]').attr('data-id');
                    console.log(pId)
                    if(classNumber === "1"){
                        //跳轉到日誌帖子詳細頁
                        jump('http://social.macaoeasybuy.com/easylive/easylivelog/logpostdetail/logpostdetail.html?id=',pId);
                    }else if(classNumber === "2"){
                        //跳轉到敗家志帖子詳細頁
                        jump('http://social.macaoeasybuy.com/liveshot/ProdigalPostDetail/ProdigalPostDetail.html?postId=',pId);
                    }else if(classNumber === "3"){
                        //跳轉到市集帖子詳細頁
                        jump('http://social.macaoeasybuy.com/market/treasureclassifydetail/fairpostdetail/fairpostdetail.html?id=',pId);
                    }else if(classNumber === "4"){
                        //跳轉到二手帖子詳細頁
                        jump('http://social.macaoeasybuy.com/secondhand/secondhandclassifydetail/secondPostDetail/secondPostDetail.html?postId=',pId);
                    }else if(classNumber === "5"){
                        //跳轉到專輯帖子詳細頁
                        jump('http://social.macaoeasybuy.com/easylive/easylivealbum/albumclassification/albumlistdetail/albumlistdetail.html?albumId=',pId);
                    }else if(classNumber === "6"){
                        //跳轉到生活圈帖子詳細頁
                        jump('http://social.macaoeasybuy.com/easylive/easylivelifecircle/lifecirclepostdetail/lifecirclepostdetail.html?id=',pId);
                    }
                }
                function jump(url,para){
                    window.open(url+para);
                }
            }
        }// 用戶空間-心動，跳轉到商品詳細頁
        else if(location.href.indexOf('love/index.html') !== -1){
            if($e.hasClass('shadow')){
                let type = $($e.parents('.userlove_mainEach')).attr('id').split('_')[0];
                if(type.indexOf('Buy') !== -1){
                    type = type.split('Buy')[0];
                }
                let id = $($e.parents('.userLoveItem')).attr('class').split('Item')[2];

                if(type === 'fair'){
                    window.open('http://userspace.macaoeasybuy.com/fair/detail.html?spaceid=' + easyBuy.global.pageParameter.spaceid + '&id=' + id);
                }else if(type === 'other'){
                    window.open('http://shopping.macaoeasybuy.com/goodDetails/ordinaryGoodDetais.html?id='+id);
                }else{
                    window.open('http://shopping.macaoeasybuy.com/goodDetails/'+type+'Detail.html?spaceid=' + easyBuy.global.pageParameter.spaceid + '&id=' + id);
                }
            }
        }// 用戶空間-攢好，跳轉到相關帖子詳細頁
        else if(location.href.indexOf('praise') !== -1){
            if($e.hasClass('shadow-box') || $e.hasClass('box-shadow')){
                let type = $($e.parents('.pillar-all')).attr('id').split('_')[1].split('Item')[0];
                if(type === 'liveshot'){
                    type = 'buy';
                }else if(type === 'secondHand'){
                    type = 'used';
                }
                let id = $($e.parents('.pillar-all')).attr('id').split('_')[0];
                window.open('http://userspace.macaoeasybuy.com/'+type+'/detail.html?spaceid=' + easyBuy.global.pageParameter.spaceid + '&id=' + id);
            }
        }// 用戶空間-生活圈，跳轉到生活圈詳細頁
        else if(location.href.indexOf('life/index.html') !== -1){
            if($e.hasClass('shadow-box')){
                let postId = $e.parents('.pillar-all').attr('id').replace(/[^0-9]/ig,"");
                console.log(postId);
                console.log(postId.length);
                jump('http://userspace.macaoeasybuy.com/life/detail.html?spaceid=' + easyBuy.global.pageParameter.spaceid + '&postId=' , postId);
            }
        }//用戶空間-專輯，跳轉到專輯詳情頁
        else if(location.href.indexOf('album/index.html') !== -1){
            if($e.hasClass('shadow-box')){
                let albumId = $e.parents('.album-list').attr('id').replace(/\D/gim, '');
                jump('http://userspace.macaoeasybuy.com/album/detail.html?spaceid=' + easyBuy.global.pageParameter.spaceid + '&albumId=',albumId);
            }
        }//用戶空間-專輯詳細頁，跳轉到專輯圖片詳細頁
        else if(location.href.indexOf('album/detail.html') !== -1){
            if($e.hasClass('shadow-box') || $e.is('p')){
                let albumPostId = $($e.parents('.album-list')).attr('id').split('-')[0];
                jump('http://userspace.macaoeasybuy.com/album/albumpostdetail/albumpostdetail.html?spaceid='+easyBuy.global.pageParameter.spaceid+'&albumId='+easyBuy.global.pageParameter.spaceid+'&albumPostId=',albumPostId);
            }
        }//用戶空間-關注店鋪，跳轉到商店詳細頁
        else if(location.href.indexOf('hop/index.html') !== -1){
            if($e.html() === '進店看看'){
                let shopId = $e.parents('.focusShopEach').attr('data-id');
                jump('http://shopping.macaoeasybuy.com/moreshops/shopDetails/shopDetails_index.html?shopId=',shopId);
            }
        }//用戶空間-日誌列表頁，跳轉到日誌詳細頁
        else if(location.href.indexOf('diary/index.html') !== -1){
            if($e.hasClass('shadow-box')){
                let diaryId = $($e.parents('.pillar-all')).attr('id').replace(/\D/gim, '');
                jump('http://userspace.macaoeasybuy.com/diary/detail.html?spaceid=' + easyBuy.global.pageParameter.spaceid + '&diaryId=',diaryId);
            }
        }
    })
    function jump(url,para){
        window.open(url+para);
    }
})();

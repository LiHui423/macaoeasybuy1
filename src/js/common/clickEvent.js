( () => {
    $("body").on('click',function(e){
        const $e = $(e.target);
        // 判断是否是用户头像被点击
        if($e.attr('data-type') === 'userAvatar'){
            const spaceId = $e.parents('[data-id]').attr('data-id');
            console.log('被点击的用户头像的id为：'+avatarId);
            //window.open("http://userspace.macaoeasybuy.com/?spaceid ="+spaceId);
            // 判斷是否立即購買
        }else if($e.attr('data-type') === 'buyNow'){
            const goodId = $e.parents('[data-id]').attr('data-id');
            console.log('被点击的商品的id为：'+goodId);
            window.open('http://shopping.macaoeasybuy.com/goodDetails/limitedDetail.html?id =' + goodId);
            // 判斷是否點擊進店逛逛
        }else if($e.html().indexOf('進店逛逛') !==-1 ){
            window.open('http://shopping.macaoeasybuy.com/moreshops/shopDetails/shopDetails_index.html?shopId =' + shopId);
            // 判斷是否為查看商品
        }else if($e.parents().hasClass('begin_hover_seeGoodDetails') || $e.parents().hasClass('begin_status_btn')){
            if($e.html().indexOf('換一換') === -1){
                const id = $e.parents('.groupBuy_goodsEach_begin').data('id');
                window.open('http://shopping.macaoeasybuy.com/goodDetails/groupDetail.html?id =' + id +'');
            }
        }else if($e.hasClass('museum_goods_radius')){
            const productId = $e.parents('[data-id]').attr('data-id');
            window.open('http://shopping.macaoeasybuy.com/goodDetails/museumDetails.html?id ='+productId);
        }else if($e.hasClass('yez-mask')){
            const albumId = $e.parents('[data-id]').attr('data-id');
            window.open('http://social.macaoeasybuy.com/easylive/easylivealbum/albumclassification/albumlistdetail/albumlistdetail.html?albumId =' + albumId);
        }//跳轉到宜品館商品詳細頁
        else if(location.href.indexOf('museumList_beautiful.html') !== -1 || location.href.indexOf('museumList_practical.html') !== -1 || location.href.indexOf('museumList_magical.html') !== -1){
            if($e.attr('id') === "underline"){
                const id = $e.parents('[data-id]').attr('data-id');
                console.log(id);
                jump('http://shopping.macaoeasybuy.com/goodDetails/museumDetails.html?id =',id);
            }
        }
    })
    function jump(url,para){
        window.open(url+para);
    }
})();

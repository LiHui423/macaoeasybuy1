var oldImg = '/img/userspace/common/change.jpg';
var img = '/img/userspace/common/Art-painting-meteor-planet-atmosphere-friction-fire_1920x1440.jpg';
var timerBg = null;
timerBg = setInterval(function(){
    var obj = document.getElementById('swapper');
    if(obj != null){
        clearInterval(timerBg);
        obj.style.backgroundImage = 'url('+oldImg+')';
        var addimg = new Image();
        addimg.src = img;
        if(addimg.complete) {
            obj.style.backgroundImage = 'url('+img+')';
        } else {
            addimg.onload = function() {
                obj.style.backgroundImage = 'url('+img+')';
            };
        }
    }
}, 1);

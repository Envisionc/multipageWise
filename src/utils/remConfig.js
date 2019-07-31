export default function() {
    // var deviceWidth = document.documentElement.clientWidth;
    // if(deviceWidth > 750) {
    //     deviceWidth = 7.5 * 50;
    // }
    // document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px';
    // // 禁止双击放大
    // document.documentElement.addEventListener('touchstart', function (event) {
    //     if (event.touches.length > 1) {
    //         event.preventDefault();
    //     }
    // }, false);
    // var lastTouchEnd = 0;
    // document.documentElement.addEventListener('touchend', function (event) {
    //     var now = Date.now();
    //     if (now - lastTouchEnd <= 300) {
    //         event.preventDefault();
    //     }
    //     lastTouchEnd = now;
    // }, false);
    rem();
    $(window).resize(function(){
        rem();
    });
}

function rem() {
    var size = ~~window.innerWidth / 3.75 ;
    document.documentElement.style.fontSize = size + 'px'
    setTimeout(() => {
        var new_size = +document.documentElement.style.fontSize.slice(0, -2);
        if (new_size != size) {
            document.documentElement.style.fontSize = size * (size / new_size) +"px";
        }
    })
}
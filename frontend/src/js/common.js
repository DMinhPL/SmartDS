(function($){
    function ui_nav_main(){
        $.bodyScrollTop = 0;
        $.bodyDisableScroll = function () {
            var $w = $(window);
            if ($w.width() > 992) return;
            $.bodyScrollTop = $w.scrollTop();
            $('#page').css({ height: $w.height(), overflow: 'hidden' });
        };
        $.bodyReturnScroll = function () {
            var $w = $(window);
            if ($w.width() > 992) return;
            $('#page').css({ height: '', overflow: '' });
            $w.scrollTop($.bodyScrollTop);
        };

        $(".burger-toggle").on('click',function(e){
            e.preventDefault();
            $("header nav.navbar").toggleClass("open");
            $("header .backdrop").toggleClass("open-layer");
            $.bodyDisableScroll();
        });
        $("header .backdrop, .main-header a.close-nav").on('click',function(){
            $("header nav.navbar").removeClass("open");
            $("header .backdrop").removeClass('open-layer');
            $.bodyReturnScroll();
        });

    }


    $(function(){
        ui_nav_main();
    })
})(jQuery);
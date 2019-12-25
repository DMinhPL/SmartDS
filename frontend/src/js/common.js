(function($){
    function ui(){
        let $services = $(".services-section-page .services--features .nav.nav-pills > li");
        // console.log($services.text());
        $services.matchHeight();
    }
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

    function isotope_gallery_services(){
        var $container = $('#itemsWork , #itemsWorkTwo, #itemsWorkThree');
        $container.isotope({
            filter: '* , all',
            animationOptions: {
                duration: 750,
                easing: 'linear',
                queue: false
            }
        });
        $('.cat a').click(function() {
            $('.cat .active').removeClass('active');
            $(this).addClass('active');
            var selector = $(this).attr('data-filter');
            $container.isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false
                }
            });
            return false;
        });
    }
    // fix mavbar top header
    function ui_nav_fix_top(){
        let $top = $('#top-header');
        let $page = $('.wrapper');
        let $w = $(window);
        var _resize = ()=>{
            if($w.outerWidth() <= 992){
                $top.addClass('fixed');
                $page.css({'margin-top':$top.outerHeight()});
            }
            else{
                $top.removeClass('fixed');
                $page.css({'margin-top':''});
            }
        }
        $w.on('resize',_resize);
        _resize();
    }
    $(function(){
        ui();
        ui_nav_main();
        isotope_gallery_services();
        ui_nav_fix_top();
    })
})(jQuery);
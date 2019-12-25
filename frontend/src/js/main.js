(function($){
    function ui() {
        // Select UI
        // $.fn.select2.defaults.set("width", "100%");
        // $('.select-ui').each(function () {
        //     var el = $(this);
        //     var selectUI = el.select2({
        //         placeholder: el.data('placeholder')
        //     });
    
        //     // Update UI Scroll - Open dropdown
        //     selectUI.on("select2:open", function (e) {
        //         var id = $('.select2-results  > .select2-results__options').attr('id');
        //         $('.select2-results').attr({ 'id': id + '-group' }).queue(function (next) {
        //             new SimpleBar($('#' + id + '-group')[0])
        //             next();
        //         });
        //     });
        // });
    
        // // Range UI
        // $('.range-ui').each(function (key) {
        //     var el = $(this);
        //     el.attr({ 'id': 'range-ui-' + key }).queue(function (next) {
        //         $("#range-ui-" + key).ionRangeSlider();
        //         next();
        //     });
        // });
    
        // // Scroll
        // $('.scroll-ui').each(function (key) {
        //     var el = $(this);
        //     el.attr({ 'id': 'scroll-ui-' + key }).queue(function (next) {
        //         new SimpleBar($('#' + el.attr('id'))[0])
        //         next();
        //     });
        // });
    
        // // File Browse UI
        // $('.file-ui .file-ui-input').change(function (e) {
        //     if (typeof e.target.files[0] !== 'undefined') {
        //         var fileName = e.target.files[0].name;
        //         $(this).siblings('.file-ui-label').text(fileName);
        //     }
        // });
    
        // // Parallax
        // $('[data-paroller-factor]').paroller();
        new WOW().init();
    }
    
    // Image svg
    function imgSVG() {
        $('img.svg').each(function () {
            var $img = $(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');
    
            $.get(imgURL, function (data) {
                // Get the SVG tag, ignore the rest
                var $svg = $(data).find('svg');
    
                // Add replaced image's ID to the new SVG
                if (typeof imgID !== 'undefined') {
                    $svg = $svg.attr('id', imgID);
                }
                // Add replaced image's classes to the new SVG
                if (typeof imgClass !== 'undefined') {
                    $svg = $svg.attr('class', imgClass + ' replaced-svg');
                }
    
                // Remove any invalid XML tags as per http://validator.w3.org
                $svg = $svg.removeAttr('xmlns:a');
    
                // Replace image with new SVG
                $img.replaceWith($svg);
    
            }, 'xml');
    
        });
    }
    
    function gotoTop() {
        var topTop = $('.toTop');
        $(window).scroll(function () {
            if ($(this).scrollTop() > 200) {
                topTop.addClass('active');
            } else {
                topTop.removeClass('active');
            }
        });
        topTop.click(function () {
            $('body,html').animate({
                scrollTop: 0
            }, 500);
            return false;
        });
    };
    function banner_slide_swiper(){
        var banner = new Swiper($(".home-wrapper .banner-home .swiper-container"), {
            slidesPerView: '1',
            effect: 'slide',
            spaceBetween: 0,
            simulateTouch:true,
            autoPlay: true,
            speed: 600,
            loop: true,
            allowTouchMove: true,
            parallax: true,
            pagination: {
                el: '.home-wrapper .banner-home .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.home-wrapper .banner-home .swiper-button-next',
                prevEl: '.home-wrapper .banner-home .swiper-button-prev',
            },
        });
    }
    function available_slide_swiper(){
        var $box = { isInitSwiper: false };
        if ($(".available-section .swiper-container").length < 1) { return };
        var _resize = function () {
            if ($(window).outerWidth() > 992) {
                if ($box.isInitSwiper) {
                    $box.destroy();
                    $box.isInitSwiper = false;
                }
            }
            else {
                if (!$box.isInitSwiper) {
                    $box = new Swiper($(".available-section .swiper-container"), {
                        slidesPerView: 'auto',
                        spaceBetween: 20,
                        effect: 'slide',
                    });
                    $box.isInitSwiper = true;
                }
            }
        }
        $(window).on('resize', _resize);
        _resize();
    }

    //Set height default for banner
    function banner_default_height(){
        let $banner = $(".home-wrapper .banner-home");
        let $tophead = $("#top-header");
        var _resize =()=>{
            if($(window).outerWidth()<=992){
                $banner.css({"height":$(window).height() - $tophead.outerHeight()});
                console.log( $tophead.height());
            }
            else{
                $banner.css({'height':''});
            }
        }
        $(window).on('resize',_resize);
        _resize();
    }

    $(function(){
        ui();
        banner_slide_swiper();
        banner_default_height();
        available_slide_swiper();
    });
})(jQuery);


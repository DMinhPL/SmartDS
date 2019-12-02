(function($){
    function about_swiper_slide(){
        //Reponsive slide Skill section
        const _slide = (sectionAbout)=>{
            var $box = { isInitSwiper: false };
            if ($(`.about-section-page ${sectionAbout} .swiper-container`).length < 1) { return };
            var _resize = function () {
                if ($(window).outerWidth() > 992) {
                    if ($box.isInitSwiper) {
                        $box.destroy();
                        $box.isInitSwiper = false;
                    }
                }
                else {
                    if (!$box.isInitSwiper) {
                        $box = new Swiper($(`.about-section-page ${sectionAbout} .swiper-container`), {
                            slidesPerView: 'auto',
                            spaceBetween: 16,
                            effect: 'slide',
                        });
                        $box.isInitSwiper = true;
                    }
                }
            }
            $(window).on('resize', _resize);
            _resize();
        };
        _slide(".about-skill-panel");
        _slide(".member-panel");
    }
    $(function(){
        about_swiper_slide();
    });
})(jQuery);
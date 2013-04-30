(function($) {
    $.fn.stickyNavbar = function() {
        var $navbar = this;
        var navbarTop = $navbar.offset().top;
        var navbarHeight = $navbar.outerHeight() + parseInt($navbar.css('margin-bottom'), 10);
        var $navbarPlaceholder = $('<div>').css({height: navbarHeight}).hide().insertBefore($navbar);

        var $win = $(window);
        var isFixed = false;

        function processScroll() {
            var scrollTop = $win.scrollTop();
            if (scrollTop >= navbarTop && !isFixed) {
                isFixed = true;
                $navbar.addClass('navbar-fixed-top');
                $navbarPlaceholder.show();
            } else if (scrollTop <= navbarTop && isFixed) {
                isFixed = false;
                $navbar.removeClass('navbar-fixed-top');
                $navbarPlaceholder.hide();
            }
        }

        processScroll();
        $win.on('scroll', processScroll);
    };

    $('[data-spy="sticky"]').each(function () {
        $(this).stickyNavbar();
    });
})(jQuery);

$(function() {
    $('a[href="#"]').click(function(e) { e.preventDefault(); });

    $('#menu').mmenu({
        extensions: ["border-none", "pageshadow", "pagedim-black"],
        "offCanvas": {
            "position": "right"
        },
        navbar: false,
        navbars: {
            content: ["close"],
            height: 2
        }
    });

    $('body').on('click', '.mm-listview .anchor', function() {
        var scrolled = $(this).attr('href');

        setTimeout(function() {
            $('html, body').animate({
                scrollTop: $(scrolled).offset().top - 50
            }, 1000);
        }, 400);
    });

    $('select').selectric({
        disableOnMobile: false,
        nativeOnMobile: false,
        responsive: true
    });

    $('select').on('selectric-change', function(event, element, selectric) {
        $('.certificates-list .item').removeClass('focused');
        $(this).parents('.item').addClass('focused');
    });

    /*! Mask for form's input */
    function inputMask() {
        $(".mask-date").mask("99.99.9999", { placeholder: "__.__.____" });
        $(".mask-year").mask("9999", { placeholder: "" });
        $(".mask-tel").mask("+7 (999) 999-99-99", { placeholder: "X" });
    };
    inputMask();

    // Маска для телефона
    $("[name=tel]").mask("+7(999) 999-99-99");
    //

    // Обработка форма на AJAX
    $.validator.addMethod("minlenghtphone", function(value, element) {
        return value.replace(/\D+/g, '').length > 10;
    }, "Введите полный номер.");

    $.validator.addMethod("requiredphone", function(value, element) {
        return value.replace(/\D+/g, '').length > 1;
    }, "Это поле необходимо заполнить.");

    $("#popup-action form").each(function() {
        $(this).validate({
            rules: {
                name: {
                    required: true,
                },
                tel: {
                    requiredphone: true,
                    minlenghtphone: true
                }
            },
            submitHandler: function(form, event) {
                event = event || window.event;
                $(form).ajaxSubmit({
                    success: function(responseText, statusText, xhr) {
                        window.location.replace("./");
                    }
                });
                return false;
            }
        });
    });

    $("#popup-callback form").each(function() {
        $(this).validate({
            rules: {
                name: {
                    required: true,
                },
                tel: {
                    requiredphone: true,
                    minlenghtphone: true
                }
            },
            submitHandler: function(form, event) {
                event = event || window.event;
                $(form).ajaxSubmit({
                    //dataType: 'script',
                    error: function() {
                        $('.success-trigger').trigger('click');
                    },
                    success: function(responseText, statusText, xhr) {
                        $('.form-input').val('');
                        $('.success-trigger').trigger('click');
                        // Появление "спасибо"
                    }
                });
                return false;
            }
        });
    });

    $('.form-input').on('blur', function() {
        $(this).removeClass('error');
    });

    $('.get-popup').on('click', function() {
        var title = $(this).data('title');
        $('#modal-title').text(title);
    });

    $('.get-popup').magnificPopup({
        type: 'inline'
    });

    $('.get-popup-action').magnificPopup({
        type: 'inline'
    });
    $(document).on('click', '.choose-cancel, #popup-remaining .cancel a', function(e) {
        e.preventDefault();
        $.magnificPopup.close();
    });





    $('.certificates-list .items').on('mouseleave', function() {





        $('.certificates-list .item').removeClass('focused');





    });











    function selectCards() {





        // Присвоение уникального идентификатора каждому сертификату





        unique = 0;











        function footerbottom() {





            var viewport = $(window).height();





            var page = $('.mm-page').height();











            if (viewport > page) {





                $('html').addClass('stack-footer');





            } else {





                $('html').removeClass('stack-footer');





            }





        }











        // Инициалзиция входной суммы для клиента





        var initial_sum = $('#total-sum').attr('data-client-sum');





        $('#total-sum, #initial-sum').text(initial_sum.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 "));





        $('.certificates-list .item .bottom .get-popup-action').on('click', function() {





            // Определение стоимости выбранного сертификата





            getCardSum = $(this).parents('.desc').find('.top').find('.selectric .label').text();





            cardSum = +(getCardSum.replace(/\s/g, ''));





            // Зависимости для добавления в следующие разделы





            selectedImage = $(this).parents('.item').find('.image img').attr('src');





            selectedName = $(this).parents('.item').find('.image img').attr('data-title');





        });











        $('.choose-submit').on('click', function() {





            unique++;





            // Определение количества средств на балансе





            var getTotalSum = $('#total-sum').text();





            var totalSum = +(getTotalSum.replace(/\s/g, ''));





            // Определение количества выбранных сертификатов





            var totalItems = +($('#total-items').text());





            // Вычисляем оставшуюся сумму средств после добавления сертификата





            var balance = totalSum - cardSum;





            var balanceTriads = balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");





            if (balance >= 0) {





                $('#total-sum').text(balanceTriads);





                totalItems++;





                $('#total-items').text(totalItems);











                // Добавление товаров





                $('#popup-cards .items').append('<div class="item" data-id="certificate-' + unique + '"><div class="image"><img src="' + selectedImage + '"/></div><div class="desc"><a data-sum-item="' + cardSum + '" class="remove-popup-cards-item" href="#">Убрать</a></div></div>');





                if ($('#popup-cards .items .item').length > 0) {





                    $('#popup-cards .no-items').hide();





                    $('.m_activate-cards .step-1 .lead .desc .next-step').show();





                } else {





                    $('#popup-cards .no-items').show();





                    $('.m_activate-cards .step-1 .lead .desc .next-step').hide();





                }





                $('.step-2 .selected-certificates').append('<li data-id="certificate-' + unique + '">«' + selectedName + '» – ' + getCardSum + ' руб.</li>');





                // Заканчиваем





                $.magnificPopup.close();





            } else {





                $.magnificPopup.close();





                setTimeout(function() {





                    $('#limit-trigger').trigger('click');





                }, 100);





            }





        });











        // Удаление товара





        $('body').on('click', '.remove-popup-cards-item', function() {





            // Стоимость сертификата





            var sum = +($(this).attr('data-sum-item'));





            // Определение количества средств на балансе





            var getTotalSum = $('#total-sum').text();





            var totalSum = +(getTotalSum.replace(/\s/g, ''));





            // Определение количества выбранных сертификатов





            var totalItems = +($('#total-items').text());





            // Возвращение суммы сертификата на общий баланс и изменение счетчика выбранных сертификатов





            var balance = totalSum + sum;





            var balanceTriads = balance.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1 ");





            $('#total-sum').text(balanceTriads);





            totalItems--;





            $('#total-items').text(totalItems);











            var unq = $(this).parents('.item').attr('data-id');





            $('.selected-certificates li').each(function() {





                if ($(this).attr('data-id') == unq) {





                    $(this).remove();





                }





            });





            // Удаление





            $(this).parents('.item').remove();





            // Остались ли добавленные сертификаты    





            if ($('#popup-cards .items .item').length > 0) {





                $('#popup-cards .no-items').hide();





                $('.m_activate-cards .step-1 .lead .desc .next-step').show();





            } else {





                $('#popup-cards .no-items').show();





                $('.m_activate-cards .step-1 .lead .desc .next-step').hide();





            };





            return false;





        });











        $('.step-1 .next-step').on('click', function() {





            $('#remaining-balance, #popup-remaining .remaining b').text($('#total-sum').text());





            if ($('#total-sum').text() == 0) {





                // Переходим ко второму шагу в форме





                $('.m_activate-cards .step-1').fadeOut('300', function() {





                    $('.m_activate-cards .step-2').fadeIn('300', function() {





                        footerbottom();





                    });





                    $("html, body").animate({ scrollTop: 0 }, 0);





                    return false;





                });





            } else {





                $('#rem-trigger').trigger('click');





            }





            return false;





        });











        // Переходим ко второму шагу в форме





        $('body').on('click', '#popup-remaining .submit a', function() {





            $.magnificPopup.close();





            $('.m_activate-cards .step-1').fadeOut('300', function() {





                $('.m_activate-cards .step-2').fadeIn('300', function() {





                    footerbottom();





                });





                $("html, body").animate({ scrollTop: 0 }, 0);





                return false;





            });





        });











        $('.step-2 .backward a').on('click', function() {





            $('.m_activate-cards .step-2').fadeOut('300', function() {





                $('.m_activate-cards .step-1').fadeIn('300', function() {





                    footerbottom();





                });





                $("html, body").animate({ scrollTop: 0 }, 0);





                return false;





            });





        });





    }





    if ($('#initial-sum').length) {





        selectCards();





    }

















    function mobilecardtabs() {





        $('.faq-item-header a').on('click', function() {





            if ($(this).hasClass('open')) {





                return false;





            } else {





                $('.faq-item-header a').removeClass('open');





                $(this).addClass('open');





                $('.faq-item-body').slideUp('300');





                $(this).parent().next().slideDown('300');





            }





        });











        $('.tab-header .item a').on('click', function() {





            var eq = $(this).parent().index();





            $('.tab-header .item').removeClass('current');





            $(this).parent().addClass('current');





            $('.tab-content .item').fadeOut(0);





            $('.tab-content .item').eq(eq).fadeIn(0);





        });





    }





    mobilecardtabs();











    function footerbottomouter() {





        var viewport = $(window).height();





        var page = $('.mm-page').height();











        if (viewport > page) {





            $('html').addClass('stack-footer');





        } else {





            $('html').removeClass('stack-footer');





        }





    }





    $(window).resize(footerbottomouter);























    function partnersFilters() {





        $('.m_partners .sidebar li a').on('click', function() {





            $('.m_partners .sidebar li a').removeClass('current');





            $(this).addClass('current');

















            $('.m_partners .items .item').removeClass('current');











            var filter = $(this).attr('data-filter');





            $('.m_partners .items .item').each(function() {





                if ($(this).attr('data-filter') == filter) {





                    $(this).addClass('current');





                }





            });











            var current_item = $(this).parent().index();











            $('#partner-filters-mobile').prop('selectedIndex', current_item).selectric('refresh');





        });





        var $select = $('#partner-filters-mobile');





        $select.selectric({





            disableOnMobile: false,





            nativeOnMobile: false,





            responsive: true,





            maxHeight: 500





        });





        $select.on('selectric-change', function(event, element, selectric) {





            var filter = $(this).val();





            $('.m_partners .items .item').removeClass('current');





            $('.m_partners .items .item').each(function() {





                if ($(this).attr('data-filter') == filter) {





                    $(this).addClass('current');





                }





            });











            $('.m_partners .sidebar li a').removeClass('current');





            $('.m_partners .sidebar li').each(function() {





                if ($(this).find('a').attr('data-filter') == filter) {





                    $(this).find('a').addClass('current');





                }





            });





        });





    }





    partnersFilters();











    function popups() {





        $('.call-popup').magnificPopup({





            type: 'inline',





            fixedContentPos: false,





            fixedBgPos: true,





            overflowY: 'auto',





            closeBtnInside: true,





            preloader: false,





            midClick: true,





            removalDelay: 300,





            mainClass: 'my-mfp-zoom-in'





        });





    };





    popups();











    $('[data-countdown]').each(function() {





        var $this = $(this),
            finalDate = $(this).data('countdown');





        $this.countdown(finalDate, function(event) {





            $this.html(event.strftime('<b>%H</b> <span>часы</span>  <b>%M</b> <span>минуты</span>'));





        });





    });











    $slick_slider = $('.certificates');





    settings = {





        dots: true,





        fade: true,





        arrows: false,





        adaptiveHeight: true





    }





    $slick_slider.slick(settings);











    // reslick only if it's not slick()





    $(window).on('load resize', function() {





        if ($(window).width() > 1200) {





            if ($slick_slider.hasClass('slick-initialized')) {





                $slick_slider.slick('unslick');





            }





            return





        }











        if (!$slick_slider.hasClass('slick-initialized')) {





            return $slick_slider.slick(settings);





        }





    });











    function loyalityCarousel() {





        var $status = $('.loyality-data .status');





        var $slickElement = $('.loyality');











        $slickElement.on('init reInit beforeChange', function(event, slick, currentSlide, nextSlide) {





            var i = (nextSlide ? nextSlide : 0) + 1;





            $status.html('<span class="current">' + i + '</span>' + '<span class="large">/</span>' + '<span class="total">' + slick.slideCount + '</span>');











        });











        $slickElement.on('beforeChange', function(event, slick, currentSlide, nextSlide) {





            var eq = nextSlide;





            $('.loyality-data .desc').text($('.loyality .slide').eq(eq).attr('data-desc'));





        });











        $slickElement.on('init reInit', function(event, slick, currentSlide, nextSlide) {





            $('.loyality-data .desc').text($('.loyality .slide').eq(0).attr('data-desc'));





        });











        $slickElement.slick({





            arrows: true,





            dots: true,





            infinite: false,





            appendDots: $('.loyality-dots')





        });





    };





    loyalityCarousel();











    function portfolioCarousel() {





        $('.portfolio-carousel').slick({





            arrows: true,





            dots: true,





            infinite: false,





            slidesToShow: 3,





            slidesToScroll: 3,





            appendDots: $('.portfolio-carousel-nav'),





            appendArrows: $('.portfolio-carousel-nav'),





            responsive: [{











                breakpoint: 992,





                settings: {





                    slidesToShow: 2,





                    slidesToScroll: 2,





                    arrows: false





                }











            }, {











                breakpoint: 640,





                settings: {





                    slidesToShow: 1,





                    slidesToScroll: 1,





                    arrows: false





                }











            }]





        });





    };





    portfolioCarousel();











    function animatePortfolioCarousel() {





        $(".m_s8 .body").mouseenter(function() {





            $(this).find('.end').addClass('active');





            $(this).find('li').removeClass('active');





            $(this).find('li').each(function(i) {





                var row = $(this);





                setTimeout(function() {





                    row.addClass('active');





                }, 150 * i);





            });





        }).mouseleave(function() {





            $(this).find('.end').removeClass('active');





            $(this).find('li').removeClass('active');





        });





    };





    animatePortfolioCarousel();











    function partnersCarousel() {





        $('.partners-carousel').slick({





            arrows: true,





            dots: true,





            infinite: false,





            appendDots: $('.partners-carousel-dots')





        });





    };





    partnersCarousel();
});
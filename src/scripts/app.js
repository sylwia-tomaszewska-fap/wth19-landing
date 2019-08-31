(function() {
  var menuButton = document.querySelector('#fixed-menu .hamburger'),
      sideMenu = document.getElementById('side-menu'),
      closeMenuButton = document.querySelector('#side-menu .close-button'),
      links = document.querySelectorAll('#side-menu a');

  menuButton.addEventListener('click', function(e) {
      sideMenu.className += "open";
      $("html").addClass("hide-scrollbar");
  });

  closeMenuButton.addEventListener('click', function(e) {
      sideMenu.className = "";
      $("html").removeClass("hide-scrollbar");
  });

  for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function(e) {
          sideMenu.className = "";
          $("html").removeClass("hide-scrollbar");
      });
  }
})();

(function($){
    $(document).ready(function(){

        AOS.init();

            // fix for bootstrap modal
      $(document.body).on('hide.bs.modal,hidden.bs.modal', function() {

        $('body').css('padding-right', '0');
        $('html').removeClass('hide-scrollbar');

        // fix for modal in modal
        setTimeout(function() {
            if ($('#allspeakers-modal').hasClass('show')) {
                $('body').addClass('modal-open');
                $('html').addClass('hide-scrollbar');
            }
        }, 500);

      });

      $(document.body).on('show.bs.modal', function() {

        setTimeout(function() {
            if ($('.modal.show .modal-dialog').outerHeight(true) > window.innerHeight) {
                $('html').addClass('hide-scrollbar');
            }
        }, 200)

      });

      
      $('.testimonials-carousel').slick({
        autoplay:true,
        prevArrow:'<button type="button" class="slick-prev"></button>',
        nextArrow:'<button type="button" class="slick-next"></button>'
      });


      // agenda
    $(document).ready(function() {
      $('.hourslist').on('show.bs.collapse', function() {
          $(this).prev('.theme__container').addClass('active');
      });

      $('.hourslist').on('hide.bs.collapse', function() {
          $(this).prev('.theme__container').removeClass('active');
      });

      $('.hourslist__item').on('show.bs.collapse', function(e) {
          e.stopPropagation();
      });

      $('.hourslist__item').on('hide.bs.collapse', function(e) {
          e.stopPropagation();
      });

      $('.tematyczny').click(function() {
          $('#agenda-tematyczna').css({ display: "block" });
          $('#agenda-godzinowa').css({ display: "none" });
      });
      $('.godzinowy').click(function() {
          $('#agenda-tematyczna').css({ display: "none" });
          $('#agenda-godzinowa').css({ display: "block" });
      });
    });




//header buttons changin after first section
window.addEventListener('scroll', function() {
  var topSection = document.getElementById('top'),
      dims = topSection.getBoundingClientRect(),
      hc = document.querySelector('.hamburger-container'),
      rb = document.querySelector('.register-button.top');


  if (window.pageYOffset > dims.height) {
      // hc.className = "hamburger-container active";
      rb.className = "register-button top  active";
      $('.login-button').first()[0].className = 'login-button';
      $('a.scroll-top').addClass('in');

  } else {
      // hc.className = 'hamburger-container';
      rb.className = "register-button top";
      $('.login-button').first()[0].className = ('login-button active');
      $('a.scroll-top').removeClass('in');
  }
});

//recomend and remind send
$(document).ready(function() {

  $('#recomend-modal .button').click(function() {
      $('#recomend-modal .confirmation').addClass('active');
  });

  $('#recomend-modal .pcwindow__header img').click(function() {
      $('#recomend-modal .confirmation').removeClass('active');
      $('#recomend-modal textarea').val('');
  });

  $('#remind-modal .button').click(function() {
      $('#remind-modal .confirmation').addClass('active');
  });

  $('#remind-modal .pcwindow__header img').click(function() {
      $('#remind-modal .confirmation').removeClass('active');
      $('#remind-modal input').val('');
  });
});

$(document).ready(function () {
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  
  if (width < 776) {
      setTimeout(function () {
          $('#toggleMobile').trigger('click');
      }, 10000);
  }

});



    }); 

    
var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

function initSlickCarousel() {
    $('.prelegenci-carousel').slick({
        autoplay: true,
        autoplaySpeed: 2000,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        arrows:true,
        prevArrow:'<button type="button" class="slick-prev"></button>',
        nextArrow:'<button type="button" class="slick-next"></button>',
        responsive: [{
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: false,
                    arrows:false
                }
            },
            {
                breakpoint: 900,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
}

// prelegenci carousel
window.addEventListener("load", function() {
    if (isIE11) {
        setTimeout(function() {
            initSlickCarousel();
            AOS.refresh();
        }, 2000)
    } else {
        setTimeout(function() {
            initSlickCarousel();
            AOS.refresh();
        }, 2000)
    }
});

  })(jQuery); 
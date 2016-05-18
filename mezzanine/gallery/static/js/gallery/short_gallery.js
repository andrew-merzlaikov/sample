(function ($) {
    $(document).ready(function () {
        $(".gallery-show").click(function (e) {
            e.preventDefault();

            $('.gallery-show-block').bPopup({
                onClose: function() { $('#f-gallery').html(''); }
            });
            $('.gallery-show-block').find('.gallery-title').html($(this).attr('title'))

            fancygallery($(this).data('url-gallery'), $(this));
        });

        function fancygallery(link, object) {
            $.get(link, function(data){
                if (data.success){
                    var img_data = data.photos;
                    $("#f-gallery").PikaChoose({
                        'data':img_data,
                        'carousel':true,
                        'hoverPause':true,
                        'autoPlay':false
                    });
                }
            }, 'json');
        };

    });
})(jQuery);
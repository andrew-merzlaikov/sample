//    tinyMCEPopup.requireLangPack();
    var GalleryDialog = {
        init : function() {
            var form = document.forms[0];
            $.get('/gallery/get_all_gallery/', function(data) {
                if (data.success){
                    var $content = $('.gallery');
                    $.each(data.gallery, function(key, value) {
                        var text = '';
                        text += '<div class="gallery-item"><label><div class="pull-left"><input type="radio" name="list_gallery" value="' + value.id + '"><div class="img-box" style="background-size:contain;background-position:center center;background-repeat:no-repeat;background-image:url(' + value.cover + ');"></div></div><div class="pull-left"><span>' + value.title;
                        text += '</span><br><b>Дата создания:' + value.created + '</b><br><b>Теги: ' + value.tags + '</b></label></div></div>';
                        $content.append(text);
                    });
                }
            }, "json");
            $("#gallery-filter").on('keyup', function(){
                var filter = $(this).val(), count = 0;

                $(".gallery > .gallery-item").each(function(){
                    if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                        $(this).fadeOut();
                    } else {
                        $(this).show();
                        count++;
                    }
                });
            });
            $(".vDateField").on('focus', function(){
                var filter = $(this).val(), count = 0;

                $(".gallery > .gallery-item").each(function(){
                    if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                        $(this).fadeOut();
                    } else {
                        $(this).show();
                        count++;
                    }
                });
            });
        },

        insert : function() {
            if ($('input[name="list_gallery"]').is(':checked') && $('#name_gallery').val()){
                var type = 'data-type="circle"';
                if($('#type_gallery').val()==1){
                    type = 'data-type="small"';
                }else{
                    if($('#type_gallery').val()==2){
                        type = 'data-type="big"';
                    }
                }
                var value = $('input[name="list_gallery"]:checked').val();
                var text = $('#name_gallery').val();
                var gallery = '[gallery]<a class="specialGallery" ' + type + ' data-pk="' + value + '" href="#" data-text="' + text + '">' + text + '</a>[/gallery]';
                tinyMCEPopup.editor.execCommand('mceInsertContent', false, gallery);
                tinyMCEPopup.close();
            }
        }
    };
    tinyMCEPopup.onInit.add(GalleryDialog.init, GalleryDialog);

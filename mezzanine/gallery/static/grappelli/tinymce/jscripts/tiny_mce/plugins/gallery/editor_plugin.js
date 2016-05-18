(function() {
    // Load plugin specific language pack
    tinymce.PluginManager.requireLangPack('gallery');
    tinymce.create('tinymce.plugins.Gallery', {
        /**
         * Initializes the plugin, this will be executed after the plugin has been created.
         * This call is done before the editor instance has finished it's initialization so use the onInit event
         * of the editor instance to intercept that event.
         *
         * @param {tinymce.Editor} ed Editor instance that the plugin is initialized in.
         * @param {string} url Absolute URL to where the plugin is located.
         */


        init : function(ed, url) {

            var data = {
                title: 'Вставка галереи',
                params: {}
            };

            ed.addCommand('mceGallery', function() {
                ed.windowManager.open({
                    file : url + '/gallery.htm',
                    width : 600,
                    height : 390,
                    inline : 1
                }, {
                    plugin_url : url,
                    data : data
                });
            });

            // Register example button
            ed.addButton('gallery', {
                image: '/static/img/tinymce/3.png',
                title: 'Галерея',
                tooltip: 'Добавить галерею',
                cmd : 'mceGallery',
                stateSelector: 'img:not([data-mce-object],[data-mce-placeholder])'
            });

            // Add a node change handler, selects the button in the UI when a image is selected
//            ed.onNodeChange.add(function(ed, cm, n) {
//                cm.setActive('gallery', n.nodeName == 'IMG');
//            });
        },

        /**
         * Creates control instances based in the incomming name. This method is normally not
         * needed since the addButton method of the tinymce.Editor class is a more easy way of adding buttons
         * but you sometimes need to create more complex controls like listboxes, split buttons etc then this
         * method can be used to create those.
         *
         * @param {String} n Name of the control to create.
         * @param {tinymce.ControlManager} cm Control manager to use inorder to create new control.
         * @return {tinymce.ui.Control} New control instance or null if no control was created.
         */
        createControl : function(n, cm) {
            return null;
        },

        /**
         * Returns information about the plugin as a name/value array.
         * The current keys are longname, author, authorurl, infourl and version.
         *
         * @return {Object} Name/value array containing information about the plugin.
         */
        getInfo : function() {
            return {
                longname : 'Gallery from Fogstream',
                author : 'Fogstream',
                authorurl : 'http://fogstream.ru',
                version : "1.0"
            };
        }
    });

    // Register plugin
    tinymce.PluginManager.add('gallery', tinymce.plugins.Gallery);
})();
















//
//
//tinymce.PluginManager.add('gallery', function(editor) {
//    function getImageSize(url, callback) {
//        var img = document.createElement('img');
//
//        function done(width, height) {
//            if (img.parentNode) {
//                img.parentNode.removeChild(img);
//            }
//
//            callback({width: width, height: height});
//        }
//
//        img.onload = function() {
//            done(img.clientWidth, img.clientHeight);
//        };
//
//        img.onerror = function() {
//            done();
//        };
//
//        var style = img.style;
//        style.visibility = 'hidden';
//        style.position = 'fixed';
//        style.bottom = style.left = 0;
//        style.width = style.height = 'auto';
//
//        document.body.appendChild(img);
//        img.src = url;
//    }
//
//    function createImageList(callback) {
//        return function() {
//            var imageList = editor.settings.image_list;
//
//            if (typeof(imageList) == "string") {
//                tinymce.util.XHR.send({
//                    url: imageList,
//                    success: function(text) {
//                        callback(tinymce.util.JSON.parse(text));
//                    }
//                });
//            } else {
//                callback(imageList);
//            }
//        };
//    }
//
//    function showDialog(imageList) {
//        var win, data = {}, dom = editor.dom, imgElm = editor.selection.getNode();
//        var width, height, imageListCtrl, classListCtrl;
//
//        function buildValues(listSettingName, dataItemName, defaultItems) {
//            var selectedItem, items = [];
//
//            tinymce.each(editor.settings[listSettingName] || defaultItems, function(target) {
//                var item = {
//                    text: target.text || target.title,
//                    value: target.value
//                };
//
//                items.push(item);
//
//                if (data[dataItemName] === target.value || (!selectedItem && target.selected)) {
//                    selectedItem = item;
//                }
//            });
//
//            if (selectedItem && !data[dataItemName]) {
//                data[dataItemName] = selectedItem.value;
//                selectedItem.selected = true;
//            }
//
//            return items;
//        }
//
//        function buildImageList() {
//            var imageListItems = [{text: 'None', value: ''}];
//
//            tinymce.each(imageList, function(image) {
//                imageListItems.push({
//                    text: image.text || image.title,
//                    value: editor.convertURL(image.value || image.url, 'src'),
//                    menu: image.menu
//                });
//            });
//
//            return imageListItems;
//        }
//
//        function recalcSize() {
//            var widthCtrl, heightCtrl, newWidth, newHeight;
//
//            widthCtrl = win.find('#width')[0];
//            heightCtrl = win.find('#height')[0];
//
//            newWidth = widthCtrl.value();
//            newHeight = heightCtrl.value();
//
//            if (win.find('#constrain')[0].checked() && width && height && newWidth && newHeight) {
//                if (width != newWidth) {
//                    newHeight = Math.round((newWidth / width) * newHeight);
//                    heightCtrl.value(newHeight);
//                } else {
//                    newWidth = Math.round((newHeight / height) * newWidth);
//                    widthCtrl.value(newWidth);
//                }
//            }
//
//            width = newWidth;
//            height = newHeight;
//        }
//
//        function onSubmitForm() {
//            function waitLoad(imgElm) {
//                function selectImage() {
//                    imgElm.onload = imgElm.onerror = null;
//                    editor.selection.select(imgElm);
//                    editor.nodeChanged();
//                }
//
//                imgElm.onload = function() {
//                    if (!data.width && !data.height) {
//                        dom.setAttribs(imgElm, {
//                            width: imgElm.clientWidth,
//                            height: imgElm.clientHeight
//                        });
//                    }
//
//                    selectImage();
//                };
//
//                imgElm.onerror = selectImage;
//            }
//
//            updateStyle();
//            recalcSize();
//
//            data = tinymce.extend(data, win.toJSON());
//
//            if (data.width === '') {
//                data.width = null;
//            }
//
//            if (data.height === '') {
//                data.height = null;
//            }
//
//            if (data.style === '') {
//                data.style = null;
//            }
//
//            data = {
//                src: data.src,
//                alt: data.alt,
//                width: data.width,
//                height: data.height,
//                style: data.style,
//                "class": data["class"]
//            };
//
//            if (!data["class"]) {
//                delete data["class"];
//            }
//
//            editor.undoManager.transact(function() {
//                if (!data.src) {
//                    if (imgElm) {
//                        dom.remove(imgElm);
//                        editor.focus();
//                        editor.nodeChanged();
//                    }
//
//                    return;
//                }
//
//                if (!imgElm) {
//                    data.id = '__mcenew';
//                    editor.focus();
//                    editor.selection.setContent(dom.createHTML('img', data));
//                    imgElm = dom.get('__mcenew');
//                    dom.setAttrib(imgElm, 'id', null);
//                } else {
//                    dom.setAttribs(imgElm, data);
//                }
//
//                waitLoad(imgElm);
//            });
//        }
//
//        function removePixelSuffix(value) {
//            if (value) {
//                value = value.replace(/px$/, '');
//            }
//
//            return value;
//        }
//
//        function srcChange() {
//            if (imageListCtrl) {
//                imageListCtrl.value(editor.convertURL(this.value(), 'src'));
//            }
//
//            getImageSize(this.value(), function(data) {
//                if (data.width && data.height) {
//                    width = data.width;
//                    height = data.height;
//
//                    win.find('#width').value(width);
//                    win.find('#height').value(height);
//                }
//            });
//        }
//
//        width = dom.getAttrib(imgElm, 'width');
//        height = dom.getAttrib(imgElm, 'height');
//
//        if (imgElm.nodeName == 'IMG' && !imgElm.getAttribute('data-mce-object') && !imgElm.getAttribute('data-mce-placeholder')) {
//            data = {
//                src: dom.getAttrib(imgElm, 'src'),
//                alt: dom.getAttrib(imgElm, 'alt'),
//                "class": dom.getAttrib(imgElm, 'class'),
//                width: width,
//                height: height
//            };
//        } else {
//            imgElm = null;
//        }
//
//        if (imageList) {
//            imageListCtrl = {
//                type: 'listbox',
//                label: 'Image list',
//                values: buildImageList(),
//                value: data.src && editor.convertURL(data.src, 'src'),
//                onselect: function(e) {
//                    var altCtrl = win.find('#alt');
//
//                    if (!altCtrl.value() || (e.lastControl && altCtrl.value() == e.lastControl.text())) {
//                        altCtrl.value(e.control.text());
//                    }
//
//                    win.find('#src').value(e.control.value());
//                },
//                onPostRender: function() {
//                    imageListCtrl = this;
//                }
//            };
//        }
//
//        if (editor.settings.image_class_list) {
//            classListCtrl = {
//                name: 'class',
//                type: 'listbox',
//                label: 'Class',
//                values: buildValues('image_class_list', 'class')
//            };
//        }
//
//        // General settings shared between simple and advanced dialogs
//        var generalFormItems = [
//            {name: 'src', type: 'filepicker', filetype: 'image', label: 'Source', autofocus: true, onchange: srcChange},
//            imageListCtrl,
//            {name: 'alt', type: 'textbox', label: 'Image description'},
//            {
//                type: 'container',
//                label: 'Dimensions',
//                layout: 'flex',
//                direction: 'row',
//                align: 'center',
//                spacing: 5,
//                items: [
//                    {name: 'width', type: 'textbox', maxLength: 5, size: 3, onchange: recalcSize, ariaLabel: 'Width'},
//                    {type: 'label', text: 'x'},
//                    {name: 'height', type: 'textbox', maxLength: 5, size: 3, onchange: recalcSize, ariaLabel: 'Height'},
//                    {name: 'constrain', type: 'checkbox', checked: true, text: 'Constrain proportions'}
//                ]
//            },
//            classListCtrl
//        ];
//
//        function updateStyle() {
//            function addPixelSuffix(value) {
//                if (value.length > 0 && /^[0-9]+$/.test(value)) {
//                    value += 'px';
//                }
//
//                return value;
//            }
//
//            if (!editor.settings.image_advtab) {
//                return;
//            }
//
//            var data = win.toJSON();
//            var css = dom.parseStyle(data.style);
//
//            delete css.margin;
//            css['margin-top'] = css['margin-bottom'] = addPixelSuffix(data.vspace);
//            css['margin-left'] = css['margin-right'] = addPixelSuffix(data.hspace);
//            css['border-width'] = addPixelSuffix(data.border);
//
//            win.find('#style').value(dom.serializeStyle(dom.parseStyle(dom.serializeStyle(css))));
//        }
//
//        if (editor.settings.image_advtab) {
//            // Parse styles from img
//            if (imgElm) {
//                data.hspace = removePixelSuffix(imgElm.style.marginLeft || imgElm.style.marginRight);
//                data.vspace = removePixelSuffix(imgElm.style.marginTop || imgElm.style.marginBottom);
//                data.border = removePixelSuffix(imgElm.style.borderWidth);
//                data.style = editor.dom.serializeStyle(editor.dom.parseStyle(editor.dom.getAttrib(imgElm, 'style')));
//            }
//
//            // Advanced dialog shows general+advanced tabs
//            win = editor.windowManager.open({
//                title: 'Insert/edit image',
//                data: data,
//                bodyType: 'tabpanel',
//                body: [
//                    {
//                        title: 'General',
//                        type: 'form',
//                        items: generalFormItems
//                    },
//
//                    {
//                        title: 'Advanced',
//                        type: 'form',
//                        pack: 'start',
//                        items: [
//                            {
//                                label: 'Style',
//                                name: 'style',
//                                type: 'textbox'
//                            },
//                            {
//                                type: 'form',
//                                layout: 'grid',
//                                packV: 'start',
//                                columns: 2,
//                                padding: 0,
//                                alignH: ['left', 'right'],
//                                defaults: {
//                                    type: 'textbox',
//                                    maxWidth: 50,
//                                    onchange: updateStyle
//                                },
//                                items: [
//                                    {label: 'Vertical space', name: 'vspace'},
//                                    {label: 'Horizontal space', name: 'hspace'},
//                                    {label: 'Border', name: 'border'}
//                                ]
//                            }
//                        ]
//                    }
//                ],
//                onSubmit: onSubmitForm
//            });
//        } else {
//            // Simple default dialog
//            win = editor.windowManager.open({
//                title: 'Insert/edit image',
//                data: data,
//                body: generalFormItems,
//                onSubmit: onSubmitForm
//            });
//        }
//    }
//
//    editor.addButton('gallery', {
//        image: '/static/img/tinymce/3.png',
//        title: 'Галерея',
//        tooltip: 'Добавить галерею',
//        onclick: createImageList(showDialog),
//        stateSelector: 'img:not([data-mce-object],[data-mce-placeholder])'
//    });
//
//});

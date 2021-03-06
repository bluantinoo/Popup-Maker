/**
 * Popup Maker v1.4
 */

var PopMakeAdmin, PUM_Admin;
(function ($, document, undefined) {
    "use strict";

    var $document = $(document),
        I10n = pum_admin.I10n,
        defaults = pum_admin.defaults;

    PUM_Admin = {};

    PopMakeAdmin = {
        init: function () {
            //PopMakeAdmin.initialize_tabs();
            if ($('body.post-type-popup form#post').length) {
                PopMakeAdmin.initialize_popup_page();
            }
            if ($('body.post-type-popup_theme form#post').length) {
                PopMakeAdmin.initialize_theme_page();
            }
        },
        initialize_popup_page: function () {
            var update_size = function () {
                    if ($("#popup_display_size").val() === 'custom') {
                        $('.custom-size-only').show();
                        $('.responsive-size-only').hide();
                        if ($('#popup_display_custom_height_auto').is(':checked')) {
                            $('.custom-size-height-only').hide();
                        } else {
                            $('.custom-size-height-only').show();
                        }
                    } else {
                        $('.custom-size-only').hide();
                        if ($("#popup_display_size").val() !== 'auto') {
                            $('.responsive-size-only').show();
                            $('#popup_display_custom_height_auto').prop('checked', false);
                        } else {
                            $('.responsive-size-only').hide();
                        }
                    }
                },
                update_animation = function () {
                    $('.animation-speed, .animation-origin').hide();
                    if ($("#popup_display_animation_type").val() === 'fade') {
                        $('.animation-speed').show();
                    } else {
                        if ($("#popup_display_animation_type").val() !== 'none') {
                            $('.animation-speed, .animation-origin').show();
                        }
                    }
                },
                update_location = function () {
                    var $this = $('#popup_display_location'),
                        table = $this.parents('table'),
                        val = $this.val();
                    $('tr.top, tr.right, tr.left, tr.bottom', table).hide();
                    if (val.indexOf("top") >= 0) {
                        $('tr.top').show();
                    }
                    if (val.indexOf("left") >= 0) {
                        $('tr.left').show();
                    }
                    if (val.indexOf("bottom") >= 0) {
                        $('tr.bottom').show();
                    }
                    if (val.indexOf("right") >= 0) {
                        $('tr.right').show();
                    }
                };

            $('#popuptitlediv').insertAfter('#titlediv');

            $('#title').prop('required', true);

            $(document)
                .on('change', '#popup_theme', function () {
                    var $this = $(this),
                        $link = $('#edit_theme_link'),
                        val = $this.val();

                    $link.attr('href', $link.data('baseurl')+val);
                })
                .on('keydown', '#popuptitle', function (event) {
                    var keyCode = event.keyCode || event.which;
                    if (9 === keyCode) {
                        event.preventDefault();
                        $('#title').focus();
                    }
                })
                .on('keydown', '#title, #popuptitle', function (event) {
                    var keyCode = event.keyCode || event.which,
                        target;
                    if (!event.shiftKey && 9 === keyCode) {
                        event.preventDefault();
                        target = $(this).attr('id') === 'title' ? '#popuptitle' : '#insert-media-button';
                        $(target).focus();
                    }
                })
                .on('keydown', '#popuptitle, #insert-media-button', function (event) {
                    var keyCode = event.keyCode || event.which,
                        target;
                    if (event.shiftKey && 9 === keyCode) {
                        event.preventDefault();
                        target = $(this).attr('id') === 'popuptitle' ? '#title' : '#popuptitle';
                        $(target).focus();
                    }
                })
                .on('click', '#popup_display_custom_height_auto', function () {
                    update_size();
                })
                .on('change', "#popup_display_size", function () {
                    if ($("#popup_display_size").val() !== 'custom' && $("#popup_display_size").val() !== 'auto') {
                        $('#popup_display_position_fixed, #popup_display_scrollable_content').prop('checked', false);
                    }
                    update_size();
                })
                .on('change', "#popup_display_animation_type", function () {
                    update_animation();
                })
                .on('change', '#popup_display_location', function () {
                    update_location();
                });

            update_size();
            update_animation();
            update_location();
        },
        theme_page_listeners: function () {
            var self = this;

            $('.empreview .example-popup-overlay, .empreview .example-popup, .empreview .title, .empreview .content, .empreview .close-popup').css('cursor', 'pointer');
            $(document)
                .on('click', '.empreview .example-popup-overlay, .empreview .example-popup, .empreview .title, .empreview .content, .empreview .close-popup', function (event) {
                    var $this = $(this),
                        clicked_class = $this.attr('class'),
                        pos = 0;

                    event.preventDefault();
                    event.stopPropagation();

                    switch( clicked_class) {
                    case 'example-popup-overlay':
                        pos = $('#popmake_popup_theme_overlay').offset().top;
                        break;
                    case 'example-popup':
                        pos = $('#popmake_popup_theme_container').offset().top;
                        break;
                    case 'title':
                        pos = $('#popmake_popup_theme_title').offset().top;
                        break;
                    case 'content':
                        pos = $('#popmake_popup_theme_content').offset().top;
                        break;
                    case 'close-popup':
                        pos = $('#popmake_popup_theme_close').offset().top;
                        break;
                    }

                    $("html, body").animate({
                        scrollTop: pos + 'px'
                    });
                })
                .on('change', 'select.font-family', function () {
                    $('select.font-weight option, select.font-style option', $(this).parents('table')).prop('selected', false);
                    self.update_font_selectboxes();
                })
                .on('change', 'select.font-weight, select.font-style', function () {
                    self.update_font_selectboxes();
                })
                .on('change input focusout', 'select, input', function () {
                    self.update_theme();
                })
                .on('change', 'select.border-style', function () {
                    var $this = $(this);
                    if ($this.val() === 'none') {
                        $this.parents('table').find('.border-options').hide();
                    } else {
                        $this.parents('table').find('.border-options').show();
                    }
                })
                .on('change', '#popup_theme_close_location', function () {
                    var $this = $(this),
                        table = $this.parents('table');
                    $('tr.topleft, tr.topright, tr.bottomleft, tr.bottomright', table).hide();
                    $('tr.' + $this.val(), table).show();
                });
        },
        update_theme: function () {
            var form_values = $("[name^='popup_theme_']").serializeArray(),
                theme = {},
                i;
            for (i = 0; form_values.length > i; i += 1) {
                if (form_values[i].name.indexOf('popup_theme_') === 0) {
                    theme[form_values[i].name.replace('popup_theme_', '')] = form_values[i].value;
                }
            }
            this.retheme_popup(theme);
        },
        theme_preview_scroll: function () {
            var $preview = $('#popmake-theme-editor .empreview, body.post-type-popup_theme form#post #popmake_popup_theme_preview'),
                $parent = $preview.parent(),
                startscroll = $preview.offset().top - 50;
            $(window).on('scroll', function () {
                if ($('> .postbox:visible', $parent).index($preview) === ($('> .postbox:visible', $parent).length - 1) && $(window).scrollTop() >= startscroll) {
                    $preview.css({
                        left: $preview.offset().left,
                        width: $preview.width(),
                        height: $preview.height(),
                        position: 'fixed',
                        top: 50
                    });
                } else {
                    $preview.removeAttr('style');
                }
            });
        },
        update_font_selectboxes: function () {
            return $('select.font-family').each(function () {
                var $this = $(this),
                    $font_weight = $this.parents('table').find('select.font-weight'),
                    $font_style = $this.parents('table').find('select.font-style'),
                    $font_weight_options = $font_weight.find('option'),
                    $font_style_options = $font_style.find('option'),
                    font,
                    i;


                // Google Font Chosen
                if (popmake_google_fonts[$this.val()] !== undefined) {
                    font = popmake_google_fonts[$this.val()];

                    $font_weight_options.hide();
                    $font_style_options.hide();

                    if (font.variants.length) {
                        for (i = 0; font.variants.length > i; i += 1) {
                            if (font.variants[i] === 'regular') {
                                $('option[value=""]', $font_weight).show();
                                $('option[value=""]', $font_style).show();
                            } else {
                                if (font.variants[i].indexOf('italic') >= 0) {

                                    $('option[value="italic"]', $font_style).show();
                                }
                                $('option[value="' + parseInt(font.variants[i], 10) + '"]', $font_weight).show();
                            }
                        }
                    }
                    // Standard Font Chosen
                } else {
                    $font_weight_options.show();
                    $font_style_options.show();
                }

                $font_weight.parents('tr:first').show();
                if ($font_weight.find('option:visible').length <= 1) {
                    $font_weight.parents('tr:first').hide();
                } else {
                    $font_weight.parents('tr:first').show();
                }

                $font_style.parents('tr:first').show();
                if ($font_style.find('option:visible').length <= 1) {
                    $font_style.parents('tr:first').hide();
                } else {
                    $font_style.parents('tr:first').show();
                }
            });
        },
        convert_theme_for_preview: function (theme) {
            return;
            //$.fn.popmake.themes[popmake_default_theme] = PUMUtils.convert_meta_to_object(theme);
        },
        initialize_theme_page: function () {
            $('#popuptitlediv').insertAfter('#titlediv');

            var self = this,
                table = $('#popup_theme_close_location').parents('table');
            self.update_theme();
            self.theme_page_listeners();
            self.theme_preview_scroll();
            self.update_font_selectboxes();

            $(document)
                .on('click', '.popmake-preview', function (e) {
                    e.preventDefault();
                    $('#popmake-preview, #popmake-overlay').css({visibility: "visible"}).show();
                })
                .on('click', '.popmake-close', function () {
                    $('#popmake-preview, #popmake-overlay').hide();
                });

            $('select.border-style').each(function () {
                var $this = $(this);
                if ($this.val() === 'none') {
                    $this.parents('table').find('.border-options').hide();
                } else {
                    $this.parents('table').find('.border-options').show();
                }
            });

            $('.color-picker.background-color').each(function () {
                var $this = $(this);
                if ($this.val() === '') {
                    $this.parents('table').find('.background-opacity').hide();
                } else {
                    $this.parents('table').find('.background-opacity').show();
                }
            });

            $('tr.topleft, tr.topright, tr.bottomleft, tr.bottomright', table).hide();
            switch ($('#popup_theme_close_location').val()) {
            case "topleft":
                $('tr.topleft', table).show();
                break;
            case "topright":
                $('tr.topright', table).show();
                break;
            case "bottomleft":
                $('tr.bottomleft', table).show();
                break;
            case "bottomright":
                $('tr.bottomright', table).show();
                break;
            }
        },
        retheme_popup: function (theme) {
            var $overlay = $('.empreview .example-popup-overlay, #popmake-overlay'),
                $container = $('.empreview .example-popup, #popmake-preview'),
                $title = $('.title, .popmake-title', $container),
                $content = $('.content, .popmake-content', $container),
                $close = $('.close-popup, .popmake-close', $container),
                container_inset = theme.container_boxshadow_inset === 'yes' ? 'inset ' : '',
                close_inset = theme.close_boxshadow_inset === 'yes' ? 'inset ' : '',
                link;

            this.convert_theme_for_preview(theme);

            if (popmake_google_fonts[theme.title_font_family] !== undefined) {

                link = "//fonts.googleapis.com/css?family=" + theme.title_font_family;

                if (theme.title_font_weight !== 'normal') {
                    link += ":" + theme.title_font_weight;
                }
                if (theme.title_font_style === 'italic') {
                    if (link.indexOf(':') === -1) {
                        link += ":";
                    }
                    link += "italic";
                }
                $('body').append('<link href="' + link + '" rel="stylesheet" type="text/css">');
            }
            if (popmake_google_fonts[theme.content_font_family] !== undefined) {

                link = "//fonts.googleapis.com/css?family=" + theme.content_font_family;

                if (theme.content_font_weight !== 'normal') {
                    link += ":" + theme.content_font_weight;
                }
                if (theme.content_font_style === 'italic') {
                    if (link.indexOf(':') === -1) {
                        link += ":";
                    }
                    link += "italic";
                }
                $('body').append('<link href="' + link + '" rel="stylesheet" type="text/css">');
            }
            if (popmake_google_fonts[theme.close_font_family] !== undefined) {

                link = "//fonts.googleapis.com/css?family=" + theme.close_font_family;

                if (theme.close_font_weight !== 'normal') {
                    link += ":" + theme.close_font_weight;
                }
                if (theme.close_font_style === 'italic') {
                    if (link.indexOf(':') === -1) {
                        link += ":";
                    }
                    link += "italic";
                }
                $('body').append('<link href="' + link + '" rel="stylesheet" type="text/css">');
            }

            $overlay.removeAttr('style').css({
                backgroundColor: PUMUtils.convert_hex(theme.overlay_background_color, theme.overlay_background_opacity)
            });
            $container.removeAttr('style').css({
                padding: theme.container_padding + 'px',
                backgroundColor: PUMUtils.convert_hex(theme.container_background_color, theme.container_background_opacity),
                borderStyle: theme.container_border_style,
                borderColor: theme.container_border_color,
                borderWidth: theme.container_border_width + 'px',
                borderRadius: theme.container_border_radius + 'px',
                boxShadow: container_inset + theme.container_boxshadow_horizontal + 'px ' + theme.container_boxshadow_vertical + 'px ' + theme.container_boxshadow_blur + 'px ' + theme.container_boxshadow_spread + 'px ' + PUMUtils.convert_hex(theme.container_boxshadow_color, theme.container_boxshadow_opacity)
            });
            $title.removeAttr('style').css({
                color: theme.title_font_color,
                lineHeight: theme.title_line_height + 'px',
                fontSize: theme.title_font_size + 'px',
                fontFamily: theme.title_font_family,
                fontStyle: theme.title_font_style,
                fontWeight: theme.title_font_weight,
                textAlign: theme.title_text_align,
                textShadow: theme.title_textshadow_horizontal + 'px ' + theme.title_textshadow_vertical + 'px ' + theme.title_textshadow_blur + 'px ' + PUMUtils.convert_hex(theme.title_textshadow_color, theme.title_textshadow_opacity)
            });
            $content.removeAttr('style').css({
                color: theme.content_font_color,
                //fontSize: theme.content_font_size+'px',
                fontFamily: theme.content_font_family,
                fontStyle: theme.content_font_style,
                fontWeight: theme.content_font_weight
            });
            $close.html(theme.close_text).removeAttr('style').css({
                padding: theme.close_padding + 'px',
                height: theme.close_height > 0 ? theme.close_height + 'px' : 'auto',
                width: theme.close_width > 0 ? theme.close_width + 'px' : 'auto',
                backgroundColor: PUMUtils.convert_hex(theme.close_background_color, theme.close_background_opacity),
                color: theme.close_font_color,
                lineHeight: theme.close_line_height + 'px',
                fontSize: theme.close_font_size + 'px',
                fontFamily: theme.close_font_family,
                fontWeight: theme.close_font_weight,
                fontStyle: theme.close_font_style,
                borderStyle: theme.close_border_style,
                borderColor: theme.close_border_color,
                borderWidth: theme.close_border_width + 'px',
                borderRadius: theme.close_border_radius + 'px',
                boxShadow: close_inset + theme.close_boxshadow_horizontal + 'px ' + theme.close_boxshadow_vertical + 'px ' + theme.close_boxshadow_blur + 'px ' + theme.close_boxshadow_spread + 'px ' + PUMUtils.convert_hex(theme.close_boxshadow_color, theme.close_boxshadow_opacity),
                textShadow: theme.close_textshadow_horizontal + 'px ' + theme.close_textshadow_vertical + 'px ' + theme.close_textshadow_blur + 'px ' + PUMUtils.convert_hex(theme.close_textshadow_color, theme.close_textshadow_opacity)
            });
            switch (theme.close_location) {
            case "topleft":
                $close.css({
                    top: theme.close_position_top + 'px',
                    left: theme.close_position_left + 'px'
                });
                break;
            case "topright":
                $close.css({
                    top: theme.close_position_top + 'px',
                    right: theme.close_position_right + 'px'
                });
                break;
            case "bottomleft":
                $close.css({
                    bottom: theme.close_position_bottom + 'px',
                    left: theme.close_position_left + 'px'
                });
                break;
            case "bottomright":
                $close.css({
                    bottom: theme.close_position_bottom + 'px',
                    right: theme.close_position_right + 'px'
                });
                break;
            }
            $(document).trigger('popmake-admin-retheme', [theme]);
        }

    };
    $document.ready(function () {
        PopMakeAdmin.init();
        $document.trigger('pum_init');
    });
}(jQuery, document));
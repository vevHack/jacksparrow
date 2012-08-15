var jks = jks || {};
jks.editUserPix = jks.editUserPix || (function() {
    "use strict";

    var render;
    var target, preview, form, fileInput;
    var jcrop_api, boundx, boundy;

    function resetJcrop() {
        if(jcrop_api) {
            jcrop_api.destroy();
        }
    }

    function attachJcrop() {
        target.Jcrop({
            minSize : [5,5],
            onChange: updatePreviewAndCoords,
            onSelect: updatePreviewAndCoords,
            aspectRatio: 1,
        },function(){
            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];
            jcrop_api = this;
        });

        function updatePreviewAndCoords(c) {
            updatePreview(c);
            updateCoords(c);
        }

        function updateCoords(c) {
            if (parseInt(c.w) > 0) {
                form.find('input[name="width"]').val(c.w);
                form.find('input[name="height"]').val(c.h);
                form.find('input[name="x"]').val(c.x);
                form.find('input[name="y"]').val(c.y);
                form.find('input[name="boundx"]').val(boundx);
                form.find('input[name="boundy"]').val(boundy);
            } else {
                jks.common.warn();
            }
        }

        function updatePreview(c) {
            if (parseInt(c.w) > 0) {
                var rx = 100 / c.w;
                var ry = 100 / c.h;

                preview.css({
                    width: Math.round(rx * boundx) + 'px',
                    height: Math.round(ry * boundy) + 'px',
                    marginLeft: '-' + Math.round(rx * c.x) + 'px',
                    marginTop: '-' + Math.round(ry * c.y) + 'px'
                });
            }
        }
    }

    function attach() {
        target = render.find("#target-img");
        preview = render.find("#preview-img");
        form = render.find("form");
        fileInput = form.find("#file");

        attachJcrop();

        fileInput.on("change", function (event) {
            var reader = new FileReader();
            if(event.target.files && event.target.files[0]) {
                reader.onload = function(event) {
                    resetJcrop();

                    var a = $('<img id="target" style="max-width:100%;max-height:100%" src="' + event.target.result + '"/>');
                    target.replaceWith(a);
                    a[0].onload = function() {
                        preview.replaceWith(
                        '<img id="preview" src="' + event.target.result + '"/>');
                        attachJcrop();
                    }
                };

                reader.readAsDataURL(event.target.files[0]);
            }
        });
    }

/*
    function onSubmit(form, trigger, content, info) {
        var spinner = jks.common.spinnerFactory().insertBefore(trigger);
        content.attr("disabled", true);
        resetInfo(info);

        return $.post("/api/post/create", {content: content.val().trim()})
            .always(function() {
                content.attr("disabled", false);
                spinner.remove();
            })
            .done(function() {
                form[0].reset();
            })
            .fail(function(jqXHR) {
                var error = JSON.parse(jqXHR.responseText).error;
                if (error.code !== 412) {
                    jks.common.warn();
                }
                info.text(error.message);
            });
    }
    */

    function show(container) {
        render.slideToggle("slow", function() {});
    }

    function load(container, userId) {
        if (render) {
            showInContainer(container);
        }
        $.fetch.template("editUserPix").done(function(template) {
            render = $(Mustache.render(template, {user: userId}));
            attach();
            container.prepend(render.hide());
            show();
        });
    }

    return {
        load: load
    };
}());


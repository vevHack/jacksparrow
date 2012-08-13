	 var jcrop_api, boundx, boundy;

    	function bar() {
    	 if(jcrop_api) {

    	 	jcrop_api.destroy();
    	 }
    	 }

    function foo() {
    	 $('#target').Jcrop({
			boxWidth : 400,
			boxHeight : 400,
    	 	minSize : [5,5],
    	 	onChange: updatePreviewAndCoords,
        	onSelect: updatePreviewAndCoords,
        	aspectRatio: 1,

      	},function(){
        	// Use the API to get the real image size
        	var bounds = this.getBounds();
        	boundx = bounds[0];
        	boundy = bounds[1];
        	// Store the API in the jcrop_api variable
        	console.log(bounds);
        	jcrop_api = this;
      	});

      	function updatePreviewAndCoords(c) {
      	    updatePreview(c);
      	    updateCoords(c);
      	}


      	function updateCoords(c) {

        	if (parseInt(c.w) > 0)
        	{
                $('#width').val(c.w);
                $('#height').val(c.h);
                $('#x').val(c.x);
                $('#y').val(c.y);
                $("#boundx").val(boundx);
                $("#boundy").val(boundy);
          	} else {
          	  	console.log('bad');
          	}
        }


      	function updatePreview(c)
      	{
        	if (parseInt(c.w) > 0)
        	{
	            var rx = 100 / c.w;
	            var ry = 100 / c.h;

	            $('#preview').css({
	                    width: Math.round(rx * boundx) + 'px',
	                    height: Math.round(ry * boundy) + 'px',
	                    marginLeft: '-' + Math.round(rx * c.x) + 'px',
	                    marginTop: '-' + Math.round(ry * c.y) + 'px'
	            });
        	}
      	};
    }

    $(function() {

	foo();

	$("#uploadedFile").on("change", function (e){

		var reader = new FileReader();

		if(e.target.files && e.target.files[0]) {
			reader.onload = function(event) {
				bar ();
				//document.getElementById("target").src = event.target.result;
				//$("#target").remove();


				var a = $('<img id="target" style="max-width:100%;max-height:100%" src="' + event.target.result + '"/>');

				$('#target').replaceWith(a);//'<img id="target" style="max-width:100%;max-height:100%" src="' + event.target.result + '"/>');
				a[0].onload = function (){

					var parent = $("#target").parent().get(0);

                    var parentHeight = parent.style.height;
	                var parentWidth = $("#target").parent().get(0).style.width;
                    var target = $("#target")[0];
	                var targetWidth = target.width+"px";
	                var targetHeight = target.height+"px";

	                console.log(parentHeight+"-"+parentWidth+"-"+targetHeight+"-"+targetWidth);
	                if(targetHeight < parentHeight && targetWidth < parentWidth) {
	                    if( targetHeight > targetWidth ) {
	                        target.height = parentHeight;
	                        target.width = (parentHeight* targetWidth)/targetHeight ;

	                    } else {
	                        target.width = parentWidth;
	                        target.height = (parentWidth*targetHeight)/targetWidth;
	                    }

	                }

	                $('#preview').replaceWith('<img id="preview" src="' + event.target.result + '"/>');

                    foo();

	            }
			};
			reader.readAsDataURL(e.target.files[0]);
		}
	});

	});

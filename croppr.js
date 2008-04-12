	var cropprInsertType = 'html'; // html or url
	
	function cropprWindow() {
		var content = '<div id="cropprWindow">';
	
		content += '<h2>Croppr</h2>';
		
		content += '<table id="cropprAttrTable">';
		content += '<tr>';
		
		content += '<td colspan="4">';
		content += '<p id="cropprImagesP">List of images (seperate with returns) :</p>';
		content += '<textarea id="cropprImageField">';
		content += '</textarea>';
		content += '</td>';
		
		content += '</tr>';
		content += '<tr>';
		
		content += '<td>New size : </td>';
		content += '<td><input type="text" id="cropprSizeField" /> px</td>';
		
		content += '<td class="cropprMargeTd">Apply size to : </td>';
		content += '<td><select id="cropprDimensionField"></select></td>';
		
		content += '</tr>';
		content += '<tr>';
		
		content += '<td>Shape : </td>';
		content += '<td><select id="cropprShapeField"></select></td>';
		
		content += '<td class="cropprMargeTd"></td>';
		content += '<td></td>';
		
		content += '</tr>';
		content += '</table>';
		
		content += '<p class="cropprTextcenter"><input type="submit" id="cropprSubmit" value="Insert resized images" onclick="javascript: cropprSubmit();" /></p>';
		
		content += '</div>';
		
		cpCreateWindow(600, 430, content);
		cpExecAfterWindowOpening("cropprInsertShapes()");
		cpExecAfterWindowOpening("cropprInsertDimensions()");
		cpExecAfterWindowOpening("cropprInsertImages()");
	}
	
	function cropprInsertImages() {
		var textarea = document.getElementById("cropprImageField");
		
		var edSelection = cpGetEditorSelection().toString();
		var selectionDiv = document.createElement("div");
		selectionDiv.innerHTML = edSelection;
		var selectedImages = selectionDiv.getElementsByTagName("img");
		
		if (textarea.value == "") {
			if ((selectedImages.length > 0) || (edSelection.indexOf("http://") != -1)) {
				if (selectedImages.length > 0) {
					cropprInsertType = 'html';
					for (var i = 0; i < selectedImages.length; i++) {
						var image = selectedImages[i];
						var url = image.src;
					
						if (url.indexOf(cropprUrl) != -1) {				
							var theUrl = cropprFilterProperty(url, "source");
							cropprLoadImageSettings(url);	
						} else {
							var theUrl = url;
						}
					
						textarea.value += theUrl + ' \n';
					}
				} else {
					cropprInsertType = 'url';
					
					var urls = edSelection.split("http://");
					for (var i = 0; i < urls.length; i++) {
						var url = urls[i];
						if ((url != "") && (url != null)) {
							url = "http://" + url;
							if (url.indexOf(cropprUrl) != -1) {
								cropprLoadImageSettings(url);
								var theUrl = cropprFilterProperty(url, "source");
							} else {
								var theUrl = url;
							}
							theUrl = theUrl.replace(/ /g, "");
							theUrl = theUrl.replace(/\\n/g, "");
							theUrl = theUrl.replace(/\n/g, "");
							if ((theUrl != "") && (theUrl != null))
								textarea.value += theUrl + ' \n';
						}
					}
				}
			} else {
				cropprInsertType = 'html';
				textarea.value += 'http://mysite.com/example.jpg \n';
				textarea.value += 'http://othersite.com/example.png';
			}
		}
	}
	
	function cropprLoadImageSettings(url) {
		var size = cropprFilterProperty(url, "size");
		var shape = cropprFilterProperty(url, "shape");
		
		if (url.indexOf("&dimension=") != -1) {
			if (url.indexOf("&dimension=biggest") != -1)
				var dimension = "Biggest side";
			else if (url.indexOf("&dimension=smallest") != -1)
				var dimension = "Smallest side";
			else if (url.indexOf("&dimension=width") != -1)
				var dimension = "Width";
			else if (url.indexOf("&dimension=height") != -1)
				var dimension = "Height";
			else
				var dimension = 0;
		} else {
			var dimension = "Biggest side";
		}
								
		if (size != 0) {
			size = size.replace("px", "");
			document.getElementById("cropprSizeField").value = size;
		}
									
		if (shape != 0) {
			for (var a = 0; a < cropprShapes().length; a++) {
				var thisShape = cropprShapes()[a].toLowerCase();
				if (thisShape == shape) {				
					cropprSelectFieldOption("cropprShapeField", a);
				}
			}
		}
		
		if (dimension != 0) {
			for (var a = 0; a < cropprDimensions().length; a++) {
				var thisDimension = cropprDimensions()[a];
				if (thisDimension == dimension) {
					cropprSelectFieldOption("cropprDimensionField", a);
				}
			}
		}	
	}
	
	function cropprFilterProperty(url, type) {
		var stop = false;
		var prop = '';
		var tempProp = cpDeleteBefore(url, type + "=", true);
		for (var a = 0; a < tempProp.length; a++) {
			if ((tempProp.charAt(a) != "&") && (stop == false)) {
				prop += tempProp.charAt(a);
			} else {
				stop = true;
			}
		}
		return prop;
	}
	
	function cropprSelectFieldOption(id, number) {
		var field = document.getElementById(id);
		if (field.getElementsByTagName("option").length >= number + 1) {
			field.selectedIndex = number;
		} else {
			window.setTimeout("selectFieldOption(" + number + ")", 500);
		}
	}
	
	function cropprShapes() {
		var shapes = new Array("");
			shapes[0] = "Rectangle";
			shapes[1] = "Square";
		return shapes;
	}
	
	function cropprInsertShapes() {
		var shapes = cropprShapes();
		var shapeField = document.getElementById("cropprShapeField");
		if (shapeField.options.length == 0) {
			for (var i = 0; i < shapes.length; i++) {
				var option = document.createElement("option");
				option.setAttribute("name", shapes[i].toLowerCase());
				option.innerHTML = shapes[i];
				shapeField.appendChild(option);
			}
		}
	}
	
	function cropprCheckShape(shape) {
		var returnvalue = false;
		var shapes = cropprShapes();
		for (var i = 0; i < shapes.length; i++) {
			if (shapes[i] == shape) {
				returnvalue = true;
			}
		}
		return returnvalue;
	}
	
	function cropprDimensions() {
		var dimensions = new Array("");
			dimensions[0] = "Biggest side";
			dimensions[1] = "Smallest side";
			dimensions[2] = "Width";
			dimensions[3] = "Height";
		return dimensions;
	}
	
	function cropprInsertDimensions() {
		var dimensions = cropprDimensions();
		var dimensionField = document.getElementById("cropprDimensionField");
		if (dimensionField.options.length == 0) {
			for (var i = 0; i < dimensions.length; i++) {
				var option = document.createElement("option");
				option.setAttribute("name", dimensions[i].toLowerCase());
				option.innerHTML = dimensions[i];
				dimensionField.appendChild(option);
			}
		}
	}
	
	function cropprCheckDimension(dimension) {
		var returnvalue = false;
		var dimensions = cropprDimensions();
		for (var i = 0; i < dimensions.length; i++) {
			if (dimensions[i] == dimension) {
				returnvalue = true;
			}
		}
		return returnvalue;
	}
	
	function cropprSubmit() {
		var imageField = document.getElementById("cropprImageField");
		var sizeField = document.getElementById("cropprSizeField");
		var shapeField = document.getElementById("cropprShapeField");
		var dimensionField = document.getElementById("cropprDimensionField");
		
		var images = imageField.value;
		var size = sizeField.value;
		var shape = shapeField.options[shapeField.selectedIndex].value;
		var dimension = dimensionField.options[dimensionField.selectedIndex].value;
		
		var error = false;
		
		if (images == "") {
			imageField.className += ' cropprErrorColor';
			error = true;
		} else {
			imageField.className = imageField.className.replace(/cropprErrorColor/g, "");
		}
		
		if (size == "") {
			sizeField.className += ' cropprErrorColor';
			error = true;
		} else {
			sizeField.className = sizeField.className.replace(/cropprErrorColor/g, "");
		}
		
		if ((cropprCheckShape(shape) != true) && (!window.attachEvent)) {
			shapeField.className += ' cropprErrorColor';
			error = true;
		} else {
			shapeField.className = shapeField.className.replace(/cropprErrorColor/g, "");
		}
		
		if ((cropprCheckDimension(dimension) != true) && (!window.attachEvent)) {
			dimensionField.className += ' cropprErrorColor';
			error = true;
		} else {
			dimensionField.className = dimensionField.className.replace(/cropprErrorColor/g, "");
		}
		
		if (error == "") {
			images = cropprParseImages(imageField);
      	
      		var code = '';
      		for (var i = 0; i < images.length; i++) {
      			var image = images[i];
      			
      			if ((image != "http://") && (image != "")) {
      				shape = shape.toLowerCase();
      				dimension = dimension.toLowerCase();
      				dimension = dimension.replace(/side/g, "");
      				dimension = dimension.replace(/ /g, "");
      			
      				if (shape != "square") {
      					var dimensionCode = '&dimension=' + dimension;
      				} else {
      					var dimensionCode = '';
      				}
      			
      				var url = cropprUrl + '?size=' + size + '&shape=' + shape + dimensionCode + '&source=' + image;
      			
      				if (cropprInsertType == "html") {
      					var imageCode = '<img src="' + url + '" alt="" /> \n';
      				} else if (cropprInsertType == "url") {
      					var imageCode = url;
      				}
      				code += imageCode;
      			}
      		}
      		cpEditorInsertCode(code);
      		cpCloseWindow();
		}
	}
	
	
    function cropprParseImages(imageField) {
    	var images = imageField.value;
      	var imageArray = images.split("http://");
      	var newImages = new Array();
      	for (var i = 0; i < imageArray.length; i++) {
       		var image = imageArray[i];
       		if ((image != "") && (image != null)) {
        		image = image.replace(/ /g, "");
        		image = image.replace(/\\n/g, "");
        		image = image.replace(/\n/g, "");
        		image = "http://" + image;
        		newImages[newImages.length] = image;
       		}
      	}
		return newImages;
     }
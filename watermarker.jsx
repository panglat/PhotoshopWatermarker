target = app.photoshop

var oldPref = app.preferences.rulerUnits
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

	function drawBottomRectangle(height) {
		var docRef = activeDocument
		var dw = docRef.width
		var dh = docRef.height
		var fillColor = new SolidColor;  
		fillColor.rgb.hexValue = '000000';	// back
		var artLayerRef = docRef.artLayers.add()  
		var selY = dh - height
		docRef.selection.select([[0, selY], [dw, selY], [dw, dh], [0,dh]], SelectionType.REPLACE, 0, false);  
		docRef.selection.fill(fillColor);
		docRef.selection.deselect(); 
		artLayerRef.name = 'Bottom Rectangle'
		artLayerRef.blendMode = BlendMode.NORMAL
		artLayerRef.opacity = 80
	}

	function getTimeDate()
	{
		// From: https://forums.adobe.com/thread/2166822
		var docRef = activeDocument
		var timeDate = ''
		
		for (var i = 0; i <docRef.info.exif.length; i++)
		{
			var dateString = docRef.info.exif[i].toString()
			if (dateString.substring(0,18) == 'Date Time Original') 
			{
				timeDate = dateString.substring(27,29) + '-' + dateString.substring(24,26) + '-' + dateString.substring(19,23) + '  ' + dateString.substring(30,35)
			}
		}
		
		return timeDate;
	}

	function drawCopyrightCaption(posX, posY, fontSize, caption) {
		// From: https://forums.adobe.com/thread/2166822
		var docRef = activeDocument
		var copyright = caption + getTimeDate();
		var fillColor = new SolidColor;  
		fillColor.rgb.hexValue = 'ffffff';	// white
		var artLayerRef = docRef.artLayers.add()
		artLayerRef.kind = LayerKind.TEXT
		var textItemRef = artLayerRef.textItem
		textItemRef.position = [posX,posY]
		textItemRef.font = "ArialMT" 
		textItemRef.color = fillColor
		textItemRef.justification = Justification.RIGHT
		textItemRef.size = new UnitValue(fontSize, 'pt');
		textItemRef.contents = copyright
		artLayerRef.name = 'Copyright' 
	}

	function drawBottomWatermark(heightPercentage, legend)
	{
		var docRef = activeDocument
		var dw = docRef.width
		var dh = docRef.height
		
		var rectHeight = dh * (heightPercentage / 100);
		var fontSize = rectHeight * .8;
		var captionX = dw * .98
		var captionY = dh - (rectHeight * .25)
		
		drawBottomRectangle(rectHeight)
		drawCopyrightCaption(captionX, captionY, fontSize, legend)
	}
	
	drawBottomWatermark(4, 'Your copyright  ')
        
app.preferences.rulerUnits = oldPref
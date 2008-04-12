<?php
 
 /* variables */
 
 $source = $_REQUEST["source"];
 $thumb_size = intval($_REQUEST["size"]);
 $shape = $_REQUEST["shape"];
 $dimension = $_REQUEST["dimension"];
 
 if ($dimension == "") {
  $dimension = "biggest";
 }
 
 $no_source = "Error : No valid source specified.";
 $no_shape = "Error : No valid shape specified.";
 $no_size = "Error : No valid size specified.";
 
 if ($source == "") {
  die($no_source);
 } else if ($thumb_size == "") {
  die($no_size);
 }
 
 /* define image width, height, and type */ 
 
 $size = getimagesize($source);
 $width = $size[0];
 $height = $size[1];
 $type = $size[2];
  
 if ($type == 1) {
  $header = 'gif';
 } else if ($type == 2) {
  $header = 'jpeg';
 } else if ($type == 3) {
  $header = 'png';
 } else {
  die($no_source);
 }
 
 /* define new width & height and x & y */
 
 if ($shape == "square") {
  if ($width > $height) {
   $x = ceil(($width - $height) / 2 );
   $width = $height;
  } else if ($height > $width) {
   $y = ceil(($height - $width) / 2);
   $height = $width;
  }
  $thumb_width = $thumb_size;
  $thumb_height = $thumb_size;
 } else if (($shape == "rectangle") or ($shape == "")) {
  $x = 0;
  $y = 0;
  
  $w = true;
  if ($dimension == "biggest") {
   if ($width < $height) {
    $w = false;
   }
  } else if ($dimension == "smallest") {
   if ($width > $height) {
    $w = false;
   }
  } else if ($dimension == "height") {
   $w = false;
  }
  
  if ($w == true) {
   $thumb_width = $thumb_size;
   $thumb_temp = $thumb_width / $width;
   $thumb_height = $height * $thumb_temp;
  } else {
   $thumb_height = $thumb_size;
   $thumb_temp = $thumb_height / $height;
   $thumb_width = $width * $thumb_temp;
  }
 } else {
  die($no_shape);
 }
 
 /* create new blank image */

 $new_im = ImageCreatetruecolor($thumb_width, $thumb_height);
 
 /* open original image */
 
 if ($type == 1) {
  $im = imagecreatefromgif($source);
 } else if ($type == 2) {
  $im = imagecreatefromjpeg($source);
 } else if ($type == 3) {
  $im = imagecreatefrompng($source);
 }
 
 /* preserve transparency in opened image */
 
 if (($type == 2) or ($type == 3)) {
  $transindex = imagecolortransparent($im); // transparant gif indicator
  if ($transindex >= 0) {
    // gif
  	$transcolor = imagecolorsforindex($im, $transindex);
  	$transindex = imagecolorallocate($new_im, $transcolor['red'], $transcolor['green'], $transcolor['blue']);
  	imagefill($new_im, 0, 0, $transindex);
  	imagecolortransparent($new_im, $transindex);
  } else if ($type == 3) {
    // png
  	imagealphablending($new_im, false);
    $color = "#000000";
    $color_codes = sscanf($color, '#%2x%2x%2x');
    $new_color = imagecolorallocate($new_im, $color_codes[0], $color_codes[1], $color_codes[2]);
    $replace_color = imagecolortransparent($new_im, $new_color);
  	imagesavealpha($new_im, true);
  }
 }
 
 /* resize original image */

 imagecopyresampled($new_im,$im,0,0,$x,$y,$thumb_width,$thumb_height,$width,$height);
 
 /* output image */

 header("Content-type: image/" . $header);
 
 if ($type == 1) {
  imagegif($new_im);
 } else if ($type == 2) {
  imagejpeg($new_im, null, 100);
 } else if ($type == 3) {
  imagepng($new_im);
 }
 
 /* clear memory */
  
 imagedestroy($im);
 imagedestroy($new_im);
?> 
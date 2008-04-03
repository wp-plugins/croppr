<?php
 /*
 Plugin Name: Croppr
 Plugin URI: http://bertramakers.com
 Description: PHP Image resizer utility
 Version: 1.0
 Author: Bert Ramakers
 Author URI: http://bertramakers.com
 License: CC 3.0 Attribution-Noncommercial (http://creativecommons.org/licenses/by-nc/3.0/)
 */

 /* LICENSE :
 http://creativecommons.org/licenses/by-nc/3.0/
 */
 
 function croppr_plugin() { // used by other scripts to check if croppr is available
 	return true;
 }
 
 function croppr_return($value) {
 	if ($value == "version")
 		$return = '1.0';
 	else if ($value == "url")
 		$return = get_bloginfo("wpurl") . "/wp-content/plugins/croppr/image.php";
 	
 	return $return;
 }
 
 // ---
 // extra features when coreplugin is installed & enabled
 // ---
 
 if (function_exists(cpImportFiles)) {
 	add_action("wp_head", "cropprIncludeFiles");
 	add_filter("admin_head", "cropprIncludeFiles");
 	add_filter("admin_head", "cropprAddButton");
 }
 
 function cropprIncludeFiles() {
 	$path = get_bloginfo("wpurl") . "/wp-content/plugins/croppr/";
 	echo '
 	<script type="text/javascript"> cropprUrl = "' . $path . 'image.php"; </script>
 	<script type="text/javascript" src="' . $path . 'croppr.js"></script>
 	<link type="text/css" rel="stylesheet" href="' . $path . 'croppr.css" />
 	';
 }
 
 function cropprAddButton() {
 	$title = 'croppr';
 	$function = 'cropprWindow';
 	cpEditorAddButtonOnLoad($title, $function);
 }
?>
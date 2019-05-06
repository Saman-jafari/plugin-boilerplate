<?php
/**
 * @param string $filename
 *
 * @return string
 */
function asset_path($filename) {
	$dist_path = /*get_template_directory_uri() .*/
		'/public/';
	static $manifest;

	if (empty($manifest)) {
		$manifest_path = /*get_template_directory().*/
			'/public/' . 'assets.json';
		if (file_exists($manifest_path)) {
			$manifest = json_decode(file_get_contents($manifest_path), true);
		} else {
			$manifest = [];
		}
	}

	if (array_key_exists($filename, $manifest)) {
		return $dist_path . $filename;
	} else {
		return $dist_path . $filename;
	}
}

echo asset_path('js/main.public.js');

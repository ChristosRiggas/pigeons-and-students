<?php
	$imageSources = ($_POST['imageSources']);
	$number = ($_POST['number']);
	echo $imageSources;


	$folderPath = __DIR__ . '/../style/images/qr/';
	//$folderPath = 'qr-codes/';

	$imageData = file_get_contents($imageSources);
	$fileName = 'slot' . $number . '.jpg';
	$filePath = $folderPath . $fileName;

	file_put_contents($filePath, $imageData);
?>


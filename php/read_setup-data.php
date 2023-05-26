<?php
	$data = file_get_contents('data/setup_app.data');
	
	if(!empty($data)){
		$positionsArray = explode("&", $data);
		$finalArray = [];
		
		foreach ($positionsArray as $element){
			$tempArray = explode(":", $element);
			$key = str_replace("-", "", $tempArray[0]);
			
			$finalArray[$key] = $tempArray[1];
		}
		
		echo json_encode($finalArray);
	}else{
		echo "<h1>setup_app.data is empty</h1>";
	} 
?>

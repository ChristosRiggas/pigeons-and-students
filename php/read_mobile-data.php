<?php
  	$playersNum = file_get_contents('data/installation_form_app.data');
	$file = file_get_contents('data/mobile_app.data');
	$mobile_data = [];
	$finalArray = [];
	
	if(!empty($file)){
		for($i = 0; $i < $playersNum; $i++){
			$mobile_data[$i] = "";
		}
		
		$lines = explode("#", $file);
		
		//echo implode($lines);
		//echo "<br><br>";
		
		for($i = 0; $i < $playersNum; $i++){
			for($j = 0; $j < count($lines); $j++){
				$numericSlot = substr($lines[$j], 5, 1);
				if($numericSlot == $i){
					$mobile_data[$i] = $lines[$j];
				}	
			}
		}
		
		for($i = 0; $i < $playersNum; $i++){
			if(!empty($mobile_data[$i])){
				$mArray = explode("&", $mobile_data[$i]);
				$smallArray = [];
				
				foreach ($mArray  as $element){
					$tempArray = explode(":", $element);
					$key = $tempArray[0] . $i;
					if(strpos($tempArray[1], "\n")){
						$tempArray[1] = str_replace("\n", "", $tempArray[1]);
					}
					
					
					$smallArray[$key] = $tempArray[1];
				}
				
				array_push($finalArray, $smallArray);
				//$mobile_data[$i] = $smallArray;
				
			}else{
				array_push($finalArray, []);
			}
		}
		//echo implode($mobile_data);

		array_merge($finalArray, $mobile_data);

		
		echo json_encode($finalArray);
		
	}else{
		echo "<h1>mobile_app.data is empty</h1>";
	}  
	
?>

<?php		
  	$playersNum = file_get_contents('data/installation_form_app.data');
	
	//file_put_contents('data/round_app.data', strval($_GET['tookDmgArray'][1]));
	//file_put_contents('data/round_app.data', strval($_GET['tookDmgArray']));
	if(isset($_GET["endround"])){
		$file = fopen("data/round_app.data", "w");
			
		for($i = 0; $i < $playersNum; $i++){
			if(isset($_GET["tookdmg" . $i]) && isset($_GET["tookdmg" . $i])){

				fwrite($file, "tookdmg" . $i . ":" . $_GET["tookdmg" . $i] . "&");
				fwrite($file, "fired" . $i . ":" . $_GET["fired" . $i] . "&");
				fwrite($file, "type" . $i . ":" . $_GET["type" . $i] . "&");
			}			
		}
		fwrite($file, "endround:" . $_GET["endround"]);

		fclose($file);	
		//echo $file;
		
	}else if(isset($_GET['data']) && $_GET['data'] == "read"){
		$roundData = file_get_contents('data/round_app.data');
		//echo json_encode($roundData);
	
 		if(!empty($roundData)){
			$roundDataArray = explode("&", $roundData);
			$finalRoundDataArrayArray = [];
			
			foreach ($roundDataArray as $element){
				$tempArray = explode(":", $element);
				$key = $tempArray[0];
				
				$finalRoundDataArrayArray[$key] = $tempArray[1];
			}
			
			echo json_encode($finalRoundDataArrayArray);
		} 
		
	}else if (isset($_GET['data']) && $_GET['data'] == "reset"){
		file_put_contents("data/round_app.data", strval(""));
	}
?> 
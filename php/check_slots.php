<?php
	$playersNum = file_get_contents('data/installation_form_app.data');
	
	//reset all the slots, players created counter and their data
	if(isset($_GET["reset"]) && $_GET["reset"] == 100){
		$fileSlots = fopen("data/slots.data", "w");	
		$filePlayersToDisconnect = fopen("data/players_to_disconnect.data", "w");	
		for($i = 0; $i < $playersNum; $i++){
			if($i != $playersNum - 1){
				fwrite($fileSlots, 1 . "&");
				fwrite($filePlayersToDisconnect, 0 . "&");
			}else{			
				fwrite($fileSlots, 1);
				fwrite($filePlayersToDisconnect, 0);				
			}
		}
		fclose($fileSlots);		
		fclose($filePlayersToDisconnect);
		
		file_put_contents('data/mobile_app.data', "");
		file_put_contents('data/players_created_counter.data', strval(-1)); // used and as index so starts to count from 0
		file_put_contents('data/create_player_app.data', strval(""));
		//file_put_contents('data/round_app.data', "");
		//unlink('data/round_app.data');

	// slot check
	}else if(isset($_GET["slotTemp"])){
		$data = file_get_contents('data/slots.data');
		$data = explode("&", $data);
		
		// check also if endround = false, if there is available game
		$roundData = file_get_contents('data/round_app.data');
		$finalRoundDataArrayArray = [];
 		if(!empty($roundData)){
			$roundDataArray = explode("&", $roundData);
			
			foreach ($roundDataArray as $element){
				$tempArray = explode(":", $element);
				$key = $tempArray[0];
				
				$finalRoundDataArrayArray[$key] = $tempArray[1];
			}
		} 
		
		//echo "finalRound: ".implode(",", $finalRoundDataArrayArray)."<br>";
		//echo strval($finalRoundDataArrayArray["endround"])."<br>";

		if($data[$_GET["slotTemp"]] == 1 && $finalRoundDataArrayArray["endround"] == "false"){
			echo json_encode(array('current' => $_GET["slotTemp"]));
			$data[$_GET["slotTemp"]] = 0;
			$data = join("&", $data);
			file_put_contents('data/slots.data', strval($data));

		}else if($finalRoundDataArrayArray["endround"] == "true"){
			echo json_encode(array('current' => 'endround'));
		}else if($data[$_GET["slotTemp"]] == 0 && $finalRoundDataArrayArray["endround"] == "false"){
			echo json_encode(array('current' => 'taken'));
		}	
	} 
	
?>
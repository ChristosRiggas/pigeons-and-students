<?php
	$playersNum = file_get_contents('data/installation_form_app.data');
	
	if(isset($_GET["slot"]) && isset($_GET["name"]) && isset($_GET["character"])){
		
		if($_GET["slot"] < $playersNum){	
			//$player_id = uniqid('player_', true);
			$player_id = uniqid();
			
			$filePlayersCount = fopen("data/players_created_counter.data", "r");
			$playersCount = fgets($filePlayersCount);
			$playersCount = intval($playersCount);
			$playersCount++;

			fclose($filePlayersCount);
			file_put_contents("data/players_created_counter.data", strval($playersCount));
			
			//echo "<h4>Player " . $_GET["slot"] . " Name: " . $_GET["name"] . "</h4>";
			//echo "<h4>Player " . $_GET["slot"] . " Character: " . $_GET["character"] . "</h4>";
			
			echo json_encode(array(
			'name' => $_GET["name"], 
			'character' => $_GET["character"],
			'id' => $player_id));	
			
			$file = fopen("data/create_player_app.data", "a");
			fwrite($file, "#slot:" . $_GET['slot'] . "&name:" . $_GET['name'] . "&character:" . $_GET['character'] . "&count:" . $playersCount . "&id:" . $player_id . "\n");
			fclose($file);	
		}
		
	}else if(isset($_GET["slot"]) && isset($_GET["id"])){
		

		$file = file_get_contents('data/create_player_app.data');
		$players_data = [];
		$players_ids = [];
		
		if(!empty($file)){
			for($i = 0; $i < $playersNum; $i++){
				$players_data[$i] = "";
				$players_ids[$i] = "";
			}
			
			$lines = explode("#", $file);
			
			for($i = 0; $i < $playersNum; $i++){
				for($j = 0; $j < count($lines); $j++){
					$numericSlot = substr($lines[$j], 5, 1);
					if($numericSlot == $i){
						$players_data[$i] = $lines[$j];
					}	
				}
			}
			
			//print_r ($players_data);
			
 			for($i = 0; $i < $playersNum; $i++){
				if(!empty($players_data[$i])){
					$pArray = explode("&", $players_data[$i]);
					$smallArray = [];
					
					foreach ($pArray  as $element){
						$tempArray = explode(":", $element);	

						if(strpos($tempArray[1], "\n")){
							$tempArray[1] = str_replace("\n", "", $tempArray[1]);
						}
						
						$smallArray[$i] = $tempArray[1];
						$players_ids[$i] = $smallArray[$i];
						
					}

				}
			} 
			

 			$arrayId = $players_ids[$_GET["slot"]];
 			$getId = $_GET["id"];

			if(strval($getId) == strval($arrayId)){
				echo json_encode(array('valid' => true, 'slot' => $_GET["slot"]));			
			}else{
				echo json_encode(array('valid' => false, 'slot' => $_GET["slot"]));					
			}  
		}		
		
	
	}else if(isset($_GET["slot"]) && isset($_GET["disconnect"]) && $_GET["disconnect"] == "dis"){
		$slot = $_GET["slot"];
		
		$fileSlots = file_get_contents('data/slots.data');	
		$writeSlots = fopen("data/slots.data", "w");		
		
		$fileCreatePlayer = file_get_contents('data/create_player_app.data');
		$writefileCreatePlayer = fopen("data/create_player_app.data", "w");	
		
		$fileCounter = file_get_contents('data/players_created_counter.data');	
		$writeCounter = fopen("data/players_created_counter.data", "w");
		
		$filePlayersToDisconnect = file_get_contents('data/players_to_disconnect.data');
		$writePlayersToDisconnect = fopen("data/players_to_disconnect.data", "w");
		
		// reset slot in slots.data
		$avail = explode("&", $fileSlots);
		for($i = 0; $i < $playersNum; $i++){
			if($i == $slot){
				if($i != $playersNum - 1){
					fwrite($writeSlots, 1 . "&");
				}else if($i == $playersNum - 1){			
					fwrite($writeSlots, 1);			
				}					
			}else{
				if($i != $playersNum - 1){
					fwrite($writeSlots, $avail[$i] . "&");
				}else if($i == $playersNum - 1){			
					fwrite($writeSlots, $avail[$i]);			
				}		
			}		
		}
		fclose($writeSlots);	
		
		// delete player in create_player_app.data and change $count variable order
		$lines = array();
		$currentLine = "";
		$characters = str_split($fileCreatePlayer);
		
		foreach ($characters as $character) {
			if ($character === '#') {
				if (!empty($currentLine)) {
					$lines[] = $currentLine;
				}
				$currentLine = $character;
			} else {
				$currentLine .= $character;
			}
		}
		
		if (!empty($currentLine)) {
			$lines[] = $currentLine;
		}
		
		for($j = 0; $j < count($lines); $j++){
			$numericSlot = substr($lines[$j], 6, 1);
			if($numericSlot == $slot){
				$lines[$j] = "";
			}else{		
				$lineCharacters = str_split($lines[$j]);
				if($j > 0){
					$lineCharacters[count($lineCharacters) - 19] = strval($j - 1);
				}
				$lines[$j] = implode('', $lineCharacters);
			}
			
			fwrite($writefileCreatePlayer, $lines[$j]);
		}
		
		fclose($writefileCreatePlayer);
		
		// decrement players created number by 1 in players_created_counter.data
		if(intval($fileCounter) > -1){
			$counter = intval($fileCounter) - 1;
			fwrite($writeCounter, strval($counter));
		}else{
			fwrite($writeCounter, -1);
		}

		fclose($writeCounter);
		
		// change slot value in players_to_disconnect.data
		$disValues = explode("&", $filePlayersToDisconnect);
		for($i = 0; $i < $playersNum; $i++){
			if($i == $slot){
				if($i != $playersNum - 1){
					fwrite($writePlayersToDisconnect, 1 . "&");
				}else if($i == $playersNum - 1){			
					fwrite($writePlayersToDisconnect, 1);			
				}					
			}else{
				if($i != $playersNum - 1){
					fwrite($writePlayersToDisconnect, $disValues[$i] . "&");
				}else if($i == $playersNum - 1){			
					fwrite($writePlayersToDisconnect, $disValues[$i]);			
				}		
			}		
		}
		fclose($writePlayersToDisconnect);	

    // read players_to_disconnec.data	
	}else if(isset($_GET["disconnect"]) && $_GET["disconnect"] == "read"){
		$filePlayersToDisconnect = file_get_contents('data/players_to_disconnect.data');
		$disValues = explode("&", $filePlayersToDisconnect);
		echo json_encode($disValues);
	
	// reset players_to_disconnec.data 
	}else if(isset($_GET["slots"]) && isset($_GET["disconnect"]) && $_GET["disconnect"] == "reset"){
		$fileDisconnectionsToReset = file_get_contents('data/players_to_disconnect.data');
		$writeDisconnectionsToReset = fopen("data/players_to_disconnect.data", "w");
		$disValues = explode("&", $fileDisconnectionsToReset);
		$disValuesReset = explode("&", $_GET["slots"]);

		/*for($i = 0; $i < count($disValues); $i++){
			$find = false;
			for($j = 0; $j < count($disValuesReset); $j++){
				if($disValuesReset[$j] != " " && $disValuesReset[$j] == $disValues[$i] && $find != true){
					if($i != count($disValues) - 1){
						fwrite($writeDisconnectionsToReset, 0 . "&");
					}else if($i == count($disValues) - 1){
						fwrite($writeDisconnectionsToReset, 0);
					}
					$find = true;
				}
			}
			if($find == false){
				if($i != count($disValues) - 1){
					fwrite($writeDisconnectionsToReset, $disValues[$i] . "&");
				}else if($i == count($disValues) - 1){
					fwrite($writeDisconnectionsToReset, $disValues[$i]);
				}
			}
		}*/
		echo $_GET["slots"]."<br>";
		echo "disValues: ".implode(",", $disValues)."<br>";
		echo "disValuesReset: ".implode(",", $disValuesReset)."<br>";
		for($i = 0; $i < count($disValues); $i++){
			if($disValues[$i] == $disValuesReset[$i]){
				if($i != count($disValues) - 1){
					fwrite($writeDisconnectionsToReset, 0 . "&");
				}else if($i == count($disValues) - 1){
					fwrite($writeDisconnectionsToReset, 0);
				}
			}else{
				if($i != count($disValues) - 1){
					fwrite($writeDisconnectionsToReset, $disValues[$i] . "&");
				}else if($i == count($disValues) - 1){
					fwrite($writeDisconnectionsToReset, $disValues[$i]);
				}				
			}
		}
		
		fclose($writeDisconnectionsToReset);	
	}
?>
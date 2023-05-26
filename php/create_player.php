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
		
	
	}
?>
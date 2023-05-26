<?php
	$player_data = null;
	
	$file = fopen("data/create_player_app.data", "r");
	
	while(!feof($file)){
		$line = trim(fgets($file));
		if(strpos($line, "#") === 0){
			if(strpos($line, "null") !== 6){ // tests if the 6th string is some number in the line, "#slot:0...."
				$player_data = $line;
			}
		}
	}
	
	fclose($file);
	
	if(!empty($file)){
		if($player_data != null){
			list($slot, $name, $character, $count, $player_id) = explode("&", $player_data);
			$tempSlot = explode(":", $slot);
			$tempName = explode(":", $name);
			$tempCharacter = explode(":", $character);
			$tempCount = explode(":", $count);
			$tempId = explode(":", $player_id);
		}else{
			$tempSlot = explode(":", ":");
			$tempName  = explode(":", ":");	
			$tempCharacter = explode(":", ":");	
			$tempCount = explode(":", ":");	
			$tempId = explode(":", ":");	
		}

		echo json_encode(array(
		'slot' => end($tempSlot), 
		'name' => end($tempName),
		'character' => end($tempCharacter),
		'count' => end($tempCount),
		'id' => $tempId));	
	}else{
		echo "<h1>create_player_app.data is empty</h1>";
	}
?>

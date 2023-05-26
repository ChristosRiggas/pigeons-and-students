<?php
	if(isset($_GET["reset-mobile"]) && $_GET["reset-mobile"] == 1){
		file_put_contents("data/mobile_app.data", "");
		$_GET["reset-mobile"] = 0;
		
	}else if (isset($_GET["slot"]) && isset($_GET["roll"]) && isset($_GET["fire"]) && isset($_GET["block"])){
		echo "<h4>Player Current Slot: " . $_GET["slot"] . "</h4>";
		echo "<h4>Player " . $_GET["slot"] . " Roll: " . $_GET["roll"] . "</h4>";
		echo "<h4>Player " . $_GET["slot"] . " Fire: " . $_GET["fire"] . "</h4>";
		echo "<h4>Player " . $_GET["slot"] . " Block: " . $_GET["block"] . "</h4>";
		
		$file = fopen("data/mobile_app.data", "a");
		if($_GET["slot"] != " "){
			fwrite($file, "#slot:" . $_GET['slot'] . "&roll:" . $_GET['roll'] . "&fire:" . $_GET['fire'] . "&block:" . $_GET['block'] . "\n");
		}
		fclose($file);					
	}

?>

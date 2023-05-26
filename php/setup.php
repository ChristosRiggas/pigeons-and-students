<?php
	$playersNum = file_get_contents('data/installation_form_app.data');
	$file = fopen("data/setup_app.data", "w");
		
	for($i = 0; $i < $playersNum; $i++){
		if(isset($_GET["position-" . $i . "-x"]) && isset($_GET["position-" . $i . "-y"])){
			echo "<p>Player " . $i . " Position X: " . $_GET["position-" . $i . "-x"] . "</p>";
			echo "<p>Player " . $i . " Position Y: " . $_GET["position-" . $i . "-y"] . "</p>";	
			

			fwrite($file, "position-" . $i . "-x:" . $_GET["position-" . $i . "-x"] . "&");
			if($i != $playersNum - 1){
				fwrite($file, "position-" . $i . "-y:" . $_GET["position-" . $i . "-y"] . "&");
			}else{
				fwrite($file, "position-" . $i . "-y:" . $_GET["position-" . $i . "-y"]);
			}

		}			
	}

	fclose($file);	
?>

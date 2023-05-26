<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Setup P5 Game</title>

		<link rel="stylesheet" type="text/css" href="style/style_setup.css">		
	</head>
  
	<body onload="resetSlots()">  
		<h1 style="margin-left: 20px;">Player's Position Calibration</h1>

		<?php
			if($_SERVER['REQUEST_METHOD'] === 'POST'){
				if($_POST['password'] === '1234'){
					$numberPlayers = $_POST['players'];
					
					file_put_contents('php/data/installation_form_app.data', strval($numberPlayers));
					setcookie("moderator", "true", time() + 86400);
					
					for($i = 0; $i < $numberPlayers; $i++){
						$content = "";
						$content .= "<div class=\"player-data\">\n
										<h3>Player ".$i." Position</h3>\n
										<p>change x (0 - 1080)</p>\n
										<input id=\"x".$i."-range\" type=\"range\" min=\"0\" max=\"1080\" value=\"100\" oninput=\"changeX(".$i.", value);\">\n		
										<p>change y (0 - 1080)</p>\n
										<input id=\"y".$i."-range\" type=\"range\" min=\"0\" max=\"1080\" value=\"300\" oninput=\"changeY(".$i.", value);\">\n	
										<br><br>\n
									</div>\n
								";
						echo $content;
					}	
				}else{
/* 					echo '<script type="text/javascript">' . 
					'alert("Incorrect Password");' .
					'</script>'; 
					echo '<a href="installation_form.html" class="button" title="">Return to form</a>';
					echo "<h3>Incorect Password</h3>"; */
					header("Location: installation_form.html");
					exit;
				}		
			}else{
				header("Location: installation_form.html");
				exit;
			}
		?>
		
		<div>
			<h3>Player's Position Response:</h3>
			<p id="responseDebug"></p>
		</div>
		
		<h1 style="margin-left: 20px;">Slots Managment</h1>
		<div style="margin-left: 20px;">
			<h3>Reset Slots</h3>
			<p>Reset slots.data => e.g. 1&1, 1 for every available slot index</p>
			<input type="button" value="Reset Slots" onclick="resetSlots()">
		</div>

		<h1 style="margin-left: 20px;">Mobile Data Managment</h1>
		<div style="margin-left: 20px;">
			<h3>Reset Mobile Data</h3>
			<p>Reset mobile_app.data => " "</p>
			<input type="button" value="Reset Mobile Data" onclick="resetMobileData()">
		</div>
		
		
		<h1 style="margin-left: 20px;">Game Tab</h1>
		<div style="margin-left: 20px; margin-bottom: 20px;">
			<h3>Open Game to New Tab</h3>
			<p>Game tab will open only if you are moderator</p>
			<input type="button" value="Open Game" onclick="openGame()">
		</div>


	</body>	
	
	<script>

		let numberPlayers = '<?php echo $numberPlayers; ?>';
		let counter = 0;
		let playersX = [];
		let playersY = [];
		let posStringsX = [];
		let posStringsY = [];

/* 		let playerZeroX = 100;
		let playerZeroY = 300;
		let playerOneX = 500;
		let playerOneY = 300; */
		
		for(let i = 0; i < numberPlayers; i ++){
			if(i % 2 == 0){
				playersX[i] = 180;
				playersY[i] = (700 * (i/2)) + 300;					
			}else{
				playersX[i] = 910;
				if(i == 1){
					playersY[i] = 300;
				}else{
					playersY[i] =  playersY[i-1];
				}
			}
			document.getElementById("x" + i + "-range").value = playersX[i];
			document.getElementById("y" + i + "-range").value = playersY[i];

			if(i == 0){
				posStringsX[i] = "position-" + i.toString() + "-x=";
				posStringsY[i] = "&position-" + i.toString() + "-y=";					
			}else{
				posStringsX[i] = "&position-" + i.toString() + "-x=";
				posStringsY[i] = "&position-" + i.toString() + "-y=";	
			}			
		}
		
/* 		let xRange = document.getElementById("x-range").max = 600;//screen.width;
		let yRange = document.getElementById("y-range").Smax = 600;//screen.height; */
		
		function changeX(who, x){
			playersX[who] = x;
		}
		
		function changeY(who, y){
			playersY[who] = y;
		}
		
		function openGame(){
			window.open("game/game.php");
		}
		
		//setInterval(resetMobileData, 2000);	
	   //setInterval(resetMobileData, 250);
		
		function resetMobileData(){
			let resetMobile = 1;
			var xmlResetMobile = new XMLHttpRequest();
			
			xmlResetMobile.onreadystatechange = function() {
				if (xmlResetMobile.readyState == XMLHttpRequest.DONE) {
					if (xmlResetMobile.status == 200) {
					    //alert("mobile_app.data has been reset to empty!");
					}
					else if (xmlResetMobile.status == 400) {
						alert('There was an error 400');
					}
					else {
						alert('something else other than 200 was returned');
					}
				}			
			};
			xmlResetMobile.open("GET", "php/mobile.php?reset-mobile="+resetMobile, true);
			xmlResetMobile.send();
			resetMobile = 0;			
		}
		
		//setInterval(resetSlots, 5000);
		
		function resetSlots(){
			let resetTrue = 100;
			var xmlResetSlots = new XMLHttpRequest();
			
			xmlResetSlots.onreadystatechange = function() {
				if (xmlResetSlots.readyState == XMLHttpRequest.DONE) {
					if (xmlResetSlots.status == 200) {
					    //alert("slots.data has been reset!");
					}
					else if (xmlResetSlots.status == 400) {
						alert('There was an error 400');
					}
					else {
						alert('something else other than 200 was returned');
					}
				}			
			};
			counter++;
			xmlResetSlots.open("GET", "php/check_slots.php?reset="+resetTrue, true);
			xmlResetSlots.send();	
		}
				
		setInterval(sendData, 100);

		function sendData()
		{
			let argumentsStrings = [];
			let argumentsResult;
			for(let i = 0; i < numberPlayers; i ++){
				argumentsStrings[i] = posStringsX[i] + playersX[i].toString() + posStringsY[i] + playersY[i].toString();
			}
			argumentsResult = argumentsStrings.join('');
			
			var xmlhttp = new XMLHttpRequest();
			
				xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == XMLHttpRequest.DONE) {
					if (xmlhttp.status == 200) {
					   document.getElementById('responseDebug').innerHTML = xmlhttp.responseText + ", counter: " + counter; 
					}
					else if (xmlhttp.status == 400) {
						alert('There was an error 400');
					}
					else {
						alert('something else other than 200 was returned');
					}
				}		
			};
			counter++;
			xmlhttp.open("GET", "php/setup.php?" + argumentsResult, true);
			xmlhttp.send();
		}
	</script>
	
</html>
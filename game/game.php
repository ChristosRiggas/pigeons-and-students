<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>P5 Game</title>

		<link rel="stylesheet" type="text/css" href="style/style_game.css">

		<script src="libraries/p5.min.js"></script>
		<script src="libraries/p5.sound.min.js"></script>
		<script src="libraries/p5.collide2d.js"></script>
		<script src="libraries/p5.dom.min.js"></script> 	

		<script src="game_js/main.js"></script>
		<script src="game_js/bullet.js"></script>
		<script src="game_js/player.js"></script>
		<script src="game_js/bird.js"></script>
		<script src="game_js/weapon.js"></script>
		<script src="game_js/shield.js"></script>
		<script src="../system_js/read_setup-data.js"></script>
		<script src="../system_js/read_mobile-data.js"></script>
		<script src="../system_js/read_create_player-data.js"></script>		
		
		<script>	
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
				xmlResetSlots.open("GET", "../php/check_slots.php?reset="+resetTrue, true);
				xmlResetSlots.send();	
			}
			
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
				xmlResetMobile.open("GET", "../php/mobile.php?reset-mobile="+resetMobile, true);
				xmlResetMobile.send();
				resetMobile = 0;			
			}
			

		
		</script>		
	</head>
  
	<body> <!-- onload="resetSlots()" --> 
	
		<?php
			if(!isset($_COOKIE['moderator']) || $_COOKIE['moderator'] != 'true'){
				header("Location: ../installation_form.html");
				exit;
			}
		?>
	
		<p id="Empty" style="color: white;"></p>
		<p id="Empty2" style="color: black;"></p>	
		
		
		<script>		
			function sendRoundData(tempTookDmgArray, tempFiredArray, tempWeaponType, tempRoundEnded)
			{
				let dataStrings = [];
				let argumentsResult;
				for(let i = 0; i < tempTookDmgArray.length; i++){
					if(i == 0){
						dataStrings[i] = "tookdmg" + i + "=" + tempTookDmgArray[i].toString() + "&fired" + i + "=" + tempFiredArray[i].toString() + "&type" + i + "=" + tempWeaponType[i].toString();
					}else{
						dataStrings[i] = "&tookdmg" + i + "=" + tempTookDmgArray[i].toString() + "&fired" + i + "=" + tempFiredArray[i].toString() + "&type" + i + "=" + tempWeaponType[i].toString();
					}
				}
				dataStrings[dataStrings.length] = "&endround=" + tempRoundEnded;
				argumentsResult = dataStrings.join('');
				//console.log(tempTookDmgArray);
				let xmlRoundData = new XMLHttpRequest();		
				xmlRoundData.onreadystatechange = function() {
					if (xmlRoundData.readyState == XMLHttpRequest.DONE) {
						if (xmlRoundData.status == 200) {
							//console.log("sentOnce");
							//console.log(xmlRoundData.responseText);
/* 							for (let i = 0; i < parseInt(playersNumber); i++) {
								tookDmgArray[i] = false;
								players[i].firedOnce = false;
								firedArray[i] = false;
							}
							argumentsResult = " "; */
						}
						else if (xmlRoundData.status == 400) {
							alert('There was an error 400');
						}
						else {
							alert('something else other than 200 was returned');
						}
					}			
				};
				xmlRoundData.open("GET", "../php/round_data.php?" + argumentsResult, true);
				xmlRoundData.send();	
			}
			
		</script>		
	</body>

</html>

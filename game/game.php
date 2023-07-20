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
		<script src="libraries/qrcode.js"></script>

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
		
		<div id="placeHolder-0"></div>
		<div id="placeHolder-1"></div>
		<div id="placeHolder-2"></div>
		<div id="placeHolder-3"></div>  
		
		
		<?php
			echo "<script>let ipAddress = '".$_SERVER['REMOTE_ADDR']."';</script>";
		?>	
		
		<script>
		
			setInterval(resetMobileData, 10000);
			
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
							//if(tempRoundEnded == true){console.log("sent true");}
							//if(tempRoundEnded == false){console.log("sent false");}
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
			
			setInterval(checkForDisconnections, 1000);
			
			function checkForDisconnections(){
				let xmlhttp = new XMLHttpRequest();		
				xmlhttp.onreadystatechange = function() 
				{
					if (xmlhttp.readyState == XMLHttpRequest.DONE) 
					{ // XMLHttpRequest.DONE == 4
						if (xmlhttp.status == 200) 
						{		
							if(isJsonString(xmlhttp.responseText)){	
								let disValues = JSON.parse(xmlhttp.responseText);			
								let keys = Object.keys(disValues);
								let dataStrings = [];
								let disValuesToReset = "";
								let atleastOneOne = false;
								//console.log(disValues);
								
								for(let i = 0; i < keys.length; i++){
									//console.log(parseInt(disValues[i]) == 1);
									//if(parseInt(disValues[i]) == 1){
										if(i != keys.length - 1){
											dataStrings[i] = disValues[i].toString() + "&";
										}else if(i == keys.length - 1){
											dataStrings[i] = disValues[i].toString();
										}
										
										if(parseInt(disValues[i]) == 1){
											console.log("Player " + parseInt(disValues[i]) + " Disconnected");
											atleastOneOne = true;
											tempColorArray.push(players[i].col);
											players[i] = "";
											countPlayers--;
											if(countPlayers < -1){
												countPlayers = -1;
											}
										}
										
									/*else if(parseInt(disValues[i]) == 0){
										if(i != keys.length - 1){
											dataStrings[i] = disValues[i] + "&";
										}else if(i == keys.length - 1){
											dataStrings[i] = disValues[i];
										}										
									}*/
								}
								disValuesToReset = dataStrings.join('');
								//console.log(disValuesToReset);
								
								if(atleastOneOne){
									var xmlResetMobile = new XMLHttpRequest();			
									xmlResetMobile.onreadystatechange = function() {
										if (xmlResetMobile.readyState == XMLHttpRequest.DONE) {
											if (xmlResetMobile.status == 200) {
												//console.log(xmlResetMobile.responseText);
											}
											else if (xmlResetMobile.status == 400) {
												alert('There was an error 400');
											}
											else {
												alert('something else other than 200 was returned');
											}
										}			
									};
									xmlResetMobile.open("GET", "../php/create_player.php?slots="+encodeURIComponent(disValuesToReset)+"&disconnect=reset", true);
									xmlResetMobile.send(); 
								}

							}else{
								document.getElementById('Empty').innerHTML = xmlhttp.responseText + count;
							} 
						}
						else if (xmlhttp.status == 400) 
						{
							console.log('There was an error 400');
						}
						else 
						{
							console.log('something else other than 200 was returned');
						}
					}
					
				};
						
				xmlhttp.open("GET", "../php/create_player.php?disconnect=read", true);
				xmlhttp.send();							
			}
			
			
			// generate qr codes based on the ip address
			<?php
				$playersNumberInstallation = file_get_contents('../php/data/installation_form_app.data');
			?>
			
			let numberOfPlayersInstallation = <?php echo $playersNumberInstallation ?>;

			for (let i = 0; i < numberOfPlayersInstallation; i++) {
				let tempDiv = document.createElement('div');
				tempDiv.setAttribute("id", "placeHolder-" + i);
			}
			
			let typeNumber = 10;
			let errorCorrectionLevel = 'L';
			let qr = [];
			for (let i = 0; i < numberOfPlayersInstallation; i++) {
				qr[i] = qrcode(typeNumber, errorCorrectionLevel);
				qr[i].addData("https://" + ipAddress + "/projects/theses-project/github/pigeons_and_students/mobile.php?slot=" + i);
				qr[i].make();
				document.getElementById('placeHolder-' + i).innerHTML = qr[i].createImgTag(2, 10, "QR code");
			}

			let imageElements = document.getElementsByTagName('img');
			let imageSources = [];

			for (let i = 0; i < imageElements.length; i++) {
				let imageElement = imageElements[i];
				let imageUrl = imageElement.getAttribute('src');
				//imageSources.push(imageUrl);
				
				let xhr = new XMLHttpRequest();
				xhr.open('POST', 'save_qr_images.php');
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send('imageSources=' + encodeURIComponent(imageUrl) + "&number=" + i);
			}
			
			let imageEle = document.querySelectorAll('[id^="placeHolder-"]');
			for (let i = 0; i < imageEle.length; i++) {
				let element = imageEle[i];
				element.parentNode.removeChild(element);
			}
			
		</script>			
	</body>

</html>

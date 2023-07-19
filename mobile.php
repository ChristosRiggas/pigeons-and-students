<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"> 
	<link rel="stylesheet" type="text/css" href="style/style_mobile.css">
	<title>Mobile P5 Game</title>
</head>

<body> <!--  onload="checkSlots()" --> 

	<?php
		if(isset($_COOKIE['loggedIn'])){
			$values = explode("&", $_COOKIE['loggedIn']);
			$previousSlot = $values[0];
			$previousId = $values[1];
			$thisSlot = $previousSlot;
			$reconnected = true;
		}/* else{ */
			if(isset($_GET["slot"])){
				$thisSlot = $_GET["slot"];			
			}else{
				$thisSlot = " ";
	/* 			echo '<script type="text/javascript">' . 
				'document.getElementById("playerCurrentSlot").style.display = "block";' .
				'</script>'; */
			}		
		//}
		
		$numberPlayers = file_get_contents('php/data/installation_form_app.data');
		
		echo "<div id=\"otherSlots\">";
		echo "<h1 style=\"font-weight: bold; margin-bottom: 40px;\"> Pigeons & Students </h1>";
		echo "<h2> Player's Form </h2>";
		echo "<p style=\"margin-top:5px; margin-bottom:10px;\"> Choose Slot </p>";
		echo "<div id=\"slots-grid\">";
		
		for($i = 0; $i < $numberPlayers; $i++){
			$content = "";
			$content .= "<a href=\"mobile.php?slot=".$i."\" class=\"slot-link\">Slot ".$i."</a>\n";
			echo $content;
		}		
		
		echo "</div>";
		echo "<h2 style=\"margin-top: 40px;\">Goal</h2>";
		echo "<p id=\"description\">The objective of the game is to eliminate all other players and be the last player standing by managing your resources as well as possible.</p>";
		echo "<p id=\"description\">Try to shoot the birds carrying pouches to get useful items.</p>";
		echo "<p id=\"description\">Try to avoid red, pink and black birds because they will damage your character.</p>";
		echo "<p id=\"description\">Have Fun!</p>";
		echo "</div>";	
	?>
	
<!--  	<div id="otherSlots">
		<h2>Choose Slot</h2>
		<a href="mobile.php?slot=0">Slot 0</a>
		<a href="mobile.php?slot=1">Slot 1</a>
	</div> -->
		
	<div id="content">		
		<input class="fire-button" type="button" value="Fire" onclick="fire()">
		<img style="width: 100px; position: absolute; margin: auto; right: 0px; top: 44%;" src="style/images/icons/full-screen-38-48.png" alt="ToggleFullscreen" id="fullScreenButton" onclick="toggleFullscreen();">
		<h2 id="playerCurrentSlot"></h2>
		<input class="block-button" type="button" value="Block" onclick="block()">
		<input class="disconnect-button" style="text-align: center; margin: auto; font-size: 20px; position: absolute; top: 48%; transform: translateY(-50%); transform: rotate(90deg); background-color: #F0F0F0; padding: 6px 10px; box-sizing: border-box; border: 3px solid #ccc; border-radius: 4px;" type="button" value="Disconnect" onclick="disconnect()">

<!-- 		<iframe id ="iframe" src="game/game.html" title="P5 Game"></iframe> -->
		
<!-- 		<h3 id="mobileDebug"><h3>
		
		<p id='pitch'></p>	
		<p id='roll'></p>
		<p id='yaw'></p> 
		<br> -->
		
<!-- 		<p id="responseDebug"></p>
		<br>
		<p id="responseDebugCreatePlayer"></p>
		<br> -->
	<!-- 	
		<p id="responseDebugSlots"></p>
		<p id="currentSlot"></p> 

		<p id="errorDebug" style="display:none; color:red;">Not available slots</p> -->
		
		
	</div>

	<form id="playerForm">
		<h1>Player's Form</h1>
		<button style="position: absolute; font-family:Arial; font-weight: bold; background-color:Crimson; right: 10px; top: 0; font-size: 14px; padding: 10px; width: 40px; margin-top: 10px;" type="button" onclick="OtherSlots()">X</button>
		<p id="slotHeading"></p>
		<h2>Enter your character name<h2>
		<input type="text" maxlength="15" id="name" name="name" required="required"/>
		<h2>Choose your character<h2>
		<select id="character" name="character" onInput="displayCharacter()">
			<option value="scholar">Scholar</option>
			<option value="painter">Painter</option>
			<option value="metalhead">Metalhead</option>
			<option value="hacker">Hacker</option>		
		</select>
		<div id="character-img">
			<div id="character-stats-img">
				<p id="stat-0">21</p>
				<p id="stat-1">38</p>
				<p id="stat-2">25</p>
				<p id="stat-3">11</p>
				<p id="stat-4">16</p>
				<p id="stat-5">1</p>
			</div> 
		</div><br>	
		<button type="button" onclick="testThisSlot(thisSlot)">Submit</button>
	</form>

</body>

	<script>
		// audio files preload
		let audioFiles = [
			{src: 'sounds/pistol.mp3', preload: 'auto'},
			{src: 'sounds/scroll.mp3', preload: 'auto'},
			{src: 'sounds/brush.mp3', preload: 'auto'},
			{src: 'sounds/guitar.mp3', preload: 'auto'},
			{src: 'sounds/keyboard.mp3', preload: 'auto'},
			{src: 'sounds/rocket.mp3', preload: 'auto'},
			{src: 'sounds/hit.mp3', preload: 'auto'}
		];
		
		let audioSamples = [];
		
		preloadAudio();
		
		function preloadAudio(){
			for(let i = 0; i < audioFiles.length; i++){
				let audio = new Audio();
				audio.src = audioFiles[i].src;
				audio.preload = audioFiles[i].preload;
				audioSamples.push(audio);		
			}
		}
		
		function stopCurrentAudioSample(){
			for(let i = 0; i < audioSamples.length; i++){
				if(!audioSamples[i].paused){
					audioSamples[i].pause();
					audioSamples.currentTime = 0;
				}
			}
		}
	
		// initializations
		document.addEventListener('contextmenu', event => event.preventDefault());
		
		let thisSlot = '<?php echo $thisSlot; ?>';
		let pitch = 0, roll = 0, yaw = 0;

		let fireTrue = 0;
		let blockTrue = 0;
		let counter = 0;
		let currentSlot = " ";	
		let playerId = " ";
		let message_send = false;
		let endRound = false;
		
		// reconnect player
		<?php if(isset($reconnected)): ?>
			let reconnected = <?php echo ($reconnected !== null && $reconnected ? 'true' : 'false'); ?>;
			if(reconnected){
				let tempSlot = '<?php echo $previousSlot; ?>';
				let tempId = '<?php echo $previousId; ?>';
				let xmlhttpId = new XMLHttpRequest();				
					xmlhttpId.onreadystatechange = function() {
						if (xmlhttpId.readyState == XMLHttpRequest.DONE) {
							if (xmlhttpId.status == 200) {
								if(isJsonString(xmlhttpId.responseText)){	
									let response = JSON.parse(xmlhttpId.responseText);
									if(response.valid == true){
										alert("Reconnected!");
										currentSlot = '<?php echo $previousSlot; ?>';	
										playerId = '<?php echo $previousId; ?>';
										document.getElementById('playerForm').style.display = "none";
										const otherSlotsElement = document.getElementById('otherSlots');
										if(otherSlotsElement){										
											otherSlotsElement.style.display = "none"; 
										} 
										document.getElementById('playerCurrentSlot').innerHTML = "Player: " + currentSlot;
										document.getElementById('content').style.display = "block";
									}else if(response.valid == false){	
										alert("Round has ended!");
										thisSlot = '<?php echo $thisSlot; ?>';
										document.cookie = 'loggedIn=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
										document.getElementById('playerForm').style.display = "none";
										document.getElementById('content').style.display = "none";
										const otherSlotsElement = document.getElementById('otherSlots');
										if(otherSlotsElement){										
											otherSlotsElement.style.display = "block"; 
										} 
									} 									
								}																
							}
							else if (xmlhttpId.status == 400) {
								alert('There was an error 400');
							}
							else {
								alert('something else other than 200 was returned');
							}
						}
						
					};
					xmlhttpId.open('GET', 'php/create_player.php?slot='+tempSlot+'&id='+tempId, true);
					xmlhttpId.send();	
			}
		<?php endif; ?>
		
		// fullscreen button
		function toggleFullscreen() {
			var elem = document.documentElement;
			if(document.fullscreenElement){
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.webkitExitFullscreen) { /* Safari */
					document.webkitExitFullscreen();
				} else if (document.msExitFullscreen) { /* IE11 */
					document.msExitFullscreen();
				}
			}else{
				if (elem.requestFullscreen) {
					elem.requestFullscreen();
				} else if (elem.webkitRequestFullscreen) { /* Safari */
					elem.webkitRequestFullscreen();
				} else if (elem.msRequestFullscreen) { /* IE11 */
					elem.msRequestFullscreen();
				}				
			}
		}

		function OtherSlots(){
			document.getElementById('otherSlots').style.display = "block"; 	
			document.getElementById('playerForm').style.display = "none"; 
		}
		
		if(thisSlot == " "){
			document.getElementById('playerForm').style.display = "none";
			document.getElementById('otherSlots').style.display = "block";
		}else{
			document.getElementById('slotHeading').innerHTML = "You are currently contesting slot " + thisSlot;	
			document.getElementById('slotHeading').style.marginBottom = "40px";			
		}
		
		function displayCharacter(){
			let stats = [[21, 38, 25, 11, 16, 1], [5, 13, 1, 30, 30, 30], [1, 26, 32, 40, 24, 11], [5, 30, 30, 1, 30, 1]];
			let optionIndex = document.getElementById('character').selectedIndex;
			optionIndex += 1;
			document.getElementById('character-img').style.backgroundImage = "url('sprites/characters-sprite-sheet/character-" + optionIndex + "/ani-2.png')";
			
			for (let i = 0; i < 6; i++){
				document.getElementById('stat-' + i).innerHTML = stats[optionIndex-1][i];
			}
		}
		
		function fire()
		{
			fireTrue = 1;
		}
		
		function block()
		{
			blockTrue = 1;
		}
		
		if(window.DeviceOrientationEvent) 
		{
			window.addEventListener('deviceorientation', handleOrientation);
			//console.log("Device Orientation is enabled");
			//document.getElementById('mobileDebug').innerHTML = "Device Orientation is enabled";
		} 
		else 
		{
			console.log("Device Orientation is not supported");
			//document.getElementById('mobileDebug').innerHTML = "Device Orientation is not supported";
		}

		function handleOrientation(event) 
		{
			pitch = event.alpha;
			roll = event.beta;
			yaw = event.gamma;
			
			//document.getElementById('pitch').innerHTML = 'pitch ' + pitch;
			//document.getElementById('roll').innerHTML = 'roll ' + roll;
			//document.getElementById('yaw').innerHTML = 'yaw ' + yaw;	
		}
			
		// disconnect Player
		function disconnect()
		{	
			let text = "Are you sure you want to disconnect?";
			if (confirm(text) == true) {
				let xmlhttpId = new XMLHttpRequest();				
				xmlhttpId.onreadystatechange = function() {
					if (xmlhttpId.readyState == XMLHttpRequest.DONE) {
						if (xmlhttpId.status == 200) {
							alert('You have been disconnected from slot ' + currentSlot);
							document.cookie = "loggedIn=0; expires=Thu, 18 Dec 2013 12:00:00 UTC";
							location.reload();					
						}		
						else if (xmlhttpId.status == 400) {
								alert('There was an error 400');
						}
						else {
							alert('something else other than 200 was returned');
						}
					}			
				};
				xmlhttpId.open("GET", "php/create_player.php?slot="+currentSlot+"&disconnect=dis", true);
				xmlhttpId.send();						
			}else {
				text = "You canceled!";
			}
		}
		
		function testThisSlot(thisSlot)
		{
			if(thisSlot != " "){
				let slot = thisSlot;
				let xmlSlots = new XMLHttpRequest();
				
				// test if this slot is available or taken
				xmlSlots.onreadystatechange = function() {
					if (xmlSlots.readyState == XMLHttpRequest.DONE) {
						if (xmlSlots.status == 200) {
							try{
								let slots = JSON.parse(xmlSlots.responseText);
								console.log(xmlSlots.responseText);
								if(slots.current == slot){
									currentSlot = slots.current;
									document.getElementById('playerCurrentSlot').innerHTML = "Player: " + currentSlot;
									document.getElementById('content').style.display = "block";
									
									// send player data in order for the new character to be created
									let name = document.getElementById("name").value;
									let character = document.getElementById("character").value;
												
									let xmlhttp = new XMLHttpRequest();
									xmlhttp.onreadystatechange = function(){
										if (xmlhttp.readyState == XMLHttpRequest.DONE) {
											if (xmlhttp.status == 200) {
												let createdPlayerData = JSON.parse(xmlhttp.responseText);
												playerId = createdPlayerData.id;
												document.cookie = 'loggedIn=' + slot + '&' + createdPlayerData.id;
												alert('You are Player ' + currentSlot);
												document.getElementById('playerForm').style.display = "none"; 
												//document.getElementById('responseDebugCreatePlayer').innerHTML = xmlhttp.responseText;
												message_send = false;
											}else if (xmlhttp.status == 400) {
												alert('There was an error 400');
											}else {
												alert('something else other than 200 was returned');
											}
										} 
									};
									xmlhttp.open("GET", "php/create_player.php?slot="+currentSlot+"&name="+encodeURIComponent(name)+"&character="+encodeURIComponent(character), true);
									xmlhttp.send();
									
									//alert("Player data sent");
								}else if(slots.current == "taken"){
									alert('Slot ' + slot + ' is taken');
									document.cookie = 'loggedIn=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
									OtherSlots();								
								}else if(slots.current == "endround"){ // if the round is ended then show the correct message
									document.cookie = 'loggedIn=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
									alert("Round has ended, please wait for the next round");
									document.getElementById('content').style.display = "none";
									OtherSlots();							
								}
								
							}catch(err){
								location.reload();
								//window.location.href = 'mobile.php';
								//console.log(xmlSlots.responseText);
							}
						}
						else if (xmlSlots.status == 400) {
							alert('There was an error 400');
						}
						else {
							alert('something else other than 200 was returned');
						}
					}
				};
				
				xmlSlots.open("GET", "php/check_slots.php?slotTemp="+slot, true);
				xmlSlots.send();
			}else{
				alert('Bad url');
				document.getElementById('playerForm').style.display = "none"; 
				document.getElementById('otherSlots').style.display = "block";				
			}
		}		
				
		
		setInterval(sendData, 50);		
		

		function sendData()
		{
			if(parseInt(currentSlot) > -1 /* && (parseInt(playersNumberCreated) == parseInt(playersNumberInstallation) - 1) */){
				// test if the user is a valid one (by checking his/her id) before sending the data
				let xmlhttpId = new XMLHttpRequest();				
					xmlhttpId.onreadystatechange = function() {
					if (xmlhttpId.readyState == XMLHttpRequest.DONE) {
						if (xmlhttpId.status == 200) {
							//console.log(xmlhttpId.responseText);
							//try{
								if(isJsonString(xmlhttpId.responseText)){	
									let response = JSON.parse(xmlhttpId.responseText);
									if(response.valid == true){
										
										// send mobile data only if the user is a valid one for the current round
										let xmlhttp = new XMLHttpRequest();							
										xmlhttp.onreadystatechange = function() {
											if (xmlhttp.readyState == XMLHttpRequest.DONE) {
												if (xmlhttp.status == 200) {
												   //document.getElementById('responseDebug').innerHTML = "Response: " + xmlhttp.responseText + ", counter: " + counter; 
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
										xmlhttp.open("GET", "php/mobile.php?slot="+currentSlot+"&roll="+roll+"&fire="+fireTrue+"&block="+blockTrue, true);
										xmlhttp.send();
										
										fireTrue = 0;
										blockTrue = 0;	
										
										// read game data
										let xmlhttpRoundData = new XMLHttpRequest();
										xmlhttpRoundData.onreadystatechange = function(){
											if (xmlhttpRoundData.readyState == XMLHttpRequest.DONE) {
												if (xmlhttpRoundData.status == 200) {
													if(isJsonString(xmlhttpRoundData.responseText)){
														let roundData = JSON.parse(xmlhttpRoundData.responseText);
														let keys = Object.keys(roundData);
														console.log(roundData);
														
														endRound = roundData.endround;
														if(!message_send && endRound == "true"){
															alert("Round has ended, please wait for the next round");
															document.getElementById('content').style.display = "none";
															OtherSlots();
															message_send = true;
														}

														if(roundData["tookdmg" + parseInt(currentSlot)] == "true"){
															console.log("vibrate");
															navigator.vibrate(50);
															// play sound
															stopCurrentAudioSample();	
															audioSamples[1].play();
														}									
														if(roundData["fired" + parseInt(currentSlot)] == "true"){
															// play audio
															let type = roundData["type" + parseInt(currentSlot)]
															stopCurrentAudioSample();	
															audioSamples[parseInt(type)].play();												
														}
													}

												}else if (xmlhttpRoundData.status == 400) {
													alert('There was an error 400');
												}else {
													alert('something else other than 200 was returned');
												}
											} 
										};
										xmlhttpRoundData.open("GET", "php/round_data.php?data=read", true);
										xmlhttpRoundData.send();	
										
										
									}else if(response.valid == false){	
										if(!message_send && endRound == "true"){
											alert("Disconnected due to invalid player data or because round ended");
											document.getElementById('otherSlots').style.display = "none";		
											location.reload();
											message_send = true;
										}
										//window.location.href = 'mobile.php';
										location.reload();
										fireTrue = 0;
										blockTrue = 0;	
									} 
									
								}else{
									fireTrue = 0;
									blockTrue = 0;									
								}
										
							//}catch(err){
							//	alert("Round has ended, please refresh to join the new round");
							//	window.location.href = 'mobile.php';
							//}							
						}
						else if (xmlhttpId.status == 400) {
							alert('There was an error 400');
						}
						else {
							alert('something else other than 200 was returned');
						}
					}
					
				};
				xmlhttpId.open("GET", "php/create_player.php?slot="+currentSlot+"&id="+playerId, true);
				xmlhttpId.send();
							
			}else{
				fireTrue = 0;
				blockTrue = 0;				
			}
		}
		
/* 		function checkForVibration(){
			let xmlhttp = new XMLHttpRequest();
			xmlhttp.onreadystatechange = function(){
				if (xmlhttp.readyState == XMLHttpRequest.DONE) {
					if (xmlhttp.status == 200) {
						let tookDmgArray = JSON.parse(xmlhttp.responseText);


					}else if (xmlhttp.status == 400) {
						alert('There was an error 400');
					}else {
						alert('something else other than 200 was returned');
					}
				} 
			};
			xmlhttp.open("GET", "php/vibrate.php?slot="+currentSlot+"&name="+encodeURIComponent(name)+"&character="+encodeURIComponent(character), true);
			xmlhttp.send();					
		} */
		
		
 		function readPlayersNum(filePath){
			return fetch(filePath)
				.then(response => response.text())
				.catch(error => {
					console.erro(data);
				});
		} 
		
		function isJsonString(str){
			try {
				JSON.parse(str);
			} catch (e) {
				return false;
			}
			return true;
		}
		
	</script>
	
</html>
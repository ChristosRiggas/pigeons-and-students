let myFont;
let walls = false;
let bg = [];
let backgroundMusic;

let playersNumber;
let gameStarted = true;
let roundStarTimer = 10;
let roundEnded = false;
let nextRoundTimer = 15;
let resetRoundDataOnce = false;

let playersColorArray = [[255, 51, 51], [255, 153, 51], [255,255,51], [153, 255, 51], [51, 255, 255], [51, 153, 255], [255, 51, 255], [255, 255, 255]];
let tempColorArray;

let characterSpriteData = [];
let characterSpriteSheet = [];
let weaponSpriteData = [];
let weaponSpriteSheet = [];
let bulletSpriteData = [];
let bulletSpriteSheet = [];
let shieldSpriteData = [];
let shieldSpriteSheet = [];
let birdIconSpriteSheet;
let birdIconSpriteData;
let statSpriteSheet;
let statSpriteData;

// autoplay preview
let autoPlayOn = true;
let autoActionTimer = 1;

//QR codes
let qrCodesArray = [];

// round data
let tookDmgArray = [];
let firedArray = [];
let weaponType = [];
let roundDataResetTimer = 15;

// array of weapons with their stats - [pistol][scroll][brush][guitar][keyboard] - [damage, firerate, velocity]
let weaponStats = [[6, 50, 10],[16, 50, 13],[14, 45, 8],[8, 30, 10],[10, 45, 12]];
// array of shields with their stats - [default][A BIG SHIELD][golden shield] - [stamina]
let shieldStats = [[230, 64],[330, 84],[280, 64]];
// array of bombs with their effect - [curse][charm][damage] - [colorRed, colorGreen, colorBlue, damage, message]
let bombStats = [[0, 0, 0, 0, "Cursed"],[255, 105, 180, 50, "Charmed"],[255, 90, 90, 150, "Bombed"]];
// min and max limits of stats [maxHealth][maxStamina][armor][fireRate][fireVelocity][fireDamage]
let statsLimis = [[500, 1000],[150, 500],[1, 6],[50, 25],[8, 16],[6, 30]];

let slots = ["left", "right"]; // array will be created according to setup.html slots
let	players = [];
let birds = [];

let birdAnimations = []; // [0][0] => flying, [1][0] => drop
let characterAnimations = []; // characters 0-4, e.g [0][0] => character 0, e.g [0][0][0] => character 0 first frame
let weaponAnimations = []; // [0] => pistol, scroll, brush, guitar, keyboard, rocket
let bulletAnimations = []; // [0] => pistol, scroll, brush, guitar, keyboard, rocket
let shieldAnimations = []; // [0] => default, a big shield, golden shield
let statSprites = []; // [maxHealth, maxStamina, armor, fireRate, fireVelocity, fireDamage]
let birdIconSprites = []; // [weapon, shield, stats, bomb, mystery]

function preload() {
	// load font
	myFont = loadFont('../style/fonts/Minecraft.ttf');

	//load background image
	for(let i = 0; i < 8; i++){
		bg[i] = loadImage('../style/images/background/' + i + '.png');
	}

	//load background sound
	backgroundMusic = loadSound('../sounds/garbage-file-classic-arcade-game-116811.mp3');

	//load QR codes images
	for(let i = 0; i < 4; i++){
		qrCodesArray[i] = loadImage('../style/images/qr/slot' + i + '.jpg');
	}

	// read the players lenght that was set at the installation form
	readPlayersNum('../php/data/installation_form_app.data')
		.then(dataText => {
			playersNumber = dataText;
	});

	resetSlots();

	// load bird sprite sheet
	birdSpriteData = loadJSON('../sprites/bird-sprite-sheet/bird.json');
	birdSpriteSheet = loadImage('../sprites/bird-sprite-sheet/bird.png');
	birdDropSpriteData = loadJSON('../sprites/bird-sprite-sheet/bird-drop.json');
	birdDropSpriteSheet = loadImage('../sprites/bird-sprite-sheet/bird-drop.png');

	// load characters sprite sheet
	for(let i = 0; i < 5; i ++){
		characterSpriteData[i] = [];
		characterSpriteSheet[i] = [];
		for(let j = 0; j < 6; j ++){
			characterSpriteData[i][j] = loadJSON('../sprites/characters-sprite-sheet/character-' + i + '/ani-' + j + '.json');
			characterSpriteSheet[i][j] = loadImage('../sprites/characters-sprite-sheet/character-' + i + '/ani-' + j + '.png');
		}
	}

	// load shield sprite sheet
	for(let i = 0; i < 3; i ++){
		shieldSpriteData[i] = loadJSON('../sprites/shields-sprite-sheet/shield-' + i + '.json');
		shieldSpriteSheet[i] = loadImage('../sprites/shields-sprite-sheet/shield-' + i + '.png');
	}

	// load weapon and bullet sprite sheet
	for(let i = 0; i < 6; i ++){
		weaponSpriteData[i] = loadJSON('../sprites/weapons-sprite-sheet/weapon-' + i + '.json');
		weaponSpriteSheet[i] = loadImage('../sprites/weapons-sprite-sheet/weapon-' + i + '.png');
		bulletSpriteData[i] = loadJSON('../sprites/bullets-sprite-sheet/bullet-' + i + '.json');
		bulletSpriteSheet[i] = loadImage('../sprites/bullets-sprite-sheet/bullet-' + i + '.png');
	}

	// load stats sprite sheet
	statSpriteData = loadJSON('../sprites/stats-sprite-sheet/stats.json');
	statSpriteSheet = loadImage('../sprites/stats-sprite-sheet/stats.png');
	// load bird-drop icon sprite sheet
	birdIconSpriteData = loadJSON('../sprites/bird-sprite-sheet/bird-icons.json');
	birdIconSpriteSheet = loadImage('../sprites/bird-sprite-sheet/bird-icons.png');
}

function createAnimation(spriteSheet, spriteData, arrayPush) {
	let frames = spriteData.frames;
	for(let i = 0; i < frames.length; i ++){
		let pos = frames[i].frame;
		let img = spriteSheet.get(pos.x, pos.y, pos.w, pos.h);
		// resize img
		if(spriteSheet == birdSpriteSheet || spriteSheet == birdDropSpriteSheet){
			img.resize(pos.w*1.3, pos.h*1.3);
		}

		if(spriteSheet == statSpriteSheet){
			img.resize(pos.w/1.5, pos.h/1.5);
		}

		/*//console.log(spriteSheet);
		//for(let i = 0; i < bulletSpriteSheet.lenght; i++){
			if(spriteSheet == bulletSpriteSheet[0]){
				console.log("bullet IMG");			
				img.resize(pos.w/2, pos.h/2);
			}
		//}*/

		if(spriteSheet == birdIconSpriteSheet){
			img.resize(pos.w/1.7, pos.h/1.7);
		}

		arrayPush.push(img);
	}
}

function changeBg(){
	let rand = random([0, 1, 2, 3, 4, 5, 6, 7]);
	currentBg = bg[rand];
}

function setup() {
	clearStorage();

	//createCanvas(600, 600);
	createCanvas(displayHeight * 1, displayHeight * 1);

	//font
	textFont(myFont);

	//background
	changeBg();	

	//loop backgroundMusic
	backgroundMusic.loop();

	//players color array
	tempColorArray = playersColorArray;

	//round data initialization
	resetRoundData();

	// -----------------------------create animations---------------------------
	createAnimation(birdSpriteSheet, birdSpriteData, birdAnimations[0] = []);
	createAnimation(birdDropSpriteSheet, birdDropSpriteData, birdAnimations[1] = []);
	for(let i = 0; i < 5; i ++){
		characterAnimations[i] = [];
		for(let j = 0; j < 6; j ++){
			createAnimation(characterSpriteSheet[i][j], characterSpriteData[i][j], characterAnimations[i][j] = []);
		}
	}
	// weapons and bullets animations
	for(let i = 0; i < weaponSpriteSheet.length; i ++){
		createAnimation(weaponSpriteSheet[i], weaponSpriteData[i], weaponAnimations[i] = []);
		createAnimation(bulletSpriteSheet[i], bulletSpriteData[i], bulletAnimations[i] = []);
	}
	// shields animations
	for(let i = 0; i < shieldSpriteSheet.length; i ++){
		createAnimation(shieldSpriteSheet[i], shieldSpriteData[i], shieldAnimations[i] = []);
	}
	// stats spites
	createAnimation(statSpriteSheet, statSpriteData, statSprites);
	// bird-drop icons sprites
	createAnimation(birdIconSpriteSheet, birdIconSpriteData, birdIconSprites);

	//initialize players slots for preview purposes 
	for (let i = 0; i < playersNumber; i++) {
		players[i] = "";
	}

	for (let i = 0; i < playersNumber; i++) {
		let botName = "Bot " + i;
		let randomChar = random(["scholar", "painter", "metalhead", "hacker"]);
		createPlayer(i, botName.toString(), randomChar, -1, "bot");

		//players[i].weapon = new weapon(i, weaponAnimations[0], bulletImg, 3, 60, 12, 10);
		//players[i].shield = new shield(i, shieldAnimations[0], 1000);
	}
	countPlayers = -1;

	// create birds
	for (let i = 0; i < parseInt(playersNumber); i++) {
		birds[i] = new bird(birdAnimations, random([-500, width + 500]), random(-20, height - 100), random(0.15, 0.4));
	}

	//setInterval(getData, 50);
	//setInterval(sendData, 50);
}

function draw() {
	//---------------------------------------------GET ROUND DATA------------------------------------------------
	getData();	// read-data.php

	//-------background--------
	//background(10, 100);
	//background(30);
	if(walls){
		clear();
	}else{
		push();
			tint(200);
			background(currentBg);
		pop();
	}

	// show Qr codes
	push();
	imageMode(CENTER);
	for (let i = 0; i < parseInt(playersNumber); i++) {
		if (players[i] == "" || autoPlayOn) {
			if ((i + 2) % 2 == 0) {
					tint(255, 180);
					image(qrCodesArray[i], int(localStorage.getItem('position-' + i + '-x')) + 150, int(localStorage.getItem('position-' + i + '-y')) - 150, 150, 150);
			} else {
					tint(255, 180); 
					image(qrCodesArray[i], int(localStorage.getItem('position-' + i + '-x'))  - 150, int(localStorage.getItem('position-' + i + '-y')) - 150, 150, 150);
				}
			}
		}
	pop();

	// pre start round message
	let ansPlayers = checkHowManyPlayersHaveHealthComponent(players);
	if (!gameStarted && ansPlayers < 2){
		push();
			textSize(40);
			textAlign(CENTER);
			stroke(0);
			strokeWeight(5);	
			fill(255);
			text("Waiting for Players...", width/2, height/2);
		pop();	
	}

	//check for autoplay
	if (players.every((val, i, arr) => val === "") && gameStarted == false && roundEnded == false && autoPlayOn == false) {

		tempColorArray = [[255, 51, 51], [255, 153, 51], [255, 255, 51], [153, 255, 51], [51, 255, 255], [51, 153, 255], [255, 51, 255], [255, 255, 255]];
		for (let i = 0; i < players.length; i++) {
			let botName = "Bot " + i;
			let randomChar = random(["scholar", "painter", "metalhead", "hacker"]);
			createPlayer(i, botName.toString(), randomChar, -1, "bot");
		}
		//localStorage.clear();
		autoPlayOn = true;
		roundStarTimer = 10;
	}

	//----------------------------------------------------PLAYER-----------------------------------------------------------------
	// reset round data pre game start phase
	if (players.length == parseInt(playersNumber) && ansPlayers >= 2 && gameStarted == false && resetRoundDataOnce == false) { 

		resetRoundDataOnce = true;
		resetRoundData();
	}

	// when the game starts reset the mobile data for the players
	if (players.length == parseInt(playersNumber) && ansPlayers >= 2 && gameStarted == false) {
		
		if (frameCount % 60 == 0 && roundStarTimer > 0) {
			roundStarTimer--;		
		}

		push();
			textSize(60);
			textAlign(CENTER);
			stroke(0);
			strokeWeight(5);	
			fill(255);
			text(roundStarTimer, width/2, height/2);
		pop();			
		
		if(roundStarTimer == 0){
			resetMobileData();
			console.log("game started");
			gameStarted = true;
			// preview autoplay
			localStorage.clear();
			//autoPlayOn = true;
		}
	}

	for (let i = 0; i < players.length; i++){
		if(players[i] != ""){
			players[i].display();

			if(gameStarted && players[i].health > 0){
				players[i].weapon.update();
				
				// check for undifined nextShotIn
				if(players[i].weapon.nextShotIn == undefined){
					//console.log("player's " + i + " nextShotIn is undefined");
					players[i].weapon.nextShotIn = players[i].weapon.fireRate;
				}
			}

			//--------------------------------------SET POSITIONS-----------------------------------------------
			players[i].update(int(localStorage.getItem('position-' + i + '-x')), int(localStorage.getItem('position-' + i + '-y')));

			//---------------------------------------MOBILE CONTROLS-------------------------------------------
			if(players[i].health > 0){
				if(gameStarted){
					//-------------fire mobile-------------------------------------------------------
					if (int(localStorage.getItem('fire' + i)) == 1 && players[i].weapon.nextShotIn == 0 && players[i].shield.shieldStamina >= players[i].stats.fireDamage){
						if(players[i].blockEnable == true){
							players[i].blockSwitch();
							players[i].blockMobile = false;
						}
						players[i].weapon.fireBullet();
						players[i].weapon.nextShotIn = players[i].weapon.fireRate;
					}

					//-----------block mobile-----------------------------------------------------------
					if (int(localStorage.getItem('block' + i)) == 1 && players[i].blockMobile == false){
						players[i].blockSwitch();
						players[i].blockMobile = true;
					}else if(int(localStorage.getItem('block' + i)) == 0){
						players[i].blockMobile = false;
					}

					// preview autoplay
					if (autoPlayOn) {
						let autoFire = random([0, 0, 1, 1, 1, 2, 2]);

						if (frameCount % 60 == 0 && autoActionTimer > 0) {
							autoActionTimer--;
						}

						if (autoActionTimer == 0 && gameStarted == true && roundEnded == false) {
							if (autoFire == 1 && gameStarted == true && players[i].weapon.nextShotIn == 0 && players[i].shield.shieldStamina >= players[i].stats.fireDamage) {
								if (players[i].blockEnable == true) {
									players[i].blockSwitch();
									players[i].blockMobile = false;
								}
								players[i].weapon.fireBullet();
								players[i].weapon.nextShotIn = players[i].weapon.fireRate;

							} else if (autoFire == 2 && gameStarted == true && players[i].blockMobile == false) {
								players[i].blockSwitch();
								players[i].blockMobile = true;
							} else {
								players[i].blockMobile = false;
							}
							autoActionTimer = 1;
						}
					}
				}

				// preview autoplay aiming
				if (autoPlayOn) {
					let autoRoll = random([68, 33, -33, -68, 33, -33, 68, -68, 0, 0]);

					if (frameCount % 60 == 0 && autoActionTimer > 0) {
						autoActionTimer--;
					}

					if (autoActionTimer == 0 && gameStarted == true && roundEnded == false) {
						if (autoRoll > 90 || autoRoll < -90) {
							if (autoRoll > 0) {
								autoRoll = 180 - autoRoll;
							} else {
								autoRoll = (180 + autoRoll) * -1;
							}
						}
						if (autoRoll >= -90 && autoRoll <= 90) {
							if ((i + 2) % 2 == 0) {
								let rotateRight = radians(map(autoRoll, -90, 90, -120, 120, true));  // i = 0 & i = 2 rotate right side
								players[i].setReticleAngle(rotateRight);
							} else {
								let rotateLeft = radians(map(autoRoll, -90, 90, 300, 60, true));  // i = 1 & i = 3 rotate left side
								players[i].setReticleAngle(-rotateLeft);
							}
						}
					}
				}

				// disable autoplay preview when at least one player join the game
				//if (localStorage.length > playersNumber * 2 && autoPlayOn) {
				if (!checkSameAttributeValue(players, 'bot') && autoPlayOn) {
					autoPlayOn = false;
					gameStarted = false;
					resetRoundData();

					for (let i = 0; i < players.length; i++) {
						//if (localStorage.getItem('roll' + i) == "undefined") {
						if (players[i].bot == "bot") {
							players[i] = "";
						}
					}
					roundStarTimer = 10;
				}

				if (autoPlayOn && gameStarted && !roundEnded) {
					push();
						textSize(40);
						textAlign(CENTER);
						stroke(0);
						strokeWeight(5);
						fill(255);
						text("Scan QR Code", width / 2, height / 2);
					pop();	
				}

				//----------aiming mobile--------------------------------------------------------
				let roll = float(localStorage.getItem('roll' + i)); 
				if(roll > 90 || roll < -90){
					if(roll > 0){
						roll = 180 - roll;
					}else{
						roll = (180 + roll) * -1;
					}
				}
				if(roll >= -90 && roll <= 90){
					if((i + 2) % 2 == 0){
						let rotateRight = radians(map(roll, -90, 90, -120, 120, true));  // i = 0 & i = 2 rotate right side
						players[i].setReticleAngle(rotateRight);
					}else{
						let rotateLeft = radians(map(roll, -90, 90, 300, 60, true));  // i = 1 & i = 3 rotate left side
						players[i].setReticleAngle(-rotateLeft);
					}
				}
			}
			
		}

		// set round data for every player
		if(gameStarted){
			/*if(players[i].tookDmgOnce || players[i].fired){
				tookDmgArray = checkWhichPlayersTookDmg();
				firedArray = checkWhichPlayersFired();
				//console.log(firedArray);
				//console.log("Player " + i + " took dmg");
				//sendRoundData(tookDmgArray, firedArray, roundEnded);
			}*/

			if(players[i].firedOnce){
				firedArray[i] = true;
				weaponType[i] = players[i].tempBulletSoundIndex;
				players[i].firedOnce = false;
				//console.log("player " + i + " fired!");
			}

			if(players[i].tookDmgOnce){
				tookDmgArray[i] = true;
				players[i].tookDmgOnce = false;
			}
		}

	}

	// send data to mobiles 
	if(gameStarted){
		//console.log("tookDmgArray: " + tookDmgArray);
		//console.log("fireArray: " + firedArray);
		sendRoundData(tookDmgArray, firedArray, weaponType, roundEnded);
		roundDataResetTimer--;

		if(roundDataResetTimer < 10){
			for (let i = 0; i < parseInt(playersNumber); i++) {
				tookDmgArray[i] = false;
			}
		}
		
		if(roundDataResetTimer <= 0){
			for (let i = 0; i < parseInt(playersNumber); i++) {
				players[i].firedOnce = false;
				firedArray[i] = false;
			}
			roundDataResetTimer = 15;
		}
	}

	//-----------------------------------------------------BIRDS------------------------------------------------------
	for (let bird of birds) {
		bird.display();
		//bird.displayHitBox();
		bird.update();
    }

	//----------ckeck for winner (every player but 1 has 0 health)-----------------------
	let ans = checkIfEveryPlayerButOneHasDied(players, 0);
	let ans2 = players.every((val, i, arr) => val === arr[0])
	if ((ans > -1 && gameStarted == true) || (ans2 && gameStarted == true)) {
		if (nextRoundTimer == 1) {
			resetSlots();
		}

		if (nextRoundTimer == 0) {
			for (let i = 0; i < players.length; i++) {
				//console.log("reset players");
				players[i] = "";
			}

			tempColorArray = [[255, 51, 51], [255, 153, 51], [255, 255, 51], [153, 255, 51], [51, 255, 255], [51, 153, 255], [255, 51, 255], [255, 255, 255]];
			for (let i = 0; i < players.length; i++) {
				let botName = "Bot " + i;
				let randomChar = random(["scholar", "painter", "metalhead", "hacker"]);
				createPlayer(i, botName.toString(), randomChar, -1, "bot");
			}

			resetSlots();
			tempColorArray = [[255, 51, 51], [255, 153, 51], [255, 255, 51], [153, 255, 51], [51, 255, 255], [51, 153, 255], [255, 51, 255], [255, 255, 255]];
			resetRoundDataOnce = false;
			roundEnded = false;
			countPlayers = -1;
			gameStarted = false;
			nextRoundTimer = 15;
			roundStarTimer = 10;
			// autoplay
			autoPlayOn = true;
			gameStarted = true;
			localStorage.clear();
			//
			changeBg();
			for (let i = 0; i < parseInt(playersNumber); i++) {
				players[i].tempBulletSoundIndex = 0;
			}

			for (let i = 0; i < parseInt(playersNumber); i++) {
				tookDmgArray[i] = false;
				firedArray[i] = false;
				weaponType[i] = 0;
				roundEnded = false;
			}
			sendRoundData(tookDmgArray, firedArray, weaponType, roundEnded);
			resetSlots();
		} else {
			roundEnded = true;
			tookDmgArray = checkWhichPlayersTookDmg();
			firedArray = checkWhichPlayersFired();
			sendRoundData(tookDmgArray, firedArray, weaponType, roundEnded);

			if (frameCount % 60 == 0 && nextRoundTimer > 0) {
				nextRoundTimer--;
			}

			push();
			textAlign(CENTER);
			strokeWeight(5);
			stroke(0);
			textSize(30);

			if (!players.every((val, i, arr) => val === "")) {
				fill(players[ans].col);
				text("Game Ended\n" + players[ans].name + " is the Winner!", width / 2, 280);

				/*for (let i = 1; i < players.length; i++) {
					players[i].health = 0;
				}
				*/

				push();
					rectMode(CORNER)
					textAlign(LEFT);
					strokeWeight(2);	
					textSize(18);
					let textYStart = 400;
					let textY = 40;
					let columnsSpacing = 250;
					let textX = width / 2 - ((players.length / 2) * columnsSpacing) + 40;
					let barMaxLength = 180;

					push();
						fill(0, 100);
						noStroke();
						rectMode(CENTER);
						rect(width / 2, (height / 2) - 10, width, 260);
					pop();
	
					// max statistics - limits for mapping
					maxStats = {
						"maxSecondsSurvived": 1, //
						"maxDamageReceived": 1, //
						"maxDamageDealt": 1, //
						"maxDamageBlocked": 1, //
						"maxItemsPickedUp": 1 //
					}

					for (let i = 0; i < players.length; i++) {
						if (players[i] != "") {
							if (players[i].afterGameStats.secondsSurvived > maxStats.maxSecondsSurvived) {
								maxStats.maxSecondsSurvived = players[i].afterGameStats.secondsSurvived;
							}
							if (players[i].afterGameStats.damageReceived > maxStats.maxDamageReceived) {
								maxStats.maxDamageReceived = players[i].afterGameStats.damageReceived;
							}
							if (players[i].afterGameStats.damageDealt > maxStats.maxDamageDealt) {
								maxStats.maxDamageDealt = players[i].afterGameStats.damageDealt;
							}
							if (players[i].afterGameStats.damageBlocked > maxStats.maxDamageBlocked) {
								maxStats.maxDamageBlocked = players[i].afterGameStats.damageBlocked;
							}
							if (players[i].afterGameStats.itemsPickedUp > maxStats.maxItemsPickedUp) {
								maxStats.maxItemsPickedUp = players[i].afterGameStats.itemsPickedUp;
							}
						}
					}

					for (let i = 0; i < players.length; i++) {
						if (players[i] != "") {
							fill(players[i].col);
							text("Time Survived: " + convertSeconds(round(players[i].afterGameStats.secondsSurvived, 2)) + "\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 0)));
							rect(textX + (i * columnsSpacing), textYStart + (textY + (textY * 0)) + 3, map(players[i].afterGameStats.secondsSurvived, 0, maxStats.maxSecondsSurvived, 1, barMaxLength), 6);

							let = accTemp = round((players[i].afterGameStats.accurateBullets * 100) / players[i].afterGameStats.bulletsFired);
							if (!isNaN(accTemp)) {
								text("Accuracy: " + accTemp + " %\n", textX + (i * columnsSpacing), textYStart + (textY + textY * 1));
								rect(textX + (i * columnsSpacing), textYStart + (textY + (textY * 1)) + 3, map(accTemp, 0, 100, 1, barMaxLength), 6);
							} else {
								text("Accuracy: " + "-" + "\n", textX + (i * columnsSpacing), textYStart + (textY + textY * 1));
								rect(textX + (i * columnsSpacing), textYStart + (textY + (textY * 1)) + 3, map(0, 0, 100, 1, barMaxLength), 6);
							}

							text("Damage Received: " + round(players[i].afterGameStats.damageReceived) + "\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 2)));
							rect(textX + (i * columnsSpacing), textYStart + (textY + (textY * 2)) + 3, map(players[i].afterGameStats.damageReceived, 0, maxStats.maxDamageReceived, 1, barMaxLength), 6);

							text("Damage Dealt: " + round(players[i].afterGameStats.damageDealt) + "\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 3)));
							rect(textX + (i * columnsSpacing), textYStart + (textY + (textY * 3)) + 3, map(players[i].afterGameStats.damageDealt, 0, maxStats.maxDamageDealt, 1, barMaxLength), 6);

							text("Damage Blocked: " + round(players[i].afterGameStats.damageBlocked) + "\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 4)));
							rect(textX + (i * columnsSpacing), textYStart + (textY + (textY * 4)) + 3, map(players[i].afterGameStats.damageBlocked, 0, maxStats.maxDamageBlocked, 1, barMaxLength), 6);

							text("Items Picked Up: " + players[i].afterGameStats.itemsPickedUp + "\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 5)));
							rect(textX + (i * columnsSpacing), textYStart + (textY + (textY * 5)) + 3, map(players[i].afterGameStats.itemsPickedUp, 0, maxStats.maxItemsPickedUp, 1, barMaxLength), 6);
						} else {
							fill(128);
							text("Time Survived: -\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 0)));
							text("Accuracy: -\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 1)));
							text("Damage Received: -\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 2)));
							text("Damage Dealt: -\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 3)));
							text("Damage Blocked: -\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 4)));
							text("Items Picked Up: -\n", textX + (i * columnsSpacing), textYStart + (textY + (textY * 5)));
						}
					}
				pop();

			} else {
				fill(255);
				text("Game Ended", width / 2, 200);
			}

			fill(255);
			text("Next Round in: " + nextRoundTimer, width / 2, height / 1.5);
			pop();

		}
	}

	/*
	//-------------------------------------------KEYBOARD CONTROLS-------------------------------------------------
	//----------------key Aiming-------------
	if (keyIsDown(65)) {	// 65 for "a" key
		players[0].rotateRaticle(-PI/180 * 2);
	}
	if (keyIsDown(68)) {	// 68 for "d" key
		players[0].rotateRaticle(PI/180 * 2);
	}
	if (keyIsDown(LEFT_ARROW)) { 
		players[1].rotateRaticle(-PI/180 * 2);
	}
	if (keyIsDown(RIGHT_ARROW)) { 
		players[1].rotateRaticle(PI/180 * 2);
	}
	*/

}

/*
function keyPressed() {
	//---------------firing-------------------------------
	if (keyCode === 69 && players[0].weapon.nextShotIn == 0) { // players[0] fires with 69 "numpad 0"
		if(players[0].blockEnable == true){
			players[0].blockSwitch();
			tempBlock = false;
		}
		players[0].weapon.fireBullet();
		players[0].weapon.nextShotIn = players[0].weapon.fireRate;
	}
	if (keyCode === 96 && players[1].weapon.nextShotIn == 0) { // players[1] fires with 96 "e"
		if(players[1].blockEnable == true){
			players[1].blockSwitch();
			tempBlock = false;
		}
		players[1].weapon.fireBullet()
		players[1].weapon.nextShotIn = players[1].weapon.fireRate;
	}
	
	//----------block switch--------------------------
	if (keyCode === 81) {	// 81 for "q" key
		players[0].blockSwitch();
	}
	if (keyCode === 110) {	// 110 for "DEL" key
		players[1].blockSwitch();
	}
}	
*/


//----------------------------------------GET MOBILE DATA------------------------------------------------------
function getData(){
	let currentTime = hour() + ':' + nf(minute(), 2) + ':' + nf(second(), 2) + ':' + nf(millis(), 2);

	readPositions(); // read_setup-data.js
	readMobile();   // read_mobile-data.js
	checkForNewPlayers(); // read_create_player-data.js
}

//-----------------------------------------Player Creation-----------------------------------------------------
function createPlayer(slot, name, character, counter, bot) {
	//console.log("slot:" + slot + " name:" + name + " character:" + character + " counter:" + counter);
	if(counter != ""){	
		let characterIndex;
		let characterStats = []; // [maxHealth, maxStamina, armor, fireRate, fireVelocity, fireDamage]
		//let playerColor = color(random(180,255), random(180,255), random(180,255), 255);
		let randIndex = Math.floor(Math.random()*tempColorArray.length);
		let playerColor = tempColorArray[randIndex];
		tempColorArray.splice(randIndex, 1);

		// set charcter image and stats
		if(character == "scholar"){
		characterIndex = 1;
		characterStats = [0, -25, 0.5, 6, 1, 5];
		}else if(character == "painter"){
		characterIndex = 2;
		characterStats = [150, 25, 1.5, 0, -1, 1];
		}else if(character == "metalhead"){ 
		characterIndex = 3;
		characterStats = [50, 0.5, 2, 8, 0, 0];
		}else if(character == "hacker"){ 
		characterIndex = 4;
		characterStats = [0, 25, 0, 7.5, 0.4, 1];
		}

		let side;
		if(slot % 2 == 0){
			side = 0;
		}else{
			side = 1;
		}
		
		//console.log(parseInt(counter));
		// tests that the players number is not higher than players.lenght -1
		if (parseInt(playersNumber) != parseInt(counter)) {
			//console.log("player");
			onePlayer = new player(slot, name, characterAnimations[characterIndex], slots[side], -500, -500, playerColor, characterStats, bot);
			//players.push(onePlayer);
			players.splice(slot, 1, onePlayer);

			// creat default weapon and shield
			players[slot].weapon = new weapon(slot, weaponAnimations[0], bulletAnimations[0], weaponStats[0][0], weaponStats[0][1], weaponStats[0][2], 10);
			players[slot].shield = new shield(slot, shieldAnimations[0], shieldStats[0][0], shieldStats[0][1]);
		}
	}
}

function checkForAtLeastOne(array, something){
	for (let i = 0; i < array.length; i++) {
		if(array[i] == something){
			return true;
		}
	}
	return false;
}

function checkForAtLeastTwo(array, something) {
	let two = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i] == something) {
			two++;
		}
	}

	if (two == 2) {
		return true;
	} else {
		return false;
	}
}

function checkIfEveryPlayerButOneHasDied(array, something){
	let counter = 0;
	let whoLives;
	let arrayofActivePlayersLength = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i] != "") {
			if (array[i].health == something) {
				counter++;
			} else {
				whoLives = i;
			}
			arrayofActivePlayersLength++;
		}
	}

	if (counter == arrayofActivePlayersLength - 1){
		return whoLives;
	}else{
		return -1;
	}

}

function checkHowManyPlayersHaveHealthComponent(array) {
	let counter = 0;
	for (let i = 0; i < array.length; i++) {
		if (array[i].health) {
			counter++;
		}
	}
	return counter;
}

function checkWhichPlayersTookDmg(){
	let TheseTookDmg = [];
	for (let i = 0; i < players.length; i++){
		if(players[i].tookDmgOnce){
			TheseTookDmg[i] = true;
		}else{
			TheseTookDmg[i] = false;
		}
	}

	return TheseTookDmg;
}

function checkWhichPlayersFired(){
	let TheseFired = [];
	for (let i = 0; i < players.length; i++){
		if(players[i].firedOnce){
			//players[i].firedOnce = false;
			TheseFired[i] = true;
		}else{
			TheseFired[i] = false;
		}
	}

	return TheseFired;
}

function calculatePropability(propabilityArray, randomValue){
	let selectedIndex;
	let addPropability = 0;
	for (let i = 0; i < propabilityArray.length; i++){
		addPropability += propabilityArray[i];
		if(randomValue < addPropability){
			selectedIndex = i;
			break;
		}
	}

	return selectedIndex;
}

function checkSameAttributeValue(arr, attributeName) {
	if (arr.length === 0) {
		return true;
	}

	const targetValue = arr[0][attributeName]; 

	for (let i = 1; i < arr.length; i++) {
		if (arr[i][attributeName] !== targetValue) {
			return false;
		}
	}

	return true;
}

function convertSeconds(s) {
	let min = Math.floor(s / 60);
	let sec = (s % 60);
	let formatted = min.toString().padStart(2, '0') + ':' + sec.toString().padStart(2, '0');
	return formatted
}

function resetRoundData() {
	for (let i = 0; i < parseInt(playersNumber); i++) {
		tookDmgArray[i] = false;
		firedArray[i] = false;
		weaponType[i] = 0;
		roundEnded = false;
	}
	sendRoundData(tookDmgArray, firedArray, weaponType, roundEnded);
}























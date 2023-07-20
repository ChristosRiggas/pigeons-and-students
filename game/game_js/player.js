class player {
	constructor(playerId, name, animations, slot, playerPosX, playerPosY, col, stats, bot){
		this.playerId = playerId;
		this.slot = slot;
		this.name = name;
		this.bot = bot;
		if(this.name.length == 0 || this.name.replace(/\s/g, '').length==0){
			this.name = "Player " + this.playerId;
		}

		this.x = playerPosX;
		this.y = playerPosY;
			this.radius = 10;
			this.col = col;

		// animation
		this.bodyAnimation = animations;
		this.w = this.bodyAnimation[0][0].width;
		this.h = this.bodyAnimation[0][0].height;
		this.index = 0; // index of frames in body animation
		this.indexAni = 0; //index of animation in body animation depending the aiming angle
		//this.hitbox = [this.x - this.w / 5.75, this.y - this.h / 4, this.w / 3, this.h / 2.3];
		this.hitbox = [this.x, this.y, this.w / 2.8, this.h / 2.2];
		this.deathAniCounter = 0;

		// equipment
		this.weapon;
		this.shield;
		this.bombType = null;
		this.tempBulletSoundIndex = 0; // used for round data weapon type

		// player stats
		this.stats = {
			"maxHealth": statsLimis[0][0] + stats[0],
			"maxStamina": shieldStats[0][0] + stats[1],
			"armor": statsLimis[2][0] + stats[2],
			"fireRate": weaponStats[0][1] - stats[3],
			"fireVelocity": weaponStats[0][2] + stats[4],
			"fireDamage": weaponStats[0][0] + stats[5]
		}

		// player after game statistics
		this.timer = 1;
		this.afterGameStats = {
			"secondsSurvived": 0, //
			"bulletsFired": 0, // accuracy
			"accurateBullets": 0, // accuracy
			"damageReceived": 0, //
			"damageDealt": 0, //
			"damageBlocked": 0, //
			"itemsPickedUp": 0 //
		}

		// player events
		this.health = this.stats.maxHealth;
		this.blockEnable = false; // block is active
		this.blockMobile = false; // block was enebled by mobile already
		this.tookDmgOnce = false;
		this.tookDmg = false;
		this.tookDmgTimer = 0;
		this.cursed = false;
		this.firedOnce = false;

		// aiming vectors
		this.reticleLength = 70;
		this.originVector = 0;
		this.aimingVector = 0;
		if(this.slot == "right"){
			this.aimingAngle = -PI;
		}else{
			this.aimingAngle = 0; // in radians
		}

		// message settings
		this.messageActive = false;
		this.messageActiveTimer = 0;
		this.messageFade = 255;
		this.messageY = -60;
		this.messageColor;
		this.message = "";
	}
	
	display() {
		if(this.slot == "left"){
			this.indexAni = map(this.aimingAngle, -1.5, 1.5, 0, 4.9, true);
			this.indexAni = floor(this.indexAni);
		}else if(this.slot == "right"){
			this.indexAni = map(this.aimingAngle, -1.6, -4.6, 0, 4.9, true);
			this.indexAni = floor(this.indexAni);
		}

		this.index += 0.05;
		let indexTemp = floor((this.index)) % this.bodyAnimation[0].length;

		push();
			imageMode(CENTER);
			//rectMode(RADIUS);
			fill(50, 125);
			//rect(this.x - 120, this.y - 250, 250, 400)

			stroke(0);
			strokeWeight(4);
			fill(this.col)
			//ellipse(this.x, this.y - 70, this.radius);

			textAlign(CENTER);
			textSize(25);
			/*let nameStr = this.name;
			if(nameStr.length==0 || nameStr.replace(/\s/g, '').length==0){
				text("Player " + this.playerId, this.x, this.y + 90);
			}else{*/
				text(this.name, this.x, this.y - 150);
			//}

			// display bird message ontop of the player
			this.displayMessages();

			// correct sprite orientation and side
			if(this.slot == "left"){
				translate(this.x, this.y);
				//rotate(this.aimingAngle);
			}else if(this.slot == "right"){
				scale(-1, 1);
				translate(-this.x, this.y);
				//rotate(-this.aimingAngle);
				//scale(-1, -1);
			}
			if(this.blockEnable){
				//tint(0, 255, 0, 128);
			}else{
				tint(255, 255, 255, 255);
			}

			if(this.tookDmg){
				tint(255, 0, 0, 255);
			}

			if(this.health > 0){
				image(this.bodyAnimation[this.indexAni][indexTemp], 0, -10);
			}else{
				if(this.deathAniCounter < 9){
					image(this.bodyAnimation[5][0], 0, -10);
				}else{
					image(this.bodyAnimation[5][1], 0, -10);
				}
			}
			
		pop();

		if(this.health > 0){
			this.displayHealthBar();
			this.displayBlockBar();
			this.displayStats();
		}

		//this.displayHitBox();
	}

	displayMessages(){
		if(this.messageActive){
			textSize(20);
			strokeWeight(2);
			stroke(0, this.messageFade);
			fill(this.messageColor[0], this.messageColor[1], this.messageColor[2], this.messageFade);
			text(this.message, this.x, this.y + this.messageY);
			this.messageActiveTimer++;
			this.messageY -= 0.3;
		}
		if(this.messageActiveTimer > 60){
			this.messageFade -= 10;
		}
		if(this.messageActiveTimer > 90){
			this.resetMessageSettings();
		}
	}

	resetMessageSettings(){
		this.message = "";
		this.messageActive = false;
		this.messageActiveTimer = 0;
		this.messageFade = 255;
		this.messageY = -60;
	}

	displayHitBox(){
		push();
			stroke(0);
			noFill();
			//rect(this.hitbox[0], this.hitbox[1], this.hitbox[2], this.hitbox[3]); // test hitbox
			circle(this.hitbox[0], this.hitbox[1], this.hitbox[2]);
		pop();
	}

	displayHealthBar(){
		push();
			rectMode(CENTER);
			fill(220, 4, 6);
			noStroke();
			rect(this.x, this.y - 130, map(this.health, 0, this.stats.maxHealth, 0, this.stats.maxHealth/10), 9);

			noFill();
			stroke(0);
			strokeWeight(2);
			rect(this.x, this.y -130, this.stats.maxHealth/10, 9);

			if(this.health > this.stats.maxHealth){
				this.health = this.stats.maxHealth;
			}
		pop();
	}

	displayBlockBar(){
		push();
			rectMode(CENTER);
			fill(4, 220, 6);
			noStroke();
			//drawingContext.setLineDash([30, 12, 10, 14]);
			rect(this.x, this.y - 118, map(this.shield.shieldStamina, 0, this.shield.maxShieldStamina, 0, this.shield.maxShieldStamina/5), 9);

			noFill();
			stroke(0);
			strokeWeight(2);
			rect(this.x, this.y - 118, this.shield.maxShieldStamina/5, 9);

			if(this.shield.shieldStamina > this.shield.maxShieldStamina){
				this.shield.shieldStamina = this.shield.maxShieldStamina;
			}
		pop();
	}

	displayStats(){
		push();
			stroke(0);
			strokeWeight(2);
			fill(this.col);
			textSize(20);

			let keys = Object.keys(this.stats);
			let statPosX;
			if(this.slot == "left"){
				statPosX = this.x - 130;
			}else if(this.slot == "right"){
				statPosX = this.x + 130;
			}
			let statPosY = this.y + 60;
			let spriteSize = statSprites[0].width;
			for(let i = 0; i < keys.length; i ++){
				let value = this.stats[keys[i]];
				let newValueForDisplay = map(value, statsLimis[i][0], statsLimis[i][1], 1, 99);
				newValueForDisplay = round(newValueForDisplay);
				text(newValueForDisplay, statPosX, statPosY);		
				image(statSprites[i], statPosX - 30, statPosY - 21);
				statPosY -= spriteSize + 5;
			}

			// display cursed icon
			push();
				fill(0);
				stroke(255);
				strokeWeight(1);
				if(this.cursed){
					ellipse(statPosX, statPosY - 5, 15);
				}
			pop();

		pop();
	}

	update(ajaxX, ajaxY){
		this.x = ajaxX;
		this.y = ajaxY;
		//this.mouseAim();
		this.keyOrMobileAim();

		// update hitbox
		//this.hitbox = [this.x - this.w / 5.75, this.y - this.h / 4, this.w / 3, this.h / 2.3];
		this.hitbox = [this.x, this.y, this.w / 2.8, this.h / 2.2];

		// correct health limits and check if player died
		if(this.health <= 0){
			this.weapon = null;
			this.health = 0;
			this.deathAniCounter++;
		}else if(this.health > this.stats.maxHealth){
			this.health = this.stats.maxHealth;
		}

		if (this.health > 0 && frameCount % 68 == 0 && this.timer > 0 && !roundEnded) {
			this.afterGameStats.secondsSurvived++;
			this.timer = 1;
		}

		// update shield stamina
		if(this.weapon != null && this.shield != null){
			this.shield.update();
			if(!this.blockEnable){
				this.weapon.display();
			}else{
				this.shield.display();	
			}
		}

		// make player red for a sort period on tookDmg
		if(this.tookDmg){
			this.tookDmgTimer++;
			//this.tookDmgOnce = false;
		}

		if(this.tookDmgTimer == 4){
			this.tookDmg = false;
			this.tookDmgTimer = 0;
			this.tookDmgOnce = false;
		}

		// apply stats limits if needed
		if(this.stats.maxHealth < statsLimis[0][0]){
			this.stats.maxHealth = statsLimis[0][0];
		}else if(this.stats.maxHealth > statsLimis[0][1]){
			this.stats.maxHealth = statsLimis[0][1];
		}
		if(this.stats.maxStamina < statsLimis[1][0]){
			this.stats.maxStamina = statsLimis[1][0];
		}else if(this.stats.maxStamina > statsLimis[1][1]){
			this.stats.maxStamina = statsLimis[1][1];
		}
		if(this.stats.armor < statsLimis[2][0]){
			this.stats.armor = statsLimis[2][0];
		}else if(this.stats.armor > statsLimis[2][1]){
			this.stats.armor = statsLimis[2][1];
		}
		if(this.stats.fireRate > statsLimis[3][0]){
			this.stats.fireRate = statsLimis[3][0];
		}else if(this.stats.fireRate < statsLimis[3][1]){
			this.stats.fireRate = statsLimis[3][1];
		}
		if(this.stats.fireVelocity < statsLimis[4][0]){
			this.stats.fireVelocity = statsLimis[4][0];
		}else if(this.stats.fireVelocity > statsLimis[4][1]){
			this.stats.fireVelocity = statsLimis[4][1];
		}
		if(this.stats.fireDamage < statsLimis[5][0]){
			this.stats.fireDamage = statsLimis[5][0];
		}else if(this.stats.fireDamage > statsLimis[5][1]){
			this.stats.fireDamage = statsLimis[5][1];
		}
	}

	mouseAim() {
		let aimXalt = mouseX - this.x;
		let aimYalt = mouseY - this.y;
		this.aimingVector = createVector(aimXalt, aimYalt);
		this.aimingVector.setMag(this.reticleLength);
		
		let ellipsePos = createVector(this.x, this.y);
		let dirOffset = p5.Vector.add(ellipsePos, this.aimingVector);
		this.aimingVector.normalize();

		this.originVector = createVector(dirOffset.x, dirOffset.y);

		strokeWeight(2);
		stroke(255, 255, 255, 125);
		//line(this.x, this.y, dirOffset.x, dirOffset.y);
	}

	keyOrMobileAim() {
		this.originVector = p5.Vector.fromAngle(this.aimingAngle);
		let ellipsePos = createVector(this.x, this.y);

		this.originVector.setMag(this.reticleLength);
		this.originVector.add(ellipsePos);

		let aimXalt = this.originVector.x - this.x;
		let aimYalt = this.originVector.y - this.y;
		this.aimingVector = createVector(aimXalt, aimYalt);
		this.aimingVector.normalize();

		push();
			strokeWeight(2);
			stroke(255, 255, 255, 125);
			stroke(this.col);
			//line(this.x, this.y, this.originVector.x, this.originVector.y);
		pop();
	}

	rotateRaticle(angle) {
		this.aimingAngle += angle;

		if(this.slot == "left"){
			if(this.aimingAngle < -1.9){
				this.aimingAngle = -1.9;
			}else if(this.aimingAngle > 1.9){
				this.aimingAngle = 1.9;
			}
		}else if(this.slot == "right"){
			if(this.aimingAngle > -1.25){
				this.aimingAngle = -1.25;
			}else if(this.aimingAngle < -5.04){
				this.aimingAngle = -5.04;
		    }
		}
	}

	setReticleAngle(angle) {
		this.aimingAngle = angle;
	}

	takeDamage(damage){
		//if(!this.blockEnable){
			this.health -= damage - this.stats.armor;
			this.tookDmgOnce = true;
			this.tookDmg = true;
			this.afterGameStats.damageReceived += damage;
			//this.shield.canRegenStamina = false;
		//}
		//console.log("player " + this.playerId + " remaining HP = " + this.health);
	}

	blockSwitch(){
		if(this.blockEnable == false){
			this.blockEnable = true;
			//console.log(this.playerId + " is blocking");
		}else{
			this.blockEnable = false;
			this.shield.blockAniCount = 29;
			this.shield.index = 0;
			//console.log(this.playerId + " is not blocking");
		}
	}

	subtractEquipmentBaseStats(equipment){
		if(equipment == "weapon"){
			this.stats.fireDamage = this.stats.fireDamage - this.weapon.baseDamage;
			this.stats.fireVelocity = this.stats.fireVelocity - this.weapon.baseFireVelocity;
			this.stats.fireRate = this.stats.fireRate - this.weapon.baseFireRate;
		}else if(equipment == "shield"){
			this.stats.maxStamina = this.stats.maxStamina - this.shield.baseStamina;
		}
	}

	addEquipmentBaseStats(equipment){
		if(equipment == "weapon"){
			this.stats.fireDamage = this.stats.fireDamage + this.weapon.baseDamage;
			this.stats.fireVelocity = this.stats.fireVelocity + this.weapon.baseFireVelocity;
			this.stats.fireRate = this.stats.fireRate + this.weapon.baseFireRate;
		}else if(equipment == "shield"){
			this.stats.maxStamina = this.stats.maxStamina + this.shield.baseStamina;
		}
	}
}
class bullet {
	constructor(playerId, origin, direction, dmg, velocity, hitbox, col, bulletAni, angle){
		this.playerId = playerId;
		this.x = origin.x;
		this.y = origin.y;
		this.col = col;

		// bullet animation
		this.angle = angle;
		this.animation = bulletAni;
		this.index = 0; // index of frames in bullet animation
		this.indexTemp = 0;

		this.dmg = dmg;
		this.xSpd = velocity * direction.x; // x velocity
		this.ySpd = velocity * direction.y; // y velocity
		this.radius = hitbox; // hitbox
		this.bombType = null;

		if(this.dmg == bombStats[0][3]){
			this.bombType = 0; // curse bomb
		}else if(this.dmg == bombStats[1][3]){
			this.bombType = 1; // charm bomb
		}else if(this.dmg == bombStats[2][3]){
			this.bombType = 2; // red bomb
		}else{
			this.bombType = null;
		}
	}
	
	display() {
		this.index += 0.2;
		this.indexTemp = floor((this.index)) % this.animation.length;
		push();

			if(players[this.playerId].slot == "left"){
				//translate(players[this.playerId].x + 5, players[this.playerId].y);
				//rotate(players[this.playerId].aimingAngle);				
				translate(this.x, this.y);
				rotate(this.angle);
			}else if(players[this.playerId].slot == "right"){			
				//translate(-players[this.playerId].x + 5, players[this.playerId].y);
				//rotate(-players[this.playerId].aimingAngle);
				translate(this.x, this.y);
				rotate(this.angle);
				scale(1, -1);
			}


			//translate(this.x, this.y);
			//rotate(this.angle);

			imageMode(CENTER);

			tint(this.col);
			image(this.animation[this.indexTemp], 0, 0);		
		pop();

		//this.displayHitBox();
	}

	displayHitBox(){
		push()
			stroke(0);
			noFill(this.col);
			ellipse(this.x, this.y, this.radius);
		pop();
	}
	
	update() {
		this.x += this.xSpd;
		this.y += this.ySpd;
		this.xSpd *= 0.996;
		this.ySpd *= 0.996;
	}
	
	outOfBounds() {
		return(this.x > width + this.radius || this.x < -this.radius || this.y > height + this.radius || this.y < -this.radius);
	}

	hitScan(){
		let collideWithBird = false;
		let collideWithPlayer = false;
		let collideWithShield = false;

		// ------------------------------------check collision with birds------------------------------------
		for (let i = 0; i < birds.length; i++){			
			collideWithBird = collideRectCircle(birds[i].hitbox[0], birds[i].hitbox[1], birds[i].hitbox[2], birds[i].hitbox[3], this.x, this.y, this.radius);		
			if (collideWithBird && !birds[i].gotHit){		

				//--------------------------------------------------- buffs and debuff effects ---------------------------------------------------------
				let playerMessage;
				if(birds[i].dropTrue == true){
					let statsBuffMessageArray = ["Health Up", "Stamina Up", "Armor Up", "Firerate Up", "Velocity Up", "Damage Up"];
					let weaponMessageArray = ["Scroll", "Brush", "Guitar", "Keyboard"];
					let shieldMessageArray = ["A BIG SHIELD", "Golden Shield"];
					let bombsMessageArray = ["Curse Bomb", "Charm Bomb", "Red Bomb"];
					let buffIndex;

					players[this.playerId].afterGameStats.itemsPickedUp++;

					// calculate buff propability set player message
					if(birds[i].buffIndex != null){
						if(birds[i].buffIndex == 0){ // weapon
							buffIndex = random([0, 1, 2, 3]);
							playerMessage = weaponMessageArray[buffIndex];
							players[this.playerId].subtractEquipmentBaseStats("weapon");
							players[this.playerId].weapon = new weapon(this.playerId, weaponAnimations[buffIndex+1], bulletAnimations[buffIndex+1], weaponStats[buffIndex+1][0], weaponStats[buffIndex+1][1], weaponStats[buffIndex+1][2], 10);
							players[this.playerId].addEquipmentBaseStats("weapon");

						}else if(birds[i].buffIndex == 1){ // shield
							buffIndex = random([0, 1]);
							playerMessage = shieldMessageArray[buffIndex];											
							players[this.playerId].subtractEquipmentBaseStats("shield");
							players[this.playerId].shield = new shield(this.playerId, shieldAnimations[buffIndex+1], shieldStats[buffIndex+1][0], shieldStats[buffIndex+1][1]);
							players[this.playerId].addEquipmentBaseStats("shield");

						}else if(birds[i].buffIndex == 2){ // stats
							let buffPropabilityArray = [0.17, 0.17, 0.17, 0.17, 0.16, 0.16];
							let totalBuffPropability =buffPropabilityArray.reduce((a,b) => a + b);
							let randomBuff = random(totalBuffPropability);
							buffIndex = calculatePropability(buffPropabilityArray, randomBuff);
							playerMessage = statsBuffMessageArray[buffIndex];
							let keys = Object.keys(players[this.playerId].stats);
							let value = players[this.playerId].stats[keys[buffIndex]];

							if(!players[this.playerId].cursed){
								if(buffIndex != 3){
									players[this.playerId].stats[keys[buffIndex]] = value + ((value / 100) * 15);
								}else{
									players[this.playerId].stats[keys[buffIndex]] = value - ((value / 100) * 15);
								}
							}else{
								if(buffIndex != 3){
									players[this.playerId].stats[keys[buffIndex]] = value + ((value / 100) * 7.5);
								}else{
									players[this.playerId].stats[keys[buffIndex]] = value - ((value / 100) * 7.5);
								}
							}

						}else if(birds[i].buffIndex == 3){ // bomb
							buffIndex = random([0, 1, 2]);										
							players[this.playerId].bombType = buffIndex;
							playerMessage = bombsMessageArray[buffIndex];

						}else if(birds[i].buffIndex == 4){ // mystery
							buffIndex = random([0, 0, 1, 1, 2]);
							if(buffIndex == 0){
								buffIndex = random([0, 1, 2, 3]);
								playerMessage = weaponMessageArray[buffIndex];	
								players[this.playerId].subtractEquipmentBaseStats("weapon");
								players[this.playerId].weapon = new weapon(this.playerId, weaponAnimations[buffIndex+1], bulletAnimations[buffIndex+1], weaponStats[buffIndex+1][0], weaponStats[buffIndex+1][1], weaponStats[buffIndex+1][2], 10);
								players[this.playerId].addEquipmentBaseStats("weapon");
							}else if(buffIndex == 1){
								playerMessage = "Cursed";
								birds[i].tintColor = [0, 0, 0];
								if(!players[this.playerId].cursed){
									players[this.playerId].cursed = true;
									players[this.playerId].stats.maxHealth = players[this.playerId].stats.maxHealth / 2;
								}
							}else if(buffIndex == 2){
								playerMessage = "Cured";
								birds[i].tintColor = [255, 223, 0];
								if(players[this.playerId].cursed){
									players[this.playerId].cursed = false;
									players[this.playerId].stats.maxHealth *= 1.5;
									players[this.playerId].health += (players[this.playerId].stats.maxHealth / 100) * 20;
								}else{
									players[this.playerId].health += (players[this.playerId].stats.maxHealth / 100) * 20;
								}
							}
						}
					}

				}else if(birds[i].dropTrue == false){
					// set player message
					let redDebuffMessageArray = ["Health Down", "Stamina Down", "Armor Down", "Firerate Down", "Velocity Down", "Damage Down"];
					let redDebuffIndex;
					if(birds[i].debuffIndex != null){
						// red bird debuff propability
						if(birds[i].debuffIndex == 3){
							let debuffPropabilityArray = [0.17, 0.17, 0.17, 0.17, 0.16, 0.16];
							let totalDebuffPropability = debuffPropabilityArray.reduce((a,b) => a + b);
							let randomDebuff = random(totalDebuffPropability);

							redDebuffIndex = calculatePropability(debuffPropabilityArray, randomDebuff);
							playerMessage = redDebuffMessageArray[redDebuffIndex];
						}else{
							playerMessage = birds[i].debuffMessageArray[birds[i].debuffIndex];
						}
					}

					// apply debuff
					if(birds[i].debuffIndex != null){
						if(birds[i].debuffIndex == 3){ // red bird - stats debuff
							let keys = Object.keys(players[this.playerId].stats);
							let value = players[this.playerId].stats[keys[redDebuffIndex]];
							if(redDebuffIndex != 3){
								players[this.playerId].stats[keys[redDebuffIndex]] = value - ((value / 100) * 15);
							}else{
								players[this.playerId].stats[keys[redDebuffIndex]] = value + ((value / 100) * 15);
							}
						}else if(birds[i].debuffIndex != null){
							if(birds[i].debuffIndex == 0){ // black bird - cursed - depleted buffs & halves hp
								if(!players[this.playerId].cursed){
									players[this.playerId].cursed = true;
									players[this.playerId].stats.maxHealth = players[this.playerId].stats.maxHealth / 2;
								}
							}else if(birds[i].debuffIndex == 1){ // golden bird - curse cured - removes curse 
								if(players[this.playerId].cursed){
									players[this.playerId].cursed = false;
									players[this.playerId].stats.maxHealth *= 1.5;
									players[this.playerId].health += (players[this.playerId].stats.maxHealth / 100) * 20;
								}else{
									players[this.playerId].health += (players[this.playerId].stats.maxHealth / 100) * 20;
								}
							}else if(birds[i].debuffIndex == 2){ // pink bird - charmed - equipment removed
								if(players[this.playerId].weapon.baseDamage > weaponStats[0][0]){
									players[this.playerId].subtractEquipmentBaseStats("weapon");
									players[this.playerId].weapon = new weapon(this.playerId, weaponAnimations[0], bulletAnimations[0], weaponStats[0][0], weaponStats[0][1], weaponStats[0][2], 10);
									players[this.playerId].addEquipmentBaseStats("weapon");
								}else if(players[this.playerId].shield.baseStamina > shieldStats[0][0]){
									players[this.playerId].subtractEquipmentBaseStats("shield");
									players[this.playerId].shield = new shield(this.playerId, shieldAnimations[0], shieldStats[0][0], shieldStats[0][1]);
									players[this.playerId].addEquipmentBaseStats("shield");
								}
							}
						}
					}
				}

				// display bird message ontop of the player	
				if(birds[i].debuffIndex != 4){
					players[this.playerId].resetMessageSettings();			
					players[this.playerId].message = playerMessage;
					players[this.playerId].messageColor = birds[i].tintColor;
					players[this.playerId].messageActive = true;
				}

				birds[i].drop();
				players[this.playerId].afterGameStats.accurateBullets++;
				return true;				
			}

		}

		for (let i = 0; i < players.length; i++){	
			if (i != this.playerId && players[i].hitbox != null && players[i] != null){
				// ------------------------------------check collision with players------------------------------------
				//collideWithPlayer = collideRectCircle(players[i].hitbox[0], players[i].hitbox[1], players[i].hitbox[2], players[i].hitbox[3], this.x, this.y, this.radius);
				collideWithPlayer = collideCircleCircle(players[i].hitbox[0], players[i].hitbox[1], players[i].hitbox[2], this.x, this.y, this.radius);


				// -------------------------------------check collision with shields-----------------------------------------------------------------------------
				if(i != this.playerId){
					push();
						//console.log(players[i].shield.hitbox);
						collideWithShield = collideCircleCircle(players[i].shield.hitbox[0], players[i].shield.hitbox[1], players[i].shield.hitbox[2], this.x, this.y, this.radius);
					
						// shield hit box
						stroke(255);
						noFill();
						//ellipse(players[i].shield.hitbox[0], players[i].shield.hitbox[1], players[i].shield.hitbox[2]);
					pop();
				}
			
				// -------------------------------- apply effect --------------------------------------
				if (collideWithPlayer){	
					if(players[i].health > 0){
						//console.log("player " +  this.playerId + " hit player " + i);
						if(this.bombType != null){
							if(this.bombType == 0){ // curse bomb
								if(!players[i].cursed){
									players[i].cursed = true;
									players[i].stats.maxHealth = players[this.playerId].stats.maxHealth / 2;
								}
							}else if(this.bombType == 1){ // charm bomb
								if(players[i].weapon.baseDamage > weaponStats[0][0]){
									players[i].subtractEquipmentBaseStats("weapon");
									players[i].weapon = new weapon(i, weaponAnimations[0], bulletAnimations[0], weaponStats[0][0], weaponStats[0][1], weaponStats[0][2], 10);
									players[i].addEquipmentBaseStats("weapon");
								}else if(players[i].shield.baseStamina > shieldStats[0][0]){
									players[i].subtractEquipmentBaseStats("shield");
									players[i].shield = new shield(i, shieldAnimations[0], shieldStats[0][0], shieldStats[0][1]);
									players[i].addEquipmentBaseStats("shield");
								}
								players[this.playerId].afterGameStats.damageDealt += this.dmg;
								players[i].takeDamage(this.dmg);
							} else if (this.bombType == 2) { // damage bomb
								players[this.playerId].afterGameStats.damageDealt += this.dmg;
								players[i].takeDamage(this.dmg);
							}

							// display bomb message ontop of the player			
							players[i].resetMessageSettings();			
							players[i].message = bombStats[this.bombType][4];
							players[i].messageColor = [bombStats[this.bombType][0], bombStats[this.bombType][1], bombStats[this.bombType][2]];
							players[i].messageActive = true;
				

						} else {
							players[this.playerId].afterGameStats.damageDealt += this.dmg;
							players[i].takeDamage(this.dmg);
						}	
						players[this.playerId].afterGameStats.accurateBullets++;
						return true;	
					}else{
						return false;
					}
				}else if(collideWithShield && players[i].blockEnable){
					//console.log("player " +  this.playerId + " player's' " + i + " shield");
					players[i].afterGameStats.damageBlocked += this.dmg;
					players[i].shield.shieldStamina -= this.dmg;
					players[i].shield.blockBullet = true;
					players[i].shield.blocksCounter++;
					players[i].shield.blockAniCount = 0;
					players[this.playerId].afterGameStats.accurateBullets++;
					return true;
				}
			}
		}

		return false;
	}

}
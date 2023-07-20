class weapon {
	constructor(playerId, weaponAni, bulletAni, damage, fireRate, velocity, bulletHitBox) {
		this.playerId = playerId;
		this.x = players[this.playerId].x;
		this.y = players[this.playerId].y;

		// animation
		//this.bulletImg = bulletImg;
		this.animation = weaponAni;
		this.tempAnimation = this.animation;
		this.animationBullet = bulletAni;
		this.tempAnimationBullet = this.animationBullet;
		this.index = 0; // index of frames in fire animation
		this.indexTemp;
		
		// stats 
		this.baseFireRate = fireRate;
		this.baseFireVelocity = velocity;
		this.baseDamage = damage;
		/*this.fireRate = this.baseFireRate + players[this.playerId].stats.fireRate;
		this.velocity = this.baseFireVelocity + players[this.playerId].stats.fireVelocity;
		this.dmg =  this.baseDamage + players[this.playerId].stats.fireDamage;*/

		// bullet hit box
		this.bulletHitBox = bulletHitBox;
		//this.bulletHitBox = bulletImg.width * bulletImg.height;

		// weapon events
		this.limTemp = this,fireRate - 5; // limit for fire event and fire animation
		this.fireTimer = 0;
		this.firing = false;
		this.nextShotIn = 0;
		this.fireAniCount = 0; // how many frames the fire animation will last

		// bullets array
		this.bulletsFired = [];
	}

	display(){
		// change to rocket when bomb is available
		if(players[this.playerId].bombType != null){
			this.animation = weaponAnimations[5];
			this.animationBullet = bulletAnimations[5];
		}else{
			this.animation = this.tempAnimation;
			this.animationBullet = this.tempAnimationBullet;
		}

		if(this.firing){
			this.index += 0.2;
			this.indexTemp = floor((this.index)) % this.animation.length;
		}

		if(this.firing){
			this.fireAniCount++;
			this.fireTimer++;
			/*this.limTemp = this.fireRate - 5;
			if(this.limTemp <= 5){
				this.limTemp = 10;
			}else if(this.limTemp > 25){
				this.limTemp = 25;
			}*/
			if(this.fireAniCount > this.fireRate || this.fireTimer > 22){
				this.fireTimer = 0;
				this.firing = false;
				this.fireAniCount = 0;
				this.index = 0;
			}
		}

		push();
			imageMode(CENTER);
			if(players[this.playerId].slot == "left"){
				translate(players[this.playerId].x + 5, players[this.playerId].y);
				rotate(players[this.playerId].aimingAngle);
			}else if(players[this.playerId].slot == "right"){
				scale(-1, 1);
				translate(-players[this.playerId].x + 5, players[this.playerId].y);
				rotate(-players[this.playerId].aimingAngle);
				scale(-1, -1);
			}
			
			if(players[this.playerId].tookDmg){
				tint(255, 0, 0, 255);
			}

			if(!this.firing){
				image(this.animation[0], 0, -10);

				// display bomb is is available
				if(players[this.playerId].bombType != null){
					push();
						tint(bombStats[players[this.playerId].bombType][0], bombStats[players[this.playerId].bombType][1], bombStats[players[this.playerId].bombType][2], 255);
						if(players[this.playerId].bombType != null){		
							image(bulletAnimations[5][0], 83, 2);
						}
					pop();
				}
			}else{
				image(this.animation[this.indexTemp], 0, -10);
			}
		pop();
	}

	update(){
		// update stats
		this.fireRate = players[this.playerId].stats.fireRate;
		this.velocity = players[this.playerId].stats.fireVelocity;
		this.dmg = players[this.playerId].stats.fireDamage;

		// prepare firerate
		if(this.nextShotIn > 0){
			this.nextShotIn -= 1;
		}else if(this.nextShotIn < 0){
			this.nextShotIn = 0;
		}

		// update bullets
		for (let j = 0; j < this.bulletsFired.length; j++){
			//this.bulletsFired[j].display();
			//this.bulletsFired[j].update();
			let tempHit = this.bulletsFired[j].hitScan();
			if (this.bulletsFired[j].outOfBounds() || tempHit) {
				this.bulletsFired.splice(j, 1);
			} else {
				this.bulletsFired[j].display();
				this.bulletsFired[j].update();
			}
		}
	}

	fireBullet(){
		if(!players[this.playerId].blockEnable){
			// absorb stamina
			players[this.playerId].shield.shieldStamina -= players[this.playerId].stats.fireDamage * 1.5;
			//players[this.playerId].shield.canRegenStamina = false;

			for(let i = 0; i < weaponAnimations.length; i++){
				if(this.animation == weaponAnimations[i]){
					players[this.playerId].tempBulletSoundIndex = i;
				}
			}

			let bulletColor = color(255);
			let damage = this.dmg;
			let hitbox = this.bulletHitBox;

			if(this.animation == weaponAnimations[2]){
				bulletColor = color(random(0,255), random(0,255), random(0,255));
			}

			if(players[this.playerId].bombType != null){
				bulletColor = color(bombStats[players[this.playerId].bombType][0], bombStats[players[this.playerId].bombType][1], bombStats[players[this.playerId].bombType][2]);
				damage = bombStats[players[this.playerId].bombType][3];
				hitbox = 50;
				players[this.playerId].tempBulletSoundIndex = 5;
				players[this.playerId].bombType = null;
			}

			let oneBullet = new bullet(this.playerId, players[this.playerId].originVector, players[this.playerId].aimingVector, damage, this.velocity, hitbox, bulletColor, this.animationBullet, players[this.playerId].aimingAngle);
			this.bulletsFired.push(oneBullet);
			this.firing = true;
			players[this.playerId].firedOnce = true;

			// store the number of bullets fired 
			players[this.playerId].afterGameStats.bulletsFired++;

			//players[this.playerId].setReticleAngle(players[this.playerId].aimingVector + 20);
		}
		//console.log("bullet created: " + bulletsFired[bulletsFired.length-1].x + " " + bulletsFired[bulletsFired.length-1].y + ", bulletsFired: " + bulletsFired.length);
	}

}
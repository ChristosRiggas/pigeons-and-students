class shield {
	constructor(playerId, shieldAni, shieldStamina, hitbox) {
		this.playerId = playerId;
		this.x = players[this.playerId].x;
		this.y = players[this.playerId].y;

		this.animation = shieldAni; // block bullet animation
		this.w = hitbox; // ellipse radius;
		this.h = hitbox; 
		this.index = 0; // index of frames in block animation
		this.indexTemp;
		this.hitbox = [players[this.playerId].x + this.w / 5, players[this.playerId].y - this.h / 3, this.w / 3, this.h / 2.5];

		this.baseStamina = shieldStamina;
		this.maxShieldStamina = this.baseStamina;
		this.shieldStamina = this.maxShieldStamina;
		this.blockBullet = false;
		this.blocksCounter = 0;
		this.blockAniCount = 0; // how many frames the blockBullet animation will last

		// calculate stamina regen after 1 sec of action (took damage or fired)
		this.canRegenStamina = true;
		this.regenStaminaTimer = 40;
	}

	display(){
		// ------------------------block animation------------------------------------------------
		if(this.blockBullet){
			this.index += 0.2;
			this.indexTemp = floor((this.index)) % this.animation.length;
			this.blockAniCount++;

			// if shield blocks bullet for second time while on animation, then start the animation again from the beginning
			if(this.blockAniCount < 30 && this.blockAniCount > 0 && this.blocksCounter == 2){ 
				this.blocksCounter--;
				this.blockAniCount = 0;
				this.index = 0;
			}
		}

		if(this.blockAniCount == 30){
			this.blockBullet = false;
			this.blockBulletSecondTime = false;
			this.blockAniCount = 0;
			this.index = 0;
		}

		// translate rotate shield and display 
		push();
			imageMode(CENTER);
			if(players[this.playerId].slot == "left"){
				translate(players[this.playerId].x, players[this.playerId].y);
				rotate(players[this.playerId].aimingAngle);
				this.hitbox = [this.w / 1.8, this.h / 8, this.w / 2, this.h]; // update hitbox
			}else if(players[this.playerId].slot == "right"){
				scale(-1, 1);
				translate(-players[this.playerId].x, players[this.playerId].y);
				rotate(-players[this.playerId].aimingAngle);
				scale(-1, -1);
				this.hitbox = [this.w / 1.8, -this.h / 8, this.w / 2, this.h]; // update hitbox
			}

			/*if(players[this.playerId].blockEnable){
				tint(0, 255, 0, 128);
			}*/
			
			if(players[this.playerId].tookDmg){
				tint(255, 0, 0, 255);
			}

			push();
				resetMatrix();

				let rextAbsoluteX = players[this.playerId].x + this.hitbox[0]*cos(players[this.playerId].aimingAngle) - this.hitbox[1]*sin(players[this.playerId].aimingAngle); 
				let rextAbsoluteY = players[this.playerId].y + this.hitbox[0]*sin(players[this.playerId].aimingAngle) + this.hitbox[1]*cos(players[this.playerId].aimingAngle);
				this.hitbox = [rextAbsoluteX, rextAbsoluteY, this.w / 1, 70];
				//console.log("absolute: " + this.hitbox);
			pop();

			if(!this.blockBullet){
				image(this.animation[0], 0, -20);
			}else{
				image(this.animation[this.indexTemp], 0, -20);
			}
		pop();
	}

	update(){
		// update max stamina
		this.maxShieldStamina = players[this.playerId].stats.maxStamina;
		if(players[this.playerId].weapon.firing == true){
			this.regenStaminaTimer = 40;
			players[this.playerId].shield.canRegenStamina = false;
		}

		if(players[this.playerId].weapon.firing == false){			
			this.regenStaminaTimer--;	
			if(this.regenStaminaTimer <= 0){
				this.canRegenStamina = true;
				this.regenStaminaTimer = 40;
			}

			if(players[this.playerId].weapon.firing == true){
				this.regenStaminaTimer = 40;
			}
		}

		// update block stamina
		if(players[this.playerId].blockEnable){
			this.shieldStamina -= 1;
			if(this.shieldStamina <= 0){
				this.blockBullet = false;
				this.shieldStamina = 0;
				players[this.playerId].blockEnable = false;
			}
		}else{
			// regen stamina if possible
			if(this.canRegenStamina){
				this.shieldStamina += 3;							
				if(this.shieldStamina >= this.maxShieldStamina){
					this.shieldStamina = this.maxShieldStamina;
				}
			}
		}

	}


}
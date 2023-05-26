class bird {
	constructor(animations, x, y, speed) {
		this.x = x;
		this.y = y;

		this.flyingAnimation = animations[0];
		this.DropAnimation = animations[1];
		this.w = this.flyingAnimation[0].width;
		this.h = this.flyingAnimation[0].height;
		this.len = this.flyingAnimation.length - 4;
		this.lenDrop = this.DropAnimation.length / 2;
		this.speed = speed;
		this.index = 0;	// index of bird animation
		this.index2 = 0; // index of smoke animation
		this.direction = 'left'; // direction of spawn side
		this.hitbox = [this.x + 40, this.y + 60, this.w / 1.2, this.h / 3];
		this.directionYtimer = 0;
		this.directionY = 1;

		this.gotHit = false;
		this.tempDropXY = 0;
		this.stopDropCount = 0;
		this.smokeAniFinishedOnce = false; // tests wether the smoke animation has finished playing once

		// drop propability
		this.dropPropabilityArray = [0.35, 0.65]; // [true, false]
		this.totalDropPropability = this.dropPropabilityArray.reduce((a,b) => a + b);
		this.randomDropTrue = random(this.totalDropPropability);

		if(this.randomDropTrue < this.dropPropabilityArray[0]){
			this.dropTrue = true;
		}else{
			this.dropTrue = false;
		}

		// buffs and debuff
		this.dropCategoryArray = ["weapons", "shields", "Stats", "Bombs", "Mystery"];
		this.dropCategory;

		this.debuffMessageArray = ["Cursed", "Cured", "Charmed", "", ""];
		this.tintColor = [255, 255, 255]; // default tint
		this.greenColor = [90, 255, 90];
		this.colorArray = [[0, 0, 0], [255, 223, 0], [255,105,180], [255, 90, 90], [255, 255, 255]];

		// buff propability
		this.buffIndex = null;
		if(this.dropTrue){
			this.buffPropabilityArray = [0.2, 0.1, 0.45, 0.2, 0.05]; // [weapons, shields, Stats, Bombs, Mystery]
			this.totalBuffPropability = this.buffPropabilityArray.reduce((a,b) => a + b);
			this.randomBuff = random(this.totalBuffPropability);

			this.buffIndex = calculatePropability(this.buffPropabilityArray, this.randomBuff);
			this.dropCategory = this.dropCategoryArray[this.buffIndex];
			this.tintColor = this.greenColor;
		}

		// debuff propability
		this.debuffIndex = null;
		if(!this.dropTrue){
			this.debuffPropabilityArray = [0.10, 0.05, 0.10, 0.50, 0.25]; // [black, gold, pink, red, white]
			this.totalDebuffPropability = this.debuffPropabilityArray.reduce((a,b) => a + b);
			this.randomDebuff = random(this.totalDebuffPropability);

			this.debuffIndex = calculatePropability(this.debuffPropabilityArray, this.randomDebuff);
			this.tintColor = this.colorArray[this.debuffIndex];
		}

	}

	display() {
		// set index of frames to play for each animation part
		let index = floor((this.index)) % this.len;
		let indexDrop = floor((this.index2)) % this.DropAnimation.length;

		// change part of the animations when bird gets hit
		if(this.gotHit){
			index = map(index, 0, 9, 5, 9);
			index = floor(index);

			indexDrop = map(indexDrop, 0, 11, 6, 11);
			indexDrop = floor(indexDrop);
			this.stopDropCount++;
			if(this.stopDropCount == 45){
				this.smokeAniFinishedOnce = true;
			}
		}

		// display the current frame of ecah animation in the correct direction ------------------------------------------------------------
		push();
			if(this.direction == 'left'){		
				if(!this.dropTrue){
					tint(this.tintColor[0], this.tintColor[1], this.tintColor[2]);
				}else if(this.dropTrue){
					if(!this.gotHit){
						image(this.DropAnimation[index], this.x - 10, this.y - 1);
						//image(birdIconSprites[this.buffIndex], this.x + 22, this.y + 100);
					}else{
						if(!this.smokeAniFinishedOnce){
							image(this.DropAnimation[indexDrop], this.tempDropXY.x, this.tempDropXY.y);
						}
					}
				}
				image(this.flyingAnimation[index], this.x, this.y);
			}else if(this.direction == 'right'){
				scale(-1, 1);
				if(!this.dropTrue){
					tint(this.tintColor[0], this.tintColor[1], this.tintColor[2]);

				}if(this.dropTrue){
					if(!this.gotHit){
						image(this.DropAnimation[index], -this.x - this.w - 10, this.y - 1);
						//image(birdIconSprites[this.buffIndex], -this.x - 85, this.y + 100);
					}else{
						if(!this.smokeAniFinishedOnce){
							image(this.DropAnimation[indexDrop], -this.tempDropXY.x - this.w, this.tempDropXY.y);
						}
					}
				}
				image(this.flyingAnimation[index], -this.x - this.w, this.y);
			}
		pop();

		if(this.dropTrue && !this.gotHit){
			if(this.direction == 'left'){
				image(birdIconSprites[this.buffIndex], this.x + 22, this.y + 100);
			}else{
				image(birdIconSprites[this.buffIndex], this.x + 62, this.y + 100);
			}
		}

	}

	update() {
		// animate the speed of bird and smoke
		this.index += abs(this.speed);
		this.index2 +=  0.2;
		// move the bird
		this.x += this.speed * 15;
		if(this.gotHit){
			this.y -= abs(this.speed * 15);	
		}else{
			this.directionYtimer++;
			if(this.directionYtimer > 30){
				this.directionY = random(-1 , 1);
				this.directionYtimer = 0;
			}
			this.y += (this.speed - abs(this.speed)) + 1 * this.directionY;
		}
		// reset when out of bounds
		if (this.x > width + 500 || this.x < -500) {
			this.reset();
		}
		// update hitbox
		this.hitbox = [this.x + 5, this.y +50, this.w / 1.2, this.h / 3];
	}

	displayHitBox() {
		push();
			stroke(255);
			noFill();
			rect(this.hitbox[0], this.hitbox[1], this.hitbox[2], this.hitbox[3]); // test hitbox
		pop();
	}

	reset() {	
		// reset random spawn side and speed direction
		let side = random(['left', 'right']);
		this.direction = side;
		if(side == 'left'){
			this.speed = random(0.15, 0.4);
			this.x = random(-this.w, -500);
		}else if(side == 'right'){
			this.speed = random(-0.15, -0.4);
			this.x = random(width + this.w, width + 500);
		}
		// bird reset
		this.y = random(-20, height -100);
		this.gotHit = false;
		this.len = this.flyingAnimation.length - 4;
		this.index = 0;
		this.directionYtimer = random(0, 30);
		// drop animation reset
		this.lenDrop = this.DropAnimation.length / 2;
		this.index2 = 0;
		this.tempDropXY = 0;
		this.smokeAniFinishedOnce = false;
		this.stopDropCount = 0;

		// drop propability reset
		this.randomDropTrue = random(this.totalDropPropability);

		if(this.randomDropTrue < this.dropPropabilityArray[0]){
			this.dropTrue = true;
		}else{
			this.dropTrue = false;
		}

		// buff propability reset
		if(this.dropTrue){
			this.debuffIndex = null;
			//let buffPropabilityArray = [0.6, 0.02, 0.5, 0.1, 0.05]; // [weapons, shields, Stats, Bombs, Mystery]
			let buffPropabilityArray = [0.25, 0.1, 0.40, 0.2, 0.05]; // [weapons, shields, Stats, Bombs, Mystery]
			this.randomBuff = random(this.totalBuffPropability);

			this.buffIndex = calculatePropability(buffPropabilityArray, this.randomBuff);
			this.dropCategory = this.dropCategoryArray[this.buffIndex];
			//console.log(this.dropCategory);
			this.tintColor = this.greenColor;
		}

		// debuff propability rest
		if(!this.dropTrue){
			this.buffIndex = null;
			let debuffPropabilityArray = [0.05, 0.05, 0.20, 0.40, 0.30]; // [black, gold, pink, red, white]
			this.randomDebuff = random(this.totalDebuffPropability);

			this.debuffIndex = calculatePropability(debuffPropabilityArray, this.randomDebuff);
			//console.log(this.debuffIndex);
			this.tintColor = this.colorArray[this.debuffIndex];
		}
	}

	drop() {
		//console.log("Bird Got Hit!");
		this.gotHit = true;
		this.len = this.flyingAnimation.length;
		this.lenDrop = this.DropAnimation.length;
		this.tempDropXY = createVector(this.x - 10, this.y - 1);
	}
	
}
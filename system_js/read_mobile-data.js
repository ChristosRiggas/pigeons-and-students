let count2 = 0;

 function readMobile(){
	xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() 
	{
		if (xmlhttp.readyState == XMLHttpRequest.DONE) 
		{ // XMLHttpRequest.DONE == 4
			if (xmlhttp.status == 200) 
			{					
				if(isJsonString(xmlhttp.responseText)){	
						let mobileData = JSON.parse(xmlhttp.responseText);
						//console.log(mobileData);
						//console.log(mobileData[0].roll0);
						//console.log(mobileData[1].roll1);
						
/* 						localStorage.setItem('roll0', mobileData.roll_0);
						localStorage.setItem('fire0', mobileData.fire_0);
						localStorage.setItem('block0', mobileData.block_0);
						localStorage.setItem('roll1', mobileData.roll_1);
						localStorage.setItem('fire1', mobileData.fire_1);
						localStorage.setItem('block1', mobileData.block_1);	 */
						//console.log(mobileData[1]);
						
 						for(let i = 0; i < playersNum; i++){
							if(mobileData[i] != null){
								let keyR = "roll" + i;
								let valueR = mobileData[i][keyR];
								localStorage.setItem(keyR, valueR);
								
								let keyF = "fire" + i;
								let valueF = mobileData[i][keyF];
								localStorage.setItem(keyF, valueF);
								
								let keyB = "block" + i;
								let valueB = mobileData[i][keyB];
								//valueB = valueB.slice(0, -1);
								localStorage.setItem(keyB, valueB);
							}else{
								console.log("player's: " + i + " Data mobile data is empty");
							}
						} 	
						
						
						//document.getElementById('Empty2').innerHTML = xmlhttp.responseText + count2;
				}
				else{
					//count2++;
					//document.getElementById('Empty2').innerHTML = xmlhttp.responseText;
				}
			}
			else if (xmlhttp.status == 400) 
			{
				console.log('There was an error 400');
			}
			else 
			{
				console.log('something else other than 200 was returned');
				resetSlots();
				window.location.reload();
			}
		}
		
	};
		
	xmlhttp.open("GET", "../php/read_mobile-data.php", true);
	xmlhttp.send();
} 


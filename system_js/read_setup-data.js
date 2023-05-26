let count = 0;
let playersNum;
let positionsKeys;

function readPlayersNum(filePath){
	return fetch(filePath)
		.then(response => response.text())
		.catch(error => {
			//console.erro(data);
		});
}

function readPositions(){
	let zero_positionX = 0;
	let zero_positionY = 0;
	let one_positionX = 0;
	let one_positionY = 0;
	let xmlhttp = new XMLHttpRequest();
	
	xmlhttp.onreadystatechange = function() 
	{
		if (xmlhttp.readyState == XMLHttpRequest.DONE) 
		{ // XMLHttpRequest.DONE == 4
			if (xmlhttp.status == 200) 
			{		
				if(isJsonString(xmlhttp.responseText)){	
					let positions = JSON.parse(xmlhttp.responseText);			
					let keys = Object.keys(positions);
					positionsKeys = keys.length;
					playersNum = positionsKeys/2;
					
					for(let i = 0; i < playersNum; i++){
						localStorage.setItem('position-' + i + '-x', positions["position" + i + "x"]);
						localStorage.setItem('position-' + i + '-y', positions["position" + i + "y"]);
					}

				}else{
					//count++;
					//document.getElementById('Empty').innerHTML = xmlhttp.responseText + count;
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
			
	xmlhttp.open("GET", "../php/read_setup-data.php", true);
	xmlhttp.send();
}

function isJsonString(str){
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
}



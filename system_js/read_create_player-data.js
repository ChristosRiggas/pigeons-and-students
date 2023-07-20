let countPlayers = -1;

function checkForNewPlayers(){
	xmlhttpPlayers = new XMLHttpRequest();
	
	xmlhttpPlayers.onreadystatechange = function() 
	{
		if (xmlhttpPlayers.readyState == XMLHttpRequest.DONE) 
		{ // XMLHttpRequest.DONE == 4
			if (xmlhttpPlayers.status == 200) 
			{					
				if(isJsonString(xmlhttpPlayers.responseText))
				{	
					let data = JSON.parse(xmlhttpPlayers.responseText);	
					
					//console.log(parseInt(data.count));
					//console.log(countPlayers);
					
/* 					fetch('../php/data/players_created_counter.data')
					  .then(response => response.text())
					  .then(fileContent => {
						console.log(fileContent);
						countPlayers = fileContent;
					  })
					  .catch(error => {
						console.error('Error:', error);
					  }); */
					
					if(parseInt(data.count) != parseInt(countPlayers) && parseInt(data.count) != -1){	
						//console.log("count != countPlayers");
						//In case the page is reloaded or a new page is opend without the slots rest, the page will not create the players
						if(parseInt(data.count) == parseInt(countPlayers) + 1){ 
							countPlayers = parseInt(data.count);
							//console.log(data);
							createPlayer(data.slot, data.name, data.character, data.count, "human");
							roundStarTimer = 10;
						}
					}
				}
				else{

				}
			}
			else if (xmlhttpPlayers.status == 400) 
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
		
	xmlhttpPlayers.open("GET", "../php/read_create_player-data.php", true);
	xmlhttpPlayers.send();	
}
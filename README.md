# Pigeons-and-Students
Design and Development of a Multiplayer Online Video Game Support System in Cartographic Views.
# What is about
This project is an experimental application with main goal to implement practises fro both the design and development of a 2D multiplayer shooting game using web technologies. The game is planned and executed with a specific intention of being displayed in the public space, on large projection surface with the graphics of the game adapted to the physical characteristics of the surface (projection mapping). In order for the application to be easily accessed, mobile phones are used as input devices. So, a group of user are able to access the game using their mobile devices and visiting the displayed webpage. The application uses on-screen virtual buttons and the gyroscope in order to send orientation data to the game's webpage. That data is used to control the in-game characters while action takes place on the screen surface.
# How to use

## Server
In order for the application to run a server environment needs to be used. The application is already tested using the localhost XAMPP package running the application through Apache server. Also you may need to use a ssl certificate to allow orientation data transfer form the mobiles to the application.

## Installation Setup
Open "installation_form.html". Select the number of players and type the password "1234".

Then you will be transfered to the "setup.php" webpage. Navigate to the bottom of the page and select "Open Game". This will open "game.php" (this is the game page).

One last thing is to deside if you need the background shown at the game page depending your display configurations. keep in mind that if you seek a more imersive experience you can project the game onto a building facade. In that case you can disable the background of the game. Open the inspector at the game page and type "walls = true".

## Slots Configuration
The players interested to join the game they will need to open "mobile.php" webpage to their browser typing the correct path (e.g. "127.0.0.1/pns/mobile.php?slot=0") depending the server configuration.

- (Optional) To make this step easier for the users you can use the QR codes shown in the game page. However, for this to work you need to replace the QR codes with new ones that will transfer the user to the correct url providing the coresponding slot (e.g. "127.0.0.1/pns/mobile.php?slot=0"). The path depends from the server configuration used.
To replace the QR codes images navigate to "pns/style/images/qr" without changing their names. 

Having configured the slots for the players you can go back to "setup.php" webpage where you can use the sliders provided to change the position of the players's slots. This  will change the positions shown at the game page repositioning the QR codes. You can change these position at anytime. 

## Playing the game
The player navigates at the "mobile.php" webpage and he/she needs to fill the character form choosing name and character. Then submits the form, and in the game page the new character is created at the coresponding slot.

Once every player is joined the game begins. The goal of the game is to be the last man standing while shooting the enemy characters, blocking their attacks and collecting power ups by shooting the flying birds. Each bird carries different items that can be usefull or harmfull for the players. But the different effects are for the players to discover.  

Once only one player is still alive, this player is decleard the winner and a new game round is about to begin. Then again, the players must navigate to the players form to join the new game.

## Disclaimer
The game may apper some bugs. Refresh the game page or using the "setup.php" reset buttons will help the application to run properly staring whit a fresh game round. 

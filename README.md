# Pigeons-and-Students
Design and Development of a Multiplayer Online Video Game Support System in Cartographic Views

# What is about
This project is an experimental application with the main goal of implementing practices for both the design and development of a 2D multiplayer shooting game using web technologies. The game is planned and executed with the specific intention of being displayed in public space on a large projection surface, with the graphics of the game adapted to the physical characteristics of the surface (projection mapping). In order for the application to be easily accessed, mobile phones are used as input devices. So, a group of users are able to access the game using their mobile devices. The application uses on-screen virtual buttons and the gyroscope in order to send orientation data to the game's webpage. That data is used to control the in-game characters while action takes place on the screen surface.

# Technologies used
The technologies used in implementing the functionalities of this application include the markup language HTML, the server-side scripting language PHP, the styling language CSS, and the programming language JavaScript along with the P5.js graphics library. Additionally, support for a local server during development was achieved through the XAMPP package. Lastly, the Aseprite software was utilized for generating game graphics.

# Libraries used


# How to use
## Server
In order for the application to run, a server environment needs to be used. The application is already tested using the localhost XAMPP package running the application through the Apache server. Also, you may need to use an SSL certificate to allow orientation data transfer from the mobile to the application.

## Installation setup
Open "installation_form.html". Select the number of players and type the password "1234".

Then you will be transferred to the "setup.php" webpage. Navigate to the bottom of the page and select "Open Game". This will open "game.php" (this is the game page).

One last thing is to decide if you need the background shown on the game page, depending on your display configurations. Keep in mind that if you seek a more immersive experience, you can project the game onto a building facade. In that case, you can disable the background of the game. Open the inspector on the game page and type "walls = true".

## Slots configuration
Players interested in joining the game will need to open the "mobile.php" webpage in their browser, typing the correct path (e.g., "127.0.0.1/pns/mobile.php?slot=0") depending on the server configuration.

- (Optional) To make this step easier for the users, you can use the QR codes shown on the game page. However, for this to work, you need to replace the QR codes with new ones that will transfer the user to the correct url, providing the coresponding slot (e.g., "127.0.0.1/pns/mobile.php?slot=0"). The path depends on the server configuration used.
To replace the QR code images, navigate to "pns/style/images/qr" without changing their names.

Having configured the slots for the players, you can go back to the "setup.php" webpage, where you can use the sliders provided to change the position of the players' slots. This will change the positions shown on the game page by repositioning the QR codes. You can change these positions at any time.

## Playing the game
The player navigates to the "mobile.php" webpage, and he or she needs to fill out the character form, choosing a name and character. Then she submits the form, and on the game page, the new character is created in the appropriate slot.

Each player is able to fire by tapping the red "Fire" button and block by tapping the green "Block" button. Also they are able to rotate their phones in order to aim with their weapon.

Once every player has joined, the game begins. The goal of the game is to be the last man standing while shooting the enemy characters, blocking their attacks, and collecting power-ups by shooting the flying birds. Each bird carries different items that can be useful or harmful for the players. But the different effects are for the players to discover.

Once only one player is still alive, this player is declared the winner, and a new game round is about to begin. Then again, the players must navigate to the player form to join the new game.

## Note
The game may appear some bugs. Refresh the game page or using the "setup.php" reset buttons will help the application to run properly staring whit a fresh game round. 

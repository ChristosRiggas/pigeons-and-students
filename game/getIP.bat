for /f "delims=[] tokens=2" %%a in ('ping -4 -n 1 %ComputerName% ^| findstr [') do set NetworkIP=%%a
echo Network IP: %NetworkIP%

start "" https://%NetworkIP%/projects/theses-project/github/pigeons_and_students/game/game.php
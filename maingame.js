// Initialize the game map
var gameMap = [];

gameMap[0] = "A remote space station located near the Bajor homeworld. This station serves as a checkpoint, guarding the Bajorans from the Cardassian Union.";
gameMap[1] = "The planet of Andor, located in the Andorian sector of the Beta Quadrant. This planet was the homeworld of the Andorians and served as their capital. It is a satellite of a gas giant located nearby and sits at the edge of the Vulcan region.";
gameMap[2] = "Starbase Rama, site of the Council of Planets gathering. The starbase sits at the edge of the Andorian region of the Beta Quadrant and serves as a hub for numerous Federation Starships.";
gameMap[3] = "Entrance to the Bajoran Wormhole and passage to the Gamma Quadrant. Known in Bajor as The 'Celestial Temple'. It is only accessible to ships travelling at impulse velocities.";
gameMap[4] = "Betazed is a remarkably lush, beautiful world, sometimes described as 'the jewel of the outer crown' by traders and other visitors. Its gravity and atmosphere are comparable to Earth, and water covers 78 percent of the planet's surface. Great expanses of natural wilderness cover much of the planet, varying from dense jungles to wide canyons and cliffs.";
gameMap[5] = "A mysterious forcefield appears. Scanners indicate that this forcefield is the creation of the continium known only as 'Q'. Navigation reports that passage starboard of the ship is blocked and impassable.";
gameMap[6] = "This sector is sparsely inhabited and located inside the Nuetral Zone.";
gameMap[7] = "The Betreka Nebula, located between the Klingon Empire and the Cardassian Union. This nebula is the site of the incident between the Cardassians and the Klingons over the planet Raknal V, which began an eighteen year long conflict.<br><br> Long range scanners indicate the presence of crystalline structures.";
gameMap[8] = "And asteroid field. Navigation through the field is limited and not recommended.";

// Set up starting point for player on map
var playerLocation = 4;

// Initialize the set of images corresponding to map
var mapImages = [];

mapImages[0] = "remotestation.jpg";
mapImages[1] = "planet.jpg";
mapImages[2] = "starbase.jpg";
mapImages[3] = "wormhole.jpg";
mapImages[4] = "planet2.png";
mapImages[5] = "forcefield.jpg";
mapImages[6] = "romulan2.png";
mapImages[7] = "nebula.jpg";
mapImages[8] = "asteroid.png";


// Messages for blocked movements
var blockedMovement = [];

blockedMovement[0] = "Engineering states that the ship isn't properly fueled for that course, Captain.";
blockedMovement[1] = "Alternated route suggested, Captain.";
blockedMovement[2] = "Long range scanners detect hostile targets. Navigation in that direction is not advised.";
blockedMovement[3] = "Navigation does not recommend travel in the direction of the Cardassian Union.";
blockedMovement[4] = "";
blockedMovement[5] = "The Q is blocking the passage of the ship. Navigation suggest an alternative direction.";
blockedMovement[6] = "Navigation does not recommend that course, Captain. Seek an alternate route.";
blockedMovement[7] = "Navigation suggests finding an alternative course, Captain.";
blockedMovement[8] = "Navigation using that course not recommended due to the density of the asteroid field. Aternative direction is advised.";

// Create in-game items at beginning of game
var items = ["dignitary", "Romulans"];
var itemLocations = [2, 6];
var itemsToAppear = [];
var itemsToAppearLocations = [8];

// Array to store items collected
var storage = [];

// Initialize player commands
var playersCommand = "";

// Initialize game messaages
var gameMessages = "";
var helpMessages = "";

// Initialize array of commands the game understands and the current command
var knownCommands = ["ahead", "reverse", "port", "starboard", "beam up", "transfer", "use", "fire torpedos"];
var command = "";

// Initialize array of items the game understands and the current item
var knownItems = ["dignitary", "dilithium", "romulans"];
var item = "";

// Element for the viewscreen images
var image = document.getElementById('viewScreen');

// Command and game message fields
var output = document.querySelector("#output");
var input = document.querySelector("#input");
var helpOutput = document.querySelector("#helpOutput");
var passengerOutput = document.querySelector("#passenger");
var crystalOutput = document.querySelector("#dilithium");
var alertOutput = document.querySelector("#alert");

// Engage Button
var engage = document.getElementById('inputButton');
//button.style.cursor = "pointer";
engage.addEventListener("click", enterButton, false);

// Help Button
var help = document.getElementById('helpButton');
help.addEventListener("click", helpButton, false);

// Closing help box
var closeHelp = document.getElementById('closeHelp');
closeHelp.addEventListener("click", closeHelpButton, false);

// Various buttons and sounds
function helpButton()
{
    var el = document.getElementById('helpBox');
    function fadeIn(el) 
    {
        el.style.opacity = 0;
        var tick = function() 
        {
            el.style.opacity = +el.style.opacity + 0.05;
            if (+el.style.opacity < 1) 
                {
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16)
                }
        };
        tick();
    }   
    fadeIn(el); 
    document.getElementById('helpBox').style.display = "block";
    helpOutput.innerHTML = "Available commands: <br>" +
    "<br> Movement: <strong>Ahead / Reverse / Port / Starboard </strong><br>" +
    "<br> Engineering: Beam Up / Transfer / Use <br>" +
    "<br> Weapons: Fire Topedos";
}

function closeHelpButton()
{
    document.getElementById('helpBox').style.display = "none";
}

function enterButton()
{    
    playGame();
}

// Various sound effects
function engageSound()
{
    document.getElementById('embed').innerHTML= "<embed src='sounds/engage.mp3' autostart=true loop=false hidden=true>";
    return true;
}
function errorSound()
{
    document.getElementById('embed').innerHTML= "<embed src='sounds/fail.mp3' autostart=true loop=false hidden=true>";
    return true; 
}
function nocomply()
{
    document.getElementById('embed').innerHTML= "<embed src='sounds/nocomply.mp3' autostart=true loop=false hidden=true>";
    return true;
}
function transporter()
{
    document.getElementById('embed').innerHTML= "<embed src='sounds/transporter.mp3' autostart=true loop=false hidden=true>";
    return true;
}
function warp()
{
    document.getElementById('embed').innerHTML= "<embed src='sounds/warp.mp3' autostart=true loop=false hidden=true>";
    return true;
}
function torpedo()
{
    document.getElementById('embed').innerHTML= "<embed src='sounds/torpedo.mp3' autostart=true loop=false hidden=true>";
    return true;
}
function redAlert()
{
    document.getElementById('embed').innerHTML= "<embed src='sounds/alert.mp3' autostart=true loop=false hidden=true>";
    return true;
}
function explode()
{
    document.getElementById('embed').innerHTML= "<embed src='sounds/explode.mp3' autostart=true loop=false hidden=true>";
    return true;
}

// Displaying the player's location
render();
document.getElementById('input').focus();

// Main game logic
function endGame()
{
    window.location.href = "Endpage.html";
}

function playGame()
{
     // These get reset from previous turn
    gameMessages = "";
    command = "";
    // Get player command and convert it to lowercase
    playersCommand = input.value;
    playersCommand = playersCommand.toLowerCase();
    var step = 60;
    
    // Determine the player's command
    for(i = 0; i < knownCommands.length; i ++)
        {
            if(playersCommand.indexOf(knownCommands[i]) !== -1)
                {
                    command = knownCommands[i];
                    break;
                }
        }
    // Determine the item wanted
    for(i = 0; i < knownItems.length; i ++)
        {
            if(playersCommand.indexOf(knownItems[i]) !== -1)
                {
                    item = knownItems[i];
                }
        }
    // Choose correct command
    switch(command)
        {
            case "ahead":
                if(playerLocation >= 3)
                    {
                        playerLocation -= 3;
                        var x = document.getElementById('crosshair').offsetTop;
                        x = x - step;
                        document.getElementById('crosshair').style.top = x + "px";
                        engageSound();
                    }
                else
                    {
                        gameMessages = "<br><br>" + blockedMovement[playerLocation];
                        errorSound();
                    }
                break;
                
            case "reverse":
                if(playerLocation < 6)
                    {
                        playerLocation += 3;
                        var x = document.getElementById('crosshair').offsetTop;
                        x = x + step;
                        document.getElementById('crosshair').style.top = x + "px";
                        engageSound();
                    }
                else
                    {
                        gameMessages = "<br><br>" + blockedMovement[playerLocation];
                        errorSound();
                    }
                break;
                
            case "starboard":
                if(playerLocation %3 != 2)
                    {
                        playerLocation += 1;
                        var x = document.getElementById('crosshair').offsetLeft;
                        x = x + step;
                        document.getElementById('crosshair').style.left = x + "px";
                        engageSound();
                    }
                else
                    {
                        gameMessages = "<br><br>" + blockedMovement[playerLocation];
                        errorSound();
                    }
                break;
                
            case "port":
                if(playerLocation %3 != 0)
                    {
                        playerLocation -= 1;
                        var x = document.getElementById('crosshair').offsetLeft;
                        x = x - step;
                        document.getElementById('crosshair').style.left = x + "px";
                        engageSound();
                    }
                else
                    {
                        gameMessages = "<br><br>" + blockedMovement[playerLocation];
                        errorSound();
                    }
                break;
                
            case "beam up":
                beamUp()
                break;
                
            case "transfer":
                transfer()
                break;
            
            case "use":
                useItem()
                break;
                
            case "fire torpedos":
                fireWeapon()
                break;
                
            default:
                gameMessages = "<br><br>Invalid command.";
                errorSound();
        }
    // reander the game
    render();
    input.value = "";
    document.getElementById('input').focus();
}

function beamUp()
{
    // First find index of where the item is in the array
    var itemIndex = items.indexOf(item);
    var itemToAppearIndex = itemsToAppear.indexOf(item);
    // Does it exist at this location?
    if(itemIndex !== -1 && itemLocations[itemIndex] === playerLocation)
        {
            gameMessages = "<br><br>You have beamed aboard the " + item + ".";
            transporter();
            
            // Add it to the player's inventory
            storage.push(item);
            
            // Remove it from the game
            items.splice(itemIndex, 1);
            itemLocations.splice(itemIndex, 1);
            
            // Console tests
            console.log("World items: " + items);
            console.log("Storage items: " + storage);
        }
     else if(itemToAppearIndex !== -1 && itemsToAppearLocations[itemToAppearIndex] === playerLocation)
        {
            gameMessages = "<br><br>You have beamed aboard the " + item + ".";
            transporter();
            
            // Add it to the player's inventory
            storage.push(item);
            // Remove it from the game
            itemsToAppear.splice(itemToAppearIndex, 1);
            itemsToAppearLocations.splice(itemToAppearIndex, 1);
        }
    else
        {
            // Error if item isn't at the current location
            errorSound();
            gameMessages = "<br><br>There is either nothing to beam up" +
                "<br>  or you haven't specified target.";
        }
}

function destroyed()
{
    explode();
    alertOutput.innerHTML = "";
    gameMessages = "<br><br>Romulan ship has been destroyed!";
    mapImages.splice(6, 1, "explosion.jpg");
    render();
    mapImages.splice(6, 1, "debris.jpg");
}

function fireWeapon()
{
    // First find index of where the item is in the array
    var itemIndex = items.indexOf(item);
    
    if(playerLocation === 6)
         {
             alertOutput.innerHTML = "ALERT <br>" + "<br>" +
             "<br> Condition" +
             "<br> RED";
             torpedo();
             gameMessages = "<br><br>Photon torpedos fired!";
             setTimeout("destroyed()", 2000);
             items.splice(itemIndex, 1);
        }

    else
        {
            // Error if item isn't at the current location
            errorSound();
            gameMessages = "<br><br>There is nothing to fire weapons at" +
                "<br>  or you haven't specified target.";
        }
}

function transfer()
{
    // First, find out if item is in storage
    var storageIndex = storage.indexOf(item);
    
    // If the index is -1, it isn't in storage
    // Alert player to the fact it isn't in storage
    if(storageIndex === -1)
        {
            gameMessages = "<br><br>That does not exist onboard.";
            errorSound();
        }
    
    // If there isn't anything in storage then tell player
    if(storageIndex === 0)
        {
            gameMessages ="<br><br>Cargo hold is empty.";
            errorSound();
        }
    // If the item is in storage, determine the use
    if(storageIndex !== -1)
        {
            switch(item)
                {
                    case "dignitary":        
                    if(playerLocation === 0)
                    {
                        gameMessages = "<br><br>The Dignitary from Andros III thanks you for safe passage." +
                        "<br><br>Engineering states that the impulse engines need fuel.";
                        storage.splice(storageIndex, 1);
                        passengerOutput.innerHTML = "";
                        itemsToAppear.push("dilithium");
                        transporter();
                    }      
                    else
                    {
                        gameMessages = "<br><br>This isn't a suitable location for transfer." + 
                        "<br><br>The Dignitary from Andros III grows impatient.";
                        errorSound();
                    }
                    break;
                        
                    case "dilithium":
                    gameMessages = "You cannot transfer the dilithium here.";
                    errorSound();
                    break;
                }
        }
}

function useItem()
{
    // First, find out if item is in storage
    var storageIndex = storage.indexOf(item);
    
    // If the index is -1, it isn't in storage
    // Alert player to the fact it isn't in storage
    if(storageIndex === -1)
        {
            gameMessages = "<br><br>That does not exist onboard.";
        }
    
    // If there isn't anything in storage then tell player
    if(storageIndex === 0)
        {
            gameMessages ="<br><br>Cargo hold is empty.";
        }
    // If the item is in storage, determine the use
    if(storageIndex !== -1)
        {   
            switch(item)
                {
                    case "dilithium":
                    if(playerLocation === 3)             
                    {
                        gameMessages = "<br><br>The dilithium has been used to power the impulse engines.";
                        crystalOutput.innerHTML = "";
                        storage.splice(storageIndex, 1);
                        warp();
                        setTimeout(endGame, 5000);
                    }                
                    else
                    {
                        gameMessages = "<br><br>The dilithium isn't reacting.";
                        errorSound();
                    }
                    break;
                        
                    case "dignitary":
                    gameMessages = "<br><br>Invalid command";
                    errorSound();
                    break;
                }

        }
}

function render()
{
    // Render the location
    output.innerHTML = gameMap[playerLocation];
    image.src ="images/" + mapImages[playerLocation];
    alertOutput.innerHTML = "";
    
    // If there is any item in this location, display it
    // Loop through all of the items
    for(var i = 0; i < items.length; i ++)
        {
            // Find if there's an item here
            if(playerLocation === itemLocations[i])
                {
                    // Display the item
                    output.innerHTML += "<br><br>Sensors indicate <em>"
                    + items[i] + "</em> found in this sector.";
                }
            // What if the Romluans are there?
            if(playerLocation === itemLocations[i] && playerLocation === 6)
                {
                    alertOutput.innerHTML = "ALERT <br>" + "<br>" +
                    "<br> Condition" +
                    "<br> RED";
                    redAlert();
                }
        }
    for(var i = 0; i < itemsToAppear.length; i ++)
        {
            if(playerLocation === itemsToAppearLocations[i])
                {
                    // Display the item
                    output.innerHTML += "<br><br>Sensors indicate <em>"
                    + itemsToAppear[i] + "</em> found in this sector.";
                }
        }
    
    // Display the game message and update inventory 
    output.innerHTML += "<br>" + gameMessages;
    passengerOutput.innerHTML += "";
    crystalOutput.innerHTML += "";
    
    // Display storage
    if(storage.length !== 0)
        {
            switch(item)
                {
                    case "dignitary":
                        passengerOutput.innerHTML = "Dignitary onboard";
                        break;
                    case "dilithium":
                        crystalOutput.innerHTML = "Dilithium onboard";
                        break;
                }       
        }
}

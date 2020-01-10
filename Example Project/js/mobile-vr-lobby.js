var scene = document.getElementById("scene");

var lobby = document.getElementById("lobby");
lobby.style.display = 'none';

var isVRMode = false;

//Detect if Enter VR
document.querySelector('a-scene').addEventListener('enter-vr', function () 
{
    isVRMode = true;

    //Open lobby even if the orientation is landscape.
    if (window.orientation == 90 || window.orientation == -90) 
    {
        scene.style.display = 'none';
        lobby.style.display = 'block';
    }
});

//Detch if Exit VR
document.querySelector('a-scene').addEventListener('exit-vr', function () 
{
    isVRMode = false;
});

//Detect device orientation
$(window).on("orientationchange",function()
{
    if (window.orientation == 90 || window.orientation == -90)
    {
        if (isVRMode) 
        {
            scene.style.display = 'none';
            lobby.style.display = 'block';
        }
    } else 
    {
        scene.style.display = 'block';
        lobby.style.display = 'none';
    }
}); 

//Request VR Mode in fullscreen
function fullScreen()
{
    lobby.style.display = 'none';
    scene.style.display = 'block';

    if (scene.requestFullscreen) {
        scene.requestFullscreen();
    } else if (scene.mozRequestFullScreen) { /* Firefox */
        scene.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        scene.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
        scene.msRequestFullscreen();
    }
}
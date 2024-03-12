"use strict";

(function() 
{
   
})();

var isFullScreen = -1;
var textTime = 0;
var imagesMax = 0;
var imagesLoaded = 0;
var currentScene = "";
// var sceneData = {};
var scenes = [];
var sceneIndex = 0;

var lastUpdate = Date.now();
var dt = 0;

document.getElementById("textFrame").style.display = "none";
setInterval(update, 1);
setup();

var sceneStruct = function(_name, _hotspots)
{
    this.name = _name;
    this.hotspots = _hotspots;
};

document.body.oncontextmenu = function()
{
    return false;
};

document.oncontextmenu = function()
{
    return false;
};

function getSceneIndex(_name)
{
    return scenes.findIndex((_s) => _s.name == _name);
}

function createScenes(_settings)
{
    var _g = document.getElementById("game");
    currentScene = _settings["scenes"][0];
    imagesMax = _settings["scenes"].length;

    //do recursive call
    createSingleScene(_settings["scenes"][imagesLoaded], _settings);

    var _imgMap = document.createElement("map");
    _imgMap.name = "imgmap";
    _imgMap.id = "imgmap";
    _g.append(_imgMap);
}

function createSingleScene(_name, _scenesList)
{
    var _g = document.getElementById("game");

    fetch("scenes/" + _name + ".json", { method: 'GET'})
        .then(function(response) 
        {
            return response.json(); 
        })
        .then(function(json)
        {
            var _img = new Image();
            _img.id = _name;
            _img.style.display = "none";
            _img.draggable = false;
            _img.useMap = "#imgmap";
            _img.oncontextmenu = function() { return false; };
            _img.onload = function()
            {
                imagesLoaded++;
                document.getElementById("loadingBar").style.width = ((imagesLoaded/imagesMax) * 100) + "%";

                if (imagesLoaded >= imagesMax)
                    scenesCompleted();
                else
                    createSingleScene(_scenesList["scenes"][imagesLoaded], _scenesList);
            }

            _img.src = json["image"];
            _g.append(_img);

            // sceneData[_name] = {};
            // sceneData[_name]["hotspots"] = json["hotspots"];

            scenes.push(new sceneStruct(_name, json["hotspots"]));
        });
}

function scenesCompleted()
{
    // console.log(sceneData);
    // console.log(scenes);

    document.getElementById("loading").style.display = "none";
    document.getElementById("loadingBar").style.display = "none";
    goToScene();
}

function goToScene()
{
    // console.log(sceneIndex);
    // if (_scene == null)
    // {
    //     _scene = currentScene;
    //     sceneIndex = getSceneIndex(_scene);
    // }

    var _takeScene = scenes[sceneIndex];

    document.getElementById(_takeScene.name).style.display = "block";
    var _hotspots = _takeScene.hotspots; //sceneData[_scene]["hotspots"];
    var _getImgMap = document.getElementsByTagName("map")[0];
    _getImgMap.innerHTML = "";

    for (var i = 0; i < _hotspots.length; i++)
    {
        var _dataSplit = _hotspots[i].split('|');

        var _area = document.createElement("area");
        _area.shape = _dataSplit[0];
        _area.coords = _dataSplit[1];
        setHotspot(_area, _dataSplit[2]);

        _getImgMap.appendChild(_area);
    }
}

function setup()
{
    fetch('settings.json', { method: 'GET'})
    .then(function(response)  { return response.json(); })
    .then(function(json) { createScenes(json); });
}

function setHotspot(_place, _action)
{
    var _actionSplit = _action.split('=');

    _place.onmousedown = function() 
    {
        switch (_actionSplit[0])
        {
            case "go":
            //check name
            switch (_actionSplit[1])
            {
                case "prev":
                    sceneIndex--;
                    _actionSplit[1] = scenes[sceneIndex].name;
                    break;
                case "next":
                    sceneIndex++;
                    _actionSplit[1] = scenes[sceneIndex].name;
                    break;
                default:
                    sceneIndex = getSceneIndex(_actionSplit[1]);
                    //none
                    break;
            }

            hideText();
            var _current = document.getElementById(currentScene);
            currentScene = _actionSplit[1];
            var _next = document.getElementById(_actionSplit[1]);
            _next.style.display = "block";
            var _getImgMap = document.getElementsByTagName("map")[0];
            _getImgMap.innerHTML = "";

            _current.style.zIndex = 0;
            _next.style.zIndex = 1;

            // console.log(scenes.findIndex((_s) => _s.name == _actionSplit[1]));

            //set transition
            var _moveSceneAction = function()
            {
                _next.style.opacity = 1;
                _current.style.opacity = 1;
                _current.style.display = "none";
                goToScene(); 
            };
            switch (_actionSplit[2])
            {
                case "fadeinout":
                new TimelineMax()
                    .to(_current, 0.5, {opacity: 0, y: 0, x: 0})
                    .from(_next, 0.5, {opacity: 0, y: 0, x: 0})
                    .addCallback(_moveSceneAction, "+=0");
                    break;
                case "fade":
                    new TimelineMax()
                    .from(_next, 0.5, {opacity: 0, y: 0, x: 0})
                    .addCallback(_moveSceneAction, "+=0");
                    break;
                default: //none or otherwise
                    _moveSceneAction();
                    break;
            }

            // new TimelineMax()
            // // .to(_current, 0.5, {opacity: 0, y: 0, x: 0}) //fade in out
            // // .from(_next, 0.5, {opacity: 0, y: 0, x: 0})

            // .from(_next, 0.5, {opacity: 0, y: 0, x: 0}) //fade in to slide

            // // //Slide left/right
            // // .addLabel("t")
            // // .to(_current, 0.75, { opacity: 1, x: 640, y: 0, ease: Power2.easeInOut}, "t+=0")
            // // .from(_next, 0.75, { opacity: 1,  x: -640, y: 0, ease: Power2.easeInOut}, "t+=0")
            // // .to(_current, 0, { opacity: 1, x: 0, y: 0 }) //quick fix

            // // //Slide up/down
            // // .addLabel("t")
            // // .to(_current, 0.75, { opacity: 1, x: 0, y: 480, ease: Power2.easeInOut}, "t+=0")
            // // .from(_next, 0.75, { opacity: 1,  x: 0, y: -480, ease: Power2.easeInOut}, "t+=0")
            // // .to(_current, 0, { opacity: 1, x: 0, y: 0 }) //quick fix

            // .addCallback(_moveSceneAction, "+=0");

            break;
            case "text":
            document.getElementById("textFrame").style.display = "block";
            document.getElementById("text").innerText = _actionSplit[1];
            textTime = 3000;
            break;
        }
    };
}

function hideText()
{
    document.getElementById("textFrame").style.display = "none"; 
    textTime = 0;   
}

function update()
{
    //delta time
    var now = Date.now();
    dt = now - lastUpdate;
    lastUpdate = now;

    //if text is appeared
    if (textTime > 0)
    {
        textTime -= dt;

        if (textTime < 1)
            hideText();
    }

    // //Resize window
    // if (document.getElementsByTagName("img").length < 1)
    //     return;

    var _wRef = 640;
    var _hRef = 480;
    var _aspectRef = _wRef / _hRef;

    var _w = window.innerWidth;
    var _h = window.innerHeight;
    var _aspect = _w / _h;
    
    var _marginLeft =  (_w - _wRef) / 2;
    var _marginTop = (_h - _hRef) / 2;
    
    var _wScale = _w / _wRef;
    var _hScale = _h / _hRef;
    
    var _game = document.getElementById("game").style;
    _game.width = _wRef + "px";
    _game.height = _hRef + "px";
    _game.marginTop = _marginTop + "px";
    _game.marginLeft = _marginLeft + "px";
    _game.scale = (_aspect > _aspectRef) ? _hScale : _wScale;

    switch (isFullScreen)
    {
        case -1:
        isFullScreen = 0;
        break;
    }

    window.scroll(0, 0);
}

document.getElementById("fullscreen").onmousedown = function() 
{
    if (isFullScreen == -1)
    return;

    try {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen)
        docElm.requestFullscreen();
    else if (docElm.mozRequestFullScreen)
        docElm.mozRequestFullScreen();
    else if (docElm.webkitRequestFullScreen)
        docElm.webkitRequestFullScreen();
    else if (docElm.msRequestFullscreen)
        docElm.msRequestFullscreen();

    screen.orientation.lock("landscape");
    } catch (_e) {

    }
};

window.addEventListener("fullscreenchange", function () 
{
    isFullScreen = isFullScreen == 0 ? 1 : 0;
    document.getElementById("fullscreen").style.display = isFullScreen == 1 ? "none" : "block";
});
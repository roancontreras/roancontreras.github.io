"use strict";

(function() 
{
   
})();

var isFullScreen = -1;
var textTime = 0;
var imagesMax = 0;
var imagesLoaded = 0;
var currentScene = "";
var sceneData = {};

var lastUpdate = Date.now();
var dt = 0;

document.getElementById("textFrame").style.display = "none";
setInterval(update, 1);
setup();

document.body.oncontextmenu = function()
{
    return false;
};

document.oncontextmenu = function()
{
    return false;
};

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
                document.getElementById("loading").innerText = imagesLoaded + " / " + imagesMax;

                if (imagesLoaded >= imagesMax)
                    scenesCompleted();
                else
                    createSingleScene(_scenesList["scenes"][imagesLoaded], _scenesList);
            }

            _img.src = json["image"];
            _g.append(_img);

            sceneData[_name] = {};
            sceneData[_name]["hotspots"] = json["hotspots"];
        });
}

function scenesCompleted()
{
    document.getElementById("loading").style.display = "none";
    goToScene(currentScene);
}

function goToScene(_scene)
{
    document.getElementById(_scene).style.display = "block";
    var _hotspots = sceneData[_scene]["hotspots"];
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
            hideText();
            document.getElementById(currentScene).style.display = "none";
            currentScene = _actionSplit[1];
            goToScene(currentScene);
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

    //Resize window
    if (document.getElementsByTagName("img").length < 1)
        return;

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
    
    for (var i = 0; i < document.getElementsByTagName("img").length; i++)
    {
        var _imgStyle =  document.getElementsByTagName("img")[i].style;
        _imgStyle.marginTop = _marginTop + "px";
        _imgStyle.marginLeft = _marginLeft + "px";
        _imgStyle.scale = (_aspect > _aspectRef) ? _hScale : _wScale;
    }

    switch (isFullScreen)
    {
        case -1:
        isFullScreen = 0;
        break;
    }

    window.scroll(0, 0);
}

document.getElementById("fullscreen").addEventListener('click', function (e) 
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
});

window.addEventListener("fullscreenchange", function () 
{
    isFullScreen = isFullScreen == 0 ? 1 : 0;
    document.getElementById("fullscreen").style.display = isFullScreen == 1 ? "none" : "block";
});
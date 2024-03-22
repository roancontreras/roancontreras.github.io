"use strict";

(function() 
{
    var sceneStruct = function(_idx, _name, _hotspots)
    {
        this.idx = _idx;
        this.name = _name;
        this.hotspots = _hotspots;
        this.timeout = undefined;
        this.functions = {};
    };

    var isFullScreen = -1;
    var data = {};

    var textTime = 0;
    var waitTime = 0;
    var waitAction = null;

    var imagesMax = 0;
    var imagesLoaded = 0;
    var scenes = [];
    var sceneIndex = 0;
    
    var gameWidth = 0;
    var gameHeight = 0;

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

    function getSceneIndex(_name)
    {
        return scenes.findIndex((_s) => _s.name == _name);
    }

function createScenes(_settings)
{
    var _g = document.getElementById("game");
    imagesMax = _settings["scenes"].length;

    var _imgMap = document.createElement("map");
    _imgMap.name = "imgmap";
    _imgMap.id = "imgmap";
    _g.append(_imgMap);

    for (var i = 0; i < imagesMax; i++)
        createSingleScene(i, _settings["scenes"][i]);
}

function createSingleScene(i, _name)
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
                var _percent = ((imagesLoaded/imagesMax) * 100);
                document.getElementById("loadingBar").style.width = _percent + "%";
                document.getElementById("loadingTxt").innerText = "Loading (" + Math.floor(_percent) + "%)";

                if (imagesLoaded >= imagesMax)
                    scenesCompleted();
            }

            _img.src = json["image"];
            _g.append(_img);

            var _newScene = new sceneStruct(i, _name, json["hotspots"]);
            if (json["timeout"] != undefined)
                _newScene.timeout = json["timeout"];

            if (json["functions"] != undefined)
                _newScene.functions = json["functions"];

            scenes.push(_newScene);
        });
}

function scenesCompleted()
{
    scenes.sort((_a, _b) => _a.idx - _b.idx);
    document.getElementById("loading").remove();
    goToScene();
}

function goToScene()
{
    var _takeScene = scenes[sceneIndex];

    document.getElementById(_takeScene.name).style.display = "block";
    var _hotspots = _takeScene.hotspots;
    var _getImgMap = document.getElementsByTagName("map")[0];
    _getImgMap.innerHTML = "";

    if (_hotspots.length > 0)
    {
        for (var i = 0; i < _hotspots.length; i++)
        {
            var _apply = function(_split)
            {    
                var _area = document.createElement("area");
                _area.shape = _split[0];
                _area.coords = _split[1];
                setHotspot(_area, _split[2]);
        
                _getImgMap.appendChild(_area);
            };

            //if (unlockable)
            var _match = _hotspots[i].trim().match(/if (.*) {(.*)}/);
            if (_match != null)
            {
                var _key = _match[1].trim();
                var _hotspot = _match[2].trim();
                // console.warn(_key);

                if ((_key[0] == '!' && (data[_key] == null || data[_key] == false)) || data[_key] == true)
                    _apply(_hotspot.trim().split('|'));
            }
            else
                _apply(_hotspots[i].trim().split('|'));
        }
    }
    else
    {
        var _area = document.createElement("area");
        _area.shape = "rect";
        _area.coords = "0, 0, " + gameWidth + ", " + gameHeight;
        _area.style.cursor = "progress";
        _getImgMap.appendChild(_area);
    }

    //if timeout exists
    if (_takeScene.timeout != undefined)
    {
        var _timeOutSplit = _takeScene.timeout.split('|');

        waitTime = parseInt(_timeOutSplit[0]);
        waitAction = function() { applyHotspot(_timeOutSplit[1].split('=')); };
    }

    // console.warn(data);
}

function setup()
{
    fetch('settings.json', { method: 'GET'})
    .then(function(response)  { return response.json(); })
    .then(function(json) 
    {
        gameWidth = parseInt(json["resolution"]["width"]);
        gameHeight = parseInt(json["resolution"]["height"]);
        createScenes(json);
    });
}

function changeSceneAction(_scene, _transition)
{
    hideText();
    var _current = document.getElementById(scenes[sceneIndex].name);

    //determine next scene
    switch (_scene)
    {
        case "prev":
            sceneIndex--;
            _scene = scenes[sceneIndex].name;
            break;
        case "next":
            sceneIndex++;
            _scene = scenes[sceneIndex].name;
            break;
        default:
            sceneIndex = getSceneIndex(_scene);
            break;
    }

    var _next = document.getElementById(_scene);
    _next.style.display = "block";
    var _getImgMap = document.getElementsByTagName("map")[0];
    _getImgMap.innerHTML = "";

    _current.style.zIndex = 0;
    _next.style.zIndex = 1;

    //set transition
    var _moveSceneAction = function()
    {
        _next.style.opacity = 1;
        _current.style.display = "none";
        _current.style.opacity = 1;
        goToScene(); 
    };
    switch (_transition)
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
        case "slide_left":
        case "slide_right":
            var _nextXpos = gameWidth * (_transition == "slide_right" ? -1 : 1);
            var _currentXpos = -gameWidth * (_transition == "slide_right" ? -1 : 1);

            new TimelineMax()
            .addLabel("t")
            .to(_current, 0.75, { opacity: 1, x: _nextXpos, y: 0, ease: Power1.easeInOut}, "t+=0")
            .from(_next, 0.75, { opacity: 1,  x: _currentXpos, y: 0, ease: Power1.easeInOut}, "t+=0")
            .to(_current, 0, { opacity: 1, x: 0, y: 0 }) //quick fix
            .addCallback(_moveSceneAction, "+=0");
            break;
        case "slide_up":
        case "slide_down":
            var _nextYpos = gameHeight * (_transition == "slide_up" ? -1 : 1);
            var _currentYpos = -gameHeight * (_transition == "slide_up" ? -1 : 1);

            new TimelineMax()
            .addLabel("t")
            .to(_current, 0.75, { opacity: 1, y: _nextYpos, x: 0, ease: Power1.easeInOut}, "t+=0")
            .from(_next, 0.75, { opacity: 1,  y: _currentYpos, x: 0, ease: Power1.easeInOut}, "t+=0")
            .to(_current, 0, { opacity: 1, x: 0, y: 0 }) //quick fix
            .addCallback(_moveSceneAction, "+=0");
            break;
        case "slideover_left":
        case "slideover_right":
            new TimelineMax()
            .addLabel("t")
            .from(_next, 0.75, { opacity: 1,  x: -gameWidth * (_transition == "slideover_right" ? -1 : 1), y: 0, ease: Power2.easeOut}, "t+=0")
            .to(_current, 0, { opacity: 1, x: 0, y: 0 }) //quick fix
            .addCallback(_moveSceneAction, "+=0");
            break;
        case "slideover_up":
        case "slideover_down":
            new TimelineMax()
            .addLabel("t")
            .from(_next, 0.75, { opacity: 1,  y: -gameHeight * (_transition == "slideover_up" ? -1 : 1), x: 0, ease: Power2.easeOut}, "t+=0")
            .to(_current, 0, { opacity: 1, x: 0, y: 0 }) //quick fix
            .addCallback(_moveSceneAction, "+=0");
            break;
        default: //none or otherwise
            _moveSceneAction();
            break;
    }
}

function setHotspot(_place, _action)
{
    _place.onmousedown = function() { applyHotspot(_action.trim().split('=')) };
}

function applyHotspot(_actionSplit)
{
    switch (_actionSplit[0])
    {
        case "go":
        if (waitAction != null)
        {
            waitTime = 0;
            waitAction = null;
        }

        changeSceneAction(checkExpression(_actionSplit[1]), _actionSplit[2]);
        break;
        case "text":
        document.getElementById("text").innerText = checkExpression(_actionSplit[1]);
        document.getElementById("textFrame").style.display = "block";
        textTime = 3000;
        break;
        default: //if none of the above
        scenes[sceneIndex].functions[_actionSplit[0]].split(';').forEach(_f => 
        {
            checkFunction(_f);
        });
        break;
    }
}

function checkFunction(_string)
{
    // console.log(_string);
    var _match =  "";

    //set variable
    _match = _string.match(/set (.*) = (.*)/);
    if (_match != null)
    {
        var _key = _match[1].trim();
        var _value = _match[2].trim();

        if (_value.toLowerCase() == "true" || _value.toLowerCase() == "false")
            data[_key] = _value == "true" ? true : false;
        else
            data[_key] = _value;

        return;
    }

    //if-else
    _match = _string.match(/if (.*) {(.*)} else {(.*)}/);
    if (_match != null)
    {
        var _key = _match[1].trim();
        var _true = _match[2].trim();
        var _false = _match[3].trim();

        if (data[_key] == null || data[_key] == false) //auto false
            applyHotspot(_false.split('='));
        else if (data[_key] == true)
            applyHotspot(_true.split('='));

        return;
    }

    //apply hotspot
    var _isHotspot = _string.trim().split('=');
    if (_isHotspot.length > 0)
    {
        applyHotspot(_isHotspot);
        return;
    }
}

function checkExpression(_string)
{
    var _match = "";

    //Choose between values
    _match = _string.match(/choose{(.*)}/);
    if (_match != null)
    {
        var _chooseSplit = _match[1].split(';');
        return _chooseSplit[Math.floor(Math.random() * _chooseSplit.length)].trim();
    }

    _match = _string.match(/{(.+?)}/);
    if (_match != null)
    {
        try
        {
            return data[_match[1].trim()];
        }
        catch (_e)
        {
            console.error("Variable " + _match[1] + " is null!");
            console.error(_e);
        }
    }

    //no other
    return _string.trim();
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

    //wait is up
    if (waitAction != null && waitTime > 0)
    {
        waitTime -= dt;

        if (waitTime < 1)
        {
            waitTime = 0;
            waitAction();
            waitAction = null;
        }
    }

    //game scale
    var _aspectRef = gameWidth / gameHeight;

    var _w = window.innerWidth;
    var _h = window.innerHeight;
    var _aspect = _w / _h;
    
    var _marginLeft =  (_w - gameWidth) / 2;
    var _marginTop = (_h - gameHeight) / 2;
    
    var _wScale = _w / gameWidth;
    var _hScale = _h / gameHeight;
    
    var _game = document.getElementById("game").style;
    _game.width = gameWidth + "px";
    _game.height = gameHeight + "px";
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

    try 
    {
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
    } catch (_e) { }
};

window.addEventListener("fullscreenchange", function () 
{
    isFullScreen = isFullScreen == 0 ? 1 : 0;
    document.getElementById("fullscreen").style.display = isFullScreen == 1 ? "none" : "block";
});

})();
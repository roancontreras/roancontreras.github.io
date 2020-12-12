"use strict";

(function() 
{
    var m_menu = ["Resume", "Contact"];

    $(document).ready(function()
    {
        //Defaults
        $('body').on('contextmenu', function(e){ e.preventDefault(); });

        //Modal
        $('#modal .close').click(function() {  console.log("close!"); windowFunction(false); });
        $('#modal').click(function() { windowFunction(false); });

        //Menu
        m_menu.forEach(_m =>
            {
                let _index = m_menu.indexOf(_m);
                $("nav ul").append("<li class=\"menu" + _index +  "\"><h4>" + _m + "</h4></li>");
                $("nav ul .menu" + _index.toString()).click(function() 
                {
                    $("#modal #pic").css("background-image", "none");
                    // $("#modal img").attr("src", null);
                    $("#modal img").css({"display" : "none"});
                    windowFunction(true); 
                });
            });

        //Icons
        for (var i = 0; i < 100; i++)
        {
            $(".container").append("<div class=\"item" + i.toString() +"\"><div class=\"icon\"></div></div>");
            let _currentThumbnail = ".container .item" + i.toString() + " .icon";
            let _setImg = Math.random() * 100 > 50 ? "img/testGif" + Math.floor(Math.random() * 4) + ".gif" :
            "img/testImg" + Math.floor(Math.random() * 4) + ".jpg";

            $(_currentThumbnail).css(
                {
                    "height" : (200 + (Math.random() * 500)).toString() + "px",
                    "background-image" : "url(\"" + _setImg + "\")",
                    "cursor" : "pointer"
                });

            $(_currentThumbnail).mouseenter(function() { TweenMax.to($(this), 0.5, { "opacity" : "0.5", "transform" : "scale(1.25)", "ease" : "Back.easeOut" }); });
            $(_currentThumbnail).mouseleave(function() { TweenMax.to($(this), 0.25, { "opacity" : "1", "transform" : "scale(1)", "ease" : "Power2.easeOut" }); });

            $(_currentThumbnail).click(function() 
            {
                // $("#modal #pic").css("background-image", "url(\"" + _setImg + "\")");
                $("#modal img").css({"display" : "block"});
                $("#modal img").attr("src", _setImg);
                windowFunction(true); 
            });
        }

        //Init Magic Grid
        let magicGrid = new MagicGrid(
        {
            container: '.container',
            animate: false,
            gutter: 5,
            static: true,
            useMin: true
        });
        
        magicGrid.listen();
        // for (var i = 0; i < m_pages.length; i++)
        // {
        //     $("nav ul").append("<li data-pindex=\"" + i.toString() + "\">" + m_pages[i] + "</li>");
        //     var _ulBtn = "nav ul li[data-pindex=\"" + i.toString() +  "\"]";
        //     $(_ulBtn).click(function()
        //     {
        //         let _getIndex = $(this).attr("data-pindex");
        //         if (_getIndex == m_pageIndex)
        //             return;

        //         m_pages.forEach(_p =>
        //             {
        //                 let _isCurrentPage = m_pages.indexOf(_p) ==  _getIndex;

        //                 if (!_isCurrentPage)
        //                     $("#" + _p).removeClass("active");
        //                 else
        //                     $("#" + _p).addClass("active");

        //                 $("#" + _p).css({"display" : (_isCurrentPage ? "flex" : "none")});
        //             });

        //         m_pageIndex = _getIndex;
        //     });

        // $("body").css( "cursor", "default" );    
        // }
    });

    function windowFunction(_toOpen)
    {
        if (_toOpen)
        {
            $("body").css({ "overflow": "hidden" });
            $("#modal").css({ "display" : "block", "opacity" : "0" });
            TweenMax.to($("#modal"), 0.5, { "opacity" : "1", "ease" : "Power2.easeOut" });
            document.getElementById("modal").scrollTop = 0;
        }
        else
        {
            new TimelineMax()
            .addLabel("modal")
            .to($("#modal"), 0.5, { "opacity" : "0", "ease" : "Power2.easeOut" }, "modal")
            .addCallback(function() 
            {
                $("#modal").css({ "display" : "none" });
                $("body").css( { "overflow" : "auto" } );
            }, "+=0", [], this)
        }
    }
})();
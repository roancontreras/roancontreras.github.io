"use strict";

(function() 
{
    $(document).ready(function()
    {
        $('body').on('contextmenu', function(e){ e.preventDefault(); });

        for (var i = 0; i < 100; i++)
        {
            $(".container").append("<div class=\"item" + i.toString() +"\"><div class=\"icon\"></div></div>");
            let _currentThumbnail = ".container .item" + i.toString() + " .icon";
            $(_currentThumbnail).css(
                {
                    "height" : (200 + (Math.random() * 500)).toString() + "px",
                    "background-image" : "url(\"img/testImg" + Math.floor(Math.random() * 4) + ".jpg\")",
                    "cursor" : "pointer"
                });

            $(_currentThumbnail).mouseenter(function() { TweenMax.to($(this), 0.5, { "opacity" : "0.5", "transform" : "scale(1.25)", "ease" : "Back.easeOut" }); });
            $(_currentThumbnail).mouseleave(function() { TweenMax.to($(this), 0.25, { "opacity" : "1", "transform" : "scale(1)", "ease" : "Power2.easeOut" }); });
        }

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
})();
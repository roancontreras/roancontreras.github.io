"use strict";

(function() 
{
    $(document).ready(function()
    {
        let magicGrid = new MagicGrid({
            container: '.container',
            animate: false,
            gutter: 5,
            static: true,
            useMin: true
          });
        
          magicGrid.listen();

        $('body').on('contextmenu', function(e){ e.preventDefault(); });
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
        // }
    });
})();
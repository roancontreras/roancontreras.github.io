"use strict";
(function()
{
    var modal = document.getElementById("imgModal");
    var imgButtons = document.getElementsByClassName("imgbtn");
    for (var i = 0; i < imgButtons.length; i++)
    {
        imgButtons[i].onclick = function() 
        {
            document.body.style.overflowY = "hidden";
            document.getElementById("imgSolo").src = this.src;

            modal.style.opacity = 0;
            modal.style.display = "block";
            document.getElementById("close").onclick = null;
            
            //fade in
            var _tween = TweenMax.to(modal, 0.5, 
            {
                opacity: 1,
                ease: Power1.out
            });

            _tween.eventCallback("onComplete", function()
            {
                //fade out when close
                document.getElementById("close").onclick = function()
                {
                    document.getElementById("close").onclick = null;

                    new TimelineMax()
                    .to(modal, 0.5, { opacity: 0, ease: Power1.out })
                    .addCallback(function()
                    {
                        modal.style.display = "none";
                        document.body.style.overflowY = "auto";
                    }, "+=0");
                };
            });
        };
    }
}());
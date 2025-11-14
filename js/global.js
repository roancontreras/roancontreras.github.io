"use strict";
var docTitle = [];
docTitle = document.title.split('|');

//header text + (select if home buttons or current page + back)
document.getElementsByTagName("header")[0].innerHTML =  '<h1 style="margin-bottom: 0; padding-bottom: 0;">Roan Contreras</h1>\n<p style="text-align: center;">' + (docTitle.length == 1 ? '<a href="games.html">Games</a> / <a href="experiments.html">Experiments</a>  / roan.contreras [@] hotmail.com' : '<a href="index.html">Home</a>' + " / " + docTitle[1].trim()) + "</p>";

document.getElementsByTagName("footer")[0].innerHTML = '<p style="text-align: center;"><span id="privacyfooter"><a href="privacy.html">Privacy Policy</a> /</span> <a href="https://twitter.com/ToadieTechnika" target="_blank">Twitter</a></p>';
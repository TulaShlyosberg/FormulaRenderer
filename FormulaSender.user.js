// ==UserScript==
// @name         FormulaSender
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http*://vk.com/*
// @grant        none
// ==/UserScript==


//DOM - элемент elem превращаем в картинку и прекрепляем к document.body
function htmlToImage(elem){
    html2canvas(elem, {
        onrendered: function(canvas) {
            var img = canvas.toDataURL();
            var source = document.createElement('img');
            source.src = img;
            document.body.appendChild(source);
        }
    });
}


//подключаем внешние стили
function appendExternalCSS(){
		var new_link = document.createElement("link");
		new_link.setAttribute('rel', "stylesheet");
		new_link.setAttribute('href', "https://cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/katex.min.css");
		new_link.setAttribute('integrity', "sha384-9tPv11A+glH/on/wEu99NVwDPwkMQESOocs/ZGXPoIiLE8MU/qkqUcZ3zzL+6DuH");
		new_link.setAttribute('crossorigin', "anonymous");
		document.head.appendChild(new_link);
	}


//подключаем внешние библиотеки
 appendLibraries(){
		//append JQuery
		var script_0 = document.createElement('script');
		script_0.src = "https://code.jquery.com/jquery-3.3.1.min.js";
		
		//append Katex to render formulas
		script_0.onload = function() {
			var script_1 = document.createElement('script');
			script_1.setAttribute('src', "https://cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/katex.min.js");
			script_1.setAttribute('integrity', "sha384-U8Vrjwb8fuHMt6ewaCy8uqeUXv4oitYACKdB0VziCerzt011iQ/0TqlSlv8MReCm");
			script_1.setAttribute('crossorigin', "anonymous");
			
			//append html2canvas to turn formulas into images
			script_1.onload = function(){
				var script_2 = document.createElement('script');
				script_2.setAttribute('src', "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/0.4.1/html2canvas.min.js");
				script_2.onload = main();
				document.head.appendChild(script_2);
			};
			document.head.appendChild(script_1);
		};
		document.head.appendChild(script_0);
	}

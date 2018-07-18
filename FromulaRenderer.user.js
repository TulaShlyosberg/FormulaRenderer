// ==UserScript==
// @name         FromulaRenderer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  render formulas in vk messages
// @author       t.shlyosberg
// @match        http*://vk.com/*
// @grant        none
// @noframes
// ==/UserScript==


(function() {
    'use strict';
    
    appendExternalCSS();
    appendLibraries();
})();


//классом rendered будем помечать блоки с отредеренными формулами
function appendCSS(){
    $('<style>\
       .rendered {}\
      </style>').appendTo($("html > head"));
}


//заменяем html символы на unicode
function htmlReplacer(str, offset, s){
    if (str == "&quot;") return '"';
    if (str == "&gt;") return '<';
    if (str == "&lt;") return '>';
}


//рендерим tex
function prepareInnerHTML(messIndex, innerStr){
    $( this ).addClass("rendered");    //помечаем отрендеренное сообщение классом rendered
    var hasFormula = innerStr.search(/[\\\$][\[\]\$]/);
    if (hasFormula == -1) return innerStr;   //выходим, если нет формул
    var text = innerStr.split('$$');   //отделяем формулы, заключенные в $$, от текста
    var identity = new Array(text.length).fill(false);   //присваеваем им identity: false
    var len = text.length;
    var index = 0;
    
    for(var i = 0; i < len; i++){  //в блоках текста остались формулы, заключенные в \[ и \]
        var elem = text[index].split(/\\[\]\[]/);
        if (elem.length === 1) index++;
        else {
            [].splice.apply(text, [index, 1].concat(elem));
            [].splice.apply(identity, [index, 1].concat(new Array(elem.length).fill(true)));   //присваиваем им identity: true
            index+= elem.length;
        }
    }
    
    //из свойств split - на нечетных местах массива text стоят формулы и только на них
    for(var formulaIndex = 1; formulaIndex < text.length; formulaIndex+= 2){
        var buffer = document.createElement('span');
        try{   //рендерим формулы и после возвращаем результат
            katex.render(text[formulaIndex].replace(/&quot;|&gt;|&lt;/g, htmlReplacer), buffer, {
				displayMode: identity[formulaIndex]
				});
            text[formulaIndex] = buffer.innerHTML;
        } catch(e) {
            buffer.setAttribute('style', 'background: #fc0;');
            buffer.innerHTML = text[formulaIndex];
            text[formulaIndex] = buffer.outerHTML;
        }
    }
    return text.join('');
}


//ищем все блоки, где может быть написана формула
function render_all(){
	$(".im-mess:not(.rendered),\
	   .reply_content:not(.rendered),\
	   .wall_post_text:not(.redered),\
	   .article_layer__content:not(.rendered)").html(prepareInnerHTML);
}



function main(){
    appendCSS();
    setInterval(render_all, 100);
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
function appendLibraries(){
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

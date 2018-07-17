// ==UserScript==
// @name         FromulaRenederer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       t.soidberg
// @match        http*://vk.com/*
// @grant        none
// @noframes
// ==/UserScript==



function htmlReplacer(str, offset, s){
    if (str == "&quot;") return '"';
    if (str == "&gt;") return '<';
    if (str == "&lt;") return '>';
}



function prepareInnerHTML(innerStr){
    var hasFormula = innerStr.search(/[\\\$][\[\]\$]/);
    if (hasFormula == -1) return innerStr;
    var text = innerStr.split('$$');
    var identity = new Array(text.length).fill(false);
    var len = text.length;
    var index = 0;
    for(var i = 0; i < len; i++){
        var elem = text[index].split(/\\[\]\[]/);
        if (elem.length === 1) index++;
        else {
            [].splice.apply(text, [index, 1].concat(elem));
            [].splice.apply(identity, [index, 1].concat(new Array(elem.length).fill(true)));
            index+= elem.length;
        }
    }
    for(var formulaIndex = 1; formulaIndex < text.length; formulaIndex+= 2){
        var buffer = document.createElement('span');
        try{
            katex.render(text[formulaIndex].replace(/&quot;|&gt;|&lt;/g, htmlReplacer), buffer, {displayMode: identity[formulaIndex]});
            text[formulaIndex] = buffer.innerHTML;
        } catch(e) {
            buffer.setAttribute('style', 'background: #fc0;');
            buffer.innerHTML = text[formulaIndex];
            text[formulaIndex] = buffer.outerHTML;
        }
    }
    return text.join('');
}



function render_messages(){
    var messages = document.getElementsByClassName('im-mess--text wall_module _im_log_body');
    for (var i = messages.length - 1; i >= 0; i--){
            messages[i].innerHTML = prepareInnerHTML(messages[i].innerHTML);
    }
}



function append_script_2(){
    var script_2 = document.createElement('script');
    script_2.setAttribute('src', "https://cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/contrib/auto-render.min.js");
    script_2.setAttribute('integrity', "sha384-aGfk5kvhIq5x1x5YdvCp4upKZYnA8ckafviDpmWEKp4afOZEqOli7gqSnh8I6enH");
    script_2.setAttribute('crossorigin', "anonymous");
    script_2.onload = render_messages;
    document.head.appendChild(script_2);
}



function appendKatex(){
    var new_link = document.createElement('link');
    new_link.setAttribute('rel', "stylesheet");
    new_link.setAttribute('href', "https://cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/katex.min.css");
    new_link.setAttribute('integrity', "sha384-9tPv11A+glH/on/wEu99NVwDPwkMQESOocs/ZGXPoIiLE8MU/qkqUcZ3zzL+6DuH");
    new_link.setAttribute('crossorigin', "anonymous");
    new_link.onload = function(){
        var script_1 = document.createElement('script');
        script_1.setAttribute('src', "https://cdn.jsdelivr.net/npm/katex@0.10.0-beta/dist/katex.min.js");
        script_1.setAttribute('integrity', "sha384-U8Vrjwb8fuHMt6ewaCy8uqeUXv4oitYACKdB0VziCerzt011iQ/0TqlSlv8MReCm");
        script_1.setAttribute('crossorigin', "anonymous");
        script_1.onload = append_script_2;
        document.head.appendChild(script_1);
    };
    document.head.appendChild(new_link);
}


function main(){
    document.body.onload = appendKatex;
}

main();
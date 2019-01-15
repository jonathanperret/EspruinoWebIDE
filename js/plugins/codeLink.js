/**
 Copyright 2014 Gordon Williams (gw@pur3.co.uk)

 This Source Code is subject to the terms of the Mozilla Public
 License, v2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at http://mozilla.org/MPL/2.0/.
 
 ------------------------------------------------------------------
  A button that copies a URL containign the code to the clipboard 
 ------------------------------------------------------------------
**/
"use strict";
(function(){

  var icon;
  var MAX_URL = 2000;
  
  function init() {
    Espruino.Core.Config.add("SHOW_CODE_LINK_ICON", {
      section : "General",
      name : "Show Copy URL Icon",
      description : "Show an icon that will create a URL containing the code from the Code Editor and will copy it to the clipboard. Great for sharing your code on Twitter/Websites/etc",
      type : "boolean",
      defaultValue : true,
      onChange : function(newValue) { showIcon(newValue); }
    });    

    showIcon(Espruino.Config.SHOW_CODE_LINK_ICON);
  }

  function showIcon(show) {
    if (show) {
      icon = Espruino.Core.App.addIcon({ 
        id: "codeLink",
        icon: "star", 
        title : "Copy URL for this code to the clipboard", 
        order: 300, 
        area: { 
          name: "code", 
          position: "bottom"
        },
        click: copyCodeLink
      });    
    } else {
      if (icon!==undefined) icon.remove();
    }
  }

  // from https://github.com/lgarron/clipboard-polyfill/blob/master/clipboard-polyfill.ts
  function selectionSet(elem) {
    var sel = document.getSelection();
    if (sel) {
      var range = document.createRange();
      range.selectNodeContents(elem);
      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    }
  }

  function copyCodeLink() {
    var code = Espruino.Core.Code.getCurrentCode();
    var copier = document.createElement('span');
    copier.innerText = code;
    document.body.appendChild(copier);

    if (selectionSet(copier) && document.execCommand('copy')) {
      Espruino.Core.Notifications.info("Code copied to clipboard");
    } else {
      Espruino.Core.Notifications.error("Failed to copy to clipboard");
    }

    copier.remove();

  };

  Espruino.Plugins.CodeLink = {
    init : init,
  };
}());

$.getJSON("catalogs.json", function(data) {
  if (data) {
    $('#searchBox').on('keyup', function() {
      if ($(this).val() == '') {
        $('#catalogList ul').attr('style', 'display: none;');
      } else {
        $('#catalogList ul').attr('style', '');
      }
    });
    var catalogs = data.catalogs;
    var options = {
      valueNames: [ 'name' ],
      item: '<li><a href="#" class="name init"></a></li>',
      page: 5
    };

    var catalogList = new List('catalogList', options, catalogs);
    var catalogDict = {};
    for (var i = 0; i < catalogs.length; i++) {
      catalogDict[catalogs[i].name] = catalogs[i];
    }

    catalogList.on('searchComplete', function(list) {
      $('a.init').on('click', function() {
        var catalog = catalogDict[$(this).text()];
        chrome.tabs.update({url: catalog.url}, function(tab1) {
          catalog.currentStep = 0;
          chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab2) {
            // make sure the status is 'complete' and it's the right tab
            if (tab1.id == tab2.id && changeInfo.status == 'complete') {
              // execute jquery and dimbackground js
              chrome.tabs.executeScript(null, {file: "jquery.js"}, function(res) {
                chrome.tabs.executeScript(null, {file: "jquery.dim-background.min.js"}, function(res2) {
                  if (catalog.currentStep == catalog.steps.length - 1) {
                    for (var i = 0; i < catalog.steps[catalog.currentStep].highlights.length; i++) {
                      chrome.tabs.executeScript(null, {code: "$(\"" + catalog.steps[catalog.currentStep].highlights[i] + "\").addClass(\"junkmailbegone_highlight\")"});
                    }
                    chrome.tabs.executeScript(null, {code: "$(\".junkmailbegone_highlight\").dimBackground({darkness: 0.5})"});
                  } else {
                    for (var i = 0; i < catalog.steps[catalog.currentStep].clicks.length; i++) {
                      chrome.tabs.executeScript(null, {code: "$(\"" + catalog.steps[catalog.currentStep].clicks[i] + "\").click()"});
                    }
                    catalog.currentStep = catalog.currentStep + 1;
                  }
                });
              });
            }
          });
        });
      });
      $('a.init').removeClass('init');
    });

    /*for (var i = 0; i < catalogs.length; i++) {
      var link = $("<a></a>");
      link.attr("href", "#");
      link.text(catalogs[i].name);
      (function(catalog) {
        link.on("click", function() {
          chrome.tabs.update({url: catalog.url}, function(tab1) {
            catalog.currentStep = 0;
            chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab2) {
              // make sure the status is 'complete' and it's the right tab
              if (tab1.id == tab2.id && changeInfo.status == 'complete') {
                // execute jquery and dimbackground js
                chrome.tabs.executeScript(null, {file: "jquery.js"}, function(res) {
                  chrome.tabs.executeScript(null, {file: "jquery.dim-background.min.js"}, function(res2) {
                    if (catalog.currentStep == catalog.steps.length - 1) {
                      for (var i = 0; i < catalog.steps[catalog.currentStep].highlights.length; i++) {
                        chrome.tabs.executeScript(null, {code: "$(\"" + catalog.steps[catalog.currentStep].highlights[i] + "\").addClass(\"junkmailbegone_highlight\")"});
                      }
                      chrome.tabs.executeScript(null, {code: "$(\".junkmailbegone_highlight\").dimBackground({darkness: 0.5})"});
                    } else {
                      for (var i = 0; i < catalog.steps[catalog.currentStep].clicks.length; i++) {
                        chrome.tabs.executeScript(null, {code: "$(\"" + catalog.steps[catalog.currentStep].clicks[i] + "\").click()"});
                      }
                      catalog.currentStep = catalog.currentStep + 1;
                    }
                  });
                });
              }
            });
          });
        });
      })(catalogs[i]);
      
      $("body").append(link);
    }*/
  }
});

ngMap.directive('infoWindow', [ 'Attr2Options', 
  function(Attr2Options) {
    var parser = new Attr2Options();

    return {
      restrict: 'E',
      require: '^map',
      link: function(scope, element, attrs, mapController) {
        var filtered = new parser.filter(attrs);

        /*
         * set infoWindow options
         */
        var options = parser.getOptions(filtered);
        if (options.pixelOffset) {
          options.pixelOffset = google.maps.Size.apply(this, options.pixelOffset);
        }
        infoWindow = new google.maps.InfoWindow(options);
        infoWindow.contents = element.html();

        /*
         * set infoWindow events
         */
        var events = parser.getEvents(scope, filtered);
        for(var eventName in events) {
          google.maps.event.addListener(infoWindow, eventName, events[eventname]);
        }

        // set infoWindows to map controller
        mapController.infoWindows.push(infoWindow);

        // do NOT show this
        element.css({display:'none'});

        //provide showInfoWindow function to controller
        scope.showInfoWindow = function(event, id, options) {
          var infoWindow = scope.infoWindows[id];
          var contents = infoWindow.contents;
          var matches = contents.match(/\[\[[^\]]+\]\]/g)
          if (matches) {
            for(var i=0, length=matches.length; i<length; i++) {
              var expression = matches[i].replace(/\[\[/,'').replace(/\]\]/,'');
              try {
                contents = contents.replace(matches[i], eval(expression));
              } catch(e) {
                expression = "options."+expression;
                contents = contents.replace(matches[i], eval(expression));
              }
            }
          }
          var anchor = new google.maps.Marker({position: event.latLng})
          infoWindow.setContent(contents);
          infoWindow.open(scope.map, anchor);
        }
      } //link
    } // return
  } // function
]);

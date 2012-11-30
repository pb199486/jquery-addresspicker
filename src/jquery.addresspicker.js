/*
 * jQuery UI addresspicker @VERSION
 *
 * Copyright 2010, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Progressbar
 *
 * Depends:
 *   jquery.ui.core.js
 *   jquery.ui.widget.js
 *   jquery.ui.autocomplete.js
 */
(function( $, google ) {

    var AddressPicker = function(element, options) {
        this.options = options;
        this.$element = $(element);
        this._create()
    }

    AddressPicker.prototype = {

        constructor: AddressPicker,

        marker: function() {
          return this.gmarker;
        },

        map: function() {
          return this.gmap;
        },

        updatePosition: function() {
          this._updatePosition(this.gmarker.getPosition());
        },
    
        reloadPosition: function() {
          this.gmarker.setVisible(true);
          this.gmarker.setPosition(new google.maps.LatLng(this.lat.val(), this.lng.val()));
          this.gmap.setCenter(this.gmarker.getPosition());
        },
    
        selected: function() {
          return this.selectedResult;
        },
    
        _create: function() {
          this.geocoder = new google.maps.Geocoder();
          this.$element.typeahead({
              minLength:3,
              source: this._geocode.bind(this)
              ,textproperty: function(item) {
                  return item.formatted_address;
              }, updater: function(item) {
                  console.dir(item);
                  return this.textproperty(item);
              }
          });

            if (this.options.elements.map) {
                this.mapElement = $(this.options.elements.map);
                this._initMap();
            }

          this.lat      = $(this.options.elements.lat);
          this.lng      = $(this.options.elements.lng);
          this.locality = $(this.options.elements.locality);
          this.administrative_area_level_2 = $(this.options.elements.administrative_area_level_2);
          this.administrative_area_level_1 = $(this.options.elements.administrative_area_level_1);
          this.country  = $(this.options.elements.country);
          this.postal_code = $(this.options.elements.postal_code);
          this.type     = $(this.options.elements.type);


        },

        _initMap: function() {
          if (this.lat && this.lat.val()) {
            this.options.mapOptions.center = new google.maps.LatLng(this.lat.val(), this.lng.val());
          }

          this.gmap = new google.maps.Map(this.mapElement[0], this.options.mapOptions);
          this.gmarker = new google.maps.Marker({
            position: this.options.mapOptions.center,
            map:this.gmap,
            draggable: this.options.draggableMarker});
          google.maps.event.addListener(this.gmarker, 'dragend', $.proxy(this._markerMoved, this));
          this.gmarker.setVisible(false);
        },
    
        _updatePosition: function(location) {
          if (this.lat) {
            this.lat.val(location.lat());
          }
          if (this.lng) {
            this.lng.val(location.lng());
          }
        },
    
        _markerMoved: function() {
          this._updatePosition(this.gmarker.getPosition());
        },

        // Autocomplete source method: fill its suggests with google geocoder results
        _geocode: function(query, process) {
            self = this;
            this.geocoder.geocode({
                'address': query + this.options.appendAddressString,
                'region': this.options.regionBias
            }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var suggestions = [];
                    for (var i = 0; i < results.length; i++) {
                        suggestions.push(results[i]); //
                    };
                }
                process(suggestions);
            })
        },
    
        _findInfo: function(result, type) {
          for (var i = 0; i < result.address_components.length; i++) {
            var component = result.address_components[i];
            if (component.types.indexOf(type) !=-1) {
              return component.long_name;
            }
          }
          return false;
        },

        _focusAddress: function(event, ui) {
          var address = ui.item;
          if (!address) {
            return;
          }

          if (this.gmarker) {
            this.gmarker.setPosition(address.geometry.location);
            this.gmarker.setVisible(true);

            this.gmap.fitBounds(address.geometry.viewport);
          }
          this._updatePosition(address.geometry.location);

          if (this.locality) {
            this.locality.val(this._findInfo(address, 'locality'));
          }
          if (this.administrative_area_level_2) {
            this.administrative_area_level_2.val(this._findInfo(address, 'administrative_area_level_2'));
          }
          if (this.administrative_area_level_1) {
            this.administrative_area_level_1.val(this._findInfo(address, 'administrative_area_level_1'));
          }
          if (this.country) {
            this.country.val(this._findInfo(address, 'country'));
          }
          if (this.postal_code) {
            this.postal_code.val(this._findInfo(address, 'postal_code'));
          }
          if (this.type) {
            this.type.val(address.types[0]);
          }
        },

        _selectAddress: function(event, ui) {
          this.selectedResult = ui.item;
        }

      };

    $.fn.addresspicker = function (option) {
        return this.each(function () {
            var $this = $(this)
            var data = $this.data('addresspicker')
            var options = $.extend({}, $.fn.addresspicker.defaults, $this.data(), typeof option == 'object' && option)
            if (!data)
                $this.data('addresspicker', (data = new AddressPicker(this, options)));

            //API:
            if (typeof option == 'string') //activate methods
                data[option]()
        });
    }

    $.fn.addresspicker.defaults =  {
        appendAddressString: "",
        draggableMarker: true,
        regionBias: null,
        mapOptions: {
            zoom: 5,
            center: new google.maps.LatLng(46, 2),
            scrollwheel: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        elements: {
            map: false,
            lat: false,
            lng: false,
            locality: false,
            administrative_area_level_2: false,
            administrative_area_level_1: false,
            country: false,
            postal_code: false,
            type: false

        }
    };

    $.fn.addresspicker.Constructor = AddressPicker;

    /*$.extend( $.addresspicker, {
        version: "@VERSION"
      });
*/
      // make IE think it doesn't suck
      if(!Array.indexOf){
        Array.prototype.indexOf = function(obj){
          for(var i=0; i<this.length; i++){
            if(this[i]==obj){
              return i;
            }
          }
          return -1;
        }
      }


})( window.jQuery, window.google );

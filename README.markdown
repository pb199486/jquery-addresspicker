= jquery-addresspicker for Bootstrap

I forked this project from sgruhier[https://github.com/sgruhier/jquery-addresspicker] who has built a simple address picker on top of JQuery UI Autocomplete.
Since I don't want the overhead of JQUI and am stuck with Bootstrap I chose to rewrite his plugin.

= Features

Simple Addresspicker
The addresspicker is a plain JQuery plugin and follows mostly concepts known to Bootstrap users. I'm using Bootstrap typeahead filled by anonymous google map geocoder suggestions.
Try to enter an address like Berlin Kreuzberg, Manhattan Central Park or London Soho and you'll see suggests

var addresspicker = $( "#addresspicker" ).addresspicker();

= Credits

- Stefan Adolf - @stadolf[http://twitter.com/stadolf]
- Sébastien Gruhier - @sgruhier[http://twitter.com/sgruhier] - (http://xilinus.com - maptimize.com[http://v2.maptimize.com])
 
Demos from the JQuery UI Plugin (go to upstream base on Github)
http://xilinus.com/jquery-addresspicker/demos/images/screenshot.png
You can see a live demo here: http://xilinus.com/jquery-addresspicker/demos/index.html
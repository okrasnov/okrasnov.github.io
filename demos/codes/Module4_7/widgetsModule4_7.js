var density = 1.7;
var mv = 0.3;
var temp=27.;
var sand = 25.;
var silt = 50.;
var clay = 25.;
var xrange="high";

var enterKeyHit = false;


var inputs = {};
$(document).ready(function() {
    doModule4_7(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.05,
      min:  1.2,
      max:  2.0,
      value: 1.7,
      slide: function(event, ui) {
          var inputs = {};
          inputs.densityVal = ui.value;
          doModule4_7(inputs);
          $('#density').val( '  '+ ui.value );
      }
   });
   $( '#density' ).val('  '+ $( '#slider1' ).slider( 'value') );



   $('#slider2').slider({
      range: 'min',
      step: 0.05,
      min: 0.0,
      max: 0.6,
      value: 0.3,
      slide: function(event, ui) {
          var inputs = {};
          inputs.mvVal = ui.value;
          doModule4_7(inputs);
          $('#mv').val( '  '+ ui.value );
      }
   });
   $( '#mv' ).val('  '+ $( '#slider2' ).slider( 'value') );



   $('#slider3').slider({
      range: 'min',
      step: 0.5,
      min: 0.0,
      max: 40.,
      value: 27.,
      slide: function(event, ui) {
          var inputs = {};
          inputs.tempVal = ui.value;
          doModule4_7(inputs);
          $('#temp').val( '  '+ ui.value );
      }
   });
   $( '#temp' ).val('  '+ $( '#slider3' ).slider( 'value') );



   $( "#slider4" ).slider({
           range: true,
               min: 0,
               max: 100,
               values: [ 25, 75 ],
               slide: function( event, ui ) {
               sand = ui.values[ 0 ];
               $( "#sand" ).val( sand + "%");
               silt = ui.values[ 1 ]-ui.values[ 0 ];
               $( "#silt" ).val( silt + "%");
               clay = 100. - ui.values[ 1 ];
               $( "#clay" ).val( clay + "%");

               var inputs = {};
               inputs.sandVal = ui.values[0];
               inputs.siltVal = silt;
               inputs.clayVal = clay;
               doModule4_7(inputs);

           }
       });

   sand = $( "#slider4" ).slider( "values", 0 );
   $( "#sand" ).val( $( "#slider4" ).slider( "values", 0 )+ "%");
   silt = $( "#slider4" ).slider( "values", 1 ) - $( "#slider4" ).slider( "values", 0 );
   $( "#silt" ).val( silt + "%");
   clay = 100. - $( "#slider4" ).slider( "values", 1 );
   $( "#clay" ).val( clay + "%");




   $('input[name="xrange"]').change(function() {
       inputs.xrange = $('input[name="xrange"]:checked').attr("value");
       xrange = inputs.xrange;
       doModule4_7(inputs);
   });



    $( 'input' ).keypress(function(e) {
        var key=e.keyCode || e.which;
        // If an enter key:
        if (key==13) {
            // prevent focusout() from running concurrently!
            enterKeyHit = true;
            testAndSet($(this));
            enterKeyHit = false;
        }
    });


    $( 'input' ).focusout(function() {
        if (enterKeyHit) return;
        testAndSet($(this));
    });


});


function dosoil(elem) {

    var entryName = elem.attr('name');

    var prev_sand = $( "#slider4" ).slider( "values", 0 );
    var prev_silt = $( "#slider4" ).slider( "values", 1 ) - $( "#slider4" ).slider( "values", 0 );
    var prev_clay = 100. - $( "#slider4" ).slider( "values", 1 );

    if (entryName == "sandVal") {
        var csand = elem.attr('value');
        var percent = csand.indexOf("%");
        var sand = parseFloat(csand.substring(0,percent));

        var cprev_silt = $( "#silt" ).attr('value');
        percent = cprev_silt.indexOf("%");
        prev_silt = parseFloat(cprev_silt.substring(0,percent));

        var cprev_clay = $( "#clay" ).attr('value');
        percent = cprev_clay.indexOf("%");
        prev_clay = parseFloat(cprev_clay.substring(0,percent));

        var max = 100.-prev_clay;
        if (invalidEntry(sand,0.,max)) {
            elem.val( '  '+ prev_sand +"%" );
            return;
        }
        var silt = max - sand;
        // update sand/silt slider and silt entry
        $( "#silt" ).val( silt + "%");
        var slider_vals=[];
        slider_vals[0] = sand;
        slider_vals[1] = 100.-prev_clay;
        $( "#slider4" ).slider( "values", 0, slider_vals[0] );
        $( "#slider4" ).slider( "values", 1, slider_vals[1] );
        var clay = prev_clay;

        //alert("sand= "+sand.toString());

    } else if (entryName == "siltVal"){
        var csilt = elem.attr('value');
        var percent = csilt.indexOf("%");
        var silt = parseFloat(csilt.substring(0,percent));

        var cprev_clay = $( "#clay" ).attr('value');
        percent = cprev_clay.indexOf("%");
        prev_clay = parseFloat(cprev_clay.substring(0,percent));

        if (invalidEntry(silt,0.,100-prev_clay)) {
            elem.val( '  '+ prev_silt +"%" );
            return;
        }
        var sand = 100-prev_clay - silt;
        // update sand/silt slider and sand entry
        $( "#sand" ).val( sand + "%");
        var slider_vals=[];
        slider_vals[0] = sand;
        slider_vals[1] = 100.-prev_clay;
        $( "#slider4" ).slider( "values", 0, slider_vals[0] );
        $( "#slider4" ).slider( "values", 1, slider_vals[1] );
        var clay = prev_clay;

    } else if (entryName == "clayVal") {
        var cclay = elem.attr('value');
        var percent = cclay.indexOf("%");
        var clay = parseFloat(cclay.substring(0,percent));

        var cprev_sand = $( "#sand" ).attr('value');
        percent = cprev_sand.indexOf("%");
        prev_sand = parseFloat(cprev_sand.substring(0,percent));


        var max = 100. - prev_sand;
        if (invalidEntry(clay,0.,max)) {
            elem.val( '  '+ prev_clay +"%" );
            return;
        }
        var silt = 100.-(prev_sand + clay);
        //alert("prev_sand= "+prev_sand.toString());

        // update silt/clay slider and silt entry
        $( "#silt" ).val( silt + "%");
        var slider_vals=[];
        slider_vals[0] = prev_sand;
        slider_vals[1] = 100.-clay;
        $( "#slider4" ).slider( "values", 0, slider_vals[0] );
        $( "#slider4" ).slider( "values", 1, slider_vals[1] );
        var sand = prev_sand;
    } // endif

    //call plotter with all 3:
    var inputs = {};
    inputs.sandVal = sand;
    inputs.siltVal = silt;
    inputs.clayVal = clay;
    doModule4_7(inputs);

}

function testAndSet(elem) {
    var entryName = elem.attr('name');
    if (entryName == "sandVal" ||
        entryName == "siltVal" ||
        entryName == "clayVal"   ) {
        dosoil(elem);
    } else if(entryName == "xrange") {
        doModule4_7(inputs);
        return;
    } else {
 
    var previousValue = elem.prev().slider( "value" );
    var val = elem.attr('value');
    // Don't bother if value in text input matches slider:
    //  (focus may have changed w/o value being changed)
    if (previousValue == val) return;
    var min = elem.prev().slider( "option", "min" );
    var max = elem.prev().slider( "option", "max" );
    if (invalidEntry(val,min,max)) {
        elem.prev().slider( "value", previousValue );
        elem.val( '  '+ previousValue );
        return;
    }
    // Move the slider to match the typed in value:
    elem.prev().slider( "value", val );
    // Do the plotter with the new value:
    var inputs = {};
    var entryName = elem.attr('name');
    inputs[entryName] = val;
    doModule4_7(inputs);
    }//endif: entryName?
}


function invalidEntry(val,min,max) {
    if (val < min) {
        alert('Minimum allowed value is '+min);
        return true;
    } else if (val > max) {
        alert('Maximum allowed value is '+max);
        return true;
    }
    return false;
}

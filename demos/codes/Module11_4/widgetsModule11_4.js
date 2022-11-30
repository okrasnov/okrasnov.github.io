var density=0.24;
var radius=0.002;
var wetness= 12.0;
var quant = "absorption";

var enterKeyHit = false;

var qqa="on";
var qqs="undefined";
var qqe="undefined";
var qqal="undefined";


var inputs = {};
$(document).ready(function() {
    doModule11_4(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.01,
      min: 0.01,
      max: 1,
      value: 0.24,
      slide: function(event, ui) {
          var inputs = {};
          inputs.densityVal = ui.value;
          doModule11_4(inputs);
          $('#density').val( '  '+ ui.value );
      }
   });
   $( '#density' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('#slider2').slider({
      range: 'min',
      step: 0.0001,
      min: 0.0001,
      max: 0.005,
      value: 0.002,
      slide: function(event, ui) {
          var inputs = {};
          inputs.radiusVal = ui.value;
          doModule11_4(inputs);
          $('#radius').val( '  '+ ui.value );
      }
   });
   $( '#radius' ).val('  '+ $( '#slider2' ).slider( 'value') );

   $('#slider3').slider({
      range: 'min',
      step: 0.5,
      min: 0,
      max: 15,
      value: 12.,
      slide: function(event, ui) {
          var inputs = {};
          inputs.wetnessVal = ui.value;
          doModule11_4(inputs);
          $('#wetness').val( '  '+ ui.value );
      }
   });
   $( '#wetness' ).val('  '+ $( '#slider3' ).slider( 'value') );



   $('input[name="quanta"]').change(function() {
       qqa = $('input[name="quanta"]:checked').attr("value");
       doModule11_4(inputs);
   });

   $('input[name="quants"]').change(function() {
       qqs = $('input[name="quants"]:checked').attr("value");
       doModule11_4(inputs);
   });

   $('input[name="quante"]').change(function() {
       qqe = $('input[name="quante"]:checked').attr("value");
       doModule11_4(inputs);
   });

   $('input[name="quantal"]').change(function() {
       qqal = $('input[name="quantal"]:checked').attr("value");
       doModule11_4(inputs);
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

function testAndSet(elem) {
    var entryName = elem.attr('name');
    if  (entryName == "quanta" || entryName == "quants" || entryName == "quante" || entryName == "quantal"  ) {
        doModule11_4(inputs);
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
    doModule11_4(inputs);
    }
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


function doinit() {
    document.getElementById('absorption').checked = true;
    document.getElementById('scattering').checked = false;
    document.getElementById('extinction').checked = false;
    document.getElementById('albedo').checked = false;
}

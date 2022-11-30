var real_eps=1.; 
var imag_eps=1.; 
var quant="alpha";
var range="low";

var enterKeyHit = false;

var inputs = {};
$(document).ready(function() {
    doModule2_2(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.05,
      min: 1,
      max: 100,
      value: 1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.epsrVal = ui.value;
          doModule2_2(inputs);
          $('#epsr').val( '  '+ ui.value );
      }
   });
   $( '#epsr' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('#slider2').slider({
      range: 'min',
      step: 0.05,
      min: 0,
      max: 100,
      value: 1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.epsiVal = ui.value;
          doModule2_2(inputs);
          $('#epsi').val( '  '+ ui.value );
      }
   });
   $( '#epsi' ).val('  '+ $( '#slider2' ).slider( 'value') );

   $('input[name="quant"]').change(function() {
       inputs.quant = $('input[name="quant"]:checked').attr("value");
       doModule2_2(inputs);
   });

   $('input[name="range"]').change(function() {
       inputs.range = $('input[name="range"]:checked').attr("value");
       doModule2_2(inputs);
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
    doModule2_2(inputs);
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

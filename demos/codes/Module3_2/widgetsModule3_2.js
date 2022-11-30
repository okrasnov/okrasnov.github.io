var d = 0.5;
var phz1=0.;
var phz2=0.;
var phz3=0.;
var phz4=0.;
var phz5=0.;
var amp1=1., amp2=1., amp3=1., amp4=1., amp5=1.;
var quant="amplitude";

var slider_min=0.;
var slider_max=10.;
var slider_step=0.1;
var slider_value=1.;

var val1=1.;
var val2=1.;
var val3=1.;
var val4=1.;
var val5=1.;

var delta = 0.0;

var enterKeyHit = false;


var inputs = {};
$(document).ready(function() {
    doModule3_2(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: slider_step,
      min: slider_min,
      max: slider_max,
      value: slider_value,
      slide: function(event, ui) {
          var inputs = {};
          inputs.amp1Val = ui.value;
          doModule3_2(inputs);
          $('#amp1').val( '  '+ ui.value );
      }
   });
   $( '#amp1' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('#slider2').slider({
      range: 'min',
      step: slider_step,
      min: slider_min,
      max: slider_max,
      value: slider_value,
      slide: function(event, ui) {
          var inputs = {};
          inputs.amp2Val = ui.value;
          doModule3_2(inputs);
          $('#amp2').val( '  '+ ui.value );
      }
   });
   $( '#amp2' ).val('  '+ $( '#slider2' ).slider( 'value') );

   $('#slider3').slider({
      range: 'min',
      step: slider_step,
      min: slider_min,
      max: slider_max,
      value: slider_value,
      slide: function(event, ui) {
          var inputs = {};
          inputs.amp3Val = ui.value;
          doModule3_2(inputs);
          $('#amp3').val( '  '+ ui.value );
      }
   });
   $( '#amp3' ).val('  '+ $( '#slider3' ).slider( 'value') );

   $('#slider4').slider({
      range: 'min',
      step: slider_step,
      min: slider_min,
      max: slider_max,
      value: slider_value,
      slide: function(event, ui) {
          var inputs = {};
          inputs.amp4Val = ui.value;
          doModule3_2(inputs);
          $('#amp4').val( '  '+ ui.value );
      }
   });
   $( '#amp4' ).val('  '+ $( '#slider4' ).slider( 'value') );

   $('#slider5').slider({
      range: 'min',
      step: slider_step,
      min: slider_min,
      max: slider_max,
      value: slider_value,
      slide: function(event, ui) {
          var inputs = {};
          inputs.amp5Val = ui.value;
          doModule3_2(inputs);
          $('#amp5').val( '  '+ ui.value );
      }
   });
   $( '#amp5' ).val('  '+ $( '#slider5' ).slider( 'value') );

   $('#slider6').slider({
      range: 'min',
      step: 0.05,
      min: 0,
      max: 5,
      value: 0.5,
      slide: function(event, ui) {
          var inputs = {};
          inputs.dVal = ui.value;
          doModule3_2(inputs);
          $('#d').val( '  '+ ui.value );
      }
   });
   $( '#d' ).val('  '+ $( '#slider6' ).slider( 'value') );


   $('#slider7').slider({
      range: 'min',
      step: 0.05,
      min: -180,
      max: 180,
      value: 0.0,
      slide: function(event, ui) {
          var inputs = {};
          inputs.deltaVal = ui.value;
          doModule3_2(inputs);
          $('#delta').val( '  '+ ui.value );
      }
   });
   $( '#delta' ).val('  '+ $( '#slider7' ).slider( 'value') );

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
    doModule3_2(inputs);
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

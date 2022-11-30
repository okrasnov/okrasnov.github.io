var real_eps1 = 1.0;
var imag_eps1 = 0.0;
var real_eps2 = 2.0;
var imag_eps2 = 0.0;
var real_eps3 = 5.0;
var imag_eps3 = 0.0;
var freq_ghz =1.;
var inthick=0.01;
var quant="reflection_coeff";

var enterKeyHit = false;


var inputs = {};
$(document).ready(function() {
    doModule2_5(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.5,
      min: 1,
      max: 100,
      value: 2,
      slide: function(event, ui) {
          var inputs = {};
          inputs.real_eps2Val = ui.value;
          doModule2_5(inputs);
          $('#real_eps2').val( '  '+ ui.value );
      }
   });
   $( '#real_eps2' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('#slider2').slider({
      range: 'min',
      step: 0.05,
      min: 0,
      max: 1,
      value: 0,
      slide: function(event, ui) {
          var inputs = {};
          inputs.imag_eps2Val = ui.value;
          doModule2_5(inputs);
          $('#imag_eps2').val( '  '+ ui.value );
      }
   });
   $( '#imag_eps2' ).val('  '+ $( '#slider2' ).slider( 'value') );

   $('#slider3').slider({
      range: 'min',
      step: 0.5,
      min: 1,
      max: 100,
      value: 5,
      slide: function(event, ui) {
          var inputs = {};
          inputs.real_eps3Val = ui.value;
          doModule2_5(inputs);
          $('#real_eps3').val( '  '+ ui.value );
      }
   });
   $( '#real_eps3' ).val('  '+ $( '#slider3' ).slider( 'value') );

   $('#slider4').slider({
      range: 'min',
      step: 0.5,
      min: 0,
      max: 100,
      value: 0,
      slide: function(event, ui) {
          var inputs = {};
          inputs.imag_eps3Val = ui.value;
          doModule2_5(inputs);
          $('#imag_eps3').val( '  '+ ui.value );
      }
   });
   $( '#imag_eps3' ).val('  '+ $( '#slider4' ).slider( 'value') );

   $('#slider5').slider({
      range: 'min',
      step: 0.001,
      min: 0.0,
      max: 1.0,
      value: 0.15,
      slide: function(event, ui) {
          var inputs = {};
          inputs.inthickVal = ui.value;
          doModule2_5(inputs);
          $('#inthick').val( '  '+ ui.value );
      }
   });
   $( '#inthick' ).val('  '+ $( '#slider5' ).slider( 'value') );

   $('#slider6').slider({
      range: 'min',
      step: 0.025,
      min: 0,
      max: 100,
      value: 1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.freqVal = ui.value;
          doModule2_5(inputs);
          $('#freq').val( '  '+ ui.value );
      }
   });
   $( '#freq' ).val('  '+ $( '#slider6' ).slider( 'value') );

   $('input[name="quant"]').change(function() {
       inputs.quant = $('input[name="quant"]:checked').attr("value");
       doModule2_5(inputs);
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
    doModule2_5(inputs);
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

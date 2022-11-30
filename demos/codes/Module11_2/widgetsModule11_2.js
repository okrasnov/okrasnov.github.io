var real_eps1 = 2.0;
var imag_eps1 = 0.1;
var freq=1.0;
var rmsheight=0.05;
var correl_length=0.1;
var albedo=0.1;
var ext=1.0;
var thickness=0.1;

var real_eps2 = 3.0;
var imag_eps2 = 0.5;
var rmsheight2=0.05;


var enterKeyHit = false;


var inputs = {};
$(document).ready(function() {
    doModule11_2(inputs);
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
          inputs.real_eps1Val = ui.value;
          doModule11_2(inputs);
          $('#real_eps1').val( '  '+ ui.value );
      }
   });
   $( '#real_eps1' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('#slider2').slider({
      range: 'min',
      step: 0.5,
      min: 0,
      max: 100,
      value: 0.1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.imag_eps1Val = ui.value;
          doModule11_2(inputs);
          $('#imag_eps1').val( '  '+ ui.value );
      }
   });
   $( '#imag_eps1' ).val('  '+ $( '#slider2' ).slider( 'value') );

   $('#slider3').slider({
      range: 'min',
      step: 0.1,
      min: 0,
      max: 3,
      value: 1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.freqVal = ui.value;
          doModule11_2(inputs);
          $('#freq').val( '  '+ ui.value );
      }
   });
   $( '#freq' ).val('  '+ $( '#slider3' ).slider( 'value') );

   $('#slider4').slider({
      range: 'min',
      step: 0.005,
      min: 0,
      max: 0.5,
      value: 0.05,
      slide: function(event, ui) {
          var inputs = {};
          inputs.rmsheightVal = ui.value;
          doModule11_2(inputs);
          $('#rmsheight').val( '  '+ ui.value );
      }
   });
   $( '#rmsheight' ).val('  '+ $( '#slider4' ).slider( 'value') );



   $('#slider5').slider({
      range: 'min',
      step: 0.005,
      min: 0,
      max: 0.5,
      value: 0.1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.correl_lengthVal = ui.value;
          doModule11_2(inputs);
          $('#correl_length').val( '  '+ ui.value );
      }
   });
   $( '#correl_length' ).val('  '+ $( '#slider5' ).slider( 'value') );

   $('#slider6').slider({
      range: 'min',
      step: 0.005,
      min: 0,
      max: 0.2,
      value: 0.1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.albedoVal = ui.value;
          doModule11_2(inputs);
          $('#albedo').val( '  '+ ui.value );
      }
   });
   $( '#albedo' ).val('  '+ $( '#slider6' ).slider( 'value') );

   $('#slider7').slider({
      range: 'min',
      step: 0.005,
      min: 0,
      max: 2.0,
      value: 1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.extVal = ui.value;
          doModule11_2(inputs);
          $('#ext').val( '  '+ ui.value );
      }
   });
   $( '#ext' ).val('  '+ $( '#slider7' ).slider( 'value') );

   $('#slider8').slider({
      range: 'min',
      step: 0.005,
      min: 0,
      max: 1.0,
      value: 0.1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.thicknessVal = ui.value;
          doModule11_2(inputs);
          $('#thickness').val( '  '+ ui.value );
      }
   });
   $( '#thickness' ).val('  '+ $( '#slider8' ).slider( 'value') );









   $('#slider9').slider({
      range: 'min',
      step: 0.5,
      min: 1,
      max: 100,
      value: 3,
      slide: function(event, ui) {
          var inputs = {};
          inputs.real_eps2Val = ui.value;
          doModule11_2(inputs);
          $('#real_eps2').val( '  '+ ui.value );
      }
   });
   $( '#real_eps2' ).val('  '+ $( '#slider9' ).slider( 'value') );

   $('#slider10').slider({
      range: 'min',
      step: 0.5,
      min: 0,
      max: 100,
      value: 0.5,
      slide: function(event, ui) {
          var inputs = {};
          inputs.imag_eps2Val = ui.value;
          doModule11_2(inputs);
          $('#imag_eps2').val( '  '+ ui.value );
      }
   });
   $( '#imag_eps2' ).val('  '+ $( '#slider10' ).slider( 'value') );



   $('#slider11').slider({
      range: 'min',
      step: 0.005,
      min: 0,
      max: 0.5,
      value: 0.05,
      slide: function(event, ui) {
          var inputs = {};
          inputs.rmsheight2Val = ui.value;
          doModule11_2(inputs);
          $('#rmsheight2').val( '  '+ ui.value );
      }
   });
   $( '#rmsheight2' ).val('  '+ $( '#slider11' ).slider( 'value') );





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
    doModule11_2(inputs);
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

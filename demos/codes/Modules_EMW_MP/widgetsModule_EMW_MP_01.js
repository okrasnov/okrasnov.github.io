var frequency = 1000.0;
var distance = 1000.0;
var height_t = 10.0;
var height_rmax = 40.0;

var enterKeyHit = false;


var inputs = {};
$(document).ready(function() {
    doModule_EMW_MP_01(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.5,
      min: 1,
      max: 100000,
      value: 1000,
      slide: function(event, ui) {
          var inputs = {};
          inputs.frequencyVal = ui.value;
          doModule_EMW_MP_01(inputs);
          $('#frequency').val( '  '+ ui.value );
      }
   });
   $( '#frequency' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('#slider2').slider({
      range: 'min',
      step: 1,
      min: 1,
      max: 50000,
      value: 1000,
      slide: function(event, ui) {
          var inputs = {};
          inputs.distanceVal = ui.value;
          doModule_EMW_MP_01(inputs);
          $('#distance').val( '  '+ ui.value );
      }
   });
   $( '#distance' ).val('  '+ $( '#slider2' ).slider( 'value') );

   $('#slider3').slider({
      range: 'min',
      step: 1,
      min: 0.1,
      max: 500,
      value: 10,
      slide: function(event, ui) {
          var inputs = {};
          inputs.height_tVal = ui.value;
          doModule_EMW_MP_01(inputs);
          $('#height_t').val( '  '+ ui.value );
      }
   });
   $( '#height_t' ).val('  '+ $( '#slider3' ).slider( 'value') );

   $('#slider4').slider({
      range: 'min',
      step: 1,
      min: 1,
      max: 500,
      value: 40,
      slide: function(event, ui) {
          var inputs = {};
          inputs.height_rmaxVal = ui.value;
          doModule_EMW_MP_01(inputs);
          $('#height_rmax').val( '  '+ ui.value );
      }
   });
   $( '#height_rmax' ).val('  '+ $( '#slider4' ).slider( 'value') );

//doModule_EMW_MP_01(inputs);

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
    doModule_EMW_MP_01(inputs);
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

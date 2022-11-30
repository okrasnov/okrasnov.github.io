var density = 0.2;
var mv = 5.;

var enterKeyHit = false;


var inputs = {};
$(document).ready(function() {
    doModule4_6(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.01,
      min:  0.09,
      max:  0.38,
      value: 0.2,
      slide: function(event, ui) {
          var inputs = {};
          inputs.densityVal = ui.value;
          doModule4_6(inputs);
          $('#density').val( '  '+ ui.value );
      }
   });
   $( '#density' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('#slider2').slider({
      range: 'min',
      step: 0.05,
      min: 1,
      max: 12,
      value: 5.,
      slide: function(event, ui) {
          var inputs = {};
          inputs.mvVal = ui.value;
          doModule4_6(inputs);
          $('#mv').val( '  '+ ui.value );
      }
   });
   $( '#mv' ).val('  '+ $( '#slider2' ).slider( 'value') );

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
    doModule4_6(inputs);
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

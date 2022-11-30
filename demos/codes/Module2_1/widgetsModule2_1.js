var a_x = 1.;
var a_y = 1.;
var delta = 90.;

var enterKeyHit = false;

var inputs = {};
$(document).ready(function() {
    doModule2_1(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.05,
      min: 0,
      max: 1,
      value: 1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.exVal = ui.value;
          doModule2_1(inputs);
          $('#ex').val( '  '+ ui.value );
      }
   });
   $( '#ex' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('#slider2').slider({
      range: 'min',
      step: 0.05,
      min: 0,
      max: 1,
      value: 1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.eyVal = ui.value;
          doModule2_1(inputs);
          $('#ey').val( '  '+ ui.value );
      }
   });
   $( '#ey' ).val('  '+ $( '#slider2' ).slider( 'value') );

   $('#slider3').slider({
      range: 'min',
      step: 1,
      min: -180,
      max: 180,
      value: 90,
      slide: function(event, ui) {
          var inputs = {};
          inputs.dphiVal = ui.value;
          doModule2_1(inputs);
          $('#dphi').val( '  '+ ui.value );
      }
   });
   $( '#dphi' ).val('  '+ $( '#slider3' ).slider( 'value') );

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
    doModule2_1(inputs);
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

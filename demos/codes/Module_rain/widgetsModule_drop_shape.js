var RD_diameter1 = 1;
var r0;
var quant="BC_model";
var n_size=9;
var enterKeyHit = false;


var inputs = {};
$(document).ready(function() {
    doModule_drop_shape(inputs);
    $('#RD_diameter').val(r0);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 1,
      min: 1,
      max: 15,
      value: 1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.RD_diameterVal = ui.value;
          doModule_drop_shape(inputs);
          //$('#RD_diameter').val( '  '+ ui.value );
          $('#RD_diameter').val(r0);
      }
   });
   $( '#RD_diameter' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('input[name="quant"]').change(function() {
       RD_diameter1 = 1;
       $('#slider1').slider({value: 1});
       inputs.quant = $('input[name="quant"]:checked').attr("value");
       doModule_drop_shape(inputs);
       $('#RD_diameter').val(r0);
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
    doModule_drop_shape(inputs);
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

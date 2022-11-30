var rain_intensity1 = 0.1;
var MP_LWC1=0.012;
var JD_LWC1=0.012;
var JT_LWC1=0.007;

var MP_Concentration1=1203;
var JD_Concentration1=3245;
var JT_Concentration1=287;

var enterKeyHit = false;


var inputs = {};
$(document).ready(function() {
    doModule_DSD(inputs);
    $('#MP_Concentration').val(MP_Concentration1);
    $('#JD_Concentration').val(JD_Concentration1);
    $('#JT_Concentration').val(JT_Concentration1);

    $('#MP_LWC').val(MP_LWC1);
    $('#JD_LWC').val(JD_LWC1);
    $('#JT_LWC').val(JT_LWC1);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.1,
      min: 0.1,
      max: 150,
      value: 0,
      slide: function(event, ui) {
          var inputs = {};
          inputs.rain_intensityVal = ui.value;
          doModule_DSD(inputs);
          $('#rain_intensity').val( '  '+ ui.value );
          $('#MP_Concentration').val(MP_Concentration1);
          $('#JD_Concentration').val(JD_Concentration1);
          $('#JT_Concentration').val(JT_Concentration1);

          $('#MP_LWC').val(MP_LWC1);
          $('#JD_LWC').val(JD_LWC1);
          $('#JT_LWC').val(JT_LWC1);
      }
   });
   $( '#rain_intensity' ).val('  '+ $( '#slider1' ).slider( 'value') );

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
    doModule_DSD(inputs);
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

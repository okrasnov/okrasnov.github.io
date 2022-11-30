var real_eps1 = 3.2;
var imag_eps1 = 0.05;
var real_eps2 = 60.0;
var imag_eps2 = 10.;
var freq = 1.;
var thickness=0.5;

var xaxis_choice="incidence";

var enterKeyHit = false;


var inputs = {};
$(document).ready(function() {
        doinit();
    doModule12_7(inputs);
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.1,
      min: 1,
      max: 100,
      value: 3.2,
      slide: function(event, ui) {
          var inputs = {};
          inputs.real_eps1Val = ui.value;
          doModule12_7(inputs);
          $('#real_eps1').val( '  '+ ui.value );
      }
   });
   $( '#real_eps1' ).val('  '+ $( '#slider1' ).slider( 'value') );

   $('#slider2').slider({
      range: 'min',
      step: 0.05,
      min: 0,
      max: 100,
      value: 0.05,
      slide: function(event, ui) {
          var inputs = {};
          inputs.imag_eps1Val = ui.value;
          doModule12_7(inputs);
          $('#imag_eps1').val( '  '+ ui.value );
      }
   });
   $( '#imag_eps1' ).val('  '+ $( '#slider2' ).slider( 'value') );






   $('#slider3').slider({
      range: 'min',
      step: 0.005,
      min: 0.001,
      max: 2.,
      value: 0.5,
      slide: function(event, ui) {
          var inputs = {};
          inputs.thicknessVal = ui.value;
          thickness = ui.value;
          doModule12_7(inputs);
          $('#thickness').val( '  '+ ui.value );
      }
   });
   $( '#thickness' ).val('  '+ $( '#slider3' ).slider( 'value') );





   $('#slider4').slider({
      range: 'min',
      step: 0.5,
      min: 0,
      max: 10,
      value: 1,
      slide: function(event, ui) {
          var inputs = {};
          inputs.freqVal = ui.value;
          freq = ui.value;
          doModule12_7(inputs);
          $('#freq').val( '  '+ ui.value );
      }
   });
   $( '#freq' ).val('  '+ $( '#slider4' ).slider( 'value') );








   $('#slider5').slider({
      range: 'min',
      step: 0.1,
      min: 1,
      max: 100,
      value: 60,
      slide: function(event, ui) {
          var inputs = {};
          inputs.real_eps2Val = ui.value;
          doModule12_7(inputs);
          $('#real_eps2').val( '  '+ ui.value );
      }
   });
   $( '#real_eps2' ).val('  '+ $( '#slider5' ).slider( 'value') );

   $('#slider6').slider({
      range: 'min',
      step: 0.05,
      min: 0,
      max: 100,
      value: 10.,
      slide: function(event, ui) {
          var inputs = {};
          inputs.imag_eps2Val = ui.value;
          doModule12_7(inputs);
          $('#imag_eps2').val( '  '+ ui.value );
      }
   });
   $( '#imag_eps2' ).val('  '+ $( '#slider6' ).slider( 'value') );



   $('input[name="xaxis"]').change(function() {
       inputs.xaxis_choice = $('input[name="xaxis"]:checked').attr("value");
       xaxis_choice = inputs.xaxis_choice;
       //alert("at a");
       newxaxis();
       //alert("at b");
       doModule12_7(inputs);
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
    if (entryName == "xaxis") {
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
    doModule12_7(inputs);
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
    document.getElementById('incidence').checked = true;
}

function newxaxis() {
    if(xaxis_choice == "incidence") {
        document.getElementById('xAxisLabel').innerHTML = "Incidence Angle (degrees)";
        document.getElementById('azscat').innerHTML = "&nbsp;Thickness (m):&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        $("#slider3").slider( "option","max",2.);
        $("#slider3").slider( "option","step",0.05);
        $("#thickness").val( ' 1.');
        
    } else {
        document.getElementById('xAxisLabel').innerHTML = "Thickness (m)";
        document.getElementById('azscat').innerHTML = "&nbsp;Incidence Angle (deg):&nbsp;&#8201;";
        $("#slider3").slider( "option","max",90.);
        $("#slider3").slider( "option","step",0.5);
        $("#thickness").val( ' 45.');
    }
}

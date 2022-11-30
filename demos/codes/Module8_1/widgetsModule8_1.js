var density = 10.;
var pressure = 1000.;
var temp=27.;

var quant="lofreq";

var enterKeyHit = false;

var d2=[];


var v=[  22.235080,   67.803960, 119.995940, 183.310091, 321.225644,
         325.152919, 336.222601, 380.197372, 390.134508, 437.346667,
         439.150812, 443.018295, 448.001075, 470.888947, 474.689127,
         488.491133, 503.568532, 504.482692, 547.676440, 552.020960,
         556.936002, 620.700807, 645.866155, 658.005280, 752.033227,
         841.053973, 859.962313, 899.306675, 902.616173, 906.207325,
         916.171582, 923.118427, 970.315022, 987.926764,1780.000000];

var b1=[    0.01130,    0.00012,    0.00008,    0.24200,    0.00483,
            0.14990,    0.00011,    1.15200,    0.00046,    0.00650,
            0.09218,    0.01976,    1.03200,    0.03297,    0.12620,
            0.02520,    0.00390,    0.00130,    0.97010,    1.47700,
            48.74000,   0.50120,    0.00713,    0.03022,   23.96000,
            0.00140,    0.01472,    0.00605,    0.00426,    0.01876,
            0.83400,    0.00869,    0.89720,   13.21000, 2230.00000];

var b2=[  2.143,  8.735,  8.356,  0.668,  6.181,
          1.540,  9.829,  1.048,  7.350,  5.050,
          3.596,  5.050,  1.405,  3.599,  2.381,
          2.853,  6.733,  6.733,  0.114,  0.114,
          0.159,  2.200,  8.580,  7.820,  0.396,
          8.180,  7.989,  7.917,  8.432,  5.111,
          1.442, 10.220,  1.920,  0.258,  0.952];

var b3=[   2.811,   2.858,   2.948,   3.050,   2.303,
           2.783,   2.693,   2.873,   2.152,   1.845,
           2.100,   1.860,   2.632,   2.152,   2.355,
           2.602,   1.612,   1.612,   2.600,   2.600,
           3.210,   2.438,   1.800,   3.210,   3.060,
           1.590,   3.060,   2.985,   2.865,   2.408,
           2.670,   2.900,   2.550,   2.985,  17.620];

var b4=[   4.80,   4.93,   4.78,   5.30,   4.69,
           4.85,   4.74,   5.38,   4.81,   4.23,
           4.29,   4.23,   4.84,   4.57,   4.65,
           5.04,   3.98,   4.01,   4.50,   4.50,
           4.11,   4.68,   4.00,   4.14,   4.09,
           5.76,   4.09,   4.53,   5.10,   4.70,
           4.78,   5.00,   4.94,   4.55,  30.50];

var b5=[0.69,0.69,0.70,0.64,0.67,
        0.68,0.69,0.54,0.63,0.60,
        0.63,0.60,0.66,0.66,0.65,
        0.69,0.61,0.61,0.70,0.70,
        0.69,0.71,0.60,0.69,0.68,
        0.33,0.68,0.68,0.70,0.70,
        0.70,0.70,0.64,0.68,2.00];

var b6=[  1.00, 0.82,  0.79,  0.85,  0.54,
          0.74, 0.61,  0.89,  0.55,  0.48,
          0.52, 0.50,  0.67,  0.65,  0.64,
          0.72, 0.43,  0.45,  1.00,  1.00,
          1.00, 0.68,  0.50,  1.00,  0.84,
          0.45, 0.84,  0.90,  0.95,  0.53,
          0.78, 0.80,  0.67,  0.90,  5.00];


function runit(){
        var send_string = "http://mrs.eecs.umich.edu/codes/Module8_1/mod8_1.cgi?density="+$("#density").val()+"&pressure="+$("#pressure").val()+"&temp="+$("#temp").val();

        var send_string2 = send_string.replace(/ /g,'');


        $.ajax({url:send_string2, dataType: 'html', success:function(result){
                    //alert(result);
                    parse_result(result);
                    doModule8_1(inputs);
                }// endfunc
            });
}


var inputs = {};
$(document).ready(function() {
        $("#density").val(density);
        $("#pressure").val(pressure);
        $("#temp").val(temp);
        runit();
});

$(function() {
   $('#slider1').slider({
      range: 'min',
      step: 0.05,
      min:  0.05,
      max:  15.0,
      value: 10.0,
      slide: function(event, ui) {
          var inputs = {};
          inputs.densityVal = ui.value;

          $('#density').val( '  '+ ui.value );
          runit();
      }
   });
   $( '#density' ).val('  '+ $( '#slider1' ).slider( 'value') );



   $('#slider2').slider({
      range: 'min',
      step: 0.05,
      min: 0.0,
      max: 1013.,
      value: 1000.,
      slide: function(event, ui) {
          var inputs = {};
          inputs.pressureVal = ui.value;

          $('#pressure').val( '  '+ ui.value );
          runit();
      }
   });
   $( '#pressure' ).val('  '+ $( '#slider2' ).slider( 'value') );



   $('#slider3').slider({
      range: 'min',
      step: 0.5,
      min: -100.0,
      max: 50.,
      value: 27.,
      slide: function(event, ui) {
          var inputs = {};
          inputs.tempVal = ui.value;

          $('#temp').val( '  '+ ui.value );
          runit();
      }
   });
   $( '#temp' ).val('  '+ $( '#slider3' ).slider( 'value') );




   $('input[name="quant"]').change(function() {
       inputs.quant = $('input[name="quant"]:checked').attr("value");
       runit();
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

function parse_result(result) {

    var words = String(result).split(" ");

    d2 = [];
    for (i=0;i<words.length;i+=2) {
        d2.push([ parseFloat(words[i]),parseFloat(words[i+1]) ]);
    }
}

function testAndSet(elem) {
    var entryName = elem.attr('name');
    if  (entryName == "quant") {
        runit();
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
    runit();
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

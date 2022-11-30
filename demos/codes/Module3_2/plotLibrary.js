
function doModule3_2(inputs) {

    var psi1=Math.Complex(0.,0.); // phase in radians.
    var psi2=Math.Complex(0.,0.); // phase in radians.
    var psi3=Math.Complex(0.,0.); // phase in radians.
    var psi4=Math.Complex(0.,0.); // phase in radians.
    var psi5=Math.Complex(0.,0.); // phase in radians.


    if (typeof inputs.amp1Val != 'undefined') {
        val1 = inputs.amp1Val;
    }
    if (typeof inputs.amp2Val != 'undefined') {
        val2 = inputs.amp2Val;
    }
    if (typeof inputs.amp3Val != 'undefined') {
        val3 = inputs.amp3Val;
    }
    if (typeof inputs.amp4Val != 'undefined') {
        val4 = inputs.amp4Val;
    }
    if (typeof inputs.amp5Val != 'undefined') {
        val5 = inputs.amp5Val;
    }
    if (typeof inputs.dVal != 'undefined') {
        d = inputs.dVal;
    }
    if (typeof inputs.deltaVal != 'undefined') {
        delta = inputs.deltaVal*Math.PI/180.;
        phz1=-2.*delta;
        phz2=-1.*delta;
        phz3=0.;
        phz4=1.*delta;
        phz5=2.*delta;

        psi1.im=phz1;
        psi2.im=phz2;
        psi3.im=phz3;
        psi4.im=phz4;
        psi5.im=phz5;
    }


    

    //document.getElementById('plotTitle').innerHTML = "a0";

    var d1=[];
    var d2 =[];
    var d3 = [];
    var theta;

    var fact=Math.Complex(0.,0.);
    var thisfact=Math.Complex(0.,0.);
    var Fa=Math.Complex(0.,0.);
    var Factor;

    var F=[];

    //document.getElementById('plotTitle').innerHTML = "a1";


    amp1 = val1;
    amp2 = val2;
    amp3 = val3;
    amp4 = val4;
    amp5 = val5;

    //document.getElementById('plotTitle').innerHTML = "a20, amp3="+amp3.toString()+" phz3="+phz3.toString();


    //document.getElementById('plotTitle').innerHTML = "a21";

    //document.getElementById('plotTitle').innerHTML = "psi1="+psi1.re.toString()+" +i "+psi1.im.toString();
    //document.getElementById('plotTitle').innerHTML = "phz1="+phz1.toString();



    var themax;
    var incr=2;
    for (var i = -180; i <= 180; i += incr) {
        theta =1.*i*Math.PI/180.;
        fact.im = 2.*Math.PI*d*Math.cos(theta);

        thisfact = fact;
        Fa = psi1.exp().mul(thisfact.exp()).mul(amp1);
        //document.getElementById('plotTitle').innerHTML = "Fa="+Fa.re.toString()+" +i "+Fa.im.toString()+".  exp(psi1)="+psi1.exp().re.toString()+" +i "+psi1.exp().im.toString()+".  exp(thisfact)="+thisfact.exp().re.toString()+" +i "+thisfact.exp().im.toString();

        thisfact = fact.mul(2.);
        Fa = Fa.add(psi2.exp().mul(thisfact.exp()).mul(amp2));
        thisfact = fact.mul(3.);
        Fa = Fa.add(psi3.exp().mul(thisfact.exp()).mul(amp3));
        thisfact = fact.mul(4.);
        Fa = Fa.add(psi4.exp().mul(thisfact.exp()).mul(amp4));
        thisfact = fact.mul(5.);
        Fa = Fa.add(psi5.exp().mul(thisfact.exp()).mul(amp5));

        Factor = Fa.norm(); //cabs^2
        if(i==-180) {
            themax=Factor;
        } else {
            if(Factor > themax) themax=Factor;
        }// endif
        F.push(Factor);
        //d3.push([i,Factor]);
    }// endfor

    //document.getElementById('plotTitle').innerHTML = "a3";


    //document.getElementById('plotTitle').innerHTML = "F[0]="+F[0].toString()+", F[75]="+F[75].toString();


    for (var i = -180; i <= 180; i += incr) {
        Factor = 10.*Math.log(F[(i+180)/incr]/themax)/Math.LN10;
        d2.push([i,Factor]);

    }// endfor


    var data_v = {
        color: "rgb(123, 100, 255)",
        data: d2
    };

    var data_h = {
        color: "rgb(255, 10, 13)",
         label: "<b>h Polarization</b>",
        data: d3
    };



    // create the plot:
    var options = {
        xaxis: { min: -180, max: 180, tickFormatter: xAxisLabeller, tickSize: 45. },
        yaxis: { min: -30, max: 0.,
                 tickFormatter: yAxisLabeller },
    };
    


    //document.getElementById('plotTitle').innerHTML = "a4";


    $.plot($("#plotModule3_2"), [ d1, data_v, d3 ], options);



}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(0) + "</span>";
}

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val.toFixed(0) + "</span>";
}


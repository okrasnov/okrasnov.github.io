
function doModule2_3(inputs) {

    if (typeof inputs.real_eps1Val != 'undefined') {
        real_eps1 = inputs.real_eps1Val;
    }
    if (typeof inputs.imag_eps1Val != 'undefined') {
        imag_eps1 = -inputs.imag_eps1Val;
    }
    if (typeof inputs.real_eps2Val != 'undefined') {
        real_eps2 = inputs.real_eps2Val;
    }
    if (typeof inputs.imag_eps2Val != 'undefined') {
        imag_eps2 = -inputs.imag_eps2Val;
    }
    if (typeof inputs.quant != 'undefined') {
        quant = inputs.quant;
    }

    

    var d1=[];
    var d2 =[];
    var d3 = [];
    var theta, h, v;
    var eps1=[];
    var eps2=[];

    var rhov=[];
    var rhoh=[];

    var tauh=[];
    var tauv=[];

    var sin_theta2=[];
    var cos_theta2=[];
    var one=[];

    one[0]=1.0;
    one[1]=0.0;

    eps1[0] = real_eps1;
    eps1[1] = imag_eps1;
    eps2[0] = real_eps2;
    eps2[1] = imag_eps2;
    
    var j;
    

    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    if ( quant == "reflection_coeff"){
        document.getElementById('plotTitle').innerHTML = "Reflection Coefficient";
        document.getElementById('yAxisLabel').innerHTML = "Reflection Coefficient Magnitude";
        
        for (var i = 0; i <= 180; i += 1) {
            j = 0.5*i;
            theta1 = j*Math.PI/180.;

            sin_theta2 = crmult(cdiv(csqrt(eps1), csqrt(eps2)) , Math.sin(theta1));
            cos_theta2 = csqrt(csub(one,cmult( sin_theta2,sin_theta2)));

            rhoh = csub(crmult(csqrt(eps1),Math.cos(theta1)), cmult(cos_theta2,csqrt(eps2)));
            rhoh = cdiv(rhoh , cadd(crmult(csqrt(eps1),Math.cos(theta1)) , cmult(csqrt(eps2),cos_theta2)));

            rhov = csub(cmult(csqrt(eps1),cos_theta2), crmult(csqrt(eps2),Math.cos(theta1)));
            rhov = cdiv(rhov, cadd(cmult(csqrt(eps1),cos_theta2) , crmult(csqrt(eps2),Math.cos(theta1)) ));

            h = cabs(rhoh);
            v = cabs(rhov);

            d2.push([j, v]);
            d3.push([j, h]);

        }

    } else if (quant == "reflectivity"){
        document.getElementById('plotTitle').innerHTML = "Reflectivity";
        document.getElementById('yAxisLabel').innerHTML = "Reflectivity";
        
        for (var i = 0; i <= 180; i += 1) {
            j= 0.5*i;
            theta1 = j*Math.PI/180.;
    
            sin_theta2 = crmult(cdiv(csqrt(eps1), csqrt(eps2)) , Math.sin(theta1));
            cos_theta2 = csqrt(csub(one,cmult( sin_theta2,sin_theta2)));

            rhoh = csub(crmult(csqrt(eps1),Math.cos(theta1)), cmult(cos_theta2,csqrt(eps2)));
            rhoh = cdiv(rhoh , cadd(crmult(csqrt(eps1),Math.cos(theta1)) , cmult(csqrt(eps2),cos_theta2)));

            rhov = csub(cmult(csqrt(eps1),cos_theta2), crmult(csqrt(eps2),Math.cos(theta1)));
            rhov = cdiv(rhov, cadd(cmult(csqrt(eps1),cos_theta2) , crmult(csqrt(eps2),Math.cos(theta1)) ));

            h = cabs_sqrd(rhoh);
            v = cabs_sqrd(rhov);
            
            d2.push([j, v]);
            d3.push([j, h]);
        }

    } else if (quant == "transmission_coeff"){
        document.getElementById('plotTitle').innerHTML = "Transmission Coefficient";
        document.getElementById('yAxisLabel').innerHTML = "Transmission Coefficient Magnitude";
        
        for (var i = 0; i <= 180; i += 1) {
            j=0.5*i;
            theta1 = j*Math.PI/180.;

    
            sin_theta2 = crmult(cdiv(csqrt(eps1), csqrt(eps2)) , Math.sin(theta1));
            cos_theta2 = csqrt(csub(one,cmult( sin_theta2,sin_theta2)));

            rhoh = csub(crmult(csqrt(eps1),Math.cos(theta1)), cmult(cos_theta2,csqrt(eps2)));
            rhoh = cdiv(rhoh , cadd(crmult(csqrt(eps1),Math.cos(theta1)) , cmult(csqrt(eps2),cos_theta2)));

            rhov = csub(cmult(csqrt(eps1),cos_theta2), crmult(csqrt(eps2),Math.cos(theta1)));
            rhov = cdiv(rhov, cadd(cmult(csqrt(eps1),cos_theta2) , crmult(csqrt(eps2),Math.cos(theta1)) ));

            tauh = cadd(one,rhoh);
            tauv = crmult(cdiv(cadd(one , rhov),cos_theta2),Math.cos(theta1));

            h = cabs(tauh);
            v = cabs(tauv);
            
            d2.push([j, v]);
            d3.push([j, h]);
        }

    } else if (quant == "transmissivity"){
        document.getElementById('plotTitle').innerHTML = "Transmissivity";
        document.getElementById('yAxisLabel').innerHTML = "Transmissivity";
        
        for (var i = 0; i <= 180; i += 1) {
            j=0.5*i;
            theta1 = j*Math.PI/180.;

            sin_theta2 = crmult(cdiv(csqrt(eps1), csqrt(eps2)) , Math.sin(theta1));
            cos_theta2 = csqrt(csub(one,cmult( sin_theta2,sin_theta2)));

            rhoh = csub(crmult(csqrt(eps1),Math.cos(theta1)), cmult(cos_theta2,csqrt(eps2)));
            rhoh = cdiv(rhoh , cadd(crmult(csqrt(eps1),Math.cos(theta1)) , cmult(csqrt(eps2),cos_theta2)));

            rhov = csub(cmult(csqrt(eps1),cos_theta2), crmult(csqrt(eps2),Math.cos(theta1)));
            rhov = cdiv(rhov, cadd(cmult(csqrt(eps1),cos_theta2) , crmult(csqrt(eps2),Math.cos(theta1)) ));

            h = 1.-cabs_sqrd(rhoh);
            v = 1.-cabs_sqrd(rhov);
            
            d2.push([j, v]);
            d3.push([j, h]);
        }

    }


    var data_v = {
        color: "rgb(123, 100, 255)",
        label: "<b>v Polarization</b>",
        data: d2
    };

    var data_h = {
        color: "rgb(255, 10, 13)",
         label: "<b>h Polarization</b>",
        data: d3
    };

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 90, tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 1.18,
                 tickFormatter: yAxisLabeller },
        legend: {
            show: true,
            position: "nw"
        }

    };
    
    $.plot($("#plotModule2_3"), [ d1, data_v, data_h ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(1) + "</span>";
}

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val + "</span>";
}


function csqrt(a){
    var r, theta, rootr;

    var result = new Array();
    
    r = Math.sqrt(a[0]*a[0] + a[1]*a[1]);
    theta = Math.atan2(a[1],a[0]);
    rootr = Math.sqrt(r);

    result[0] = rootr*Math.cos(0.5*theta);
    result[1] = rootr*Math.sin(0.5*theta);
    return result;

}

function cdiv(a,b){
    var result = new Array();

    var c=[];
    c[0]=b[0];
    c[1]=-b[1];
    
    var d=[];
    d=cmult(a,c);

    var denom;
    denom = b[0]*b[0] + b[1]*b[1];

    result[0] = d[0]/denom;
    result[1] = d[1]/denom;
    return result;
}

function cmult(a,b){
    var result = new Array();
    result[0] = a[0]*b[0] - a[1]*b[1];
    result[1] = a[1]*b[0] + a[0]*b[1];
    return result;
}

function crmult(a,b){
    var result = new Array();
    result[0] = a[0]*b;
    result[1] = a[1]*b;
    return result;
}

function cadd(a,b){
    var result = new Array();
    result[0] = a[0]+b[0];
    result[1] = a[1]+b[1];
    return result;
}

function csub(a,b){
    var result = new Array();
    result[0] = a[0]-b[0];
    result[1] = a[1]-b[1];
    return result;
}

function cabs_sqrd(a){
    return a[0]*a[0] + a[1]*a[1];
}

function cabs(a){
    return Math.sqrt(a[0]*a[0] + a[1]*a[1]);
}

function doModule8_1(inputs) {
    var d1=[];
    var d3=[];

    if (typeof inputs.quant != 'undefined') {
        quant = inputs.quant;
    }


    var data_r = {
        color: "rgb(123, 100, 255)",
        data: d2
    };

    var data_i = {
        color: "rgb(255, 10, 13)",
        data: d3
    };

    //document.getElementById('plotTitle').innerHTML = "<br/>ymin="+ymin+",  ymax="+ymax;
 

    // create the plot:
    var options = {
        xaxis: { min: 1., max: 1000.,
                 ticks: [1.,2.,5.,10.,20.,50.,100.,200.,500.,1000.],
                 transform: function (v) { return Math.log(v)/Math.LN10; },
                 inverseTransform: function (v) { return Math.exp(v)*Math.LN10; }
               },
        yaxis: { //min: 1.e-5, max: 100., 
                 min: ymin, max: ymax,
                 tickFormatter: yAxisLabeller,
                 ticks: thetics, //[1.e-5, 1.e-4, 1.e-3, 1.e-2, 1.e-1, 1., 10., 100.],
                 transform: function (v) { return Math.log(v)/Math.LN10; },
                 inverseTransform: function (v) { return Math.exp(v)*Math.LN10; }
                },
        legend: {
            show: true,
            position: "nw"
        }

    };

    //alert(d2);






    if( quant=="lofreq"){

    var tuple;
    // find min/max
    var ymin, ymax, y;
    tuple = d2[0];
    ymin=tuple[1];
    ymax = ymin;
    for (var i = 0; i < 10; i += 1) {
        tuple = d2[i];
        y = tuple[1];
        if(y<ymin) ymin=y;
        if(y>ymax) ymax=y;
    }
    if(ymin<1.e-5) ymin=1.e-5;
    var theminpow = Math.floor(Math.log(ymin)/Math.LN10);
    ymin = Math.pow(10.,theminpow);
    var themaxpow = Math.ceil(Math.log(ymax)/Math.LN10);
    ymax = Math.pow(10.,themaxpow);
    var thetics = new Array();
    var ntics = themaxpow - theminpow+1;
    for(var i=0;i<ntics;i += 1) {
        thetics[i] = Math.pow(10.,theminpow+i);
    }


    var options = {
        xaxis: { min: 0., max: 10.
               },
        yaxis: { min: ymin, max: ymax, //min: 1.e-5, max: 0.1, 
                 tickFormatter: yAxisLabeller,
                 ticks: thetics, //[1.e-5, 1.e-4, 1.e-3, 1.e-2, 1.e-1],
                 transform: function (v) { return Math.log(v)/Math.LN10; },
                 inverseTransform: function (v) { return Math.exp(v)*Math.LN10; }
                },
        legend: {
            show: true,
            position: "nw"
        }

    };
    } else if (quant == "midfreq") {

    var tuple;
    // find min/max
    var ymin, ymax, y;
    tuple = d2[10];
    ymin=tuple[1];
    ymax = ymin;
    for (var i =10; i < 100; i += 1) {
        tuple = d2[i];
        y = tuple[1];
        if(y<ymin) ymin=y;
        if(y>ymax) ymax=y;
    }
    if(ymin<1.e-5) ymin=1.e-5;
    var theminpow = Math.floor(Math.log(ymin)/Math.LN10);
    ymin = Math.pow(10.,theminpow);
    var themaxpow = Math.ceil(Math.log(ymax)/Math.LN10);
    ymax = Math.pow(10.,themaxpow);
    var thetics = new Array();
    var ntics = themaxpow - theminpow+1;
    for(var i=0;i<ntics;i += 1) {
        thetics[i] = Math.pow(10.,theminpow+i);
    }


    var options = {
        xaxis: { min: 10., max: 100.
               },
        yaxis: { min: ymin, max: ymax, //min: 1.e-4, max: 10., 
                 tickFormatter: yAxisLabeller,
                 ticks: thetics, //[1.e-4, 1.e-3, 1.e-2, 1.e-1, 1., 10.],
                 transform: function (v) { return Math.log(v)/Math.LN10; },
                 inverseTransform: function (v) { return Math.exp(v)*Math.LN10; }
                },
        legend: {
            show: true,
            position: "nw"
        }

    };
    } else if (quant == "hifreq") {

    var tuple;
    // find min/max
    var ymin, ymax, y;
    tuple = d2[100];
    ymin=tuple[1];
    ymax = ymin;
    for (var i = 100; i < 1000; i += 1) {
        tuple = d2[i];
        y = tuple[1];
        if(y<ymin) ymin=y;
        if(y>ymax) ymax=y;
    }
    if(ymin<1.e-5) ymin=1.e-5;
    var theminpow = Math.floor(Math.log(ymin)/Math.LN10);
    ymin = Math.pow(10.,theminpow);
    var themaxpow = Math.ceil(Math.log(ymax)/Math.LN10);
    ymax = Math.pow(10.,themaxpow);
    var thetics = new Array();
    var ntics = themaxpow - theminpow+1;
    for(var i=0;i<ntics;i += 1) {
        thetics[i] = Math.pow(10.,theminpow+i);
    }

    var options = {
        xaxis: { min: 100., max: 1000.
               },
        yaxis: { min: ymin, max: ymax, //min: 1.e-1, max: 10000., 
                 tickFormatter: yAxisLabeller,
                 ticks: thetics, //[1.e-1, 1., 10., 100., 1000., 10000.],
                 transform: function (v) { return Math.log(v)/Math.LN10; },
                 inverseTransform: function (v) { return Math.exp(v)*Math.LN10; }
                },
        legend: {
            show: true,
            position: "nw"
        }

    };
    } // endif





    
    $.plot($("#plotModule8_1"), [ d1, data_r, data_i ], options);

}

function doModule8_1OLD(inputs) {

    if (typeof inputs.densityVal != 'undefined') {
        density = inputs.densityVal;
    }
    if (typeof inputs.pressureVal != 'undefined') {
        pressure = inputs.pressureVal +1.e-5;
    }
    if (typeof inputs.tempVal != 'undefined') {
        temp = inputs.tempVal;
    }

    var d1=[];
    var d2 =[];
    var d3 = [];
    
    var f_hz;

    var rho_0, T, P;

    rho_0 = density;
    T = temp + 273.15; // transform temperature to degrees Kelvin
    P = pressure;


    //Calculate values of computed inputs
    var theta, e, Pd, ks, kf;
    theta = 300./T;
    e=rho_0/(0.7223*theta);
    Pd= P - e;
    ks=0.444*Math.pow(theta,7.5);
    kf=0.0145*Math.pow(theta,4.5);

    var Nc2, delta, gamma;

    var aa=Math.Complex(0.,0.);
    var bb=Math.Complex(0.,0.);
    var one=Math.Complex(1.,0.);
    var F=Math.Complex(0.,0.);
    var Sl;
    var term;
    var Nv2;
    var kappa;

    for (var i = 0; i <= 1000; i += 1) {

        freq_ghz = 1.*i;

        Nc2 = e*(ks*e+kf*Pd)*(1.0e-6)*freq_ghz;

        delta = 0;
    
        term=0.;
        for( var j=0; j<34; j += 1 ){
            gamma = b3[j]*(1.0e-3)*( b4[j]*e*Math.pow(theta,b6[j]) + Pd*Math.pow(theta,b5[j]));
    
            aa.re = v[j] - freq_ghz;
            aa.im = -gamma;
            bb.re = v[j] + freq_ghz;
            bb.im = gamma;
            F = ( (one.div(aa)).sub(one.div(bb)) ).mul(freq_ghz);
            Sl = (b1[j]/v[j])*e*Math.pow(theta,3.5)*Math.exp(b2[j]*(1.-theta));
            term = term + F.mul(Sl).im;
        }
        Nv2 = term + Nc2;
        kappa =  0.182*freq_ghz*Nv2;

        d2.push([freq_ghz,kappa]);
    }

    var data_r = {
        color: "rgb(123, 100, 255)",
        data: d2
    };

    var data_i = {
        color: "rgb(255, 10, 13)",
        data: d3
    };



    //xaxis: { min: 1., max: 1000., tickFormatter: xAxisLabeller,
    //             tics: [1.,5.,10.,50.,100.,500.,1000.],
    //             transform: function (v) { return Math.log(v)/Math.LN10; },
    //             inverseTransform: function (v) { return Math.exp(v)*Math.LN10; }
    //           },
    //    yaxis: { min: 1.e-5, max: 100.,
    //             tickFormatter: yAxisLabeller,
    //             tics: [1.e-5, 1.e-4, 1.e-3, 1.e-2, 1.e-1, 1., 10., 100.],
    //             transform: function (v) { return Math.log(v)/Math.LN10; },
    //             inverseTransform: function (v) { return Math.exp(v)*Math.LN10; }
    //            },


    // create the plot:
    var options = {
        xaxis: { min: 1., max: 1000.,
                 ticks: [1.,2.,5.,10.,20.,50.,100.,200.,500.,1000.],
                 transform: function (v) { return Math.log(v)/Math.LN10; },
                 inverseTransform: function (v) { return Math.exp(v)*Math.LN10; }
               },
        yaxis: { min: 1.e-5, max: 100., tickFormatter: yAxisLabeller,
                 ticks: [1.e-5, 1.e-4, 1.e-3, 1.e-2, 1.e-1, 1., 10., 100.],
                 transform: function (v) { return Math.log(v)/Math.LN10; },
                 inverseTransform: function (v) { return Math.exp(v)*Math.LN10; }
                },
        legend: {
            show: true,
            position: "nw"
        }

    };

    
    $.plot($("#plotModule8_1"), [ d1, data_r, data_i ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toExponential() + "</span>";
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


function doModule2_2(inputs) {


    if (typeof inputs.epsrVal != 'undefined') {
        real_eps = inputs.epsrVal;
    }
    if (typeof inputs.epsiVal != 'undefined') {
        imag_eps = inputs.epsiVal;
    }
    if (typeof inputs.quant != 'undefined') {
        quant = inputs.quant;
    }
    if (typeof inputs.range != 'undefined') {
        range = inputs.range;
    }

    

    var d1=[];
    var d2 =[];
    var d3 = [];

    var one=[];

    one[0]=1.0;
    one[1]=0.0;

    var lambda0;

    var eps=[];
    var epsr, epsi;
    epsr = real_eps;
    epsi = imag_eps;

    eps[0] = real_eps;
    eps[1] = imag_eps;


    var alpha, beta, eta=[], phi;
    var acmplx = [];
    var mag_eta;

    var a1, b1;
    var ymax;

    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    if ( quant == "alpha"){
        document.getElementById('plotTitle').innerHTML = "Attenuation Coefficient";
        document.getElementById('yAxisLabel').innerHTML = "Attenuation Coefficient (Np/m)";
        
        for (var i = 1; i <= 100; i += 1) {
            
            freq_ghz=0.3*i;
            lambda0 = 2.99e8/(freq_ghz*1.e9);


            //alpha = (2.*Math.PI/lamda0 )*Math.sqrt( 0.5* epsr* (Math.sqrt(1. + (epsi/epsr)*(epsi/epsr)) - 1.));
            alpha = 2.*Math.PI/lambda0;
            
            
            a1 = Math.sqrt(1. + (epsi/epsr)*(epsi/epsr));
            
            
            b1 = 0.5*epsr*(a1-1.);
            
            
            alpha = alpha * Math.sqrt(b1);
            
            
            d2.push([freq_ghz, alpha]);
            
        }
        ymax =5000.;
        
    } else if (quant == "beta"){
        document.getElementById('plotTitle').innerHTML = "Phase Coefficient";
        document.getElementById('yAxisLabel').innerHTML = "Phase Coefficient (rad/m)";
        
        for (var i = 1; i <= 100; i += 1) {

            freq_ghz=0.3*i;
            lambda0 = 2.99e8/(freq_ghz*1.e9);
            //beta = 2*pi./lmda0 .*( 0.5 *epsr* (sqrt(1 + (epsi/epsr).^2) + 1)).^0.5;
            beta = 2.*Math.PI/lambda0;
            a1 = Math.sqrt(1. + (epsi/epsr)*(epsi/epsr));
            b1 = 0.5*epsr*(a1+1.);
            beta = beta * Math.sqrt(b1);
 
            //beta = (2.*Math.PI/lambda0)*Math.sqrt( 0.5 *epsr* (Math.sqrt(1. + (epsi/epsr)*(epsi/epsr)) + 1.));

            d2.push([freq_ghz, beta]);

        }
        ymax=7000.;

    } else if (quant == "eta"){
        document.getElementById('plotTitle').innerHTML = "Magnitude of Intrinsic Impedance";
        document.getElementById('yAxisLabel').innerHTML = "Magnitude of Intrinsic Impedance (Ohms)";
        
            acmplx[0] = 1.;
            acmplx[1] = -epsi/epsr;

            eta = cdiv(one,csqrt(acmplx));

            mag_eta = (377./Math.sqrt(epsr))*cabs(eta);


        for (var i = 1; i <= 100; i += 1) {

            //eta = 377./Math.sqrt(epsr) .*(1- 1i*epsi./epsr).^(-1/2);
            

            freq_ghz=0.3*i;
            lambda0 = 2.99e8/(freq_ghz*1.e9);


            d2.push([freq_ghz, mag_eta]);

        }
        ymax =400.;

    } else if (quant == "phi"){
        document.getElementById('plotTitle').innerHTML = "Phase angle of Intrinsic Impedance";
        document.getElementById('yAxisLabel').innerHTML = "Phase angle of Intrinsic Impedance (degrees)";
        
            acmplx[0] = 1.;
            acmplx[1] = -epsi/epsr;
            eta = cdiv(one,csqrt(acmplx));

            phi = (180./Math.PI)*Math.atan2(eta[1],eta[0]);

        for (var i = 1; i <= 100; i += 1) {

            //eta = 377./Math.sqrt(epsr) .*(1- 1i*epsi./epsr).^(-1/2);
        
            freq_ghz=0.3*i;
            lambda0 = 2.99e8/(freq_ghz*1.e9);
    

            d2.push([freq_ghz, phi]);
         }
        ymax =50.;

    }

    var data_v = {
        color: "rgb(123, 100, 255)",
        data: d2
    };

    var xmin, xmax;
    if(range=="low"){
        xmin =0.;
        xmax=10.;
    } else if (range=="med"){
        xmin=10.;
        xmax=20.;
    } else if (range=="hi"){
        xmin=20.;
        xmax=30.;
    }


    var options = {
        xaxis: { min: xmin, max: xmax, tickFormatter: xAxisLabeller },
        //yaxis: { min: 0, max: ymax,
        //         tickFormatter: yAxisLabeller }
    };


    
    $.plot($("#Module2_2"), [ d1, data_v, d3 ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(0) + "</span>";
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

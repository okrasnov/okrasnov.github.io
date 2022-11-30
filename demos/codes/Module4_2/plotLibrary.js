
function doModule4_2(inputs) {

    if (typeof inputs.temp1Val != 'undefined') {
        temp1 = inputs.temp1Val;
    }
    if (typeof inputs.salinityVal != 'undefined') {
        salinity = inputs.salinityVal;
    }

    var d1=[];
    var d2 =[];
    var d3 = [];
    
    var freq_ghz;

    var epsS;
    var epsOne;
    var tau1;
    var tau2;
    var epsInf;

    var t;
    var S;

    t=temp1;
    S=salinity;

    var b1=[];
    var b2=[];
    var one=[];
    one[0]=1.;
    one[1]=0.;

    var eps=[];
    var epsi, epsr;

    
    //document.getElementById('plotTitle').innerHTML = "a1";


    //Conductvity
    var A = [2.903602, 8.607e-2, 4.738817e-4, -2.991e-6, 4.3041e-9];
    var sig35 = A[0] + A[1]*t + A[2]*t*t + A[3]*t*t*t + A[4]*t*t*t*t;

    var A = [37.5109, 5.45216, 0.014409, 1004.75, 182.283];
    var P = S * ((A[0] + A[1]*S + A[2]*S*S) / (A[3] + A[4]*S + S*S));

    var A = [6.9431, 3.2841, -0.099486, 84.85, 69.024];
    var alpha0 = (A[0] + A[1]*S + A[2]*S*S) / (A[3] + A[4]*S + S*S);

    var A = [49.843, -0.2276, 0.00198];
    var alpha1 = A[0] + A[1]*S + A[2]*S*S;

    var Q = 1. + ((alpha0*(t-15))/(t+alpha1));

    var sigma = sig35*P*Q;


    //%Other Model Paramaters
    a=[0.46606917e-2, -0.26087876e-4, -0.63926782e-5, 0.63000075e1, 0.26242021e-2, -0.42984155e-2, 0.34414691e-4, 0.17667420e-3, -0.20491560e-6, 0.58366888e3, 0.12634992e3, 0.69227972e-4,  0.38957681e-6, 0.30742330e3, 0.12634992e3, 0.37245044e1, 0.92609781e-2, -0.26093754e-1];


     
    for (var i = 0; i <= 50; i += 1) {

        freq_ghz = 1.*i+0.1;;



        epsS = 87.85306*Math.exp(-0.00456992*t - a[0]*S - a[1]*S*S - a[2]*S*t);
        epsOne = a[3]*Math.exp(-a[4]*t-a[5]*S-a[6]*S*t);
        tau1 = (a[7]+a[8]*S)*Math.exp(a[9]/(t+a[10]));
        tau2 = (a[11]+a[12]*S)*Math.exp(a[13]/(t+a[14]));
        epsInf = a[15] + a[16]*t + a[17]*S;

        b1[0]=1.;
        b1[1]=-2.*Math.PI*freq_ghz*tau1;
        b2[0]=1.;
        b2[1]=-2.*Math.PI*freq_ghz*tau2;



        //Permitivity Calculation
        //eps = ((epsS-epsOne)./(1-1i*2*pi.*f.*tau1)) + ((epsOne-epsInf)./(1-1i*2*pi.*f.*tau2)) + (epsInf) + 1i*((17.9751*sigma)./f);
        eps = crmult(cdiv(one,b1),epsS-epsOne);
        eps = cadd(eps, crmult(cdiv(one,b2),epsOne-epsInf));
        eps[0] = eps[0] + epsInf; 
        eps[1] = eps[1] + (17.9751*sigma)/freq_ghz;

        epsr = eps[0];
        epsi = eps[1];


            d2.push([freq_ghz, epsr]);
            d3.push([freq_ghz, epsi]);

        }


    var data_r = {
        color: "rgb(123, 100, 255)",
        label: "<b>Real Part</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;",
        data: d2
    };

    var data_i = {
        color: "rgb(255, 10, 13)",
        label: "<b>Imaginary Part</b>",
        data: d3
    };

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 50, 
                 ticks: [0.1,5,10,15,20,25,30,35,40,45,50],
                 tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 118,
                 tickFormatter: yAxisLabeller },
        legend: {
            show: true,
            position: "nw"
        }

    };


    
    $.plot($("#plotModule4_2"), [ d1, data_r, data_i ], options);

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

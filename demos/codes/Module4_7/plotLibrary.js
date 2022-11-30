
function doModule4_7(inputs) {

    if (typeof inputs.densityVal != 'undefined') {
        density = inputs.densityVal;
    }
    if (typeof inputs.mvVal != 'undefined') {
        mv = inputs.mvVal;
    }
    if (typeof inputs.tempVal != 'undefined') {
        temp = inputs.tempVal;
    }
    if (typeof inputs.sandVal != 'undefined') {
        sand = inputs.sandVal;
    }
    if (typeof inputs.siltVal != 'undefined') {
        silt = inputs.siltVal;
    }
    if (typeof inputs.clayVal != 'undefined') {
        clay = inputs.clayVal;
    }
    if (typeof inputs.xrange != 'undefined') {
        xrange = inputs.xrange;
    }

    var d1=[];
    var d2 =[];
    var d3 = [];
    
    var f_hz;
    var epsr, epsi;
    var rho_b;


    rho_b = density;

    var beta1, beta2, alpha;
    var eps0;

    var S, C;
    S = 0.01*sand;
    C = 0.01*clay;

    beta1 = 1.27 - 0.519 * S - 0.152* C;   //eq: 4.68b
    beta2 = 2.06 - 0.928 * S - 0.255 * C;  //eq: 44.68c 
    alpha = 0.65; // eq: 4.68a
    eps_0 = 8.854e-12; 

    var sigma_s, sigma_s_high, sigma_s_low;

    sigma_s_high = -1.645 + 1.939 * rho_b - 2.256*S + 1.594 * C; //eq: 4.68d
    sigma_s_low = 0.0467 + 0.22 * rho_b - 0.411*S + 0.661 *C; //eq: 4.70

    // Dielectric Constant of Pure Water
    var ew_inf;
    var ew_0;
    var tau_w;
    var epsrW, epsiW;
    var aa;

    ew_inf = 4.9; // eq: E.15
    ew_0 = 88.045 - 0.4147 * temp + 6.295e-4 * temp*temp + 1.075e-5 * temp*temp*temp;
    tau_w = (1.1109e-10 - 3.824e-12*temp +6.938e-14*temp*temp - 5.096e-16*temp*temp*temp)/(2.*Math.PI);


    //document.getElementById('plotTitle').innerHTML = "ssc="+sand.toString()+", "+silt.toString()+", "+clay.toString();

    var epsS;
    var epsOne=[];
    var tau1=[];
    var tau2=[];
    var epsInf =[];

    var t;

    t=temp;

    var b1=[];
    var b2=[];
    var one=[];
    one[0]=1.;
    one[1]=0.;

    var eps=[];
    var epsi, epsr;


    var a=[0.63000075e1, 0.26242021e-2, 0.17667420e-3, 0.58366888e3, 0.12634992e3,  0.69227972e-4, 0.30742330e3, 0.12634992e3, 0.37245044e1, 0.92609781e-2];


    for (var i = 0; i <= 1000; i += 1) {

        freq_ghz = 0.02*i  +0.301;

        if (Math.abs(freq_ghz-1.3) < 0.01) {
            freq_ghz=1.2999;
        }

        f_hz = freq_ghz * 1.e9;
        if (f_hz > 1.3e9){
            sigma_s = sigma_s_high;
        } else if (f_hz > 0.3e9) {
            sigma_s = sigma_s_low;
        } else {
            sigma_s = 0.;
        } // endif

        // dielectric constant of water:
        aa = 2.*Math.PI*f_hz*tau_w;
        epsrW = ew_inf + (ew_0-ew_inf)/(1. + aa*aa);
        epsiW = 2.*Math.PI*tau_w*f_hz *(ew_0-ew_inf)/(1. + aa*aa) +  ((2.65-rho_b)/(2.65*mv)) * sigma_s/(2*Math.PI*eps_0*f_hz);

        // old way to do eps-water: from Module4.1
        epsS = 87.85306*Math.exp(-0.00456992*t);
        epsOne = a[0]*Math.exp(-a[1]*t);
        tau1 = a[2]*Math.exp(a[3]/(t+a[4]));
        tau2 = a[5]*Math.exp(a[6]/(t+a[7]));
        epsInf = a[8] + a[9]*t;
        b1[0]=1.;
        b1[1]=-2.*Math.PI*freq_ghz*tau1;
        b2[0]=1.;
        b2[1]=-2.*Math.PI*freq_ghz*tau2;
        //Permitivity Calculation
        //eps = ((epsS-epsOne)./(1-j*2*pi.*f.*tau1)) + ((epsOne-epsInf)./(1-j*2*pi.*f.*tau2)) + (epsInf);
        eps = crmult(cdiv(one,b1),epsS-epsOne);
        eps = cadd(eps, crmult(cdiv(one,b2),epsOne-epsInf));
        eps[0] = eps[0] + epsInf; 
        epsrWnew = eps[0];
        epsiWnew = eps[1];

        // dielectric constant of soil using eq. 4.66a nad 4.66b 
        epsr = Math.pow(1.+ 0.66*rho_b + Math.pow(mv,beta1) * Math.pow(epsrW,alpha) - mv , 1./alpha);
        epsi = Math.pow(mv,beta2)* epsiW;

        d2.push([freq_ghz, epsr]);
        d3.push([freq_ghz, epsi]);
        
    }


    var data_r = {
        color: "rgb(123, 100, 255)",
        data: d2
    };

    var data_i = {
        color: "rgb(255, 10, 13)",
        data: d3
    };

    if( xrange=="low") {
    // create the plot:
    var options = {
        xaxis: { min: 0, max: 1.3, tickFormatter: lowxAxisLabeller },
        //yaxis: { //min: 0, max: 70,
        //         tickFormatter: yAxisLabeller },
    };
    
    $.plot($("#plotModule4_7r"), [ d1, data_r, d1 ], options);


    // create the plot:
    var options = {
        xaxis: { min: 0, max: 1.3, tickFormatter: lowxAxisLabeller },
        //yaxis: { //min: 0, max: 25,
        //         tickFormatter: yAxisLabeller },
    };
    
    $.plot($("#plotModule4_7i"), [ d1, d1, data_i ], options);

    } else {
    // create the plot:
    var options = {
        xaxis: { min: 1.4, max: 20, tickFormatter: xAxisLabeller },
        //yaxis: { min: 0, max: 70,
        //         tickFormatter: yAxisLabeller },
    };
    
    $.plot($("#plotModule4_7r"), [ d1, data_r, d1 ], options);


    // create the plot:
    var options = {
        xaxis: { min: 1.4, max: 20, tickFormatter: xAxisLabeller },
        //yaxis: { min: 0, max: 25,
        //         tickFormatter: yAxisLabeller },
    };
    
    $.plot($("#plotModule4_7i"), [ d1, d1, data_i ], options);
    }

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(0) + "</span>";
}

function xAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val + "</span>";
}

function lowxAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + "V</span>";
    return "<span style='color: black'>" +  val.toFixed(1) + "</span>";
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

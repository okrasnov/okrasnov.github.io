
function doModule4_1(inputs) {

    if (typeof inputs.temp1Val != 'undefined') {
        temp1 = inputs.temp1Val;
    }

    var d1=[];
    var d2 =[];
    var d3 = [];
    
    var freq_ghz;

    var epsS;
    var epsOne=[];
    var tau1=[];
    var tau2=[];
    var epsInf =[];

    var t;

    t=temp1;

    var b1=[];
    var b2=[];
    var one=[];
    one[0]=1.;
    one[1]=0.;

    var eps=[];
    var epsi, epsr;


    var a=[0.63000075e1, 0.26242021e-2, 0.17667420e-3, 0.58366888e3, 0.12634992e3,  0.69227972e-4, 0.30742330e3, 0.12634992e3, 0.37245044e1, 0.92609781e-2];

     
    for (var i = 0; i <= 100; i += 1) {

        freq_ghz = 1.*i;


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
        xaxis: { min: 0, max: 100, 
                 ticks: [0.1,5,10,15,20,25,30,35,40,45,50,60,70,80,90,100],
                 tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 118,
                 ticks: [0,10,20,30,40,50,60,70,80,90,100],
                 tickFormatter: yAxisLabeller },
        legend: {
            show: true,
            position: "nw"
        }

    };


    
    $.plot($("#plotModule4_1"), [ d1, data_r, data_i ], options);

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

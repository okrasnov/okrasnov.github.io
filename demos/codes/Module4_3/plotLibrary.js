
function doModule4_3(inputs) {

    if (typeof inputs.temp1Val != 'undefined') {
        temp1 = inputs.temp1Val;
    }

    var d1=[];
    var d2 =[];
    var d3 = [];
    
    var freq_ghz;

    var T = temp1 + 273.16; // represent temperature in Kelvin

     
    var theta = (300./T) - 1.;

    var B1 = 0.0207;
    var B2 = 1.16e-11;
    var b = 335.;

    var alpha = (0.00504 + 0.0062*theta)*Math.exp(-22.1*theta);
    var betaM;
    var delBeta = Math.exp(-9.963 + 0.0372*(T-273.16));

    var aa= Math.exp(b/T);
    var bb = aa-1.;
    var cc = B1/T;
    var dd = cc * aa / (bb*bb);

    var beta;

    epsr = 3.1884 + 9.1e-4 *temp1;

    for (var i = 1; i <= 3000; i += 1) {

        freq_ghz = 0.1*i;

        betaM = dd  + B2*freq_ghz*freq_ghz + delBeta;
        beta = betaM ;


        epsi = alpha/freq_ghz + beta*freq_ghz;

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

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 300, tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 5,
                 tickFormatter: yAxisLabeller },

    };
    
    $.plot($("#plotModule4_3r"), [ d1, data_r, d1 ], options);

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 100, 
		 mode: "log",
                 tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 0.01,
                 tickFormatter: yiAxisLabeller },

    };

    $.plot($("#plotModule4_3i"), [ d1, d1, data_i ], options);

}



function yAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(1) + "</span>";
}

function yiAxisLabeller(val, axis) { 
    //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
    return "<span style='color: black'>" +  val.toFixed(3) + "</span>";
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

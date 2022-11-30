
function doModule4_6(inputs) {

    if (typeof inputs.densityVal != 'undefined') {
        density = inputs.densityVal;
    }
    if (typeof inputs.mvVal != 'undefined') {
        mv = inputs.mvVal;
    }

    var d1=[];
    var d2 =[];
    var d3 = [];
    
    var freq_ghz;

    var ff, f0, ff0, ff0sq, fr;
    var mvv, mvx;

    var A1, A2, B1, A, B, C;
    var epsr, epsi;

    mvv = Math.pow(mv,1.015);
    mvx = Math.pow(mv,1.31);

    for (var i = 1; i <= 500; i += 10) {

        freq_ghz = 0.2*0.4*i;
        ff =freq_ghz*freq_ghz;
        f0 = 9.07;

        ff0 = freq_ghz/f0;
        ff0sq = ff0*ff0;
        fr = 1./(1.+ff0sq);

        A1 =  0.78 + 0.03 *freq_ghz - 0.58e-3 * ff;
        A2 =  0.97 - 0.39e-2 *freq_ghz + 0.39e-3 * ff;
        B1 =  0.31 - 0.05 *freq_ghz + 0.87e-3 * ff;

        A = A1 *(1.0 + 1.83*density + 0.02*mvv) + B1;
        B = 0.073 *A1;
        C = 0.073 *A2;

        epsr = A + (B * mvx) *fr;
        epsi = (C * ff0 * mvx) *fr;


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
        xaxis: { min: 0, max: 40, tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 5,
                 tickFormatter: yAxisLabeller },
    };

    $.plot($("#plotModule4_6r"), [ d1, data_r, d1 ], options);

    // create the plot:
    var options = {
        xaxis: { min: 0, max: 40, tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: 1,
                 tickFormatter: yAxisLabeller },
    };

    $.plot($("#plotModule4_6i"), [ d1, d1, data_i ], options);

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

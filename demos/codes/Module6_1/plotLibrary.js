
function doModule6_1(inputs) {

    if (typeof inputs.real_eps2Val != 'undefined') {
        real_eps2 = inputs.real_eps2Val;
    }
    if (typeof inputs.imag_eps2Val != 'undefined') {
        imag_eps2 = -inputs.imag_eps2Val;
    }
    

    var d1=[];
    var d2 =[];
    var d3 = [];
    var theta, h, v;
    var eps1=Math.Complex(1.,0.);
    var eps2=Math.Complex(real_eps2,imag_eps2);

    var one=Math.Complex(1.,0.);

    
    var j;

    var root_eps1=Math.Complex(0.,0.);
    var root_eps2=Math.Complex(0.,0.);

    var theta1=Math.Complex(0.,0.);
    var theta2=Math.Complex(0.,0.);
    var cos_theta1=Math.Complex(0.,0.);
    var cos_theta2=Math.Complex(0.,0.);
    var sin_theta1=Math.Complex(0.,0.);

    // 3rd param element (d3) will be plotted in red
    // 2nd param in blue
    // 1st param in yellow/orange

    root_eps1 = eps1.sqrt();
    root_eps2 = eps2.sqrt();

    var rhoh=Math.Complex(0.,0.);
    var rhov=Math.Complex(0.,0.);
   
    var h,v;
        
        for (var i = 0; i <= 180; i += 1) {
            j = 0.5*i;
            theta1.re = j*Math.PI/180.;

            cos_theta1 = theta1.cos();
            sin_theta1 = theta1.sin();

            //theta2 = acos( (1-  (sqrt(eps1)/sqrt(eps2).*sin(theta1)).^2  ).^(1/2)  );
            theta2 = root_eps1.mul(sin_theta1).div(root_eps2);
            theta2 = ((one.sub(theta2.mul(theta2))).sqrt()).acos();

            cos_theta2 = theta2.cos();

            //rhoh = (sqrt(eps1).*cos(theta1)-sqrt(eps2).*cos(theta2)) ./ (sqrt(eps1).*cos(theta1) + sqrt(eps2).*cos(theta2));
            //rhov = (sqrt(eps1).*cos(theta2)-sqrt(eps2).*cos(theta1)) ./ (sqrt(eps1).*cos(theta2) + sqrt(eps2).*cos(theta1));

            rhoh = (root_eps1.mul(cos_theta1)).sub( root_eps2.mul(cos_theta2) );
            rhoh = rhoh.div(  (root_eps1.mul(cos_theta1)).add( root_eps2.mul(cos_theta2) ) );

            rhov = (root_eps1.mul(cos_theta2)).sub( root_eps2.mul(cos_theta1) );
            rhov = rhov.div(  (root_eps1.mul(cos_theta2)).add( root_eps2.mul(cos_theta1) ) );

            h = 1.- rhoh.norm();
            v = 1. -  rhov.norm();


            d2.push([j, v]);
            d3.push([j, h]);

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
    
    $.plot($("#plotModule6_1"), [ d1, data_v, data_h ], options);

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

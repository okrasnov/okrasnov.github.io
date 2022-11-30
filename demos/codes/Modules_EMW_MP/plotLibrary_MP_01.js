function doModule_EMW_MP_01(inputs){
  // relative to free space case received power for antennas as
  // a funcion of received antenna height

    if (typeof inputs.frequencyVal != 'undefined') {
        frequency = inputs.frequencyVal;
    }
    if (typeof inputs.distanceVal != 'undefined') {
        distance = inputs.distanceVal;
    }
    if (typeof inputs.height_tVal != 'undefined') {
        height_t = inputs.height_tVal;
    }
    if (typeof inputs.height_rmaxVal != 'undefined') {
        height_rmax = inputs.height_rmaxVal;
    }

    var lambda;
    var num;
    var p;
    var step=[];
    var h2=[];
    var d1=[];
    var d2=[];

    num = 1000;
    lambda=300/frequency;
    step=height_rmax/(num+1);

    document.getElementById('plotTitle').innerHTML = "Received Rower";
    document.getElementById('yAxisLabel').innerHTML = "Receiver Antenna Height, m";

    for (var i = 0; i <= num; i += 1) {
      h2 = i*step;

      p=two_waves(height_t,h2,distance,lambda);
      //d1.push([i, h2]);
      d2.push([p, h2]);
    }


    var data_v = {
        color: "rgb(123, 100, 255)",
//        label: "<b>v Polarization</b>",
        data: d2
    };

//    var data_h = {
//        color: "rgb(255, 10, 13)",
//         label: "<b>h Polarization</b>",
//        data: d3
//    };

    // create the plot:
    var options = {
        xaxis: { min: -20, max: 10, tickFormatter: xAxisLabeller },
        yaxis: { min: 0, max: height_rmax,
                 tickFormatter: yAxisLabeller },
        legend: {
            show: false,
            position: "nw"
        }

    };

    $.plot($("#plotModule_EMW_MP_01"), [d2], options);

}



function dB(a)
{
  var result;
  result = 10.0*Math.log10(a);
  return result;
}

function two_waves(h1,h2,d,lambda) {

  var result;
  var result1;
  var ca = new Array();
  var pi=3.1415926;
  var temp=4.0*pi/lambda;

  ca[0]=Math.cos(temp*h1*h2/d);
  ca[1]=Math.sin(temp*h1*h2/d);

  result1=(1 - ca[0])*(1 - ca[0])+ca[1]*ca[1];
  if (result1==0){result=-100;}
  else{result=dB(result1);}

  return result;
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

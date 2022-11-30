function doModule_drop_shape(inputs) {

  if (typeof inputs.RD_diameterVal != 'undefined') {
    RD_diameter1 = inputs.RD_diameterVal;
  }
  if (typeof inputs.quant != 'undefined') {
      quant = inputs.quant;
  }
  var d1 = [];
  var d2 = [];
  var d3 = [];

  //Beard and Chuang model, 1987
  var r_bc = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0,3.0,3.0,3.0,3.0,3.0,3.0];

  var bc = [
    [-1310, -1200, -3760, -960, -40, 150, 50, 0, -20, 0, 10],
    [-2010, -1720, -5670, -1370, 30, 290, 80, -20, -40, 0, 10],
    [-2820, -2300, -7790, -1750, 210, 460, 110, -60, -70, 0, 30],
    [-3690, -2850, -9980, -2070, 480, 680, 130, -130, -100, 0, 50],
    [-4580, -3350, -12110, -2270, 830, 890, 120, -210, -130, 10, 80],
    [-5490, -3770, -14210, -2400, 1260, 1100, 90, -310, -160, 40, 110],
    [-6440, -4160, -16290, -2460, 1760, 1310, 20, -440, -180, 90, 140],
    [-7420, -4540, -18370, -2440, 2340, 1500, -70, -580, -190, 150, 190],
    [-8400, -4800, -20340, -2370, 2970, 1660, -210, -720, -190, 240, 230],
    [-8400, -4800, -20340, -2370, 2970, 1660, -210, -720, -190, 240, 230],
    [-8400, -4800, -20340, -2370, 2970, 1660, -210, -720, -190, 240, 230],
    [-8400, -4800, -20340, -2370, 2970, 1660, -210, -720, -190, 240, 230],
    [-8400, -4800, -20340, -2370, 2970, 1660, -210, -720, -190, 240, 230],
    [-8400, -4800, -20340, -2370, 2970, 1660, -210, -720, -190, 240, 230],
    [-8400, -4800, -20340, -2370, 2970, 1660, -210, -720, -190, 240, 230]
  ]; // 9/15

  //Pruppacher-Pitter model, 1971
  var r_pp = [0.1711, 0.3505, 0.433, 0.532, 0.62, 1.1, 1.4, 1.5, 1.8, 2.0, 2.5, 2.9, 3.0, 3.5, 4.0];

  var pp = [
    [-12, 0, -36, -3, 0, 0, 0, 0, 0, 0, 0],
    [-69, 0, -208, -27, 0, 1, 0, 0, 0, 0, 0],
    [-181, 0, -543, -97, -3, 5, -2, 0, 0, 0, 0],
    [-314, 0, -939, -189, -12, 10, -1, 0, -1, 0, 0],
    [-447, 0, -1334, -300, -27, 17, -2, 1, -1, 1, 0],
    [-1431, 0, -4259, -1105, -173, 62, 25, 3, -12, -4, 0],
    [-2344, 0, -6977, -1843, -288, 101, 42, 5, -19, -7, 0],
    [-2670, 0, -7948, -2114, -330, 115, 48, 5, -22, -8, 0],
    [-3659, 0, -10889, -2963, -462, 156, 65, 8, -30, -11, 0],
    [-4296, 0, -12783, -3539, -551, 182, 77, 9, -35, -13, 0],
    [-5734, 0, -17053, -4959, -775, 237, 102, 12, -47, -18, 0],
    [-6822, 0, -20280, -6166, -971, 274, 122, 14, -55, -21, 0],
    [-7089, 0, -21070, -6482, -1023, 283, 127, 15, -57, -22, 0],
    [-8380, 0, -24888, -8151, -1310, 318, 149, 18, -67, -25, 0],
    [-9763, 0, -28966, -10143, -1677, 346, 173, 21, -76, -29, 0]
  ]; //15

  var g2r = 3.1415 / 180;

  if ( quant == "BC_model") {
    n_size=9;
//    $('#slider1').slider({max: n_size});

    r0 = r_bc[RD_diameter1-1];
    title_str="Beard and Chuang model, 1987";
  } else {
    n_size=15;
//    $('#slider1').slider({max: n_size});

    r0 = r_pp[RD_diameter1-1];
    title_str="Pruppacher-Pitter model, 1971";
  }

  for (var i_theta = 0; i_theta <= 359; i_theta += 1) {
    var r = 1;
    var theta0 = i_theta * g2r;
    for (var j = 0; j <= 10; j += 1) {
      if ( quant == "BC_model") {
        r = r + 0.00001 * bc[RD_diameter1-1][j] * Math.cos(j * theta0);
      } else {
        r = r + 0.00001 * pp[RD_diameter1-1][j] * Math.cos(j * theta0);
      }

    }
    r = r * r0;
    r1 = r0;
    d1.push(i_theta);
    d2.push(r);
    d3.push(r1);
//    d2.push([i_theta, r]);
//    d3.push([i_theta, r1]);
  }

var trace1 = {
  r: d2,
  t: d1,
  mode: 'lines',
  name: 'drop shape',
  marker: {
    color: 'none',
    line: {color: 'blue', width: 3}
  },
  type: 'scatter'
};

var trace2 = {
  r: d3,
  t: d1,
  mode: 'lines',
  name: 'spherical drop',
  marker: {
    color: 'none',
    line: {color: 'black', width: 2}
  },
  type: 'scatter'
};
var data = [];
data=[trace1, trace2];

var layout = {
  autosize: true,
  title: title_str,
  font: {
    family: 'Arial, sans-serif;',
    size: 12,
    color: 'black'
  },
  showlegend: false,
  width: 500,
  height: 500,
  margin: {
    l: 40,
    r: 40,
    b: 20,
    t: 40,
    pad: 0
  },
  paper_bgcolor: 'rgb(255, 255, 255)',
  plot_bgcolor: 'rgb(255, 255, 255)',
//  radialaxis: {domain: [0,5] },
  orientation: 90
  //legend: {yanchor:'auto', y: -1}
};

Plotly.plot('plotModule_drop_shape', data, layout);

}



function yAxisLabeller(val, axis) {
  //return "<span style='font-weight: bold'>" +  val + " ohms</span>";
  return "<span style='color: black'>" + val.toFixed(1) + "</span>";
}

function xAxisLabeller(val, axis) {
  //return "<span style='font-weight: bold'>" +  val + "V</span>";
  return "<span style='color: black'>" + val + "</span>";
}

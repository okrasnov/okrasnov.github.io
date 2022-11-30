/*
    helixcalc.js

    Copyright (C) 2000 John Coppens (jcoppens@usa.net)

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program; if not, write to the Free Software
    Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
*/
function compute(form) {
  var lambda=1;
  if (form.freq.value > 0) {
    res_form = document.getElementById('results');

    turns = parseFloat(form.turns.value);
    step_wl = parseFloat(form.step.value);
    freq = parseFloat(form.freq.value);

    lambda = 300000 / freq;
    res_form.wavel.value = parseInt(lambda*10)/10;
    wdiam_mm = 0.02 * lambda;
    res_form.wdiam.value = parseInt(wdiam_mm*10)/10;

    if (turns >= 3) {
      diam_wl = (1.066 + (turns - 5) * 0.003)/Math.PI;
      diam_mm = diam_wl * lambda;
      res_form.diam.value = parseInt(diam_mm*10)/10;

      a = step_wl / (Math.PI * diam_wl);
      gain = 8.3 * Math.pow(Math.PI*diam_wl, Math.sqrt(turns + 2) - 1);
      gain = gain * Math.pow(turns*step_wl, 0.8);
      gain = gain * Math.pow(0.222/a, Math.sqrt(turns)/2);
      gain_dbi = 10 * Math.log(gain) / Math.LN10;
      res_form.gain.value = parseInt(gain_dbi*100)/100;

      if (step_wl > 0) {
        step_mm = step_wl * lambda;
        res_form.stepmm.value = parseInt(step_mm*10)/10;
        ltotal_mm = turns * step_mm;
        lcond_mm = turns * diam_mm * Math.PI;
        lcond_mm = Math.sqrt(lcond_mm*lcond_mm + ltotal_mm*ltotal_mm);
        res_form.lcond.value = parseInt(lcond_mm*10)/10;
        res_form.ltotal.value = parseInt(ltotal_mm*10)/10;
      }
      dist_mm = 0.482 * wdiam_mm;
      res_form.dist.value = parseInt(dist_mm*10)/10;
      res_form.rdiam.value = parseInt(lambda*0.62*10)/10;

      fb = 1.07 * Math.pow(0.91*gain_dbi/(gain_dbi-1), 1.33/Math.sqrt(turns));
      sqrfb = Math.sqrt(fb);
      res_form.fb1.value = parseInt(fb*100)/100;
      res_form.fb1min.value = parseInt(form.freq.value/sqrfb*100)/100;
      res_form.fb1max.value = parseInt(form.freq.value*sqrfb*100)/100;

      fb = 1.07 * Math.pow(0.91*gain_dbi/(gain_dbi-3), 1.33/Math.sqrt(turns));
      sqrfb = Math.sqrt(fb);
      res_form.fb3.value = parseInt(fb*100)/100;
      res_form.fb3min.value = parseInt(form.freq.value/sqrfb*100)/100;
      res_form.fb3max.value = parseInt(form.freq.value*sqrfb*100)/100;

      hpbw = 52.0 / Math.sqrt(turns * step_wl);
      res_form.hpbw.value = parseInt(hpbw*10)/10;
    }
  }
}

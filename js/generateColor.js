function makeColorGradient(frequency1, frequency2, frequency3,
                             phase1, phase2, phase3,
                             center, width, len)
  {
  	colors = []
    if (center == undefined)   center = 128;
    if (width == undefined)    width = 127;
    if (len == undefined)      len = 50;

    for (var i = 0; i < len; ++i)
    {
       var red = Math.floor(Math.sin(frequency1*i + phase1) * width + center);
       var grn = Math.floor(Math.sin(frequency2*i + phase2) * width + center);
       var blu = Math.floor(Math.sin(frequency3*i + phase3) * width + center);
       colors.push('rgba('+red.toString()+','+grn.toString()+','+blu.toString()+',.4)')
    }
    return(colors)
  }
var colors =  makeColorGradient(.3,.3,.3,0,2,4);
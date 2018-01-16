function backtoTop()
		{
		  var time =50;
		  var fastspeed =0.8;
		  var x1=0,y1=0,x2=0,y2=0,x3=0,y3=0,x,y;
		  x1 =window.scrollX;
		  y1 =window.scrollY;
		  if(document.documentElement)
		  {
		    x2 =document.documentElement.scrollLeft;
		    y2 =document.documentElement.scrollTop;
		  }
		  if(document.body)
		  {
		    x3 =document.body.scrollLeft;
		    y3 =document.body.scrollTop;
		  }
		  x =Math.max(x1,Math.max(x2,x3));
		  y =Math.max(y1,Math.max(y2,y3));
		  if(x>0 || y>0)
		  {
		    var speed =1+fastspeed;
		    window.scrollTo(x/speed,y/speed);
		    setTimeout(function(){
		      backtoTop();
		    },time);
		  }
		}


Zepto(function($){
 	
    $('#backtoTop').tap(function(){
     backtoTop();
 })
 
 

 
});
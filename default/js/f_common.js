$.fn.extend({
	 advLayer:function(t){ 
		 var $target = $(this);
		 $target.show();
         var to = setTimeout(function(){
        	 $target.hide();
         },t);
         $target.find("a.pop_close").click(function(){
        	 $target.hide();
        	 clearTimeout(to);
         });
     }
});


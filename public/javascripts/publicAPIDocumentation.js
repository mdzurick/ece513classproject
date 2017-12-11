    //posts if both are valid
    $("#submit").click(function(){
      var userEmail = $("#email").val();
      var emailRe = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var validEmail = emailRe.test(userEmail);
   
    if(validEmail){
    		var xhr = new XMLHttpRequest();
    		xhr.addEventListener("load", function() {
    		    if (this.status == 201) {
    		        function tokenSuccess(err, response) {
                        if(err){
                              throw err;
                         }
                         $("#apikey").html(response.apikey);
                    }
    		    } else {
    			    $("#error").html(this.response.error).show();
    		    }
    		    
    			});
    		xhr.responseType = "json";
    		xhr.open("POST", "/users/signin");
    		xhr.setRequestHeader("Content-type", "application/json");
   			xhr.send(JSON.stringify({ email: userEmail}));
    	}
    });
    
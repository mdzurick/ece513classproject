$(function() {
    // Validates email address as it is typed
    $("#email").keyup(function() {
        var email = $("#email").val();
        var emailRe = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var validEmail = emailRe.test(email); 
        if (!validEmail) {
            $("#error").html("Invalid email address.");
            $("#error").show();
        }
        else {
            $("#error").hide();
        }
    });
    //Validates password as it is typed
    $("#password").keyup(function() {
        var password = $("#password").val();
        var passwordRe = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{10,}/;
        var validPassword = passwordRe.test(password);
        if (!validPassword) {
            $("#error").html("Invalid password.");
            $("#error").show();
        }
        else {
            $("#error").hide();
        }
    });
    
    //posts if both are valid
    $("#submit").click(function(){
      var userEmail = $("#email").val();
      var userPassword = $("#password").val();
      var emailRe = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      var passwordRe = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{10,}/;
      var validEmail = emailRe.test(userEmail);
      var validPassword = passwordRe.test(userPassword);
   
    if(validEmail & validPassword){
    		var xhr = new XMLHttpRequest();
    		xhr.addEventListener("load", function() {
    		    if (this.status == 201) {
    		        function tokenSuccess(err, response) {
                        if(err){
                              throw err;
                         }

                    }
                    window.localStorage.setItem("token", this.response.token);
                    console.log("response.token"+this.response.token);
                     console.log("localStorage"+window.localStorage.getItem("token"));
                     
                    window.location.href = "home.html";
         
    		    } else {
    			    $("#error").html(this.response.error).show();
    		    }
    		    
    			});
    		xhr.responseType = "json";
    		
    		xhr.open("POST", "/users/signin");
    		xhr.setRequestHeader("Content-type", "application/json");
    		xhr.setRequestHeader("X-Auth", window.localStorage.getItem("token"));
   			xhr.send(JSON.stringify({ email: userEmail, password: userPassword }));
    	}
    });
});
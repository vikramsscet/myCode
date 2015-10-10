$(document).ready(function()
{
	$("#signInCloseButton, #signInCancleButton").click(function(){
		$("#Login").removeClass('show')
		window.location="http://localhost:3000";
	});
	
	$("#signUpCloseButton, #signUpCancleButton").click(function(){
		$("#Login").removeClass('show')
		window.location="http://localhost:3000";
	});
	
	User.init();
	Category.initCategory();
});

var User = {
		init : function(){
			$("[id^='editUser-']").click(function(element){
				var userId = this.id.split('-')[1]; 
				$.ajax({
					url: "/find",
					type: "GET",
					async: false,
					dataType : "json",
					data : {id : userId},
					success: function(result){
						//result.email;
						$("#eu-firstName").val(result.firstName);
						$("#eu-lastName").val(result.lastName);
						$("#eu-email").val(result.email);
						$("#eu-mobno").val(result.mobileNumber);
						$("#editUserSubmitButton").val(userId);
					}
				});
				$("#editModalDialog").removeClass("fade").addClass("show");
			});
			
			$("[id^='deleteUser-']").click(function(element){
				var userId = this.id.split('-')[1]; 
				$.ajax({
					url: "/deleteUser",
					type: "GET",
					async: false,
					dataType : "json",
					data : {id : userId},
					success: function(result){
						window.location = window.location.href;
					}
				});
			});
			
			$("#editUserCloseButton, #editUserCancleButton").click(function(){
				$("#editModalDialog").removeClass("show").addClass("fade");
			});
			
			$("#editUserSubmitButton").click(function(){
				var userUpdatedData = {
							fName : $("#eu-firstName").val(),
							lName : $("#eu-lastName").val(),
							email : $("#eu-email").val(),
							mobno : $("#eu-mobno").val(),
							userId : $("#editUserSubmitButton").val()
							}
				$.ajax({
					url: "/updateUser",
					type: "POST",
					async: false,
					dataType : "json",
					data : userUpdatedData,
					success: function(result){
						$("#editModalDialog").removeClass("show").addClass("fade");
						window.location = window.location.href;
					}
				});
			});
		}
}

function validateloginform(){
	if($("#email").val()=="" || $("#pwd").val()=="")
		return false;
	else
		return true;
}

function validateSignupForm(){
	if($("#firstName").val() == "" || $("#lastName").val() == "" || $("#mobileNumber").val() == "" || $("#newemail").val() == "" || $("#newpwd").val() == "")
		return false;
	else
		return true;
}
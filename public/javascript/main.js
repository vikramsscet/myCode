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
	
	editUser.init();
});

var editUser = {
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
			
			$("#addCategory").click(function(){
				$("#catWarning").hide();
				$("#addCategoryDialog").removeClass("fade").addClass("show");
			});
			
			$("#addCategoryCloseButton, #addCategoryCancleButton").click(function(){
				$("#catWarning").hide();
				$("#addCategoryDialog").removeClass("show").addClass("fade");
			});
			
			$("#addCategorySubmitButton").click(function(){
				if($("#eu-category").val() == "" || $("#eu-category").val() == null){
					$("#catWarning").show().html("Please enter Category to add.");
				}
				else{
					var addCategoryData = {
							category : $("#eu-category").val()
							}
					$.ajax({
						url: "/addCategory",
						type: "POST",
						async: false,
						dataType : "json",
						data : addCategoryData,
						success: function(result){
							console.log(result);
							if(result.hasOwnProperty('error')){
								$("#catWarning").show().html(result['error']);
							}else{
								$("#addCategoryDialog").removeClass("show").addClass("fade");
								window.location = window.location.href;
							}
						}
					});
				}
			});
			
			$("[id^='deleteCategory-']").click(function(element){
				var catId = this.id.split('-')[1]; 
				$.ajax({
					url: "/deleteCategory",
					type: "GET",
					async: false,
					dataType : "json",
					data : {id : catId},
					success: function(result){
						window.location = window.location.href;
					}
				});
			});
			
			$("[id^='editCategory-']").click(function(element){
				var categoryId = this.id.split('-')[1]; 
				$.ajax({
					url: "/findCategoryById",
					type: "GET",
					async: false,
					dataType : "json",
					data : {id : categoryId},
					success: function(result){
						console.log(result);
						$("#eu-edit-category").val(result.categoryName);
						$("#editCategorySubmitButton").val(categoryId);
					}
				});
				$("#editCategoryModalDialog").removeClass("fade").addClass("show");
			});
			
			$("#editCategoryCloseButton, #editCategoryCancleButton").click(function(){
				$("#editCatWarning").hide();
				$("#editCategoryModalDialog").removeClass("show").addClass("fade");
			});
			
			$("#editCategorySubmitButton").click(function(){
				var catName = $("#eu-edit-category").val();
				if(catName == "" || catName == null){
					$("#editCatWarning").show().html("Please enter Category to update.");
				}else{
					var catDetail = {
						catName : catName,
						catId : $("#editCategorySubmitButton").val()
					};
					$.ajax({
						url: "/updateCategoryById",
						type: "POST",
						async: false,
						dataType : "json",
						data : catDetail,
						success: function(result){
							$("#editCategoryModalDialog").removeClass("show").addClass("fade");
							window.location = window.location.href;
						}
					});
				}
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
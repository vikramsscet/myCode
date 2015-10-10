var Category = {
		initCategory : function(){
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
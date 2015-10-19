"use strict"
var Category = {
		initCategory : function(){
			this.addCategoryButtonClick();
			this.closeCancleCategoryButtonClick();
			this.addCategorySubmitClick();
			this.deleteCategoryButtonClick();
			this.editCategoryButtonClick();
			this.closeCancleCategoryButtonClick();
			this.editCategorySubmitClick();
			this.addSubCategoryButtonClick();
			this.closeCancleSubCategoryButtonClick();
			this.addSubCategorySubmitClick();
		},
		
		addCategoryButtonClick : function(){
			$("#addCategory").click(function(){
				$("#catWarning").hide();
				$("#addCategoryDialog").removeClass("fade").addClass("show");
			});
		},
		
		closeCancleCategoryButtonClick : function(){
			$("#addCategoryCloseButton, #addCategoryCancleButton").click(function(){
				$("#catWarning").hide();
				$("#addCategoryDialog").removeClass("show").addClass("fade");
			});
		},
		addCategorySubmitClick : function(){
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
		},
		
		deleteCategoryButtonClick : function(){
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
		},
		
		editCategoryButtonClick : function(){
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
		},
		
		editCategoryCloseCancleClick : function(){
			$("#editCategoryCloseButton, #editCategoryCancleButton").click(function(){
				$("#editCatWarning").hide();
				$("#editCategoryModalDialog").removeClass("show").addClass("fade");
			});
		},
		
		editCategorySubmitClick : function(){
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
		},
		
		addSubCategoryButtonClick : function(){
			$("#addSubCategory").click(function(){
				$("#subCatWarning").hide();
				var getCatListfun = Category.getCategoryList();
				$("#selectCategory").empty();
				var categoryList = getCatListfun();
				$("#selectCategory").append("<option value=''>Select Category</option>");
				for(var i=0; i< categoryList.length; i++){
					$("#selectCategory").append("<option value='"+categoryList[i]['categoryName']+"'>"+categoryList[i]['categoryName']+"</option>");
				}
				$("#addSubCategoryDialog").removeClass("fade").addClass("show");
			});
		},
		
		closeCancleSubCategoryButtonClick : function(){
			$("#addSubCategoryCloseButton, #addSubCategoryCancleButton").click(function(){
				$("#subCatWarning").hide();
				$("#addSubCategoryDialog").removeClass("show").addClass("fade");
			});
		},
		
		getCategoryList : function(){
			var categoryList;
			$.ajax({
				url: "/categoryList",
				type: "GET",
				async: false,
				dataType : "json",
				success: function(result){
					categoryList = result;
				}
			});
			return function(){
				return categoryList;
			}
		},
		
		addSubCategorySubmitClick : function(){
			$("#addSubCategorySubmitButton").click(function(){
				if($("#eu-sub-category").val() == "" || $("#selectCategory").val() == ""){
					$("#subCatWarning").show().html("Please select category and enter Sub-Category to add.");
				}
				else{
					var addSubCategoryData = {
							category : $("#selectCategory").val(),
							subCategory : $("#eu-sub-category").val()
							};
					$.ajax({
						url: "/addSubCategory",
						type: "POST",
						async: false,
						dataType : "json",
						data : addSubCategoryData,
						success: function(result){
							console.log(result);
							if(result.hasOwnProperty('error')){
								$("#subCatWarning").show().html(result['error']);
							}else{
								$("#addSubCategoryDialog").removeClass("show").addClass("fade");
								window.location = window.location.href;
							}
						}
					});
				}
			});
		}
}
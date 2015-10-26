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
			this.editCategoryCloseCancleClick();
			this.addSubCategoryButtonClick();
			this.closeCancleSubCategoryButtonClick();
			this.addSubCategorySubmitClick();
			this.deleteSubCategoryButtonClick();
			this.editSubCategoryButtonClick();
			this.editSubCategorySubmitClick();
			this.editSubCategoryCloseCancleClick();
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
				var catFun = Category.getCategoryById(categoryId);
				var catObj = catFun();
				$("#eu-edit-category").val(catObj.categoryName);
				$("#editCategorySubmitButton").val(categoryId);
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
				console.log(categoryList);
				$("#selectCategory").append("<option value=''>Select Category</option>");
				for(var i=0; i< categoryList.length; i++){
					$("#selectCategory").append("<option value='"+categoryList[i]['_id']+"'>"+categoryList[i]['categoryName']+"</option>");
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
				success: function(result){
					categoryList = result;
				}
			});
			return function(){
				return categoryList;
			}
		},

		getCategoryById : function(categoryId){
			var catObj;
			$.ajax({
				url: "/findCategoryById",
				type: "GET",
				async: false,
				dataType : "json",
				data : {id : categoryId},
				success: function(result){
					catObj = result;
				}
			});
			return function(){
				return catObj;
			}
		},
		
		addSubCategorySubmitClick : function(){
			$("#addSubCategorySubmitButton").click(function(){
				if($("#eu-sub-category").val() == "" || $("#selectCategory").val() == ""){
					$("#subCatWarning").show().html("Please select category and enter Sub-Category to add.");
				}
				else{
					var addSubCategoryData = {
							categoryId : $("#selectCategory").val(),
							categoryName : $("#selectCategory :selected").text(),
							subCategory : $("#eu-sub-category").val()
							};
					$.ajax({
						url: "/addSubCategory",
						type: "POST",
						async: false,
						dataType : "json",
						data : addSubCategoryData,
						success: function(result){
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
		},

	deleteSubCategoryButtonClick : function(){
		$("[id^='deleteSubCategory-']").click(function(element){
			var subCatId = this.id.split('-')[1];
			$.ajax({
				url: "/deleteSubCategory",
				type: "GET",
				async: false,
				dataType : "json",
				data : {id : subCatId},
				success: function(result){
					window.location = window.location.href;
				}
			});
		});
	},

	editSubCategoryButtonClick : function(){
		$("[id^='editSubCategory-']").click(function(element){

			$("#editSubCatWarning").hide();
			var getCatListfun = Category.getCategoryList();
			$("#editSelectCategory").empty();
			var categoryList = getCatListfun();
			$("#editSelectCategory").append("<option value=''>Select Category</option>");
			for(var i=0; i< categoryList.length; i++){
				$("#editSelectCategory").append("<option value='"+categoryList[i]['_id']+"'>"+categoryList[i]['categoryName']+"</option>");
			}

			var subCategoryId = this.id.split('-')[1];
			$.ajax({
				url: "/findSubCategoryById",
				type: "GET",
				async: false,
				dataType : "json",
				data : {id : subCategoryId},
				success: function(result){
					var catFun = Category.getCategoryById(result.categoryId);
					var catObj = catFun();
					$("#editSelectCategory option[value='"+catObj['_id']+"']").prop('selected', true);
					$("#eu-edit-sub-category").val(result.subCategoryName);
					$("#editSubCategorySubmitButton").val(subCategoryId);
				}
			});
			$("#editSubCategoryModalDialog").removeClass("fade").addClass("show");
		});
	},

	editSubCategoryCloseCancleClick : function(){
		$("#editSubCategoryCloseButton, #editSubCategoryCancleButton").click(function(){
			$("#editSubCatWarning").hide();
			$("#editSubCategoryModalDialog").removeClass("show").addClass("fade");
		});
	},

	editSubCategorySubmitClick : function(){
		$("#editSubCategorySubmitButton").click(function(){
			var catId = $("#editSelectCategory").val();
			var subCatName = $("#eu-edit-sub-category").val();
			if(subCatName == "" || subCatName == null || catId == "" || catId == null){
				$("#editCatWarning").show().html("Please enter Category & SubCateory to update.");
			}else{
				var subCatDetail = {
					catId : catId,
					catName : $("#editSelectCategory :selected").text(),
					subCatName : subCatName,
					subCatId : $("#editSubCategorySubmitButton").val()
				};
				$.ajax({
					url: "/updateSubCategoryById",
					type: "POST",
					async: false,
					dataType : "json",
					data : subCatDetail,
					success: function(result){
						$("#editSubCategoryModalDialog").removeClass("show").addClass("fade");
						window.location = window.location.href;
					}
				});
			}
		});
	}
}
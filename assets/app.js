//API
var apiKey = "1";

//User Inputs
var ingredient1 = "";
//query URL
var queryURL1 = "http://www.thecocktaildb.com/api/json/v1/" + apiKey + "/filter.php?i=";

var recipeCounter = 0;
var numResults = 0;

//FUNCTIONS

//Initialize Firebase
var config = {
   apiKey: "AIzaSyBXibrzv1-R0q7Cdid91Kp6EViGuMCdxqw",
   authDomain: "project1-buzzy.firebaseapp.com",
   databaseURL: "https://project1-buzzy.firebaseio.com",
   projectId: "project1-buzzy",
   storageBucket: "project1-buzzy.appspot.com",
   messagingSenderId: "533067457272"
};
firebase.initializeApp(config);
var dataRef = firebase.database();

var fullName = "";
var email = "";
var age = "";
var searchLog = "";

$("#add-new-user-btn").on("click", function(event) {
     event.preventDefault();
     // YOUR TASK!!!
     // Code in the logic for storing and retrieving the most recent user.
     // Don't forget to provide initial data to your Firebase database.
     fullName = $("#fullname").val().trim();
     email = $("#email").val().trim();
     age = $("#birthday").val().trim();
     // Code for the push
     dataRef.ref().push({
       fullName: fullName,
       email: email,
       age: age,
       dateAdded: firebase.database.ServerValue.TIMESTAMP,
       searchlog: searchLog
     });

     $("#fullname").val("");
     $("#email").val("");
     $("#birthday").val("");
   });

$("#add-user-pass-button").on("click", function(event) {
    // console.log('inside to');
      event.preventDefault();
      fullName2 = $("#fullName2").val().trim();
      email2 = $("#email2").val().trim();
      dataRef.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val().fullName);
      
      if (fullName2 == childSnapshot.val().fullName && email2 == childSnapshot.val().email) {
      console.log(fullName2);
      // Appends message to the confirmed div in the html modal form
      $("#confirmed").append("<span id='NameFound'> Welcome " + childSnapshot.val().fullName +
        "  :) </span>");
      }
      
      }, function(errorObject) {
      console.log("Errors handled: " + errorObject.code);
      });
});

function runQuery(numRecipes, queryURL1) {

	$.ajax({
		url: queryURL1,
		method: "GET"
	}).done(function(response1) {
		console.log(queryURL1);
		console.log(response1);

		for (var i = 0; i < numRecipes; i++) {
			var drinkID = response1.drinks[i].idDrink;
			var queryURL2 = "http://www.thecocktaildb.com/api/json/v1/" + apiKey + "/lookup.php?i=" + drinkID;

			recipeCounter++;
			var wells = $("<div>");
			wells.addClass("well");
			wells.attr("id", "recipe-well-" + recipeCounter);
			$("#well-section").append(wells);

			if (response1.drinks[i].strDrinkThumb !== "null") {
				var drinkDisplay = $("<img>");
          		drinkDisplay.attr("src", response1.drinks[i].strDrinkThumb);
          		drinkDisplay.attr("class", "displayDrinkPics");
          		drinkDisplay.width(200);
				$("#recipe-well-" + recipeCounter).append(drinkDisplay);
				console.log(drinkDisplay);
			}

			if (response1.drinks[i].strDrink !== "null") {
				$("#recipe-well-" + recipeCounter).append(
					"<h3 class='nameOfCocktail><span class='label label-primary'>" +
					recipeCounter + ") <span><strong> " +
					response1.drinks[i].strDrink + "</strong></h3>"
				);

				console.log(response1.drinks[i].strDrink);

			}

			(function(counter) {
				$.ajax({
					url: queryURL2,
					method: "GET"
				}).done(function(response2) {
					console.log(queryURL2);
					console.log(response2);

					for (var j = 0; j <= 15; j++) {
						var measurement = response2.drinks[0]['strMeasure' + j];
						var ingredient = response2.drinks[0]['strIngredient' + j];

						if (ingredient) {
							$("#recipe-well-" + counter).append(
								measurement + " " + ingredient + "<br>"
							);
							console.log(measurement);
							console.log(ingredient);
						}
					}

					if (response2.drinks[0].strInstructions !== "null") {
						$("#recipe-well-" + counter).append(
							response2.drinks[0].strInstructions + "<br>"
						);
						console.log(response2.drinks[0].strInstructions);
					}
				});
			})(recipeCounter);
		}
	});
}

$(document).on("click", "#add-submit-btn", function(event) {

	event.preventDefault();
	recipeCounter = 0;
	$("#well-section").empty();
	ingredient1 = $("#first-ingredient").val().trim();
	if (ingredient1) {
		var searchURL = queryURL1 + ingredient1;
		numResults = $("#num-recipes-select").val();
		console.log(numResults);
		console.log(searchURL);
	}

	runQuery(numResults, searchURL);
});

$(document).on("click", "#add-reset-btn", function() {
	recipeCounter = 0;
	$("#well-section").empty();
});
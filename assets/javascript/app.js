let queries = [ "Action", "Comedy", "Drama", "Horror", "Sci-Fi+Fantasy" ];
let giphyApiKey = "wHoUOdTCE4csSKSWXWSxaRycO6OlXQ42";


// Function for displaying movie scene genre buttons.
function renderButtons() {

	$("#buttons-view").empty();

	for (let i = 0; i < queries.length; i++) {
		let queryURL = "https://api.giphy.com/v1/gifs/search?q=movie+scene+" + queries[i] + "&api_key=" + giphyApiKey + "&limit=8";
		$("#buttons-view").append( "<button value=" + queryURL + ">" + queries[i] + "</button>" );
		

		$("#buttons-view > button").append( '<button value="' + i + '">X</button>' ); // BUGGY: Creating multiple "X" child buttons where unexpected.
	

	}

	$("#buttons-view > button").on( 'click', function(event) {

		event.preventDefault();
		let queryURL = $(this).val();

		$.ajax({
		url: queryURL,
		method: "GET"
		}).then(function(response) {

			//console.log( response );

			// Display newest called GIFs from Giphy, dump them in #scenes-view.
			var results = response.data;
			for (var j = 0; j < results.length; j++) {

				// Only taking action if the photo has an appropriate rating
	            if (results[j].rating !== "r" && results[j].rating !== "pg-13") {

					// Creating a div for the gif
					var gifDiv = $("<div>");

					// Storing the result item's rating
					var rating = results[j].rating;

					rating = rating.toUpperCase();

					// Creating a paragraph tag with the result item's rating
					var p = $("<p>").text("Rating: " + rating);

					// Creating an image tag
					var personImage = $("<img>");

					personImage.addClass("gif");

					// Giving the image tag an src attribute of a proprty pulled off the result item
					personImage.attr("src", results[j].images.fixed_height.url);
					personImage.attr("data-still", results[j].images.fixed_height_still.url);
					personImage.attr("data-animate", results[j].images.fixed_height.url);
					personImage.attr("data-state", "still");

					// Appending the paragraph and personImage we created to the "gifDiv" div we created
					gifDiv.append(p);
					gifDiv.append(personImage);

					// Prepending the gifDiv to the "#scenes-view" div in the HTML
					$("#scenes-view").prepend(gifDiv);

					// Attach pause/unpause functionality.
					$(".gif").on("click", function() {
						var state = $(this).attr( "data-state" );
						if ( state === 'still' ) {
							$(this).attr( 'src', $(this).attr( "data-animate" ) );
							$(this).attr( 'data-state', 'animate' );
						} else if ( state === 'animate' ) {
							$(this).attr( 'src', $(this).attr( "data-still" ) );
							$(this).attr( 'data-state', 'still' );
						}
					});

	            }

			}

		});

	});

	$("#buttons-view > button button").on( 'click', function(event) {
		event.preventDefault();
		queries.splice( $(this).val(), 1 ); // Remove query from the "queries" array.
		renderButtons(); // Re-render buttons.
	});


	

}


// Function to take a submitted value from the user via Search field and add a new button to the "queries" array based on it. Then run renderButtons() again.
$("#add-scene").on( 'click', function(event) { 
	event.preventDefault();


	// BUG: Space in user-submitted query text results in API request error. Query submition must be filtered.
	queries.push( $("#scene-input").val().trim() ); // Add user-inputed query to existing series of buttons.
	

	renderButtons(); // Re-render buttons.
});


renderButtons();
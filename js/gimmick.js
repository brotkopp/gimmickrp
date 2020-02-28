var createGimmickContainer = function( label ){
	var that = {};

	var el = $( "<div class=\"gimmick-section\"></div>" );
	$( el ).append( $( "<h1>" + label + "</h1>" ) );

	var info = $( "<div class=\"gimmick-info\"></div>" );
	$( el ).append( info );

	var container = $( "<div class=\"gimmick-container\"></div>" );
	$( el ).append( container );

	$( "body" ).append( el );

	var updateStatistics = function(){
		var output = "";
		var statistics = {};
		var content = $( container ).find( "gimmick" );
		
		output += content.length + " gimmicks";

		// cycling through container content
		for( var i = 0 ; i < content.length ; i++ ){
			var classList = content[ i ].className.split( /\s+/ );
			
			// cycling through class list
			for( var j = 0 ; j < classList.length ; j++ ){
				statistics[ classList[ j ] ] = typeof statistics[ classList[ j ] ] == "undefined" ? 1 : statistics[ classList[ j ] ] + 1;
			}
		}

		var sortedKeys = Object.keys( statistics ).sort();

		for( var i = 0 ; i < sortedKeys.length ; i++ ){
			output += ", " + statistics[ sortedKeys[ i ] ] + " " + sortedKeys[ i ];
		}

		info.text( output );
	};

	that.append = function( gimmick ){
		$( container ).append( gimmick );
		updateStatistics();
	}

	return that;
};

var GimmicksToJson = function () {
	var gimmickElements = $("gimmick");
	var gimmicks = [];
	for (var i = 0; i < gimmickElements.length; i++) {
		var el = $(gimmickElements[i]);
		var gimmick = {};
		gimmick.label = el.find("label").text();
		gimmick.tags = el.attr("class").split(" ");
		var tier = el.find("tier");
		gimmick.tier = {
			number: parseInt(tier.text()),
			andHigher: tier.hasClass("and-higher"),
			exclusive: tier.hasClass("exclusive")
		};
		gimmick.rules = [];
		var rules = el.find("rule");
		for (var r = 0; r < rules.length; r++) gimmick.rules.push($(rules[r]).text());
		
		gimmick.examples = [];
		var examples = el.find("example");
		for (var e = 0; e < examples.length; e++) gimmick.examples.push($(examples[e]).text());

		gimmicks.push(gimmick);
	}

	return gimmicks;
}


$( "document" ).ready( function(){
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Remove outdated gimmicks

	$(".outdated").remove();

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Creating an array of containers for the tiers
	
	var tierList = [  		createGimmickContainer("setup")
					, createGimmickContainer("veteran")
					, createGimmickContainer("team")];
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Sorting gimmicks from a to z
	
	$( "gimmick" ).sort( function( a , b ){

		var replaceCharacters = [
								{ character: "Ä" , replacement: "A"}
								, { character: "Ö" , replacement: "O"}
								, { character: "Ü" , replacement: "U"}
								, { character: "ß" , replacement: "SS"}
							];

		var compare_a = $( a ).find( "label" ).text().toUpperCase();
		var compare_b = $( b ).find( "label" ).text().toUpperCase();

		for( var i = 0; i < replaceCharacters.length; i++ ){
			compare_a = compare_a.replace( replaceCharacters[ i ].character , replaceCharacters[ i ].replacement );
			compare_b = compare_b.replace( replaceCharacters[ i ].character , replaceCharacters[ i ].replacement );
			//console.log( "Replacing " + replaceCharacters[ i ].character + " with " + replaceCharacters[ i ].replacement );
		}

		if( compare_a < compare_b ){
			return -1;
		}
		else{
			return 1;
		}
	})
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
	// Appending each gimmick to the according tier container
	
	.each( function( idx , itm ){
		tierList[ $( itm ).find( "tier" ).text() ].append( itm );
	});

});
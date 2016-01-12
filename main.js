$(document).ready(function(){
	
	(function($) {	

		$.fn.mediaPlayer = function() {

			var mediaPlayer = $('#mediaPlayer');
			var music = $('<audio id="music"></audio>');
			var playMode = $('<button id="playMode" class="playMode">Mode</button>').appendTo(mediaPlayer);
			var cover = $('<img id="cover" src="../img/album/eq.jpg">').appendTo(mediaPlayer);
			var progressOutline = $('<div id="progressOutline"></div>').appendTo(mediaPlayer);
			var progress = $('<div id="progress"></div>').appendTo(progressOutline);
			var pButton = $('<button id="pButton" class="play"></button>').appendTo(mediaPlayer);
			var duration = $('<p id="duration">0.00 / 0.00</p>').appendTo(mediaPlayer);
			var volume = $('<input id="volume" type="range" min="0" max="10" value="5">').appendTo(mediaPlayer)[0];
			var backward = $('<button id="backward" class="backward"></button>').appendTo(mediaPlayer);
			var forward = $('<button id="forward" class="forward"></button>').appendTo(mediaPlayer);
			var playList = $('<ul id="playList" class="playList"></ul>').appendTo(mediaPlayer);
			var form = $('<form id="form"></form>').appendTo(mediaPlayer);
			var url = $('<input type="text" name="url">').appendTo(form);

			//-----------------------------------------------------------
			var radio = false;
			var songId = 0;
			var oldSongId = 0;

			//PLAYLIST
			var songs = [
							"../music/Krewella.mp3", 
							"../music/Dear_Professor.mp3",
							"../music/EHDE.mp3"
						];

			var albumCover = [ 
								"../img/album/Krewella.jpg", 
								"../img/album/dear_Professor.jpg", 
								"../img/album/EHDE.jpg"
							 ];

			var defaultCover = "../img/album/eq.jpg";
			//-----------------------------------------------------------

			//test
			url.val("http://norrland.neradio.se:8000/");
			//init 1st song
			setSource();
			//hide radio form
			form.hide();
			//init playlist
			for(var i = 0; i < songs.length; i++){
				$('<li>').attr("id", i).text(songs[i]).appendTo(playList);   

			}

			/**************************************

			FUNCTIONS
			
			**************************************/

			function setSource(){
				if(radio){
					music.attr("src", $(url).val() + ";");
				}else{
					music.attr("src", songs[songId]);
				}
			}

			function highlight(){
				$('#'+oldSongId).css("color", "black");
				$('#'+songId).css("color", "white");
				
			}

			function changeAlbumCover(){
				if(songId > albumCover.length-1 || radio === true){
					cover.attr("src", defaultCover);

				}else{
					cover.attr("src", albumCover[songId]);
				}
			}

			function checkState(){
				if (music[0].paused) {
					music[0].play();
					// remove play, add pause
					pButton.removeClass("play");
		    		pButton.addClass("pause");
				} else { // pause music
					music[0].pause();
					// remove pause, add play
					pButton.removeClass("pause");
					pButton.addClass("play");
				}
			}

			function skip(){
				if(songId === songs.length-1){
					oldSongId = songId;
					songId = 0;
				}
				else {
					oldSongId = songId;
					songId++;
				}
			}

			function rewind(){
				if(songId === 0){
					oldSongId = songId;
					songId = songs.length-1;
				}
				else {
					oldSongId = songId;
					songId--;
				}
			}

			/**************************************

			CONTROLS

			**************************************/

			//form for radio url
			$(form).on('submit' , function(event){
				event.preventDefault();
				setSource();
				checkState();

			});


			//Radio or Playlist
			$(playMode).on('click' , function(){
				backward.hide();

				if(radio === true){
					radio = false;

					backward.show();
					forward.show();
					playList.show();
					duration.show();

					form.hide();

					setSource();

					pButton.removeClass("pause");
		    		pButton.addClass("play");

					
				}else{
					radio = true;

					backward.hide();
					forward.hide();
					playList.hide();
					duration.hide();

					form.show();

					music.attr("src", null);

					changeAlbumCover();

					pButton.removeClass("pause");
		    		pButton.addClass("play");

					
				}

			});

			//Rewind
			$(backward).on('click' , function(){
				rewind();
				setSource();
				checkState();
				changeAlbumCover();
				highlight();

			});

			//Skip forward
			$(forward).on('click' , function(){
				skip();
				setSource();
				checkState();
				changeAlbumCover();
				highlight();

			});
			//---------------------------------------------------

			//Play Pause
			$(pButton).on('click', function(){
				checkState();
				changeAlbumCover();
				highlight();
			});

			//Update timeline
			$(music).bind('timeupdate', function(){

				var s = parseInt(music[0].currentTime % 60);
				var m = parseInt((music[0].currentTime) / 60) % 60;

				var ss = parseInt(music[0].duration % 60);
				var mm = parseInt((music[0].duration) / 60) % 60;

				if(isNaN(ss)){
					ss = "00";
					mm = "0";
				}

				if(s < 10){
					s = "0" + s;

				}
				duration.html(m + "." + s + " / " + mm + "." + ss);

				var progressValue = 0;
				if(music[0].currentTime > 0){
					progressValue = Math.floor((100 / music[0].duration) * music[0].currentTime);

				}
				progress.css("width", progressValue + "%");

				if(music[0].currentTime >= music[0].duration){
					skip();
					setSource();
					checkState();
					changeAlbumCover();
					highlight();

				}
					
			});

			//Click timeline
			$(progressOutline).on('click', function(event){
				music[0].currentTime = Math.floor(music[0].duration * ((event.pageX - progressOutline.offset().left) / progressOutline.width()));

			});

			//Volume
			$(volume).change(function(){
				music[0].volume = parseFloat(volume.value / 10);

			});

		};

	}) (jQuery);

	$('#mediaPlayer').mediaPlayer();

});
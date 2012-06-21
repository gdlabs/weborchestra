var socket;

var assetsPath = "/public/sounds/";
var manifest = [
	{src:assetsPath+"01.mp3|"+assetsPath+"01.ogg", id:1, data: 1},
	{src:assetsPath+"02.mp3|"+assetsPath+"02.ogg", id:2, data: 1},
	{src:assetsPath+"03.mp3|"+assetsPath+"03.ogg", id:3, data: 1}
];

preload = new PreloadJS();
preload.installPlugin(SoundJS);
preload.loadManifest(manifest);
SoundJS.registerPlugins([SoundJS.HTMLAudioPlugin]);

$(document).ready(function(){
	if (console) console.log('documento caricato');
	
	$('#start').on('click', function(){
		$('#panel').fadeIn();
		$('#login').fadeOut();
		
		socket = io.connect(window.location);
		socket.emit('addMe', $('#myName').val());
		
		socket.on('yourId', function(data) {
			if (console) console.log('client id #' + data.clientId);
		});
		
		socket.on('refreshClientsList', function (data) {
			if (console) console.log(data);
			//socket.emit('my other event', { my: 'data' });
			$('#connectedclients').html('');
			for (client in data){
				$('<li>'+ data[client] +'</li>').appendTo('#connectedclients');
			}
		});
		
		socket.on('play', function(data){
			// Play Sound
			if (console) console.log('playing track #'+data.trackId);
			//alert($('.sound[value='+data.trackId).attr('soundsrc'));
			//$('#audio').src = $('.sound[value='+data.trackId).attr('soundsrc');
			//$('#audio').play();
			var instance = SoundJS.play(data.trackId, SoundJS.INTERRUPT_ANY);
			if (instance == null) { return; }		
		});
	});
	
	$('.sound').on('click', function(){
		socket.emit('broadcastTrack', $(this).val());
		
		// Play Sound
		if (console) console.log('playing track #'+$(this).val());
		
		var instance = SoundJS.play($(this).val(), SoundJS.INTERRUPT_ANY);
		if (instance == null) { return; }
	});
});

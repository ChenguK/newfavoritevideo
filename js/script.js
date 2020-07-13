let videoData, userInput;

const $title = $("#title");
const $channel = $("#channel");
const $description = $("#description");
const $imgEL = $('.modal-content img');
const $video = $(`.video-container`);


const $input = $("input[type='text']")

$("form").on("submit", handleGetVideos);
function handleGetVideos(evt) {
	event.preventDefault();

    userInput = $input.val();
    $.ajax({
		url:"https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q="  + userInput + "&type=video&key=AIzaSyCyjIEINcYhAUJF5j_pj27vzXz9RhthDg8"
	}).then(
        (data)=> { 
            console.log("DATA IS ", data)
			// movieData = data;
			render();
        }, 
        (error) => { 
            console.log("ERROR IS ", error)
        })
}

function render() {
    $title.html(videoData.items[i].snippet.title);
    $channel.html(videoData.items[i].snippet.channelTitle);
    $description.html(videoData.items[i].snippet.description);
    $('img').attr('src', videoData.items[i].snippet.thumbnails.default.url); 
    $video.attr('src', videoData.items[i].id.videoId);
}

function submitForm() {
    $('form[name="contact-form"]').submit();
    $('input[type="text"], textarea').val('');
  }
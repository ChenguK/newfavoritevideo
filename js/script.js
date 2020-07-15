const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q='
let videoData, userInput;

const $ul  = $('.collection');
const $title = $('#title');
const $channel = $('#channel');
const $description = $('#description');
const $img = $('img');
const $video = $('.modal-content .video-container');
const $input = $("input[type='text']");
const $modal = $('.modal');

$ul.on('click', 'img', handleClick);

$modal.modal();
    const instance = M.Modal.getInstance($modal);

function handleClick(evt) {
        getVideos(evt.target.dataset.url, true); 
    }

$("form").on("submit", getVideos);
event
function getVideos(evt) {
    event.preventDefault();
    userInput = $input.val();
    $.ajax({
		url:baseUrl  + userInput + `&type=video&key=${config.API_KEY}` 
    }).then(
        (data)=> { 
            videoData = data.items;
            console.log("DATA IS ", data.items)
			render();
        }, 
        (error) => { 

            console.log("ERROR IS ", error)
        })
}

function generateHTml() { 
    return videoData.map(function(v) {
        return `
        <li class="collection-item"><div><b class="grey-darken-text">${v.snippet.title}</b><a href="#myModal" role="button" data-toggle="modal" class="secondary-content blue-text"><i class="material-icons"><img src=${v.snippet.thumbnails.medium.url} "data-target="modal1" class="btn modal-trigger" alt="video thumbnail"></i></a><br>${v.snippet.channelTitle}
        </div>
        </li>`
    })
}
// <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
// 'data-target="modal1" class="btn modal-trigger'

function render() {
    const html = generateHTml().join("");
    $('h4').html('Results for ' + userInput )
    $ul.html(html);
    // for(let i = 0; i < videoData.items.length; i++) { 
    $title.html(videoData.snippet.title);
        // console.log(videoData.items[i].snippet.title);
    $channel.html(videoData.snippet.channelTitle);
    $description.html(videoData.snippet.description);
    // $img.attr('src', videoData.thumbnails.medium.url); 
    $video.attr(`https://www.youtube.com/watch?v=` + videoData.id.videoId);
    instance.open();
}

function submitForm() {
    $('form[name="contact-form"]').submit();
    $('input[type="text"], textarea').val("");
  }

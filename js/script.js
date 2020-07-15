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



function handleClick(evt) {
        getVideos(evt.target.dataset.url, true); 
    }

$("form").on("submit", getVideos);
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
        <li class="collection-item"><div><b class="blue-grey-text">${v.snippet.title}</b><a href="#" class="secondary-content blue-text"><i class="material-icons"><img class="modal-trigger" data-target="modal1" src=${v.snippet.thumbnails.medium.url} alt="video thumbnail"></i></a><br>${v.snippet.channelTitle}
        </div>
        </li>`
    })
}



function render() {
    const html = generateHTml().join("");
    $('h4').html('Results for ' + userInput )
    $ul.html(html);
    // $modal.on("click", generateModal().join(""));
    $title.html(videoData.snippet.title);
    $channel.html(videoData.snippet.channelTitle);
    $description.html(videoData.snippet.description);
    $video.attr(videoData.id + `https://www.youtube.com/watch?v=` + videoId);
    $(".modal").modal();
    // const video = generateModal().join("");
    // $modal.video(video)
    // $title.video(videoData.snippet.title);
    // $channel.video(videoData.snippet.channelTitle);
    // $description.html(videoData.snippet.description);
    // $video.attr(videoData.id + `https://www.youtube.com/watch?v=` + videoId);
    // instance.open();
}

function submitForm() {
    $('form[name="contact-form"]').submit();
    $('input[type="text"], textarea').reset("");
  }

//   $ul.on('click', 'modal', handleModal);

function handleModal(evt) {
    $modal(evt.target.dataset.url, true);
}
$img.on("click", generateModal);


//   function generateModal(evt) {
//     $modal.modal();
//     const instance = M.Modal.getInstance($modal);
//   }

// $(".modal-trigger").on("click", generateModal)
// $(document).ready(function(){
    
//     )};




//     event.preventDefault();
//     userInput = $input.val();
//     $.ajax({
// 		url:baseUrl  + userInput + `&type=video&key=${config.API_KEY}` 
//     }).then(
//         (data)=> { 
//             videoData = data.items;
//             // console.log("DATA IS ", data.items)
// 			Modal.render();
//         }, 
//         (error) => { 

//             console.log("ERROR IS ", error)
//         })
// }

// function Modal.render() {

// }

// // document.addEventListener("DOMContentLoaded", function(){
// //     const box = document.querySelectorAll(".modal");
// //     M.Modal.init(box,{});

// // })
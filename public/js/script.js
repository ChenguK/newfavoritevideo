const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q='

let videoData, userInput, instance, nextPageToken;
let playHistory = [];

const $ul  = $('.collection');
const $title = $('#title');
const $channel = $('#channel');
const $description = $('#description');
const $img = $('img');
const $input = $("input[type='text']");
const $modal = $('.modal');
const $modalimg = $('.modal-content .modalimg');
const $imglink = $('#imglink');
const form = document.querySelector("form");
const resultsList = document.querySelector(".results-list");

function playVideo(videoId) {

    const iframe = document.getElementById("videoPlayer");

    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    // Hide image
    document.querySelector(".hero-image").classList.add("hidden");

    // Show media area
    document.querySelector(".hero-media").classList.remove("hidden");

    // Make sure video wrapper is visible
    document.querySelector(".hero-video").classList.remove("hidden");

    // Scroll to top smoothly
    window.scrollTo({
        top: 0,
        behavior: "smooth"
})
};

localStorage.removeItem('playHistory');


$(document).ready(function(){
      $modal.modal();  
     instance = M.Modal.getInstance($modal);
    });

function handleClick(evt) {
        getVideos(evt.target.dataset.url, true); 
    }
// when the user clicks the li, run
$ul.on("click", "li", function() {
    const thumbSrc = $(this).data("thumb");
    handleOpenModal(thumbSrc);
});



$("form").on("submit", getVideos);
function getVideos(evt) {
    evt.preventDefault();
    userInput = $input.val();
    localStorage.setItem('lastSearch', userInput);
    $.ajax({
        url:`/api/search?search=${userInput}`,
    }).then(
        (data)=> { 
            videoData = data.items;
            console.log(data);
			render();
        }, 
        (error) => { 

            console.log("ERROR IS ", error)
        })
}



function generateHTml() { 
    return videoData.map(function(v) {
        return `
        <li class="collection-item video-item"
            data-id="${v.id.videoId}"
            data-thumb="${v.snippet.thumbnails.medium.url}">
            <div class="video-text">
                <h6 class="teal-text">${v.snippet.title}</h6>
                <p>${v.snippet.channelTitle}</p>
            </div>
            <img class="thumbnail" 
                src="${v.snippet.thumbnails.medium.url}" 
                alt="video thumbnail">
        </li>`
    })
}

function render() {
    const html = generateHTml().join("");
    $('h6').html(`Results for '${userInput}'<br><br>`);
    $ul.html(html);
    document.querySelector('.hero-section').classList.add('results-active');
    document.querySelector('.hero-video').classList.add('hidden');
    document.querySelector('.hero-image').classList.remove('hidden');
    document.querySelector('.hero-title').classList.add('hidden');
    document.querySelector('.hero-image').classList.add('small');
    document.getElementById('videoPlayer').src = "";
    document.getElementById('hero-video-title').textContent = "";
    document.getElementById('hero-video-channel').textContent = "";



}

function handleOpenModal(imgsrc){
   const videoObject = videoData.find(function(video){

        return video.snippet.thumbnails.medium.url === imgsrc;
    });

    $imglink.off();

    $imglink.off().click(function(){

    const videoId = videoObject.id.videoId;
    document.getElementById("hero-video-title").textContent=videoObject.snippet.title;
    document.getElementById("hero-video-channel").textContent=videoObject.snippet.channelTitle;


    // Close modal
    instance.close();

    // Hide image
    document.querySelector('.hero-image').classList.add('hidden');

    // Show video container
    document.querySelector('.hero-media').classList.remove('hidden');
    document.querySelector('.hero-video').classList.remove('hidden');
    document.querySelector('#hero-video-title').classList.remove("hidden");
    document.querySelector('#hero-video-channel').classList.remove("hidden");




    // Inject video
    const iframe = document.getElementById('videoPlayer');
        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;

        window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

        // Add to history
    const historyItem = {
        id: videoObject.id.videoId,
        title: videoObject.snippet.title,
        channel: videoObject.snippet.channelTitle
};

form.addEventListener("submit", async (e) => {
    e.preventDefault();

});



addToHistory(historyItem);

});

    $title.html(videoObject.snippet.title);
    $channel.html(videoObject.snippet.channelTitle);
    $description.html(videoObject.snippet.description);
    $modalimg.attr("src", videoObject.snippet.thumbnails.high.url);
    $imglink.attr('href', 'https://www.youtube.com/watch?v=' + videoObject.id.videoId + 'id=redirect');
    instance.open();
    }

document.querySelector('.history-list')
.addEventListener('click', function(e) {

    if (!e.target.dataset.id) return;

    const videoId = e.target.dataset.id;

    document.querySelector('.hero-image')
        .classList.add('hidden');
    
    document.querySelector('.hero-media')
        .classList.remove('hidden');

    document.getElementById('videoPlayer').src =
        `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
    document.querySelector('.hero-image').classList.add('small');

        window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


        
});





function submitForm() {
    $('form[name="contact-form"]').submit();
    $input.reset("");
  };

  function addToHistory(video) {

    // Prevent duplicates (move to top instead)
    playHistory = playHistory.filter(item => item.id !== video.id);

    playHistory.unshift(video);

    // Limit to 5 items
    if (playHistory.length > 5) {
        playHistory.pop();
    }

    sessionStorage.setItem('playHistory', JSON.stringify(playHistory));

    renderHistory();
}

function renderHistory() {

    const historySection = document.querySelector('.history-section');
    const historyList = document.querySelector('.history-list');

    if (playHistory.length === 0) {
        historySection.classList.add('hidden');
        return;
    }

    historySection.classList.remove('hidden');

    historyList.innerHTML = playHistory.map(video => `
        <li data-id="${video.id}">
            ▶ ${video.title}  
            👤 ${video.channel}
        </li>
    `).join('');
    
}


  document.addEventListener('DOMContentLoaded', function() {
    renderHistory();
});

  

  localStorage.setItem("server", $input);

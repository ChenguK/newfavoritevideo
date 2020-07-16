const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q='

const footerUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&order=viewCount&pageToken=CAoQAA&q='

let videoData, userInput, instance;

const $ul  = $('.collection');
const $title = $('#title');
const $channel = $('#channel');
const $description = $('#description');
const $img = $('img');
// const $video = $('.modal-content .video-container');
const $input = $("input[type='text']");
const $modal = $('.modal');
const $modalimg = $('.modal-content .modalimg');
const $imglink = $('#imglink');
const $footerbtn = $('.button');

$(document).ready(function(){
      $modal.modal();  
     instance = M.Modal.getInstance($modal);
    });


function handleClick(evt) {
        getVideos(evt.target.dataset.url, true); 
    }

$ul.on("click", "img", function(evt){
    handleOpenModal(evt.target.src);
    render();
})

$("form").on("submit", getVideos);
function getVideos(evt) {
    event.preventDefault();
    userInput = $input.val();
    $.ajax({
        url:baseUrl  + userInput + `&type=video&key=${config.API_KEY}`,
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
        <li class="collection-item"><div><b class="blue-grey-text">${v.snippet.title}</b><div class="secondary content"><img class="thumbnail right" src=${v.snippet.thumbnails.medium.url} alt="video thumbnail"></i><br><b>${v.snippet.channelTitle}<b>
        </div>
        </li>`
    })
}

function render() {
    const html = generateHTml().join("");
    $('h5').html(`Results for ${userInput}`);
    $ul.html(html);
}

function handleOpenModal(imgsrc){
   const videoObject = videoData.find(function(video){

        return video.snippet.thumbnails.medium.url === imgsrc;
    });

    $imglink.off();

        $imglink.click(function(){
            // window.open is 
            window.open('https://www.youtube.com/watch?v=' + videoObject.id.videoId + 'target=_blank');
    });

    $footerbtn.click(function() {
        const footerLink = footerUrl + userInput +`&type=video&key=${config.API_KEY}`
        render(footerLink);
    });


    

    $title.html(videoObject.snippet.title);
    $channel.html(videoObject.snippet.channelTitle);
    $description.html(videoObject.snippet.description);
    $modalimg.attr("src", videoObject.snippet.thumbnails.high.url);
    $imglink.attr('href', 'https://www.youtube.com/watch?v=' + videoObject.id.videoId + 'id=redirect' + 'target=_blank');
    // $footerbtn.attr('href', footerUrl)
    instance.open();
}

function submitForm() {
    $('form[name="contact-form"]').submit();
    $('input[type="text"], textarea').reset("");
  };







const baseUrl = 'https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q='
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

$(document).ready(function(){
      $modal.modal();  
     instance = M.Modal.getInstance($modal);
    });


    
    // $modal.on("click", modalimg, function(evt){
        
    // })

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
        <li class="collection-item"><div><b class="blue-grey-text">${v.snippet.title}</b><div class="secondary content"><img class="thumbnail" src=${v.snippet.thumbnails.medium.url} alt="video thumbnail"></i><br>${v.snippet.channelTitle}
        </div>
        </li>`
    })
}

function render() {
    const html = generateHTml().join("");
    $('h3').html(`Results for${userInput}`);
    $ul.html(html);
}

function handleOpenModal(imgsrc){
   const videoObject = videoData.find(function(video){

        return video.snippet.thumbnails.medium.url === imgsrc;
    });

    $(document).ready(function(){
        $modalimg.find(function() {
            $imglink.click(function(){
                open('https://www.youtube.com/watch?v=' + videoObject.id.videoId + 'target=_blank');
    })
 })
})


    $title.html(videoObject.snippet.title);
    $channel.html(videoObject.snippet.channelTitle);
    $description.html(videoObject.snippet.description);
    // $video.attr("src", `"https://www.youtube.com/embed/` + videoObject.id.videoId);
    $modalimg.attr("src", videoObject.snippet.thumbnails.high.url);
    $imglink.attr('href', 'https://www.youtube.com/watch?v=' + videoObject.id.videoId + 'id=redirect' + 'target=_blank');
    instance.open();
}

function submitForm() {
    $('form[name="contact-form"]').submit();
    $('input[type="text"], textarea').reset("");
  }







$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
        var news = $("<div class=\"card shadow p-3 mb-5 bg-white rounded\">")
        var header = $("<div class=\"card-header\">");
        var articles = $("<div class=card-body>");
        
        header.append($(`<h3 class=\"display-7 ${data[i]._id}\">${data[i].Headline}</h3>`))
        news.append(header)
        articles.append(`<p class=\"card-text ${data[i]._id}\">${data[i].Summary}</p>`)
        articles.append(`<a href="${data[i].URL}" class="btn btn-primary">Go to Article</a>`)
        articles.append(`<button id=saveBtn class="btn btn-secondary" value=${data[i]._id}>Save Article</button>`)
        news.append(articles);

        $("#articleBtn").prepend(news);
    }
});

$("body").on("click", "button#saveBtn" ,function(){
    console.log($(this).val());

    $.ajax({
        method: "POST",
        url: "/articles/" + $(this).val(),
    }).then(function(data) {
        console.log(data);
    })
})

$("#newArt").on("click", function(){
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data) {
        $(".modal-body").append(`<p class=card-text>They are ${data} new articles</p>`)
    })
})

$("addArt").on("click", function(){

})
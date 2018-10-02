$.getJSON("/articles/saved", function(data) {
    for (var i = 0; i < data.length; i++) {
        var news = $("<div class=\"card shadow p-3 mb-5 bg-white rounded\">")
        var header = $("<div class=\"card-header\">");
        var articles = $("<div class=card-body>");
        
        header.append($(`<h3 class=\"display-7 ${data[i]._id}\">${data[i].Headline}</h3>`))
        news.append(header)
        articles.append(`<p class=\"card-text ${data[i]._id}\">${data[i].Summary}</p>`)
        articles.append(`<button class="noteBtn btn btn-primary" data-toggle="modal" data-target="#exampleModal" data-val=\"${data[i]._id}\" data-title=\"${data[i].Headline}\">Article Notes</button>`)
        articles.append(`<button id=deleteBtn class="btn btn-secondary" value=${data[i]._id}>Delete From Saved</button>`)
        news.append(articles);

        $("#saveArticleBtn").prepend(news);
    }
});

$("body").on("click", "button.noteBtn" ,function(){
    $(".modal-title").text($(this).attr("data-title"))
    $(".modal-title").attr("data-idVal", $(this).attr("data-val"))
})

$("body").on("click", "button#deleteBtn" ,function(){
    $.ajax({
        method: "POST",
        url: "/saveDelete/" + $(this).val()
    }).then(function(data) {
        location.reload(true);
        console.log("tobe delete")
    })
})

$("#addNotes").on("click", function(){
    console.log($(".articleNotes").val());
    console.log($(".modal-title").attr("data-idVal"))


    $(".articleNotes").val("")
})
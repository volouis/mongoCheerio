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

    $.ajax({
        method: "GET",
        url: "/preNote/" + $(this).attr("data-val")
    }).then(function(data){
        $(".oldNotes").empty();
        if(typeof data.note !== 'undefined'){
            $.ajax({
                method: "GET",
                url: "/note/" + data.note
            }).then(function(dat){
                console.log(dat)
                var note = $(`<div class="noteContain" style="border: 1px solid; border-radius: 5px;">`)
                note.append(`<p style="text-align: center;">${dat[0].body}</p>`)
                note.append(`<button id="deleteNote" type="button" class="btn btn-danger" value=${dat[0]._id}>X</button>`)
                
                $(".oldNotes").append(note)
            })
        }
    })
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
    $.ajax({
        method: "POST",
        url: "/artNote/" + $(".modal-title").attr("data-idVal"),
        data: {
            body: $(".articleNotes").val()
        }
    }).then(function(data) {
        console.log("added note")
    })
    $(".articleNotes").val("")
})

$(".modal-content").on("click", "button#deleteNote", function(){
    console.log($(".modal-title").attr("data-idval"))

    $.ajax({
        method:"POST",
        url: "/deleteNote/" + $(this).val()
    }).then(function(dat){
        $(".oldNotes").empty();
    })

    // $.ajax({
    //     method: "POST",
    //     url: "/deleteArtNote/" + $(".modal-title").attr("data-idval")
    // }).then(function(data){
    //     console.log(data);
    //     $.ajax({
    //         method:"PUT",
    //         url: "deleteNote" + $(this).val()
    //     }).then(function(dat){
    //         console.log(dat)
    //     })
    // })
})
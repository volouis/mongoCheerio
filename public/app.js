$("#newArt").on("click", function(){
    $.ajax({
        method: "GET",
        url: "/articles"
    }).then(function(data) {
        
    })
})
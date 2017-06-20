// Grab the articles as a json
// $.getJSON("/articles", function(data) {
// 	$("#unload").empty();
//   // For each one
//   for (var i = 0; i < data.length; i++) {
//   var entryWrapper = $('<div>')
//   var entryHeader = $('<div>')
//   var entryBody = $('<div>')

//     // Display the apropos information on the page
//     // $("#unload").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//     $("#unload").append(entryWrapper)
//     entryWrapper.addClass("panel entryWrapper")
//     entryWrapper.attr("data-id", data[i]._id)
//     entryWrapper.append(entryHeader)
//     entryWrapper.append("<button class='btn btn-danger saveArticle'>" + "Save Article" + "</button>")
//     entryHeader.addClass("panel-heading entryHeader")
//     // entryHeader.attr("data-id", data[i]._id)
//     entryHeader.append("<h3 class='panel-title entryTitle'>" + data[i].title + "</h3>")
//     // entryHeader.append("<h3 class='panel-title entryTitle'>" + data[i].title + "</h3>" + "<button class='btn btn-danger saveArticle'>" + "Save Article" + "</button>")
//     entryWrapper.append(entryBody)
//     entryBody.addClass("panel-body entryBody")
//     entryBody.append(data[i].link)


//   }
// });

// Grab the saved articles as a json
// $(document).on("click", "#savedArticles", function() {
//  $.ajax({
//     method: "GET",
//     url: "/savedarticles"
//     }).done(function(data) {
//       console.log(data);
//       $("#unload").empty();
//       // For each one
//           for (var i = 0; i < data.length; i++) {
//       var entryWrapper = $('<div>')
//       var entryHeader = $('<div>')
//       var entryBody = $('<div>')

//       // Display the apropos information on the page
//       // $("#unload").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
//       $("#unload").append(entryWrapper)
//       entryWrapper.addClass("panel entryWrapper")
//       entryWrapper.attr("data-id", data[i]._id)
//       entryWrapper.append(entryHeader)
//       entryWrapper.append("<button class='btn btn-danger saveArticle'>" + "Delete Article" + "</button>")
//       entryWrapper.append("<button class='btn btn-primary saveArticle'>" + "Add Note" + "</button>")
//       entryHeader.addClass("panel-heading entryHeader")
//       // entryHeader.attr("data-id", data[i]._id)
//       entryHeader.append("<h3 class='panel-title entryTitle'>" + data[i].title + "</h3>")
//       // entryHeader.append("<h3 class='panel-title entryTitle'>" + data[i].title + "</h3>" + "<button class='btn btn-danger saveArticle'>" + "Save Article" + "</button>")
//       entryWrapper.append(entryBody)
//       entryBody.addClass("panel-body entryBody")
//       entryBody.append(data[i].link)


//     }
//     });

// });


//on click changes the "saved" to true
$(document).on("click", ".saveArticle", function() {
  var thisId = $(this).parent().parent().attr("data-id");
  console.log("saved article: " + thisId) //gets the id from the wrapper
  location.reload();
    $.ajax({
    method: "POST",
    url: "/savedarticles/" + thisId
    });
});


//on click changes the saved to false, deleting article from saved articles
$(document).on("click", "#deleteArticle", function() {
  var thisId = $(this).attr("data-id");
  console.log("Delete saved article: " + thisId) //gets the id from the button
  location.reload();
    $.ajax({
    method: "POST",
    url: "/deletesavedarticle/" + thisId
    });
});

//on click of the add note button, it will get the notes and append it onto the modal
$(document).on("click", "#addNoteButton", function(){
  var thisId = $(this).attr("data-id");
  $("#articleID").html(thisId);
  $.ajax({
    method: "GET",
    url: "/findNotesToThisId/" + thisId
    }).done(function(data){
      console.log("data coming back: " + data);
      $('#addNote').modal('show');
        $('#bodyinput').val('');
        $('#dropArticleNotes').empty();
        $('#submitbuttonhere').empty();
        if(data === null || undefined){
          $('#addNote').find('#dropArticleNotes').append("<h3>No Notes are found to this Article, Add a Note!</h3>");
        }else{
          $('#addNote').find('#dropArticleNotes').append(data.body);
      }
        $('#submitbuttonhere').append("<button class='btn btn-success' data-id='" + thisId + "' id='submitbutton' type='submit' value='Submit'> Submit </button>")
  });
});





$(document).on("click", "#submitbutton", function() {
  var thisId = $(this).attr("data-id");
  var inputData = $("#bodyinput").val().trim()
  console.log(thisId) //gets the id from the wrapper
    $.ajax({
    method: "POST",
    url: "/submitnote/" + thisId,
    data: {
      body: inputData
    }
    }).done(function(data){

      $('#bodyinput').val('');
      $('#dropArticleNotes').empty();
      $('#submitbuttonhere').empty();
      $('#addNote').modal('hide');
    });
});


$(document).on("click", ".close", function(){
      $('#bodyinput').val('');
      $('#dropArticleNotes').empty();
      $('#submitbuttonhere').empty();
})

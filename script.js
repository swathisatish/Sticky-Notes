
var notes, count = 0;

//** ADDS a new note to the 'notes' list and sets title and content accordingly **//
function addNewNote(className, title, content) {

    // add a new note to the end of the list
    notes.append("<li><div class='" + className + "'>" + 
                    "<textarea class='note-title' placeholder='Untitled' maxlength='10'/>" + 
                    "<textarea class='note-content' placeholder='Your content here'/>" + 
                    "<img class='close' height='30' width='30' src='close.png'/>" + 
                    "</div></li>");

    // get the new note that's just been added
    var newNote = notes.find("li:last");
    newNote.find("img").click(function () {
        // remove the note and save
        newNote.remove();
        saveNotes();
    });

    // if a title is provided then set the title of the new note
    if (title) {
        // get the title textarea element and set its value
        newNote.find("textarea.note-title").val(title);
    }
    // if a content is provided then set the content of the new note
    if (content) {
        // get the content textarea element and set its value
        newNote.find("textarea.note-content").val(content);
    }
}


//** SAVE the notes into local storage **//
function saveNotes() {

    if(document.getElementById('searchinput').value.length == 0){
        var notesArray = [];
        // for each of the notes add a bespoke note object to the array
        notes.find("li > div").each(function (i, e) {
        // save the class attribute of the div, as well as the text for the title and content text areas
        var colourClass = $(e).attr("class");
        var title = $(e).find("textarea.note-title");
        var content = $(e).find("textarea.note-content");
        notesArray.push({ Index: i, Title: title.val(), Content: content.val()});
        });
        // json encode it
        var jsonStr = JSON.stringify(notesArray);
        // and save the json string into local storage
        localStorage.setItem("notes", jsonStr);  
    }
}


//** LOAD or SHOW all notes saved in the local storage **//
function loadNotes() {
    document.getElementById('searchinput').value = "";
    notes.empty();
    var storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
        // passes the stored json back into an array of note objects
        var notesArray = JSON.parse(storedNotes);
        count = notesArray.length;
        var i;
        for (i = 0; i < count; i++) {
            var storedNote = notesArray[i];
            addNewNote(storedNote.Class, storedNote.Title, storedNote.Content);
        }
    }
}


//** SEARCH notes saved in local storage **//
function search() {
    var storedNotes = localStorage.getItem("notes");
    input = document.getElementById('searchinput');
    filter = input.value;

    // Loop through all list items, and hide those who don't match the search query
    if(filter){
        if (storedNotes) {
            var notesArray = JSON.parse(storedNotes);
            for (i = 0; i < notesArray.length; i++) {
                a = notesArray[i].Title;
                var str = a.toLowerCase();
                if (str.indexOf(filter) > -1) {
                    var storedNote = notesArray[i];
                    notes.empty();
                    addNewNote(storedNote.Class, storedNote.Title, storedNote.Content);
                }
            }
        }
    }
    else{
        loadNotes();
    }

}


$(document).ready(function () {
    // get references to the 'notes' list
    notes = $("#notes");
    // load notes from local storage if one's available
    loadNotes();
    // clicking the 'New Note' button adds a new note to the list
    $("#btnNew").click(function () {
        if(document.getElementById('searchinput').value.length > 0){
            document.getElementById('searchinput').value = "";
            loadNotes();
        }

        document.getElementById('searchinput').value = "";
        addNewNote();
    });
    // add a note to the list if there aren't any
    if (count === 0) {
        $("#btnNew").click();
    }
});

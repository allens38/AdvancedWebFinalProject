//API - URL endpoint
let url = "http://localhost:8080/ajax/";
let books =[];

//process AJAX Calls
function processAJAX(type='GET',id='',data=''){
        //create AJAX call
        if(type=='GET' || type=='DELETE'){
            data= null
        }else{
            data = JSON.stringify(data)
        }


        //getting value from radio button
        let ajaxType = $("#ajax").is(":checked");



        if(ajaxType== 'ajax'){
            console.log("XMLHttp");

        var xhr = new XMLHttpRequest();
        xhr.open(type,url + id);
        xhr.setRequestHeader('Content-type', 'application/json','char-set=utf-8');
        xhr.send(data);
        xhr.onreadystatechange = ()=>{
            if(xhr.readyState == 4 && xhr.status == 200){
                //Convert data to JSON
                books = JSON.parse(xhr.responseText);
                processResult(books, type);
            }
        }
        xhr.error= ()=>{
            $("#result").html("Error.Cannot get data");
        }
    }else{
        //jquery
        console.log('JQ');
        $.ajax({
            method:type,
            url: url + id,
            data: data,
            contentType:'application/json'
        })
        .done((data)=>{
            books = data;
            processResult(books, type);
        })
        .fail((data)=>{
            $("#result").html("Error.Cannot get data");
        })
    }
}

$(document).ready(() => {
    // GET BUTTON
    $("#btn-get").click(() => {
        console.log("GET button clicked");
        $("#ajax-form").show();
        $("#result").hide();
        $("#ajax-form").html(getDeleteForm('get'));
        $("#go-get-delete").click(()=>{
            let id = $("form-get-delete #id").val();
            processAJAX('GET',id,'')
        
        })
    })

    // DELETE BUTTON
    $("#btn-delete").click(() => {
        $("#ajax-form").show();
        $("#result").hide();
        $("#ajax-form").html(getDeleteForm('delete'));
        $("#btn-get").click(() => {
            $("#ajax-form").show();
            $("#result").hide();
            $("#ajax-form").html(getDeleteForm('get'));
            $("#go-get-delete").click(()=>{
                let id = $("form-get-delete #id").val();
                processAJAX('DELETE',id,'')
            })
        })
    })

        // POST BUTTON
        $("#btn-post").click(() => {
        $("#ajax-form").show();
        $("#result").hide();
            $("#ajax-form").html(postPutForm('post'));
        $("#go-post").click(()=>{
            let book = buildBookObject();
            
            processAJAX('POST', '',book);
        });
        })

        // PUT BUTTON
        $("#btn-put").click(() => {
        $("#ajax-form").show();
        $("#result").hide();
        processAJAX('GET');
        //$("#ajax-form").html(postPutForm('put'));
        });
});

function getDeleteForm(type){
    message = "Fetch Books";
    if(type=='delete'){
        message="Delete Books";
    }
    return(`
        <h1> ${message}</h1>
        <form id="form-get-delete" onsubmit="return false;">
            <div class="form-controls">
            <label for="id">ID:</label>
            <input name="id" id="id">
            <p>(Leave blank to request all records)</p>
        </div>
        <div class="form-controls">
        <button id="go-get-delete">Submit</button>
        </div>
        </form>
    
    `
    );
}

function postPutForm(type){
    message="Insert A New Book";
    disabled = " ";
    if(type=='put'){
        message="Update A Book";
        disabled = "disabled";
    }
    return(`

        <h1>${message}</h1>
        <form id="form-put-post" onsubmit="return false;">
            <div class="form-controls">
                <label for="id">ID:</label>
                <input name="id" id="id" ${disabled}>
            </div>
            <div class="form-controls">
                <label for="title">TITLE:</label>
                <input name="title" id="title">
            </div>
            <div class="form-controls">
                <label for="author">AUTHOR:</label>
                <input name="author" id="author">
            </div>
            <div class="form-controls">
                <label for="publisher">PUBLISHER:</label>
                <input name="publisher" id="publisher">
            </div>
            <div class="form-controls">
                <label for="year">YEAR:</label>
                <input name="year" id="year">
            </div>
            <div class="form-controls">
            <button id="go-${type.toLowerCase()}">Submit</button>
            </div>

        </form>
        `
    );
}

//Build book table
function bookTable(books) {
    let str = `
    <h1>Books</h1>
    <table class="table-books" cellpadding="0" cellspacing="0">
        <thead>
            <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Year</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>`;

    books.forEach(book => {
        str += `
        <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.publisher}</td>
            <td>${book.year}</td>
            <td>
                <button onclick="prepareUpdate(${book.id})">Edit</button>
                <button onclick="prepareDelete(${book.id})">Delete</button>
            </td>
        </tr>
        `;
    });

    str += `
        </tbody>
    </table>`;
    return str;
}

//PROCESS RESULT

function processResult(books,method){
    $("#ajax-form").hide();
    $("#result").show();
    switch(method){
        case 'GET':
            $("#result").html(bookTable(books));
            break;
        case 'PUT':
            $("#result").html(books);
            break;
        case 'POST':
            $("#result").html(books);
            break;
        case 'DELETE':
            $("#result").html(books);
            break;
    }
}
//PREPARE DELETE
function prepareDelete(id){
    processAJAX('DELETE',id,'');
}
//PREPARE UPDATE
function prepareUpdate(id){
    $("#ajax-form").html(postPutForm('put'));
    $("#ajax-form").show();
    $("#result").hide();

    let index = books.findIndex(book => book.id==id);
    if(index != -1){
        let book = books[index];

        //Prefill form
        $("#form-put-post #id").val(book.id);
        $("#form-put-post #title").val(book.title);
        $("#form-put-post #author").val(book.author);
        $("#form-put-post #publisher").val(book.publisher);
        $("#form-put-post #year").val(book.year);
    }
    $("#go-put").click(()=>{
        let newBook = buildBookObject();
        processAJAX('PUT', newBook.id,newBook);
    })
    
}

//Build Book Object
function buildBookObject(){
    return {
        "id":$('#form-put-post #id').val(),
        "title":$('#form-put-post #title').val(),
        "author":$('#form-put-post #author').val(),
        "publisher":$('#form-put-post #publisher').val(),
        "year":$('#form-put-post #year').val(),
    }
}
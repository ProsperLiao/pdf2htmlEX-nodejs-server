var getTasks, startTask, cancelTask, deleteTask;

$(function () {
  getTasks = function() {
    $.ajax('/api/conversion').then(data => {
      $('#tasks-list').empty();
      $.each(data, function (i, task) {
        var taskDiv = `
            <tr>
              <td>${task.id}</td>
              <td>${task.originFileName}</td>
              <td>${task.filePath ?  `<a href="${task.filePath}" target="_blank">Open</a>` : "Not Available"}</td>
              <td>${task.convertedFilePath ? `<a href="${task.convertedFilePath}" target="_blank">Open</a>` : "Not Available"}</td>
              <td>${task.zipFilePath ?  `<a href="${task.zipFilePath}" target="_blank">Download</a>` : "Not Available"}</td>
              <td>${task.splitPages}</td>
              <td>${task.status}</td>
              <td>${task.current}/${task.total}</td>
              <td>${task.convertDuration}</td>
              <td>
                ${task.status === 'cancelled' ? `
                <Button class="btn btn-primary my-1 d-inline-block" type="button" onclick="startTask(${task.id})">
                  Start
                </Button>
                <Button class="btn btn-danger my-1 d-inline-block" type="button" onclick="deleteTask(${task.id})">
                  Delete
                </Button>
                ` : task.status === 'done' ? `
                <Button class="btn btn-danger my-1 d-inline-block" type="button" onclick="deleteTask(${task.id})">
                  Delete
                </Button>
                ` : task.status === 'pending' ? `
                <Button class="btn btn-primary my-1 d-inline-block" type="button" onclick="getTasks()">
                  Refresh
                </Button>
                <Button class="btn btn-warning my-1 d-inline-block" type="button" onclick="cancelTask(${task.id})">
                  Cancel
                </Button>
                <Button class="btn btn-danger my-1 d-inline-block" type="button" onclick="deleteTask(${task.id})">
                  Delete
                </Button>
                `
                :  task.status === 'converting' ? `
                <Button class="btn btn-primary my-1 d-inline-block" type="button" onclick="getTasks()">
                  Refresh
                </Button> 
                `
                : `
                 <Button class="btn btn-primary my-1 d-inline-block" type="button" onclick="startTask(${task.id})">
                  Start
                </Button>
                <Button class="btn btn-warning my-1 d-inline-block" type="button" onclick="cancelTask(${task.id})">
                  Cancel
                </Button>
                <Button class="btn btn-danger my-1 d-inline-block" type="button" onclick="deleteTask(${task.id})">
                  Delete
                </Button>
                `}
              </td>
              <td>${new Date(task.createdAt).toLocaleString() }</td>
            </tr>`;
        setTimeout(
          function(){
            $('#tasks-list').append(taskDiv);
          }
        );
      });
    });
  }

  $('#validatedCustomFile').on('change',function(){
    //get the file name
    var fileName = $(this).val();
    $('#upload_progress').text(``);
    $('#upload_button').attr('disabled', false);
    fileName = fileName || 'Choose file...';
    //replace the "Choose a file" label
    $(this).next('.custom-file-label').html(fileName);
  })

  // this is the id of the form
  $('#uploadForm').submit(function(e) {
    $('#upload_button').attr('disabled', true);
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var form = $(this);
    var url = form.attr('action');
    var formData = new FormData(this);
    $.ajax({
      xhr: function()
      {
        const xhr = new window.XMLHttpRequest();
        //Upload progress
        xhr.upload.addEventListener("progress", function(evt){
          if (evt.lengthComputable) {
            const percentComplete = Math.floor(evt.loaded * 100 / evt.total);
            $('#upload_progress').text(`${percentComplete}%`);
          }
        }, false);
        return xhr;
      },
      url: url,
      type: "POST",
      data: formData,
      contentType: false,
      cache: false,
      processData:false,
    }).done(function(data) {
      $('#validatedCustomFile').val('');
      $('#validatedCustomFile').next('.custom-file-label').html('Choose file...');
      getTasks();
    });
  });

  startTask = function(taskid) {
    $.ajax({
      url: `/api/conversion/${taskid}/start`,
      type: 'GET',
      success: function (result) {
        getTasks();
      }
    })
  }

  cancelTask = function(taskid) {
    $.ajax({
      url: `/api/conversion/${taskid}/cancel`,
      type: 'PUT',
      success: function (result) {
        getTasks();
      }
    })
  }

  deleteTask = function(taskid) {
    $.ajax({
      url: `/api/conversion/${taskid}`,
      type: 'DELETE',
      success: function (result) {
        getTasks();
      }
    })
  }

  getTasks();
});

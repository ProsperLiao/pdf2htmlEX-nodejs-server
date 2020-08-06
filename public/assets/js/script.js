var getTasks, startTask, cancelTask, deleteTask, formatBytes;
var getUsers, deleteUser, changeUserPwd;
var token;

$(function () {

  formatBytes = function(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024,
      dm = decimals < 0 ? 0 : decimals,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
  }

  getTasks = function() {
    $.ajax('/api/conversions').then(data => {
      $('#tasks-list').empty();
      $.each(data, function (i, task) {
        var taskDiv = `
            <tr>
              <td>${task.id}</td>
              <td>${task.originFileName}</td>
              <td>${formatBytes(task.originFileSize)}</td>
              <td>${task.filePath ?  `<a href="${task.filePath}" target="_blank">Open PDF</a>` : "Not Available"}</td>
              <td>${task.convertedFilePath ? `<a href="${task.convertedFilePath}" target="_blank">Open Html</a>` : "Not Available"}</td>
              <td>${task.zipFilePath ?  `<a href="${task.zipFilePath}" target="_blank">Download</a>` : "Not Available"}</td>
              <td>${task.splitPages}</td>
              <td>${task.status}</td>
              <td>${task.current}/${task.total}</td>
              <td>${task.convertDuration}</td>
              <td>${task.creator_username}</td>
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
    }).fail(function(xhr, textStatus, error){
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });;
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
    e.preventDefault(); // avoid to execute the actual submit of the form.
    var fileExtension = ['pdf'];
    if ($.inArray($('#validatedCustomFile').val().split('.').pop().toLowerCase(), fileExtension) == -1) {
      alert("Only formats are allowed : "+fileExtension.join(', '));
      return;
    }
    $('#upload_button').attr('disabled', true);
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
      $('#upload_button').attr('disabled', false);
      getTasks();
    }).fail(function(xhr, textStatus, error){
      $('#validatedCustomFile').val('');
      $('#validatedCustomFile').next('.custom-file-label').html('Choose file...');
      $('#upload_button').attr('disabled', false);
      $('#upload_progress').text(``);
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });
  });

  startTask = function(taskid) {
    $.ajax({
      url: `/api/conversions/${taskid}/start`,
      type: 'GET',
      success: function (result) {
        getTasks();
      }
    }).fail(function(xhr, textStatus, error){
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });
  }

  cancelTask = function(taskid) {
    $.ajax({
      url: `/api/conversions/${taskid}/cancel`,
      type: 'PUT',
      success: function (result) {
        getTasks();
      }
    }).fail(function(xhr, textStatus, error){
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });
  }

  deleteTask = function(taskid) {
    $.ajax({
      url: `/api/conversions/${taskid}`,
      type: 'DELETE',
      success: function (result) {
        getTasks();
      }
    }).fail(function(xhr, textStatus, error){
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });
  }


  /****** users **********/
  getUsers = function() {
    $.ajax('/api/users').then(data => {
      $('#users-list').empty();
      $.each(data.data, function (i, user) {
        var usersDiv = `
            <tr>
              <td>${user.id}</td>
               <td>${user.username}</td>
              <td>${user.desc}</td>
              <td>${user.role}</td>
              <td>
                <Button class="btn btn-primary my-1 d-inline-block" type="button" onclick="changeUserPwd(${user.id})">
                  Change Password
                </Button>
                <Button class="btn btn-danger my-1 d-inline-block" type="button" onclick="deleteUser(${user.id})">
                  Delete
                </Button>
              </td>
              <td>${new Date(user.createdAt).toLocaleString() }</td>
            </tr>`;
        setTimeout(
          function(){
            $('#users-list').append(usersDiv);
          }
        );
      });
    }).fail(function(xhr, textStatus, error){
        var json = JSON.parse(xhr.responseText);
        alert(json.error.message);
    });
  }

  deleteUser = function(userid) {
    $.ajax({
      url: `/api/users/${userid}`,
      type: 'DELETE',
      success: function (result) {
        getUsers();
      },
    }).fail(function(xhr, textStatus, error){
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });
  }

  changeUserPwd = function(userid) {
    var oldPwd = prompt('enter old passward');
    if (!oldPwd || oldPwd.length < 3 ) {
      alert('password must be more than 3 letters and less than 255 letters');
      return;
    }
    var newPwd = prompt('enter new password');
    if (!newPwd || newPwd.length < 3 ) {
      alert('new password must be more than 3 letters and less than 255 letters');
      return;
    }
    var confirmPwd = prompt('confirm new password');
    if (confirmPwd !== newPwd) {
      alert ('new password is not same with the one input second time.');
      return;
    }
    $.ajax({
      url: `/api/users/${userid}/password`,
      type: 'PUT',
      data: `old_password=${oldPwd}&new_password=${newPwd}`,
      success: function (result) {
        getUsers();
      },
    }).fail(function(xhr, textStatus, error){
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });
  }

  $('#userForm').submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $('#user_submit_button').attr('disabled', true);
    var form = $(this);
    var url = form.attr('action');
    $.ajax({
      xhr: function()
      {
        const xhr = new window.XMLHttpRequest();
        return xhr;
      },
      url: url,
      type: "POST",
      data: form.serialize(),
      cache: false,
      processData:false,
    }).done(function(data) {
      $('#user_submit_button').attr('disabled', false);
      $('#username').val('');
      $('#password').val('');
      $('#desc').val('');
      alert('User created successfully!');
      getUsers();
    }).fail(function(xhr, textStatus, error){
      $('#user_submit_button').attr('disabled', false);
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });
  });

  /********** login & logout page logic ********/

  $('#loginForm').submit(function(e) {
    e.preventDefault(); // avoid to execute the actual submit of the form.
    $('#login_form_btn').attr('disabled', true);
    var form = $(this);
    var url = form.attr('action');
    $.ajax({
      xhr: function()
      {
        const xhr = new window.XMLHttpRequest();
        return xhr;
      },
      url: url,
      type: "POST",
      data: form.serialize(),
      cache: false,
      processData:false,
    }).done(function(data) {
      $('#login_form_btn').attr('disabled', false);
      $('#loginform_inputUsername').val('');
      $('#loginform_inputPassword').val('');
      token = data.data;
      window.localStorage.setItem('token', JSON.stringify(token));
      $.ajaxSetup({
        beforeSend: function(xhr) {
          if (token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + token.accessToken.token);
          }
        }
      });
      toggleLoginPageView();
    }).fail(function(xhr, textStatus, error){
      $('#login_form_btn').attr('disabled', false);
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });
  });

  function toggleLoginPageView() {
    if (token) {
      $('#loginForm').hide();
      $('#logout_div').show();
      $('#loginpage_user').html('<div>username: ' + token.user.username + '</div>' + '<div>role: ' + token.user.role + '</div>' + '</div>' + '<div>desc: ' + token.user.desc + '</div>');
      $('#header_login_btn').text(token.user.username);
    } else {
      $('#loginForm').show();
      $('#logout_div').hide();
      $('#loginpage_user').html('');
      $('#header_login_btn').text('login');

    }
  }

  $('#logout_btn').click(function(e){
    $('#logout_btn').attr('disabled', true);
    $.ajax({
      xhr: function()
      {
        const xhr = new window.XMLHttpRequest();
        return xhr;
      },
      url: '/api/logout',
      type: "POST",
      cache: false,
      processData:false,
    }).done(function(data) {
      $('#logout_btn').attr('disabled', false);
      window.localStorage.removeItem('token');
      token = undefined;
      toggleLoginPageView();
    }).fail(function(xhr, textStatus, error){
      $('#logout_btn').attr('disabled', false);
      var json = JSON.parse(xhr.responseText);
      alert(json.error.message);
    });
  });

  token = JSON.parse(window.localStorage.getItem('token'));
  if (token) {
    $.ajaxSetup({
      beforeSend: function (xhr) {
        if (token) {
          xhr.setRequestHeader('Authorization', 'Bearer ' + token.accessToken.token);
        }
      }
    });
  }

  toggleLoginPageView();
  if ($('#tasks-list').length && token) {
    getTasks();
  } else if ($('#users-list').length && token) {
    getUsers();
  }
});

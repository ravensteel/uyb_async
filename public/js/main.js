/*jslint browser: true, white: true, plusplus: true*/ 
/*global  $*/

$(function(){
    "use strict";
    
    var 
        TOTAL = 100,
        STATUS_URL = '/status/',
        RESULT_URL = '/result',
        users;
        
    //init
    $('#btnStart').on('click', btnStartClick_handler);
    
    //handle start button click
    function btnStartClick_handler(event){
        var btn = $(event.target);

        if ( btn.hasClass('disabled')) {
            return;
        }
        
        $('#divAlert').show();
        $('#users').empty();
        btn.addClass('disabled');
        
        process();
    }
    
    
    //load users status sequentially
    function process(){
        var 
            mainDeferred = $.Deferred(),
            nextDeferred = mainDeferred,
            i;
        
        users = [];
        
        for(i=1;i<=TOTAL;i++){
            nextDeferred = loadStatus(i, nextDeferred);
        }
        
        nextDeferred.then(function(){
            allDone();
        });
        
        mainDeferred.resolve();
    }
    
    //load user status as a piped task
    function loadStatus(userId, deferred) {
        return deferred.pipe(function () {
            var 
                xhr = $.get(STATUS_URL + userId);
            
            xhr.done(function(response){
                users.push(response);
                appendUser(response);
            });
            
             $('#divAlert').text('Updating status of user '+userId+' of '+TOTAL);
            
            return xhr;
        });
    }
    
    //update page progress
    function appendUser(data){
        var el = $('<li/>').addClass(data.online?'online':'offline').text(data.user+": ");
        $('#users').append(el);
    }
    
    //called after all users have been querried
    function allDone(){
        //submit all results
        $.ajax({
          type: "POST",
          url: RESULT_URL,
          data: JSON.stringify(users),
          contentType: "application/json; charset=utf-8"
        }).always(function(){
            var 
                online = 0,
                offline = 0;
            
            $('#btnStart').removeClass('disabled');
            
            //some totals
            users.forEach(function(user){
                if (user.online) {
                    online++;
                }
                else{
                    offline++;
                }
            });
                
            //TODO use templating lib
            $('#divAlert').html('<strong>Done !</strong> Total <strong>'+users.length+'</strong> requests made. Online: <strong>'+online+'</strong>. Offline: <strong>'+offline+'</strong>');
            
        });
    }
});
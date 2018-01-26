var qr_string_size = 500;
var qr_image_size = 200;
var playback_delay = 200;

// This method converts the selected file to base64, then chunks up the string based on the specified
// qr_sting size (Note: the larger the chunk size the larger you'll need to set the qr_image_size).
// These Chunks are then converted into QR Codes and displayed in the browser.
// Timeouts are to prevent blocking in the browser

function generateQR(){
  $('#status').text('Processing...');
  setTimeout(function (){
    var files = document.getElementById("uploadInput").files;
    $.each(files, function(index, file){
      var reader = new FileReader();
      reader.readAsDataURL(file);
      // Convert to base64
      reader.onload = function () {
        var base64 = reader.result;
        var strRegExPattern = '.{1,'+ qr_string_size +'}';
        // Chunk that string
        var qr_chunks = base64.match(new RegExp(strRegExPattern,'g'));
        var chunks_length = qr_chunks.length;
        $('#qr_chunks').text('/'+ chunks_length);
        $('#qr_codes').text('');
        setTimeout(function(){
          $.each(qr_chunks, function(i, chunk){
            setTimeout(function(){
              // Create QR Code for Chunk
              $('#current_qr_chunk').text(i + 1);
              var qr_obj_id = 'qrcode_' + i;
              $('#qr_codes').append('<div id="' + qr_obj_id + '" style="margin:10px; max-width: ' + qr_image_size + 'px; display: inline-block">'+i+'</div>');
              $('#' + qr_obj_id).qrcode({render: 'canvas', size: qr_image_size, text: chunk});
              if((i + 1) === chunks_length ){
                $('#status').html('Finished! <br/>' +
                  '<a href="#" onclick="playback()">Playback All</a> <br/>' +
                  '<a href="#" onclick="cancelPlayback = true;">Cancel Playback</a>');
              }
            }, 1);
          });
        },1);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    });
  }, 1);
}

var cancelPlayback = false;
function playback(){
  cancelPlayback = false;
  var all_qrs = $("[id^='qrcode_']");
  var qr_array_size = $(all_qrs).length;
  var current_qr = 0;
  setInterval(function(){
    if(!cancelPlayback){
      $(all_qrs).hide();
      $('#qrcode_'+ current_qr).show();
      if((current_qr) === qr_array_size){
        cancelPlayback = true;
      }
      current_qr ++;
    }else{
      $("[id^='qrcode_']").show();
      current_qr = 0;
    }
  }, playback_delay);
}

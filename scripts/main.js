qr_max_size = 4296;

function generateQR(){
  $('#status').text('Processing... this will take a while...');
  setTimeout(function (){
    var files = document.getElementById("uploadInput").files;
    $.each(files, function(index, file){
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        var base64 = reader.result;
        var qr_chunks = base64.match(/.{1,100}/g);
        var chunks_length = qr_chunks.length;
        $('#qr_chunks').text('/'+ chunks_length);
        $('#qr_codes').text('');
        setTimeout(function(){
          $.each(qr_chunks, function(i, chunk){
            setTimeout(function(){
              $('#current_qr_chunk').text(i + 1);
              var qr_obj_id = 'qrcode_' + i;
              $('#qr_codes').append('<div id="' + qr_obj_id + '" style="margin:10px; max-width: 64px; display: inline-block">'+i+'</div>');
              $('#' + qr_obj_id).qrcode({render: 'div', size: 100, text: chunk});
              if((i + 1) == chunks_length ){
                $('#status').text('Finished!');
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

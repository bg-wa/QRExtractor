var qr_string_size = 1000;
var playback_delay = 200;

// This method converts the selected file to base64, then chunks up the string based on the specified
// qr_sting size (Note: the larger the chunk size the larger you'll need to set the qr_image_size).
// These Chunks are then converted into QR Codes and displayed in the browser.
// Timeouts are to prevent blocking in the browser


var playback_mode;
function processParams(){
    var base64 = getParameterByName('base64');
    if(base64){
        chunk_base64(base64)
    }

    playback_mode = getParameterByName('playback')
}

var chunks_length;
function generateQR() {
    document.getElementById('status').innerHTML = 'Processing...';
    setTimeout(function () {
        var files = document.getElementById("uploadInput").files;
        for (var index = 0; index < files.length; index++) {
            var file = files[index];
            var reader = new FileReader();
            reader.readAsDataURL(file);
            // Convert to base64
            reader.onload = function () {
                var base64 = reader.result;
                chunk_base64(base64)
            };
            reader.onerror = function (error) {
                console.log('Error: ', error);
            };
        }
    }, 1);
}

function chunk_base64(base64){
    var strRegExPattern = '.{1,' + qr_string_size + '}';
    // Chunk that string
    var qr_chunks = base64.match(new RegExp(strRegExPattern, 'g'));
    chunks_length = qr_chunks.length;
    document.getElementById('qr_chunks').innerHTML = '/' + chunks_length;
    document.getElementById('qr_codes').innerHTML = '';
    var size = document.getElementById('qr_codes').clientHeight - 100;
    setTimeout(function () {
        for (var i = 0; i < qr_chunks.length; i++) {
            var chunk = qr_chunks[i];
            renderQR(chunk, i, size)
        }
    }, 1);
}

function renderQR(chunk, i, size) {
    setTimeout(function () {
        // Create QR Code for Chunk
        document.getElementById('current_qr_chunk').innerHTML = i + 1;
        var qr_obj_id = 'qrcode_' + i;
        var placeholder = document.createElement('div');
        placeholder.id = qr_obj_id;
        placeholder.innerHTML = i;
        document.getElementById('qr_codes').appendChild(placeholder);
        new QRCode(document.getElementById(qr_obj_id), {
            width: size,
            height: size,
            text: chunk,
            correctLevel : QRCode.CorrectLevel.H
        });
        placeholder.style.display = "inline-block";
        if ((i + 1) === chunks_length) {
            document.getElementById('status').innerHTML = 'Finished! <br/>' +
                '<p>Playback:</p>' +
                '<a href="#" onclick="playback()">Start</a> <br/>' +
                '<a href="#" onclick="scrollPlayback()">Scroll</a> <br/>' +
                '<a href="#" onclick="cancelPlayback = true;">Cancel</a>';
            if(playback_mode == 'finish'){
                playback();
            }
        }
    }, 1);
}

var cancelPlayback = false;
function playback() {
    cancelPlayback = false;
    var current_qr = 0;
    setInterval(function () {
        var qr = document.getElementById("qrcode_" + current_qr)
        if (!cancelPlayback && qr) {
            setAllQRCodesDisplay('none');
            qr.style.display = "inline-block";
            current_qr++;
            if ((current_qr) === chunks_length) {
                cancelPlayback = true;
            }
        } else {
            setAllQRCodesDisplay('inline-block');
            current_qr = 0;
        }
    }, playback_delay);
}

function setAllQRCodesDisplay(state){
    var all_qrs = document.querySelectorAll('[id^=qrcode_]');
    for (var index = 0; index < all_qrs.length; index++) {
        all_qrs[index].style.display = state;;
    }
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

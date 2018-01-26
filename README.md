# QR Extractor
This code converts a selected file to base64, then chunks up the string based on the specified `qr_sting_size` (Note: the larger the chunk size the larger you'll need to set the `qr_image_size`, or you wont be able to read the QR Code).  These Chunks are then converted into QR Codes and displayed in the browser and can be played back at a speed specified by the `playback_delay` setting.

Settings can be configured in `scripts/main.js`
1. Open the index.html page in any browser.
2. Select the file you want to process.
3. Wait...  The code will spit out QRs as they are processed. 
4. Use the Playback feature to cycle through the QR codes at the desired pace.

Big Buck Bunny (5.5mb) takes about 6:30 minutes.

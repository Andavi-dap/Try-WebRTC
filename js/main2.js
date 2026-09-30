'use strict';
// Mengaktifkan strict mode JavaScript.

var video = document.querySelector('video');
// Mengambil elemen <video> untuk menampilkan stream kamera.

var canvas = window.canvas = document.querySelector('canvas');
// Mengambil elemen <canvas> yang akan dipakai untuk menggambar hasil snapshot, disimpan juga ke window.

canvas.width = 480;
canvas.height = 360;
// Mengatur ukuran default canvas sebelum ada gambar yang digambar di dalamnya.

var button = document.querySelector('#snapshot');   
button.onclick = function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').
      drawImage(video, 0, 0, canvas.width, canvas.height);
};

var resetButton = document.querySelector('#reset'); // Tambahan
resetButton.onclick = function() {                    
  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
};
// membuat tombol "Reset" yang jika diklik akan menghapus
// seluruh gambar yang ada di dalam elemen <canvas>

var constraints = {
  audio: false,
  video: true
};
// Mendefinisikan constraints media: hanya video yang diminta.

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}
// Jika permintaan kamera berhasil, stream disimpan ke window dan dihubungkan ke elemen video.

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}
// Jika permintaan kamera gagal, error ditampilkan di console.

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
// Memanggil getUserMedia dan menjalankan handleSuccess atau handleError sesuai hasilnya.
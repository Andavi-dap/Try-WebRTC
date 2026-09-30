'use strict';
// Mengaktifkan strict mode JavaScript.

var snapshotButton = document.querySelector('button#snapshot');
// Mengambil elemen tombol dengan id "snapshot".

var filterSelect = document.querySelector('select#filter');
// Mengambil elemen dropdown/select dengan id "filter".

var video = window.video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');
// Mengambil elemen <video> dan <canvas>, disimpan juga ke window agar bisa diuji lewat console.

canvas.width = 480;
canvas.height = 360;
// Mengatur ukuran default canvas.

snapshotButton.onclick = function() {
  canvas.className = filterSelect.value;
  // Saat tombol snapshot diklik, class CSS canvas diganti sesuai filter yang dipilih,
  // sehingga hasil snapshot ikut menerapkan efek filter yang sama seperti video.

  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  // Menggambar frame video saat ini ke dalam canvas.
};

filterSelect.onchange = function() {
  video.className = filterSelect.value;
  // Setiap kali pilihan filter di dropdown berubah, class CSS pada elemen video
  // ikut berubah, sehingga efek filter (blur, grayscale, dst) langsung terlihat secara real-time.
};

var constraints = {
  audio: false,
  video: true
};
// Mendefinisikan constraints media: hanya video yang diminta.

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}
// Jika permintaan kamera berhasil, stream dihubungkan ke elemen video.

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}
// Jika permintaan kamera gagal, error ditampilkan di console.

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
// Memanggil getUserMedia dan menjalankan fungsi sesuai hasilnya.
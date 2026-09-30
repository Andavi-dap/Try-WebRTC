'use strict';
// Mengaktifkan mode strict pada JavaScript agar lebih ketat menangani kesalahan penulisan kode.

var errorElement = document.querySelector('#errorMsg');
// Mengambil elemen HTML dengan id "errorMsg" untuk menampilkan pesan error jika terjadi kegagalan.

var video = document.querySelector('video');
// Mengambil elemen <video> dari halaman HTML agar dapat digunakan untuk menampilkan hasil kamera.

var statusElement = document.querySelector('#statusMsg'); // Tambahan.
// Mengambil elemen <statusMsg> dari halaman HTML agar dapat digunakan untuk menampilkan status.

var constraints = window.constraints = {
  audio: false,
  video: true
};
// Mendefinisikan aturan (constraints) media yang diminta ke browser: audio dimatikan, video diaktifkan.
// Disimpan juga ke variabel global window agar bisa diakses/diuji lewat console browser.

function handleSuccess(stream) {
  // Fungsi yang dijalankan otomatis jika permintaan akses kamera berhasil, menerima data "stream".

  var videoTracks = stream.getVideoTracks();
  // Mengambil daftar track video dari stream yang diterima.

  console.log('Got stream with constraints:', constraints);
  // Menampilkan di console constraints apa yang dipakai saat meminta stream.

  console.log('Using video device: ' + videoTracks[0].label);
  // Menampilkan nama perangkat kamera yang sedang digunakan.

  stream.oninactive = function() {
    console.log('Stream inactive');
  };
  // Menjalankan fungsi ini otomatis saat stream berhenti aktif, misal kamera dicabut/dimatikan.

  window.stream = stream;
  // Menyimpan variabel stream ke window agar bisa diakses lewat console browser.

  video.srcObject = stream;
  // Menghubungkan stream kamera ke elemen <video> sehingga videonya tampil di halaman.

  statusElement.textContent = 'Kamera berhasil diakses'; // Tambahan
  // Menampilkan keterangan status
}

function handleError(error) {
  // Fungsi yang dijalankan jika permintaan akses kamera gagal.

  if (error.name === 'ConstraintNotSatisfiedError') {
    errorMsg('...');
  }
  // Mengecek apakah error terjadi karena resolusi video yang diminta tidak didukung perangkat.

  else if (error.name === 'PermissionDeniedError') {
    errorMsg('...');
  }
  // Mengecek apakah error terjadi karena user menolak memberi izin akses kamera/mikrofon.

  errorMsg('getUserMedia error: ' + error.name, error);
  // Menampilkan pesan error umum berupa nama jenis error yang terjadi.
}

function errorMsg(msg, error) {
  // Fungsi bantuan untuk menampilkan pesan error ke halaman dan ke console.

  errorElement.innerHTML += '<p>' + msg + '</p>';
  // Menambahkan pesan error sebagai paragraf baru ke dalam elemen errorMsg.

  if (typeof error !== 'undefined') {
    console.error(error);
  }
  // Jika ada detail objek error, tampilkan juga di console browser.
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
// Memanggil API getUserMedia sesuai constraints. Jika berhasil jalankan handleSuccess,
// jika gagal jalankan handleError.
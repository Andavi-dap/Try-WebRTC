'use strict';
// Mengaktifkan strict mode JavaScript.

var audio = document.querySelector('audio');
// Mengambil elemen <audio> dari halaman HTML untuk menampilkan hasil rekaman mikrofon.

var statusElement = document.querySelector('#statusMsg'); // Tambahan.
// Mengambil elemen <statusMsg> dari halaman HTML agar dapat digunakan untuk menampilkan status.

var constraints = window.constraints = {
  audio: true,
  video: false
};
// Mendefinisikan constraints media: audio diaktifkan, video dimatikan
// (kebalikan dari Percobaan 1 yang meminta video).

function handleSuccess(stream) {
  var audioTracks = stream.getAudioTracks();
  // Mengambil daftar track audio dari stream yang diterima.

  console.log('Got stream with constraints:', constraints);
  console.log('Using audio device: ' + audioTracks[0].label);
  // Menampilkan di console perangkat mikrofon yang sedang digunakan.

  stream.oninactive = function() {
    console.log('Stream ended');
  };
  // Dijalankan otomatis saat stream audio berhenti aktif.

  window.stream = stream;
  audio.srcObject = stream;
  // Menghubungkan stream mikrofon ke elemen <audio> agar suara dapat diputar kembali.

  audio.onplay = function() {              // Tambahan.
  statusElement.textContent = 'Mikrofon aktif';
};
// Menampilkan keterangan status

}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}
// Jika permintaan akses mikrofon gagal, error ditampilkan di console.

// Meminta izin akses perangkat media (audio/video) berdasarkan aturan pada variabel 'constraints'
navigator.mediaDevices.getUserMedia(constraints)
    .then(function(stream) {
      handleSuccess(stream);     
      setupVisualizer(stream);   
    }).catch(handleError);       
// ============================================================
// Tambahan: Audio Visualizer menggunakan Web Audio API
// ============================================================
var canvas = document.querySelector('#visualizer'); // Mencari dan mengambil elemen <canvas> dengan ID 'visualizer' dari HTML
var canvasCtx = canvas.getContext('2d');              // Menyiapkan konteks alat gambar 2 dimensi untuk canvas tersebut

function setupVisualizer(stream) {
  var audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Membuat wadah utama Web Audio API (kompatibel lintas browser)
  var source = audioContext.createMediaStreamSource(stream);                     // Mengubah stream media mikrofon menjadi sumber suara yang bisa diproses audio context

  var analyser = audioContext.createAnalyser(); // Membuat node 'analyser' untuk menganalisis data frekuensi suara secara real-time
  analyser.fftSize = 256;                       // Menentukan ukuran FFT (Fast Fourier Transform), menentukan tingkat detail data frekuensi
  source.connect(analyser);                     // Menghubungkan sumber suara mikrofon ke dalam alat analyser

  var bufferLength = analyser.frequencyBinCount; // Mendapatkan jumlah data frekuensi (setengah dari fftSize)
  var dataArray = new Uint8Array(bufferLength);    // Membuat array tipe data angka (0-255) untuk menampung data frekuensi suara

  function draw() {
    requestAnimationFrame(draw);                 // Meminta browser untuk terus merender animasi secara berulang (biasanya 60fps)
    analyser.getByteFrequencyData(dataArray);   // Mengambil data frekuensi suara saat ini dan memasukkannya ke dalam dataArray

    canvasCtx.clearRect(0, 0, canvas.width, canvas.height); // Menghapus gambar/frame sebelumnya pada canvas agar tidak menumpuk

    var barWidth = (canvas.width / bufferLength) * 2.5; // Menghitung lebar setiap batang visualizer berdasarkan ukuran canvas
    var barHeight;                                      // Variabel untuk menyimpan tinggi masing-masing batang
    var x = 0;                                          // Posisi koordinat horizontal awal untuk menggambar batang pertama

    for (var i = 0; i < bufferLength; i++) {            // Perulangan untuk menggambar setiap batang frekuensi suara
      barHeight = dataArray[i] * 0.6;                   // Menghitung tinggi batang berdasarkan nilai data frekuensi dikali pengali skala
      canvasCtx.fillStyle = 'rgb(' + (57 + barHeight) + ', 255, 136)'; // Menentukan warna batang (berubah-ubah dinamis bernuansa hijau terang)
      canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight); // Menggambar batang ke canvas pada posisi koordinat (x, y)
      x += barWidth + 1;                                // Menggeser posisi x untuk batang berikutnya dengan sedikit jarak antar batang
    }
  }

  draw(); // Memanggil fungsi draw untuk pertama kalinya agar animasi visualizer mulai berjalan
}
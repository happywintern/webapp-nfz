// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import axios from "axios";

// export async function exportToPDF() {
//   const doc = new jsPDF();
//   const now = new Date();
//   const monthNames = [
//     "Januari", "Februari", "Maret", "April", "Mei", "Juni",
//     "Juli", "Agustus", "September", "Oktober", "November", "Desember"
//   ];
//   const month = monthNames[now.getMonth()];
//   const year = now.getFullYear();

//   let metrics = [];
//   let summary = {};
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.get(
//       `https://nurulfrozen.dgeo.id/api/product-performance-metrics?month=${now.getMonth()+1}&year=${year}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//     if (response.data && response.data.data) {
//       metrics = response.data.data.metrics;
//       summary = response.data.data.summary;
//     }
//   } catch (error) {
//     console.error("Error fetching product performance:", error);
//     metrics = [
//       {
//         "product_name": "Nugget",
//         "current_stock": "12",
//         "purchase_price": "10000",
//         "selling_price": "15000",
//         "total_sold": "20",
//         "gross_profit": "100000",
//         "profit_percentage": "50.00",
//         "total_revenue": "300000"
//       }
//     ];
//     summary = {
//       "total_revenue": 300000,
//       "total_profit": 100000,
//       "avg_profit_percentage": 33.33
//     };
//   }

//   doc.setFontSize(16);
//   doc.text(`Laporan keuangan Bulan ${month} ${year}`, 14, 18);

//   let startY = 30;
//   metrics.forEach((item, idx) => {
//     autoTable(doc, {
//       startY: startY,
//       head: [[
//         'Nama Produk', 'Active Stock', 'Harga Beli', 'Harga Jual', 'Jumlah Stok Terjual', 'Laba untung', 'Presentase Keuntungan'
//       ]],
//       body: [[
//         item.product_name,
//         item.current_stock,
//         formatRupiah(item.purchase_price),
//         formatRupiah(item.selling_price),
//         item.total_sold,
//         formatRupiah(item.gross_profit),
//         item.profit_percentage + '%'
//       ]],
//       margin: {left: 14, right: 14},
//       styles: { fontSize: 10, cellPadding: 3 },
//       headStyles: { fillColor: [255, 255, 255], textColor: [0,0,0], fontStyle: 'bold' },
//       theme: 'grid'
//     });
//     startY = doc.lastAutoTable.finalY + 2;
//     doc.setFontSize(10);
//     doc.text([
//       'Subtotal Pendapatan',
//       formatRupiah(item.total_revenue)
//     ], 14, startY + 6);
//     startY += 12;
//   });

//   startY += 10;
//   doc.setFontSize(14);
//   doc.text("Total Pendapatan", 14, startY);
//   doc.setFontSize(14);
//   doc.text(formatRupiah(summary.total_revenue), 180, startY, {align: 'right'});

//   doc.save(`laporan_keuangan_${month}_${year}.pdf`);
// }

// function formatRupiah(angka) {
//   if (typeof angka === "string") angka = parseFloat(angka);
//   if (isNaN(angka)) return '-';
//   return angka.toLocaleString('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).replace("IDR", "Rp");
// }
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

// Format ke rupiah tanpa simbol "IDR"
function formatRupiah(angka) {
  if (typeof angka === "string") angka = parseFloat(angka);
  if (isNaN(angka)) return "-";
  return angka.toLocaleString("id-ID");
}

export async function exportPDF() {
  const doc = new jsPDF();

  const now = new Date();
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();

  doc.setFontSize(16);
  doc.text(`Laporan keuangan Bulan ${month} ${year}`, 14, 18);

  let metrics = [];
  let summary = {};
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `https://nurulfrozen.dgeo.id/sales-orders/product-performance?month=${now.getMonth()+1}&year=${year}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.data && response.data.data) {
      metrics = response.data.data.metrics;
      summary = response.data.data.summary;
    }
  } catch (error) {
    alert("Gagal mengambil data dari API, cek token atau koneksi!");
    return;
  }

  let startY = 30;
  metrics.forEach((item) => {
    autoTable(doc, {
      startY: startY,
      head: [[
        'Nama Produk', 'Active Stock', 'Harga Beli', 'Harga Jual', 'Jumlah Stok Terjual', 'Laba untung', 'Presentase Keuntungan'
      ]],
      body: [[
        item.product_name,
        item.current_stock,
        formatRupiah(item.purchase_price),
        formatRupiah(item.selling_price),
        item.total_sold,
        formatRupiah(item.gross_profit),
        item.profit_percentage + '%'
      ]],
      margin: {left: 14, right: 14},
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [255, 255, 255], textColor: [0,0,0], fontStyle: 'bold' },
      theme: 'grid'
    });
    startY = doc.lastAutoTable.finalY + 2;
    doc.setFontSize(10);
    doc.text([
      'Subtotal Pendapatan',
      formatRupiah(item.total_revenue)
    ], 14, startY + 6);
    startY += 12;
  });

  // Total Pendapatan besar (summary)
  startY += 10;
  doc.setFontSize(14);
  doc.text("Total Pendapatan", 14, startY);
  doc.text(formatRupiah(summary.total_revenue), 180, startY, {align: 'right'});

  doc.save(`laporan_keuangan_${month}_${year}.pdf`);
}
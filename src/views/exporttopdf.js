import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";

// Format ke rupiah tanpa simbol "IDR"
function formatRupiah(angka) {
  if (typeof angka === "string") angka = parseFloat(angka);
  if (isNaN(angka)) return "-";
  return angka.toLocaleString("id-ID");
}

export async function exportToPDF(filters = {}) {
  try {
    // Buat dokumen PDF landscape
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const now = new Date();
    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    // Tentukan periode berdasarkan filter
    let startDate, endDate, periodText;
    
    if (filters.dateRange === 'custom' && filters.customDateRange?.start && filters.customDateRange?.end) {
      startDate = new Date(filters.customDateRange.start);
      endDate = new Date(filters.customDateRange.end);
      periodText = `${startDate.getDate()}/${startDate.getMonth() + 1}/${startDate.getFullYear()} - ${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`;
    } else if (filters.dateRange === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      periodText = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    } else if (filters.dateRange === 'week') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      endDate = new Date(now);
      endDate.setDate(startDate.getDate() + 6);
      periodText = `Minggu ${startDate.getDate()}-${endDate.getDate()} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    } else {
      // Default: bulan ini
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      periodText = `${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    }

    // Set judul
    doc.setFontSize(16);
    doc.text(`Laporan keuangan Bulan ${periodText}`, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    // Prepare API parameters
    const params = {
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString()
    };

    if (filters.status && filters.status !== 'all') {
      params.status = filters.status;
    }

    // Fetch data from API
    const response = await axios.get(
      'https://nurulfrozen.dgeo.id/api/sales-orders/product-performance',
      {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data || !response.data.data || !response.data.data.metrics) {
      throw new Error('Data tidak ditemukan dari API');
    }

    const { metrics, summary } = response.data.data;

    if (!metrics || metrics.length === 0) {
      throw new Error('Tidak ada data penjualan yang tersedia');
    }

    // Create table
    autoTable(doc, {
      startY: 25,
      head: [[
        'Nama Produk',
        'Active Stock',
        'Harga Beli',
        'Harga Jual',
        'Jumlah Stok Terjual',
        'Laba untung',
        'Presentase Keuntungan'
      ]],
      body: metrics.map(item => [
        item.product_name,
        item.current_stock,
        'Rp ' + formatRupiah(item.purchase_price),
        'Rp ' + formatRupiah(item.selling_price),
        item.total_sold,
        'Rp ' + formatRupiah(item.gross_profit),
        item.profit_percentage + '%'
      ]),
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: { 
        fillColor: [26, 50, 123],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        0: { cellWidth: 50 }, // Nama Produk
        1: { cellWidth: 30, halign: 'center' }, // Active Stock
        2: { cellWidth: 35, halign: 'right' }, // Harga Beli
        3: { cellWidth: 35, halign: 'right' }, // Harga Jual
        4: { cellWidth: 35, halign: 'center' }, // Jumlah Stok Terjual
        5: { cellWidth: 35, halign: 'right' }, // Laba untung
        6: { cellWidth: 35, halign: 'center' }  // Presentase Keuntungan
      },
      theme: 'grid',
      didDrawPage: function() {
        // Add footer on each page
        let finalY = doc.internal.pageSize.getHeight() - 20;
        doc.setFontSize(10);
        doc.text(`Total Pendapatan: Rp ${formatRupiah(summary.total_revenue)}`, doc.internal.pageSize.getWidth() - 15, finalY, { align: 'right' });
      }
    });

    doc.save(`laporan_keuangan_${periodText.replace(/ /g, '_')}.pdf`);
    return true;
  } catch (error) {
    console.error('Error in exportToPDF:', error);
    alert(error.message || 'Terjadi kesalahan saat mengekspor PDF. Silakan coba lagi.');
    return false;
  }
}
import { jsPDF } from "jspdf";
import axios from "axios";

export async function exportToPDF() {
  try {
    // Fetch data from product performance API
    const response = await axios.get('https://nurulfrozen.dgeo.id/api/sales-orders/product-performance', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    // Create PDF in landscape orientation
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 15;
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Nurul Frozen Food', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const address = 'Jl. Kp. Utan Jaya No.Rt05 Rw 04, Pd. Jaya,\nKec. Cipayung, Kota Depok, Jawa Barat 16920';
    const addressLines = doc.splitTextToSize(address, pageWidth - 40);
    doc.text(addressLines, pageWidth / 2, 30, { align: 'center' });
    doc.setLineWidth(0.5);
    doc.line(margin, 40, pageWidth - margin, 40);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    
    if (response.data && response.data.data) {
      const { year, month, metrics, summary } = response.data.data;
      doc.text(`Laporan Keuangan Bulan ${monthNames[month - 1]} ${year}`, pageWidth / 2, 50, { align: 'center' });

      const startY = 60;
      const rowHeight = 8;
      const headerRowHeight = 12; 
      const tableWidth = pageWidth - (2 * margin);
      const columns = [
        { header: 'Nama Produk', width: 80, align: 'left' },
        { header: 'Stok Tersisa', width: 35, align: 'right' },
        { header: 'Harga Beli', width: 35, align: 'right' },
        { header: 'Harga Jual', width: 35, align: 'right' },
        { header: 'Jumlah Stok\nTerjual', width: 35, align: 'right' },
        { header: 'Laba untung', width: 35, align: 'right' }
      ];

      let currentX = margin;
      columns.forEach(col => {
        col.x = currentX;
        currentX += col.width;
      });

      // Function to draw table header
      const drawTableHeader = (y) => {
        // Draw header background
        doc.setFillColor(26, 50, 123);
        doc.rect(margin, y, tableWidth, headerRowHeight, 'F');

        // Add header texts
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');

        columns.forEach(col => {
          if (col.align === 'left') {
            doc.text(col.header, col.x + 3, y + 7);
          } else {
            const lines = col.header.split('\n');
            if (lines.length > 1) {
              // For multi-line headers, center them vertically
              const lineHeight = 4;
              lines.forEach((line, i) => {
                const textWidth = doc.getStringUnitWidth(line) * doc.internal.getFontSize() / doc.internal.scaleFactor;
                doc.text(line, col.x + col.width - 3 - textWidth, y + 5 + (i * lineHeight));
              });
            } else {
              const textWidth = doc.getStringUnitWidth(col.header) * doc.internal.getFontSize() / doc.internal.scaleFactor;
              doc.text(col.header, col.x + col.width - 3 - textWidth, y + 7);
            }
          }
        });

        return y + headerRowHeight;
      };

      // Start drawing table
      let y = startY;
      y = drawTableHeader(y);

      // Reset text color and font for content
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');

      // Draw rows
      const productsPerPage = 5;
      metrics.forEach((product, index) => {
        if (index > 0 && index % productsPerPage === 0) {
          doc.addPage();
          y = 20;
          y = drawTableHeader(y);
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(9);
          doc.setFont('helvetica', 'normal');
        }

        // Draw row background for even rows
        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(margin, y, tableWidth, rowHeight, 'F');
        }

        // Prepare row data
        const rowData = [
          product.product_name,
          product.current_stock.toString(),
          `Rp ${parseFloat(product.purchase_price).toLocaleString('id-ID')}`,
          `Rp ${parseFloat(product.selling_price).toLocaleString('id-ID')}`,
          product.total_sold.toString(),
          `Rp ${parseFloat(product.gross_profit).toLocaleString('id-ID')}`
        ];

        // Draw row content
        columns.forEach((col, i) => {
          const text = rowData[i];
          if (col.align === 'left') {
            doc.text(text, col.x + 3, y + 5);
          } else {
            const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
            doc.text(text, col.x + col.width - 3 - textWidth, y + 5);
          }
        });

        y += rowHeight;
      });

      // Add total at the bottom
      y += 5;
      doc.setFont('helvetica', 'bold');
      const totalText = `Total Pendapatan: Rp ${summary.total_revenue.toLocaleString('id-ID')}`;
      const totalWidth = doc.getStringUnitWidth(totalText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      doc.text(totalText, pageWidth - margin - totalWidth, y);

      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        const pageText = `Halaman ${i} dari ${pageCount}`;
        const pageNumWidth = doc.getStringUnitWidth(pageText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        doc.text(pageText, pageWidth - margin - pageNumWidth, pageHeight - 15);
      }
    }

    // Save the PDF
    doc.save(`Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.pdf`);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Gagal mengunduh laporan. Silakan coba lagi.');
    return false;
  }
}
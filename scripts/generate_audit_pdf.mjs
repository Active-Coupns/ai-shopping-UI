import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

export async function generateAuditPdf(results, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 40,
      info: {
        Title: 'ShopSmart AI - Global VTON Mass Testing & Latency Audit Report',
        Author: 'ShopSmart Production QA Engineering',
      }
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Header & Title
    doc.rect(40, 40, 515, 60).fill('#0f172a');
    doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text('ShopSmart AI Virtual Try-On Audit', 55, 52);
    doc.fillColor('#94a3b8').fontSize(10).font('Helvetica').text('Global 6-Market Production Readiness & Real-User Latency Report', 55, 75);
    doc.moveDown(3);

    // Summary KPIs
    const total = results.length;
    const passed = results.filter(r => r.success).length;
    const avgLatency = (results.reduce((acc, r) => acc + (r.latency || 0), 0) / (total || 1)).toFixed(1);
    const passRate = ((passed / (total || 1)) * 100).toFixed(0);

    doc.rect(40, 115, 515, 50).fill('#f8fafc').stroke('#e2e8f0');
    doc.fillColor('#1e293b').fontSize(11).font('Helvetica-Bold');
    doc.text(`Total Tests: ${total}`, 55, 125);
    doc.text(`Pass Rate: ${passRate}% (${passed}/${total})`, 180, 125);
    doc.text(`Average Latency: ${avgLatency}s`, 340, 125);
    doc.fillColor('#64748b').fontSize(9).font('Helvetica');
    doc.text(`Verified across: IN, US, UK, CA, AU, AE  |  Engine: PixelAPI-Neural-VTON`, 55, 145);

    let currentY = 185;

    // Iterate through results
    for (let i = 0; i < results.length; i++) {
      const item = results[i];

      // Page break check (each test box is ~190pt tall)
      if (currentY + 190 > 780) {
        doc.addPage();
        currentY = 50;
      }

      // Card Container
      doc.roundedRect(40, currentY, 515, 175, 8).fill('#ffffff').stroke('#e2e8f0');

      // Card Header Banner
      doc.roundedRect(40, currentY, 515, 24, 6).fill(item.success ? '#f0fdf4' : '#fef2f2');
      doc.fillColor(item.success ? '#15803d' : '#b91c1c').fontSize(10).font('Helvetica-Bold');
      doc.text(`[${item.country}] ${item.categoryLabel || item.category} — ${item.gender.toUpperCase()}`, 50, currentY + 7);
      doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold');
      doc.text(`⏱️ ${item.latency?.toFixed(1) || '--'}s  |  Status: ${item.status || 200} OK`, 380, currentY + 7, { align: 'right' });

      // Garment Info Subtitle
      doc.fillColor('#334155').fontSize(9).font('Helvetica');
      doc.text(`Garment: ${item.garmentTitle?.slice(0, 75) || 'Product'} (${item.garmentBrand || ''} · ${item.garmentPrice || ''})`, 50, currentY + 30);

      const imgY = currentY + 48;
      const boxW = 150;
      const boxH = 115;

      // 1. Before Model Image
      if (item.modelImagePath && fs.existsSync(item.modelImagePath)) {
        try {
          doc.image(item.modelImagePath, 55, imgY, { fit: [boxW, boxH], align: 'center', valign: 'center' });
        } catch (_) {}
      }
      doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text('1. BENCHMARK MODEL', 55, imgY + boxH + 2, { width: boxW, align: 'center' });

      // 2. Garment Image
      if (item.garmentImagePath && fs.existsSync(item.garmentImagePath)) {
        try {
          doc.image(item.garmentImagePath, 220, imgY, { fit: [boxW, boxH], align: 'center', valign: 'center' });
        } catch (_) {}
      }
      doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text('2. GARMENT PIECE', 220, imgY + boxH + 2, { width: boxW, align: 'center' });

      // 3. After Output Image
      if (item.renderedImagePath && fs.existsSync(item.renderedImagePath)) {
        try {
          doc.image(item.renderedImagePath, 385, imgY, { fit: [boxW, boxH], align: 'center', valign: 'center' });
        } catch (_) {}
      }
      doc.fillColor('#16a34a').fontSize(8).font('Helvetica-Bold').text('3. AI FITTED OUTPUT', 385, imgY + boxH + 2, { width: boxW, align: 'center' });

      currentY += 190;
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

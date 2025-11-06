// generatePDF.js - VERSIÓN CORREGIDA
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = (doc, userData, examData, intentoId) => {
    try {
        // Configuración de márgenes
        const margin = 50;
        const pageWidth = doc.page.width - 2 * margin;
        const centerX = doc.page.width / 2;
        
        // Fondo decorativo suave
        doc.rect(0, 0, doc.page.width, doc.page.height)
           .fill('#f8f9fa');
        
        // Borde decorativo
        doc.strokeColor('#00bfff')
           .lineWidth(2)
           .rect(margin - 10, margin - 10, doc.page.width - 2 * margin + 20, doc.page.height - 2 * margin + 20)
           .stroke();
        
        // Logo de la empresa (si existe)
        try {
            const logoPath = path.join(__dirname, '../assets/logo.png');
            doc.image(logoPath, centerX - 60, margin, { width: 120, align: 'center' });
        } catch (error) {
            console.log('Logo no encontrado, continuando sin él');
        }
        
        // Título principal
        doc.fillColor('#00bfff')
           .fontSize(28)
           .font('Helvetica-Bold')
           .text('CERTIFICADO DE APROBACIÓN', margin, 120, {
               align: 'center',
               width: pageWidth
           });
        
        // Línea decorativa
        doc.strokeColor('#00bfff')
           .lineWidth(2)
           .moveTo(centerX - 100, 160)
           .lineTo(centerX + 100, 160)
           .stroke();
        
        // Texto "Se certifica que:"
        doc.fillColor('#333333')
           .fontSize(16)
           .font('Helvetica')
           .text('Se certifica que:', margin, 190, {
               align: 'center',
               width: pageWidth
           });
        
        // Nombre del estudiante
        doc.fillColor('#000000')
           .fontSize(24)
           .font('Helvetica-Bold')
           .text(userData.nombreCompleto.toUpperCase(), margin, 220, {
               align: 'center',
               width: pageWidth
           });
        
        // Información del examen
        doc.fillColor('#333333')
           .fontSize(14)
           .font('Helvetica')
           .text(`Ha aprobado satisfactoriamente el examen de:`, margin, 270, {
               align: 'center',
               width: pageWidth
           })
           .font('Helvetica-Bold')
           .text(examData.quizTitle, margin, 290, {
               align: 'center',
               width: pageWidth
           })
           .font('Helvetica')
           .text(`Con una calificación de: ${examData.porcentaje}%`, margin, 320, {
               align: 'center',
               width: pageWidth
           })
           .text(`Fecha de examen: ${examData.fecha}`, margin, 345, {
               align: 'center',
               width: pageWidth
           });
        
        // Sección de firmas
        const firmaY = 400;
        const firmaWidth = 80;
        const spaceBetween = 100;
        
        // Calcular posiciones para centrar las firmas
        const totalWidth = 2 * firmaWidth + spaceBetween;
        const startX = centerX - totalWidth / 2;
        
        // Firma del instructor
        try {
            const firmaInstructorPath = path.join(__dirname, '../assets/firma-instructor.png');
            doc.image(firmaInstructorPath, startX, firmaY, { 
                width: firmaWidth,
                fit: [firmaWidth, 50]
            });
        } catch (error) {
            // Si no hay imagen, dibujar línea para firma
            doc.strokeColor('#000000')
               .lineWidth(1)
               .moveTo(startX, firmaY + 40)
               .lineTo(startX + firmaWidth, firmaY + 40)
               .stroke();
        }
        
        doc.fontSize(10)
           .fillColor('#666666')
           .text('_________________________', startX - 10, firmaY + 50, {
               width: firmaWidth + 20,
               align: 'center'
           })
           .text('Instructor', startX, firmaY + 65, {
               width: firmaWidth,
               align: 'center'
           });
        
        // Firma del CEO
        try {
            const firmaCEOPath = path.join(__dirname, '../assets/firma-ceo.png');
            doc.image(firmaCEOPath, startX + firmaWidth + spaceBetween, firmaY, { 
                width: firmaWidth,
                fit: [firmaWidth, 50]
            });
        } catch (error) {
            // Si no hay imagen, dibujar línea para firma
            doc.strokeColor('#000000')
               .lineWidth(1)
               .moveTo(startX + firmaWidth + spaceBetween, firmaY + 40)
               .lineTo(startX + 2 * firmaWidth + spaceBetween, firmaY + 40)
               .stroke();
        }
        
        doc.text('_________________________', startX + firmaWidth + spaceBetween - 10, firmaY + 50, {
               width: firmaWidth + 20,
               align: 'center'
           })
           .text('CEO - SkillForge', startX + firmaWidth + spaceBetween, firmaY + 65, {
               width: firmaWidth,
               align: 'center'
           });
        
        // Pie de página con ID del certificado
        doc.fontSize(9)
           .fillColor('#999999')
           .text(`ID de certificado: ${intentoId}`, margin, doc.page.height - 80, {
               align: 'center',
               width: pageWidth
           })
           .text('Este certificado verifica la exitosa aprobación del examen de certificación.', margin, doc.page.height - 60, {
               align: 'center',
               width: pageWidth
           });
        
    } catch (error) {
        console.error('Error generando certificado:', error);
        // En caso de error, generar un certificado básico
        doc.fillColor('#000000')
           .fontSize(20)
           .text('CERTIFICADO DE APROBACIÓN', 50, 100)
           .fontSize(14)
           .text(`Se certifica que: ${userData.nombreCompleto}`, 50, 150)
           .text(`Examen: ${examData.quizTitle}`, 50, 180)
           .text(`Calificación: ${examData.porcentaje}%`, 50, 200)
           .text(`Fecha: ${examData.fecha}`, 50, 220)
           .text(`ID: ${intentoId}`, 50, 250);
    }
};
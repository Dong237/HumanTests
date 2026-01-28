import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import type { TestResult } from '../types';
import { getDimensionInterpretation } from './scoring';

/**
 * Download results as JSON
 */
export function downloadJSON(result: TestResult): void {
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bigfive-results-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download results as CSV
 */
export function downloadCSV(result: TestResult): void {
  const rows: string[][] = [
    ['维度', '英文名称', '原始分数', '百分位', 'T分数', '水平'],
  ];

  result.dimensionScores.forEach((dim) => {
    rows.push([
      dim.dimensionName,
      dim.dimensionNameEn,
      dim.rawScore.toString(),
      dim.percentile.toString(),
      dim.tScore.toString(),
      dim.level === 'low' ? '低' : dim.level === 'high' ? '高' : '中等',
    ]);

    // Add facet scores
    dim.facetScores.forEach((facet) => {
      rows.push([
        `  ${facet.facetName}`,
        `  ${facet.facetNameEn}`,
        facet.rawScore.toString(),
        '',
        '',
        '',
      ]);
    });
  });

  const csvContent = rows.map(row => row.join(',')).join('\n');
  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `bigfive-results-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Download chart/visualization as PNG
 */
export async function downloadPNG(elementId: string, filename: string = 'chart'): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error('Element not found:', elementId);
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher quality
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  } catch (error) {
    console.error('Error generating PNG:', error);
  }
}

/**
 * Download complete report as PDF
 */
export async function downloadPDF(result: TestResult): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrap
  const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
    pdf.setFontSize(fontSize);
    if (isBold) {
      pdf.setFont('helvetica', 'bold');
    } else {
      pdf.setFont('helvetica', 'normal');
    }

    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += fontSize * 0.5;
    });
  };

  // Title
  addText('大五人格测试报告', 20, true);
  yPosition += 10;

  // Test date
  addText(`测试日期: ${result.completedAt.toLocaleDateString('zh-CN')}`, 10);
  yPosition += 10;

  // Dimension scores
  addText('维度得分', 16, true);
  yPosition += 5;

  result.dimensionScores.forEach((dim) => {
    addText(`${dim.dimensionName} (${dim.dimensionNameEn})`, 14, true);
    yPosition += 2;
    addText(`原始分数: ${dim.rawScore}  |  百分位: ${dim.percentile}  |  T分数: ${dim.tScore}`, 10);
    yPosition += 2;

    const interpretation = getDimensionInterpretation(dim.dimensionId, dim.level);
    addText(interpretation, 10);
    yPosition += 8;

    // Facet scores
    addText('子维度得分:', 12, true);
    yPosition += 2;
    dim.facetScores.forEach((facet) => {
      addText(`${facet.facetName}: ${facet.rawScore}`, 10);
      yPosition += 4;
    });
    yPosition += 5;
  });

  // Footer
  yPosition = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.text('本报告由大五人格测试系统生成', pageWidth / 2, yPosition, { align: 'center' });

  // Save PDF
  pdf.save(`bigfive-report-${Date.now()}.pdf`);
}

/**
 * Copy text summary to clipboard
 */
export async function copyToClipboard(result: TestResult): Promise<boolean> {
  let text = '=== 大五人格测试结果 ===\n\n';
  text += `测试日期: ${result.completedAt.toLocaleDateString('zh-CN')}\n\n`;

  result.dimensionScores.forEach((dim) => {
    text += `【${dim.dimensionName}】${dim.dimensionNameEn}\n`;
    text += `分数: ${dim.rawScore} | 百分位: ${dim.percentile} | T分数: ${dim.tScore}\n`;
    text += `水平: ${dim.level === 'low' ? '低' : dim.level === 'high' ? '高' : '中等'}\n`;
    text += `${getDimensionInterpretation(dim.dimensionId, dim.level)}\n\n`;

    text += '子维度:\n';
    dim.facetScores.forEach((facet) => {
      text += `  - ${facet.facetName}: ${facet.rawScore}\n`;
    });
    text += '\n';
  });

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

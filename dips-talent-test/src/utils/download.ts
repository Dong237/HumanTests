import jsPDF from 'jspdf';
import type { TestResult } from '../types';
import { getDimensionInterpretation, getLevelLabel } from './scoring';
import scoringConfig from '../data/dips-scoring.json';

export function downloadJSON(result: TestResult): void {
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dips-results-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(result: TestResult): void {
  const rows: string[][] = [
    ['天赋维度', '英文名称', '原始分数', '百分比', '水平', '是否核心天赋', '推荐职业'],
  ];

  result.dimensionScores.forEach((dim) => {
    const dimConfig = scoringConfig.dimensions[dim.dimensionId as keyof typeof scoringConfig.dimensions];
    rows.push([
      dim.dimensionName,
      dim.dimensionNameEn,
      dim.rawScore.toString(),
      `${dim.percentage}%`,
      getLevelLabel(dim.level),
      dim.isTopTalent ? '是' : '否',
      (dimConfig as any).careers.join('、'),
    ]);
  });

  const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const BOM = '\uFEFF';
  const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dips-results-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function downloadPDF(result: TestResult): Promise<void> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

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

  addText('DIPS天赋测量报告', 20, true);
  yPosition += 10;
  addText(`测试日期: ${new Date(result.completedAt).toLocaleDateString('zh-CN')}`, 10);
  yPosition += 5;

  // Top talents
  addText('核心天赋', 16, true);
  yPosition += 5;
  result.topTalents.forEach((dim) => {
    const dimConfig = scoringConfig.dimensions[dim.dimensionId as keyof typeof scoringConfig.dimensions];
    addText(`${dim.dimensionName} (${dim.dimensionNameEn}) - ${dim.rawScore}/20`, 12, true);
    addText(`推荐职业: ${(dimConfig as any).careers.join(', ')}`, 10);
    yPosition += 3;
  });
  yPosition += 5;

  // All dimensions
  addText('全部维度得分', 16, true);
  yPosition += 5;
  result.dimensionScores.forEach((dim) => {
    addText(`${dim.dimensionName} (${dim.dimensionNameEn})`, 14, true);
    yPosition += 2;
    addText(`得分: ${dim.rawScore}/20 | 百分比: ${dim.percentage}% | 水平: ${getLevelLabel(dim.level)}`, 10);
    yPosition += 2;
    const interpretation = getDimensionInterpretation(dim.dimensionId, dim.level);
    addText(interpretation, 10);
    yPosition += 8;
  });

  yPosition = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.text('本报告由DIPS天赋测量系统生成', pageWidth / 2, yPosition, { align: 'center' });

  pdf.save(`dips-report-${Date.now()}.pdf`);
}

export async function copyToClipboard(result: TestResult): Promise<boolean> {
  let text = '=== DIPS天赋测量结果 ===\n\n';
  text += `测试日期: ${new Date(result.completedAt).toLocaleDateString('zh-CN')}\n\n`;

  text += '--- 核心天赋 ---\n';
  result.topTalents.forEach((dim) => {
    const dimConfig = scoringConfig.dimensions[dim.dimensionId as keyof typeof scoringConfig.dimensions];
    text += `★ ${dim.dimensionName} (${dim.rawScore}/20)\n`;
    text += `  推荐职业: ${(dimConfig as any).careers.join('、')}\n`;
  });
  text += '\n--- 全部维度 ---\n';

  result.dimensionScores.forEach((dim) => {
    const marker = dim.isTopTalent ? '★' : '○';
    text += `${marker} ${dim.dimensionName} (${dim.dimensionNameEn})\n`;
    text += `  得分: ${dim.rawScore}/20 | 百分比: ${dim.percentage}% | 水平: ${getLevelLabel(dim.level)}\n`;
    text += `  ${getDimensionInterpretation(dim.dimensionId, dim.level)}\n\n`;
  });

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

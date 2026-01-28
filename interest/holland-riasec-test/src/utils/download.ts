import jsPDF from 'jspdf';
import type { TestResult } from '../types';
import { getTypeInterpretation, getLevelLabel } from './scoring';
import scoringConfig from '../data/holland-scoring.json';

export function downloadJSON(result: TestResult): void {
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `holland-riasec-results-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadCSV(result: TestResult): void {
  const rows: string[][] = [
    ['兴趣类型', '英文名称', '原始分数', '百分比', '水平', '是否核心兴趣', 'Holland代码', '推荐职业'],
  ];

  result.typeScores.forEach((type) => {
    const typeConfig = scoringConfig.types[type.typeId as keyof typeof scoringConfig.types];
    rows.push([
      type.typeName,
      type.typeNameEn,
      type.rawScore.toString(),
      `${type.percentage}%`,
      getLevelLabel(type.level),
      type.isTopInterest ? '是' : '否',
      result.hollandCode,
      (typeConfig as any).careers.join('、'),
    ]);
  });

  const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
  const BOM = '\uFEFF';
  const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `holland-riasec-results-${Date.now()}.csv`;
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

  addText('Holland RIASEC 职业兴趣测试报告', 20, true);
  yPosition += 10;
  addText(`测试日期: ${new Date(result.completedAt).toLocaleDateString('zh-CN')}`, 10);
  yPosition += 3;
  addText(`Holland代码: ${result.hollandCode}`, 14, true);
  yPosition += 8;

  // Top interests
  addText('核心兴趣类型', 16, true);
  yPosition += 5;
  const topTypes = result.typeScores.filter(t => t.isTopInterest).sort((a, b) => b.rawScore - a.rawScore);
  topTypes.forEach((type) => {
    const typeConfig = scoringConfig.types[type.typeId as keyof typeof scoringConfig.types];
    addText(`${type.typeName} (${type.typeNameEn}) - ${type.rawScore}/50`, 12, true);
    addText(`推荐职业: ${(typeConfig as any).careers.join(', ')}`, 10);
    yPosition += 3;
  });
  yPosition += 5;

  // All types
  addText('全部兴趣类型得分', 16, true);
  yPosition += 5;
  result.typeScores.forEach((type) => {
    addText(`${type.typeName} (${type.typeNameEn})`, 14, true);
    yPosition += 2;
    addText(`得分: ${type.rawScore}/50 | 百分比: ${type.percentage}% | 水平: ${getLevelLabel(type.level)}`, 10);
    yPosition += 2;
    const interpretation = getTypeInterpretation(type.typeId, type.level);
    addText(interpretation, 10);
    yPosition += 8;
  });

  yPosition = pageHeight - 15;
  pdf.setFontSize(8);
  pdf.text('本报告由Holland RIASEC职业兴趣测试系统生成', pageWidth / 2, yPosition, { align: 'center' });

  pdf.save(`holland-riasec-report-${Date.now()}.pdf`);
}

export async function copyToClipboard(result: TestResult): Promise<boolean> {
  let text = '=== Holland RIASEC 职业兴趣测试结果 ===\n\n';
  text += `测试日期: ${new Date(result.completedAt).toLocaleString('zh-CN')}\n`;
  text += `Holland代码: ${result.hollandCode}\n\n`;

  text += '--- 核心兴趣类型 ---\n';
  const topTypes = result.typeScores.filter(t => t.isTopInterest).sort((a, b) => b.rawScore - a.rawScore);
  topTypes.forEach((type) => {
    const typeConfig = scoringConfig.types[type.typeId as keyof typeof scoringConfig.types];
    text += `★ ${type.typeName} (${type.rawScore}/50)\n`;
    text += `  推荐职业: ${(typeConfig as any).careers.join('、')}\n`;
  });
  text += '\n--- 全部兴趣类型 ---\n';

  result.typeScores.forEach((type) => {
    const marker = type.isTopInterest ? '★' : '○';
    text += `${marker} ${type.typeName} (${type.typeNameEn})\n`;
    text += `  得分: ${type.rawScore}/50 | 百分比: ${type.percentage}% | 水平: ${getLevelLabel(type.level)}\n`;
    text += `  ${getTypeInterpretation(type.typeId, type.level)}\n\n`;
  });

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

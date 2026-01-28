import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TestResult, DimensionScore } from '../types';

export async function downloadAsPDF(_result: TestResult): Promise<void> {
  const resultsElement = document.getElementById('results-container');
  if (!resultsElement) return;

  const canvas = await html2canvas(resultsElement, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#FAFAFA',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`disc-behavior-results-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function downloadAsJSON(result: TestResult): void {
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `disc-behavior-results-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadAsCSV(result: TestResult): void {
  const headers = ['维度ID', '维度名称', '英文名称', '原始分数', '百分比', '等级', '是否主导', '是否次要'];
  const rows = result.dimensionScores.map((d: DimensionScore) => [
    d.dimensionId,
    d.dimensionName,
    d.dimensionNameEn,
    d.rawScore,
    d.percentage,
    d.level,
    d.isPrimary ? '是' : '否',
    d.isSecondary ? '是' : '否',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
    '',
    `DISC风格模式,${result.discPattern}`,
    `主导风格,${result.primaryStyle}`,
    `次要风格,${result.secondaryStyle}`,
    `完成时间,${new Date(result.completedAt).toLocaleString('zh-CN')}`,
  ].join('\n');

  const BOM = '\uFEFF';
  const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `disc-behavior-results-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(result: TestResult): Promise<boolean> {
  const text = `DISC 行为风格测试结果
完成时间: ${new Date(result.completedAt).toLocaleString('zh-CN')}
DISC风格模式: ${result.discPattern}

维度得分:
${result.dimensionScores.map(d =>
  `${d.dimensionName} (${d.dimensionId}): ${d.rawScore}分 (${d.percentage}%) - ${d.level}${d.isPrimary ? ' [主导]' : ''}${d.isSecondary ? ' [次要]' : ''}`
).join('\n')}
`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TestResult, FactorScore } from '../types';

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

  pdf.save(`16pf-results-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function downloadAsJSON(result: TestResult): void {
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `16pf-results-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadAsCSV(result: TestResult): void {
  const headers = ['因子ID', '因子名称', '英文名称', '原始分数', 'Sten分数', '百分比', '等级', '低分极', '高分极'];
  const rows = result.factorScores.map((f: FactorScore) => [
    f.factorId,
    f.factorName,
    f.factorNameEn,
    f.rawScore,
    f.stenScore,
    f.percentage,
    f.level === 'low' ? '偏低' : f.level === 'high' ? '偏高' : '中等',
    f.lowLabel,
    f.highLabel,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
    '',
    `完成时间,${new Date(result.completedAt).toLocaleString('zh-CN')}`,
    `总题数,${result.answers.length}`,
  ].join('\n');

  const BOM = '\uFEFF';
  const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `16pf-results-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(result: TestResult): Promise<boolean> {
  const text = `16PF人格测试结果
完成时间: ${new Date(result.completedAt).toLocaleString('zh-CN')}
总题数: ${result.answers.length}

16个因子得分 (Sten分数 1-10):
${result.factorScores.map(f =>
  `${f.factorId} - ${f.factorName} (${f.factorNameEn}): Sten=${f.stenScore} (原始分=${f.rawScore}) - ${f.level === 'low' ? '偏低' : f.level === 'high' ? '偏高' : '中等'}
   ${f.lowLabel} ←→ ${f.highLabel}`
).join('\n\n')}
`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

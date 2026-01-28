import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TestResult, DichotomyScore } from '../types';

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

  pdf.save(`mbti-personality-results-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function downloadAsJSON(result: TestResult): void {
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mbti-personality-results-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadAsCSV(result: TestResult): void {
  const headers = ['二分法', '二分法名称', '英文名称', '第一极', '第一极得分%', '第二极', '第二极得分%', '偏好', '清晰度'];
  const rows = result.dichotomyScores.map((d: DichotomyScore) => [
    d.dichotomy,
    d.dichotomyName,
    d.dichotomyNameEn,
    d.firstPole,
    d.firstPoleScore,
    d.secondPole,
    d.secondPoleScore,
    d.preference,
    d.clarity,
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
    '',
    `MBTI类型,${result.typeCode}`,
    `完成时间,${new Date(result.completedAt).toLocaleString('zh-CN')}`,
  ].join('\n');

  const BOM = '\uFEFF';
  const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `mbti-personality-results-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(result: TestResult): Promise<boolean> {
  const text = `MBTI 人格类型测试结果
完成时间: ${new Date(result.completedAt).toLocaleString('zh-CN')}
MBTI类型: ${result.typeCode}

二分法得分:
${result.dichotomyScores.map(d =>
  `${d.dichotomyName} (${d.dichotomy}): ${d.firstPole} ${d.firstPoleScore}% / ${d.secondPole} ${d.secondPoleScore}% - 偏好: ${d.preference} (${d.clarity})`
).join('\n')}
`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

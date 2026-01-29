import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TestResult, StrengthScore } from '../types';

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

  pdf.save(`via-strengths-results-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function downloadAsJSON(result: TestResult): void {
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `via-strengths-results-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadAsCSV(result: TestResult): void {
  const headers = ['排名', '品格优势ID', '品格优势', '英文名称', '美德', '原始分数', '百分比', '是否标志性优势'];
  const rows = result.strengthScores.map((s: StrengthScore) => [
    s.rank,
    s.strengthId,
    s.strengthName,
    s.strengthNameEn,
    s.virtue,
    s.rawScore,
    s.percentage,
    s.isSignature ? '是' : '否',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
    '',
    `标志性优势（前5）,${result.signatureStrengths.map(s => s.strengthName).join('、')}`,
    `完成时间,${new Date(result.completedAt).toLocaleString('zh-CN')}`,
  ].join('\n');

  const BOM = '\uFEFF';
  const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `via-strengths-results-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(result: TestResult): Promise<boolean> {
  const text = `VIA 品格优势测试结果
完成时间: ${new Date(result.completedAt).toLocaleString('zh-CN')}

标志性优势（前5）:
${result.signatureStrengths.map((s, idx) =>
  `${idx + 1}. ${s.strengthName} (${s.strengthNameEn}): ${s.rawScore}分 (${s.percentage}%)`
).join('\n')}

全部24项品格优势排名:
${result.strengthScores.map(s =>
  `第${s.rank}名 - ${s.strengthName} (${s.strengthNameEn}): ${s.rawScore}分 (${s.percentage}%)${s.isSignature ? ' ⭐' : ''}`
).join('\n')}
`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

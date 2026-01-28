import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { TestResult, TypeScore } from '../types';

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

  pdf.save(`enneagram-results-${new Date().toISOString().split('T')[0]}.pdf`);
}

export function downloadAsJSON(result: TestResult): void {
  const dataStr = JSON.stringify(result, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `enneagram-results-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function downloadAsCSV(result: TestResult): void {
  const headers = ['类型ID', '类型名称', '英文名称', '情感中心', '原始分数', '百分比', '等级', '是否主导', '侧翼'];
  const rows = result.typeScores.map((t: TypeScore) => [
    t.typeId,
    t.typeName,
    t.typeNameEn,
    t.triad === 'heart' ? '情感中心' : t.triad === 'head' ? '思维中心' : '本能中心',
    t.rawScore,
    t.percentage,
    t.level,
    t.isPrimary ? '是' : '否',
    t.wing || '-',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
    '',
    `九型人格类型,${result.enneagramCode}`,
    `主导类型,${result.primaryType}`,
    `侧翼,${result.wing || '无'}`,
    `情感中心,${result.triad === 'heart' ? '情感中心' : result.triad === 'head' ? '思维中心' : '本能中心'}`,
    `完成时间,${new Date(result.completedAt).toLocaleString('zh-CN')}`,
  ].join('\n');

  const BOM = '\uFEFF';
  const dataBlob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `enneagram-results-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(result: TestResult): Promise<boolean> {
  const triadLabel = result.triad === 'heart' ? '情感中心' : result.triad === 'head' ? '思维中心' : '本能中心';

  const text = `九型人格测试结果
完成时间: ${new Date(result.completedAt).toLocaleString('zh-CN')}
您的类型: ${result.enneagramCode}
主导类型: ${result.primaryType}
侧翼: ${result.wing || '无'}
情感中心: ${triadLabel}

各类型得分:
${result.typeScores.map(t =>
  `类型${t.typeId} - ${t.typeName} (${t.typeNameEn}): ${t.rawScore}分 (${t.percentage}%) - ${t.level}${t.isPrimary ? ' [主导]' : ''}`
).join('\n')}
`;

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

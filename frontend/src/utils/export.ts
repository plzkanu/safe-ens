import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { PatrolLog, SAOReport } from '../types';
import { format } from 'date-fns';

// 순찰일지를 Excel로 내보내기
export const exportPatrolToExcel = async (patrols: PatrolLog[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('순찰일지');

  // 헤더 설정
  worksheet.columns = [
    { header: '점검일', key: 'date', width: 12 },
    { header: '사업소', key: 'site', width: 15 },
    { header: '점검자', key: 'inspector', width: 10 },
    { header: '부서', key: 'department', width: 15 },
    { header: '장소', key: 'location', width: 15 },
    { header: '카테고리', key: 'category', width: 15 },
    { header: '점검항목', key: 'item', width: 40 },
    { header: '상태', key: 'status', width: 10 },
    { header: '비고', key: 'notes', width: 30 },
  ];

  // 데이터 추가
  patrols.forEach((patrol) => {
    patrol.items.forEach((item) => {
      worksheet.addRow({
        date: format(new Date(patrol.inspectionDate), 'yyyy-MM-dd'),
        site: patrol.site.name,
        inspector: patrol.inspector.name,
        department: patrol.department,
        location: patrol.location,
        category: item.category,
        item: item.itemText,
        status: item.status === 'GOOD' ? '양호' : '불량',
        notes: item.notes || '',
      });
    });
  });

  // 스타일 적용
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // 파일 저장
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `순찰일지_${format(new Date(), 'yyyyMMdd')}.xlsx`);
};

// SAO를 Excel로 내보내기
export const exportSAOToExcel = async (reports: SAOReport[]) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('SAO');

  // 헤더 설정
  worksheet.columns = [
    { header: '관찰일', key: 'date', width: 12 },
    { header: '사업소', key: 'site', width: 15 },
    { header: '관찰자', key: 'inspector', width: 10 },
    { header: '작업부서', key: 'workplace', width: 15 },
    { header: '관찰지역', key: 'workArea', width: 15 },
    { header: '작업인원', key: 'workerCount', width: 10 },
    { header: '카테고리', key: 'category', width: 15 },
    { header: '항목', key: 'item', width: 40 },
    { header: '체크', key: 'checked', width: 10 },
    { header: '비고', key: 'notes', width: 30 },
  ];

  // 데이터 추가
  reports.forEach((report) => {
    report.items.forEach((item) => {
      worksheet.addRow({
        date: format(new Date(report.reportDate), 'yyyy-MM-dd'),
        site: report.site.name,
        inspector: report.inspector.name,
        workplace: report.workplace,
        workArea: report.workArea,
        workerCount: report.workerCount,
        category: item.category,
        item: item.itemText,
        checked: item.checked ? 'O' : 'X',
        notes: item.notes || '',
      });
    });
  });

  // 스타일 적용
  worksheet.getRow(1).font = { bold: true };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' },
  };

  // 파일 저장
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  saveAs(blob, `SAO_${format(new Date(), 'yyyyMMdd')}.xlsx`);
};

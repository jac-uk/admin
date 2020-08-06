import XLSXPopulate from 'xlsx-populate';
import { save } from 'save-file';

const downloadXLSX = async (data, title, filename) => {
  const workbook = await XLSXPopulate.fromBlankAsync();
  const sheet = workbook.sheet(0);
  sheet.name(title);

  sheet.cell('A1').value(data);
  sheet.row(1).style({ bold: true, fill: 'eeeeee' });

  const blob = await workbook.outputAsync();
  await save(blob, filename);
};

export {
  downloadXLSX
};

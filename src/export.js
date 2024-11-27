import XLSXPopulate from 'xlsx-populate';
import { saveSync } from 'save-file';

/**
 * Download data as .xlsx file
 *
 * @param {Array} data
 * @param {Object} options
 * @param {Object} options.styles Set up styles for rows and columns.
 * Check all available styles in https://github.com/dtjohnson/xlsx-populate?tab=readme-ov-file#styles-1.
 * ex. {
 *       column: {
 *         'S': {
 *           wrapText: true,
 *         },
 *       },
 *     }
 * @param {Array} options.freezePanes Set up freeze panes. (ex. [{ xSplit: 0, ySplit: 1 }])
 * @param {Array} options.merges Set up merges. (ex. ['A1:B1'])
 */
const downloadXLSX = async (data, options) => {
  const workbook = await XLSXPopulate.fromBlankAsync();

  workbook.property({
    Title: options.title,
    Author: 'JAC',
  });

  const sheet = workbook.sheet(0);

  /* NOTE:
   Sheet name length should not be more than 31 and not contain special characters
   */
  sheet.name(options.sheetName.replace(/[^\w\s-]/gi, '').substring(0, 30));

  sheet.cell('A1').value(data);

  if (!options.styles) {
    options.styles = {
      row: {
        1: {
          bold: true,
          fill: 'eeeeee',
        },
      },
    };
  }
  if (!options.freezePanes) {
    options.freezePanes = [
      {
        xSplit: 0,
        ySplit: 1,
      },
    ];
  }

  const { row, column, cell, range } = options.styles;
  // Set up styles for specific columns
  const columnStyles = column || {};
  for (const [colNo, colStyle] of Object.entries(columnStyles)) {
    sheet.column(colNo).style(colStyle);
  }
  // Set up styles for specific rows
  const rowStyles = row || {};
  for (const [rowNo, rowStyle] of Object.entries(rowStyles)) {
    sheet.row(rowNo).style(rowStyle);
  }
  // Set up styles for specific cells
  const cellStyles = cell || {};
  for (const [cellNo, cellStyle] of Object.entries(cellStyles)) {
    sheet.cell(cellNo).style(cellStyle);
  }
  // Set up styles for specific ranges
  const rangeStyles = range || {};
  for (const [rangeNo, rangeStyle] of Object.entries(rangeStyles)) {
    sheet.range(rangeNo).style(rangeStyle);
  }

  // Merge cells
  if (Array.isArray(options.merges) && options.merges.length) {
    options.merges.forEach((merge) => {
      sheet.range(merge).merged(true);
    });
  }

  // Freeze panes
  if (Array.isArray(options.freezePanes) && options.freezePanes.length) {
    options.freezePanes.forEach((pane) => {
      if (typeof pane.xSplit === 'number' && typeof pane.ySplit === 'number')
        sheet.freezePanes(pane.xSplit, pane.ySplit);
      else if (pane.topLeftCell)
        sheet.freezePanes(pane.topLeftCell);
    });
  }

  const blob = await workbook.outputAsync();
  saveSync(blob, options.fileName);
};

export {
  downloadXLSX
};

/*eslint func-style: ["error", "declaration"]*/

export {
  getTableData
};

function getValueAtPath(data, path) {
  if (path.indexOf('.') >= 0) {
    const parts = path.split('.');
    let value = data;
    parts.forEach(part => value = value[part]);
    return value;
  } else {
    return data[path];
  }
}

function getTableData(rows, columns, state) {
  let returnData = JSON.parse(JSON.stringify(rows));
  if (state.searchTerm) {
    const searchTerm = state.searchTerm.toLowerCase();
    returnData = returnData.filter(row => {
      let isMatch = false;
      columns.forEach(column => {
        if (column.sort) {  // making use of `sort` field for the searchable fields
          const searchData = getValueAtPath(row, column.sort);
          if (searchData && typeof searchData === 'string' && searchData.toLowerCase().indexOf(searchTerm) >= 0) isMatch = true;
        }
      });
      return isMatch;
    });
  }
  if (state.where && state.where.length) {
    state.where.forEach(where => {
      switch (where.comparator) {
      case '==':
        returnData = returnData.filter(row => row[where.field] === where.value);
        break;
      case 'in':
        returnData = returnData.filter(row => where.value.indexOf(row[where.field]) >= 0);
        break;
      }
    });
  }
  if (state.orderBy) {
    const orderBy = state.orderBy;
    const direction = state.direction;
    returnData.sort((a, b) => {
      if (a[orderBy] < b[orderBy]) return direction === 'asc' ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return returnData;
}

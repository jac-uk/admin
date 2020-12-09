const search = (searchValue) => {
  let returnValue = null;
  const searchArr = [...searchValue];
  let searchStr, searchStrNext;
  const searchLenght = searchArr.length;

  if (searchValue) {
    // searchArr[0] = searchArr[0].toUpperCase(); // First letter Uppercase
    searchStr = searchArr.join('');
    const nextLastCharacter = nextChar(searchArr[searchLenght - 1]);
    searchArr[searchLenght - 1] = nextLastCharacter;
    searchStrNext = searchArr.join('');
    returnValue = { 'value1': searchStr, 'value2': searchStrNext };
  }
  return returnValue;
};

const nextChar = (c) => String.fromCharCode(c.charCodeAt(0) + 1);

const getValueAtObjectPath = (object, path) => {
  if (path && path.indexOf('.') >= 0) {
    let currentPath = path.substring(0, path.indexOf('.'));
    let remainingPath = path.substring(path.indexOf('.') + 1);
    let valueAtPath = object[currentPath];
    while (remainingPath.indexOf('.') >= 0) {
      currentPath = remainingPath.substring(0, remainingPath.indexOf('.'));
      remainingPath = remainingPath.substring(remainingPath.indexOf('.') + 1);
      valueAtPath = valueAtPath[currentPath];
    }
    valueAtPath = valueAtPath[remainingPath];
    return valueAtPath;
  } else {
    return object[path];
  }
};

const tableQuery = (data, ref, params) => {
  let queryRef = ref;
  if (params) {
    let orderBy = params.orderBy;
    if (params.searchTerm) {
      const returnSearch = search(params.searchTerm);
      if (returnSearch) {
        queryRef = queryRef
          .where(params.search[0], '>=', returnSearch.value1)
          .where(params.search[0], '<', returnSearch.value2)
          .orderBy(params.search[0], 'asc');
        orderBy = params.search[0];
      }
      // @TODO handle multiple search fields.
      // N.B. this will involve multiple queries so may involve ditching vuexfire
    } else if (params.orderBy) {
      const direction = params.direction ? params.direction : 'asc';
      queryRef = queryRef.orderBy(params.orderBy, direction);
    }
    if (params.pageSize) {
      if (params.pageChange > 0) {
        // page forward
        if (data.length) {
          queryRef = queryRef
            .startAfter(getValueAtObjectPath(data[data.length - 1], orderBy))
            .limit(params.pageSize);
          // @TODO use last document instead of single field value
        } else {
          queryRef = queryRef.limit(params.pageSize);
        }
      } else if (params.pageChange < 0) {
        // page backward
        if (data.length) {
          queryRef = queryRef
            .endBefore(getValueAtObjectPath(data[0], orderBy))
            .limitToLast(params.pageSize);
          // @TODO use first document instead of single field value
        } else {
          queryRef = queryRef.limit(params.pageSize);
        }
      } else {
        queryRef = queryRef.limit(params.pageSize);
      }
    }
  }
  return queryRef;
};

export default tableQuery;

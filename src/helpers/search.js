const searchString = (searchValue) => {
    let returnValue = null;
    let searchArr = [...searchValue];
    let searchStr, searchStrNext;
    let searchLenght = searchArr.length;
    
    if (searchValue) {
        // searchArr[0] = searchArr[0].toUpperCase(); // First letter Uppercase
        searchStr = searchArr.join('');
        let nextLastCharacter = nextChar(searchArr[searchLenght - 1]);
        searchArr[searchLenght - 1] = nextLastCharacter;
        searchStrNext = searchArr.join('');
        returnValue = { 'value1': searchStr, 'value2': searchStrNext };
    }
    return returnValue;
};

const nextChar = (c) => String.fromCharCode(c.charCodeAt(0) + 1);

export default searchString;

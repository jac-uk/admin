
export {
  read,
  write,
  empty,
  hasData,
  data
};

const data = {};

const read = async () => {
  if (navigator && navigator.clipboard && navigator.clipboard.readText && document.hasFocus()) {
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText) {
      if (clipboardText.indexOf('JAC_CONTENT') >= 0) {
        setData(...fromJACString(clipboardText));
      } else {
        setData();
      }
    } else {
      setData();
    }
  }
};

const toJACString = (environment, type, title, content) => {
  return `JAC_ENV=${environment}&&JAC_TYPE=${type}&&JAC_TITLE=${title}&&JAC_CONTENT=${content}`;
};

const fromJACString = (JACString) => {
  const parts = JACString.split('&&');
  return parts.map(part => {
    if (part.indexOf('JAC_ENV=') >= 0) {
      return part.substring(8);
    }
    if (part.indexOf('JAC_TYPE=') >= 0) {
      return part.substring(9);
    }
    if (part.indexOf('JAC_TITLE=') >= 0) {
      return part.substring(10);
    }
    if (part.indexOf('JAC_CONTENT=') >= 0) {
      return part.substring(12);
    }
  });
};

const write = async (environment, type, title, content) => {
  if (navigator && navigator.clipboard) {
    await navigator.clipboard.writeText(toJACString(environment, type, title, content));
    setData(environment, type, title, content);
  }
};

const setData = (environment, type, title, content) => {
  data.environment = environment || '';
  data.type = type || '';
  data.title = title || '';
  data.content = content || '';
};

const empty = async () => {
  if (navigator && navigator.clipboard) {
    await navigator.clipboard.writeText('');
    setData();
  }
};

const hasData = () => {
  return data.type ? true : false;
};

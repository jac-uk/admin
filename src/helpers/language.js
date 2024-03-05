import { LANGUAGES } from '@/helpers/constants';
import welshData from '@/assets/welsh.json';

const yesWelshList = [
  {
    ids: ['reasonable-adjustments', 'request-to-resign', 'other-character-issues'],
    welsh: 'Oes',
  },
  {
    ids: ['disability', 'part-time-working-preferences'],
    welsh: 'OES',
  },
  {
    ids: ['first-generation-student'],
    welsh: 'IE',
  },
  {
    ids: ['changed-gender'],
    welsh: 'YDY',
  },
  {
    ids: ['participated-in-judicial-workshadowing-scheme', 'oxbridge-universities', 'atttended-outreach-events', 'has-taken-paje'],
    welsh: 'DO',
  },
  {
    ids: ['applying-for-welsh-post'],
    welsh: 'YDW YF',
  },
  {
    ids: ['speak-welsh', 'applying-under-schedule-2-d'],
    welsh: 'YDWYF',
  },
  {
    ids: ['can-give-reasonable-los'],
    welsh: 'GALLAF',
  },
  {
    ids: ['Hoffwn'],
    welsh: 'Hoffwn',
  },
];
const noWelshList = [
  {
    ids: ['reasonable-adjustments', 'request-to-resign', 'other-character-issues'],
    welsh: 'Nac Oes',
  },
  {
    ids: ['disability', 'part-time-working-preferences'],
    welsh: 'NAC OES',
  },
  {
    ids: ['first-generation-student', 'read-and-write-welsh'],
    welsh: 'NA',
  },
  {
    ids: ['changed-gender'],
    welsh: 'NAC YDY',
  },
  {
    ids: ['participated-in-judicial-workshadowing-scheme', 'oxbridge-universities', 'atttended-outreach-events', 'has-taken-paje'],
    welsh: 'NADDO',
  },
  {
    ids: ['applying-for-welsh-post'],
    welsh: 'NAC YF',
  },
  {
    ids: ['speak-welsh', 'applying-under-schedule-2-d'],
    welsh: 'NAC YDWYF',
  },
  {
    ids: ['can-give-reasonable-los'],
    welsh: 'NA ALLAF',
  },
  {
    ids: ['Na'],
    welsh: 'Na',
  },
];

const updateLangToTextNode = (node, lang = LANGUAGES.ENGLISH) => {
  const textNodes = [];
  const pushTextNode = (node) => {
    if (node.nodeName === '#text') {
      const nodeVal = node.nodeValue.trim().replace(/(\r\n|\n|\r)/gm, '').replace(/  +/g, ' '); // remove line breaks and replace multiple spaces with a single space
      if (!nodeVal) return;

      if (lang === LANGUAGES.ENGLISH) {
        if (yesWelshList.find(item => item.welsh === nodeVal)) {
          node.nodeValue = 'Yes ';
          textNodes.push(nodeVal);
          return;
        }
        if (noWelshList.find(item => item.welsh === nodeVal)) {
          node.nodeValue = 'No ';
          textNodes.push(nodeVal);
          return;
        }

        let hasMatch = false;
        for (const [key, value] of Object.entries(welshData)) {
          if (value === nodeVal) {
            node.nodeValue = ` ${key} `; // add white space back to deal with the text concatenation
            textNodes.push(nodeVal);
            hasMatch = true;
            break;
          }
        }

        if (!hasMatch) {
          const texts = nodeVal.split(' '); // deal with translated date
          let hasWelsh = false;
          const res = [];
          texts.forEach(text => {
            let hasMatch = false;
            for (const [key, value] of Object.entries(welshData)) {
              if (value === text) {
                res.push(key);
                hasMatch = true;
                hasWelsh = true;
                break;
              }
            }
            if (!hasMatch) res.push(text);
          });
          if (hasWelsh) {
            node.nodeValue = ` ${res.join(' ')} `;
            textNodes.push(nodeVal);
          }
        }
      } else if (lang === LANGUAGES.WELSH) {
        if (nodeVal === 'Yes') {
          const match = yesWelshList.find(item => {
            const name = node.parentNode.getAttribute('data-welsh');
            if (!name) return false;
            return item.ids.some(c => name.includes(c));
          });
          if (match) {
            node.nodeValue = ` ${match.welsh} `;
            textNodes.push(nodeVal);
            return;
          }
        }
        if (nodeVal === 'No') {
          const match = noWelshList.find(item => {
            const name = node.parentNode.getAttribute('data-welsh');
            if (!name) return false;
            return item.ids.some(c => name.includes(c));
          });
          if (match) {
            node.nodeValue = ` ${match.welsh} `;
            textNodes.push(nodeVal);
            return;
          }
        }

        if (welshData[nodeVal]) {
          node.nodeValue = ` ${welshData[nodeVal]} `; // add white space back to deal with the text concatenation
          textNodes.push(nodeVal);
        } else {
          const texts = nodeVal.split(' '); // deal with date (e.g. March 2023)
          let hasMatch = false;
          const res = [];
          texts.forEach(text => {
            if (welshData[text]) {
              res.push(welshData[text]);
              hasMatch = true;
            } else {
              res.push(text);
            }
          });
          if (hasMatch) {
            node.nodeValue = ` ${res.join(' ')} `;
            textNodes.push(nodeVal);
          }
        }
      }
      return;
    }

    node.childNodes.forEach((childNode) => {
      pushTextNode(childNode);
    });
  };

  pushTextNode(node);
  return textNodes;
};

// get id for data-welsh attribute
const getDataWelshId = (value) => {
  return value.toLowerCase().split(' ').join('_');
};

// get welsh value for data-welsh attribute
const getDataWelsh = ({ id, value }) => {
  if (
    id.includes(getDataWelshId('Secondment to the Court of Protection')) ||
    id.includes(getDataWelshId('Posts in Wales - Welsh Language')) ||
    id.includes(getDataWelshId('Posts in Wales - Welsh Language Continued'))
  ) {
    if (value === 'Yes') {
      return 'Hoffwn';
    } else if (value === 'No') {
      return 'Na';
    }
  }
  return '';
};

export {
  updateLangToTextNode,
  getDataWelshId,
  getDataWelsh
};

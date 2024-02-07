import { httpsCallable } from '@firebase/functions';
import { functions } from '@/firebase';

const logEvent = async (type, description, details) => {
  return await httpsCallable(functions, 'logEvent')({
    type: type,
    description: description,
    details: details,
  });
};

export { logEvent };

import { functions } from '@/firebase';

const logEvent = async (type, description, details) => {
  return await functions.httpsCallable('logEvent')({
    type: type,
    description: description,
    details: details,
  });
};

export { logEvent };

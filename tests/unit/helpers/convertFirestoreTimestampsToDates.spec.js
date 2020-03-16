import convertFirestoreTimestampsToDates from '@/helpers/convertFirestoreTimestampsToDates';
import firebase from '@/firebase';
const Timestamp = firebase.firestore.Timestamp;

xdescribe('helpers/convertFirestoreTimestampsToDates', () => {
  const date = new Date('2015-12-23 22:33:44');
  const timestamp = Timestamp.fromDate(date);

  it('converts Firestore Timestamp objects into equivalent Date objects', () => {
    const data = {
      name: 'John Smith',
      appliedDate: timestamp,
      qtPassed: true,
      qtScore: 28,
    };

    const converted = convertFirestoreTimestampsToDates(data);

    expect(converted.appliedDate).toBeInstanceOf(Date);
    expect(converted.appliedDate).toEqual(timestamp.toDate());
    expect(converted.appliedDate).toEqual(date);
  });

  it('converts deeply nested Timestamps', () => {
    const data = {
      some: {
        deeply: {
          nested: {
            data: {
              with: {
                a: {
                  timestamp: timestamp,
                },
              },
            },
          },
        },
      },
    };

    const sanitized = convertFirestoreTimestampsToDates(data);

    expect(sanitized.some.deeply.nested.data.with.a.timestamp).toBeInstanceOf(Date);
    expect(sanitized.some.deeply.nested.data.with.a.timestamp).toEqual(date);
  });

  it('leaves other data untouched', () => {
    const data = {
      name: 'John Smith',
      phone: {
        home: '+441234567890',
        mobile: '+447890123456',
      },
      emails: [
        'jsmith@gmail.com',
        'john.smith@outlook.com',
      ],
      qtPassed: true,
      qtScore: 28,
      aNullValue: null,
    };

    const sanitized = convertFirestoreTimestampsToDates(data);

    expect(sanitized.name).toEqual('John Smith');
    expect(sanitized.phone).toEqual({
      home: '+441234567890',
      mobile: '+447890123456',
    });
    expect(sanitized.emails).toEqual([
      'jsmith@gmail.com',
      'john.smith@outlook.com',
    ]);
    expect(sanitized.qtPassed).toEqual(true);
    expect(sanitized.qtScore).toEqual(28);
    expect(sanitized.aNullValue).toBeNull();
  });

  it('doesn\'t change the input object (when passed by reference)', () => {
    const data = {
      name: 'John Smith',
      appliedDate: timestamp,
      qtPassed: true,
      qtScore: 28,
    };

    convertFirestoreTimestampsToDates(data);

    expect(data.appliedDate).toBe(timestamp);
  });

  it('returns a new object', () => {
    const data = {
      name: 'John Smith',
      email: 'johnsmith@example.com',
    };

    const sanitized = convertFirestoreTimestampsToDates(data);

    expect(sanitized).toEqual(data);
    expect(sanitized).not.toBe(data);
  });

  const falsy = [null, undefined, false];
  it.each(falsy)('does not sanitize falsy value `%s`', (value) => {
    const sanitized = convertFirestoreTimestampsToDates(value);
    expect(sanitized).toBe(value);
  });
});

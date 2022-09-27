/*eslint func-style: ["error", "declaration"]*/

export {
  randomNumber,
  randomArrayItem,
  generateApplications
};

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomArrayItem(arr) {
  return arr[randomNumber(1, arr.length) - 1];
}

function getMaleFirstName() {
  return randomArrayItem(malefirstNames);
}

function getFemaleFirstName() {
  return randomArrayItem(femalefirstNames);
}

function getLastName() {
  return randomArrayItem(lastNames);
}

function getMaleTitle() {
  return randomArrayItem(maleTitles);
}

function getFemaleTitle() {
  return randomArrayItem(femaleTitles);
}

function generateApplications(exerciseRef, quantity) {
  const applications = [];
  for (let i = 0, len = quantity; i < len; ++i) {
    let firstName = '';
    let title = '';
    if (Math.random() < 0.5 ) {
      firstName = getMaleFirstName();
      title = getMaleTitle();
    } else {
      firstName = getFemaleFirstName();
      title = getFemaleTitle();
    }
    const lastName = getLastName();
    applications.push({
      id: `${i}`,
      referenceNumber: getApplicationReferenceNumber(exerciseRef, i + 1),
      personalDetails: {
        title,
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        email: getEmail(firstName, lastName),
        dateOfBirth: '1976-02-08',
        phone: '012345 678910',
        nationalInsuranceNumber: 'QQ 12 34 56 C',
        citizenship: 'uk',
        reasonableAdjustments: false,
      },
      userId: `${i}`,
    });
  }
  return applications;
}

function getEmail(firstName, lastName, domain) {
  if (domain) {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domain}`;
  } else {
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@sharklasers.com`;
  }
}

function getApplicationReferenceNumber(exerciseReferenceNumber, index) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let randomCharacters = '';
  for (let i = 0, len = 3; i < len; i++) {
    randomCharacters += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return `${exerciseReferenceNumber}-${  randomCharacters  }${(10000 + index).toString().substr(1)}`;
}

const maleTitles = [
  'Mr',
  'Dr',
  'Rt. Hon.',
];

const femaleTitles = [
  'Mrs',
  'Ms',
  'Miss',
  'Dr',
  'Rt. Hon.',
];

const femalefirstNames = [
  'Abigail',
  'Alexandra',
  'Alison',
  'Amanda',
  'Amelia',
  'Amy',
  'Andrea',
  'Angela',
  'Anna',
  'Anne',
  'Audrey',
  'Ava',
  'Bella',
  'Bernadette',
  'Carol',
  'Caroline',
  'Carolyn',
  'Chloe',
  'Claire',
  'Deirdre',
  'Diana',
  'Diane',
  'Donna',
  'Dorothy',
  'Elizabeth',
  'Ella',
  'Emily',
  'Emma',
  'Faith',
  'Felicity',
  'Fiona',
  'Gabrielle',
  'Grace',
  'Hannah',
  'Heather',
  'Irene',
  'Jan',
  'Jane',
  'Jasmine',
  'Jennifer',
  'Jessica',
  'Joan',
  'Joanne',
  'Julia',
  'Karen',
  'Katherine',
  'Kimberly',
  'Kylie',
  'Lauren',
  'Leah',
  'Lillian',
  'Lily',
  'Lisa',
  'Madeleine',
  'Maria',
  'Mary',
  'Megan',
  'Melanie',
  'Michelle',
  'Molly',
  'Natalie',
  'Nicola',
  'Olivia',
  'Penelope',
  'Pippa',
  'Rachel',
  'Rebecca',
  'Rose',
  'Ruth',
  'Sally',
  'Samantha',
  'Sarah',
  'Sonia',
  'Sophie',
  'Stephanie',
  'Sue',
  'Theresa',
  'Tracey',
  'Una',
  'Vanessa',
  'Victoria',
  'Virginia',
  'Wanda',
  'Wendy',
  'Yvonne',
  'Zoe',
];

const malefirstNames = [
  'Adam',
  'Adrian',
  'Alan',
  'Alexander',
  'Andrew',
  'Anthony',
  'Austin',
  'Benjamin',
  'Blake',
  'Boris',
  'Brandon',
  'Brian',
  'Cameron',
  'Carl',
  'Charles',
  'Christian',
  'Christopher',
  'Colin',
  'Connor',
  'Dan',
  'David',
  'Dominic',
  'Dylan',
  'Edward',
  'Eric',
  'Evan',
  'Frank',
  'Gavin',
  'Gordon',
  'Harry',
  'Ian',
  'Isaac',
  'Jack',
  'Jacob',
  'Jake',
  'James',
  'Jason',
  'Joe',
  'John',
  'Jonathan',
  'Joseph',
  'Joshua',
  'Julian',
  'Justin',
  'Keith',
  'Kevin',
  'Leonard',
  'Liam',
  'Lucas',
  'Luke',
  'Matt',
  'Max',
  'Michael',
  'Nathan',
  'Neil',
  'Nicholas',
  'Oliver',
  'Owen',
  'Paul',
  'Peter',
  'Phil',
  'Piers',
  'Richard',
  'Robert',
  'Ryan',
  'Sam',
  'Sean',
  'Sebastian',
  'Simon',
  'Stephen',
  'Steven',
  'Stewart',
  'Thomas',
  'Tim',
  'Trevor',
  'Victor',
  'Warren',
  'William',
];

const lastNames = [
  'Abraham',
  'Allan',
  'Alsop',
  'Anderson',
  'Arnold',
  'Avery',
  'Bailey',
  'Baker',
  'Ball',
  'Bell',
  'Berry',
  'Black',
  'Blake',
  'Bond',
  'Bower',
  'Brown',
  'Buckland',
  'Burgess',
  'Butler',
  'Cameron',
  'Campbell',
  'Carr',
  'Chapman',
  'Churchill',
  'Clark',
  'Clarkson',
  'Coleman',
  'Cornish',
  'Davidson',
  'Davies',
  'Dickens',
  'Dowd',
  'Duncan',
  'Dyer',
  'Edmunds',
  'Ellison',
  'Ferguson',
  'Fisher',
  'Forsyth',
  'Fraser',
  'Gibson',
  'Gill',
  'Glover',
  'Graham',
  'Grant',
  'Gray',
  'Greene',
  'Hamilton',
  'Hardacre',
  'Harris',
  'Hart',
  'Hemmings',
  'Henderson',
  'Hill',
  'Hodges',
  'Howard',
  'Hudson',
  'Hughes',
  'Hunter',
  'Ince',
  'Jackson',
  'James',
  'Johnston',
  'Jones',
  'Kelly',
  'Kerr',
  'King',
  'Knox',
  'Lambert',
  'Langdon',
  'Lawrence',
  'Lee',
  'Lewis',
  'Lyman',
  'MacDonald',
  'Mackay',
  'Mackenzie',
  'MacLeod',
  'Manning',
  'Marshall',
  'Martin',
  'Mathis',
  'May',
  'McDonald',
  'McLean',
  'McGrath',
  'Metcalfe',
  'Miller',
  'Mills',
  'Mitchell',
  'Morgan',
  'Morrison',
  'Murray',
  'Nash',
  'Newman',
  'Nolan',
  'North',
  'Ogden',
  'Oliver',
  'Paige',
  'Parr',
  'Parsons',
  'Paterson',
  'Payne',
  'Peake',
  'Peters',
  'Piper',
  'Poole',
  'Powell',
  'Pullman',
  'Quinn',
  'Rampling',
  'Randall',
  'Rees',
  'Reid',
  'Roberts',
  'Robertson',
  'Ross',
  'Russell',
  'Rutherford',
  'Sanderson',
  'Scott',
  'Sharp',
  'Short',
  'Simpson',
  'Skinner',
  'Slater',
  'Smith',
  'Springer',
  'Stewart',
  'Sutherland',
  'Taylor',
  'Terry',
  'Thomson',
  'Tucker',
  'Turner',
  'Underwood',
  'Vance',
  'Vaughan',
  'Walker',
  'Wallace',
  'Walsh',
  'Watson',
  'Welch',
  'White',
  'Wilkins',
  'Wilson',
  'Wright',
  'Young',
];

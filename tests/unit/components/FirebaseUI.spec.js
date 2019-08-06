import { shallowMount } from '@vue/test-utils';
import FirebaseUI from '@/components/FirebaseUI';
import firebaseui from 'firebaseui';
import { auth } from '@/firebase';

const mockFirebaseAuth = jest.fn();
const mockUiInstance = {
  start: jest.fn(),
  delete: jest.fn(),
};

jest.mock('@/firebase', () => {
  const mock = {
    auth: jest.fn(() => (mockFirebaseAuth)),
  };
  mock.auth.GoogleAuthProvider = {
    PROVIDER_ID: 'email',
    requireDisplayName: true,
  };
  return mock;
});

jest.mock('firebaseui', () => (
  { auth: {
    AuthUI: jest.fn(() => mockUiInstance),
    CredentialHelper: {
      NONE: 'none',
    },
  },
}));

describe('FirebaseUI component', () => {
  const createTestSubject = () => {
    jest.clearAllMocks();
    return shallowMount(FirebaseUI);
  };

  let wrapper;

  beforeEach(() => {
    wrapper = createTestSubject();
  });

  it('renders a firebaseui-auth-container element in DOM', () => {
    expect(wrapper.find('#firebaseui-auth-container').exists()).toBe(true);
  });

  it('creates a FirebaseUI instance bound to the Firebase Auth instance', () => {
    expect(firebaseui.auth.AuthUI).toHaveBeenCalledWith(mockFirebaseAuth);
    expect(wrapper.vm.ui).toBe(mockUiInstance);
  });

  it('starts FirebaseUI', () => {
    expect(mockUiInstance.start).toHaveBeenCalledTimes(1);
    expect(mockUiInstance.start).toHaveBeenCalledWith(
      '#firebaseui-auth-container',
      wrapper.vm.uiConfig
    );
  });

  it('passes the right config into FirebaseUI', () => {
    const uiConfigOptions = {
      signInOptions: [
        {
          provider: auth.GoogleAuthProvider.PROVIDER_ID,
          customParameters: { hd: 'judicialappointments.digital' },
        },
      ],
      callbacks: {
        signInSuccessWithAuthResult: wrapper.vm.signInSuccess,
      },
    };

    expect(wrapper.vm.uiConfig).toEqual(uiConfigOptions);
  });

  it('emits a signInSuccess event containing an authResult object', () => {
    const authResult = {
      additionalUserInfo: {},
      credential: null,
      operationType: 'signIn',
      user: {},
    };

    wrapper.vm.signInSuccess(authResult);
    expect(wrapper.emitted().signInSuccess).toHaveLength(1);
    expect(wrapper.emitted().signInSuccess[0]).toEqual([authResult]);
  });

  it('destroys the FirebaseUI instance when the component is destroyed', () => {
    wrapper.destroy();
    
    expect(mockUiInstance.delete).toBeCalledTimes(1);
  });

});

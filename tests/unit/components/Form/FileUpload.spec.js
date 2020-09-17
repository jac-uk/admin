import { createTestSubject } from '../../helpers';

const mockPut = jest.fn()
  .mockName('put');
const mockGetDownloadURL = jest.fn()
  .mockName('getDownloadURL');
const mockRef = jest.fn()
  .mockName('ref')
  .mockReturnValue({
    put: mockPut,
    getDownloadURL: mockGetDownloadURL,
  });

jest.mock('@firebase/app', () => ({
  __esModule: true,
  default: {
    apps: [],
    initializeApp: () => {},
    auth: jest.fn(),
    storage: jest.fn()
      .mockImplementation(() => ({
        ref: mockRef,
      })),
    },
  })
);

jest.mock('@firebase/storage', () => ({
  __esModule: true,
  default: {
    registerService: jest.fn(), // required by firebase/app
  },
}));

import '@firebase/app';
import '@firebase/storage';

import FileUpload from '@/components/Form/FileUpload';

describe('components/Form/FileUpload', () => {

  describe('props', () => {
    let prop;

    describe('path', () => {
      beforeEach(() => {
        prop = FileUpload.props.path;
      });

      it('is required', () => {
        expect(prop.required).toBe(true);
      });

      it('has type String', () => {
        expect(prop.type()).toBeString();
      });

      it('has default value of \'\'', () => {
        expect(prop.default).toBe('');
      });
    });

      describe('value', () => {
        beforeEach(() => {
          prop = FileUpload.props.value;
        });
  
        it('is not required', () => {
          expect(prop.required).toBeFalsy();
        });
  
        it('has type String', () => {
          expect(prop.type()).toBeString();
        });

        it('has default value of \'\'', () => {
          expect(prop.default).toBe('');
        });
        
      });

      describe('name', () => {
        beforeEach(() => {
          prop = FileUpload.props.name;
        });
  
        it('is required', () => {
          expect(prop.required).toBe(true);
        });
  
        it('has type String', () => {
          expect(prop.type()).toBeString();
        });

        it('has default value of \'\'', () => {
          expect(prop.default).toBe('');
        });

      });

      describe('messages', () => {
        beforeEach(() => {
          prop = FileUpload.props.messages;
        });
  
        it('has type Object', () => {
          expect(prop.type()).toBeObject();
        });

        xit('has default value of ????', () => {
          expect(prop.default).toBe('????');
        });

      });

    });

  });

  describe('component instance', () => {
  let wrapper;
  const mockProps = {
    id: 'my_unique_id',
    path: 'my_path',
    name: 'name',
  };

  beforeEach(() => {
    wrapper = createTestSubject(FileUpload, {
        mocks: {},
        stubs: [],
        propsData: mockProps,
      });
  });

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe('template', () => {
    describe('label', () => {
      it('sets the label to the value of the `label` prop', () => {
        wrapper.setProps({ label: 'My Form Label' });
        expect(wrapper.find('label').text()).toBe('My Form Label');
      });
    });

    describe('hint', () => {
      let hint;
      describe('when the prop is set', () => {
        beforeEach(() => {
          wrapper.setProps({ hint: 'my_hint' });
          hint = wrapper.find('.govuk-hint');
        });

        it('shows a hint', () => {
          expect(hint.exists()).toBe(true);
        });
        it('sets the hint to the value of the `hint` prop', () => {
          expect(hint.text()).toBe('my_hint');
        });
      });

      describe('when the prop is not set', () => {
        beforeEach(() => {
          hint = wrapper.find('.govuk-hint');
        });

        it('does not show hint', () => {
          expect(hint.exists()).toBe(false);
        });
      });
    });

    describe('id', () => {
      it('sets <input> `id` attribute', () => {
        wrapper.setProps({ id: 'my_unique_key' });
        expect(wrapper.find('input').attributes().id).toBe('my_unique_key');
      });
    });
  });

  describe('properties', () => {
    describe('path', () => {
      it('sets `path` property', () => {
        expect(wrapper.vm.path).toBe(mockProps.path);
      });
    });

    describe('`v-model` interface', () => {
      describe('when text changes', () => {
        it('emits an input event with the new value', () => {
          wrapper.setData({ fileName: 'new-value' });
          expect(wrapper.emitted().input).toEqual([['new-value']]);
        });
      });

      describe('when `value` prop changes', () => {
        it('updates the `fileName` computed property', () => {
          wrapper.setProps({ value: 'my_value' });
          expect(wrapper.vm.fileName).toEqual('my_value');
        });
      });
    });

    describe('computed properties', () => {
      describe('haveFile', () => {
        it('is false if no value or empty', () => {
          wrapper.setProps({ value: '' });
          expect(wrapper.vm.haveFile).toBe(false);
        });
        it('is true if value set', () => {
          wrapper.setProps({ value: 'my_value' });
          expect(wrapper.vm.haveFile).toBe(true);
        });

      });
    });

  });

  describe('lifecycle hooks', () => {
    describe('mounted', () => {
      const mockLocalProps = {
        value: '',
        id: 'mock_id',
        path: 'mock_path',
        name: 'mock_name',
      };
      const mockVerifyFile = jest.fn()
        .mockName('verifyFile');

      it('should not call .verifyFile() if fileName doesn\'t exist', () => {
        createTestSubject(FileUpload, {
          propsData: mockLocalProps,
          mocks: {
            verifyFile: mockVerifyFile,
          },
          stubs: [],
        });

        expect(mockVerifyFile).not.toHaveBeenCalled();
      });

      xit('should call .verifyFile() if fileName exists', () => {
        createTestSubject(FileUpload, {
          propsData: {
            ...mockLocalProps,
            value: 'mock_value',
          },
          mocks: {
            verifyFile: mockVerifyFile,
          },
          stubs: [],
        });

        expect(mockVerifyFile).toHaveBeenCalled();
      });

      xit('should reset fileName if .verifyFile failed', async () => {
        const wrapper = createTestSubject(FileUpload, {
          stubs: [],
          propsData: {
            ...mockLocalProps,
            value: 'mock_value',
          },
          mocks: {
            verifyFile: mockVerifyFile
              .mockReturnValue(false),
          },
        });

        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input).toEqual([['']]);
      });
    });
  });

  describe('methods', () => {
    const mockFileExtension = 'doc';
    const mockFile = {
      name: `mock file.${  mockFileExtension}`,
    };
    const invalidMockFileExtension = 'png';
    const invalidMockFile = {
      name: `mock file.${  invalidMockFileExtension}`,
    };
    const errorMessage1 = 'File upload failed, please try again [1]';
    const errorMessage2 = 'File upload failed, please try again [2]';
    const errorMessage3 = 'File upload failed, please try again [3]';
    const invalidExtensionErrorMessage = 'Invalid file type. Choose from: pdf,docx,doc,odt,txt,fodt';

    describe('replaceFile()', () => {
      it('sets `isReplacing` property', () => {
        wrapper.vm.replaceFile();
        expect(wrapper.vm.isReplacing).toBe(true);
      });
    });

    describe('fileSelected()', () => {
      it('resets errors', () => {
        wrapper.vm.setError = jest.fn();

        wrapper.vm.fileSelected();
        expect(wrapper.vm.setError).toHaveBeenCalledWith('');
      });
      it('calls .upload()', () => {
        wrapper.vm.upload = jest.fn();

        wrapper.vm.fileSelected();
        expect(wrapper.vm.upload).toHaveBeenCalled();
      });
    });

    describe('generateFileName()', () => {
      it('returns set name with original extension', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        const newName = wrapper.vm.generateFileName('original name.doc');
        const parts = newName.split('.');
        expect(parts.length).toEqual(2);
        expect(parts[0]).toBe(setName);
        expect(parts[1]).toBe('doc');
      });

      it('returns set name with no extension if original file didn\'t have one', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        const newName = wrapper.vm.generateFileName('original name');
        expect(newName).toEqual(setName);
      });

      it('returns set name with original extension even if original name contains .', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        const newName = wrapper.vm.generateFileName('original name.final.version.doc');
        const parts = newName.split('.');
        expect(parts.length).toEqual(2);
        expect(parts[0]).toBe(setName);
        expect(parts[1]).toBe('doc');
      });
    });

    describe('validFileExtension()', () => {
      it('accepts .docx files', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name.docx')).toBeTruthy();
      });

      it('accepts .pdf files', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name.pdf')).toBeTruthy();
      });

      it('accepts .odt files', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name.odt')).toBeTruthy();
      });

      it('accepts .doc files', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name.doc')).toBeTruthy();
      });

      it('accepts .fodt files', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name.fodt')).toBeTruthy();
      });

      it('accepts .txt files', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name.txt')).toBeTruthy();
      });

      it('accepts files with multiple extensions if last one is valid', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name.layers.of.indirection.pdf')).toBeTruthy();
      });
      
      it('rejects file with unrecognised extension', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name.png')).toBeFalsy();
      });

      it('rejects .invalid files', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name.invalid')).toBeFalsy();
      });

      it('rejects no extension files', () => {
        const setName = 'filename';
        wrapper.setProps({ name: setName });

        expect(wrapper.vm.validFileExtension('original name')).toBeFalsy();
      });
    });

    describe('validFileSize()', () => {
      it('accepts sub-2MB files', () =>  {
        const setName = 'filename';
        const setSize = 900 * 1024; // 900 Kb
        wrapper.setProps({ name: setName, size: setSize });

        expect(wrapper.vm.validFileSize(setSize)).toBeTruthy();
      });
      it('accepts 2MB files', () =>  {
        const setName = 'filename';
        const setSize = 2 * 1024 * 1024; // 2MB
        wrapper.setProps({ name: setName, size: setSize });

        expect(wrapper.vm.validFileSize(setSize)).toBeTruthy();
      });
      it('does not accept touch over 2MB files', () =>  {
        const setName = 'filename';
        const setSize = (2 * 1024 * 1024) + 1; // 2MB + 1 bit
        wrapper.setProps({ name: setName, size: setSize });

        expect(wrapper.vm.validFileSize(setSize)).toBeFalsy();
      });
      it('does not accept very over 2MB files', () =>  {
        const setName = 'filename';
        const setSize = (20 * 1024 * 1024); // 20MB
        wrapper.setProps({ name: setName, size: setSize });

        expect(wrapper.vm.validFileSize(setSize)).toBeFalsy();
      });
    });

    describe('resetFile()', () => {
      it('clears reference to file', () => {
        wrapper.vm.resetFile();

        expect(wrapper.vm.$refs.file).toBeNull();
      });

      it('resets `isUploading` property', () => {
        wrapper.vm.resetFile();
        expect(wrapper.vm.isUploading).toBeFalse();
      });
    });

    describe('upload()', () => {
      beforeEach(() => {
        wrapper.vm.setError = jest.fn();
        mockPut.mockReset();
      });

      it('sets error and returns false if called without file', async () => {
        expect.assertions(2);

        const result = await wrapper.vm.upload(mockFile);
        expect(wrapper.vm.setError).toHaveBeenCalledWith(errorMessage2);
        expect(result).toBeFalsy();
      });

      it('sets error and returns false if called with invalid file extension', async () => {
        expect.assertions(2);

        const result = await wrapper.vm.upload(invalidMockFile);
        expect(wrapper.vm.setError).toHaveBeenCalledWith(invalidExtensionErrorMessage);
        expect(result).toBeFalsy();
      });

      describe('with file', () => {
        it('sets `isUploading` property', async () => {
          wrapper.vm.resetFile = jest.fn();
          expect.assertions(1);
          await wrapper.vm.upload(mockFile);

          expect(wrapper.vm.isUploading).toBeTruthy();
        });

        it('calls storage().ref()', async () => {
          expect.assertions(1);

          await wrapper.vm.upload(mockFile);

          expect(mockRef).toHaveBeenCalled();
        });

        it('calls uploadRef.put() with file', async() => {
          expect.assertions(1);

          await wrapper.vm.upload(mockFile);

          expect(mockPut).toHaveBeenCalledWith(mockFile);
        });

        describe('put() failed', () => {
          it('sets error and returns false if received response but not successful', async () => {
            expect.assertions(2);

            wrapper.vm.setError = jest.fn();
            mockPut.mockReturnValue(false);

            const result = await wrapper.vm.upload(mockFile);

            expect(result).toBe(false);
            expect(wrapper.vm.setError).toHaveBeenCalledWith(errorMessage2);
          });

          it('sets error and returns false if error thrown', async () => {
            expect.assertions(2);

            wrapper.vm.setError = jest.fn();
            mockPut.mockImplementation(() => {
              throw new Error('Error');
            });

            const result = await wrapper.vm.upload(mockFile);

            expect(result).toBe(false);
            expect(wrapper.vm.setError).toHaveBeenCalledWith(errorMessage3);
          });
        });

        describe('put() returned a valid response', () => {
          beforeEach(() => {
            mockPut.mockReturnValue({
              state: 'success',
            });
          });

          it('resets `isReplacing`', async () => {
            expect.assertions(1);

            await wrapper.vm.upload(mockFile);

            expect(wrapper.vm.isReplacing).toBe(false);
          });

          it('sets `fileName` to one generated by generateFileName()', async () => {
            const mockName = 'mock file name';
            const mockGenerateFileName = jest.fn().mockReturnValue(mockName);

            wrapper.setMethods({
              generateFileName: mockGenerateFileName,
            });
            expect.assertions(2);

            await wrapper.vm.upload(mockFile);

            expect(mockGenerateFileName).toHaveBeenCalled();
            expect(wrapper.emitted().input).toEqual([[mockName]]);
          });

          it('doesn\'t set an error and returns true', async () => {
            expect.assertions(2);
            wrapper.vm.setError = jest.fn();

            const result = await wrapper.vm.upload(mockFile);

            expect(wrapper.vm.setError).not.toHaveBeenCalled();
            expect(result).toBe(true);
          });
        });
      });
    });

    describe('verifyFile()', () => {
      it('returns false if called without file', async () => {
        expect.assertions(1);

        const result = await wrapper.vm.verifyFile(mockFile.name);

        expect(result).toBe(false);
      });

      it('calls storage().ref()', async () => {
        expect.assertions(1);

        await wrapper.vm.verifyFile(mockFile.name);

        expect(mockRef).toHaveBeenCalled();
      });

      it('calls fileRef.getDownloadURL()', async () => {
        expect.assertions(1);

        await wrapper.vm.verifyFile(mockFile.name);

        expect(mockGetDownloadURL).toHaveBeenCalled();
      });

      it('returns true if fileRef.getDownloadURL() returned a valid response', async () => {
        expect.assertions(1);

        mockGetDownloadURL.mockReturnValue('link_to_file');

        const result = await wrapper.vm.verifyFile(mockFile.name);

        expect(result).toBe(true);
      });

      it('returns false if fileRef.getDownloadURL() returned invalid response', async () => {
        expect.assertions(1);

        mockGetDownloadURL.mockReturnValue(null);

        const result = await wrapper.vm.verifyFile(mockFile.name);

        expect(result).toBe(false);
      });

      it('returns false if fileRef.getDownloadURL() threw', async () => {
        expect.assertions(1);

        mockGetDownloadURL.mockImplementation(() => {
          throw new Error('Error');
        });

        const result = await wrapper.vm.verifyFile(mockFile.name);
        expect(result).toBe(false);
      });
    });
  });
});

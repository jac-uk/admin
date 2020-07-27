import { shallowMount } from '@vue/test-utils';
import MultiFileUpload from '@/components/RepeatableFields/MultiFileUpload';
import TextField from '@/components/Form/TextField';
import FileUpload from '@/components/Form/FileUpload';

const mockProps = {
  id: 'mock-id',
  path: 'mock/path',
};

const createTestSubject = (props) => {
  return shallowMount(MultiFileUpload, {
    propsData: {
      ...mockProps,
      ...props,
    },
  });
};

describe('@/components/RepeatableFields/MultiFileUpload', () => {
  describe('template', () => {
    let wrapper;
    beforeEach(() => {
      wrapper = createTestSubject({ index: 1, row: {} });
    });

    it('renders', () => {
      expect(wrapper.exists()).toBe(true);
    });

    it('renders TextInput', () => {
      expect(wrapper.find(TextField).exists()).toBe(true);
    });

    it('renders FileUpload', () => {
      expect(wrapper.find(FileUpload).exists()).toBe(true);
    });
  });

  describe('name', () => {
    it('component name is "MultiFileUpload"', () => {
      expect(MultiFileUpload.name).toBe('MultiFileUpload');
    });
  });

  describe('props', () => {
    describe('row', () => {
      it('is required', () => {
        const prop = MultiFileUpload.props.row;
        expect(prop.required).toBe(true);
      });

      it('has type object', () => {
        const prop = MultiFileUpload.props.row;
        expect(prop.type).toBe(Object);
      });
    });

    describe('index', () => {
      it('is required', () => {
        const prop = MultiFileUpload.props.index;
        expect(prop.required).toBe(true);
      });

      it('has type number', () => {
        const prop = MultiFileUpload.props.index;
        expect(prop.type).toBe(Number);
      });
    });
  });

  describe('computed properties', () => {
    describe('uniqueId', () => {
      it('is generated from provided id and component index', () => {
        const id = 'test-id';
        const index = 2;
        const wrapper = createTestSubject({
          id,
          index,
          row: {},
        });
        expect(wrapper.vm.uniqueId).toEqual(`${id}_${index}`);
      });
    });
  });
});

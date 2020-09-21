import { createTestSubject } from '../../helpers';

import FormFieldError from '@/components/Form/FormFieldError';

describe('components/Form/FormFieldError', () => {
    let prop;
    describe('props', () => {
        describe('id', () => {
            beforeEach(() => {
                prop = FormFieldError.props.id;
            });
            it('is not required', () => {
                expect(prop.required).toBeFalsy();
            });
            it('is a string', () => {
                expect(prop.type()).toBeString();
            });
            it('defaults as an empty string', () => {
                expect(prop.default).toBe('');
            });
        });
        describe('errorMessage', () => {
            beforeEach(() => {
                prop = FormFieldError.props.errorMessage;
            });
            it('is not required', () => {
                expect(prop.required).toBeFalsy();
            });
            it('is a string', () => {
                expect(prop.type()).toBeString();
            });
            it('defaults as an empty string', () => {
                expect(prop.default).toBe('');
            });
        });
    });

    describe('component instance', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = createTestSubject(FormFieldError, {
                mocks: {},
                stubs: [],
                propsData: {},
            });
        });
        
        it('renders the component', () => {
            expect(wrapper.exists()).toBe(true);
        });
    });
});

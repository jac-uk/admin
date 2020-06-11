import { createTestSubject } from '../../helpers';
import Checkbox from '@/components/Form/Checkbox';

describe('components/Form/CheckboxItem', () => {
    
    describe('props', () => {
        let prop;
        
        describe('inputClass', () => {
            beforeEach(() => {
                prop = Checkbox.props.inputClass;
            });
            
            it('defaults as \'\'', () => {
                expect(prop.default).toBe('');
            });
            
            it('must be a String', () => {
                expect(prop.type).toBe(String);
            });
        });
        
        describe('value', () => {
            beforeEach(() => {
                prop = Checkbox.props.value;
            });
            
            it('defaults as \'\'', () => {
                expect(prop.default).toBe('');
            });
            
            it('type is [String, Number, Boolean]', () => {
                expect(prop.type).toEqual([String, Number, Boolean]);
            });
        });
    });
    
    describe('component instance', () => {
        let wrapper;
        
        beforeEach(() => {
            wrapper = createTestSubject(Checkbox, {
                propsData: {
                    inputClass: 'mockInput',
                    value: false,
                    id: 'mockId',
                },
                stubs: [],
            });
        });
        
        describe('computed', () => {
            describe('localValue', () => {
                
                it('getter', () => {
                    expect(wrapper.vm.localValue).toBe(false);
                });
                
                it('setter emits an `input` event', () => {
                    wrapper.vm.localValue = true;
                    const emitted = wrapper.emitted().input;
                    
                    expect(emitted.length).toBeGreaterThan(0);
                    expect(emitted).toContainEqual([true]);
                });      
            });
            
        });
    });
});    

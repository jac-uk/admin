import { createTestSubject } from '../../helper';
import TabsList from '@/components/Page/TabsList';

describe('components/TabsList', () => {
    describe('props', () => {
        let prop;
        describe('tabs', () => {
            beforeEach(() => {
                prop = TabsList.props.tabs;
            });
            
            it('is an Array', () => {
                expect(prop.type()).toBeArray();
            });
            
            it('is required', () => {
                expect(prop.required).toBe(true);
            });
        });
        describe('activeTab', () => {
            beforeEach(() => {
                prop = TabsList.props.activeTab;
            });
            it('is a string', () => {
                expect(prop.type()).toBeString();
            });  
            it('defaults to empty string', () => {
                expect(prop.default).toBe('');
            });
        });
    });

    describe('component instance', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = createTestSubject(TabsList, {
                propsData: {
                    tabs: [],
                    activeTab: 'tabRef',
                },
                stubs: [],
            });
        });
        
        it('renders the component', () => {
            expect(wrapper.exists()).toBe(true);
        });

        describe('methods', () => {
            describe('showTab method', () => {
                // beforeEach(() => {
                    
                // });
                it('sets active tab as selected tab', () => {
                    wrapper.vm.showTab({ ref: 'newTab' });
                    expect(wrapper.props('activeTab')).toBe('newTab');
                });
            });
        });
    });
});

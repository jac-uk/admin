import { createTestSubject } from '@/helper';
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
        let mockTabs = [
            {
                title: 'Tab Ref',
                ref: 'tabRef',
            },
            {
                title: 'New Tab',
                ref: 'newTab',
            },
        ];
        beforeEach(() => {
            wrapper = createTestSubject(TabsList, {
                propsData: {
                    tabs: mockTabs,
                    activeTab: mockTabs[0].ref,
                },
                stubs: [],
            });
        });
        
        it('renders the component', () => {
            expect(wrapper.exists()).toBe(true);
        });

        describe('methods', () => {
            describe('showTab method', () => {
                beforeEach(() => {    
                    wrapper.vm.showTab({ ref: mockTabs[1].ref });
                });
                it('sets active tab as selected tab', () => {
                    expect(wrapper.vm.currentTab).toBe(mockTabs[1].ref);
                });
                it('emits change in tab', () => {
                    expect(wrapper.emitted('update:activeTab')[0][0]).toBe(mockTabs[1].ref);
                });
            });
            describe('isActive method', () => {
                it('returns false when tab.ref doesn\'t match activeTab', () => {
                    expect(wrapper.vm.isActive({ ref: mockTabs[1].ref })).toBe(false);
                });
                it('returns true when tab.ref matches activeTab', () => {
                    expect(wrapper.vm.isActive({ ref: mockTabs[0].ref })).toBe(true);
                });
            });
        });
    });
});

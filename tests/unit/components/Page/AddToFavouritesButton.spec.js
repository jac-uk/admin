import { createTestSubject } from '../../helpers';
import AddToFavouritesButton from '@/components/Page/AddToFavouritesButton';

describe('components/Form/AddToFavouritesButton', () => {
    describe('props', () => {
        describe('inFavourites', () => {
            let prop;
            beforeEach(() => {
                prop = AddToFavouritesButton.props.inFavourites;
            });
            it('is required', () => {
                expect(prop.required).toBeTruthy();
            });
            it('is an array', () => {
                expect(prop.type()).toBeBoolean();
            });
            it('defaults to empty array', () => {
                expect(prop.default).toEqual(false);
            });
        });
    });
    describe('component instance', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = createTestSubject(AddToFavouritesButton, {
                propsData: {
                    inFavourites: false,
                },
                stubs: [],
            });
        });
                it('renders the component', () => {
            expect(wrapper.exists()).toBe(true);
        });
    });
});

import { shallowMount } from '@vue/test-utils';
import Dashboard from '@/views/Dashboard';

describe('Dashboard', () => {
  const wrapper = shallowMount(Dashboard);

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true);
  });

  it('vacancies property is declared in data', () => {
    const dashboardData = Dashboard.data();
    expect(dashboardData.vacancies).toBeTruthy();
  });

  it('component instance has a firestore option', () => {
    const dashboardFirestoreOption = Dashboard.firestore();
    expect(dashboardFirestoreOption).toBeTruthy();
  });

  // accessibility
  describe('Accessibility', () => {
    it('page contains h1 and h2 elements', () => {
      expect(wrapper.contains('h1')).toBe(true);
      expect(wrapper.contains('h2')).toBe(true);
    });
  });
});

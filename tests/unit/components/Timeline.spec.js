import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import TimelineComponent from '@/components/Timeline.vue';
import { Timeline } from 'vis-timeline/standalone';
import { DataSet } from 'vis-data';

// Mocking the Timeline class with the necessary methods
const mockTimelineInstance = {
  setGroups: vi.fn(),
  setItems: vi.fn(),
  setOptions: vi.fn(),
  destroy: vi.fn(),
};

vi.mock('vis-timeline/standalone', () => ({
  Timeline: vi.fn(() => mockTimelineInstance),
}));

describe('TimelineComponent', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(TimelineComponent, {
      props: {
        groups: [{ id: 1, content: 'Group 1' }],
        items: [{ id: 1, content: 'Item 1', start: new Date() }],
        options: { editable: true },
      },
    });
  });

  it('should mount the component and create a timeline instance', () => {
    expect(wrapper.exists()).toBe(true);
    expect(Timeline).toHaveBeenCalledTimes(1);
  });

  it('should update timeline groups when groups prop changes', async () => {
    const newGroups = [{ id: 2, content: 'Group 2' }];
    await wrapper.setProps({ groups: newGroups });

    expect(mockTimelineInstance.setGroups).toHaveBeenCalledWith(new DataSet(newGroups));
  });

  it('should update timeline items when items prop changes', async () => {
    const newItems = [{ id: 2, content: 'Item 2', start: new Date() }];
    await wrapper.setProps({ items: newItems });

    expect(mockTimelineInstance.setItems).toHaveBeenCalledWith(new DataSet(newItems));
  });

  it('should update timeline options when options prop changes', async () => {
    const newOptions = { editable: false };
    await wrapper.setProps({ options: newOptions });

    expect(mockTimelineInstance.setOptions).toHaveBeenCalledWith(newOptions);
  });

  it('should destroy the timeline instance on unmount', () => {
    wrapper.unmount();
    expect(mockTimelineInstance.destroy).toHaveBeenCalledTimes(1);
  });
});

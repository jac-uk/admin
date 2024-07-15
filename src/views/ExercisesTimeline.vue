<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import Timeline from '@/components/Timeline.vue';

const store = useStore();
const router = useRouter();

const getDefaultTimeRange = () => {
  const currentDate = new Date();

  // calculate start date (one month in the past)
  const startDate = new Date();
  startDate.setMonth(currentDate.getMonth() - 1);

  // calculate end date (five months in the future)
  const endDate = new Date();
  endDate.setMonth(currentDate.getMonth() + 5);

  return [startDate, endDate];
};

const timelineOptions = ref({
  stack: true,
  verticalScroll: true,
  zoomKey: 'ctrlKey',
  maxHeight: 800,
  start: getDefaultTimeRange()[0],
  end: getDefaultTimeRange()[1],
  editable: false,
  selectable: false,
  margin: {
    item: 10, // minimal margin between items
    axis: 5, // minimal margin between items and the axis
  },
  orientation: 'both',
  xss: {
    disabled: true,
  },
  groupTemplate: function (group) {
    const container = document.createElement('div');

    const anchor = document.createElement('a');
    anchor.href = '#';
    anchor.textContent = group.content;
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      router.push({ name: 'exercise-dashboard', params: { id: group.id } });
    });
    container.insertAdjacentElement('afterBegin', anchor);

    return container;
  },
});

const tableData = computed(() => {
  return store.state.exerciseCollection.records || [];
});

const timelineGroups = computed(() => {
  return tableData.value.map(exercise => ({
    id: exercise.id,
    title: exercise.name,
    content: exercise.referenceNumber,
    ref: exercise.referenceNumber,
  }));
});

const timelineItems = computed(() => {
  const items = [];
  tableData.value.forEach(exercise => {
    const timelines = getExerciseTimeline(exercise);
    if (!Array.isArray(timelines)) return;
    timelines.forEach(timeline => {
      const item = {};
      item.id = `${exercise.id} - ${timeline.name}`;
      item.title = `<div>${timeline.title}</div>`;
      item.group = exercise.id;

      if (timeline.type) item.type = timeline.type;
      item.content = timeline.name;
      if (timeline.start) item.start = timeline.start;
      if (timeline.end) item.end = timeline.end;
      item.style = timeline.style;
      items.push(item);
    });
  });

  return items;
});

onMounted(() => {
  const params = {
    direction: 'asc',
    orderBy: 'applicationOpenDate',
    pageSize: 1000,
    searchMap: '_search',
    where: [{ field: 'state', comparator: 'in', value: ['ready', 'approved'] }],
  };
  store.dispatch(
    'exerciseCollection/bind',
    params
  );
});

onUnmounted(() => {
  store.dispatch('exerciseCollection/unbind');
});

const getExerciseTimeline = (data) => {
  const timeline = [];

  if (data.applicationOpenDate && data.applicationCloseDate) {
    timeline.push(
      {
        id: `Launch to close - ${data.referenceNumber}`,
        type: 'point',
        name: 'Launch to close',
        title: 'Launch to close',
        start: data.applicationOpenDate,
        end: data.applicationCloseDate,
        style: 'background-color: #fa9901',
      }
    );
  }

  if (data.shortlistingMethods?.includes('paper-sift') && data.siftStartDate && data.siftEndDate) {
    timeline.push(
      {
        id: `Sift - ${data.referenceNumber}`,
        name: 'Sift',
        title: 'Sift',
        start: data.siftStartDate,
        end: data.siftEndDate,
        style: 'background-color: #fbf445',
      }
    );
  }

  if (data.shortlistingMethods?.includes('name-blind-paper-sift') && data.nameBlindSiftStartDate && data.nameBlindSiftEndDate) {
    timeline.push(
      {
        id: `Name-blind Sift - ${data.referenceNumber}`,
        name: 'Name-blind Sift',
        title: 'Name-blind Sift',
        start: data.nameBlindSiftStartDate,
        end: data.nameBlindSiftEndDate,
        style: 'background-color: #fbf445',
      }
    );
  }

  if (!(data.assessmentMethods && data.assessmentMethods.independentAssessments === false)
    && data.contactIndependentAssessors
    && data.independentAssessmentsReturnDate
  ) {
    timeline.push(
      {
        id: `Independent Assessors - ${data.referenceNumber}`,
        name: 'Independent Assessors',
        title: 'Independent Assessors',
        start: data.contactIndependentAssessors,
        end: data.independentAssessmentsReturnDate,
        style: 'background-color: #3dfdff',
      }
    );
  }

  if (data.characterChecksDate && data.characterChecksProfessionalReturnDate) {
    timeline.push(
      {
        id: `Character checks - ${data.referenceNumber}`,
        name: 'Character checks',
        title: 'Character checks',
        start: data.characterChecksDate,
        end: data.characterChecksProfessionalReturnDate,
        style: 'background-color: #349bf0',
      }
    );
  }

  if (data.selectionDays && data.selectionDays.length > 0) {
    for (let i = 0; i < data.selectionDays.length; i++) {
      const selectionDay = data.selectionDays[i];
      const { selectionDayStart, selectionDayEnd } = selectionDay;
      if (selectionDayStart && selectionDayEnd) {
        timeline.push(
          {
            id: `Selection Day - ${data.referenceNumber} ${i + 1} - ${selectionDay.selectionDayLocation}`,
            name: `Selection Day ${i + 1} - ${selectionDay.selectionDayLocation}`,
            title: `Selection Day - ${selectionDay.selectionDayLocation}`,
            start: selectionDayStart,
            end: selectionDayEnd,
            style: 'color: white; background-color: #3502ff',
          }
        );
      }
    }
  }

  if (data.shortlistingMethods?.includes('situational-judgement-qualifying-test') && data.situationalJudgementTestDate) {
    timeline.push(
      {
        id: `Situational judgement qualifying test - ${data.referenceNumber}`,
        name: 'Situational judgement qualifying test',
        title: 'Situational judgement qualifying test',
        type: 'point',
        start: data.situationalJudgementTestDate,
        style: 'color: white; background-color: #e51e42',
      }
    );
  }

  if (data.shortlistingMethods?.includes('critical-analysis-qualifying-test') && data.criticalAnalysisTestDate) {
    timeline.push(
      {
        id: `Critical analysis qualifying test - ${data.referenceNumber}`,
        name: 'Critical analysis qualifying test',
        title: 'Critical analysis qualifying test',
        type: 'point',
        start: data.criticalAnalysisTestDate,
        style: 'color: white; background-color: #e51e42',
      }
    );
  }

  if (data.shortlistingMethods?.includes('scenario-test-qualifying-test') && data.scenarioTestDate) {
    timeline.push(
      {
        id: `Scenario test - ${data.referenceNumber}`,
        name: 'Scenario test',
        title: 'Scenario test',
        type: 'point',
        start: data.scenarioTestDate,
        style: 'color: white; background-color: #e51e42',
      }
    );
  }

  if (data.eligibilitySCCDate) {
    timeline.push(
      {
        id: `Eligibility SCC - ${data.referenceNumber}`,
        name: 'Eligibility SCC',
        title: 'Eligibility SCC',
        type: 'point',
        start: data.eligibilitySCCDate,
        style: 'background-color: #1afe00',
      }
    );
  }

  if (data.characterAndSCCDate) {
    timeline.push(
      {
        id: `Character and Selection SCC - ${data.referenceNumber}`,
        name: 'Character and Selection SCC',
        title: 'Character and Selection SCC',
        type: 'point',
        start: data.characterAndSCCDate,
        style: 'color: white; background-color: #088001',
      }
    );
  }

  if (data.statutoryConsultationDate) {
    timeline.push(
      {
        id: `Statutory consultation - ${data.referenceNumber}`,
        name: 'Statutory consultation',
        title: 'Statutory consultation',
        type: 'point',
        start: data.statutoryConsultationDate,
        style: 'background-color: #cc99ff',
      }
    );
  }

  if (data.finalOutcome) {
    timeline.push(
      {
        id: `Final outcome - ${data.referenceNumber}`,
        name: 'Final outcome',
        title: 'Final outcome',
        type: 'point',
        start: data.finalOutcome,
        style: 'color: white; background-color: #9510ac',
      }
    );
  }

  return timeline;
};
</script>

<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <div class="float-left">
          <h1 class="govuk-heading-xl govuk-!-margin-bottom-4">
            Exercises Timeline
          </h1>
        </div>
      </div>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <Timeline
          :groups="timelineGroups"
          :items="timelineItems"
          :options="timelineOptions"
        />
      </div>
    </div>
  </div>
</template>

<style>
.vis-item.vis-range {
  border: none !important;
}
.vis-item.vis-dot {
  border-color: transparent !important;
}
</style>

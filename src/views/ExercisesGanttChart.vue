<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import LoadingMessage from '@jac-uk/jac-kit/draftComponents/LoadingMessage.vue';
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

const loading = ref(true);
const timelineOptions = ref({
  stack: true,
  verticalScroll: true,
  preferZoom: true,
  maxHeight: 800,
  start: getDefaultTimeRange()[0],
  end: getDefaultTimeRange()[1],
  editable: false,
  selectable: false,
  margin: {
    item: 8, // minimal margin between items
    axis: 8, // minimal margin between items and the axis
  },
  orientation: {
    axis: 'top',
    item: 'top',
  },
  xss: {
    disabled: false,
  },
  groupTemplate: function (group) {
    const container = document.createElement('div');

    const anchor = document.createElement('a');
    anchor.href = `/exercise/${group.id}/dashboard`;
    anchor.textContent = group.content;
    anchor.style = 'text-decoration: none;';
    anchor.addEventListener('click', (event) => {
      event.preventDefault();
      router.push({ name: 'exercise-dashboard', params: { id: group.id } });
    });
    container.insertAdjacentElement('afterBegin', anchor);

    return container;
  },
});

const exerciseRecords = computed(() => {
  return store.state.exerciseCollection.records || [];
});

const timelineGroups = computed(() => {
  return exerciseRecords.value.map(exercise => ({
    id: exercise.id,
    title: exercise.name,
    content: exercise.referenceNumber,
    ref: exercise.referenceNumber,
  }));
});

const timelineItems = computed(() => {
  const items = [];
  exerciseRecords.value.forEach(exercise => {
    const exerciseTimelineItems = getExerciseTimelineItems(exercise);
    if (!Array.isArray(exerciseTimelineItems)) return;
    exerciseTimelineItems.forEach(timelineItem => {
      const item = {};
      item.id = `${exercise.id} - ${timelineItem.name}`;

      let dateString = dayjs(timelineItem.start).format('D MMM YYYY');
      if (timelineItem.end) dateString += ` - ${dayjs(timelineItem.end).format('D MMM YYYY')}`;
      item.title = `
        <div>
          <p><b>${timelineItem.title}</b></p>
          <p>${dateString}</p>
        </div>
      `;

      item.group = exercise.id;

      item.content = timelineItem.name;
      item.start = dayjs(timelineItem.start).startOf('day').toDate();
      item.end = timelineItem.end ? timelineItem.end : dayjs(item.start).endOf('day').toDate();
      item.style = timelineItem.style;

      items.push(item);
    });
  });

  return items;
});

watch(timelineGroups, () => {
  if (loading.value) loading.value = false;
}, { deep: true });

onMounted(() => {
  const params = {
    direction: 'asc',
    orderBy: 'applicationOpenDate',
    pageSize: 1000,
    searchMap: '_search',
    where: [],
    // where: [{ field: 'state', comparator: 'in', value: ['ready', 'approved'] }],
  };
  store.dispatch(
    'exerciseCollection/bind',
    params
  );
});

const getExerciseTimelineItems = (data) => {
  const items = [];

  if (data.applicationOpenDate && data.applicationCloseDate) {
    items.push({
      id: `Launch to close - ${data.referenceNumber}`,
      name: 'Launch to close',
      title: 'Launch to close',
      start: data.applicationOpenDate,
      end: data.applicationCloseDate,
      style: 'background-color: #fa9901',
    });
  }

  if (data.shortlistingMethods?.includes('paper-sift') && data.siftStartDate && data.siftEndDate) {
    items.push({
      id: `Sift - ${data.referenceNumber}`,
      name: 'Sift',
      title: 'Sift',
      start: data.siftStartDate,
      end: data.siftEndDate,
      style: 'background-color: #fbf445',
    });
  }

  if (data.shortlistingMethods?.includes('name-blind-paper-sift') && data.nameBlindSiftStartDate && data.nameBlindSiftEndDate) {
    items.push({
      id: `Name-blind Sift - ${data.referenceNumber}`,
      name: 'Name-blind Sift',
      title: 'Name-blind Sift',
      start: data.nameBlindSiftStartDate,
      end: data.nameBlindSiftEndDate,
      style: 'background-color: #fbf445',
    });
  }

  if (!(data.assessmentMethods && data.assessmentMethods.independentAssessments === false)
    && data.contactIndependentAssessors
    && data.independentAssessmentsReturnDate
  ) {
    items.push({
      id: `Independent Assessors - ${data.referenceNumber}`,
      name: 'Independent Assessors',
      title: 'Independent Assessors',
      start: data.contactIndependentAssessors,
      end: data.independentAssessmentsReturnDate,
      style: 'background-color: #3dfdff',
    });
  }

  if (data.characterChecksDate && data.characterChecksProfessionalReturnDate) {
    items.push({
      id: `Character checks - ${data.referenceNumber}`,
      name: 'Character checks',
      title: 'Character checks',
      start: data.characterChecksDate,
      end: data.characterChecksProfessionalReturnDate,
      style: 'background-color: #349bf0',
    });
  }

  if (data.selectionDays && data.selectionDays.length > 0) {
    for (let i = 0; i < data.selectionDays.length; i++) {
      const selectionDay = data.selectionDays[i];
      const { selectionDayStart, selectionDayEnd, selectionDayLocation = '' } = selectionDay;
      if (selectionDayStart && selectionDayEnd) {
        items.push({
          id: `Selection Day - ${selectionDayLocation}`,
          name: `Selection Day - ${selectionDayLocation} (${i + 1})`,
          title: `Selection Day - ${selectionDayLocation}`,
          start: selectionDayStart,
          end: selectionDayEnd,
          style: 'color: white; background-color: #3502ff',
        });
      }
    }
  }

  if (data.shortlistingMethods?.includes('situational-judgement-qualifying-test') && data.situationalJudgementTestDate) {
    items.push({
      id: `Situational judgement qualifying test - ${data.referenceNumber}`,
      name: 'Situational judgement qualifying test',
      title: 'Situational judgement qualifying test',
      start: data.situationalJudgementTestDate,
      style: 'color: white; background-color: #e51e42',
    });
  }

  if (data.shortlistingMethods?.includes('critical-analysis-qualifying-test') && data.criticalAnalysisTestDate) {
    items.push({
      id: `Critical analysis qualifying test - ${data.referenceNumber}`,
      name: 'Critical analysis qualifying test',
      title: 'Critical analysis qualifying test',
      start: data.criticalAnalysisTestDate,
      style: 'color: white; background-color: #e51e42',
    });
  }

  if (data.shortlistingMethods?.includes('scenario-test-qualifying-test') && data.scenarioTestDate) {
    items.push({
      id: `Scenario test - ${data.referenceNumber}`,
      name: 'Scenario test',
      title: 'Scenario test',
      start: data.scenarioTestDate,
      style: 'color: white; background-color: #e51e42',
    });
  }

  if (data.eligibilitySCCDate) {
    items.push({
      id: `Eligibility SCC - ${data.referenceNumber}`,
      name: 'Eligibility SCC',
      title: 'Eligibility SCC',
      start: data.eligibilitySCCDate,
      style: 'background-color: #1afe00',
    });
  }

  if (data.characterAndSCCDate) {
    items.push({
      id: `Character and Selection SCC - ${data.referenceNumber}`,
      name: 'Character and Selection SCC',
      title: 'Character and Selection SCC',
      start: data.characterAndSCCDate,
      style: 'color: white; background-color: #088001',
    });
  }

  if (data.statutoryConsultationDate) {
    items.push({
      id: `Statutory consultation - ${data.referenceNumber}`,
      name: 'Statutory consultation',
      title: 'Statutory consultation',
      start: data.statutoryConsultationDate,
      style: 'background-color: #cc99ff',
    });
  }

  if (data.finalOutcome) {
    items.push({
      id: `Final outcome - ${data.referenceNumber}`,
      name: 'Final outcome',
      title: 'Final outcome',
      start: data.finalOutcome,
      style: 'color: white; background-color: #9510ac',
    });
  }

  // sort items by start date
  items.sort((a, b) => {
    return a.start - b.start;
  });

  return items;
};
</script>

<template>
  <div>
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <div class="float-left">
          <h1 class="govuk-heading-xl govuk-!-margin-bottom-4">
            Exercises Gantt Chart
          </h1>
        </div>
      </div>
    </div>

    <div class="govuk-grid-row">
      <div class="govuk-grid-column-full">
        <LoadingMessage v-if="loading" />
        <Timeline
          v-else
          :groups="timelineGroups"
          :items="timelineItems"
          :options="timelineOptions"
        />
      </div>
    </div>
  </div>
</template>

<style>
.vis-timeline {
  border-radius: 4px;
}
.vis-item {
  border-radius: 4px;
}
.vis-item.vis-range {
  border: none !important;
}
</style>

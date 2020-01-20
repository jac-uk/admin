<template>
  <div>
    <span v-if="value == null">
      {{ value }}
    </span>
    <span v-else-if="typeof(value) == 'string'">
      {{ value | lookup }}
    </span>
    <span v-else-if="typeof(value) == 'number'">
      {{ value }}
    </span>
    <span v-else-if="typeof(value) == 'boolean'">
      {{ value | toYesNo }}
    </span>
    <span v-else-if="typeof(value) == 'object' && typeof(value.getMonth) == 'function'">
      {{ value | formatDate }}
    </span>
    <span v-else-if="typeof(value) == 'object' && Array.isArray(value)">
      <ul 
        v-if="Array.isArray(value)"
        class="govuk-list"
      >
        <li
          v-for="(item, index) in value"
          :key="index"
        >
          <JsonRenderer :value="item" />
        </li>
      </ul>
    </span>
    <table 
      v-else-if="typeof(value) == 'object'"
      class="govuk-table"
    >
      <tbody class="govuk-table__body">
        <tr
          v-for="(propValue, propName) in value"
          :key="propName"
          class="govuk-table__row"
        >
          <th
            scope="row"
            class="govuk-table__header table-header"
          >
            {{ propName | toHumanCase }}
          </th>
          <td class="govuk-table__cell">
            <JsonRenderer :value="propValue" />
          </td>
        </tr>
      </tbody>
    </table>
    <span v-else>
      {{ value }}
    </span>    
  </div>
</template>

<script>
import JsonRenderer from '@/components/JsonRenderer';

export default {
  name: 'JsonRenderer',
  components: {
    JsonRenderer,
  },
  props: {
    // eslint-disable-next-line
    value: {
      required: true,
    },
  },
};
</script>

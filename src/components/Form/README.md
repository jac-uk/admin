# TextFields
The TextField component is the implementation of the GDS Text Input component (https://design-system.service.gov.uk/components/text-input/).

The TextField component is simply a govuk styled text input which has an optional label and hint attached to it.

#### Props:

##### label (optional)
If label is provided, the component displays the label's value.

##### inputClass (optional)
The inputClass prop is an optional detail to change the style of the text field. It has an added value of 'govuk-input', in order to assure it's always got this base level styling attached. If an additional inputClass value is passed from the parent, the component applies the additional style value passed, along with the base level styling.

##### value (optional)
The v-model directive is used to create two-way data bindings (it's passed from parent component as v-model prop). If we pass a default value in the parent as a value of v-model, the component will parse this value and populate the text field with it.

##### hint (optional)
If a hint is passed, the component displays the value passed as <span> element which contains a hint.

##### id (optional)
Id is currently an optional prop, and it's used to assign unique ids to input elements and "for" attributes for the corresponding labels.

##### type (optional)
If type is not provided, the component is rendered using the default type "text". If a value for type is passed from the parent, the component will replace this default value with the type that has been passed. This enables the textfield to be flexible to various needs.

#### Example usage:

```
<template>
  <div>
    <h2 class="govuk-heading-m">
      Number of vacancies
    </h2>
    <TextField
      id="immediate_start"
      v-model="immediateStart"
      input-class="govuk-input--width-5"
      label="Immediate start"
      hint="These are also called section 87 (S87) vacancies"
      type=""
    />
  </div>
</template>
```

# Radios

# DateInput

DateInput component is the implementation of GDS Date Input component (https://design-system.service.gov.uk/components/date-input/).

We have two variations of this component:
1) Day, Month, and Year (default)
2) Month and Year (for this variation we need to pass type="month" as a prop).


#### Props:

##### label (optional)
If label is provided, the component displays label's value as a legend.

##### hint (optional)
If hint is passed, the component displays the value passed as <span> element which contains a hint.

##### id (required)
Id is required, and it's used to assign unique ids to input elements and "for" attributes for the corresponding labels.

##### type (optional)
If type is not provided, the component is rendered using the default type "date".
Currently, the only valid value that can be passed as a type is "month", so the component will be rendered with only two input fields - month and year.

##### value (required)
v-model directive is used to create two-way data bindings (it's passed from parent component as v-model prop). If we pass date as a value of v-model, the component will parse this date and populate the day, month and year fields.


#### Example usage:

```
<template>
  <div>
    <h3 class="govuk-heading-xl">
      Add shortlisting dates
    </h3>
    <DateInput
      id="notification__start"
      v-model="notificationDate"
      label="Situational judgment test notification"
      hint="For example, 01 01 2020"
    />
  </div>
</template>
```


# TimeInput

TimeInput component allows us to get input for "hour" and "minute" and return a JavaScript Date instance, which is created using the "hour" and "minute" inputs values and a default values for year, month and a day (for example, if hour value is 09 and minute value is 08, the output will look like this "Sun Dec 31 1899 09:08:00").

TimeInput component can be used with DateInput component to create a Date instance with date and time, however, this will require building parent component or creating helper which will merge DateInput and TimeInput dates and return a new Date instance.


#### Props

##### label (optional)
If label is provided, the component displays label's value as a legend.

##### hint (optional)
If hint is passed, the component displays the value passed as <span> element which contains a hint.

##### id (required)
Id is required, and it's used to assign unique ids to input elements and "for" attributes for the corresponding labels.

##### value (required)
v-model directive is used to create two-way data bindings (it's passed from parent component as v-model=""). If we pass date as a value, the component will parse this date and populate the hour and minute fields.


#### Example usage:
```
<template>
  <div>
    <h3 class="govuk-heading-xl">
      Add shortlisting dates
    </h3>
    <DateInput
      id="scenario_test_time"
      v-model="scenarioTime"
      label="Scenario test time"
      hint="For example, 12 30"
    />
  </div>
</template>
```

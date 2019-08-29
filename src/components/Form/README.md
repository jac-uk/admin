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

# Radios and Checkboxes

[GOV.UK Radios](https://design-system.service.gov.uk/components/radios/) can be created using the `RadioGroup` and `RadioItem` 
components.

Similarly, [GOV.UK Checkboxes](https://design-system.service.gov.uk/components/checkboxes/) can be created using the
`CheckboxGroup` and `CheckboxItem` components.

Usage is the same between both pairs of components.

Radios and Checkboxes support the following features:
- Items with hints 
([Radios](https://design-system.service.gov.uk/components/radios/#radio-items-with-hints), 
[Checkboxes](https://design-system.service.gov.uk/components/checkboxes/#checkbox-items-with-hints))
- Conditionally revealed content 
([Radios](https://design-system.service.gov.uk/components/radios/#conditionally-revealing-content), 
[Checkboxes](https://design-system.service.gov.uk/components/checkboxes/#conditionally-revealing-content))

#### `RadioGroup` and `CheckboxGroup` props

##### `label` (optional)

This will be displayed as a `<legend>` above the radio/checkbox items.

##### `hint` (optional)

Hint text will be displayed as a GOV.UK-styled hint underneath the label.

##### `id` (required)

This must be unique on the current page. It's used to link `<input>` elements with their associated `<label>` elements.

##### `value` (required)
The `v-model` directive is used to create two-way data bindings (it's passed from parent component as v-model prop). The `value` 
prop is supplied by the `v-model` binding, so does not need to be specified when using `v-model`.

#### `RadioItem` and `CheckboxItem` props

##### `label` (required)

The text to display next to the radio/checkbox input.

##### `value` (required)

The value of this item. This will be received via the `v-model` binding when the radio/checkbox input is selected by the user.

##### `hint` (optional)

Hint text will be displayed as a GOV.UK-styled hint underneath the label.

#### Basic usage

```vue
<template>
  <div>
    <RadioGroup
      v-model="favouriteCake"
      id="favourite-cake"
      label="Which cake is your favourite?"
    >
      <RadioItem
        value="victoria-sponge"
        label="Victoria sponge"
      />
      <RadioItem
        value="coffee-walnut"
        label="Coffee and walnut cake"
      />
      <RadioItem
        value="carrot"
        label="Carrot cake"
      />
    </RadioGroup>
  </div>
</template>

<script>
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';

export default {
  components: {
    RadioGroup,
    RadioItem,
  },
  data() {
    return {
      favouriteCake: null,
    };
  },
}
</script>
```

#### Conditionally revealing content

In this example, we wrap the `<RadioItem></RadioItem>` element around conditional content. This content will be displayed when the associated radio is selected.

```vue
<template>
  <div>
    <RadioGroup
      v-model="contactMethod"
      id="contact-method"
      label="How would you prefer to be contacted?"
    >
      <RadioItem
        value="email"
        label="Email"
      >
        <TextField
          id="email-address"
          v-model="emailAddress"
          label="Email address"
          type="email"
        />
      </RadioItem>

      <RadioItem
        value="phone"
        label="Phone"
      >
        <TextField
          id="phone-number"
          v-model="phoneNumber"
          label="Phone number"
          type="tel"
        />
      </RadioItem>

      <RadioItem
        value="sms"
        label="Text message"
      >
        <TextField
          id="mobile-number"
          v-model="mobileNumber"
          label="Mobile number"
          type="tel"
        />
      </RadioItem>
    </RadioGroup>
  </div>
</template>

<script>
import RadioGroup from '@/components/Form/RadioGroup';
import RadioItem from '@/components/Form/RadioItem';
import TextField from '@/components/Form/TextField';

export default {
  components: {
    RadioGroup,
    RadioItem,
    TextField,
  },
  data() {
    return {
      contactMethod: null,
      emailAddress: null,
      phoneNumber: null,
      mobileNumber: null,
    };
  },
}
</script>
```

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

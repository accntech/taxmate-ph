import * as FormPrimitive from 'formsnap';

import Button from './form-button.svelte';
import Description from './form-description.svelte';
import Field from './form-field.svelte';
import FieldErrors from './form-field-errors.svelte';
import Label from './form-label.svelte';

const Control = FormPrimitive.Control;

export {
	Field,
	Control,
	Label,
	Button,
	FieldErrors,
	Description,
	Field as FormField,
	Control as FormControl,
	Description as FormDescription,
	Label as FormLabel,
	FieldErrors as FormFieldErrors,
	Button as FormButton
};

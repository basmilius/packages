export const DEFAULT_MESSAGES: Readonly<Record<string, string>> = {
    'validator.addressNotValid': 'The chosen address is not valid.',
    'validator.afterDate': 'Please choose a date later than the start date.',
    'validator.alpha': 'Please enter only alphabetical characters.',
    'validator.alphaNum': 'Please enter a value containing only letters and numbers.',
    'validator.and': 'Please ensure all requirements are met.',
    'validator.beforeDate': 'Please choose a date earlier than the end date.',
    'validator.between': 'Please enter a number between {min} and {max}, inclusive.',
    'validator.betweenDates': 'Please choose a date within the allowed period.',
    'validator.bsn': 'Please enter a valid citizen service number.',
    'validator.credentials': 'The provided credentials are invalid.',
    'validator.decimal': 'Please enter a valid decimal value.',
    'validator.email': 'Please enter a valid email address.',
    'validator.emailTaken': 'The chosen email address is already in use.',
    'validator.integer': 'Please enter a whole number.',
    'validator.ipAddress': 'Please enter a valid IP address.',
    'validator.macAddress': 'Please enter a valid MAC address.',
    'validator.maxLength': 'Please enter a value with a maximum length of {max} characters.',
    'validator.maxValue': 'Please enter a number less than or equal to {max}.',
    'validator.minLength': 'Please enter a value with a minimum length of {min} characters.',
    'validator.minValue': 'Please enter a number greater than or equal to {min}.',
    'validator.not': 'Please enter a different value.',
    'validator.notice': 'Please address the errors in the form before proceeding with the submission.',
    'validator.numeric': 'Please enter a valid numeric value.',
    'validator.or': 'Please ensure at least one requirement is met.',
    'validator.phoneNumber': 'Please enter a valid phone number.',
    'validator.postalCode': 'Please enter a valid postal code.',
    'validator.required': 'This field is required.',
    'validator.requiredIf': 'This field is required.',
    'validator.requiredUnless': 'This field is required.',
    'validator.sameAs': 'Please ensure this field is the same as the other field.',
    'validator.url': 'Please enter a valid URL.'
};

const CONSTRAINTS: Record<string, string> = {
    address_not_valid: 'validator.addressNotValid',
    credentials: 'validator.credentials',
    email: 'validator.email',
    email_taken: 'validator.emailTaken',
    is_phone_number: 'validator.phoneNumber',
    max: 'validator.maxValue',
    max_length: 'validator.maxLength',
    min: 'validator.minValue',
    min_length: 'validator.minLength',
    missing: 'validator.required',
    same_as: 'validator.sameAs',
    validator_errors: 'validator.notice'
};

export const DEFAULT_CONSTRAINTS: Readonly<Record<string, string>> = Object.fromEntries(
    Object.entries(CONSTRAINTS).flatMap(([code, key]) => [
        [code, key],
        [`http_validation_constraint_${code}`, key]
    ])
);

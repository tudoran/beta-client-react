import buildSchema from 'redux-form-schema'

const schemaProperties = {
  'first_name': {
    label: 'First Name',
    required: true
  },
  'middle_name': {
    label: 'Mid',
  },
  'last_name': {
    label: 'Last Name',
    required: true
  },
  'email': {
    label: 'Email',
    required: true
  },
  'phone_num': {
    label: 'Phone',
    required: true
  },
  'gender': {
    label: 'Gender'
  },
  'date_of_birth': {
    label: 'Date of Birth'
  },
  'tax_file_number': {
    label: 'Tax Number'
  },
  'address1': {
    label: 'Address 1'
  },
  'address2': {
    label: 'Address 2'
  },
  'post_code': {
    label: 'Postal Code'
  },
  'city': {
    label: 'City'
  },
  'state': {
    label: 'State'
  },
  'country': {
    label: 'Country'
  },
  'civil_status': {
    label: 'Civil Status',
    required: true
  }
}

export default buildSchema(schemaProperties)

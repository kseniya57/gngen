import PropTypes from 'prop-types';

export const headerShape = PropTypes.shape({
  key: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  default: PropTypes.any,
  type: PropTypes.string
});

export const queriesShape = PropTypes.shape({
  GET_ALL_QUERY: PropTypes.object.isRequired,
  GET_DICTIONARIES_QUERY: PropTypes.object.isRequired,
  GET_ONE_QUERY: PropTypes.object.isRequired,
  ADD_MUTATION: PropTypes.object.isRequired,
  UPDATE_MUTATION: PropTypes.object.isRequired,
  DELETE_MUTATION: PropTypes.object.isRequired,
  ADDED_EVENT: PropTypes.object.isRequired,
  UPDATED_EVENT: PropTypes.object.isRequired,
  DELETED_EVENT: PropTypes.object.isRequired
});

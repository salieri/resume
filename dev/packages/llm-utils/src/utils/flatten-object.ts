import _ from 'lodash';

/**
 * Flatten a nested JSON object into a dot-notated map of values.
 */
export const flattenObject = (value: unknown, parentPath = '', result: Record<string, unknown> = {}) => {
  if (_.isNull(value) || _.isString(value) || _.isNumber(value) || _.isBoolean(value)) {
    result[parentPath] = value;
  } else if (_.isArray(value)) {
    _.each(value, (item, index) => {
      flattenObject(item, parentPath ? `${parentPath}.${index}` : `${index}`, result);
    });
  } else if (_.isPlainObject(value)) {
    _.each(value as object, (v, k) => {
      flattenObject(v, parentPath ? `${parentPath}.${k}` : k, result);
    });
  }

  return result;
};

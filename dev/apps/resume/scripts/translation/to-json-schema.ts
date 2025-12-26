import _ from 'lodash';

interface JsonSchema {
  type: 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null';
  properties?: Record<string, JsonSchema>;
  items?: JsonSchema;
  additionalProperties?: boolean;
  required?: string[];
}

// {
//   "$schema": "https://json-schema.org/draft-07/schema",
// }

// weak JSON schema generator for translation scripts
export const toJsonSchema = (value: unknown): JsonSchema => {
  if (_.isArray(value)) {
    return {
      type: 'array',
      items: toJsonSchema(value[0]),
    };
  }

  if (_.isNull(value) || _.isString(value) || _.isNumber(value) || _.isBoolean(value)) {
    return {
      type: typeof value as 'string' | 'number' | 'boolean' | 'null',
    };
  }

  if (_.isPlainObject(value)) {
    return {
      type: 'object',
      additionalProperties: false,
      properties: _.mapValues(value, (v) => toJsonSchema(v)),
      required: _.keys(value),
    };
  }

  throw new Error(`Unsupported value type: ${typeof value}`);
};

export const flattenObject = (value: unknown, parentPath = '', result: Record<string, unknown> = {}) => {
  if (_.isNull(value) || _.isString(value) || _.isNumber(value) || _.isBoolean(value)) {
    result[parentPath] = value;
  }

  if (_.isArray(value)) {
    _.each(value, (item, index) => {
      flattenObject(item, parentPath ? `${parentPath}.${index}` : `${index}`, result);
    });
  }

  if (_.isPlainObject(value)) {
    _.each(value as object, (v, k) => {
      flattenObject(v, parentPath ? `${parentPath}.${k}` : k, result);
    });
  }

  return result;
};

import type { JSONSchema4 } from 'json-schema';
import _ from 'lodash';

/**
 * Infer JSON schema from JSON-like values
 */
export const toJsonSchema = (value: unknown): JSONSchema4 => {
  if (_.isArray(value)) {
    return {
      type: 'array',
      items: toJsonSchema(value.length === 0 ? undefined : value[0]),
    };
  }

  if (_.isNull(value)) {
    return {
      type: 'null',
    };
  }

  if (_.isString(value)) {
    return {
      type: 'string',
    };
  }

  if (_.isNumber(value)) {
    return {
      type: 'number',
    };
  }

  if (_.isBoolean(value)) {
    return {
      type: 'boolean',
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

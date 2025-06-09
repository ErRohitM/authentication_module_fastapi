import _ from 'lodash';

// This is a simple example demonstrating usage of Lodash to chunk an array.
// You can remove or modify this file as needed.

export function chunkExample<T>(array: T[], size: number): T[][] {
  return _.chunk(array, size);
}

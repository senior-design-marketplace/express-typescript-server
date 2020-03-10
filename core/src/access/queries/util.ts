const BASE_URL = 'https://marqetplace-staging-photos.s3.amazonaws.com/defaults/'
const NUM_DEFAULTS = 100;
const DEFAULT_EXTENSION = '.jpeg';

/**
 * Generate a link to a random default media entry.
 */
export function getDefaultMediaLink() {
    return `${BASE_URL}${Math.floor(Math.random() * NUM_DEFAULTS)}${DEFAULT_EXTENSION}`;
}
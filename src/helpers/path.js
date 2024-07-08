
/**
 *
 * Parse the path object of Vue, replace path parameters with their name,
 * ex. convert /exercise/isMrU9nmsJbPaUvnp8Mf into /exercise/:id
 *
 * @param {object} path
 *
 * @returns {string}
 */
const  generalisePath = ({ path, params }) => {
  let result = path;
  for (const [name, value] of Object.entries(params)) {
    result = result.replace(value, `:${name}`);
  }
  return result;
};

export { generalisePath };

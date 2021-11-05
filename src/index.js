import * as peggy from 'peggy';
import loaderUtils from 'loader-utils';

function extractAllowedStartRules(query) {
  if (typeof query.allowedStartRules === 'string') {
    return [query.allowedStartRules];
  }
  if (Array.isArray(query.allowedStartRules)) {
    return query.allowedStartRules;
  }
  return [];
}

export default function loader(source) {
  if (this.cacheable) {
    this.cacheable();
  }

  const query = loaderUtils.parseQuery(this.query);
  const cacheParserResults = !!query.cache;
  const optimizeParser = query.optimize || 'speed';
  const trace = !!query.trace;
  const dependencies = JSON.parse(query.dependencies || '{}');
  const allowedStartRules = extractAllowedStartRules(query);

  // Description of Peggy options: https://peggyjs.org/documentation.html#generating-a-parser-javascript-api
  const pegOptions = {
    cache: cacheParserResults,
    dependencies,
    format: 'commonjs',
    optimize: optimizeParser,
    output: 'source',
    trace,
  };
  if (allowedStartRules.length > 0) {
    pegOptions.allowedStartRules = allowedStartRules;
  }

  const methodName = typeof peggy.generate === 'function' ? 'generate' : 'buildParser';
  return peggy[methodName](source, pegOptions);
}

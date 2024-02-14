import { QueryVariable } from '@grafana/scenes';

export const traceIDQueryVariableName = 'traceid';
export const traceIDQueryVariable = new QueryVariable({
  name: traceIDQueryVariableName,
});

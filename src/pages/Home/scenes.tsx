import {
  EmbeddedScene,
  SceneFlexItem,
  SceneQueryRunner,
  SceneFlexLayout,
  PanelBuilders,
  SplitLayout,
  SceneVariableSet,
} from '@grafana/scenes';
import { TEMPO_REF } from '../../constants';
import { traceIDQueryVariable, traceIDQueryVariableName } from './variables/TraceIdQueryVariable';

export function getBasicScene() {
  const tempoGetTracesQuery = new SceneQueryRunner({
    datasource: TEMPO_REF,
    queries: [
      {
        refId: 'traces',
        datasource: TEMPO_REF,
        queryType: 'traceql',
        query: `{}`,
        limit: 20,
      },
    ],
  });

  const tempoGetTracesByTraceIDQuery = new SceneQueryRunner({
    datasource: TEMPO_REF,
    queries: [
      {
        refId: 'search_by_trace_id',
        datasource: TEMPO_REF,
        queryType: 'traceql',
        limit: 20,
        query: `$${traceIDQueryVariableName}`,
      },
    ],
  });

  const tracePanel = new SceneFlexItem({
    height: 'auto',
    $data: tempoGetTracesByTraceIDQuery,
    body: PanelBuilders.traces().setTitle('Trace').build(),
  });

  const traceTable = PanelBuilders.table()
    .setTitle('Traces')
    .setOverrides((b) => {
      b.matchFieldsWithName('Trace ID').overrideLinks([
        {
          title: 'Go to trace',
          url: BuildUrlParams('${__url.path}', '${__url.params:exclude:var-traceid}', [
            { key: 'var-traceid', value: '${__value.text}' },
          ]),
        },
      ]);
    })
    .build();

  const splitLayout = new SplitLayout({
    direction: 'row',
    primary: traceTable,
    secondary: tracePanel,
  });

  const baseLayout = new SceneFlexLayout({
    direction: 'column',
    children: [new SceneFlexItem({ height: 800, body: splitLayout })],
  });

  const queryVariableSet = new SceneVariableSet({
    variables: [traceIDQueryVariable],
  });

  const baseScene = new EmbeddedScene({
    $variables: queryVariableSet,
    $data: tempoGetTracesQuery,
    body: baseLayout,
  });

  return baseScene;
}

function BuildUrlParams(path: string, baseParams = '', additionalParams: UrlParam[]): string {
  if (baseParams === '') {
    return path + '?' + additionalParams.map((param) => `${param.key}=${param.value}`).join('&');
  } else {
    return path + baseParams + '&' + additionalParams.map((param) => `${param.key}=${param.value}`).join('&');
  }
}

interface UrlParam {
  key: string;
  value: string;
}

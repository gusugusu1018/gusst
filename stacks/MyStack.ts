import {
  Api,
  StaticSite,
  StackContext,
  Table,
  StaticSiteFileOptions,
} from '@serverless-stack/resources';

export function MyStack({ stack }: StackContext) {
  // Create the table
  const table = new Table(stack, 'Counter', {
    fields: {
      counter: 'string',
    },
    primaryIndex: { partitionKey: 'counter' },
  });
  // Create the HTTP API
  const api = new Api(stack, 'Api', {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [table],
      },
    },
    routes: {
      'POST /': 'functions/lambda.handler',
    },
  });

  const site = new StaticSite(stack, 'fe-gusu-todo', {
    path: 'frontend',
    buildOutput: 'dist',
    buildCommand: 'ng build --output-path dist',
    errorPage: 'redirect_to_index_page',
    // To load the API URL from the environment in development mode (environment.ts)
    environment: {
      NG_APP_API_URL: api.url,
    },
  });

  stack.addOutputs({
    SiteUrl: site.url,
    ApiEndpoint: api.url,
  });
}

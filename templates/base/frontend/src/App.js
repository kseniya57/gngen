import React from 'react';
import { Router, browserHistory, Route } from 'react-router';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from '@material-ui/core/styles';
import { Layout } from 'gngen-ui';
import { sidebar, theme, apolloClient } from 'config';
/* pages */

const Wrapper = ({ children }) => (
  <Layout sidebar={sidebar} theme={theme} apolloClient={apolloClient}>
    {children}
  </Layout>
);

const App = () => (
    <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
              <Router history={browserHistory}>
                <Route path="/" component={Wrapper}>
                    /* routes */
                </Route>
              </Router>
        </ThemeProvider>
    </ApolloProvider>
);

export default App;

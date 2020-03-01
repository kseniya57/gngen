import React from 'react';
import { Router, browserHistory, Route } from 'react-router';
import { Layout } from 'nodegen-ui';
import { sidebar, theme, apolloClient } from 'config';
/* pages */

const Wrapper = ({ children }) => (
  <Layout sidebar={sidebar} theme={theme} apolloClient={apolloClient}>
    {children}
  </Layout>
);

const App = () => (
  <Router history={browserHistory}>
    <Route path="/" component={Wrapper}>
        /* routes */
    </Route>
  </Router>
);

export default App;

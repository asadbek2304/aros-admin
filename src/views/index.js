import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import AppLayout from "layouts/app-layout";
import AuthLayout from 'layouts/auth-layout';
import AppLocale from "lang";
import { IntlProvider } from "react-intl";
import { ConfigProvider } from 'antd';
import { APP_PREFIX_PATH, AUTH_PREFIX_PATH } from 'configs/AppConfig'
import { QueryClientProvider } from "react-query";
import queryClient from "configs/react-query-config";

function RouteInterceptor({ children, isAuthenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: AUTH_PREFIX_PATH,
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

export const Views = (props) => {
  const { locale, token, location } = props;
  const currentAppLocale = AppLocale[locale];
  return (
    <IntlProvider
      locale={currentAppLocale.locale}
      messages={currentAppLocale.messages}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider locale={currentAppLocale.antd}>
          <Switch>
            list
            <Route exact path="/">
              <Redirect to={APP_PREFIX_PATH} />
            </Route>
            <Route path={AUTH_PREFIX_PATH}>
              <AuthLayout />
            </Route>
            <RouteInterceptor path={APP_PREFIX_PATH} isAuthenticated={token}>
              <AppLayout location={location} />
            </RouteInterceptor>
          </Switch>
        </ConfigProvider>
      </QueryClientProvider>
    </IntlProvider>
  );
}


const mapStateToProps = ({ theme, auth }) => {
  const { locale } =  theme;
  const { token } = auth;
  return { locale, token }
};

export default withRouter(connect(mapStateToProps)(Views));
import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import BannerList from "./banner-list";
import AddBanner from "./add-banner";
import EditBanner from "./edit-banner";

const Banner = (props) => {
  const { match } = props;
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/banner-list`} />
      <Route path={`${match.url}/add-banner`} component={AddBanner} />
      <Route path={`${match.url}/edit-banner/:id`} component={EditBanner} />
      <Route path={`${match.url}/banner-list`} component={BannerList} />
    </Switch>
  );
};

export default Banner;

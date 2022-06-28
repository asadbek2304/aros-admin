import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AttributeList from "./attribute-list";
import AddAttribute from "./add-attribute";
import EditAttribute from "./edit-attribute";

const Attributes = (props) => {
  const { match } = props;
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/attribute-list`} />
      <Route path={`${match.url}/add-attribute`} component={AddAttribute} />
      <Route path={`${match.url}/edit-attribute/:id`} component={EditAttribute} />
      <Route path={`${match.url}/attribute-list`} component={AttributeList} />
    </Switch>
  );
};

export default Attributes;

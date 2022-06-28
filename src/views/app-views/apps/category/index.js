import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import CategoryList from "./category-list";
import AddCategory from "./add-category";
import EditCategory from "./edit-category";

const Categories = (props) => {
  const { match } = props;
  return (
    <Switch>
      <Redirect exact from={`${match.url}`} to={`${match.url}/category-list`} />
      <Route path={`${match.url}/add-category`} component={AddCategory} />
      <Route path={`${match.url}/edit-category/:id`} component={EditCategory} />
      <Route path={`${match.url}/category-list`} component={CategoryList} />
    </Switch>
  );
};

export default Categories;

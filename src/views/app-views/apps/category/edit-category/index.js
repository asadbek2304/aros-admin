import React from "react";
import ProductForm from "../category-form";

const EditCategory = (props) => {
  return <ProductForm mode="EDIT" param={props.match.params} />;
};

export default EditCategory;

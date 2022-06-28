import React from "react";
import ProductForm from "../attribute-form";

const EditCategory = (props) => {
  return <ProductForm mode="EDIT" param={props.match.params} />;
};

export default EditCategory;

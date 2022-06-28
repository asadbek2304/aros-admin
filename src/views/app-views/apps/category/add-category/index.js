import React from 'react';
import ProductForm from '../category-form';

const AddCategory = (props) => {
	return (
		<ProductForm mode="ADD" param={props.match.params}/>
	)
}

export default AddCategory

import React from 'react';
import AttributeForm from '../attribute-form';

const AddAttribute = (props) => {
	return (
		<AttributeForm mode="ADD" param={props.match.params}/>
	)
}

export default AddAttribute

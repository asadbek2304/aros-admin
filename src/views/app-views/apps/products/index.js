import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import ProductList from './product-list'
import AddProduct from './add-product'
import EditProduct from './edit-product'
import AddProductVariant from './add-product-variant';
import EditProductVariant from './edit-product-variant';

const Products = props => {
  const { match } = props
	return (
		<Switch>
			<Redirect exact from={`${match.url}`} to={`${match.url}/product-list`} />
			<Route path={`${match.url}/add-product`} component={AddProduct} />
			<Route path={`${match.url}/edit-product/:id/`} exact component={EditProduct} />
			<Route path={`${match.url}/edit-product/:id/add-variant`} component={AddProductVariant} />
			<Route path={`${match.url}/edit-product/:id/edit-variant/:variantId`} component={EditProductVariant} />
			<Route path={`${match.url}/product-list`} component={ProductList} />
		</Switch>
	)
}

export default Products


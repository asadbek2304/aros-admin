import React, { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Tabs, Form, Button, message } from "antd";
import Flex from "components/shared-components/Flex";
import GeneralField from "./GeneralField";
import VariationField from "./VariationField";
import { useFileUpload } from "services/use-file-upload";
import { useCreateProduct } from "../services/mutations/use-create-product";
import { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { useProductDetail } from "../services/queries/use-product-detail";
import { LANGUAGES } from "configs/AppConfig";
import { useUpdateProduct } from "../services/mutations/use-update-product";

const { TabPane } = Tabs;

const ADD = "ADD";
const EDIT = "EDIT";

const ProductForm = (props) => {
  const { mode = ADD, param } = props;
  const history = useHistory();

  const [form] = Form.useForm();
  const [uploadedImg, setImage] = useState({});

  const { data: productDetail, isLoading: productDetailLoading } =
    useProductDetail(param?.id);

  const { mutate: createProduct, isLoading: createProductLoading } =
    useCreateProduct();
  const { mutate: uploadImage, isLoading: fileUploadLoading } = useFileUpload();
  const { mutate: updateProduct, isLoading: updateProductLoading } =
    useUpdateProduct(param?.id);

  useEffect(() => {
    if (mode === EDIT) {
      const names = {};
      LANGUAGES.forEach((lang) => {
        names[`name_${lang}`] = productDetail
          ? productDetail[`name_${lang}`]
          : "";
      });
      form.setFieldsValue({
        ...names,
        price: productDetail?.price,
      });
      setImage(productDetail?.image);
    }
  }, [form, mode, param, props, productDetail]);

  const handleUploadChange = useCallback(
    (info) => {
      const formData = new FormData();
      formData.append("file", info.file.originFileObj);
      uploadImage(formData, {
        onSuccess: (res) => {
          setImage(res);
        },
      });
    },
    [uploadImage]
  );

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        if (mode === ADD) {
          createProduct(
            {
              ...values,
              image: uploadedImg?.id,
              category: values.category.at(-1),
            },
            {
              onSuccess: (res) => {
                message.success(`Created ${values.name} to product list`);
                history.push(`/app/apps/products/edit-product/${res.id}`);
              },
            }
          );
        }
        if (mode === EDIT) {
          updateProduct(
            {
              ...values,
              image: uploadedImg?.id,
              category: values.category.at(-1),
            },
            {
              onSuccess: () => {
                message.success(`Product saved`);
              },
            }
          );
        }
      })
      .catch((info) => {
        console.log("info", info);
        message.error("Please enter all required field ");
      });
  };

  return (
    <>
      <Form
        layout="vertical"
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        initialValues={{
          heightUnit: "cm",
          widthUnit: "cm",
          weightUnit: "kg",
        }}>
        <PageHeaderAlt className="bg-white border-bottom" overlap>
          <div className="container">
            <Flex
              className="py-2"
              mobileFlex={false}
              justifyContent="between"
              alignItems="center">
              <h2 className="mb-3">
                {mode === "ADD" ? "Add New Product" : `Edit Product`}{" "}
              </h2>
              <div className="mb-3">
                <Button className="mr-2">Discard</Button>
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={
                    createProductLoading ||
                    updateProductLoading ||
                    productDetailLoading
                  }>
                  {mode === "ADD" ? "Add" : `Save`}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container">
          <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
            <TabPane tab="General" key="1">
              <GeneralField
                uploadedImg={uploadedImg?.file}
                uploadLoading={fileUploadLoading}
                handleUploadChange={handleUploadChange}
              />
            </TabPane>
            {mode === "EDIT" && (
              <TabPane tab="Variation" key="2">
                <VariationField />
              </TabPane>
            )}
          </Tabs>
        </div>
      </Form>
    </>
  );
};

export default ProductForm;

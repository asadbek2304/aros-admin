import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Row,
  Space,
  Switch,
  Tabs,
  Typography,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import TextEditor from "components/shared-components/TextEditor";
import { API_BASE_URL, LANGUAGES } from "configs/AppConfig";
import React, { useEffect } from "react";
import { useState } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import Flex from "components/shared-components/Flex";
import VarinatAttributes from "./VarinatAttributes";
import { useCreateVariant } from "../services/mutations/use-create-variant";
import { useHistory, useParams } from "react-router-dom";
import { useUpdateVariant } from "../services/mutations/use-update-variant";
import { useProductVariantDetail } from "../services/queries/use-product-variant-detail";

const { TabPane } = Tabs;

const rules = {
  name: [
    {
      required: true,
      message: "Please enter variant name",
    },
  ],

  price: [
    {
      required: true,
      message: "Please enter variant price",
    },
  ],
  quantity: [
    {
      required: true,
      message: "Please enter variant quantity",
    },
  ],
  description: [
    {
      required: true,
      message: "Please enter variant description",
    },
  ],
  characteristics: [
    {
      required: true,
      message: "Please enter variant characteristics",
    },
  ],
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const VariantField = ({ mode, data }) => {
  const [form] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const history = useHistory();
  const { variantId, id } = useParams();

  const { data: variantDetail, isLaoding: variantDetailLoading } =
    useProductVariantDetail(variantId);
  const { mutate: createVariant, isLoading: variantCreateLoading } =
    useCreateVariant();
  const { mutate: updateVariant, isLoading: variantUpdateLoading } =
    useUpdateVariant(variantId);

  useEffect(() => {
    if (mode === "EDIT") {
      const names = {};
      LANGUAGES.forEach((lang) => {
        names[`name_${lang}`] = variantDetail
          ? variantDetail[`name_${lang}`]
          : "";
      });
      const descriptions = {};
      LANGUAGES.forEach((lang) => {
        names[`description_${lang}`] = variantDetail
          ? variantDetail[`description_${lang}`]
          : "";
      });
      const characteristics = {};
      LANGUAGES.forEach((lang) => {
        names[`characteristics_${lang}`] = variantDetail
          ? variantDetail[`characteristics_${lang}`]
          : "";
      });
      form.setFieldsValue({
        ...names,
        ...descriptions,
        ...characteristics,
        price: variantDetail?.price,
        quantity: variantDetail?.quantity,
        is_available: variantDetail?.is_available,
        attribute_values: variantDetail?.attribute_values.map((attr) => ({
          attribute: attr.attribute.id,
          attributeValue: attr.id,
        })),
      });
      setFileList(
        variantDetail?.images?.map((image) => ({
          uid: image.id,
          url: image.file,
          name: image.name,
          status: "done",
        }))
      );
    }
  }, [form, mode, variantDetail]);

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        if (mode === "ADD") {
          createVariant(
            {
              ...values,
              images: fileList.map((file) => file.response.id),
              name: values.name_en,
              description: values.description_en,
              characteristics: values.characteristics_en,
              product: id,
              attribute_values: values.attribute_values.map(
                (attr) => attr.attributeValue
              ),
            },
            {
              onSuccess: (res) => {
                message.success(`Created ${values.name} to variant list`);
                history.push(
                  `/app/apps/products/edit-product/${id}/edit-variant/${res.id}`
                );
              },
            }
          );
        }
        if (mode === "EDIT") {
          updateVariant(
            {
              ...values,
              images: fileList.map((file) =>
                file.response ? file.response.id : file.uid
              ),
              product: id,
              name: values.name_en,
              description: values.description_en,
              characteristics: values.characteristics_en,
              attribute_values: values.attribute_values.map(
                (attr) => attr.attributeValue
              ),
            },
            {
              onSuccess: () => {
                message.success(`Variant saved`);
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

  const handleCancel = () => setPreviewVisible(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url?.substring(file.url?.lastIndexOf("/") + 1)
    );
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Form name="variant" layout="vertical" form={form}>
      <PageHeaderAlt className="bg-white border-bottom" overlap>
        <div className="container">
          <Flex
            className="py-2"
            mobileFlex={false}
            justifyContent="between"
            alignItems="center">
            <h2 className="mb-3">
              {mode === "ADD" ? "Add New Variant" : `Edit Variant`}{" "}
            </h2>
            <div className="mb-3">
              <Button className="mr-2" onClick={() => history.goBack()}>
                Discard
              </Button>
              <Button
                type="primary"
                onClick={() => onFinish()}
                loading={variantCreateLoading || variantUpdateLoading}
                htmlType="submit">
                {mode === "ADD" ? "Add" : `Save`}
              </Button>
            </div>
          </Flex>
        </div>
      </PageHeaderAlt>
      <div className="container">
        <Row gutter={16} style={{ marginTop: 100 }}>
          <Col xs={24} sm={24} md={18}>
            <Card title="Basic info">
              <Tabs>
                {LANGUAGES.map((lang) => (
                  <TabPane tab={`Variant name(${lang})`} key={lang}>
                    <Form.Item
                      name={`name_${lang}`}
                      label={`Variant name(${lang})`}
                      rules={rules.name}>
                      <Input placeholder="Variant Name" />
                    </Form.Item>
                  </TabPane>
                ))}
              </Tabs>
              <Tabs>
                {LANGUAGES.map((lang) => (
                  <TabPane tab={`Variant description(${lang})`} key={lang}>
                    <Form.Item
                      name={`description_${lang}`}
                      label={`Variant description(${lang})`}
                      rules={rules.description}>
                      <TextEditor placeholder="Variant Description" />
                    </Form.Item>
                  </TabPane>
                ))}
              </Tabs>
              <Tabs>
                {LANGUAGES.map((lang) => (
                  <TabPane tab={`Variant characteristics(${lang})`} key={lang}>
                    <Form.Item
                      name={`characteristics_${lang}`}
                      label={`Variant characteristics(${lang})`}
                      rules={rules.characteristics}>
                      <TextEditor placeholder="Variant characteristics" />
                    </Form.Item>
                  </TabPane>
                ))}
              </Tabs>
            </Card>
            <Card title="Media">
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                action={`${API_BASE_URL}v1/file/`}
                onChange={handleChange}>
                {fileList?.length >= 8 ? null : uploadButton}
              </Upload>
              <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}>
                <img
                  alt="example"
                  style={{ width: "100%" }}
                  src={previewImage}
                />
              </Modal>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={6}>
            <Card title="Organization">
              <Space style={{ alignItems: "center", justifyContent: "center" }}>
                <Typography>Available:</Typography>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  name="is_available"
                  initialValue={true}
                  valuePropName="checked">
                  <Switch defaultChecked />
                </Form.Item>
              </Space>
              <Form.Item
                name={`quantity`}
                label={`Variant quantity`}
                rules={rules.quantity}>
                <InputNumber className="w-100" placeholder="Quantity" />
              </Form.Item>
              <Form.Item
                name={`price`}
                label={`Variant price`}
                rules={rules.price}>
                <InputNumber className="w-100" placeholder="Price" />
              </Form.Item>
            </Card>
            <VarinatAttributes />
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default VariantField;

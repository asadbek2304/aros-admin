import React from "react";
import {
  Input,
  Row,
  Col,
  Card,
  Form,
  Upload,
  InputNumber,
  message,
  Tabs,
  Cascader,
} from "antd";
import { ImageSvg } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";
import { LoadingOutlined } from "@ant-design/icons";
import { LANGUAGES } from "configs/AppConfig";
import { useCategoryList } from "../../category/services/queries/use-category-list";

const { Dragger } = Upload;

const rules = {
  name: [
    {
      required: true,
      message: "Please enter product name",
    },
  ],

  price: [
    {
      required: true,
      message: "Please enter product price",
    },
  ],
};

const imageUploadProps = {
  name: "file",
  multiple: true,
  listType: "picture-card",
  showUploadList: false,
  action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const { TabPane } = Tabs;

const filter = (inputValue, path) =>
  path.some(
    option => (option.name).toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
  );

const GeneralField = (props) => {
  const { data: categoryList } = useCategoryList();
  return (
    <Row gutter={16}>
      <Col xs={24} sm={24} md={17}>
        <Card title="Basic Info">
          <Tabs>
            {LANGUAGES.map((lang) => (
              <TabPane tab={`Product name(${lang})`} key={lang}>
                <Form.Item
                  name={`name_${lang}`}
                  label={`Product name(${lang})`}
                  rules={rules.name}>
                  <Input placeholder="Product Name" />
                </Form.Item>
              </TabPane>
            ))}
          </Tabs>
        </Card>
        <Card title="Pricing">
          <Row gutter={16}>
            <Col xs={24} sm={24} md={24}>
              <Form.Item name="price" label="Price" rules={rules.price}>
                <InputNumber
                  className="w-100"
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col xs={24} sm={24} md={7}>
        <Card title="Media">
          <Dragger
            {...imageUploadProps}
            beforeUpload={beforeUpload}
            onChange={(e) => props.handleUploadChange(e)}>
            {props.uploadedImg ? (
              <img src={props.uploadedImg} alt="avatar" className="img-fluid" />
            ) : (
              <div>
                {props.uploadLoading ? (
                  <div>
                    <LoadingOutlined className="font-size-xxl text-primary" />
                    <div className="mt-3">Uploading</div>
                  </div>
                ) : (
                  <div>
                    <CustomIcon className="display-3" svg={ImageSvg} />
                    <p>Click or drag file to upload</p>
                  </div>
                )}
              </div>
            )}
          </Dragger>
        </Card>
        <Card title="Organization">
          <Form.Item name="category" label="Category">
            <Cascader
              fieldNames={{ label: "name", value: "id", children: "children" }}
              options={categoryList?.results}
              placeholder="Please select Category"
			  showSearch={{filter}}
            />
          </Form.Item>
        </Card>
      </Col>
    </Row>
  );
};

export default GeneralField;

import React from "react";
import { Input, Row, Col, Card, Form, Image, Button } from "antd";
import { ImageSvg } from "assets/svg/icon";
import CustomIcon from "components/util-components/CustomIcon";
import {
  LoadingOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { memo } from "react";
import Flex from "components/shared-components/Flex";

const rules = {
  click_url: [
    {
      required: true,
      message: "Please enter click url",
    },
  ],
  description: [
    {
      required: true,
      message: "Please enter banner description",
    },
  ],
};

const GeneralField = (props) => (
  <Row gutter={16}>
    <Col xs={24} sm={24} md={17}>
      <Card title="Banner details">
        <Form.Item name="click_url" label="Click url" rules={rules.click_url}>
          <Input placeholder="https://xyz.com" />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={rules.description}>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Card>
    </Col>
    <Col xs={24} sm={24} md={7}>
      <Card
        {...(!props.uploadedImg && { onClick: props.onImageUploadClick })}
        title="Banner image"
        extra={
          props.uploadedImg ? (
            <Flex>
              <Button onClick={props.onImageUploadClick}>
                <UploadOutlined />
              </Button>
              <Button onClick={props.onImageDelete}>
                <DeleteOutlined />
              </Button>
            </Flex>
          ) : null
        }
        style={{ cursor: "pointer" }}>
        {props.uploadedImg ? (
          <Image src={props.uploadedImg} alt="avatar" className="img-fluid" />
        ) : (
          <div>
            {props.uploadLoading ? (
              <div>
                <LoadingOutlined className="font-size-xxl text-primary" />
                <div className="mt-3">Uploading</div>
              </div>
            ) : (
              <Flex
                flexDirection="column"
                alignItems="center"
                justifyContent="center">
                <CustomIcon className="display-3" svg={ImageSvg} />
                <p>Click or drag file to upload</p>
              </Flex>
            )}
          </div>
        )}
      </Card>
    </Col>
  </Row>
);

export default memo(GeneralField);

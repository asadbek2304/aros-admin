import React from "react";
import { Input, Row, Col, Card, Form } from "antd";

const rules = {
  name: [
    {
      required: true,
      message: "Please enter category name",
    },
  ],
};

const GeneralField = ({ name }) => (
  <Row>
    <Col xs={24} sm={24} md={24}>
      <Card title="Basic Info">
        <Form.Item name={name} label="Attribute name" rules={rules.name}>
          <Input placeholder="Attribute Name" />
        </Form.Item>
      </Card>
    </Col>
  </Row>
);

export default GeneralField;

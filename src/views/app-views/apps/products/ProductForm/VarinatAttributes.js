import { Button, Card, Form, Select, Space } from "antd";
import React from "react";
import { useAttributeList } from "../../attributes/services/queries/use-attributes-list";
import { useAttributeValueList } from "../../attributes/services/queries/use-attribute-value-list";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Option } = Select;

const VariantAttributeForm = ({ field, remove }) => {
  const [attribute, setAttribute] = useState();
  const {
    data: attributeList,
    isLoading: attributeListLoading,
    isRefetching: attributeRefetching,
  } = useAttributeList();

  const {
    data: attributeValues,
    isLoading: attributeValueLoading,
    isRefetching: attributeValueRefetching,
  } = useAttributeValueList(attribute);
  return (
    <Space
      {...field}
      style={{ width: "100%", gap: 0, display: "flex" }}
      direction="vertical">
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, curValues) => {
          return (
            prevValues.attribute_values !== curValues.attribute_values ||
            prevValues.attribute_values[field.name]?.attribute ===
              curValues.attribute_values[field.name]?.attribute
          );
        }}>
        {() => (
          <>
            <Form.Item
              name={[field.name, "attribute"]}
              label="Attribute"
              style={{ marginBottom: 0 }}
              rules={[{ required: true, message: "Attribute is required" }]}>
              <Select
                style={{ width: "100%" }}
                loading={attributeListLoading || attributeRefetching}
                onChange={(value) => setAttribute(value)}>
                {attributeList?.results?.map((res) => (
                  <Option key={res.id} value={res.id}>
                    {res.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              {...field}
              name={[field.name, "attributeValue"]}
              label="Attribute value"
              rules={[
                { required: true, message: "Attribute value is required" },
              ]}
              style={{ marginBottom: 0 }}>
              <Select
                style={{ width: "100%" }}
                loading={attributeValueLoading || attributeValueRefetching}>
                {attributeValues?.results?.map((res) => (
                  <Option key={res.id} value={res.id}>
                    {res.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}
      </Form.Item>
      <Button
        style={{ marginBottom: 8 }}
        type="danger"
        onClick={() => remove(field.name)}
        block
        icon={<MinusCircleOutlined />}>
        Remove attribute value
      </Button>
    </Space>
  );
};

const VarinatAttributes = () => {
  return (
    <Card title="Attributes">
      <Form.List name="attribute_values">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, i) => (
              <VariantAttributeForm
                field={field}
                key={field.key}
                remove={remove}
              />
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}>
                Add attribute value
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Card>
  );
};

export default VarinatAttributes;

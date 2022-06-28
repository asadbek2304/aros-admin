import { Form, Tabs } from "antd";
import { LANGUAGES } from "configs/AppConfig";
import React from "react";
import GeneralField from "../attribute-form/GeneralField";

const { TabPane } = Tabs;

const AddAttributeValue = ({ form }) => {
  return (
    <Form
      form={form}
      name="add-attribute_value"
      className="ant-advanced-search-form">
      <Tabs defaultActiveKey="1">
        {LANGUAGES.map((lang, i) => (
          <TabPane tab={`Attribute value in ${lang}`} key={(i + 1).toString()}>
            <GeneralField name={`value_${lang}`} />
          </TabPane>
        ))}
      </Tabs>
    </Form>
  );
};

export default AddAttributeValue;

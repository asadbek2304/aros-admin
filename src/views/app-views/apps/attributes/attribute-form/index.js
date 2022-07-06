import React, { useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Tabs, Form, Button, message } from "antd";
import Flex from "components/shared-components/Flex";
import GeneralField from "./GeneralField";
import { LANGUAGES } from "configs/AppConfig";
import { useCreateAttribute } from "../services/mutations/use-create-attribute";
import { useHistory, useLocation } from "react-router-dom";
import { useAttributeDetail } from "../services/queries/use-attribute-detail";
import { useUpdateAttribute } from "../services/mutations/use-update-attribute";
import AttributeValueList from "../attribute-value-list";

const { TabPane } = Tabs;

const ADD = "ADD";
const EDIT = "EDIT";

const AttributeForm = (props) => {
  const { mode = ADD, param } = props;
  const { mutate: createAttribute, isLoading: createAttributeLoading } =
    useCreateAttribute();
  const { mutate: updateAttribute, isLoading: updateAttributeLoading } =
    useUpdateAttribute(param?.id);
  const { data: attributeDetail } = useAttributeDetail(param?.id, mode);
  const history = useHistory();
  const location = useLocation();

  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === EDIT) {
      form.setFieldsValue({
        name_en: attributeDetail?.name_en,
        name_uz: attributeDetail?.name_uz,
        name_ru: attributeDetail?.name_ru,
      });
    }
  }, [form, mode, param, props, attributeDetail]);

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        if (mode === ADD) {
          createAttribute(
            { ...values, parent: location?.state?.parent },
            {
              onSuccess: (res) => {
                message.success(`Created ${res.name} to attribute list`);
                history.goBack();
              },
            }
          );
          return;
        }
        updateAttribute(
          { ...values, ...location.state },
          {
            onSuccess: (res) => {
              message.success(`${res.name} Updated `);
            },
          }
        );
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
                {mode === "ADD" ? "Add New Attribute" : `Edit Attribute`}{" "}
              </h2>
              <div className="mb-3">
                <Button className="mr-2" onClick={() => history.goBack()}>
                  Discard
                </Button>
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={createAttributeLoading || updateAttributeLoading}>
                  {mode === "ADD" ? "Add" : `Save`}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container">
          <Tabs defaultActiveKey="1" style={{ marginTop: 30 }}>
            {LANGUAGES.map((lang, i) => (
              <TabPane
                tab={`${lang === "" ? "General" : `Language ${lang}`}`}
                key={(i + 1).toString()}>
                <GeneralField name={`name${lang === "" ? "" : `_${lang}`}`} />
              </TabPane>
            ))}
          </Tabs>
        </div>

        {mode === "EDIT" && (
          <div className="container">
            <AttributeValueList categoryId={param?.id} />
          </div>
        )}
      </Form>
    </>
  );
};

export default AttributeForm;

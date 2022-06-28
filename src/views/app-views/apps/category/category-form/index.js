import React, { useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Tabs, Form, Button, message } from "antd";
import Flex from "components/shared-components/Flex";
import GeneralField from "./GeneralField";
import { LANGUAGES } from "configs/AppConfig";
import { useCreateCategory } from "../services/mutations/use-create-category";
import { useHistory, useLocation } from "react-router-dom";
import { useCategoryDetail } from "../services/queries/use-category-detail";
import { useUpdateCategory } from "../services/mutations/use-update-category";

const { TabPane } = Tabs;

const ADD = "ADD";
const EDIT = "EDIT";

const CategoryForm = (props) => {
  const { mode = ADD, param } = props;
  const { mutate: createCategory, isLoading: createCategoryLoading } =
    useCreateCategory();
  const { mutate: updateCategory, isLoading: updateCategoryLoading } =
    useUpdateCategory(param?.id);
  const { data: categoryDetail } = useCategoryDetail(param?.id, mode);
  const history = useHistory();
  const location = useLocation();

  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === EDIT) {
      form.setFieldsValue({
        name_en: categoryDetail?.name_en,
        name_uz: categoryDetail?.name_uz,
        name_ru: categoryDetail?.name_ru,
      });
    }
  }, [form, mode, param, props, categoryDetail]);

  const onFinish = () => {
    console.log(location.state);
    form
      .validateFields()
      .then((values) => {
        if (mode === ADD) {
          createCategory(
            { ...values, parent: location?.state?.parent },
            {
              onSuccess: () => {
                message.success(`Created ${values.name} to category list`);
                history.goBack();
              },
            }
          );
          return;
        }
        updateCategory(
          { ...values, ...location.state },
          {
            onSuccess: () => {
              message.success(`Updated ${values.name} to category list`);
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
                {mode === "ADD" ? "Add New Category" : `Edit Category`}{" "}
              </h2>
              <div className="mb-3">
                <Button className="mr-2">Discard</Button>
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={createCategoryLoading || updateCategoryLoading}>
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
      </Form>
    </>
  );
};

export default CategoryForm;

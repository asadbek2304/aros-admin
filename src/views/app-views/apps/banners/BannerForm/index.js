import React, { useState, useEffect } from "react";
import PageHeaderAlt from "components/layout-components/PageHeaderAlt";
import { Form, Button, message } from "antd";
import Flex from "components/shared-components/Flex";
import GeneralField from "./GeneralField";
import { FileUpload } from "components/util-components/Upload";
import { useCreateBanner } from "../services/mutations/use-create-banner";
import { useHistory } from "react-router-dom";
import { useBannerDetail } from "../services/queries/use-banner-detail";
import { useUpdateBanner } from "../services/mutations/use-update-banner";

const ADD = "ADD";
const EDIT = "EDIT";

const BannerForm = (props) => {
  const { mode = ADD, param } = props;
  const [image, setImage] = useState("");
  const id = param?.id;
  const history = useHistory();
  const { data: bannerDetail } = useBannerDetail(id);
  const { mutate: updateBanner, isLoading: updateBannerLoading } =
    useUpdateBanner(id);

  const { mutate: createBanner, isLoading: createBannerLoading } =
    useCreateBanner();

  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === EDIT) {
      form.setFieldsValue({
        click_url: bannerDetail?.click_url,
        description: bannerDetail?.description,
      });
      setImage(bannerDetail?.image?.id);
    }

  }, [form, mode, param, props, bannerDetail]);

  const onFinish = () => {
    form
      .validateFields()
      .then((values) => {
        if (mode === ADD) {
          createBanner(
            { ...values, image },
            {
              onSuccess: () => {
                message.success(`Banner created`);
                history.goBack();
              },
            }
          );
        }
        if (mode === EDIT) {
          updateBanner(
            { ...values, image },
            {
              onSuccess: () => {
                message.success(`Banner saved`);
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
                {mode === "ADD" ? "Add New Banner" : `Edit Banner`}{" "}
              </h2>
              <div className="mb-3">
                <Button onClick={() => history.goBack()} className="mr-2">
                  Discard
                </Button>
                <Button
                  type="primary"
                  onClick={() => onFinish()}
                  htmlType="submit"
                  loading={createBannerLoading || updateBannerLoading}>
                  {mode === "ADD" ? "Add" : `Save`}
                </Button>
              </div>
            </Flex>
          </div>
        </PageHeaderAlt>
        <div className="container" style={{ marginTop: "6rem" }}>
          <FileUpload
            previous={mode === "EDIT" ? bannerDetail?.image?.file: undefined}
            onChange={(image) => setImage(image)}>
            {({ handleClick, isLoading, preview, handleDelete }) => (
              <GeneralField
                uploadedImg={preview}
                uploadLoading={isLoading}
                onImageUploadClick={handleClick}
                onImageDelete={handleDelete}
              />
            )}
          </FileUpload>
        </div>
      </Form>
    </>
  );
};

export default BannerForm;

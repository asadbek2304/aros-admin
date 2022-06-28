import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
} from "antd";
import Flex from "components/shared-components/Flex";
import { LANGUAGES } from "configs/AppConfig";
import React, { useState } from "react";
import AddAttributeValue from "../add-attribute-value";
import { useCreateAttributeValue } from "../services/mutations/use-create-attribute_value";
import { useDeleteAttributeValue } from "../services/mutations/use-delete-attribute_value";
import { useUpdateAttributeValue } from "../services/mutations/use-update-attribute_value";
import { useAttributeValueList } from "../services/queries/use-attribute-value-list";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}>
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const AttributeValueList = ({ categoryId }) => {
  const {
    data: attributeValue,
    isLoading: attributeValueLoading,
    isRefetching,
  } = useAttributeValueList(categoryId);

  const [createForm] = Form.useForm();
  const { mutate: createAttributeValue, createAttributeValueLoading } =
    useCreateAttributeValue();
  const [modalIsVisible, setModalIsVisible] = useState(false);
  const handleCancel = () => {
    setModalIsVisible(false);
  };

  const handleCreateAttributeValue = () => {
    createForm
      .validateFields()
      .then((values) => {
        createAttributeValue(
          { ...values, attribute: categoryId },
          {
            onSuccess: () => {
              setModalIsVisible(false);
            },
          }
        );
      })
      .catch((error) => {
        message.error("Please enter all required field ");
      });
  };

  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const { mutate: updateAttributeValue } = useUpdateAttributeValue(editingKey);
  const {
    mutate: deleteAttributeValue,
    isLoading: deleteAttributeValueLoading,
  } = useDeleteAttributeValue(selectedValue);

  const isEditing = (record) => record.id === editingKey;

  const handleDelete = () => {
    deleteAttributeValue(
      {},
      {
        onSuccess: () => {
          setDeleteModalIsOpen(false);
        },
      }
    );
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const handleSave = async () => {
    try {
      const row = await form.validateFields();

      updateAttributeValue(
        { ...row, attribute: categoryId },
        {
          onSuccess: () => {
            message.success("Attribute values successfully updated");
          },
        }
      );
      setEditingKey("");
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const languageColumns = LANGUAGES.map((lang) => ({
    title: `Value in ${lang}`,
    dataIndex: `value_${lang}`,
    width: "20%",
    editable: true,
    key: `${lang}`,
  }));

  const columns = [
    ...languageColumns,
    {
      title: "operation",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => handleSave(record.id)}
              style={{
                marginRight: 8,
              }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Typography.Link>Cancel</Typography.Link>
            </Popconfirm>
          </span>
        ) : (
          <Space style={{ gap: "2rem" }}>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => handleEdit(record)}>
              Edit
            </Typography.Link>
            <Typography.Link
              onClick={() => {
                setSelectedValue(record.id);
                setDeleteModalIsOpen(true);
              }}>
              Delete
            </Typography.Link>
          </Space>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    <Card>
      <Modal
        visible={modalIsVisible}
        title="Create Attribute value"
        onCancel={handleCancel}
        onOk={handleCreateAttributeValue}
        footer={[
          <Button onClick={handleCancel}>Cancel</Button>,
          <Button
            loading={createAttributeValueLoading}
            type="primary"
            onClick={handleCreateAttributeValue}>
            Create
          </Button>,
        ]}>
        <AddAttributeValue form={createForm} />
      </Modal>
      <Modal
        visible={deleteModalIsOpen}
        onCancel={() => setDeleteModalIsOpen(false)}
        onOk={handleDelete}
        title="Delete attribute value"
        footer={[
          <Button key="back" onClick={() => setDeleteModalIsOpen(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="danger"
            loading={deleteAttributeValueLoading}
            onClick={handleDelete}>
            Delete
          </Button>,
        ]}>
        Are you sure want to delete attribute value
      </Modal>
      <Flex
        className="py-2"
        mobileFlex={false}
        justifyContent="between"
        alignItems="center">
        <h3 className="mb-3">AttributeValues</h3>
        <div className="mb-3">
          <Button
            onClick={() => setModalIsVisible(true)}
            type="primary"
            htmlType="submit">
            Add value
          </Button>
        </div>
      </Flex>
      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={attributeValue?.results}
          columns={mergedColumns}
          loading={attributeValueLoading || isRefetching}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </Card>
  );
};

export default AttributeValueList;

import React, { useState } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Menu,
  Tag,
  Modal,
  message,
  Space,
} from "antd";
import ProductListData from "assets/data/product-list.data.json";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import AvatarStatus from "components/shared-components/AvatarStatus";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import NumberFormat from "react-number-format";
import { useHistory } from "react-router-dom";
import utils from "utils";
import { useProductVariantList } from "../services/queries/use-product-variant-list";
import { useDeleteVariant } from "../services/mutations/use-delete-variant";

const ProductVariantList = ({ id }) => {
  let history = useHistory();
  const [list, setList] = useState(ProductListData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { data: productList, isLoading: productListLoading } =
    useProductVariantList(id);
  const { mutate: deleteProduct, isLoading: deleteProductLoading } =
    useDeleteVariant(selectedRow?.id);

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item onClick={() => viewDetails(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setSelectedRow(row);
          setIsDeleteModalOpen(true);
        }}>
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">Delete</span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const addProduct = () => {
    history.push(`/app/apps/products/edit-product/${id}/add-variant`);
  };

  const viewDetails = (row) => {
    history.push(
      `/app/apps/products/edit-product/${id}/edit-variant/${row.id}`
    );
  };

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            size={60}
            type="square"
            src={record.images[0].file}
            name={record.name}
          />
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: (a, b) => utils.antdTableSorter(a, b, "quantity"),
    },
    {
      title: "Price",
      dataIndex: "price",
      render: (price) => (
        <div>
          <NumberFormat
            displayType={"text"}
            value={(Math.round(price * 100) / 100).toFixed(2)}
            prefix={"$"}
            thousandSeparator={true}
          />
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "price"),
    },
    {
      title: "Status",
      dataIndex: "stock",
      render: (stock, record) => (
        <Tag
          className="text-capitalize"
          color={record.is_available ? "cyan" : "red"}>
          {record.is_available ? "Available" : "Not available"}
        </Tag>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "stock"),
    },
    {
      title: "Attributes",
      dataIndex: "attribute_values",
      render: (stock, record) => (
        <Space direction="vertical">
          {record.attribute_values.map((val) => (
            <Tag className="text-capitalize" color={"default"}>
              {val.attribute.name}: {val.value}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, elm) => (
        <div className="text-right">
          <EllipsisDropdown menu={dropdownMenu(elm)} />
        </div>
      ),
    },
  ];

  const rowSelection = {
    onChange: (key, rows) => {
      setSelectedRows(rows);
      setSelectedRowKeys(key);
    },
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteProduct = () => {
    deleteProduct(
      {},
      {
        onSuccess: () => {
          message.success("Variant succesfully deleted!");
        },
        onSettled: () => {
          handleDeleteCancel();
        },
      }
    );
  };

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? list : ProductListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  return (
    <Card>
      <Modal
        visible={isDeleteModalOpen}
        title="Delete variant"
        onCancel={handleDeleteCancel}
        onOk={handleDeleteProduct}
        footer={[
          <Button onClick={handleDeleteCancel}>Cancel</Button>,
          <Button
            loading={deleteProductLoading}
            type="danger"
            onClick={handleDeleteProduct}>
            Delete
          </Button>,
        ]}>
        Are you sure want to delete this Varinat?.
      </Modal>
      <Flex alignItems="center" justifyContent="between" mobileFlex={false}>
        <Flex className="mb-1" mobileFlex={false}>
          <div className="mr-md-3 mb-3">
            <Input
              placeholder="Search"
              prefix={<SearchOutlined />}
              onChange={(e) => onSearch(e)}
            />
          </div>
        </Flex>
        <div>
          <Button
            onClick={addProduct}
            type="primary"
            icon={<PlusCircleOutlined />}
            block>
            Add Variant
          </Button>
        </div>
      </Flex>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={productList?.results}
          rowKey="id"
          loading={productListLoading}
          rowSelection={{
            selectedRowKeys: selectedRowKeys,
            type: "checkbox",
            preserveSelectedRowKeys: false,
            ...rowSelection,
          }}
        />
      </div>
    </Card>
  );
};

export default ProductVariantList;

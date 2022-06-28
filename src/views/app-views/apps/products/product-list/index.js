import React, { useState } from "react";
import {
  Card,
  Table,
  Select,
  Input,
  Button,
  Badge,
  Menu,
  Tag,
  Modal,
  message,
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
import { useProductList } from "../services/queries/use-product-list";
import { useDeleteProduct } from "../services/mutations/use-delete-product";

const { Option } = Select;

const getStockStatus = (stockCount) => {
  if (stockCount >= 10) {
    return (
      <>
        <Badge status="success" />
        <span>In Stock</span>
      </>
    );
  }
  if (stockCount < 10 && stockCount > 0) {
    return (
      <>
        <Badge status="warning" />
        <span>Limited Stock</span>
      </>
    );
  }
  if (stockCount === 0) {
    return (
      <>
        <Badge status="error" />
        <span>Out of Stock</span>
      </>
    );
  }
  return null;
};

const categories = ["Cloths", "Bags", "Shoes", "Watches", "Devices"];

const ProductList = () => {
  let history = useHistory();
  const [list, setList] = useState(ProductListData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { data: productList, loading: productListLoading } = useProductList();
  const { mutate: deleteProduct, isLoading: deleteProductLoading } =
    useDeleteProduct(selectedRow?.id);

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
    history.push(`/app/apps/products/add-product`);
  };

  const viewDetails = (row) => {
    history.push(`/app/apps/products/edit-product/${row.id}`);
  };

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Product",
      dataIndex: "name",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            size={60}
            type="square"
            src={record.image.file}
            name={record.name}
          />
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "name"),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => utils.antdTableSorter(a, b, "category"),
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
          message.success("Product succesfully deleted!");
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

  const handleShowCategory = (value) => {
    if (value !== "All") {
      const key = "category";
      const data = utils.filterArray(ProductListData, key, value);
      setList(data);
    } else {
      setList(ProductListData);
    }
  };

  return (
    <Card>
      <Modal
        visible={isDeleteModalOpen}
        title="Delete banner"
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
        Are you sure want to delete this Product?.
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
          <div className="mb-3">
            <Select
              defaultValue="All"
              className="w-100"
              style={{ minWidth: 180 }}
              onChange={handleShowCategory}
              placeholder="Category">
              <Option value="All">All</Option>
              {categories.map((elm) => (
                <Option key={elm} value={elm}>
                  {elm}
                </Option>
              ))}
            </Select>
          </div>
        </Flex>
        <div>
          <Button
            onClick={addProduct}
            type="primary"
            icon={<PlusCircleOutlined />}
            block>
            Add product
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

export default ProductList;

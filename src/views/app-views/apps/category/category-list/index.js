import React, { useState } from "react";
import { Card, Table, Input, Button, Menu, Typography } from "antd";
import ProductListData from "assets/data/product-list.data.json";
import {
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
import EllipsisDropdown from "components/shared-components/EllipsisDropdown";
import Flex from "components/shared-components/Flex";
import { useHistory } from "react-router-dom";
import utils from "utils";
import { useCategoryList } from "../services/queries/use-category-list";
import { useDeleteCategory } from "../services/mutations/use-delete-category";

const ProductList = () => {
  let history = useHistory();
  const [list, setList] = useState(ProductListData);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const { data: categories, isLoading: categoryListLoading } =
    useCategoryList();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const { mutate: deleteCategory } = useDeleteCategory(selectedRow?.id);

  const dropdownMenu = (row) => (
    <Menu>
      <Menu.Item onClick={() => addSubCategory(row)}>
        <Flex alignItems="center">
          <PlusCircleOutlined />
          <span className="ml-2">Add sub category</span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => viewDetails(row)}>
        <Flex alignItems="center">
          <EyeOutlined />
          <span className="ml-2">View Details</span>
        </Flex>
      </Menu.Item>
      <Menu.Item onClick={() => deleteRow(row)}>
        <Flex alignItems="center">
          <DeleteOutlined />
          <span className="ml-2">
            {selectedRows.length > 0
              ? `Delete (${selectedRows.length})`
              : "Delete"}
          </span>
        </Flex>
      </Menu.Item>
    </Menu>
  );

  const addSubCategory = (row) => {
    history.push(`/app/apps/category/add-category`, { parent: row.id });
  };

  const addCategory = () => {
    history.push(`/app/apps/category/add-category`);
  };

  const viewDetails = (row) => {
    history.push(`/app/apps/category/edit-category/${row.id}`);
  };

  const deleteRow = () => {
    deleteCategory();
  };

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Category",
      dataIndex: "name_en",
      render: (_, record) => (
        <div className="d-flex">
          <Typography.Title level={5}>{record.name_en}</Typography.Title>
        </div>
      ),
      sorter: (a, b) => utils.antdTableSorter(a, b, "name_en"),
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, elm) => (
        <div onClick={() => setSelectedRow(elm)} on className="text-right">
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

  const onSearch = (e) => {
    const value = e.currentTarget.value;
    const searchArray = e.currentTarget.value ? list : ProductListData;
    const data = utils.wildCardSearch(searchArray, value);
    setList(data);
    setSelectedRowKeys([]);
  };

  return (
    <Card>
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
            onClick={addCategory}
            type="primary"
            icon={<PlusCircleOutlined />}
            block>
            Add category
          </Button>
        </div>
      </Flex>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={categories?.results}
          rowKey="id"
          loading={categoryListLoading}
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

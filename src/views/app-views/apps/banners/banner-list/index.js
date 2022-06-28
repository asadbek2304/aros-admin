import React, { useState } from "react";
import { Card, Table, Input, Button, Menu, Modal } from "antd";
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
import { useHistory } from "react-router-dom";
import utils from "utils";
import { useBannerList } from "../services/queries/use-banner-list";
import { useDeleteBanner } from "../services/mutations/use-delete-banner";

const BannerList = () => {
  let history = useHistory();
  const [list, setList] = useState(ProductListData);
  const { data: bannerList, isLoading: isBannerListLoading } = useBannerList();
  const [selectedRow, setSelectedRow] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [selectedRows, setSelectedRows] = useState({});
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: deleteBanner, isLoading: deleteBannerLoading } =
    useDeleteBanner(selectedRow.id);

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

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };

  const addBanner = () => {
    history.push(`/app/apps/banners/add-banner`);
  };

  const viewDetails = (row) => {
    history.push(`/app/apps/banners/edit-banner/${row.id}`);
  };

  const handleDeleteBanner = () => {
    deleteBanner(
      {},
      {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
        },
      }
    );
  };

  const tableColumns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (_, record) => (
        <div className="d-flex">
          <AvatarStatus
            size={60}
            type="square"
            src={record.image.file}
            name={record.image.name}
          />
        </div>
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
        title="Delete banner"
        onCancel={handleDeleteCancel}
        onOk={handleDeleteBanner}
        footer={[
          <Button onClick={handleDeleteCancel}>Cancel</Button>,
          <Button
            loading={deleteBannerLoading}
            type="danger"
            onClick={handleDeleteBanner}>
            Delete
          </Button>,
        ]}>
        Are you sure want to delete this banner?.
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
            onClick={addBanner}
            type="primary"
            icon={<PlusCircleOutlined />}
            block>
            Add banner
          </Button>
        </div>
      </Flex>
      <div className="table-responsive">
        <Table
          columns={tableColumns}
          dataSource={bannerList?.results}
          loading={isBannerListLoading}
          rowKey="id"
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

export default BannerList;

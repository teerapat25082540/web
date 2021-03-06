import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Input, Space } from "antd";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import MainLayouts from "../layouts/MainLayouts";
import EditVaccineForm from "../components/EditVaccineForm";

import moment from "moment";
import Highlighter from "react-highlight-words";
import "../styles/EditVaccineForm.css";
import { useHistory } from "react-router-dom";

function ManageVaccine() {
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";
  const [vaccine, setVaccine] = useState<object[]>([]);
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState<string>("");
  const accessToken = localStorage.getItem("accessToken");
  const history = useHistory();

  const handleSearch = (selectedKeys: any, confirm: any, dataIndex: any) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: any) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <div style={{ textAlign: "center" }}>
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
          </Space>
        </div>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible: any) => {
      if (visible) {
        //setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text: any) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: <h4 style={{ textAlign: "center" }}>??????????????????????????????</h4>,
      dataIndex: "name",
      align: "center" as "center",
      width: 100,
      key: 1,
      sorter: (a: any, b: any) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
      // sorter: (a:any, b:any) => a.address.length - b.address.length,
      // sortDirections: ['descend', 'ascend'],
    },
    {
      title: <h4 style={{ textAlign: "center" }}>????????????????????????</h4>,
      dataIndex: "amount",
      align: "center" as "center",
      width: 50,
      key: 2,
      sorter: (a: any, b: any) => a.amount - b.amount,
    },
    {
      title: <h4 style={{ textAlign: "center" }}>??????????????????????????????????????????</h4>,
      dataIndex: "createAt",
      align: "center" as "center",
      width: 100,
      key: 3,
      sorter: (a: any, b: any) =>
        moment(a.createAt).unix() - moment(b.createAt).unix(),
      ...getColumnSearchProps("createAt"),
    },
    {
      title: "?????????????????????????????? / ??????????????? / ??????",
      dataIndex: "action",
      width: 150,
      align: "center" as "center",
    },
  ];

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: "???????????????????????????????????????????????????",
      icon: <ExclamationCircleOutlined />,
      content: "????????????????????????????????????????????????????????????????????????????????????????????? ?",
      okText: "??????????????????",
      cancelText: "??????????????????",
      onOk: async () => {
        await axios.delete(`http://localhost:4000/api/vaccine/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setVaccine([]);
        getVaccine();
      },
    });
  };

  const editVaccine = (body: any, id: any) => {
    Modal.confirm({
      title: "????????????????????????????????????????????????????????????",
      icon: <ExclamationCircleOutlined />,
      content: "?????????????????????????????????????????????????????????????????????????????????????????????????????? ?",
      okText: "??????????????????",
      cancelText: "??????????????????",
      onOk: async () => {
        await axios.put(`http://localhost:4000/api/vaccine/${id}`, body, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setVaccine([]);
        getVaccine();
      },
    });
  };

  const getVaccine = async () => {
    let UserId = localStorage.getItem("id");
    let res = await axios.get(`http://localhost:4000/api/vaccine/${UserId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    let vaccineList: object[] = [];
    res.data.forEach((item: any, index: any) => {
      let itemVaccine: object = {
        key: index,
        id: item.id,
        name: item.name,
        amount: Intl.NumberFormat().format(item.amount),
        email: item.email,
        tel: item.tel,
        lat: item.lat,
        long: item.long,
        createAt: moment(item.createAt).format("DD MMMM YYYY hh:mm"),
        action: (
          <>
            <Button
              onClick={() => {
                infoVaccine(item);
              }}
              type="primary"
              icon={<ExclamationCircleOutlined />}
              style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            >
              ??????????????????????????????
            </Button>

            <EditVaccineForm
              index={index}
              editVaccineHandle={editVaccine}
              vaccine={item}
            />

            <Button
              onClick={() => {
                confirmDelete(item.id);
              }}
              type="primary"
              danger
              icon={<DeleteOutlined />}
              className="btn-action"
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              ????????????????????????
            </Button>
          </>
        ),
      };
      vaccineList = [...vaccineList, itemVaccine];
    });
    setVaccine(vaccineList);
  };

  const infoVaccine = async (item: any) => {
    let res = await axios(
      `https://api.longdo.com/map/services/address?lon=${item.long}&lat=${item.lat}&key=${mapKey}`
    );
    let address = res.data;
    Modal.info({
      title: <h4>{item.name}</h4>,
      width: 550,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>
            <span>??????????????? : {Intl.NumberFormat().format(item.amount)} ?????????</span>
            <br />
            <span>?????????????????????????????? : {item.description}</span>
            <br />
            <span>??????????????? : {item.email}</span>
            <br />
            <span>????????????????????????????????? : {item.tel}</span>
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>?????????????????????</span>
            <br />
            {address.aoi && (
              <span>
                {address.aoi} <br />
              </span>
            )}

            {address.road && (
              <span>
                ????????? {address.road} <br />
              </span>
            )}

            {address.subdistrict && (
              <span>
                ????????????/???????????? {address.subdistrict} <br />
              </span>
            )}

            {address.district && (
              <span>
                ???????????????/????????? {address.district} <br />
              </span>
            )}

            {address.province && (
              <span>
                ????????????????????? {address.province} <br />
              </span>
            )}

            {address.postcode && (
              <span>
                ???????????????????????????????????? {address.postcode} <br />
              </span>
            )}

            {address.country && (
              <span>
                {address.country} <br />
              </span>
            )}
            <br />
          </p>
        </div>
      ),
      okText: "Ok",
      cancelText: "Cancel",
    });
  };

  useEffect(() => {
    getVaccine();
  });

  if (!accessToken) {
    history.push("/login");
    return null;
  } else {
    return (
      <>
        <MainLayouts page="2">
          <Table
            style={{ padding: 15 }}
            columns={columns}
            dataSource={vaccine}
            scroll={{ y: 520 }}
            pagination={{ pageSize: 5 }}
          />
        </MainLayouts>
      </>
    );
  }
}

export default ManageVaccine;

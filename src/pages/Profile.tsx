import { Button, Modal, Row, Card, Avatar } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  DeleteOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import EditUser from "./EditUser";
import MainLayouts from "../layouts/MainLayouts";
import { useHistory } from "react-router";

const Profile = () => {
  const [res, setRes] = useState<any>({});
  const history = useHistory();

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    setRes({
      id: localStorage.getItem("id"),
      username: localStorage.getItem("username"),
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      email: localStorage.getItem("email"),
      tel: localStorage.getItem("tel"),
    });
  }, [res.length]);

  const deleteUser = async () => {
    const id = localStorage.getItem("id");
    Modal.confirm({
      title: "Continue Remove",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to remove this user?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: async () => {
        await axios.delete(`http://localhost:4000/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        localStorage.clear();
        history.push("/");
      },
    });
  };

  const updateData = async () => {
    let accessToken = localStorage.getItem("accessToken");
    const res = await axios.post(
      `http://localhost:4000/api/user/getuser`,
      { accessToken: accessToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("firstname", res.data.firstname);
    localStorage.setItem("lastname", res.data.lastname);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("tel", res.data.tel);

    setRes({
      id: localStorage.getItem("id"),
      username: localStorage.getItem("username"),
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      email: localStorage.getItem("email"),
      tel: localStorage.getItem("tel"),
    });
  };

  const updateUser = async (value: any) => {
    console.log(value);
    const id = localStorage.getItem("id");
    await axios.put(`http://localhost:4000/api/user/${id}`, value, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    updateData();
    const fir = localStorage.getItem("firstname");
    console.log(fir);
  };

  if (!accessToken) {
    history.push("/login");
    return null;
  } else {
    return (
      <>
        <MainLayouts page="5">
          <Card
            title={<h1 style={{ textAlign: "center" }}>Profile</h1>}
            style={{ width: 300, margin: "auto" }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Avatar size={64} icon={<UserOutlined />} />
            </div>

            <h4>ชื่อ: {res?.firstname}</h4>
            <h4>นามสกุล: {res?.lastname}</h4>
            <h4>username: {res?.username}</h4>
            <h4>email: {res?.email}</h4>
            <h4>เบอร์โทร: {res?.tel}</h4>
            <Row justify="center">
              <Button
                onClick={() => {
                  deleteUser();
                }}
                type="primary"
                danger
                icon={<DeleteOutlined />}
                className="btn-action"
                style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                ลบข้อมูล
              </Button>

              <EditUser update={updateUser} />
            </Row>
          </Card>
        </MainLayouts>
      </>
    );
  }
};

export default Profile;

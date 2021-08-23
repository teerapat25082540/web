import { Table, Button, Modal, Form, Row, Card, Col } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { typeUser } from "../DataType";
import { DeleteTwoTone, ExclamationCircleOutlined } from "@ant-design/icons";
import EditUser from "./EditUser";
import MainLayouts from "../layouts/MainLayouts";
import { useHistory } from "react-router";

const Profile = () => {
  const [res, setRes] = useState<any>({});
  const [form] = Form.useForm();
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
        const res = await axios.delete(`http://localhost:4000/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        localStorage.clear();
        history.push("/");
      },
    });
  };

  if (!accessToken) {
    history.push("/login");
    return null;
  } else {
    return (
      <>
        <MainLayouts page="5">
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
              type="link"
              icon={
                <DeleteTwoTone
                  twoToneColor="#FF0000"
                  style={{ fontSize: "30px" }}
                />
              }
            />

            <EditUser />
          </Row>
        </MainLayouts>
      </>
    );
  }
};

export default Profile;

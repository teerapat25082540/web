import { Table, Button, Modal, Form, Row, Card, Col } from "antd";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { typeUser } from "../DataType";
import { DeleteTwoTone, ExclamationCircleOutlined } from "@ant-design/icons";
import EditUser from "./EditUser";
import MainLayouts from "../layouts/MainLayouts";
import { useHistory } from "react-router";

const Profile = () => {
  const [res, setRes] = useState<typeUser>();
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    showData();
  });

  const accessToken = localStorage.getItem("accessToken");

  const showData = async () => {
    const res = await axios.post(
      `http://localhost:4000/api/user/getuser`,
      { accessToken: accessToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    setRes(res.data);
    localStorage.setItem("id", res.data.id);
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("firstname", res.data.firstname);
    localStorage.setItem("lastname", res.data.lastname);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("tel", res.data.tel);
    console.log(res.data);
  };

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

  return (
    <>
      <MainLayouts page="5">
        <h4 >ชื่อ: {res?.firstname}</h4>
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
};

export default Profile;

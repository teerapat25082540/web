import React, { useState } from "react";
import { Modal, Form, Input, Button, Row } from "antd";
import { typeUser } from "../DataType";
import axios from "axios";
import MainLayouts from "../layouts/MainLayouts";
import { useHistory } from "react-router-dom";
import HomePage from "./HomePage";

const Login = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();
  const accessToken = localStorage.getItem("accessToken");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const LoginHandler = async (data: typeUser) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/user/login",
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } }
      );
      if (res) {
        Modal.success({
          content: "Login Success!",
        });
        localStorage.setItem("accessToken", res.data.accessToken);
        form.resetFields();
        getUserLogged();
        setIsModalVisible(false);
        history.push("/");
      }
    } catch (error) {
      Modal.error({
        content: "Email or Password is incorrect!",
      });
    }
  };

  const getUserLogged = async () => {
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
    localStorage.setItem("id", res.data.id);
    localStorage.setItem("username", res.data.username);
    localStorage.setItem("firstname", res.data.firstname);
    localStorage.setItem("lastname", res.data.lastname);
    localStorage.setItem("email", res.data.email);
    localStorage.setItem("tel", res.data.tel);
  };

  if (accessToken) {
    history.push("/");
    return null;
  } else {
    return (
      <>
        <MainLayouts page="3">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 9 }}
            onFinish={LoginHandler}
            form={form}
          >
            <Form.Item
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 16 }}
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 16 }}
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Row justify="center">
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Row>
          </Form>
        </MainLayouts>
      </>
    );
  }
};
export default Login;

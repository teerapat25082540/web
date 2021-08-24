import { Button, Form, Input, Modal, Row } from "antd";
import React from "react";
import axios from "axios";
import { typeNewUser } from "../DataType";
import MainLayouts from "../layouts/MainLayouts";
import { useHistory } from "react-router";

const Register = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const accessToken = localStorage.getItem("accessToken");

  const addNewUserHandler = async (data: typeNewUser) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/user",
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } }
      );
      if (res) {
        Modal.success({
          content: "save successfully!",
        });
      }

      history.push("/");
    } catch (error) {
      Modal.error({
        content: "duplicate information!",
      });
    }
    console.log(data);

    form.resetFields();
  };

  if (accessToken) {
    history.push("/");
    return null;
  } else {
    return (
      <>
        <MainLayouts page="4">
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 9 }}
            onFinish={addNewUserHandler}
            form={form}
          >
            <Form.Item
              label="Firstname"
              name="firstname"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Lastname"
              name="lastname"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Username"
              name="username"
              rules={[
                { required: true, message: "Please input your user name!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  type: "email",
                  message:
                    "The input is not valid E-mail! e.g. example@mail.com",
                },
                {
                  required: true,
                  message: "Please input your email!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Tel."
              name="tel"
              rules={[
                {
                  required: true,
                  message: "Please input your telephone number!",
                },
                {
                  pattern: /^!*([0-9]!*){10,10}/,
                  message: `isn't a phone number with area code!`,
                },
              ]}
            >
              <Input placeholder="0xxxxxxxxx" maxLength={10} />
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
export default Register;

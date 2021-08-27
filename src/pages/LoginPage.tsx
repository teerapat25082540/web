import React from "react";
import { Modal, Form, Input, Button, Row, Card } from "antd";
import { typeUser } from "../DataType";
import axios from "axios";
import MainLayouts from "../layouts/MainLayouts";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const accessToken = localStorage.getItem("accessToken");

  const LoginHandler = async (data: typeUser) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/user/login",
        JSON.stringify(data),
        { headers: { "Content-Type": "application/json" } }
      );
      localStorage.setItem("accessToken", res.data.accessToken);
      if (res.data.accessToken) {
        Modal.success({
          content: "เข้าสู่ระบบสำเร็จ!",
        });

        form.resetFields();
        getUserLogged();
        history.push("/");
      } else {
        Modal.error({
          content: "ชื่อผู่ใช้หรือรหัสผ่านไม่ถูกต้อง!",
        });
      }
    } catch (error) {
      Modal.error({
        content: "ชื่อผู่ใช้หรือรหัสผ่านไม่ถูกต้อง!",
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
          <div className="site-card-wrapper">
            <Row justify="center">
              <Card title="เข้าสู่ระบบ" bordered={true} style={{ width: "35rem" }}>
                <Form
                  name="basic"
                  layout="vertical"
                  onFinish={LoginHandler}
                  form={form}
                >
                  <Form.Item
                    label="ชื่อผู้ใช้"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกชื่อผู้ใช้",
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>

                  <Form.Item
                    label="รหัสผ่าน"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "กรุณากรอกรหัสผ่าน",
                      },
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      style={{ marginTop: "1rem" }}
                    >
                      เข้าสู่ระบบ
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </Row>
          </div>
        </MainLayouts>
      </>
    );
  }
};
export default Login;

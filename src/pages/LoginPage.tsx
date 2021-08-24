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
          content: "Login Success!",
        });

        form.resetFields();
        getUserLogged();
        history.push("/");
      } else {
        Modal.error({
          content: "Username or Password is incorrect!",
        });
      }
    } catch (error) {
      Modal.error({
        content: "Username or Password is incorrect!",
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
          <Row justify="center" style={{ padding: "2rem" }}>
            <div
              className="site-card-border-less-wrapper"
              style={{ textAlign: "center" }}
            >
              <Card
                title="เข้าสู่ระบบ"
                bordered={true}
                style={{ width: "30rem" }}
                // cover={
                //   <img
                //     alt="banner"
                //     style={{ padding: 3 }}
                //     src={VaccineBanner}
                //   />
                // }
              >
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

                  <Row justify="center">
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ width: "27rem", marginTop: "1rem" }}
                      >
                        เข้าสู่ระบบ
                      </Button>
                    </Form.Item>
                  </Row>
                </Form>
              </Card>
            </div>
          </Row>
        </MainLayouts>
      </>
    );
  }
};
export default Login;

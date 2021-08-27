import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Image,
} from "antd";
import React from "react";
import axios from "axios";
import { typeNewUser } from "../DataType";
import MainLayouts from "../layouts/MainLayouts";
import { useHistory } from "react-router";
import RegisterBanner from "../images/register-banner.png";

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
        Modal.success({ content: "save successfully!" });
      }
      history.push("/");
    } catch (error: any) {
      /* console.log(error.response.data.message) */ 
      let u: any = error.response.data.message[0];
      let e: any = error.response.data.message[1];
      let username: any = u.split(" ")[0];
      let email: any = e.split(" ")[0];
      if (username) {
        console.log(username);
      }
      if (email) {
        console.log("email already");
      } /* Modal.error({ content: "duplicate information!", }); */
    }
    /* console.log(data); */ 
    //form.resetFields();
  };

  if (accessToken) {
    history.push("/");
    return null;
  } else {
    return (
      <>
        <MainLayouts page="4">
          <Row justify="center">
            <Col span={12}>
              <Row justify="center" style={{ marginTop: "4rem" }}>
                <Card title="สร้างบัญชี">
                  <Form
                    name="basic"
                    layout="vertical"
                    onFinish={addNewUserHandler}
                    form={form}
                  >
                    <Form.Item
                      name="firstname"
                      label="ชื่อจริง"
                      rules={[{ required: true, message: "กรุณากรอกชื่อจริง" }]}
                      style={{ display: "inline-block" }}
                    >
                      <Input placeholder="ชื่อจริง" />
                    </Form.Item>
                    <Form.Item
                      name="lastname"
                      label="นามสกุล"
                      rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
                      style={{
                        display: "inline-block",
                        marginLeft: 8,
                      }}
                    >
                      <Input placeholder="นามสกุล" />
                    </Form.Item>

                    <Form.Item
                      label="ชื่อผู้ใช้"
                      name="username"
                      rules={[
                        { required: true, message: "กรุณากรอกชื่อผู้ใช้" },
                      ]}
                    >
                      <Input placeholder="ชื่อผู้ใช้" />
                    </Form.Item>

                    <Form.Item
                      label="รหัสผ่าน"
                      name="password"
                      rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน" }]}
                    >
                      <Input.Password placeholder="รหัสผ่าน" />
                    </Form.Item>

                    <Form.Item
                      label="อีเมล"
                      name="email"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกอีเมล",
                        },
                        {
                          type: "email",
                          message:
                            "รูปแบบอีเมลไม่ถูกต้อง ตัวอย่าง example@hotmail.com",
                        },
                      ]}
                    >
                      <Input placeholder="อีเมล" />
                    </Form.Item>
                    <Form.Item
                      label="เบอร์ติดต่อ"
                      name="tel"
                      rules={[
                        {
                          required: true,
                          message: "กรุณากรอกเบอร์ติดต่อ",
                        },
                        {
                          pattern: /^!*([0-9]!*){9,10}/,
                          message: `รูปแบบหมายเลขโทรศัพท์ไม่ถูกต้อง`,
                        },
                      ]}
                    >
                      <Input placeholder="เบอร์ติดต่อ" maxLength={10} />
                    </Form.Item>

                    <Row justify="center">
                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ width: "27rem", marginTop: "1rem" }}
                        >
                          ยืนยันการลงทะเบียน
                        </Button>
                      </Form.Item>
                    </Row>
                  </Form>
                </Card>
              </Row>
            </Col>
            <Col span={12}>
              <Row justify="center" style={{ marginTop: "7rem" }}>
                <Image preview={false} src={RegisterBanner} width={600} />
              </Row>
            </Col>
          </Row>
        </MainLayouts>
      </>
    );
  }
};
export default Register;

import { Button, Form, Input, Modal, Row } from "antd";
import React, { useState, useRef } from "react";
import { EditOutlined } from "@ant-design/icons";

type Props = {
  update: any;
};

const EditUser = ({ update }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState<any>({});
  const formRef = useRef<any>()

  const showModal = () => {
    setIsModalVisible(true);
    setData({
      ...data,
      id: localStorage.getItem("id"),
      username: localStorage.getItem("username"),
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      email: localStorage.getItem("email"),
      tel: localStorage.getItem("tel"),
    });
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    formRef.current.setFieldsValue({
      firstname: data.firstname,
      lastname: data.lastname,
      username: data.username,
      email: data.email,
      tel: data.tel,
    })
  };

  const onFinish = (value: any) => {
    update(value);
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          showModal();
        }}
        type="primary"
        icon={<EditOutlined />}
        className="btn-action"
        style={{
          borderRadius: 0,
          backgroundColor: "#ffc404",
          borderColor: "#ffc404",
        }}
      >
        แก้ไขข้อมูล
      </Button>

      <Modal
        className="edit-md"
        visible={isModalVisible}
        footer={null}
        centered
        title="แก้ไขโปรไฟล์"
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          ref={formRef}
          layout="vertical"
          initialValues={{
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            email: data.email,
            tel: data.tel,
          }}
        >
          <Form.Item
            name="firstname"
            label="ชื่อจริง"
            rules={[{ required: true, message: "กรุณากรอกชื่อจริง" }]}
            style={{ display: "inline-block", width: "14.5rem" }}
          >
            <Input placeholder="ชื่อจริง" />
          </Form.Item>
          <Form.Item
            name="lastname"
            label="นามสกุล"
            rules={[{ required: true, message: "กรุณากรอกนามสกุล" }]}
            style={{
              display: "inline-block",
              width: "14.5rem",
              marginLeft: 8,
            }}
          >
            <Input placeholder="นามสกุล" />
          </Form.Item>

          <Form.Item
            label="ชื่อผู้ใช้"
            name="username"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้" }]}
          >
            <Input placeholder="ชื่อผู้ใช้" />
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
                message: "รูปแบบอีเมลไม่ถูกต้อง ตัวอย่าง example@hotmail.com",
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
                style={{ width: "29.5rem", marginTop: "1rem" }}
              >
                บันทึก
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default EditUser;

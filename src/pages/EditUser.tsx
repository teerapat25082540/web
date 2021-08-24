import { Button, Form, Input, Modal, Row } from "antd";
import React, { useState } from "react";
import { EditOutlined } from "@ant-design/icons";

type Props = {
  update: any;
};

const EditUser = ({ update }: Props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [data, setData] = useState<any>({});

  //const [form] = Form.useForm();

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
        //style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
      >
        แก้ไขข้อมูล
      </Button>

      <Modal
        className="edit-md"
        visible={isModalVisible}
        footer={null}
        title="Edit User"
        onCancel={handleCancel}
      >
        <Form
          name="basic"
          onFinish={onFinish}
          //form={form}
          initialValues={{
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            email: data.email,
            tel: data.tel,
          }}
        >
          <Form.Item
            labelCol={{ span: 5 }}
            label="Firstname"
            name="firstname"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 5 }}
            label="Lastname"
            name="lastname"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 5 }}
            label="Username"
            name="username"
            rules={[
              { required: true, message: "Please input your user name!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 5 }}
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 5 }}
            label="TelNum"
            name="tel"
            rules={[
              {
                required: true,
                message: "Please input your telephone number!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Row justify="center">
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default EditUser;

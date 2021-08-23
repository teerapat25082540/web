import React, { useState, useRef } from "react";
import { Modal, Button, Input, InputNumber, Form } from "antd";
import ListSearch from "./ListSearch";
import axios from "axios";
import { map, longdo, MapEditForm } from "../components/MapEditForm";
import "../styles/EditVaccineForm.css";
import { FormOutlined, SearchOutlined } from "@ant-design/icons";

type Props = {
  vaccine: any;
  editVaccineHandle: any;
  index: number;
};

const EditVaccineForm = ({ vaccine, editVaccineHandle, index }: Props) => {
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";
  const { TextArea } = Input;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lat, setLat] = useState<number>(vaccine.lat);
  const [lon, setLon] = useState<number>(vaccine.long);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const addressRef = useRef<any>();
  const formRef = useRef<any>();
  const [check,setCheck] = useState<boolean>(false)

  const initMap = () => {
    map.Overlays.clear();
    map.Layers.setBase(longdo.Layers.NORMAL);
    map.zoom(10);
    map.Overlays.add(
      new longdo.Marker({ lon: vaccine.long, lat: vaccine.lat })
    );
    map.location({ lon: vaccine.long, lat: vaccine.lat }, true);
    setCheck(true)
  };

  const setAddress = async () => {
    let res = await axios(
      `https://api.longdo.com/map/services/address?lon=${vaccine.long}&lat=${vaccine.lat}&key=${mapKey}`
    );
    let address: string = "";
    if (res.data.road) address += ` ${res.data.road}`;
    if (res.data.subdistrict) address += ` ${res.data.subdistrict}`;
    if (res.data.district) address += ` ${res.data.district}`;
    if (res.data.province) address += ` ${res.data.province}`;
    addressRef.current.state.value = address;
    setSuggestions([]);
  };

  const showModal = () => {
    setIsModalVisible(true);
    if(check){
      map.zoom(10);
      map.Overlays.add(
        new longdo.Marker({ lon: vaccine.long, lat: vaccine.lat })
      );
      map.location({ lon: vaccine.long, lat: vaccine.lat }, true);
    }
    setAddress();
  };

  const handleOk = () => {
    //setIsModalVisible(false);
    formRef.current.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values: any) => {
    
    let newVaccine = {
      user_id: vaccine.user_id,
      name: values.vaccine,
      amount: values.amount,
      email: values.email,
      tel: values.tel,
      lat: lat,
      long: lon,
      description: values.description,
      createAt: vaccine.createAt,
    };
    editVaccineHandle(newVaccine, vaccine.id);
    setIsModalVisible(false);
  };

  // search address keyup
  const onKeyUpSeach = async (e: any) => {
    let res = await axios.get(
      `https://search.longdo.com/mapsearch/json/search?keyword=${e.target.value}&limit=100&key=${mapKey}`
    );
    setSuggestions(res.data.data);
  };

  const selectSearchItem = (item: any) => {
    setLat(item.lat);
    setLon(item.lon);
    map.Overlays.clear();
    map.Overlays.add(new longdo.Marker({ lon: item.lon, lat: item.lat }));
    map.zoom(10);
    map.location(
      { lon: item.lon, lat: item.lat },
      {
        title: "I am here",
      }
    );
    addressRef.current.state.value = item.name;
    setSuggestions([]);
  };

  return (
    <>
      <Button
        onClick={() => {
          showModal();
        }}
        type="primary"
        className="btn-action"
        icon={<FormOutlined />}
        style={{
          borderRadius: 0,
          backgroundColor: "#ffc404",
          borderColor: "#ffc404",
        }}
      >
        แก้ไขข้อมูล
      </Button>
      <Modal
        title="แก้ไขข้อมูลวัคซีน"
        visible={isModalVisible}
        okText="บันทึก"
        cancelText="ยกเลิก"
        onOk={handleOk}
        width={600}
        onCancel={handleCancel}
        centered
      >
        <Form
          ref={formRef}
          name="EditVaccine"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            vaccine: vaccine.name,
            amount: vaccine.amount,
            description: vaccine.description,
            email: vaccine.email,
            tel: vaccine.tel,
          }}
        >
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              name="vaccine"
              label="ชื่อวัคซีน"
              rules={[{ required: true, message: "กรุณากรอกชื่อวัคซีน" }]}
              style={{ display: "inline-block", width: "calc(50%)" }}
            >
              <Input placeholder="ชื่อวัคซีน" />
            </Form.Item>
            <Form.Item
              name="amount"
              label="จำนวน"
              rules={[{ required: true, message: "กรุณากรอกจำนวนวัคซีน" }]}
              style={{
                display: "inline-block",
                margin: "0 8px",
              }}
            >
              <InputNumber
                placeholder="จำนวนโดส"
                style={{ width: "calc(127%)" }}
                min={1}
                max={100000000}
              />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="อีเมล"
            name="email"
            rules={[{ required: true, message: "กรุณากรอกอีเมล" }]}
          >
            <Input placeholder="อีเมล" />
          </Form.Item>

          <Form.Item
            label="เบอร์ติดต่อ"
            name="tel"
            rules={[{ required: true, message: "กรุณากรอกเบอร์ติดต่อ" }]}
          >
            <Input placeholder="เบอร์ติดต่อ" />
          </Form.Item>

          <Form.Item
            label="รายละเอียด"
            name="description"
            rules={[{ required: true, message: "กรุณากรอกรายละเอียด" }]}
          >
            <TextArea
              placeholder="รายละเอียด"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="search"
            label="พิกัดที่อยู่"
           // rules={[{ required: true, message: "กรุณากรอกพิกัดที่อยู่" }]}
          >
            <div>
              <Input
                prefix={<SearchOutlined />}
                onKeyUp={(e) => onKeyUpSeach(e)}
                placeholder="พิกัดที่อยู่"
                ref={addressRef}
              />
              <ListSearch selectItem={selectSearchItem} data={suggestions} />
            </div>
          </Form.Item>
          <div id="box-map" style={{ height: "250px", marginTop: "10px" }}>
          <MapEditForm
                id={`longdo-map${index}`}
                mapKey={mapKey}
                callback={initMap}
              />
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default EditVaccineForm;

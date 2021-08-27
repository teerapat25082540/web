import React, { useRef, useState } from "react";
import {
  Layout,
  Menu,
  Image,
  Button,
  Input,
  Form,
  InputNumber,
  Modal,
  Select,
} from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PlusOutlined,
  SearchOutlined,
  MonitorOutlined,
  ReloadOutlined,
  ExclamationCircleOutlined,
  FormOutlined,
  ProfileOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { visibleCollapse, setVisibleCollapse } from "../DataType";

import { FaMapMarkedAlt, FaListAlt, FaUser } from "react-icons/fa";
import "../styles/MainLayouts.css";
import { Content } from "antd/lib/layout/layout";
import VaccineIcon from "../images/vaccine-icon.png";
import { useHistory } from "react-router-dom";
import { MapForm, map, longdo } from "../components/MapAddForm";
import TextArea from "antd/lib/input/TextArea";
import axios from "axios";
import { TypeNewVaccine } from "../DataType";
import ListSearch from "../components/ListSearch";

const { Header, Sider } = Layout;
const { confirm } = Modal;

function MainLayouts({
  children,
  page = 1,
  showDrawer,
  clearRoute,
  loadingRoute,
  visibleRouteButton,
  visibleRouteClear,
  resetMarker,
}: any) {
  const [state, setState] = useState({
    collapsed: false,
  });
  const [modalAddData, setModalAddData] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [lat, setLat] = useState<number>(0);
  const [lon, setLon] = useState<number>(0);
  const [form] = Form.useForm();
  const { Option } = Select;

  const token = localStorage.getItem("accessToken");

  const addressRef = useRef<any>();
  const history = useHistory();
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";

  // initial map
  const initMap = () => {
    map.Layers.setBase(longdo.Layers.NORMAL);
    map.zoom(13);
  };

  // search address keyup
  const onKeyUpSeach = async (e: any) => {
    let res = await axios.get(
      `https://search.longdo.com/mapsearch/json/search?keyword=${e.target.value}&limit=100&key=${mapKey}`
    );
    setSuggestions(res.data.data);
  };

  const confirmSubmit = (values: any) => {
    confirm({
      title: "ยืนยันการเพิ่มข้อมูล",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      content: "คุณต้องการเพิ่มข้อมูลนี้ใช่หรือไม่ ?",
      onOk() {
        onFinish(values);
      },
      onCancel() {},
    });
  };

  // sunmit form success
  const onFinish = async (values: any) => {
    let user_id: any = localStorage.getItem("id");
    let email: any = localStorage.getItem("email");
    let tel: any = localStorage.getItem("tel");

    const newVaccine: TypeNewVaccine = {
      user_id: user_id,
      name: values.vaccine,
      amount: Number(values.amount),
      email: email,
      tel: tel,
      lat: lat,
      long: lon,
      description: values.description,
    };
    await axios.post(
      "http://localhost:4000/api/vaccine",
      JSON.stringify(newVaccine),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setModalAddData(false);
    resetMarker();
    form.resetFields();
    map.Overlays.clear();
  };

  // select item address
  const selectSearchItem = async (item: any) => {
    setLat(item.lat);
    setLon(item.lon);
    map.Overlays.clear();
    map.Overlays.add(new longdo.Marker({ lon: item.lon, lat: item.lat }));
    map.zoom(12);
    map.location(
      { lon: item.lon, lat: item.lat },
      {
        title: "คุณอยู่ที่นี่",
      }
    );
    addressRef.current.state.value = item.name;
    setSuggestions([]);
  };

  // const toggle = () => {
  //   setVisibleCollapse()
  //   //console.log(state);
  // };
  const toggle = () => {
    setState({ ...state, collapsed: !state.collapsed });
    setVisibleCollapse();
    //console.log(state);
  };

  const logOut = async () => {
    Modal.confirm({
      title: "ออกจากระบบ",
      icon: <ExclamationCircleOutlined />,
      content: "คุณต้องการออกจากระบบ?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: async () => {
        localStorage.clear();
        history.push("/");
      },
    });
  };

  const selectPage = (e: any) => {
    const key = e.key;
    switch (key) {
      case "1":
        history.push("/");
        break;
      case "2":
        history.push("/manage");
        break;
      case "3":
        history.push("/login");
        break;
      case "4":
        history.push("/register");
        break;
      case "5":
        history.push("/profile");
        break;
      default:
      //alert("break");
    }
  };

  return (
    <>
      <Layout>
        <Sider trigger={null} collapsible collapsed={visibleCollapse}>
          {visibleCollapse ? (
            <Image className="logo" preview={false} src={VaccineIcon} />
          ) : (
            <div>
              <h2 className="logo-text">Vaccine Map</h2>
            </div>
          )}
          <Menu
            onSelect={(e) => selectPage(e)}
            selectedKeys={page}
            theme="dark"
            defaultSelectedKeys={["1"]}
            mode="inline"
          >
            <Menu.Item key="1" icon={<FaMapMarkedAlt />}>
              จุดรับวัคซีน
            </Menu.Item>
            {token ? null : (
              <Menu.Item key="3" icon={<FaUser />}>
                เข้าสู่ระบบ
              </Menu.Item>
            )}
            {token ? null : (
              <Menu.Item key="4" icon={<FormOutlined />}>
                สร้างบัญชี
              </Menu.Item>
            )}
            {token ? (
              <Menu.Item key="5" icon={<ProfileOutlined />}>
                โปรไฟล์
              </Menu.Item>
            ) : null}
            {token ? (
              <Menu.Item key="2" icon={<FaListAlt />}>
                จัดการข้อมูลวัคซีน
              </Menu.Item>
            ) : null}
            {token ? (
              <Menu.Item
                key="logout"
                onClick={logOut}
                icon={<LogoutOutlined />}
              >
                ออกจากจะบบ
              </Menu.Item>
            ) : null}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }}>
            {React.createElement(
              visibleCollapse ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: toggle,
              }
            )}

            {page === "1" ? (
              <>
                {token ? (
                  <Button
                    className="add-button"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setModalAddData(true)}
                  >
                    เพิ่มข้อมูลวัคซีน
                  </Button>
                ) : null}
                {visibleRouteButton && (
                  <Button
                    style={{
                      width: 170,
                      marginLeft: 10,
                    }}
                    type="primary"
                    icon={<MonitorOutlined />}
                    onClick={() => showDrawer()}
                    loading={loadingRoute}
                  >
                    เลือกเส้นทาง
                  </Button>
                )}
                {visibleRouteClear && (
                  <Button
                    style={{ width: 170, marginLeft: 10 }}
                    type="primary"
                    //danger
                    icon={<ReloadOutlined />}
                    onClick={() => clearRoute()}
                    //loading={routeLoading}
                  >
                    ล้างเส้นทาง
                  </Button>
                )}
              </>
            ) : null}
          </Header>
          <Content className="site-layout-content">{children}</Content>
        </Layout>

        <Modal
          title="เพิ่มข้อมูลวัคซีน"
          centered
          visible={modalAddData}
          width={600}
          onCancel={() => {
            setModalAddData(false);
            form.resetFields();
          }}
          footer={[
            <Button
              key="back"
              onClick={() => {
                setModalAddData(false);
                form.resetFields();
              }}
            >
              Cancel
            </Button>,
            <Button key="submit" type="primary" htmlType="submit" form="myForm">
              Submit
            </Button>,
          ]}
        >
          <Form
            id="myForm"
            form={form}
            layout="vertical"
            name="nest-messages"
            onFinish={confirmSubmit}
          >
            <Form.Item style={{ marginBottom: 0 }}>
              <Form.Item
                name="vaccine"
                label="ชื่อวัคซีน"
                rules={[{ required: true, message: "กรุณากรอกชื่อวัคซีน" }]}
                style={{ display: "inline-block", width: "calc(50%)" }}
              >
                {/* <Input placeholder="ชื่อวัคซีน" /> */}
                <Select defaultValue="">
                  <Option value="">โปรดเลือก</Option>
                  <Option value="Pfizer">Pfizer</Option>
                  <Option value="Moderna">Moderna</Option>
                  <Option value="Johnson & Johnson">Johnson & Johnson</Option>
                  <Option value="Novavax">Novavax</Option>
                  <Option value="AstraZeneca">AstraZeneca</Option>
                  <Option value="Sputnik-V">Sputnik-V</Option>
                  <Option value="Sinovac">Sinovac</Option>
                  <Option value="Sinopharm">Sinopharm</Option>
                  <Option value="CanSino">CanSino</Option>
                  <Option value="Covishield">Covishield</Option>
                  <Option value="Covaxin">Covaxin</Option>
                </Select>
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
              name="description"
              label="รายละเอียด"
              rules={[{ required: true, message: "กรุณากรอกรายละเอียด" }]}
            >
              <TextArea placeholder="รายละเอียด" rows={4} />
            </Form.Item>
            <Form.Item
              name="search"
              label="พิกัดที่อยู่"
              rules={[{ required: true, message: "กรุณากรอกพิกัดที่อยู่" }]}
            >
              <div>
                <Input
                  prefix={<SearchOutlined />}
                  onKeyUp={(e) => onKeyUpSeach(e)}
                  placeholder="search address"
                  ref={addressRef}
                />
                <ListSearch selectItem={selectSearchItem} data={suggestions} />
              </div>
            </Form.Item>
            <div style={{ height: "250px", marginTop: 10 }}>
              <MapForm id="map-form" mapKey={mapKey} callback={initMap} />
            </div>
          </Form>
        </Modal>
      </Layout>
    </>
  );
}

export default MainLayouts;

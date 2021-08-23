import { CloseCircleOutlined } from "@ant-design/icons";
import { Modal, Drawer, Button, Result } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { VaccineMap, longdo, map } from "../components/VaccineMap";
import { TypeVaccine, getCurrentLocation } from "../DataType";
import MainLayouts from "../layouts/MainLayouts";

const HomePage = () => {
  // state
  const [country, setCountry] = useState<string | null>(null);
  // const [geocode, setGeocode] = useState<string | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);
  const [subdistrict, setSubdistrict] = useState<string | null>(null);
  const [postcode, setPostcode] = useState<string>("");
  // const [elevation, setElevation] = useState<number | null>(0);
  const [road, setRoad] = useState<String | null>(null);
  const [description, setDescription] = useState<string | null>();
  const [email, setEmail] = useState<string>("");
  const [vaccineName, setVaccineName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [tel, setTel] = useState<string>("");
  const [aoi, setAoi] = useState<string | null>(null);
  const [latDestination, setLatDestinnation] = useState<any>(null);
  const [lngDestination, setLngDestinnation] = useState<any>(null);
  const [visibleRouteButton, setVisibleRouteButton] = useState<any>(false);
  const [visibleRouteClear, setVisibleRouteClear] = useState<any>(false);

  // longdo key api
  const mapKey: string = "f065b431c7c8afab7264d32ca7a8a11e";

  // modal visible
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // drawer visible
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [inValidRoute, setInvalidRoute] = useState<boolean>(false);
  const [loadingRoute, setLoadingRoute] = useState<boolean>(false);

  // open modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // ok modal
  const handleOk = () => {
    setIsModalVisible(false);
    setLoading(false);
  };

  // close modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // show drawer
  const showDrawer = async () => {
    setLoadingRoute(true);
    let location: any = await getCurrentLocation();
    setIsDrawerVisible(true);
    if (latDestination != null) {
      setInvalidRoute(true);
      map.Route.placeholder(document.getElementById("manage-route"));
      map.Route.clear();
      map.Route.add(
        new longdo.Marker(
          { lon: location[1], lat: location[0] },
          {
            title: "Victory monument",
            detail: "I'm here",
          }
        )
      );
      map.Route.add({ lon: lngDestination, lat: latDestination });
      map.Route.search();
      setLoadingRoute(false);
    } else {
      setInvalidRoute(false);
      setLoadingRoute(false);
    }
  };

  const drawerCancel = () => {
    setIsDrawerVisible(false);
  };

  // initial map
  const initMap = async () => {
    map.Layers.setBase(longdo.Layers.NORMAL);
    map.zoom(12);
    setMarkerUserCurrentLocation();
    let res = await axios("http://localhost:4000/api/vaccine");
    setMarker(res.data);
  };

  const resetMarker = async () => {
    setMarkerUserCurrentLocation();
    let res = await axios("http://localhost:4000/api/vaccine");
    setMarker(res.data);
  };

  // initial user current location
  const setMarkerUserCurrentLocation = async () => {
    let userMarker: any = null;
    let location: any = await getCurrentLocation();
    let res = await axios(
      `https://api.longdo.com/map/services/address?lon=${location[1]}&lat=${location[0]}&key=${mapKey}`
    );
    // console.log(res.data);
    userMarker = new longdo.Marker(
      { lon: location[1], lat: location[0] },
      {
        title: "คุณอยู่ที่นี่",
        detail: `${res.data.aoi && res.data.aoi} ${
          res.data.road && res.data.road
        } ${res.data.district && res.data.district} ${
          res.data.subdistrict && res.data.subdistrict
        } ${res.data.province && res.data.province} ${
          res.data.country && res.data.country
        } ${res.data.country && res.data.country} ${
          res.data.postcode && res.data.postcode
        }`,
      }
    );
    map.Overlays.add(userMarker);

    map.location({ lon: location[1], lat: location[0] }, true);
  };

  // geocode fech address
  const mapLatLonToAddress = async (lat: number, lon: number) => {
    let res = await axios(
      `https://api.longdo.com/map/services/address?lon=${lon}&lat=${lat}&key=${mapKey}`
    );
    setCountry(res.data.country);
    setProvince(res.data.province);
    //(res.data.geocode);
    setDistrict(res.data.district);
    setSubdistrict(res.data.subdistrict);
    setPostcode(res.data.postcode);
    //setElevation(res.data.elevation);
    setRoad(res.data.road);
    setAoi(res.data.aoi);
  };

  // set marker vaccine
  const setMarker = (data: TypeVaccine[]) => {
    let vaccineList: any = [];
    data.forEach((item, index) => {
      vaccineList[index] = new longdo.Marker(
        { lon: item.long, lat: item.lat },
        {
          visibleRange: { min: 1, max: 30 },
          icon: {
            url: "https://map.longdo.com/mmmap/images/pin_mark.png",
            offset: { x: 12, y: 45 },
          },
        }
      );
      map.Overlays.add(vaccineList[index]);
      map.Event.bind("overlayClick", function (overlay: any) {
        if (overlay === vaccineList[index]) {
          setEmail(item.email);
          setVaccineName(item.name);
          setAmount(item.amount);
          setTel(item.tel);
          setLngDestinnation(item.long);
          setLatDestinnation(item.lat);
          setDescription(item.description);
          mapLatLonToAddress(item.lat, item.long);
          showModal();
        }
      });
    });
  };

  // route handler
  const routeHandler = async () => {
    setLoading(true);
    map.Route.clear();
    let location: any = await getCurrentLocation();
    let lat: number = location[0];
    let lng: number = location[1];
    let res = await axios(
      `https://api.longdo.com/map/services/address?lon=${lng}&lat=${lat}&key=${mapKey}`
    );
    map.Route.add(
      new longdo.Marker(
        { lon: lng, lat: lat },
        {
          title: "คุณอยู่ที่นี่",
          detail: `${res.data.aoi && res.data.aoi} ${
            res.data.road && res.data.road
          } ${res.data.district && res.data.district} ${
            res.data.subdistrict && res.data.subdistrict
          } ${res.data.province && res.data.province} ${
            res.data.country && res.data.country
          } ${res.data.country && res.data.country} ${
            res.data.postcode && res.data.postcode
          }`,
        }
      )
    );

    map.Route.add({ lon: lngDestination, lat: latDestination });
    map.Route.search();
    handleOk();
    setVisibleRouteButton(true);
    setVisibleRouteClear(true);
  };

  const clearRoute = () => {
    map.Route.clear();
    setLatDestinnation(null);
    setLngDestinnation(null);
    setVisibleRouteButton(false);
    setVisibleRouteClear(false);
  };

  return (
    <MainLayouts
      page="1"
      showDrawer={showDrawer}
      loadingRoute={loadingRoute}
      clearRoute={clearRoute}
      visibleRouteButton={visibleRouteButton}
      visibleRouteClear={visibleRouteClear}
      resetMarker={resetMarker}
    >
      <VaccineMap id="vaccine-map" mapKey={mapKey} callback={initMap} />
      <Modal
        visible={isModalVisible}
        title="ข้อมูลวัคซีน"
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="route"
            type="primary"
            loading={loading}
            onClick={routeHandler}
          >
            เส้นทาง
          </Button>,
        ]}
      >
        <h4 style={{ fontWeight: "bold" }}>{vaccineName}</h4>
        <p>จำนวน {amount} โดส</p>

        <h4 style={{ fontWeight: "bold" }}>รายละเอียด</h4>
        <p>{description}</p>

        <h4 style={{ fontWeight: "bold" }}>จุดฉีด</h4>
        <address>
          {aoi && (
            <span>
              {aoi} <br />
            </span>
          )}

          {road && (
            <span>
              ถนน {road} <br />
            </span>
          )}

          {subdistrict && (
            <span>
              แขวง/ตำบล {subdistrict} <br />
            </span>
          )}

          {district && (
            <span>
              อำเภอ/เขต {district} <br />
            </span>
          )}

          {province && (
            <span>
              จังหวัด {province} <br />
            </span>
          )}

          {postcode && (
            <span>
              จังหวัด {postcode} <br />
            </span>
          )}

          {country && (
            <span>
              {country} <br />
            </span>
          )}
        </address>

        <h4 style={{ fontWeight: "bold" }}>Contact</h4>
        <p>
          {email && (
            <span>
              อีเมล : {email} <br />
            </span>
          )}
          {tel && (
            <span>
              เบอร์ติดต่อ : {tel} <br />
            </span>
          )}
        </p>
      </Modal>
      <Drawer
        title="เลือกเส้นทาง"
        visible={isDrawerVisible}
        onClose={drawerCancel}
        width={530}
      >
        {inValidRoute ? (
          <div style={{ height: "100%" }} id="manage-route"></div>
        ) : (
          <Result
            icon={<CloseCircleOutlined />}
            title="ขออภัย ! ท่านยังไม่เลือกจุดรับวัคซีน"
          />
        )}
      </Drawer>
    </MainLayouts>
  );
};

export default HomePage;

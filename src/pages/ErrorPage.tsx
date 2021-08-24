import React from "react";
import { Result, Button } from "antd";
import { useHistory, useLocation } from "react-router-dom";

const Error = () => {
  const history = useHistory();
  const location = useLocation();

  return (
    <div>
      <Result
        status="404"
        title="404"
        subTitle={
          <p>
            ขออภัย ไม่พบหน้าที่คุณต้องการ
            <br />
            {`http://localhost:3000${location.pathname}`}
          </p>
        }
        extra={
          <Button
            onClick={() => {
              history.push("/");
            }}
          >
            กลับไปยังหน้าแรก คลิกที่นี่
          </Button>
        }
      />
    </div>
  );
};
export default Error;

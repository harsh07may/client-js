import React from "react";
import { useState } from "react";
import axios from "axios";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Input, Row, Col, Button, Upload, message } from "antd";
const { Dragger } = Upload;

//import Global vars
import { FILE_UPLOAD_SIZE_LIMIT } from "../../../GLOBAL_VARS";

import "./styles/MunicipalProperty.css";

const MunicipalProperty = () => {
  //States
  const [data, setData] = useState({
    title: "",
    ward: "",
    subdiv: "",
    file: null,
  });
  const [file, setFile] = useState(null);

  //functions
  const handleFileChange = (e) => {
    const dataObjFile = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(dataObjFile);

    if (dataObjFile.type === "application/pdf") {
      // console.log(dataObjFile);
      setData({ ...data, file: dataObjFile });

      //for preview button
      const files = e.target.files;
      files.length > 0 && setFile(URL.createObjectURL(files[0]));
    } else {
      e.target.value = "";
      setFile(null);
      message.warning("File is not a PDF", 1.5);
    }
  };

  //API Calls
  const onFinish = async (values) => {
    values = { ...values, file: data.file, type: "municipal_record" };

    await axios
      .post("http://localhost:5000/api/v1/digitization/upload", values, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        if (res.status == 200) {
          insertData(values, res.data.fileLink);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally();
  };

  const insertData = async (formValues, fileLink) => {
    // console.log({ formValues: formValues });
    let jsonObject = {
      WardNo: formValues.wardNo,
      SubDivNo: formValues.subDivNo,
      Title: formValues.title,
      FileLink: fileLink,
    };

    await axios
      .post("http://localhost:5000/api/v1/digitization/insert", jsonObject)
      .then((res) => {
        if (res.status == 200) {
          // console.log({ jsonobj: jsonObject });
          message.success("File Uploaded Successfully", 1.5);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <h1>MUNICIPAL PROPERTY RECORDS</h1>
      <Form
        style={{ marginTop: "10px" }}
        onFinish={onFinish}
        onFinishFailed={() => console.log("failed")}
      >
        <Row gutter={30}>
          <Col span={6}>
            <Form.Item name="wardNo" required>
              <Input
                required
                size="large"
                placeholder="Ward No."
                className="form-input-styles"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="subDivNo" required>
              <Input
                required
                size="large"
                placeholder="Sub Division No."
                className="form-input-styles"
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="title" required wrapperCol={{ span: 16 }}>
          <Input
            required
            status=""
            size="large"
            placeholder="Title"
            className="form-input-styles"
          />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            span: 12,
            offset: 6,
          }}
        >
          <Form.Item required>
            {/* <Button icon={<UploadOutlined />}>Click to Upload</Button> */}
            <input
              type="file"
              accept="application/pdf, .pdf"
              onChange={handleFileChange}
              required
            />
          </Form.Item>
          {file ? (
            <>
              <Button
                type="primary"
                onClick={() => {
                  window.open(file);
                }}
              >
                Preview File
              </Button>
            </>
          ) : (
            <div></div>
          )}

          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default MunicipalProperty;

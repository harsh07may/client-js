import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Row, Col, Button, message } from "antd";

const HouseTax = () => {
  //States
  const [form] = Form.useForm();
  const [data, setData] = useState({
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
    values = { ...values, file: data.file, type: "house_tax_record" };
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
      HouseNo: formValues.houseNo,
      Name: formValues.name,
      FileLink: fileLink,
    };

    await axios
      .post(
        "http://localhost:5000/api/v1/digitization/insert?type=house_tax_record",
        jsonObject
      )
      .then((res) => {
        if (res.status == 200) {
          // console.log({ jsonobj: jsonObject });
          message.success("File Uploaded Successfully", 1.5);
          form.resetFields();
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <h1>HOUSE TAX RECORDS</h1>
      <Form
        style={{ marginTop: "10px" }}
        onFinish={onFinish}
        onFinishFailed={() => console.log("failed")}
        form={form}
      >
        <Row gutter={30}>
          <Col span={6}>
            <Form.Item name="wardNo" required>
              <Input
                autocomplete="off"
                required
                size="large"
                placeholder="Ward No."
                className="form-input-styles"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="houseNo" required>
              <Input
                autocomplete="off"
                required
                size="large"
                placeholder="House No."
                className="form-input-styles"
              />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row> */}
        {/* <Col span={18}> */}
        <Form.Item name="name" required wrapperCol={{ span: 16 }}>
          <Input
            autocomplete="off"
            required
            status=""
            size="large"
            placeholder="Name"
            className="form-input-styles"
          />
        </Form.Item>
        {/* </Col> */}
        {/* </Row> */}
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
              style={{ maxWidth: "230px" }}
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
            <></>
          )}

          <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default HouseTax;

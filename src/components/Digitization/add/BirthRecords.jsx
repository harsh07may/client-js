import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Row, Col, Button, message } from "antd";
import { useAuth } from "../../../utils/auth";
import { formInputStyles } from "./styles/AddForm.module.css";

//! test imports (start)
import { UploadOutlined } from "@ant-design/icons";
import {
  // Button,
  // Form,
  // message,
  Upload,
} from "antd";
//! test imports (end)

const BirthRecords = () => {
  //! test states (start)

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  //! test states (end)

  //* Old States
  const [form] = Form.useForm();
  const [data, setData] = useState({
    file: null,
  });
  const [pdfFile, setPdfFile] = useState(null);
  //* Old States

  //! test functions (start)
  function onRemove(file) {
    setFileList([]);
    console.log("on remove");
    //* old code
    setPdfFile(null);
    //* old code
  }

  //* beforeUpload() is basically handleFileChange()
  function beforeUpload(file) {
    console.log(file);
    setFileList([file]);
    // console.log(fileList);

    //* old code from handleFileChange
    const dataObjFile = file;
    const reader = new FileReader();
    reader.readAsText(dataObjFile);

    if (dataObjFile.type === "application/pdf") {
      console.log(dataObjFile);
      setData({ ...data, file: dataObjFile });

      //for preview button

      //const files = e.target.files; // check file array AKA FileList
      // fileList.length > 0 &&
      setPdfFile(URL.createObjectURL(file));
    } else {
      setFileList([]);
      setPdfFile(null);
      message.warning("File is not a PDF", 1.5);
    }
    return false;
  }
  //! test funcs (end)

  //functions

  const auth = useAuth();
  //API Calls
  const onFinish = async (values) => {
    values = { ...values, file: data.file, type: "birth_record" };

    //! test area
    setUploading(true);
    //! test area

    console.log(values);
    await axios
      .post("http://localhost:5000/api/v1/digitization/upload", values, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.user.accesstoken}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          message.success("File Uploaded Successfully", 1.5);
          form.resetFields();
          setUploading(false);
        }
      })
      .finally();
  };

  return (
    <>
      <br />
      <h3 style={{ textAlign: "center" }}>BIRTH RECORDS</h3>
      <br />
      <Row align="middle" justify="center">
        <Col xs={22} sm={20} md={16} lg={14} xl={10}>
          <Form
            style={{ marginTop: "10px", overflow: "hidden" }}
            onFinish={onFinish}
            onFinishFailed={() => console.log("failed")}
            form={form}
          >
            <Row gutter={24}>
              <Col xs={24} sm={12}>
                <Form.Item name="month" required>
                  <Input
                    autoComplete="off"
                    required
                    size="large"
                    placeholder="Month"
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item name="year" required>
                  <Input
                    autoComplete="off"
                    required
                    size="large"
                    placeholder="Year"
                    className={formInputStyles}
                  />
                </Form.Item>
              </Col>
            </Row>
            {/* <Form.Item name="title" required wrapperCol={{ span: 16 }}>
          <Input
            required
            status=""
            size="large"
            placeholder="Title"
            className={formInputStyles}
          />
        </Form.Item> */}
            <Form.Item wrapperCol={{ xs: { span: 20 }, sm: { span: 14 } }}>
              {/* <Form.Item required>
            <input
              autoComplete="off"
              type="file"
              accept="application/pdf, .pdf"
              onChange={handleFileChange}
              required
              style={{ maxWidth: "230px" }}
            />
          </Form.Item> */}
              {/* //! test upload (start) */}
              <Form.Item required name="upload" valuePropName="fileList">
                <>
                  <Upload
                    accept="application/pdf, .pdf"
                    maxCount={1}
                    onRemove={onRemove}
                    beforeUpload={beforeUpload}
                  >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                  </Upload>
                </>
              </Form.Item>
              {/* //! test upload (end) */}
              {pdfFile ? (
                <>
                  <Button
                    type="primary"
                    onClick={() => {
                      window.open(pdfFile);
                    }}
                  >
                    Preview File
                  </Button>
                </>
              ) : (
                <></>
              )}
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginLeft: 10 }}
                disabled={fileList.length === 0}
                loading={uploading}
              >
                {uploading ? "Uploading" : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default BirthRecords;

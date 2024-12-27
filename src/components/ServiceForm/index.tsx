import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Row, Col, Checkbox, Switch, message } from 'antd';
import './ServiceForm.css';

type ServiceFormProps = {
  myForm: any,
  handleSendStatus: (status: boolean) => void
}

const ServiceForm = (props: ServiceFormProps) => {
  const [isDisable, setIsDisable] = useState(false);
  const [form] = Form.useForm();
  const token = localStorage.getItem('token');
  const serviceCode = Object.keys(props.myForm).length === 0 ? '' : props.myForm.serviceCode;

  const initialValues = Object.keys(props.myForm).length === 0 ?
    {
      serviceCode: '',
      serviceName: '',
      description: '',
      isInOperation: false,
    }
    : {
      serviceCode: props.myForm.serviceCode,
      serviceName: props.myForm.serviceName,
      description: props.myForm.description,
      isInOperation: props.myForm.isInOperation == 'Active' ? true : false,
    }

  useEffect(() => {
    form.setFieldsValue(Object.keys(props.myForm).length === 0 ? {
      serviceCode: '',
      serviceName: '',
      description: '',
      isInOperation: false,
    }
      : {
        serviceCode: props.myForm.serviceCode,
        serviceName: props.myForm.serviceName,
        description: props.myForm.description,
        isInOperation: props.myForm.isInOperation == 'Active' ? true : false,
      })
    if (props.myForm.serviceCode) {
      setIsDisable(true)
    }else{
      setIsDisable(false)
    }
  }, [props.myForm, form])

  const handleFinish = async (values: any) => {
    if (props.myForm.serviceCode == null) {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + 'api/Service/', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            serviceCode: values.serviceCode,
            serviceName: values.serviceName,
            description: values.description,
            isInOperation: values.isInOperation,
          })
        });
        if (response.ok) {
          const data = await response.json();
          message.success('Thêm mới thành công');
          // message.success(data.message);
          console.log(data.message);
          form.setFieldsValue({
            serviceCode: '',
            serviceName: '',
            description: '',
            isInOperation: false,
          })
          props.handleSendStatus(false);
          setIsDisable(false)
        } else {
          message.error('Bạn không được cập nhật thông tin này');
          form.setFieldsValue({
            serviceCode: '',
            serviceName: '',
            description: '',
            isInOperation: false,
          })
          props.handleSendStatus(false)
          setIsDisable(false)
        }
      } catch (error) {
        message.error('An error occurred while submitting the form.');
      }
    }
    else {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + 'api/Service/' + serviceCode, {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceCode: values.serviceCode,
            serviceName: values.serviceName,
            description: values.description,
            isInOperation: values.isInOperation,
          })
        });
        if (response.ok) {
          message.success('Form submitted successfully!');
          form.setFieldsValue({
            serviceCode: '',
            serviceName: '',
            description: '',
            isInOperation: false,
          })
          props.handleSendStatus(false);
          setIsDisable(false)
        } else {
          message.error('Bạn không được cập nhật thông tin này');
          form.setFieldsValue({
            serviceCode: '',
            serviceName: '',
            description: '',
            isInOperation: false,
          })
          props.handleSendStatus(false);
          setIsDisable(false)
        }
      } catch (error) {
        message.error('An error occurred while submitting the form.');
      }
    }
  };

  return (
    <div className="service-form-container">
      <h2 className="service-form-title">Quản lý dịch vụ</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="service-form"
        initialValues={initialValues}
      >
        <Row gutter={24}>
          {/* Thông tin dịch vụ */}
          <Col xs={24} lg={12}>
            <Form.Item
              name="serviceCode"
              label="Mã dịch vụ"
              rules={[{ required: true, message: 'Mã dịch vụ là bắt buộc' }]}
            >
              <Input placeholder="Nhập mã dịch vụ" disabled={isDisable} />
            </Form.Item>
            <Form.Item
              name="serviceName"
              label="Tên dịch vụ"
              rules={[{ required: true, message: 'Tên dịch vụ là bắt buộc' }]}
            >
              <Input placeholder="Nhập tên dịch vụ" />
            </Form.Item>
            <Form.Item label="Đang hoạt động" name="isInOperation" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea placeholder="Mô tả dịch vụ" rows={5} />
            </Form.Item>

          </Col>
        </Row>
        {/* Quy tắc cấp số */}
        {/* <div className="rules-section">
          <h3>Quy tắc cấp số</h3>
          <Row gutter={24}>
            <Col xs={24} lg={12}>
              <Form.Item name="autoIncrement">
                <Checkbox>Tăng tự động từ</Checkbox>
              </Form.Item>
              <div className="rule-input-group">
                <Input placeholder="0001" style={{ width: '40%' }} />
                <span className="to-text">đến</span>
                <Input placeholder="9999" style={{ width: '40%' }} />
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="prefix">
                <Checkbox>Prefix</Checkbox>
              </Form.Item>
              <Input placeholder="0001" style={{ width: '100%' }} />
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="surfix">
                <Checkbox>Surfix</Checkbox>
              </Form.Item>
              <Input placeholder="0001" style={{ width: '100%' }} />
            </Col>
            <Col xs={24} lg={12}>
              <Form.Item name="resetDaily">
                <Checkbox>Reset mỗi ngày</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </div> */}
        {/* Nút hành động */}
        <Form.Item>
          <div className="form-actions">
            <Button htmlType="button">Hủy bỏ</Button>
            <Button type="primary" htmlType="submit">
              Lưu thông tin
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ServiceForm;

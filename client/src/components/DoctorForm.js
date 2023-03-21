import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import FormItem from "antd/es/form/FormItem";
import moment from "moment";

const DoctorForm = ({ onFinish, initialValues }) => {

   
  //console.log(moment(initialValues.timings[0], 'HH:mm')); 
  
  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        ...initialValues,
        ...(initialValues && {
          timings: [
            moment(initialValues?.timings[0], 'HH:mm'),
            moment(initialValues?.timings[1], 'HH:mm'),
          ],
        })
      }}
    >
      <h1 className="card-title mt-3">Personel Information</h1>
      <Row gutter={20}>
        <Col span={8} xs={24} lg={8}>
          <FormItem
            label="First Name"
            name="firstName"
            rules={[{ required: true }]}
          >
            <Input placeholder="First Name" />
          </FormItem>
        </Col>

        <Col span={8} xs={24} lg={8}>
          <FormItem
            label="Last Name"
            name="lastName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Last Name" />
          </FormItem>
        </Col>

        <Col span={8} xs={24} lg={8}>
          <FormItem
            label="Phone Number"
            name="phoneNumber"
            rules={[{ required: true }]}
          >
            <Input placeholder="Phone Number" />
          </FormItem>
        </Col>

        <Col span={8} xs={24} lg={8}>
          <FormItem label="Website" name="website" rules={[{ required: true }]}>
            <Input placeholder="Website" />
          </FormItem>
        </Col>

        <Col span={8} xs={24} lg={8}>
          <FormItem label="Address" name="address" rules={[{ required: true }]}>
            <Input placeholder="Address" />
          </FormItem>
        </Col>
      </Row>

      <hr />
      <h1 className="card-title mt-3">Professional Information</h1>

      <Row gutter={20}>
        <Col span={8} xs={24} lg={8}>
          <FormItem
            label="Specialization"
            name="specialization"
            rules={[{ required: true }]}
          >
            <Input placeholder="Specialization" />
          </FormItem>
        </Col>

        <Col span={8} xs={24} lg={8}>
          <FormItem
            label="Experience"
            name="experience"
            rules={[{ required: true }]}
          >
            <Input placeholder="Experience" type="number" />
          </FormItem>
        </Col>

        <Col span={8} xs={24} lg={8}>
          <FormItem
            label="Fee Per Cunsultation"
            name="feePerCunsultation"
            rules={[{ required: true }]}
          >
            <Input placeholder="Fee Per Cunsultation" type="number" />
          </FormItem>
        </Col>

        <Col span={8} xs={24} lg={8}>
          <FormItem label="Timings" name="timings" rules={[{ required: true }]}>
            <TimePicker.RangePicker format='HH:mm' />
          </FormItem>
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">
          SUBMIT
        </Button>
      </div>
    </Form>
  );
};

export default DoctorForm;

import { Button, Form, Input, InputNumber, Select, Skeleton } from "antd";
import { useEffect } from "react";
import { useAddService } from "@/src/services/addServices";
import { useRouter } from "next/router";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

export default function SchoolAdd() {
  const [form] = Form.useForm();
  const { query } = useRouter();

  let { id } = query;
  id = typeof id === "string" ? id : "";
  const isAddSchoolPage = id.includes("add") || id === "";
  const schoolAddService = useAddService("school", "school", "schools", id);

  //Update
  const schoolQuery = schoolAddService.useDataDetailQuery(isAddSchoolPage);

  useEffect(() => {
    if (schoolQuery.isSuccess || schoolQuery.data) {
      form.setFieldsValue(schoolQuery.data);
    }
  }, [schoolQuery.data, schoolQuery.isSuccess]);

  const updateSchoolMutation = schoolAddService.useUpdateDataMutation(
    form,
    id,
    "/manage/school"
  );

  // Add
  const addSchoolMutation = schoolAddService.useAddDataMutation(form);

  const onFinish = () => {
    if (isAddSchoolPage) {
      addSchoolMutation.mutate();
    } else {
      updateSchoolMutation.mutate();
    }
  };

  return (
    <div>
      <div
        style={{
          width: "100%",
          textAlign: "center",
          color: "black",
          marginBottom: "10px",
        }}
      >
        <h2>{isAddSchoolPage ? "Add School" : "Edit School"}</h2>
      </div>
      {!isAddSchoolPage && schoolQuery.isLoading ? (
        <Skeleton active />
      ) : (
        <Form
          {...formItemLayout}
          variant="filled"
          style={{ maxWidth: 800, margin: "0 auto", marginTop: "10px" }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="Tên trường"
            name="schoolName"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Không để trống" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Không để trống" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Không để trống" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="hotline"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Không để trống" },
              {
                pattern: /^(\+84|0[3|5|7|8|9])+([0-9]{7,13})\b/,
                message: "Số điện thoại không đúng định dạng",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Năm thành lập"
            name="dateEstablished"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Không để trống" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Level"
            name="typeOfEducation"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Không để trống" },
            ]}
          >
            <Select>
              <Select.Option value={1}>Tiểu học</Select.Option>
              <Select.Option value={2}>Trung học</Select.Option>
              <Select.Option value={3}>Trung học phổ thông</Select.Option>
              <Select.Option value={4}>Đại học</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Giới thiệu" name="description">
            <Input.TextArea />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                isAddSchoolPage
                  ? addSchoolMutation.isPending
                  : updateSchoolMutation.isPending
              }
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

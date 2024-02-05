import { Button, Form, Input, InputNumber, Select, Skeleton } from "antd";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAddService } from "@/src/services/addServices";

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

export default function SubjectAdd() {
  const [form] = Form.useForm();
  const { query } = useRouter();

  let { id } = query;
  id = typeof id === "string" ? id : "";
  const isAddSubjectPage = id.includes("add") || id === "";
  const subjectAddService = useAddService("subject", "subject", "subjects", id);

  //Update
  const subjectQuery = subjectAddService.useDataDetailQuery(isAddSubjectPage);

  useEffect(() => {
    if (subjectQuery.isSuccess || subjectQuery.data) {
      form.setFieldsValue(subjectQuery.data);
    }
  }, [subjectQuery.data, subjectQuery.isSuccess]);

  const updateSubjectMutation = subjectAddService.useUpdateDataMutation(
    form,
    id,
    "/manage/subject"
  );

  // Add
  const addSubjectMutation = subjectAddService.useAddDataMutation(form);

  const onFinish = () => {
    if (isAddSubjectPage) {
      addSubjectMutation.mutate();
    } else {
      updateSubjectMutation.mutate();
    }
  };

  return (
    <div>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2>{isAddSubjectPage ? "Add Subject" : "Edit Subject"}</h2>
      </div>
      {!isAddSubjectPage && subjectQuery.isLoading ? (
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
            label="Name Subject"
            name="subjectName"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Credit Hours"
            name="creditHour"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Level"
            name="level"
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

          <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                isAddSubjectPage
                  ? addSubjectMutation.isPending
                  : updateSubjectMutation.isPending
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

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Skeleton,
} from "antd";
import { useEffect } from "react";
import moment from "moment";
import { useAddService } from "@/src/services/addServices";
import { useManageService } from "@/src/services/manageServices";
import { SchoolType } from "@/src/types/school.type";
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

export default function TeacherAdd() {
  const [form] = Form.useForm();

  const { query } = useRouter();
  let { id } = query;
  id = typeof id === "string" ? id : "";
  const isAddTeacherPage = id.includes("add") || id === "";
  const teacherAddService = useAddService("teacher", "teacher", "teachers", id);

  // Update
  const teacherQuery = teacherAddService.useDataDetailQuery(isAddTeacherPage);

  useEffect(() => {
    if (teacherQuery.isSuccess || teacherQuery.data) {
      form.setFieldsValue({
        ...teacherQuery.data,
        dateOfBirth: moment(teacherQuery.data?.dateOfBirth),
        schoolId: teacherQuery.data?.school?.id
      });
    }
  }, [teacherQuery.data, teacherQuery.isSuccess]);

  const updateTeacherMutation = teacherAddService.useUpdateDataMutation(
    form,
    id,
    "/manage/teacher"
  );

  // Add
  const addTeacherMutation = teacherAddService.useAddDataMutation(form);

  const onFinish = () => {
    if (isAddTeacherPage) {
      addTeacherMutation.mutate();
    } else {
      updateTeacherMutation.mutate();
    }
  };

  const schoolsQuery = useManageService(
    "school",
    "school-select",
    1,
    1000
  ).useDataQuery();

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <div>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2>{isAddTeacherPage ? "Add Teacher" : "Edit Teacher"}</h2>
      </div>
      {!isAddTeacherPage && teacherQuery.isLoading ? (
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
            label="First Name"
            name="firstName"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
              { type: "email", message: "Invalid email address" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
              {
                pattern: /^(\+84|0[3|5|7|8|9])+([0-9]{7,13})\b/,
                message: "Invalid phone number format",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Gender"
            name="gender"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Select>
              <Select.Option value="male">Male</Select.Option>
              <Select.Option value="female">Female</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Date of birth"
            name="dateOfBirth"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Start year of teaching"
            name="yearStartTeaching"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="School"
            name="schoolId"
            rules={[
              {
                required: true,
                pattern: /^\S.*$/,
                message: "Không để trống",
              },
            ]}
          >
            {!schoolsQuery.isLoading && (
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%", marginBottom: "10px" }}
                filterOption={filterOption}
                options={schoolsQuery.data?.data.map(
                  (children: SchoolType) => ({
                    value: children.id,
                    label: children.schoolName,
                  })
                )}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Status"
            name="teachingStatus"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Select>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">InActive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={
                isAddTeacherPage
                  ? addTeacherMutation.isPending
                  : updateTeacherMutation.isPending
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

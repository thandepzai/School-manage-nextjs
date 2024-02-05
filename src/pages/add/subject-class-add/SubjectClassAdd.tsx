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
import { SubjectType } from "@/src/types/subject.type";
import { TeacherType } from "@/src/types/teacher.type";
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

export default function SubjectClassAdd() {
  const [form] = Form.useForm();
  const { query } = useRouter();

  let { id } = query;
  id = typeof id === "string" ? id : "";
  const isAddSubjectClassPage = id.includes("add") || id === "";

  const subjectClassAddService = useAddService(
    "subjectclass",
    "subjectClass",
    "subjectsClass",
    id
  );

  // Update
  const subjectClassQuery = subjectClassAddService.useDataDetailQuery(
    isAddSubjectClassPage
  );

  useEffect(() => {
    if (subjectClassQuery.isSuccess || subjectClassQuery.data) {
      form.setFieldsValue({
        ...subjectClassQuery.data,
        startAt: moment(subjectClassQuery.data?.startAt),
        endAt: moment(subjectClassQuery.data?.endAt),
        subjectId: subjectClassQuery.data?.subject.id,
        teacherId: subjectClassQuery.data?.teacher.id,
      });
    }
  }, [subjectClassQuery.data, subjectClassQuery.isSuccess]);

  const updateSubjectClassMutation =
    subjectClassAddService.useUpdateDataMutation(
      form,
      id,
      "/manage/subject-class"
    );

  // Add
  const addSubjectClassMutation =
    subjectClassAddService.useAddDataMutation(form);

  const onFinish = () => {
    if (isAddSubjectClassPage) {
      addSubjectClassMutation.mutate();
    } else {
      updateSubjectClassMutation.mutate();
    }
  };

  const teachersQuery = useManageService(
    "teacher",
    "teacher-select",
    1,
    1000
  ).useDataQuery();
  const subjectsQuery = useManageService(
    "subject",
    "subject-select",
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
        <h2>
          {isAddSubjectClassPage ? "Add SubjectClass" : "Edit SubjectClass"}
        </h2>
      </div>
      {!isAddSubjectClassPage && subjectClassQuery.isLoading ? (
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
            label="Choose Subject"
            name="subjectId"
            rules={[
              {
                required: true,
                pattern: /^\S.*$/,
                message: "Không để trống",
              },
            ]}
          >
            {!subjectsQuery.isLoading && (
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%" }}
                filterOption={filterOption}
                options={subjectsQuery.data?.data.map(
                  (children: SubjectType) => ({
                    value: children.id,
                    label: children.subjectName,
                  })
                )}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Choose Teacher"
            name="teacherId"
            rules={[
              {
                required: true,
                pattern: /^\S.*$/,
                message: "Không để trống",
              },
            ]}
          >
            {!subjectsQuery.isLoading && (
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%" }}
                filterOption={filterOption}
                options={teachersQuery.data?.data.map(
                  (children: TeacherType) => ({
                    value: children.id,
                    label: `${children.firstName} ${children.lastName}`,
                  })
                )}
              />
            )}
          </Form.Item>

          <Form.Item
            label="Max Quantity"
            name="maxQuantity"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Min Quantity"
            name="minQuantity"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Start Time"
            name="startAt"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="End Time"
            name="endAt"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Class Room"
            name="classRoom"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Academic Year"
            name="academicYear"
            rules={[
              { required: true, pattern: /^\S.*$/, message: "Required field" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="classStatus"
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
                isAddSubjectClassPage
                  ? addSubjectClassMutation.isPending
                  : updateSubjectClassMutation.isPending
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

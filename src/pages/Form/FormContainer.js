import React from 'react';
import { Form, Input } from 'antd';

function FormContainer(props) {
  console.log('props', props);
  const { form: { getFieldValue, getFieldDecorator, getFieldError } } = props; 
  return (
    <div className="form-container">
      <Form>
        <Form.Item label="名称">
          <Input placeholder="请输入名称" />
        </Form.Item>
      </Form>
    </div>
  )
}

// export default FormContainer;
export default Form.create({})(FormContainer); // Form.create()方法已在antd4.x中移除
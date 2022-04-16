import React, { useState, useEffect, useCallback } from 'react';
import {
  Select, Input, Icon, Modal, Button, Form, Row, Col, Tree, DatePicker, Checkbox
} from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import classes from './index.less';

const { Option } = Select;
const { Search } = Input;
const FormItem = Form.Item;


function AddAuth(props) {
  const {
    addModalVisible, setModalVisible, form: { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsValue }
  } = props;

  const [authAttrList, setAuthAttrList] = useState([]);
  const [attrList, setAttrList] = useState([]);
  const [usable, setUsable] = useState({});
  const initAttr = {
    id: 0,
    key: 10000000001,
    config: {},
    default_content: '',
    name: '',
    params: '',
    type: 'default'
  };

  function getAuthList() {
    const authList = [
      {
        "id": 7,
        "name": "1234",
        "params": "birthdaya",
        "type": "datetime",
        "default_content": "",
        "config": {},
        "create_time": "2022-03-17T12:53:17.476447+08:00"
      },
      {
        "id": 6,
        "name": "公司",
        "params": "idcard",
        "type": "string",
        "default_content": "123",
        "config": {},
        "create_time": "2022-03-09T17:05:08.227708+08:00"
      },
      {
        "id": 5,
        "name": "年龄",
        "params": "age",
        "type": "int",
        "default_content": "",
        "config": {
          "max_number": 100,
          "min_number": 1
        },
        "create_time": "2022-03-09T17:04:42.821278+08:00"
      },
      {
        "id": 4,
        "name": "生日",
        "params": "birthday",
        "type": "datetime",
        "default_content": "2022-03-08T01:04:23.904000+08:00",
        "config": {},
        "create_time": "2022-03-09T17:04:27.042088+08:00"
      },
      {
        "id": 2,
        "name": "性别",
        "params": "sex",
        "type": "select",
        "default_content": "01",
        "config": {
          "01": "男",
          "02": "女"
        },
        "create_time": "2022-03-03T10:26:25.454131+08:00"
      }
    ]
    setAuthAttrList(authList);
    setAttrList([initAttr]);
    const obj = {};
    authList.forEach((item) => {
      obj[item.params] = false;
    });
    setUsable(obj);
  }

  useEffect(() => {
    getAuthList();
  }, []);

  const authAttrParamNames = authAttrList.length > 0 ? authAttrList.map(item => ({
    name: item.name,
    id: item.id,
    params: item.params,
  })) : [];

  const [key, setKey] = useState(getFieldValue('attrlist') ? getFieldValue('attrlist') : [initAttr]);
  let array = [];
  getFieldDecorator('attrlist');
  if (getFieldValue('attrlist')) {
    for (let i = 0; i < getFieldValue('attrlist').length; i += 1) {
      array.push(getFieldValue('attrlist')[i]);
    }
  } else {
    array = [initAttr];
  }
  getFieldDecorator('attrArray', { initialValue: array });

  const handleSelectChange = (params, key) => {
    const temp = authAttrList.find(item => item.params === params);
    let cloneAttrList = cloneDeep(getFieldValue('attrArray'));
    const usableClone = cloneDeep(usable);
    Object.keys(usableClone).forEach((item) => {
      usableClone[item] = false;
    });
    if (cloneAttrList && cloneAttrList.length > 0) {
      cloneAttrList = cloneAttrList.map((item, index) => {
        if (index === key) {
          item.type = temp.type;
          item.params = temp.params;
          item.id = temp.id;
          item.config = temp.config;
          item.name = temp.name;
        }
        usableClone[item.params] = true;
        return item;
      });
    }
    setFieldsValue({
      attrlist: cloneAttrList,
      attrArray: cloneAttrList
    });
    setUsable(usableClone);
  };

  const delIcon = index => {
    return (
    <div className={classes.deleteicon}>
      <Icon
        type="close"
        style={{ fontSize: '12px', color: '#00000040', cursor: 'pointer' }}
        onClick={() => {
          const usableClone = cloneDeep(usable);
          Object.keys(usableClone).forEach((key) => {
            usableClone[key] = false;
          });
          const attrArray = getFieldValue('attrArray');
          if (attrArray.length === 1) {
            return;
          }
          const data = getFieldsValue();
          Object.keys(data).forEach((item) => {
            if (item.split('_') && item.split('_')[0] === index.toString()) {
              setFieldsValue({
                [item]: '',
              });
            }
          });
          setFieldsValue({
            attrArray: attrArray.filter((item, i) => i !== index),
          });
          getFieldValue('attrArray').forEach((item) => {
            usableClone[item.params] = true;
          });
          setUsable(usableClone);
        }}
      />
    </div>
  );
}

  const authAttrItem = (item, index) => {
    switch (item.type) {
      case 'int':
        return (
          <div style={{ display: 'inline-block' }}>
            <span style={{ margin: '0 5px 0 -11px' }}>=</span>
            <FormItem>
              {getFieldDecorator(`${item.id}_@value_@${item.key}`, { initialValue: '' })(
                <Input style={{ width: '150px' }} placeholder={`请输入${item.name}`} />
              )}
            </FormItem>
            {delIcon(index)}
          </div>
        );
      case 'select':
        return (
          <div style={{ display: 'inline-block' }}>
            <span style={{ margin: '0 5px 0 -11px' }}>=</span>
            <FormItem>
              {getFieldDecorator(`${item.id}_@value_@${item.key}`, { initialValue: [] })(
                <Select placeholder={`请选择${item.name}`} style={{ width: 150 }}>
                  {Object.keys(item.config).map(key => <Option key={key}>{item.config[key]}</Option>)}
                </Select>
              )}
            </FormItem>
            {delIcon(index)}
          </div>
        );
      case 'datetime':
        return (
          <div style={{ display: 'inline-block' }}>
            <span style={{ margin: '0 5px 0 -11px' }}>=</span>
            <FormItem>
              {getFieldDecorator(`${item.id}_@value_@${item.key}`, { initialValue: moment(new Date(), 'YYYY-MM-DD') })(
                <DatePicker style={{ minWidth: '150px', width: '150px' }} showTime format="YYYY-MM-DD" placeholder={`请选择${item.name}`} allowClear={false} />
              )}
            </FormItem>
            {delIcon(index)}
          </div>
        );
      default:
        return (
          <div style={{ display: 'inline-block' }}>
            <span style={{ margin: '0 5px 0 -11px' }}>=</span>
            <FormItem>
              {getFieldDecorator(`${item.id}_@value_@${item.key}`, { initialValue: '' })(
                <Input style={{ width: '150px' }} placeholder={`请输入${item.name}`} />
              )}
            </FormItem>
            {delIcon(index)}
          </div>
        );
    }
  };

  const addAuthAttr = () => {
    const curKeys = cloneDeep(key);
    curKeys[curKeys.length - 1].key = Number(curKeys[curKeys.length - 1].key) + 1;
    const curAttrArray = getFieldValue('attrArray');
    const nextkeys = curAttrArray.concat(curKeys);
    setKey(curKeys);
    setFieldsValue({
      attrlist: nextkeys,
      attrArray: nextkeys
    })
  };
  const onSubmit = () => {
    const appParams = [];
    const resultEntries = Object.entries(getFieldsValue());
    console.log('resultEntries', resultEntries);
    let results = [];
    resultEntries.forEach((item) => {
      const splitItem = item[0].split('_@');
      if (isNaN(splitItem[0])) {
        results = item[1];
      }
    });
    let maxNum = results.sort((a, b) => b.id - a.id)[0].id;
    const obj = {};
    for (let i = 0; i <= maxNum; i += 1) {
      obj[i] = [];
    }
    resultEntries.forEach((item) => {
      const splitItem = item[0].split('_@');
      if (!isNaN(splitItem[0])) {
        const index = splitItem[0];
        const key = splitItem[1];
        const value = item[1];
        if (key === 'key') {
          obj[Number(index)].unshift(value);
        } else {
          obj[Number(index)].push(value);
        }
      }
    });
    const values = Object.values(obj).filter(item => item.length > 0);
    const params = values.map(item => item[0]);
    const attrParams = [];
    results.forEach(item => {
      const tempItem = item;
      const index = params.findIndex(param => param === item.params);
      if (index !== -1) {
        const { type } = item;
        const value = values[index][1];
        if (type === 'datetime') {
          if (value !== undefined) {
            tempItem.default_content = moment(value).format('YYYY-MM-DD');
          } else {
            tempItem.default_content = undefined;
          }
        } else {
          tempItem.default_content = value;
        }
        attrParams.push(tempItem);
      }
    });
    // authAttrList.forEach((item) => {
    //   const tempItem = item;
    //   const index = params.findIndex(param => param === item.params);
    //   if (index !== -1) {
    //     const { type } = item;
    //     const value = values[index][1];
    //     if (type === 'datetime') {
    //       if (value !== undefined) {
    //         tempItem.default_content = moment(value).format('YYYY-MM-DD');
    //       } else {
    //         tempItem.default_content = undefined;
    //       }
    //     } else {
    //       tempItem.default_content = value;
    //     }
    //     attrParams.push(tempItem);
    //   }
    // });
    const requestParams = appParams.concat(attrParams);
    console.log('requestParams', appParams, attrParams, requestParams);
  };

  return (
    <Modal
      visible={addModalVisible}
      title="新建授权"
      width={528}
      footer={[
        <Button key="cancel" onClick={() => { setModalVisible(false); }}>取消</Button>,
        <Button key="submit" type="primary" onClick={() => { onSubmit(); }}>确定</Button>
      ]}
      onCancel={() => { setModalVisible(false); }}
    >
      <div>
        <div className={classes.attribute}>
          <div className={classes.attribute_line}>
            <div>且</div>
          </div>
          <div className={classes.attribute_content}>
            <Form layout="inline">
              {
                getFieldValue('attrArray') && getFieldValue('attrArray').map((item, index) => {
                console.log('div', item, index);
                  return (
                    <Row key={item.key} className={classes.attribute_row}>
                      <Col span={24}>
                        <FormItem
                          label="属性:"
                          style={{ marginBottom: '30px', height: '40px', padding: '5px 0 0 10px' }}
                        >
                          <FormItem>
                            {getFieldDecorator(`${item.id}_@key_@${item.key}`, { initialValue: item.params })(
                              <Select style={{ width: 150 }} onChange={e => handleSelectChange(e, index)}>
                                {authAttrParamNames.map(key => <Option key={key.params} value={key.params} disabled={ item.params !== key.params && usable[key.params]}>{key.name}</Option>)}
                              </Select>
                            )}
                          </FormItem>
                          {
                            authAttrItem(item, index)
                          }
                        </FormItem>
                      </Col>
                    </Row>
                  );
                })
              }
            </Form>
          </div>
        </div>
        <div style={{ margin: '20px 0' }}>
          <Button icon="plus" onClick={() => { addAuthAttr(); }} style={{ border: 'none', color: '#0072ee', padding: '0' }} disabled={authAttrList.length === getFieldValue('attrArray').length}>
            添加属性
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default Form.create({})(AddAuth);
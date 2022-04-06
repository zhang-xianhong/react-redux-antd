import React, { useState, useEffect, useCallback } from 'react';
import {
  Select, Input, Icon, Modal, Button, Form, Row, Col, Tree, DatePicker, Checkbox
} from 'antd';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import classes from './index.less';
import './dynamicForm.css';
import { authList } from './constant';

const { Option } = Select;
const { Search } = Input;
const FormItem = Form.Item;

function AddAuth(props) {
  const { form: { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsValue }} = props;

  const [showAddauth, setShowAddauth] = useState(false);

  const [authAttrList, setAuthAttrList] = useState([]);
  const [attrList, setAttrList] = useState([]);
  const [usable, setUsable] = useState({});
  const [initAttr, setInitAttr] = useState({
    id: 10000000001,
    config: {},
    default_content: '',
    name: '',
    params: '',
    type: 'default'
  });

  async function getAuthList() {
    const authLists = await new Promise((resolve, reject) => {
      resolve(authList);
    });
    console.log(111, authLists);
    setAuthAttrList(authLists);
    setAttrList([initAttr]);
    const obj = {};
    authLists.forEach((item) => {
      obj[item.params] = false;
    });
    setUsable(obj);
  }


  useEffect(() => {
    getAuthList();
  }, []);

  const useSyncCallback = (callback) => {
    const [proxyState, setProxyState] = useState({ current: false });
    const Func = useCallback(() => {
      setProxyState({ current: true });
    }, [proxyState]);
    useEffect(() => {
      if (proxyState.current === true) setProxyState({ current: false });
    }, [proxyState]);
    useEffect(() => {
      // eslint-disable-next-line no-unused-expressions
      proxyState.current && callback();
    });
    return Func;
  };

  const func = useSyncCallback(() => {
    console.log('attr', attrList);
  });


  const authAttrParamNames = authAttrList.length > 0 ? authAttrList.map(item => ({
    name: item.name,
    id: item.id,
    params: item.params,
  })) : [];

  const handleSelectChange = (params, key) => {
    const cloneAuthList = cloneDeep(authAttrList);
    const temp = cloneAuthList.find(item => item.params === params);
    let cloneAttrList = cloneDeep(attrList);
    const usableClone = cloneDeep(usable);
    Object.keys(usableClone).forEach((item) => {
      usableClone[item] = false;
    });
    console.log('cloneAttrList', cloneAttrList);
    cloneAttrList = cloneAttrList.map((item, index) => {
      if (index === key) {
        // eslint-disable-next-line no-param-reassign
        // item = temp;
        item.id = temp.id;
        item.name = temp.name;
        item.params = temp.params;
        item.type = temp.type;
        // item.default_content = temp.default_content;
        item.config = temp.config;
      }
      usableClone[item.params] = true;
      return item;
    });
    setAttrList(cloneAttrList);
    setUsable(usableClone);
  };

  const delIcon = item => (
    // <div className={classes.deleteicon}>
    <div className="deleteicon">
      <Icon
        type="close"
        style={{ fontSize: '12px', color: '#00000040', cursor: 'pointer' }}
        onClick={() => {
          let cloneAttrList = cloneDeep(attrList);
          const usableClone = cloneDeep(usable);
          Object.keys(usableClone).forEach((key) => {
            usableClone[key] = false;
          });
          if (cloneAttrList.length > 1) {
            // cloneAttrList.splice(index, 1);
            cloneAttrList = cloneAttrList.filter(key => key.id !== item.id);
            console.log(222, cloneAttrList);
            cloneAttrList.forEach((attrItem) => {
              usableClone[attrItem.params] = true;
            });
            setAttrList(cloneAttrList);
            setUsable(usableClone);
            func();
          }
        }}
      />
    </div>
  );

  const authAttrItem = (item, index) => {
    switch (item.type) {
      case 'int':
        return (
          <div style={{ display: 'inline-block' }}>
            <span style={{ margin: '0 5px 0 -11px' }}>=</span>
            <FormItem>
              {getFieldDecorator(`${index}_@value`)(
                <Input style={{ width: '150px' }} placeholder={(`请输入${item.name}`)} />
              )}
            </FormItem>
            {delIcon(item)}
          </div>
        );
      case 'select':
        return (
          <div style={{ display: 'inline-block' }}>
            <span style={{ margin: '0 5px 0 -11px' }}>=</span>
            <FormItem>
              {getFieldDecorator(`${index}_@value`)(
                <Select placeholder={(`请选择${item.name}`)} style={{ width: 150 }}>
                  {Object.keys(item.config).map(key => <Option key={key}>{item.config[key]}</Option>)}
                </Select>
              )}
            </FormItem>
            {delIcon(item)}
          </div>
        );
      case 'datetime':
        return (
          <div style={{ display: 'inline-block' }}>
            <span style={{ margin: '0 5px 0 -11px' }}>=</span>
            <FormItem>
              {getFieldDecorator(`${index}_@value`)(
                <DatePicker style={{ minWidth: '150px', width: '150px' }} showTime format="YYYY-MM-DD" placeholder={(`请选择${item.name}`)} allowClear={false} />
              )}
            </FormItem>
            {delIcon(item)}
          </div>
        );
      default:
        return (
          <div style={{ display: 'inline-block' }}>
            <span style={{ margin: '0 5px 0 -11px' }}>=</span>
            <FormItem>
              {getFieldDecorator(`${index}_@value`)(
                <Input style={{ width: '150px' }} placeholder={(`请输入${item.name}`)} />
              )}
            </FormItem>
            {delIcon(item)}
          </div>
        );
    }
  };

  const addAuthAttr = () => {
    const temp = cloneDeep(initAttr);
    temp.id += 1;
    setAttrList([...attrList, temp]);
    setInitAttr(temp);
    func();
  };

  const onSubmit = () => {
    const appParams = [];
    // filterData.forEach((item) => {
    //   if (checkedData.includes(item.id.toString())) {
    //     appParams.push(item);
    //   }
    // });

    const resultEntries = Object.entries(getFieldsValue());
    const obj = {};
    const len = resultEntries.length;
    for (let i = 0; i < len / 2; i += 1) {
      obj[i] = [];
    }
    resultEntries.forEach((item) => {
      const splitItem = item[0].split('_@');
      const index = splitItem[0];
      const key = splitItem[1];
      const value = item[1];
      if (key === 'key') {
        obj[Number(index)].unshift(value);
      } else {
        obj[Number(index)].push(value);
      }
    });
    const values = Object.values(obj);
    const params = values.map(item => item[0]);
    const attrParams = [];
    authAttrList.forEach((item) => {
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
    const requestParams = appParams.concat(attrParams);
    console.log('requestParams', appParams, attrParams, requestParams);
  };

  return (
    <div>
      <Button onClick={() => { setShowAddauth(true); }}>SHOW</Button>
      <Modal
      visible={showAddauth}
      title="新建授权"
      width={528}
      footer={[
        <Button key="cancel" onClick={() => { setShowAddauth(false); }}>取消</Button>,
        <Button key="submit" type="primary" onClick={() => { onSubmit(); }}>确定</Button>
      ]}
      onCancel={() => { setShowAddauth(false); }}
    >
      <div>
        <div className={classes.attribute}>
          {/* <div className={classes.attribute_line}>
            <div>且</div>
          </div> */}
          <div className={classes.attribute_content}>
            <Form layout="inline">
              {
                attrList.length > 0 && attrList.map((item, index) => {
                  console.log('div', item, index);
                  return (
                    <Row key={item.id} className={classes.attribute_row}>
                      <Col span={24}>
                        <FormItem
                          label="属性:"
                          style={{ marginBottom: '30px', height: '40px', padding: '5px 0 0 10px' }}
                        >
                          <FormItem>
                            {getFieldDecorator(`${index}_@key`)(
                              <Select style={{ width: 150 }} onChange={e => handleSelectChange(e, index)}>
                                {authAttrParamNames.map(key => <Option key={key.params} value={key.params} disabled={usable[key.params]}>{key.name}</Option>)}
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
          <Button icon="plus" onClick={() => { addAuthAttr(); }} style={{ border: 'none', color: '#0072ee', padding: '0' }} disabled={authAttrList.length === attrList.length}>
            添加属性
          </Button>
        </div>
      </div>
      </Modal>
    </div>
  );
}

export default Form.create({})(AddAuth);
// export const authList = [
//   {"id":2,"name":"性别","params":"sex","type":"select","default_content":"","config":{"male":"男","female":"女"},"create_time":"2022-03-25T10:32:01.789147+08:00"},
//   {"id":1,"name":"年龄","params":"age","type":"int","default_content":"","config":{"max_number":100,"min_number":18},"create_time":"2022-03-25T10:31:09.703224+08:00"}
// ]

import React, { useState, useEffect, useCallback } from 'react';
import {
  Select, Input, Icon, Modal, Button, Form, Row, Col, Tree, DatePicker, Checkbox
} from 'antd';
import ApiClient from 'helpers/ApiClient';
import { t } from 'i18n';
import { cloneDeep } from 'lodash';
import { arrayToTree, arrayToNodesSearch } from 'utils/common';
import moment from 'moment';
import classes from './index.less';

const { Option } = Select;
const { Search } = Input;
const FormItem = Form.Item;

const client = new ApiClient();

function AddAuth(props) {
  // eslint-disable-next-line react/prop-types
  const {
    // eslint-disable-next-line react/prop-types
    showAddauth, setShowAddauth, form: {
      getFieldDecorator, getFieldValue, setFieldsValue, getFieldsValue
    }
  } = props;
  {/* <Button onClick={() => { setShowAddauth(true); }}>Open</Button> */}
  // <AddAuthor showAddauth={showAddauth} setShowAddauth={setShowAddauth} />

  const [authAttrList, setAuthAttrList] = useState([]);
  const [attrList, setAttrList] = useState([]);
  const [appList, setAppList] = useState([]);
  const [treeOptions, setTreeOptions] = useState({
    checkedKeys: [],
    selectedKeys: [],
    expandedKeys: [],
    autoExpandParent: true,
    ischeckAll: false,
  });
  const [checkedData, setCheckedData] = useState([]);
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
    const authList = await client.get('/sag/api/iam/customAttributeNoPage/', {});
    setAuthAttrList(authList);
    setAttrList([initAttr]);
    const obj = {};
    authList.forEach((item) => {
      obj[item.params] = false;
    });
    setUsable(obj);
  }

  async function getAppList() {
    const applist = await client.get('/sag/api/iam/applicationNoPage/', {});
    setAppList(applist);
  }

  useEffect(() => {
    getAuthList();
    getAppList();
  }, []);

  let resultData = [];
  const data = [];
  const tempData = [];
  const treeData = cloneDeep(appList);
  treeData.forEach((item, index) => {
    const obj = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [, value] of Object.entries(item)) {
      if (typeof value !== 'object') {
        obj.id = index + 1;
        obj.pid = null;
        obj.name = item.category;
        resultData.push(obj);
        tempData.push(obj.id);
      } else {
        // eslint-disable-next-line no-loop-func
        value.forEach((childItem) => {
          const childObj = {};
          childObj.pid = obj.id ? obj.id : null;
          childObj.id = childItem.client_id;
          childObj.name = childItem.client_name;
          resultData.push(childObj);
          tempData.push(childObj.id);
          data.push(childItem.client_id);
        });
      }
    }
  });

  const filterData = cloneDeep(resultData);
  resultData = arrayToTree(resultData);
  resultData = arrayToNodesSearch(resultData, 'name');

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

  useEffect(() => {
    let cloneData = cloneDeep(data);
    if (cloneData && cloneData.length > 0) {
      cloneData = cloneData.filter(item => item.toString().indexOf('-') !== -1);
    }
    setCheckedData(cloneData);
    setTreeOptions({
      ...treeOptions,
      checkedKeys: data,
      expandedKeys: data,
      ischeckAll: filterData.length === tempData.length,
    });
  }, [appList]);

  const onCheck = (checkedKeys) => {
    let datas = [];
    if (checkedKeys.length > 0) {
      datas = checkedKeys.filter(item => item.toString().indexOf('-') !== -1);
    }
    setCheckedData(datas);
    const ischeckAll = checkedKeys.length === filterData.length;
    setTreeOptions({
      ...treeOptions,
      checkedKeys: datas,
      ischeckAll
    });
  };

  const onSelect = (selectedKeys) => {
    setTreeOptions({
      ...treeOptions,
      selectedKeys
    });
  };

  const onExpand = (expandedKeys) => {
    setTreeOptions({
      ...treeOptions,
      expandedKeys,
      autoExpandParent: false,
    });
  };

  const checkAll = (e) => {
    const { checked } = e.target;
    let datas = [];
    if (checked) {
      datas = cloneDeep(filterData);
      datas = datas.map(item => item.id);
    }
    setTreeOptions({
      ...treeOptions,
      checkedKeys: datas,
      ischeckAll: checked,
    });
    onCheck(datas);
  };

  const onClear = () => {
    setCheckedData([]);
    // setTreeOptions({
    //   ...treeOptions,
    //   selectedKeys: [],
    //   checkedKeys: [],
    // });
  };

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i += 1) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.id === key)) {
          parentKey = node.id;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onChange = (e) => {
    const { value } = e.target;
    const expandedKeys = filterData.map((item) => {
      if (item.name.indexOf(value) > -1) {
        return getParentKey(
          item.id,
          arrayToTree(filterData, 'id', 'pid')
        );
      }
      return null;
    }).filter((item, index, self) => self.indexOf(item) === index);
    setTreeOptions({
      ...treeOptions,
      expandedKeys: value ? expandedKeys : [],
      autoExpandParent: true,
    });
  };

  const getNames = (datas, curId) => {
    let obj = {};
    datas.forEach((item) => {
      if (item.id === curId) {
        obj = item;
      }
    });
    return obj;
  };

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
    cloneAttrList = cloneAttrList.map((item, index) => {
      if (index === key) {
        // eslint-disable-next-line no-param-reassign
        item = temp;
      }
      usableClone[item.params] = true;
      return item;
    });
    setAttrList(cloneAttrList);
    setUsable(usableClone);
  };

  const delIcon = item => (
    <div className={classes.deleteicon}>
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
                <Input style={{ width: '150px' }} placeholder={t(`请输入${item.name}`)} />
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
                <Select placeholder={t(`请选择${item.name}`)} style={{ width: 150 }}>
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
                <DatePicker style={{ minWidth: '150px', width: '150px' }} showTime format="YYYY-MM-DD" placeholder={t(`请选择${item.name}`)} allowClear={false} />
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
                <Input style={{ width: '150px' }} placeholder={t(`请输入${item.name}`)} />
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
    filterData.forEach((item) => {
      if (checkedData.includes(item.id.toString())) {
        appParams.push(item);
      }
    });

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
          <div className={classes.attribute_line}>
            <div>且</div>
          </div>
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
                          style={{ marginBottom: '10px', height: '40px', padding: '5px 0 0 10px' }}
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
      <div>
        <span style={{ fontWeight: 'bold' }}>可访问应用：</span>
        <div className={classes.application}>
          <div className={classes.application_left}>
            <div style={{ overFlow: 'auto' }}>
              <Search placeholder="搜索应用" onChange={onChange} />
              <div style={{ margin: '9px 0' }}>
                <Checkbox onChange={checkAll} checked={treeOptions.ischeckAll}>全部应用</Checkbox>
              </div>
              <Tree
                checkable
                checkedKeys={treeOptions.checkedKeys}
                selectedKeys={treeOptions.selectedKeys}
                selectable
                defaultSelectedKeys={data}
                defaultExpandedKeys={data}
                expandedKeys={treeOptions.expandedKeys}
                autoExpandParent={treeOptions.autoExpandParent}
                defaultExpandParent={false}
                onExpand={onExpand}
                onCheck={onCheck}
                onSelect={onSelect}
              >
                {resultData}
              </Tree>
            </div>
          </div>
          <div className={classes.application_right}>
            <div style={{ marginBottom: '10px' }}>
              <span>
                已选：
                {checkedData.length || 0}
                个应用
              </span>
              <a onClick={onClear} style={{ float: 'right' }}>清空</a>
            </div>
            {
              checkedData && checkedData.map((item) => {
                const obj = getNames(filterData, item) || {};
                return (
                  <div className={classes.checkedlist} key={item.id}>
                    <div>{obj.name}</div>
                    <Icon
                      type="close"
                      style={{
                        position: 'absolute', right: '35px', marginRight: '16px', lineHeight: '38px', cursor: 'pointer'
                      }}
                      onClick={() => {
                        let cloneChecked = cloneDeep(checkedData);
                        cloneChecked = cloneChecked.filter(key => key !== item);
                        setCheckedData(cloneChecked);
                      }}
                    />
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default Form.create({})(AddAuth);

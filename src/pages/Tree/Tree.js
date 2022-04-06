import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';
import { treeToArray } from '../../util/arrayToTree';

const { TreeNode } = Tree;

let treeDatas = [
  {
    category: "基础测试",
    client_list:[
      {
        client_id: "6c438a1e-061c-5afb-8299-2104b9cb4410",
        client_name: "测试1"
      },
      {
        client_id: "3f2ecc24-7f79-515c-a9c1-04ac81ccdfce",
        client_name: "测试2"
      },
      {
        client_id: "4cc7fae6-d934-5c08-8fd2-a8870421b193",
        client_name: "测试3"
      }
    ]
  }];
  const keys = [];
  
  treeDatas = treeDatas.map(item => {
    item.key = 0;
    item.title = item.category;
    delete item.category;
    item.children = item.client_list.map(child => {
      const obj = {};
      obj.key = child.client_id;
      obj.title = child.client_name;
      keys.push(child.client_id);
      return obj;
    })
    delete item.client_list;
    return item;
  })

  console.log(treeDatas);


export default function TreeContainer() {
  const [treeData, setTreeData] = useState(treeDatas);
  const [treeOptions, settreeOptions] = useState({
    expandedKeys: [...keys],
    autoExpandParent: true,
    checkedKeys: [...keys],
    selectedKeys: [],
  });
  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys);
    settreeOptions([{
      ...treeOptions,
      expandedKeys,
      autoExpandParent: false,
    }]);
  };

  const onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    settreeOptions({ 
      ...treeOptions,
      checkedKeys
    });
  };

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys, info);
    settreeOptions({ 
      ...treeOptions,
      selectedKeys
    });
  };

  const onLoadData = function (treeNode) {
    // 传入的treeNode为当前树中的节点，包括所有title，key，children等属性
    console.log('treeNode', treeNode);
    return new Promise((resolve, reject) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: 'Child Node', key: `${treeNode.props.eventKey}-0` }
        ];
        setTreeData([...treeData]);
        resolve();
      }, 1000);
    });
  }

  const renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} dataRef={item} />;
    });

    return (
      <div className="tree-container">
        <Tree
          checkable
          onExpand={onExpand}
          expandedKeys={treeOptions.expandedKeys}
          autoExpandParent={treeOptions.autoExpandParent}
          onCheck={onCheck}
          checkedKeys={treeOptions.checkedKeys}
          onSelect={onSelect}
          selectedKeys={treeOptions.selectedKeys}
          loadData={treeNode => onLoadData(treeNode)}
        >
          {renderTreeNodes(treeData)}
        </Tree>
      </div>
    );
  }

 export function arrayToTree(arr, parentId) {
  function loop(parentId) {
    const result = [];
    arr.forEach(item => {
      if (item.parentId === parentId) {
        item.children = loop(item.id);
        result.push(item);
      }
    });
    return result;
  }
  return loop(parentId);
}

export function treeToArray(data) {
  const result = [];
  data.forEach(item => {
    const loop = data => {
      result.push({
        key: data.client_id,
        title: data.client_name,
        parentId: data.parentId
      });
      let client_list = data.client_list;
      if (client_list) {
        for (let i = 0; i < client_list.length; i++) {
          loop(client_list[i]);
        }
      }
    }
    loop(item);
  });
  return result;
}

let treeDatas = [
  {
    // category: "基础测试",
    category: "基础测试",
    // client_list
    client_list: [
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
  }
];

// treeDatas = treeDatas.map(item => {
//   item.client_id = 0;
//   item.client_name = item.category;
//   item.parentId = 0;
//   delete item.category;
//   if(item.client_list) {
//     item.client_list = item.client_list.map(child => {
//       child.parentId = item.parentId;
//       // child.client_list = [];
//       return child;
//     });
//   }
//   return item;
// })


let otherTreeDatas = treeDatas.map(item => {
  item.key = 0;
  item.title = item.category;
  delete item.category;
  item.children = item.client_list.map(child => {
    const obj = {};
    obj.key = child.client_id;
    obj.title = child.client_name;
    return obj;
  })
  delete item.client_list;
  return item;
})
otherTreeDatas = JSON.stringify(otherTreeDatas, null, 2);
// console.log('otherTreeDatas', otherTreeDatas);
// console.log('tree', JSON.stringify(treeDatas, null, 2));



// const arr = [
//   {
//     id: 1,
//     name: '部门A',
//     parentId: 0
//   },
//   {
//     id: 7,
//     name: '部门G',
//     parentId: 1
//   }
// ]
// const result = arrayToTree(arr, 0);
// console.log(JSON.stringify(result, null, 2));


// const treeData = [
//   {
//     "id": 1,
//     "name": "部门A",
//     "parentId": 0,
//     "client_list": [
//       {
//         "id": 7,
//         "name": "部门G",
//         "parentId": 1,
//         "client_list": []
//       }
//     ]
//   }
// ];

// console.log(treeDatas);
// const res = treeToArray(treeDatas)
// console.log(res);

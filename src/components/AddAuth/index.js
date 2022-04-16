import React, { useState } from 'react';
import AddAuth from './AddAuth';
import { Button } from 'antd';

export default function AddAuthContainer() {
    const [addModalVisible, setModalVisible] = useState(false);
  return (
    <div>
        <Button onClick={() => { setModalVisible(true) }} type="primary">按钮</Button>
        <AddAuth addModalVisible={addModalVisible} setModalVisible={setModalVisible} />
    </div>
  )
}

import React, { useEffect } from 'react'
import { Tabs } from 'antd'
import Products from './Products'
import Users from './Users'
import { useSelector } from 'react-redux'

import { useNavigate } from'react-router-dom';

function Admin() {
  const navigate = useNavigate();
  const {user} = useSelector((state)=> state.users);
  useEffect(()=>{
    if(user.role !== 'admin')
    {
      navigate("/");
    }
  },[]);
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Users" key="1">
        <Users/>
      </Tabs.TabPane>
      <Tabs.TabPane tab="Products" key="2">
        <Products/>
      </Tabs.TabPane>
    </Tabs>
  )
}

export default Admin
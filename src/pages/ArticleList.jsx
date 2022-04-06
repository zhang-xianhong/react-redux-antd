/* 
    文章列表页，方便我们后续的删除和修改操作
*/

import React, {useEffect, useState} from 'react'
import '../static/css/articleList.css'

import axios from 'axios'
import servicePath from '../config/apiUrl'
import {List, Row, Col, message, Button, Modal} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
const { confirm } = Modal



export default function ArticleList(props) {

    const [list,setList] = useState([])

    useEffect(() => {
        getArticleList()
    },[])

    // 获取文章列表信息
    const getArticleList = () => {
        axios({
            method: 'get',
            url: servicePath.getArticleList,
            header:{ 'Access-Control-Allow-Origin':'*' },
            withCredentials: true
        }).then(res => {
            setList(res.data.list)
        }).catch(err => {
            console.log('出错咯')
        })
    }

    // 删除文章的方法
    const deleteArticle = (id) => {
        confirm({
            title: '确定要删除这篇博客文章吗？',
            content: '如果你点击OK键，文章将永远被删除，无法恢复',
            onOk() {
                axios({
                    method: 'get',
                    url: servicePath.deleteArticle+id,
                    withCredentials: true,
                    header:{'Access-Control-Allow-Origin':'*'},
                }).then(res => {
                    message.success('文章删除成功')
                    getArticleList()
                })
            },
            onCancel() {
                message.success('你取消了操作，文章没有任何变化')
            }
        })
    }

    // 通过id获取文章列表的方法，用于更新文章信息
    const updateArticleById = (id) => {
        props.history.push('/index/add/'+id)
    }

    return (
        <div>
            <List header={
                <Row className="list-div">
                    <Col span={8}>
                        <b>标题</b>
                    </Col>
                    <Col span={4}>
                        <b>类别</b>
                    </Col>
                    <Col span={4}>
                        <b>发布时间</b>
                    </Col>
                    <Col span={4}>
                        <b>游览量</b>
                    </Col>
                    <Col span={4}>
                        <b>操作</b>
                    </Col>
                </Row>
            }
            bordered
            dataSource={list}
            renderItem={item => {
                return (
                    <List.Item>
                        <Row className="list-div">
                            <Col span={8}>
                                {item.title}
                            </Col>
                            <Col span={4}>
                                {item.typeName}
                            </Col>
                            <Col span={4}>
                                {item.addTime}
                            </Col>
                            <Col span={4}>
                                {item.view_count}
                            </Col>
                            <Col span={4}>
                                <Button type='primary' icon={<EditOutlined/>} onClick={()=>{updateArticleById(item.id)}}></Button> &nbsp;
                                <Button type='danger' icon={<DeleteOutlined/>} onClick={()=>{deleteArticle(item.id)}} ></Button>
                            </Col>
                        </Row>
                    </List.Item>
                )
            }}
            />
        </div>
    )
}

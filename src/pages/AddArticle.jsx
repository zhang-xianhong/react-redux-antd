import React, {useState, useEffect} from 'react'
import marked from 'marked'
import axios from 'axios'
import servicePath from '../config/apiUrl'

import '../static/css/addArticle.css'
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd'
const { Option } = Select
const { TextArea } = Input  

export default function AddArticle(props) {

    // 声明所有的useState
   const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
   const [articleTitle, setArticleTitle] = useState('')   //文章标题
   const [articleContent, setArticleContent] = useState('')  //markdown的编辑内容
   const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
   const [introducemd, setIntroducemd] = useState()            //简介的markdown内容
   const [introducehtml, setIntroducehtml] = useState('预览简介') //简介的html内容
   const [showDate, setShowDate] = useState()   //发布日期
   const [updateDate,setUpdateDate] = useState() //修改日志的日期
   const [typeInfo , setTypeInfo] = useState([]) // 文章类别信息
   const [selectedType, setSelectType] = useState('请选择类别') //选择的文章类别

   useEffect(() => {
       getTypeInfo()
       //获取文章ID
       let tempId = props.match.params.id
       if(tempId) {
           setArticleId(tempId)
           getArticleById(tempId)
       }
   }, []);

   marked.setOptions({
        renderer: marked.Renderer(),
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
    })

    const changeContent = (e) => {
        setArticleContent(e.target.value)
        let html = marked(e.target.value)
        setMarkdownContent(html)
    }

    const changeIntroduce = (e) => {
        setIntroducemd(e.target.value)
        let html = marked(e.target.value)
        setIntroducehtml(html)
    }

    const getTypeInfo = () => {
        axios({
            method: 'get',
            url: servicePath.getTypeInfo,
            header:{ 'Access-Control-Allow-Origin':'*' },
            withCredentials: true //跨域检验cookie
        }).then(res => {
            if(res.data.data === '没有登录') {
                console.log('没有登录')
                localStorage.removeItem('openId')
                props.history.push('/')
            } else {
                setTypeInfo(res.data.data)
                console.log('getTypeInfo',res.data.data)
            }
        }) 
    }   

    const selectTypeHandler = (value) => {
        setSelectType(value)
    }

    // 添加和修改文章的方法
    const saveArticle = () => {
        // markedContent()
        if(!selectedType || selectedType=='请选择类别' ) {
            message.error('必须选择文章类型')
            return false
        } else if(!articleTitle) {
            message.error('文章标题不能为空')
            return false
        } else if(!articleContent) {
            message.error('文章内容不能为空')
            return false
        } else if(!introducemd) {
            message.error('文章简介不能为空')
            return false
        } else if(!showDate) {
            message.error('发布日期不能为空')
            return false
        }
        // message.success('检验通过')
        let dataProps = {}
        dataProps.type_id = selectedType
        dataProps.title = articleTitle
        console.log(dataProps.title)
        console.log(articleContent)
        dataProps.article_content = articleContent
        dataProps.introduce = introducemd
        console.log(introducemd)
        let dateText = showDate.replace(/-/g,'/') //把字符串转变为时间戳
        // console.log(dateText)
        dataProps.addTime = (new Date(dateText).getTime())/1000
        console.log(dataProps.addTime)
        if(articleId == 0) {
            console.log('这里是添加文章,articleId=',articleId)
            dataProps.view_count = Math.ceil(Math.random()*100)+1000
            axios({
                method: 'post',
                url: servicePath.addArticle,
                headers: {'Access-Control-Allow-Origin':'*'},
                data: dataProps,
                withCredentials: true
            }).then(res => {
                setArticleId(res.data.insertId)
                console.log('保存添加文章的Id值')
                if(res.data.isSuccess) {
                    message.success('文章添加成功')
                } else {
                    message.error('文章添加失败')
                }
            })
        } else {
            dataProps.id = articleId
            console.log('这里是更新文章')
            axios({
                method: 'post',
                url: servicePath.updateArticle,
                headers: {'Access-Control-Allow-Origin':'*'},
                data: dataProps,
                withCredentials: true
            }).then(res => {
                if(res.data.isSuccess) {
                    message.success('文章更新成功')
                } else {
                    message.error('文章更新失败')
                }
            })
        }
    }

    // 通过id获取文章列表
    const getArticleById = (id) => {
        axios({
            method: 'get',
            url: servicePath.getArticleById+id,
            withCredentials: true,
            header: {'Access-Control-Allow-Origin':'*'}
        }).then(res => {
            console.log(res.data)
            let articleInfo = res.data.data[0]
            setArticleTitle(articleInfo.title)
            setArticleContent(articleInfo.article_content)
            let html = marked(articleInfo.article_content)
            setMarkdownContent(html)
            setIntroducemd(articleInfo.introduce)
            let IntroHtml = marked(articleInfo.introduce)
            setIntroducehtml(IntroHtml)
            setShowDate(articleInfo.addTime)
            setSelectType(articleInfo.typeId)
        })
    }

    return (
        <div>
            <Row gutter={5}>
                <Col span={18}>
                    <Row gutter={10}>
                        <Col span={20}>
                            <Input placeholder="博客标题" size="large" 
                            value={articleTitle}
                            onChange={e => setArticleTitle(e.target.value)} />
                        </Col>
                        <Col span={4}>
                            &nbsp;
                            <Select defaultValue={selectedType} size="large" onChange={selectTypeHandler}>
                                {
                                    typeInfo.map((item,index) => {
                                        return (<Option key={index} value={item.Id}>{item.typeName}</Option>)
                                    })
                                }
                                {/* <Option value="1">视频教程</Option> */}
                            </Select>
                        </Col>
                    </Row>
                    <br/>
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea className="markdown-content" rows={35}
                            placeholder="文章内容" 
                            value={articleContent}
                            onChange={changeContent}
                            />  
                        </Col>
                        <Col span={12}>
                            <div className="show-html" dangerouslySetInnerHTML={{__html:markdownContent}}>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Row>
                        <Col span={24}>
                            <Button size="large">暂存文章</Button> &nbsp;
                            <Button size="large" type="primary" onClick={saveArticle}>发布文章</Button>
                            <br/> <br/>
                        </Col>
                        <Col span={24}>
                            <TextArea 
                            rows={6} placeholder="文章简介"
                            onChange={changeIntroduce} 
                            value={introducemd}
                            />
                            <br/> <br/>
                            <div className="introduce-html" dangerouslySetInnerHTML={{__html:introducehtml}}>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div className="date-select">
                                <DatePicker placeholder="发布日期" size="large" 
                                defaultValue={showDate}
                                onChange={(date,dateString) => {
                                    // console.log('date',date)
                                    // console.log('datestring',dateString)
                                    setShowDate(dateString)
                                }}
                                />
                            </div>
                        </Col>
                        {/* <Col span={12}>
                            <div className="date-select">
                                <DatePicker placeholder="修改日期" size="large" />
                            </div>
                        </Col> */}
                    </Row>
                </Col>
            </Row>
        </div>
    )
}

# 后台开发

## 一、安装react目录，在react_blog文件夹下使用命令： create-react-app admin
    安装antd插件： yarn add antd || npm install --save antd
    测试是否成功

## 二、页面路由配置
    1、安装react-router-dom
    yarn add react-router-dom
    2、使用Router
    import { BrowserRouter as Router, Route} from "react-router-dom"

## 三、后台系统开发3——编写登录界面
    进入Login.js文件。引入React，antd
    1、编写UI部分
    再编写之前可以使用React Hooks特性里的useState来定义一些变量和改变变量的方法。
    const [userName , setUserName] = useState('')
    const [password , setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    isLoading主要用于控制Spin组件是否进入加载状态，进入加载状态可以有效防止重复提交
    3、UI写好了，需要编写一个checkLogin的方法，以后可以实现去后台验证的判断，这里我们只做一个UI状态的变化操作。剩下的操作以后再进行操作。
    4、编写CSS文件
        到目前位置，我们还没有CSS样式，可以在/src目录下建立一个static的目录,当然名字你也可以完全自己取。然后在/static目录下再建立一个css目录，然后创建Login.css文件

## 四、UI框架的Layout搭建
    在Ant design 网站中去拷贝layout布局的代码，修改少数部分，在网页中预览

## 五、添加文章页面制作1
    1、创建增加文章页面
    在/src/pages目录下面，新建一个AddArticle.js的文件。建立完成后用import引入需要使用的组件
    在/src/static/css文件夹下建立AddArticle.css文件，然后把下面的CSS样式拷贝进去
    2、编写AdminIndex.js文件并配置路由
    然后在主界面（Main.js）的操作内容区域加入下面的路由代码。
    3、编写标题和文章内容区域
    路由调通后，就可以编写基本的UI样式了，我们先根据图片把标题和UI部分做好。先把大体架构制作完成，也就是大体分区。通过两栏布局进行设置

## 六、添加文章页面制作2
    1、制作暂存按钮和发布按钮
    先来制作右侧最顶部的两个按钮，这个两个按钮一个是暂存，就是你可以把文章存一下，但是不发布，一个是直接发布。（通过 行Row和列Col 实现）
    2、编写文章简介部分
    这部分我们也采用<TextArea>组件，预览部分直接使用<div>标签就可以实现。下节课我们会解析Markdown。
    3、编写发布时间
    目前我们只用一个编写时间，最后修改时间我们可以以后再添加，目前没有什么用处。所以只写一个日期选择框就可以了。（通过组件 DataPicker）

## 七、Markdown编辑器制作
    1、声明对应的useState
    2、设置marked
    声明完成后需要对marked进行基本的设置
    3、编写实时预览对应的方法
    实现实时预览非常简单，作两个对应的方法，在onChange事件触发时执行就可以。方法体也只是用marked进行简单的转换，当然对应的CSS是我们对应好的。
    编写onChange相应事件

## 八、中台接口编写——编写service登录接口
    1、新建main.js文件
    在/service/controller/admin文件夹下新建一个main.js文件
    2、中台路由的制作
    在/service/router文件夹下，新建立一个admin.js文件，用于配置后台接口文件的路由。 路由的代码如下：
    module.exports = app =>{
        const {router,controller} = app
        router.get('/admin/index',adminauth ,controller.admin.main.index)
    }
    路由配置好以后还需要再总的router.js利进行配置
    这时候路由就起作用了，然后我们再服务端打开服务，到浏览器预览一下，如果可以顺利在页面输出hi api,说明一切正常了。
    3、登录方法的编写
    在/service/controller/admin/main.js文件里编写验证登录的方法

        
## 九、实现前台登录操作
    1、设置路由
    在/service/app/router文件夹下的admin.js文件中设置路由。
    中台路由配置好以后，还要去后台进行配置，打开/admin/config/apiUrl.js文件进行设置请求路径
    2、编写后台登录方法checkLogin
    当我们点击登录按钮后，就要去后台请求接口，验证输入的用户名和密码是否正确，如果正确跳到博客管理界面，如果不正确在登录页面进行提示。  
    3、解决跨域问题
    如果出现跨域问题，可以到config.default.js里进行设置配置

## 十、编写中台路由守卫
    1、编写守卫方法
    其实守卫方法是通过egg.js中间件来实现的middleware，所以我们需要先建立一个middleware文件夹。在/service/app/文件夹下面，建立一个mindleware文件夹，然后在文件夹下面建立一个adminauth.js文件。具体代码见文件中
    2、前后台分离共享session的方法
    在正常情况下前后台是不能共享session的，但是只要在egg端的/config/config.default.js里增加credentials:true就可以了
    3、使用中间件实现路由守卫
    中间件制作好了，我们可以制作在路由界面进行配置，打开/service/app/router/admin.js文件，先声明并引入中间件。
    const {router,controller} = app
    var adminauth = app.middleware.adminauth()
    然后使用的时候，直接放在第二个参数里，就可以了

## 十一、读取添加文章页面的类别信息
    1、编写获取文章类别的接口
    打开service文件夹，然后进入/app/controller/admin/main.js文件，然后编写getTypeInfo（）方法，这里直接使用egg-mysql提供的API就可以得到。
    2、编写中台路由
    到/app/router/admin/admin.js中进行配置，这个接口我们就添加了路由守卫，也就是说你不登录，去访问这个接口是无效的，会返回让你去登录的。
    3、后台ip地址 apiUrl.js的配置
    当我们的接口都写完了之后，我们需要到后台作一下访问的统一管理文件，我经常使用apiUrl.js这个名字来命名文件，这个文件其实就是一个对象，里边是后台用到的所有接口。方便于之后的查找和管理
    4、在添加文章页面（AddArticle.jsx）显示出类别
    用React hooks增加useState参数和方法，在组件头部增加代码如下：
    const [typeInfo ,setTypeInfo] = useState(['请选择类别']) // 文章类别信息
    引入后编写getTypeInfo方法，代码见文件
    方法写好后，直接在useEffect里进行使用就可以了
    useEffect(()=>{
        getTypeInfo() 
    },[])
    最后编写JSX部分代码就可以了，这里用map进行了循环


##  十二、添加文章的方法（上）
    1、选择类别后调用方法
    然后在select组件上调用onChange方法调用
    2、对发布时间文本框进行修改
    选择文章可用后，修改发布日期对应的文本框，增加相应方法，让选择日期文本框也变的可用，代码也是通过绑定onChange事件进行
    3、再对文章标题文本进行修改设置
    4、编写保存文章内容的方法 saveArticle()
    然后在保存按钮的部分添加上onClick事件,在网页中进行调试即可

## 十三、 添加文章的方法（中）
    
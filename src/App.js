import React from 'react'
import {BrowserRouter,Route} from 'react-router-dom'
import Login from './pages/Login'
import AdminIndex from './pages/AdminIndex'
import Tree from './pages/Tree'
import FormContainer from './pages/Form'
import DynamicFormContainer from './components/DynamicForm'
import EditableTable from './components/EditTable';

export default function App() {
    return (
        <div>
            <BrowserRouter>
                {/* <Route path='/' component={Login} /> */}
                {/* <Route path='/' exact component={Login} /> */}
                <Route path='/index' component = {AdminIndex} />
                <Route path='/tree' component={Tree} />
                <Route path='/form' component={FormContainer} />
                <Route path='/dynamic' component={DynamicFormContainer} />
                <Route path='/editableTable' component={EditableTable} />
            </BrowserRouter>
        </div>
    )
}

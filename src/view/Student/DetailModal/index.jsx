import React, { useImperativeHandle, useState, useEffect } from 'react';
import { Form, Modal, Spin, Input, message } from 'antd';
import { detail } from '../api';
// import moment from 'moment';


function DetailModal(props, ref) {

    const [form] = Form.useForm();

    const [visible, setVisible] = useState({ visible: false, sno: 0 });
    const [spinning, setSpinning] = useState(false);

    useImperativeHandle(ref, () => ({ setVisible }));

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    const onCancel = () => {
        setVisible({ visible: false, sno: 0 });
    };

    const getDetail = async (sno) => {
        setSpinning(true);
        const [error, resData] = await detail(sno);
        if (error) {
            message.error(error);
            setSpinning(false);
            return;
        }

        if (resData.code === 200) {
            // resData.data.birthday = moment(resData.data.birthday, 'YYYY-MM-DD');
            form.setFieldsValue(resData.data);
        }
        setSpinning(false);
    };

    useEffect(() => {
        if (visible.sno > 0)
            getDetail(visible.sno);
    }, [visible.sno]);

    return (
        <>
            <Modal
                title='查看学生信息'
                width={600}
                open={visible.visible}
                onCancel={onCancel}
                onOk={onCancel}
                destroyOnClose
                maskClosable={false}
                closable={false}
            >
                <Spin spinning={spinning}>
                    <Form form={form}>
                        <Form.Item
                            label='学号'
                            name='sno'
                            {...layout}>
                            <Input placeholder='请输入学号' disabled />
                        </Form.Item>
                        <Form.Item
                            label='姓名'
                            name='sname'
                            {...layout}>
                            <Input placeholder='请输入姓名' disabled />
                        </Form.Item>
                        <Form.Item
                            label='性别'
                            name='ssex'
                            {...layout}>
                            <Input placeholder='请输入性别' disabled />
                        </Form.Item>
                        <Form.Item
                            label='学院'
                            name='sdept'
                            {...layout}>
                            <Input placeholder='请输入学院' disabled />
                        </Form.Item>
                        <Form.Item
                            label='出生日期'
                            name='birthday'
                            {...layout}>
                            <Input placeholder='请输入出生日期' disabled />
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
}
export default React.forwardRef(DetailModal);

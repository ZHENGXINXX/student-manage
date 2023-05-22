import React, { useImperativeHandle, useState } from 'react';
import { Form, Modal, Spin, Input, message, DatePicker, Select } from 'antd';
import { insert } from '../api';
import moment from 'moment';

// eslint-disable-next-line react/prop-types
function AddModal({ updateList, pageInfo }, ref) {
    const [form] = Form.useForm();

    const [visible, setVisible] = useState(false);
    const [spinning] = useState(false);

    useImperativeHandle(ref, () => ({ setVisible }));

    const rules = [{ required: true, message: '不能为空' }];
    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 20 }
    };

    const onCancel = () => {
        setVisible(false);
    };

    

    const disabledDay = current => {
        // 只能选择当前日期的两个月范围内
        return current && (current > moment().endOf('day'));

        // 只能选择当前日期的前后一个月范围
        // return current && (current >  moment().add(1, 'months') || current <  moment().subtract(1, 'months'));
    };

    const onFinish = () => {
        form.validateFields()
            .then(async (values) => {
                values.birthday = values.birthday.format('YYYY-MM-DD');
                window.console.log(values);
                const [error, resData] = await insert(values);
                window.console.log(resData);
                if (error) {
                    message.error(error);
                    onCancel;
                }
                if (resData.code === 200) {
                    message.success("新增成功");

                } else if (resData.code === 500) {
                    message.warning('已存在该学生');
                }
                else {
                    message.error("新增失败");
                }
                onCancel();
                // eslint-disable-next-line react/prop-types
                updateList({ ...pageInfo, page: pageInfo.current });
            })
            .catch(() => {
                // onCancel();
            });
    };


    return (
        <>
            <Modal
                title='新增学生'
                width={600}
                open={visible}
                onOk={onFinish}
                onCancel={onCancel}
                destroyOnClose
                maskClosable={false}
                closable={false}
            >
                <Spin spinning={spinning}>
                    <Form form={form} preserve={false}>
                        <Form.Item
                            label='学号'
                            name='sno'
                            rules={rules}
                            {...layout}>
                            <Input placeholder='请输入学号' />
                        </Form.Item>
                        <Form.Item
                            label='姓名'
                            name='sname'
                            rules={rules}
                            {...layout}>
                            <Input placeholder='请输入姓名' />
                        </Form.Item>
                        <Form.Item
                            label='性别'
                            name='ssex'
                            rules={rules}
                            {...layout}>
                            <Select
                                placeholder='请选择性别'
                                options={[
                                    {
                                        value: '男',
                                        label: '男'
                                    }, {
                                        value: '女',
                                        label: '女'
                                    }
                                ]} />
                        </Form.Item>
                        <Form.Item
                            label='学院'
                            name='sdept'
                            rules={rules}
                            {...layout}>
                            <Input placeholder='请输入学院' />
                        </Form.Item>
                        <Form.Item
                            label='出生日期'
                            name='birthday'
                            rules={rules}
                            {...layout}>
                            <DatePicker placeholder='请选择出生日期' style={{ width: 460 }}  disabledDate={disabledDay}/>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
}
export default React.forwardRef(AddModal);

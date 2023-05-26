import React, { useEffect, useImperativeHandle, useState } from 'react';
import { Form, Modal, Spin, Input, message, DatePicker,Select } from 'antd';
import moment from 'moment';
import 'dayjs/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import { detail, update } from '../api';
import { rules } from '../Rule';

// eslint-disable-next-line react/prop-types
function EditModal({updateList,pageInfo}, ref) {

    const [form] = Form.useForm();

    const [visible, setVisible] = useState({ visible: false, sno: 0 });
    const [spinning, setSpinning] = useState(false);

    useImperativeHandle(ref, () => ({ setVisible }));

    const number = [{ pattern: /^\d{11}$/, message: "请输入正确的11位学号" },{}];

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
            resData.data.birthday = moment(resData.data.birthday, 'YYYY-MM-DD');
            form.setFieldsValue(resData.data);
        }
        setSpinning(false);
    };

    const disabledDay = current => {
        // 只能选择当前日期的两个月范围内
        return current && (current > moment().endOf('day'));

        // 只能选择当前日期的前后一个月范围
        // return current && (current >  moment().add(1, 'months') || current <  moment().subtract(1, 'months'));
    };

    useEffect(() => {
        if (visible.sno > 0)
            getDetail(visible.sno);
    }, [visible.sno]);

    const onFinish = () => {
        form.validateFields()
            .then(async (values) => {
                values.birthday = values.birthday.format('YYYY-MM-DD');
                values.updateSno = values.sno;
                values.sno = visible.sno;
                const [error, resData] = await update(values);
                if (error) {
                    message.error(error.message);
                    onCancel();
                }
                
                if (resData.code === 200) {
                    message.success("更改成功");
                } else {
                    message.error(resData.message);
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
                title='编辑学生信息'
                width={600}
                open={visible.visible}
                onCancel={onCancel}
                onOk={onFinish}
                destroyOnClose
                maskClosable={false}
                closable={false}
            >
                <Spin spinning={spinning}>
                    <Form form={form}>
                        <Form.Item
                            label='学号'
                            name='sno'
                            rules={number}
                            {...layout}>
                            <Input placeholder='请输入学号'/>
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
                                        value:'男',
                                        label:'男'
                                    },{
                                        value:'女',
                                        label:'女'
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
                            <DatePicker placeholder='请选择出生日期' locale={locale} style={{ width: 460 }} disabledDate={disabledDay}/>
                        </Form.Item>
                    </Form>
                </Spin>
            </Modal>
        </>
    );
}

export default React.forwardRef(EditModal);

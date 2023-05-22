import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Button, Popconfirm, Spin, Table, message } from 'antd';
import DetailModal from './DetailModal';
import EditModal from './EditModal';
import AddModal from './AddModal';
import css from './index.module.less';
import { del, list } from './api';


/**
 * author : zx 
 * 风险应急处置/保障资源/救援队伍
 */
//初始化信息
const listInitState = { current: 1, pageSize: 10, keyWord: '', };
function listReducer(state, action) {
  switch (action.type) {
    case 'update':
      return { ...state, ...action.data };
    case 'search':
      return { ...state, keyWord: action.data.keyWord, current: action.data.current };
    default:
      throw new Error();
  }
}

export default function Home() {
  //addModal和editModal的ref
  const addRef = useRef();
  const editRef = useRef();
  const detailRef = useRef();
  //表格分页
  const [pageInfo, listDispatch] = useReducer(listReducer, listInitState);
  const [tabData, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [spinning, setSpinning] = useState(false);

  const updateList = async (data = {}) => {
    setSpinning(true);
    const [error, resData] = await list(data);
    if (error) {
      message.error(error);
      setSpinning(false);
      return;
    }

    if (resData.code === 200) {
      setData(resData.data);
      setTotal(resData.totalCount);
    } else {
      message.error(resData.message);
    }
    setSpinning(false);
  };

  useEffect(() => {
    updateList({ ...pageInfo, page: pageInfo.current });
  }, []);

  const onDetail = (sno) => {
    detailRef.current.setVisible({ visible: true, sno });
  };

  const onEdit = (sno) => {
    editRef.current.setVisible({ visible: true, sno });
  };

  const onDelete = async (sno) =>{
      const [error,resData] = await del(sno);
      if(error){
        message.error(error);
        return;
      }

      if(resData.code === 200){
        message.success('删除成功');
        updateList({...pageInfo,page:pageInfo.current});
      }
  };

  //表格字段
  const colums = [
    {
      title: '学号',
      dataIndex: 'sno',
      key: 'sno',
      align: 'center',
      ellipsis: true
    },
    {
      title: '姓名',
      dataIndex: 'sname',
      key: 'sname',
      align: 'center',
      ellipsis: true
    },
    {
      title: '性别',
      dataIndex: 'ssex',
      key: 'ssex',
      align: 'center',
      ellipsis: true
    },
    {
      title: '学院',
      dataIndex: 'sdept',
      key: 'sdept',
      align: 'center',
      ellipsis: true
    },
    {
      title: '出生日期',
      dataIndex: 'birthday',
      key: 'birthday',
      align: 'center',
      ellipsis: true
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      render: (text) => (
        <>
          <Button type='link' onClick={() => { onDetail(text.sno); }}>详情</Button>
          <span className={css.driver}>|</span>
          <Button type='link' onClick={() => { onEdit(text.sno); }}>编辑</Button>
          <span className={css.driver}>|</span>
          <Popconfirm title='是否要删除此学生信息' okType='danger' onConfirm={() => onDelete(text.sno)}>
            <Button type='link' danger>删除</Button>
          </Popconfirm>
        </>
      )
    }
  ];
  // 分页参数
  const pagination = {
    ...pageInfo,
    total,
    showTotal: total => `共 ${total} 条数据`,
    hideOnSinglePage: false,
    pageSizeOptions: [10, 50, 100, 200],
    showSizeChanger: true,
    showQuickJumper: true,
    onChange: (page, pageSize) => {
      listDispatch({ type: 'update', data: { current: page, pageSize } });
    },
  };

  return (
    <>
      <div className={css.handle}>
        <Button
          type='primary'
          style={{ marginLeft: 20, marginRight: 20 }}
          onClick={() => { addRef.current.setVisible(true); }}
        >
          添加
        </Button>
      </div>
      <Spin spinning={spinning}>
        <Table
          columns={colums}
          pagination={pagination}
          dataSource={tabData}
          rowKey='sno'
          scroll={{
            x: colums.length * 220,
            y: window.innerHeight * 0.46
          }}
        >
        </Table>
      </Spin>
      <AddModal ref={addRef} updateList={updateList} pageInfo={pageInfo} />
      <EditModal ref={editRef} updateList={updateList} pageInfo={pageInfo} />
      <DetailModal ref={detailRef} />
    </>
  );
}

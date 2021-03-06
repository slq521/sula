import React from 'react';
import { mount } from 'enzyme';
import { updateWrapper } from '../../__tests__/common';
import { StepQueryTable } from '..';

const queryFields = Array(10)
  .fill(0)
  .map((_, index) => {
    return {
      name: `input${index}`,
      label: `Input${index}`,
      field: 'input',
    }
  })

  const remoteDataSource = {
    url: 'https://randomuser.me/api',
    method: 'GET',
    convertParams({ params }) {
      return {
        results: params.pageSize,
        ...params,
      };
    },
    converter({ data }) {
      return {
        list: data.results.map((item, index) => {
          return {
            ...item,
            id: `${index}`,
            name: `${item.name.first} ${item.name.last}`,
            index,
          };
        }),
        total: 100,
      };
    },
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 110,
    },
    {
      title: '国家',
      key: 'nat',
      width: 110,
    },
    {
      title: '名字',
      key: 'name',
      copyable: true,
      ellipsis: true,
      width: 200,
    }
  ]

  describe('step-query-table', () => {
    it('basic', async() => {
      const wrapper = mount(
        <StepQueryTable
          itemLayout={{ cols: 2 }}
          visibleFieldsCount={3}
          columns={columns}
          remoteDataSource={remoteDataSource}
          fields={queryFields}
          rowKey="id"
          steps={[{
            title: 'Steps1'
          }, {
            title: 'Steps2'
          }, {
            title: 'Steps3'
          }]}
        />
      );
      
      expect(wrapper.render()).toMatchSnapshot();
      // 刷新表格
      wrapper.find('button').forEach(node => {
        if (node.text() === 'Query') {
          node.simulate('click');
        }
      })

      await updateWrapper(wrapper);

      expect(wrapper.find('.ant-steps-item').at(0).props().className).toMatch('ant-steps-item-active')
      wrapper.find('.ant-steps-item-container').at(1).simulate('click');
      await updateWrapper(wrapper);
      expect(wrapper.find('.ant-steps-item').at(1).props().className).toMatch('ant-steps-item-active')
      wrapper.find('.ant-steps-item-container').at(2).simulate('click');
      await updateWrapper(wrapper);
      expect(wrapper.find('.ant-steps-item').at(2).props().className).toMatch('ant-steps-item-active')
    })
  })

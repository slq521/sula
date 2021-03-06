import React from 'react';
import { mount } from 'enzyme';
import { Form } from '..';
import { actWait } from '../../__tests__/common';

describe('form', () => {
  describe('form props', () => {
    it('onValueChange cascade', async () => {
      let formRef;
      const onValuesChange = jest.fn();
      const form = (
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
          onValuesChange={onValuesChange}
          fields={[
            { name: 'input', label: 'input', field: 'input' },
            {
              name: 'input2',
              label: 'inpt2',
              field: 'input',
              dependency: {
                value: {
                  relates: ['input'],
                  inputs: [['a']],
                  output: 'aaa',
                  defaultOutput: 'xxx',
                },
              },
            },
          ]}
        />
      );

      const wrapper = mount(form);
      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 'a' } });
      await wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: 'a', input2: 'aaa' });
      expect(onValuesChange).toHaveBeenCalled();
      expect(wrapper.render()).toMatchSnapshot();
    });

    it('remoteValues', async () => {
      let formRef;
      const form = (
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
          remoteValues={{
            url: '/manage.json',
            method: 'post',
          }}
          fields={[
            { name: 'input', label: 'input', field: 'input' },
            {
              name: 'input2',
              label: 'inpt2',
              field: 'input',
              dependency: {
                value: {
                  relates: ['input'],
                  inputs: [['a']],
                  output: 'aaa',
                  defaultOutput: 'xxx',
                },
              },
            },
          ]}
        />
      );

      const wrapper = mount(form);
      await actWait();
      expect(formRef.getFieldsValue()).toEqual({ input: 'a', input2: 'aaa' });
      wrapper
        .find('input')
        .at(0)
        .simulate('change', { target: { value: 'x' } });
      wrapper.update();
      expect(formRef.getFieldsValue()).toEqual({ input: 'x', input2: 'xxx' });
    });

    it('remoteValues Error', async () => {
      let formRef;
      const startFn = jest.fn();
      const endFn = jest.fn();
      const form = (
        <Form
          ref={(ref) => {
            formRef = ref;
          }}
          remoteValues={{
            url: '/error.json', // 模拟请求报错
            method: 'post',
          }}
          onRemoteValuesStart={startFn}
          onRemoteValuesEnd={endFn}
          fields={[
            { name: 'input', label: 'input', field: 'input' },
            {
              name: 'input2',
              label: 'inpt2',
              field: 'input',
              dependency: {
                value: {
                  relates: ['input'],
                  inputs: [['a']],
                  output: 'aaa',
                  defaultOutput: 'xxx',
                },
              },
            },
          ]}
        />
      );

      const wrapper = mount(form);
      await actWait();
      expect(formRef.getFieldsValue()).toEqual({ input: undefined, input2: undefined });
      expect(startFn).toHaveBeenCalled();
      expect(endFn).toHaveBeenCalled();
      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe('children container', () => {
    it('children container', () => {
      const wrapper = mount(
        <Form
          fields={[
            {
              label: 'Inputgroup',
              childrenContainer: {
                type: 'inputgroup',
                props: {
                  compact: true,
                },
              },
              children: [
                {
                  name: 'input1',
                  field: {
                    type: 'input',
                    props: {
                      style: { width: '50%' },
                    },
                  },
                },
                {
                  name: 'input2',
                  field: {
                    type: 'input',
                    props: {
                      style: { width: '50%' },
                    },
                  },
                },
              ],
            },
            {
              label: 'childrenbtn',
              childrenContainer: 'div',
              children: [
                {
                  label: 'btn1',
                  render: {
                    type: 'button',
                    props: {
                      children: 'button1',
                    },
                  },
                },
                {
                  label: 'btn2',
                  render: {
                    type: 'button',
                    props: {
                      children: 'button2',
                    },
                  },
                },
              ],
            },
          ]}
        />,
      );

      expect(wrapper.render()).toMatchSnapshot();
    });
  });

  describe('remote value start and end', () => {});
});

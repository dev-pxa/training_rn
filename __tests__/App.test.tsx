/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('../src/services/api', () => ({
  fetchLoginConfig: jest.fn(() => Promise.resolve({
    code: 0,
    des: '查询成功',
    data: {
      companies: [
        {
          code: 'SMART-HOME-01',
          name: '智家科技总部',
        },
      ],
      agreements: {
        serviceAgreement: {
          title: '服务协议',
          contents: [],
        },
        privacyPolicy: {
          title: '隐私政策',
          contents: [],
        },
      },
    },
  })),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(async () => {
    ReactTestRenderer.create(<App />);
    await Promise.resolve();
  });
});

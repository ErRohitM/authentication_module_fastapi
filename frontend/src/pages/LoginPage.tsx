import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Typography, message } from 'antd';
import { login, persistTokens, getUser } from '../services/authService';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { authAtom, isAuthenticatedSelector } from '../recoil/auth.atom';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
  const setAuth = useSetRecoilState(authAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      // If user is already authenticated, redirect to profile
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { username, password } = values;
      const response = await login(username, password);
      persistTokens({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
      });

      // fetch user data and set in recoil
      const userData = await getUser();
      setAuth({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        user: userData,
      });

      message.success('Login Successful!');

      navigate('/profile');
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.detail) {
        message.error(error.response.data.detail);
      } else {
        message.error('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Title level={2} className="text-center">Login</Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={true}
          className="mt-6"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
            <p>
              Don't have an account?{' '}
              <a href="#" onClick={(e) => {
                e.preventDefault();         
                navigate('/register');     
              }}>
                Register here
              </a>
            </p>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;

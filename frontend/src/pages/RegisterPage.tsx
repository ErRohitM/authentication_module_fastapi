import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { registerUser, persistTokens, getUser } from '../services/authService';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { authAtom, isAuthenticatedSelector } from '../recoil/auth.atom';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useRecoilValue(isAuthenticatedSelector);
  const setAuth = useSetRecoilState(authAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const { name, email, password, phone_number, address } = values;

      const response = await registerUser({
        name,
        email,
        password,
        phone_number,
        address,
      });

      if (response.access_token) {
        persistTokens({
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
        });
        const userData = await getUser();
        setAuth({
          accessToken: response.access_token,
          refreshToken: response.refresh_token,
          user: userData,
        });
        message.success('Registration successful!');
        navigate('/profile');
      } else {
        message.success('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error: any) {
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          message.error(detail.map((d: any) => d.msg).join(' | '));
        } else {
          message.error(detail);
        }
      } else {
        message.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Title level={2} className="text-center">Register</Title>
        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={true}
          className="mt-6"
        >
          <Form.Item
            label="Username"
            name="name"
            rules={[{ required: true, message: 'Please enter a username' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter an email' },
              { type: 'email', message: 'Please enter a valid email address' },
            ]}
          >
            <Input type="email" placeholder="Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please enter a password' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{12,}$/;
                  if (!passwordRegex.test(value)) {
                    return Promise.reject(
                      new Error('Password must be at least 12 characters and include uppercase, lowercase, number, and special character')
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          
          <Form.Item
            label="Phone Number"
            name="phone_number"
            rules={[
              { required: true, message: 'Please enter your phone number' },
              {
                pattern: /^[0-9]{10,15}$/,
                message: 'Phone number must be 10 to 15 digits',
              },
            ]}
          >
            <Input placeholder="Phone Number" />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please enter your address' }]}
          >
            <Input.TextArea placeholder="Address" rows={3} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Register
            </Button>
            <p>
              Already have an account?{' '}
              <a href="#" onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}>
                Login here
              </a>
            </p>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;

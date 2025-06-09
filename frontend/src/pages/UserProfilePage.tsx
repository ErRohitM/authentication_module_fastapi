import React, { useEffect, useState } from 'react';
import { Typography, Form, Input, Button, message } from 'antd';
import { useRecoilState } from 'recoil';
import { authAtom } from '../recoil/auth.atom';
import { getUser, updateUser, clearTokens } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const UserProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [auth, setAuth] = useRecoilState(authAtom);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = async () => {
    if (!auth?.user) {
      try {
        const userData = await getUser();
        setAuth((prev) => prev && { ...prev, user: userData });
        form.setFieldsValue(userData);
      } catch (error) {
        message.error('Failed to fetch user details');
      }
    } else {
      form.setFieldsValue(auth.user);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    if (auth?.user) {
      form.setFieldsValue(auth.user);
    }
    setEditMode(false);
  };

  const handleUpdate = async (values: any) => {
    setLoading(true);
    try {
      const updatedUser = await updateUser({
        ...values,
        id: auth?.user?.id,
      });
      // update local recoil state
      setAuth((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          user: updatedUser,
        };
      });
      message.success('Profile updated successfully');
      setEditMode(false);
    } catch (error: any) {
      message.error('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearTokens();
    setAuth(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <Title level={2} className="text-center">User Profile</Title>
        <div className="mb-4">
          <Button type="primary" onClick={handleLogout} danger>
            Logout
          </Button>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
          initialValues={auth?.user}
        >
          <Form.Item label="Username" name="name">
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="PhoneNumber" name="phone_number">
            <Input disabled={!editMode} />
          </Form.Item>
          <Form.Item label="Address" name="address">
            <Input disabled={!editMode} />
          </Form.Item>

          {!editMode && (
            <Button type="primary" onClick={handleEdit} className="mr-2">
              Edit Profile
            </Button>
          )}
          {editMode && (
            <>
              <Button type="primary" htmlType="submit" loading={loading} className="mr-2">
                Save
              </Button>
              <Button onClick={handleCancel}>Cancel</Button>
            </>
          )}
        </Form>
      </div>
    </div>
  );
};

export default UserProfilePage;

"use client"
import React, { useState } from "react";
import { useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation'
import { config } from '@/config/config';
import { message } from 'antd';
const Body = styled.div`
background: #f6f5f7;
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
font-family: "Montserrat", sans-serif;
height: 100vh;
margin: -20px 0 50px;
`;
const Container = styled.div`
 background-color: #fff;
 border-radius: 10px;
 box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
 position: relative;
 overflow: hidden;
 width: 678px;
 max-width: 100%;
 min-height: 400px;
 `;

const SignUpContainer = styled.div`
  signinIn: boolean;
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.$signinIn !== true ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  `
    : null}
 `;


const SignInContainer = styled.div`
 position: absolute;
 top: 0;
 height: 100%;
 transition: all 0.6s ease-in-out;
 left: 0;
 width: 50%;
 z-index: 2;
 ${props => (props.$signinIn !== true ? `transform: translateX(100%);` : null)}
 `;

const Form = styled.form`
 background-color: #ffffff;
 display: flex;
 align-items: center;
 justify-content: center;
 flex-direction: column;
 padding: 0 50px;
 height: 100%;
 text-align: center;
 `;

const Title = styled.h1`
font-size: 30px;
 font-weight: bold;
 margin: 0;
 `;

const Input = styled.input`
font-size: 14px;
 background-color: #eee;
 border: none;
 padding: 10px 15px;
 margin: 5px 0;
 width: 100%;
 color: black;
 `;


const Button = styled.button`
    border-radius: 20px;
    border: 1px solid #ff4b2b;
    background-color: #ff4b2b;
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
    padding: 12px 45px;
    letter-spacing: 1px;
    text-transform: uppercase;
    transition: transform 80ms ease-in;
    &:active{
        transform: scale(0.95);
    }
    &:focus {
        outline: none;
    }
 `;
const GhostButton = styled(Button)`
 background-color: transparent;
 border-color: #ffffff;
 `;

const Anchor = styled.a`
 color: #333;
 font-size: 14px;
 text-decoration: none;
 margin: 15px 0;
 `;
const OverlayContainer = styled.div`
position: absolute;
top: 0;
left: 50%;
width: 50%;
height: 100%;
overflow: hidden;
transition: transform 0.6s ease-in-out;
z-index: 100;
${props =>
    props.$signinIn !== true ? `transform: translateX(-100%);` : null}
`;

const Overlay = styled.div`
background: #ff416c;
background: -webkit-linear-gradient(to right, #ff4b2b, #ff416c);
background: linear-gradient(to right, #ff4b2b, #ff416c);
background-repeat: no-repeat;
background-size: cover;
background-position: 0 0;
color: #ffffff;
position: relative;
left: -100%;
height: 100%;
width: 200%;
transform: translateX(0);
transition: transform 0.6s ease-in-out;
${props => (props.$signinIn !== true ? `transform: translateX(50%);` : null)}
`;

const OverlayPanel = styled.div`
     position: absolute;
     display: flex;
     align-items: center;
     justify-content: center;
     flex-direction: column;
     padding: 0 40px;
     text-align: center;
     top: 0;
     height: 100%;
     width: 50%;
     transform: translateX(0);
     transition: transform 0.6s ease-in-out;
 `;

const LeftOverlayPanel = styled(OverlayPanel)`
   transform: translateX(-20%);
   ${props => props.$signinIn !== true ? `transform: translateX(0);` : null}
 `;

const RightOverlayPanel = styled(OverlayPanel)`
     right: 0;
     transform: translateX(0);
     ${props => props.$signinIn !== true ? `transform: translateX(20%);` : null}
 `;

const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 100;
  line-height: 20px;
  letter-spacing: 0.5px;
  margin: 20px 0 30px
 `;


export default function Page() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const key = 'updatable';

  const openMessageSuccess = (text) => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type:'success',
        content: text,
        duration: 2,
      });
    }, 500);
  };
  const openMessageError = (text) => {
    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
    setTimeout(() => {
      messageApi.open({
        key,
        type:'error',
        content: text,
        duration: 2,
      });
    }, 500);
  };
  const [formData, setFormData] = useState({
    userName: '',
    passWord: '',
    email: '',
    fullName: '',
    confirmPassWord: '',
  });
  const isPasswordMatch = () => {
    return formData.passWord === formData.confirmPassWord;
  };

  const [signIn, setSignIn] = useState(true);

  const handleToggle = () => {
    setSignIn(!signIn);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!signIn && !isPasswordMatch()) {
        throw new Error('Mật khẩu và xác nhận mật khẩu không khớp!');
      }
      if (!signIn && (!formData.fullName || !formData.email || !formData.userName || !formData.passWord || !formData.confirmPassWord || !isPasswordMatch())) {
        openMessageError('Vui lòng điền đầy đủ tất cả các trường thông tin!');
        return;
      }
      if (signIn && (!formData.email || !formData.passWord)) {
        openMessageError('Vui lòng điền đầy đủ tất cả các trường thông tin!');
        return;
      }
      setLoading(true)
      const url = signIn ? `${config.apiUrl}/admin/login` : `${config.apiUrl}/admin/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      let data = await response.json();
      console.log('data = ',data)
      if(data.statusCode === 201){
        openMessageSuccess('Đăng ký thành công, tự động chuyển trang đăng nhập');
        setSignIn(true);
      } else if (data.statusCode === 200) {
        if (!data.token) {
          throw new Error('Lỗi: Token không được trả về');
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('fullName', data.admin.fullName);
        openMessageSuccess('Đăng nhập thành công, tự động chuyển trang admin');
        router.push('/admin');
      } else if (data.message === 'Bad request') {
        openMessageError('Xin vui lòng điền đầy đủ thông tin');
      }else if (data.message === 'Amin already exists') {
        openMessageError('Email đã tồn tại');
     } else if (data.message === 'Missing email or password') {
        openMessageError('Xin vui lòng điền đầy đủ thông tin');
      } else if (data.message === 'Incorrect UserName or PassWord') {
        openMessageError('Email hoặc mật khẩu không chính xác');
      } else {
        openMessageError('Máy chủ đang bảo trì');
      }
    }
      catch (error) {
      openMessageError(error.message);
    }
  };

const handleDangKy=()=>{
openMessageError('Bạn không được phép sử dụng tính năng này')
}
  return (
    <>{contextHolder}
      <Body>
        <Container>
          <SignUpContainer $signinIn={signIn}>
            <Form onSubmit={handleFormSubmit}>
              <Title>{signIn ? 'Đăng nhập' : 'Tạo tài khoản'}</Title>
              {!signIn && (
                <Input
                  type='fullName'
                  name='fullName'
                  placeholder='Họ và tên'
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              )}
              {!signIn && (
                <Input
                  type='email'
                  name='email'
                  placeholder='Email'
                  value={formData.email}
                  onChange={handleInputChange}
                />
              )}
              <Input
                type='userName'
                name='userName'
                placeholder='Tài khoản'
                value={formData.userName}
                onChange={handleInputChange}
              />
              <Input
                type='passWord'
                name='passWord'
                placeholder='Mật khẩu'
                value={formData.passWord}
                onChange={handleInputChange}
              />
              <Input
                type='password'
                name='confirmPassWord'
                placeholder='Xác nhận lại mật khẩu'
                value={formData.confirmPassWord}
                onChange={handleInputChange}
                style={{ borderColor: isPasswordMatch() ? 'initial' : 'red' }}
              />
              <Button type='submit'>{signIn ? 'Đăng nhập' : 'Đăng ký'}</Button>
              {loading && <p>Loading...</p>}
            </Form>
          </SignUpContainer>
          <SignInContainer $signinIn={signIn}>
            <Form onSubmit={handleFormSubmit}>
              <Title>Đăng nhập</Title>
              <Input
                type='email'
                name='email'
                placeholder='Email'
                value={formData.email}
                onChange={handleInputChange}
              />
              <Input
                type='passWord'
                name='passWord'
                placeholder='Mật khẩu'
                value={formData.passWord}
                onChange={handleInputChange}
              />

              <Anchor href='#'>Quên mật khẩu?</Anchor>
              <Button type='submit'>Đăng nhập</Button>
            </Form>
          </SignInContainer>

          <OverlayContainer $signinIn={signIn}>
            <Overlay $signinIn={signIn}>
              <LeftOverlayPanel $signinIn={signIn}>
                <Title>Chào mừng trở lại!</Title>
                <Paragraph>
                  Để kết nối với chúng tôi, vui lòng đăng nhập bằng thông tin cá nhân của bạn
                </Paragraph>
                <GhostButton onClick={handleToggle}>
                  Đăng nhập
                </GhostButton>
              </LeftOverlayPanel>

              <RightOverlayPanel $signinIn={signIn}>
                <Title>Xin chào, bạn!</Title>
                <Paragraph>
                  Nhập thông tin cá nhân của bạn và bắt đầu cuộc hành trình cùng chúng tôi
                </Paragraph>
                <GhostButton onClick={handleToggle}>
                  Đăng ký
                </GhostButton>
              </RightOverlayPanel>
            </Overlay>
          </OverlayContainer>
        </Container>
      </Body>
    </>
  );
}


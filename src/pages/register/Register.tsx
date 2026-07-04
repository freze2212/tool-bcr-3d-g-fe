import axios from "axios";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Form } from "antd";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import CyberModal, {
  CyberInputField,
  CyberSubmitButton,
  CyberModalFooter,
} from "../../components/CyberModal/CyberModal";
import {
  IconUser,
  IconPhone,
  IconLock,
} from "../../components/CyberModal/CyberIcons";

const DEFAULT_MANAGED_BY = "superadmin";

interface IProps {
  isRegister: boolean;
  setIsRegister: () => void;
  setIsShowLogin: () => void;
}

const schema = yup.object().shape({
  username: yup.string().required("Tên tài khoản bắt buộc"),
  phone_number: yup
    .string()
    .matches(/^\d{10}$/, "Số điện thoại phải có 10 chữ số")
    .required("Số điện thoại bắt buộc"),
  password: yup.string().min(6, "Mật khẩu ít nhất 6 ký tự").required(),
});

const Register: React.FC<IProps> = ({
  isRegister,
  setIsRegister,
  setIsShowLogin,
}) => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleRegister = async (data: {
    username: string;
    phone_number: string;
    password: string;
  }) => {
    try {
      Swal.fire({
        title: "Đang xử lý...",
        text: "Vui lòng đợi giây lát",
        customClass: {
          popup: "custom-swal",
          title: "custom-title",
          htmlContainer: "custom-text",
        },
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await axios
        .post(`${process.env.REACT_APP_URL_API}/auth/register`, {
          username: data.username,
          managedByUsername: DEFAULT_MANAGED_BY,
          phone: data.phone_number,
          password: String(data.password),
        })
        .then((res) => {
          if (res.status === 201) {
            Swal.fire({
              icon: "success",
              title: "Đăng ký thành công",
              text: "Vui lòng đợi ít phút. ",
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
                htmlContainer: "custom-text",
              },
            });
            setIsRegister();
            setIsShowLogin();
            reset();
          }
        })
        .catch((err) => {
          if (
            err.response?.data?.message?.[0] ===
            "managedBy must be a mongodb id"
          ) {
            Swal.fire({
              icon: "error",
              title: "Lỗi đăng ký",
              text: "Thông tin đại lý chưa chính xác!",
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
                htmlContainer: "custom-text",
              },
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Lỗi đăng ký",
              text: `${err.response?.data?.message ?? "Đăng ký thất bại"}`,
              customClass: {
                popup: "custom-swal",
                title: "custom-title",
                htmlContainer: "custom-text",
              },
            });
          }
        });
    } catch (error) {
      return error;
    }
  };

  return (
    <CyberModal
      isOpen={isRegister}
      onClose={setIsRegister}
      title="ĐĂNG KÝ TÀI KHOẢN"
      subtitle="TẠO TÀI KHOẢN MỚI ĐỂ BẮT ĐẦU"
    >
      <Form id="regisform" onFinish={handleSubmit(handleRegister)}>
        <Form.Item
          validateStatus={errors.username ? "error" : ""}
          help={errors.username?.message}
        >
          <CyberInputField icon={<IconUser />}>
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="cyber-input"
                  placeholder="Tên tài khoản"
                  bordered={false}
                />
              )}
            />
          </CyberInputField>
        </Form.Item>

        <Form.Item
          validateStatus={errors.phone_number ? "error" : ""}
          help={errors.phone_number?.message}
        >
          <CyberInputField icon={<IconPhone />}>
            <Controller
              name="phone_number"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  className="cyber-input"
                  placeholder="Số điện thoại"
                  maxLength={10}
                  bordered={false}
                />
              )}
            />
          </CyberInputField>
        </Form.Item>

        <Form.Item
          validateStatus={errors.password ? "error" : ""}
          help={errors.password?.message}
        >
          <CyberInputField icon={<IconLock />}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="password"
                  className="cyber-input"
                  placeholder="Mật khẩu"
                  bordered={false}
                />
              )}
            />
          </CyberInputField>
        </Form.Item>

        <CyberSubmitButton label="ĐĂNG KÝ NGAY" />
      </Form>

      <CyberModalFooter
        text="ĐÃ CÓ TÀI KHOẢN?"
        linkText="ĐĂNG NHẬP NGAY"
        onLinkClick={() => {
          setIsRegister();
          setIsShowLogin();
        }}
      />
    </CyberModal>
  );
};

export default Register;

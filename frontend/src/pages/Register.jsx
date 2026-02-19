import { useForm } from "react-hook-form";
import { Lock, User, LogIn, GraduationCap, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "./Subject";
import Swal from "sweetalert2";

const THAI_NAME_REGEX = /^[ก-๙\s]+$/;
const STUDENT_ID_REGEX = /^\d{12}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9]{6,}$/;
const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{6,}$/;

function Register() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/create-std`, data);
      if (res.data.err)
        return Swal.fire(res.data.err, "ไม่สามารถลงทะเบียนได้", "error");

      Swal.fire("ลงทะเบียนสำเร็จ", "โปรดเข้าสู่ระบบ", "success");
      reset();
    } catch (err) {
      console.error(err);
      Swal.fire("ตรวจสอบเครือข่ายแล้วลองอีกครั้ง", "", "error");
    }
  };

  const inputClass = (error) =>
    `w-full p-3 rounded-xl bg-white/90 text-gray-800 outline-none text-sm
     ${error ? "ring-2 ring-red-400" : "focus:ring-2 focus:ring-emerald-400"}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-6">
          ลงทะเบียนผู้ใช้ใหม่
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ชื่อ-นามสกุล */}
          <div>
            <label className="text-white text-sm mb-1 block">
              ชื่อ-นามสกุล
            </label>
            <input
              className={inputClass(errors.fullName)}
              placeholder="นายสมชาย ใจดี"
              {...register("fullName", {
                required: "กรุณากรอกชื่อ-นามสกุล",
                pattern: {
                  value: THAI_NAME_REGEX,
                  message: "ต้องเป็นภาษาไทยเท่านั้น",
                },
              })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* รหัสนักศึกษา */}
          <div>
            <label className="text-white text-sm mb-1 block">
              รหัสนักศึกษา
            </label>
            <input
              className={inputClass(errors.studentId)}
              placeholder="663170010324"
              {...register("studentId", {
                required: "กรุณากรอกรหัสนักศึกษา",
                pattern: {
                  value: STUDENT_ID_REGEX,
                  message: "ต้องเป็นตัวเลข 12 หลักเท่านั้น",
                },
              })}
            />
            {errors.studentId && (
              <p className="text-red-400 text-xs mt-1">
                {errors.studentId.message}
              </p>
            )}
          </div>

          {/* Username */}
          <div>
            <label className="text-white text-sm mb-1 block">ชื่อผู้ใช้</label>
            <input
              className={inputClass(errors.username)}
              placeholder="username123"
              {...register("username", {
                required: "กรุณากรอกชื่อผู้ใช้",
                pattern: {
                  value: USERNAME_REGEX,
                  message: "ใช้ได้เฉพาะ a-z, A-Z, 0-9 และ ≥ 6 ตัว",
                },
              })}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-white text-sm mb-1 block">รหัสผ่าน</label>
            <input
              type="password"
              className={inputClass(errors.password)}
              placeholder="อย่างน้อย 6 ตัวอักษร"
              {...register("password", {
                required: "กรุณากรอกรหัสผ่าน",
                pattern: {
                  value: PASSWORD_REGEX,
                  message: "ต้องมีตัวอักษร ตัวเลข และอักขระพิเศษ",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-white text-sm mb-1 block">
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              placeholder="ยืนยันรหัสผ่านอีกครั้ง"
              className={inputClass(errors.confirmPassword)}
              {...register("confirmPassword", {
                required: "กรุณายืนยันรหัสผ่าน",
                validate: (v) => v === watch("password") || "รหัสผ่านไม่ตรงกัน",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold"
          >
            {isSubmitting ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
          </button>
        </form>

        <p className="text-center text-white/70 text-sm mt-4">
          มีบัญชีแล้ว?{" "}
          <Link to="/" className="text-emerald-300 underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;

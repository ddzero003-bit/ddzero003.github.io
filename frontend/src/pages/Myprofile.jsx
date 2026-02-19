import { useEffect, useState } from "react";
import {
  User,
  Save,
  Edit2,
  Home,
  BookOpen,
  CreditCard,
  CheckCircle,
  XCircle,
  Sparkles,
  Camera,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "./Subject";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import Swal from "sweetalert2"; // 1. เพิ่มบรรทัดนี้

export default function MyProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({});
  const [load, setLoad] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const getData = async () => {
    try {
      const tokenString = localStorage.getItem("loginToken");
      if (!tokenString) {
        navigate("/");
        return;
      }
      
      const data = JSON.parse(tokenString).data;
      if (!data) return navigate("/");

      const res = await axios.get(`${API_URL}/students/${data?.student_id}`);
      
      setFormData({
        student_id: res.data?.data?.student_id,
        fullname: res.data?.data?.fullname,
        major: res.data?.data?.major,
        std_class_id: res?.data?.data?.std_class_id,
      });

      const savedImage = localStorage.getItem(`profile_image_${data?.student_id}`);
      if (savedImage) {
        setPreviewImage(savedImage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("ไฟล์ใหญ่เกินไป", "ขนาดไฟล์ต้องไม่เกิน 5MB", "warning"); // ใช้ Swal แทน alert
        return;
      }
      
      if (!file.type.startsWith("image/")) {
        Swal.fire("ไฟล์ไม่ถูกต้อง", "กรุณาเลือกไฟล์รูปภาพเท่านั้น", "warning");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. แก้ไขฟังก์ชันนี้
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2.1 แสดง Popup ถามยืนยัน
    const result = await Swal.fire({
        title: 'ยืนยันการบันทึก?',
        text: "คุณต้องการบันทึกการเปลี่ยนแปลงใช่หรือไม่",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#7c3aed', // สีม่วงให้เข้ากับธีม
        cancelButtonColor: '#d33',
        confirmButtonText: 'ใช่, บันทึกเลย',
        cancelButtonText: 'ยกเลิก'
    });

    // ถ้ากด "ยกเลิก" ให้จบฟังก์ชันทันที
    if (!result.isConfirmed) return;

    setLoading(true);
    setMessage("");

    try {
      await axios.put(
        `${API_URL}/students/${formData.student_id}`,
        formData
      );
      
      if (previewImage) {
        const data = JSON.parse(localStorage.getItem("loginToken")).data;
        try {
            localStorage.setItem(`profile_image_${data?.student_id}`, previewImage);
        } catch (err) {
            console.warn("Local storage full", err);
            Swal.fire("แจ้งเตือน", "บันทึกข้อมูลสำเร็จ แต่ไม่สามารถบันทึกรูปภาพได้เนื่องจากพื้นที่เต็ม", "warning");
        }
      }
      
      // 2.2 แสดง Popup สำเร็จ
      await Swal.fire({
          icon: 'success',
          title: 'บันทึกสำเร็จ!',
          text: 'ข้อมูลของคุณถูกอัปเดตเรียบร้อยแล้ว',
          confirmButtonColor: '#7c3aed',
          timer: 2000
      });

      setMessage("success"); // (เผื่ออยากแสดงแถบสีเขียวเดิมด้วย)
      setIsEditing(false);
      getData();
      
    } catch (error) {
      console.error("Error:", error);
      // 2.3 แสดง Popup Error
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่',
        confirmButtonColor: '#7c3aed',
      });
      setMessage("error");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (load) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-4 border-violet-200"></div>
            <div className="absolute top-0 left-0 inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-violet-600"></div>
          </div>
          <p className="text-xl text-gray-700 font-semibold mt-6 animate-pulse">
            กำลังโหลดข้อมูล...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50">
      <Header />
      
      <div className="pt-28 pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Navigation Bar */}
          <div className="mb-8 flex items-center justify-between backdrop-blur-sm bg-white/60 rounded-2xl p-4 shadow-lg border border-white/20">
            <Link
              to="/dashboard"
              className="group flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-violet-300 hover:scale-105"
            >
              <Home className="w-5 h-5 group-hover:text-violet-600 transition-colors" />
              <span className="font-medium">หน้าหลัก</span>
            </Link>

            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="group flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Edit2 className="w-5 h-5 relative z-10" />
                <span className="font-medium relative z-10">แก้ไขข้อมูล</span>
              </button>
            )}
          </div>

          {/* ยังคงเก็บ Message bar ไว้ (ถ้าต้องการเอาออกก็ลบส่วนนี้ทิ้งได้เลย) */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-2xl backdrop-blur-sm border-2 flex items-center gap-3 animate-in slide-in-from-top-5 duration-500 ${
                message === "success"
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-700"
                  : "bg-rose-50/80 border-rose-300 text-rose-700"
              }`}
            >
              {message === "success" ? (
                <CheckCircle className="w-6 h-6 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 flex-shrink-0" />
              )}
              <p className="font-medium">
                {message === "success"
                  ? "บันทึกข้อมูลสำเร็จ!"
                  : "เกิดข้อผิดพลาดในการบันทึกข้อมูล"}
              </p>
            </div>
          )}

          {/* Main Profile Card */}
          <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 hover:shadow-violet-200/50 transition-shadow duration-500 relative mt-24">
            {/* Header with Animated Gradient */}
            <div className="relative bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 h-56 rounded-t-3xl">
              {/* ... (ส่วนกราฟิกเดิม) ... */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent)] animate-pulse"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
              <div className="absolute top-0 left-0 w-96 h-96 bg-violet-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

              {/* Profile Picture Container */}
              <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                  <div className="relative w-40 h-40 rounded-full border-8 border-white shadow-2xl bg-gradient-to-br from-violet-100 via-purple-100 to-indigo-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-violet-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>
                  </div>
                  
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-4 border-white">
                      <Camera className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  
                  {!isEditing && (
                    <div className="absolute bottom-3 right-3 w-7 h-7 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                  )}
                  
                  {!isEditing && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full p-2 shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="pt-24 px-8 pb-8">
              {/* Title Section */}
              <div className="text-center mb-10">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  ข้อมูลโปรไฟล์
                </h1>
                <p className="text-gray-600 text-lg">
                  จัดการข้อมูลส่วนตัวของคุณ
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-violet-50 rounded-full border border-violet-200">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600 font-medium">
                    โปรไฟล์ใช้งานได้
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6 max-w-2xl mx-auto">
                {/* Student ID Field */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <div className="p-1.5 bg-violet-100 rounded-lg">
                      <CreditCard className="w-4 h-4 text-violet-600" />
                    </div>
                    รหัสนักศึกษา
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="std_class_id"
                      value={formData.std_class_id || formData.student_id || ""}
                      disabled
                      className="w-full px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed font-medium"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-200 rounded-lg text-xs font-medium text-gray-600">
                      ไม่สามารถแก้ไข
                    </div>
                  </div>
                </div>

                {/* Full Name Field */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <div className="p-1.5 bg-violet-100 rounded-lg">
                      <User className="w-4 h-4 text-violet-600" />
                    </div>
                    ชื่อ-นามสกุล
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="fullname"
                      value={formData.fullname || ""}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-800 font-medium hover:border-violet-400"
                      placeholder="กรอกชื่อ-นามสกุล"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-xl group-hover:shadow-md transition-all duration-300">
                      <p className="text-gray-800 font-semibold text-lg">
                        {formData.fullname}
                      </p>
                    </div>
                  )}
                </div>

                {/* Major Field */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <div className="p-1.5 bg-violet-100 rounded-lg">
                      <BookOpen className="w-4 h-4 text-violet-600" />
                    </div>
                    สาขาวิชา
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="major"
                      value={formData.major || ""}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-white border-2 border-gray-300 rounded-xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 transition-all outline-none text-gray-800 font-medium hover:border-violet-400"
                      placeholder="กรอกสาขาวิชา"
                    />
                  ) : (
                    <div className="px-5 py-4 bg-gradient-to-r from-violet-50 to-purple-50 border-2 border-violet-200 rounded-xl group-hover:shadow-md transition-all duration-300">
                      <p className="text-gray-800 font-semibold text-lg">
                        {formData.major}
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-4 pt-8">
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        getData();
                      }}
                      className="flex-1 px-6 py-4 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold border-2 border-gray-300 hover:border-gray-400 hover:shadow-lg"
                      disabled={loading}
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                      disabled={loading}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <Save className="w-5 h-5 relative z-10" />
                      <span className="relative z-10">
                        {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full shadow-lg border border-white/20">
              <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
              <p className="text-gray-600 text-sm font-medium">
                กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนบันทึก
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
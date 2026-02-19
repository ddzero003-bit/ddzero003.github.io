import { useEffect, useState } from "react";
import { User, Phone, IdCard, Lock, Mail, Building2, Edit3, Save, X, Loader2 } from "lucide-react";
import Footer from "../components/footer";
import Header from "../components/header";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "./Subject";

export default function ProfessorProfile() {
  const [isEdit, setIsEdit] = useState(false);
  const [professor, setProfessor] = useState({});
  const [formData, setFormData] = useState({});
  const [load, setLoad] = useState(false);

  const getProfessor = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("loginToken")).data;
      const res = await axios.get(API_URL + `/get-professor/${token.id}`);
      setProfessor(res.data.data);
      setFormData(res.data.data);
    } catch (error) {
      console.error(error);
      Swal.fire("โปรดตรวจสอบเครือข่ายแล้วลองอีกครั้ง", "", "error");
    }
  };

  useEffect(() => {
    getProfessor();
  }, []);

  const handleEdit = () => {
    setFormData(professor);
    setIsEdit(true);
  };

  const handleCancel = () => {
    setFormData(professor);
    setIsEdit(false);
  };

  const handleSave = async () => {
    setLoad(true);
    try {
      const token = JSON.parse(localStorage.getItem("loginToken")).data;
      const res = await axios.put(
        API_URL + `/update-professor/${token.id}`,
        formData,
      );
      if (res.data.err) {
        return Swal.fire(res.data.err, "", "warning");
      }

      if (res.status === 200) {
        Swal.fire("บันทึกข้อมูลสำเร็จ", "", "success");
        setProfessor(formData);
        setIsEdit(false);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("โปรดตรวจสอบเครือข่าย", "", "error");
    } finally {
      setLoad(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
            <div className="relative h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute -bottom-16 left-8 flex items-end gap-6">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                  <User className="w-16 h-16 text-indigo-600" strokeWidth={1.5} />
                </div>
                <div className="pb-4 text-white drop-shadow-lg">
                  <h1 className="text-3xl font-bold drop-shadow-lg">
                    {professor?.fullname || "กำลังโหลด..."}
                  </h1>
                  <p className="text-blue-500 flex items-center gap-2 mt-1">
                    <Building2 className="w-4 h-4" />
                    อาจารย์ประจำภาควิชา
                  </p>
                </div>
              </div>
            </div>
            <div className="h-20">
              
            </div>
            
            {/* Action Buttons */}
            <div className="px-8 pb-6 flex justify-end gap-3">
              {!isEdit ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  <Edit3 className="w-4 h-4" />
                  แก้ไขข้อมูล
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium"
                  >
                    <X className="w-4 h-4" />
                    ยกเลิก
                  </button>
                  <button
                    disabled={load}
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium disabled:opacity-50"
                  >
                    {load ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    {load ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">ข้อมูลส่วนตัว</h2>
              </div>

              <ProfileField
                icon={<User className="w-5 h-5" />}
                label="ชื่อ-นามสกุล"
                value={formData.fullname || professor?.fullname}
                isEdit={isEdit}
                onChange={(v) => setFormData({ ...formData, fullname: v })}
                placeholder="กรอกชื่อ-นามสกุล"
              />

              <ProfileField
                icon={<Phone className="w-5 h-5" />}
                label="หมายเลขโทรศัพท์"
                value={formData.tel || professor?.tel}
                isEdit={isEdit}
                onChange={(v) => setFormData({ ...formData, tel: v })}
                placeholder="0XX-XXX-XXXX"
              />
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">ข้อมูลบัญชี</h2>
              </div>

              <ProfileField
                icon={<IdCard className="w-5 h-5" />}
                label="ชื่อผู้ใช้งาน"
                value={professor?.username}
                disabled
              />

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Lock className="w-5 h-5 text-gray-400" />
                  รหัสผ่าน
                </label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex-1">
                    <p className="text-gray-400 tracking-widest">••••••••••••</p>
                  </div>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    เปลี่ยนรหัสผ่าน
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 mt-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">ต้องการความช่วยเหลือ?</h3>
                <p className="text-sm text-gray-600">
                  หากมีปัญหาในการใช้งานหรือต้องการเปลี่ยนแปลงข้อมูลที่ไม่สามารถแก้ไขได้ กรุณาติดต่อแผนกทะเบียน
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

/* ---------- Reusable Component ---------- */
function ProfileField({
  icon,
  label,
  value,
  isEdit,
  onChange,
  disabled = false,
  placeholder = "",
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
        <span className="text-gray-400">{icon}</span>
        {label}
      </label>

      {isEdit && !disabled ? (
        <input
          type="text"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
        />
      ) : (
        <div className={`px-4 py-3 rounded-xl border ${disabled ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>
            {value || "-"}
          </p>
        </div>
      )}
    </div>
  );
}
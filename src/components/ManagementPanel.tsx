import { type ChangeEvent, useEffect, useState } from "react";
import { useManagementStore } from "../stores/managementStore";
import type { Department } from "../types";

const ManagementPanel = () => {
  const {
    departments,
    employees,
    fetchDepartments,
    fetchEmployeesByDepartment,
    createDepartment,
    deleteDepartment,
    createEmployee,
    deleteEmployee,
    clearEmployees,
  } = useManagementStore();

  const [deptName, setDeptName] = useState("");
  const [deptLocation, setDeptLocation] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employeeEmail, setEmployeeEmail] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const [departmentsLoading, setDepartmentsLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false);
  const [managementError, setManagementError] = useState("");

  useEffect(() => {
    if (departments.length === 0) {
      setDepartmentsLoading(true);
      fetchDepartments()
        .catch((requestError) => {
          setManagementError(
            requestError instanceof Error
              ? requestError.message
              : "Departmanlar yüklenemedi."
          );
        })
        .finally(() => {
          setDepartmentsLoading(false);
        });
    }
  }, [departments.length, fetchDepartments]);

  const buildFallbackDepartment = (departmentId: string): Department => ({
    id: Number(departmentId) || 0,
    deptName: "-",
    location: "",
    employees: [],
  });

  const handleDepartmentChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const departmentId = event.target.value;
    setSelectedDepartmentId(departmentId);
    setEmployeesLoading(true);
    setManagementError("");

    if (!departmentId) {
      clearEmployees();
      setEmployeesLoading(false);
      return;
    }

    try {
      await fetchEmployeesByDepartment(departmentId);
    } catch (requestError) {
      setManagementError(
        requestError instanceof Error
          ? requestError.message
          : "Personel listesi yüklenemedi."
      );
    } finally {
      setEmployeesLoading(false);
    }
  };

  const handleCreateDepartment = async () => {
    if (!deptName.trim()) {
      setManagementError("Departman adı zorunludur.");
      return;
    }
    setManagementError("");
    try {
      await createDepartment({
        deptName: deptName.trim(),
        location: deptLocation.trim(),
      });
      setDeptName("");
      setDeptLocation("");
    } catch (requestError) {
      setManagementError(
        requestError instanceof Error
          ? requestError.message
          : "Departman oluşturulamadı."
      );
    }
  };

  const handleDeleteDepartment = async (departmentId: number) => {
    setManagementError("");
    try {
      await deleteDepartment(departmentId);
    } catch (requestError) {
      setManagementError(
        requestError instanceof Error
          ? requestError.message
          : "Departman silinemedi."
      );
    }
  };

  const handleCreateEmployee = async () => {
    if (!employeeName.trim() || !employeeEmail.trim()) {
      setManagementError("Personel adı ve e-posta zorunludur.");
      return;
    }
    if (!selectedDepartmentId) {
      setManagementError("Personel için departman seçmelisin.");
      return;
    }
    setManagementError("");
    try {
      const department =
        departments.find((item) => String(item.id) === selectedDepartmentId) ??
        buildFallbackDepartment(selectedDepartmentId);
      await createEmployee({
        fullName: employeeName.trim(),
        email: employeeEmail.trim(),
        departmentId: department.id,
        department,
      });
      setEmployeeName("");
      setEmployeeEmail("");
      await fetchEmployeesByDepartment(selectedDepartmentId);
    } catch (requestError) {
      setManagementError(
        requestError instanceof Error
          ? requestError.message
          : "Personel oluşturulamadı."
      );
    }
  };

  const handleDeleteEmployee = async (employeeId: number) => {
    setManagementError("");
    try {
      await deleteEmployee(employeeId);
    } catch (requestError) {
      setManagementError(
        requestError instanceof Error
          ? requestError.message
          : "Personel silinemedi."
      );
    }
  };

  return (
    <section className="rounded-3xl bg-white/85 p-6 shadow-[0_30px_80px_rgba(23,23,23,0.12)] backdrop-blur-xl">
      <div>
        <h2 className="m-0 text-xl font-semibold">Yönetim Paneli</h2>
        <p className="m-0 text-sm text-[#5c6666]">
          Departman ve personel ekleme/silme işlemlerini yönetin.
        </p>
      </div>

      {managementError ? (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-700">
          {managementError}
        </p>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-900/10 bg-white p-5">
          <h3 className="m-0 text-lg font-semibold">Departmanlar</h3>
          <div className="mt-4 grid gap-3">
            <input
              type="text"
              value={deptName}
              onChange={(event) => setDeptName(event.target.value)}
              placeholder="Departman adı"
              className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <input
              type="text"
              value={deptLocation}
              onChange={(event) => setDeptLocation(event.target.value)}
              placeholder="Lokasyon"
              className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <button
              type="button"
              onClick={handleCreateDepartment}
              className="rounded-full bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-500/30"
            >
              Departman Ekle
            </button>
          </div>

          <ul className="mt-5 space-y-3">
            {departments.map((department) => (
              <li
                key={department.id}
                className="flex items-center justify-between rounded-xl border border-slate-900/10 px-4 py-3 text-sm"
              >
                <div>
                  <p className="m-0 font-semibold text-[#1b1f1f]">
                    {department.deptName}
                  </p>
                  <p className="m-0 text-xs text-[#5c6666]">
                    {department.location || "Lokasyon belirtilmedi"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteDepartment(department.id)}
                  className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/25"
                >
                  Sil
                </button>
              </li>
            ))}
            {departments.length === 0 && !departmentsLoading ? (
              <li className="rounded-xl border border-dashed border-slate-900/10 px-4 py-6 text-center text-sm text-[#5c6666]">
                Henüz departman yok.
              </li>
            ) : null}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-900/10 bg-white p-5">
          <h3 className="m-0 text-lg font-semibold">Personel</h3>
          <div className="mt-4 grid gap-3">
            <select
              value={selectedDepartmentId}
              onChange={handleDepartmentChange}
              className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="">
                {departmentsLoading
                  ? "Departmanlar yükleniyor..."
                  : "Departman seç"}
              </option>
              {departments.length === 0 ? (
                <option value="" disabled>
                  Departman yok
                </option>
              ) : null}
              {departments.map((department) => (
                <option key={department.id} value={String(department.id)}>
                  {department.deptName}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={employeeName}
              onChange={(event) => setEmployeeName(event.target.value)}
              placeholder="Personel adı"
              className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <input
              type="email"
              value={employeeEmail}
              onChange={(event) => setEmployeeEmail(event.target.value)}
              placeholder="E-posta"
              className="rounded-lg border border-slate-900/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            />
            <button
              type="button"
              onClick={handleCreateEmployee}
              className="rounded-full bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-500/30"
            >
              Personel Ekle
            </button>
          </div>

          <ul className="mt-5 space-y-3">
            {!selectedDepartmentId ? (
              <li className="rounded-xl border border-dashed border-slate-900/10 px-4 py-6 text-center text-sm text-[#5c6666]">
                Personel görmek için departman seçin.
              </li>
            ) : (
              <>
                {employees.map((employee) => (
                  <li
                    key={employee.id}
                    className="flex items-center justify-between rounded-xl border border-slate-900/10 px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="m-0 font-semibold text-[#1b1f1f]">
                        {employee.fullName}
                      </p>
                      <p className="m-0 text-xs text-[#5c6666]">
                        {employee.email}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/25"
                    >
                      Sil
                    </button>
                  </li>
                ))}
                {employees.length === 0 && !employeesLoading ? (
                  <li className="rounded-xl border border-dashed border-slate-900/10 px-4 py-6 text-center text-sm text-[#5c6666]">
                    Bu departmanda personel yok.
                  </li>
                ) : null}
              </>
            )}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ManagementPanel;
